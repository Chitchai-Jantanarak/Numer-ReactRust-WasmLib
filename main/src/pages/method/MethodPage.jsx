/**
 * MethodPage Page's Component
 * --------------------
 * This component serves as a core dynamic page for rendering various methods,
 * managing their inputs, loading example data, and displaying results from WebAssembly calls.
 *
 * Role:
 * - Acts as a *reusable* execution UI for different methods.
 *           a *receptor* what are handling where setting by configs.
 * - Foucs on integration via callbacks & external parameters for variants reusing.
 *
 * Props:
 * - methodName (string)                        : Head of topic.
 * - methodSchema (object <inputSchemas>)       : Defines the input fields, sizes, and types required for the method.
 * - exampleSchema (object: <exampleSchemas>)   : Provides example input data into the form.
 * - ioSchema (object: <ioSchemas>)             : Defines input/output parameter mapping and the WASM function to call.
 * - externalParams (object: <Param: Pages)     : Additional parameters inputs mapped to WASM function (Set as page hooks).
 * - onInput (function: <CallBack: Pages)       : *Optional Callback* called whenever user input changes (before calculation).
 * - onResult (function: <Callback: Pages>)     : *Optional Callback* called after WASM calculation returns a result.
 * - useSizeIndicators (boolean)                : If true, size is managed internally.
 * - itemVariants (object: <CpnTransition>)     : Animation configuration for UI transitions and effects.
 */


import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react"
import * as wasm from "../../wasm/cal_core.js"

import { ParamInput } from "../../components/inputs/ParamInput.jsx";
import {OutputPanel} from "../../components/outputs/OutputPanel.jsx";
import CpnTranstition from "../../components/transition/CpnTransition.jsx"


