import { useState, useEffect, useRef } from "react";
import { ParamInput } from "../../components/inputs/ParamInput.jsx";
import katex from "katex"
import 'katex/dist/katex.min.css';
import * as wasm from "../../wasm/cal_core.js"
import OutputPanel from "../../components/outputs/OutputPanel.jsx";

const MethodPage = ({
    methodName,
    methodSchema,
    exampleSchema,
    ioSchema,
    externalParams,
    onInput,
    onResult,
    useSizeIndicators
}) => {
    const [size, setSize] = useState(methodSchema.size?.min || 0);
    const [values, setValues] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const hasLoadedExample = useRef(false);
    const isResetting = useRef(false);

    // #region - Input form implementations

    useEffect(() => {
      if (exampleSchema?.examples?.length > 0 && !hasLoadedExample.current) {
        const randomExample = exampleSchema.examples[
          Math.floor(Math.random() * exampleSchema.examples.length)
        ];
        loadExample(randomExample);
      } else {
        resetToDefault();
      }
      setInitialized(true);
    }, []);

    useEffect(() => {
      if (!initialized) return;

      if (!hasLoadedExample.current) {
        resetToDefault();
      }
      else {
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
    }

    const handleExampleClick = (example) => {
        loadExample(example);
    };

    const handleValuesChange = (newValues) => {
      setValues(newValues);
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
          if (onInput) onInput(paramsObj);

          // Extract input params order based on ioSchema
          const params = alignWASMparams(ioSchema, paramsObj, externalParams);
          
          // Call WASM
          const wasmFn = ioSchema.fn;
          const result = await wasm[wasmFn](...params);
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

    // #region - Result renderer

    const toLatex = (value) => {
      if (typeof value === "number") {
        return value.toPrecision(9).replace(/\.?0+$/, "");
      }

      if (Array.isArray(value)) {
        if (value.length === 0) return "\\emptyset";
        // Matrix form
        if (Array.isArray(value[0])) {
          return (
            "\\begin{bmatrix}" +
            value.map((r) => r.map((c) => toLatex(c)).join(" & ")).join(" \\\\ ") +
            "\\end{bmatrix}"
          );
        } else {
          return (
            "\\begin{bmatrix}" +
            value.map((c) => toLatex(c)).join(" \\\\ ") +
            "\\end{bmatrix}"
          );
        }
      }

      return String(value);
    }

    // #endregion

    if (!initialized) {
      return <div className="max-w-4xl mx-auto p-6">Loading...</div>
    }

    return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{methodName.toUpperCase()}</h1>

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

      {/* Input parameters */}
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

        <div className="mt-6">
          <button
            onClick={calculateResult}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results section */}
      {result && (
        <div className="p-6 rounded-lg shadow-sm border">
          {/* <pre className="whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre> */}
          
          {ioSchema.display && (
            <OutputPanel topic={methodName} ioDisplay={ioSchema.display} result={result}  />
          )}
        </div>
      )}
    </div>
    );
}

export default MethodPage;