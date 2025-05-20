import { useState, useEffect } from "react";
import { ParamInput } from "../../components/ParamInput";
import * as wasm from "../../wasm/cal_core.js"

const MethodPage = ({
    methodName,
    methodSchema,
    exampleSchema,
    ioSchema,
    externalParams
}) => {
    const [size, setSize] = useState(methodSchema.size?.min || 0);
    const [values, setValues] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initiate input form
    useEffect(() => {
        resetToDefault()
    }, [size])

    const resetToDefault = () => {
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
    }

    const loadExample = (example) => {
        if (example == null) return new Error(`Missing example Schemas : "${example}"`);
        
        // Is size is existed on method schemas
        const defaultSize = methodSchema.size ? 1 : 0;
        if (!defaultSize) return; 
        
        // Is Shape Defined get the depth of size
        const sizeDepInput = Object.entries(methodSchema.inputs).find(([_, input]) => {
            const shape = input.shape && typeof input.shape === "function" ? input.shape(1) : null;
            return shape && Array.isArray(shape);
        })
        if (!sizeDepInput) return;

        const [name] = sizeDepInput;
        const inputData = example.inputs[name];
        const shape = methodSchema.inputs[name].shape(0);

        if (!Array.isArray(inputData)) return new Error(`Invalid example input for "${name}"`);
        
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

        if (!Number.isInteger(exampleSize) || exampleSize <= 0) {
            return new Error(`Could not infer valid size from: ${name}`);
        }

        setSize(exampleSize);
    }

    const handleSizeChange = (newSize) => {
        setSize(newSize);
    }

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
            // Extract input params order based on ioSchema
            const params = alignWASMparams(ioSchema, values, externalParams);

            // call WASM
            const wasmFn = ioSchema.fn;
            const result = await wasm[wasmFn](...params);

            setResult(result);
        }
        catch (err) {
            throw new Error(err.toString());
        }
        finally {
            setLoading(false);
        }
    }

    return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{methodName}</h1>

      {/* Examples section - only show if examples exist */}
      {exampleSchema && exampleSchema.examples && exampleSchema.examples.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Examples</h2>
          <div className="flex flex-wrap gap-2">
            {exampleSchema.examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(example)}
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
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Input Parameters</h2>

        <ParamInput
          param={{
            size: methodSchema.size,
            inputs: methodSchema.inputs,
            currentSize: size,
            onSizeChange: handleSizeChange,
          }}
          values={values}
          onChange={setValues}
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
      {result && <div className="bg-white p-6 rounded-lg shadow-sm border">{renderResult()}</div>}
    </div>
    );
}

export default MethodPage;