const MethodPage = ({
    methodName,
    methodSchema,
    exampleSchema,
    ioSchema,
    externalParams,
    onInput,
    onResult,
    useSizeIndicators,
    itemVariants
}) => {
    const [size, setSize] = useState(methodSchema.size?.min || 0);
    const [values, setValues] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const hasLoadedExample = useRef(false);
    const isResetting = useRef(false);
    const resultRef = useRef(null);


    // #region - Input form implementations

    useEffect(() => {
      requestIdleCallback(() => {
        if (exampleSchema?.examples?.length > 0 && !hasLoadedExample.current) {
          const randomExample = exampleSchema.examples[
            Math.floor(Math.random() * exampleSchema.examples.length)
          ];
          loadExample(randomExample);
        } else {
          resetToDefault();
        }
        setInitialized(true);
      });
    }, []);

    useEffect(() => {
      if (!initialized) return;

      if (!hasLoadedExample.current) {
        resetToDefault();
      } else {
        hasLoadedExample.current = false;
      }
    }, [size, initialized])

    const resetToDefault = () => {
        isResetting.current = true;

        const defaultValues = {};

        Object.entries(methodSchema.inputs).forEach(([name, input]) => {
            // Shape is fn especially null fn ( () => null )
            const shape = typeof input.shape === "function" ? input.shape(size) : null;
            // is Matrix (2D based)
            const isMat = Array.isArray(shape) && shape.length === 2;
            
            if (isMat) {
                const [r, c] = shape;
                defaultValues[name] = Array.from({ length: r }, () => 
                    Array.from({ length: c }, () => (input.type === "number" ? 0 : ""))
                );
            }
            else {
                defaultValues[name] = input.type === "number"
                    ? input.min > 0 ? input.min : 0
                    : input.type === "string"
                    ? ""
                    : input.type === "select" && input.options?.length > 0
                    ? input.options[0].values 
                    : null;
            }
        })

        setValues(defaultValues);
        setResult(null);
        setError(null);

        setTimeout(() => {
          isResetting.current = false;
        }, 200);
    }

    const loadExample = (example) => {
        if (!example?.inputs) return new Error("Invalid example: ", example);
        
        hasLoadedExample.current = true;
        // Is Shape Defined get the depth of size
        const sizeDepInput = Object.entries(methodSchema.inputs).find(([_, input]) => {
            const shape = input.shape && typeof input.shape === "function" ? input.shape(1) : null;
            return shape && Array.isArray(shape);
        })

        
        if (sizeDepInput) {
          const [name] = sizeDepInput;
          const inputData = example.inputs[name];
          
          if (Array.isArray(inputData)) {
            const shape = methodSchema.inputs[name].shape(0);
            let exampleSize;
            if (shape[0] === 1) {
                exampleSize = inputData[0]?.length ?? 0;
            } else if (shape[1] === 1) {
                exampleSize = inputData.length;
            } else if (shape[0] === shape[1]) {
                exampleSize = inputData.length;
            } else {
                return new Error(`Unformatted 2D shape: ${shape}`);
            }

            if (Number.isInteger(exampleSize) && exampleSize > 0) {
                setSize(exampleSize);
            }
          }  
        }

        const newValues = { ...example.inputs };
        
        setValues(newValues);
        setResult(null);
        setError(null);
    }

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setResult(null);
    }

    const handleExampleClick = (example) => {
        loadExample(example);
    };

    const handleValuesChange = (newValues) => {
        setValues(newValues);
        setResult(null);
    }

    // #endregion

    // #region - WASM data preparations, calculations

    const flattenToFloat64Array = ( mat ) => {
        const flat = [];
        const flatten = (arr) => {
            for (const item of arr) {
                Array.isArray(item) ? flatten(item) : flat.push(item);
            }
        }

        flatten(mat);
        return new Float64Array(flat);
    }

    const alignWASMparams = (ioSchema, values, externalParams) => {
        const params = {...values, ...externalParams};
        const { inputs, map = {} } = ioSchema;
         
        const aligned = [];
        
        for (const inputKey of inputs) {
            const actualKey = map[inputKey] || inputKey;

            if (!(actualKey in params)) {
                throw new Error(`Missing param : "${actualKey}"`);
            }

            let val = params[actualKey];
            if (Array.isArray(val)) {
                val = flattenToFloat64Array(val);
            }

            aligned.push(val);
        }

        return aligned;
    }

    const calculateResult = async () => {
        setLoading(true);
        setError(null);

        try {
          const paramsObj = useSizeIndicators ? values : { ...values, size };

          // Call-back for external params
          if (onInput) {
            externalParams = onInput(paramsObj);
          }

          // Extract input params order based on ioSchema
          const params = alignWASMparams(ioSchema, paramsObj, externalParams);          
          
          // Call WASM
          const wasmFn = ioSchema.fn;
          const result = await wasm[wasmFn](...params);

          console.log(wasm[wasmFn]);
          console.log(result);
          
          
          setResult(result);
          
          if (onResult) onResult(result);
        }
        catch (err) {
            throw new Error(err.toString());
        }
        finally {
            setLoading(false);
        }
    }

    // #endregion

    // #region - Output renderer Helper function

    useEffect(() => {
      if (result && resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [result]);

    // #endregion

    if (!initialized) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 uppercase">{methodName || "Loading..."}</h1>
          <div>Loading...</div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6">

        {/* HEADER */}
        <motion.div variants={itemVariants} initial={false}>
          <h1 className="text-2xl font-bold mb-6 uppercase">{methodName}</h1>

          {/* Examples section - only show if examples exist */}
          {exampleSchema?.examples?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Examples</h2>
              <div className="flex flex-wrap gap-2">
                {exampleSchema.examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-800 text-sm"
                  >
                    {example.name}
                  </button>
                ))}
                <button
                  onClick={resetToDefault}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* INPUT */}
        <motion.div variants={itemVariants} initial={false}>
          <div className="p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-lg font-semibold mb-4">Input Parameters</h2>
            <ParamInput
              param={{
                size: methodSchema.size,
                inputs: methodSchema.inputs,
                currentSize: size,
                onSizeChange: handleSizeChange,
              }}
              values={values}
              onChange={handleValuesChange}
            />
            <div className="pt-10">
              <button
                onClick={calculateResult}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Calculating..." : "Calculate"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* OUTPUT */}
        <motion.div variants={itemVariants} initial={false}>
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Results section */}
          {result && (
            <div ref={resultRef} className="p-6 rounded-lg shadow-sm border">
              {ioSchema.display && typeof(result) === "object" ? (
                <OutputPanel 
                  topic={ioSchema.fn} 
                  ioDisplay={ioSchema.display} 
                  result={result}  
                />
              ) : (
                <pre className="whitespace-pre-wrap break-words text-error">
                  {JSON.stringify(result, null, 2)}
                </pre> 
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
}

export default CpnTranstition(MethodPage);