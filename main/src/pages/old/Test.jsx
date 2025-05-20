"use client"

import { useState, useEffect } from "react"
import { ParamInput } from "../../components/ParamInput"

export const Test = ({ methodName, methodSchema, exampleSchema, ioSchema, wasmModule }) => {
  // Initialize size state only if the method has a size property
  const [size, setSize] = useState(methodSchema?.size?.min || 0)
  const [values, setValues] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Initialize with default values
  useEffect(() => {
    resetToDefault()
  }, [size, methodSchema])

  const resetToDefault = () => {
    if (!methodSchema) return

    const defaultValues = {}

    Object.entries(methodSchema.inputs).forEach(([name, input]) => {
      // Handle matrix inputs
      if (input.shape && typeof input.shape === "function") {
        const shape = input.shape(size)
        if (shape && Array.isArray(shape) && shape.length === 2) {
          const [rows, cols] = shape
          defaultValues[name] = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => (input.type === "number" ? 0 : "")),
          )
        } else {
          // Handle scalar inputs
          if (input.type === "number") {
            defaultValues[name] = input.min > 0 ? input.min : 0
          } else if (input.type === "string") {
            defaultValues[name] = ""
          } else if (input.type === "select" && input.options && input.options.length > 0) {
            defaultValues[name] = input.options[0].value
          }
        }
      } else {
        // Handle scalar inputs
        if (input.type === "number") {
          defaultValues[name] = input.min > 0 ? input.min : 0
        } else if (input.type === "string") {
          defaultValues[name] = ""
        } else if (input.type === "select" && input.options && input.options.length > 0) {
          defaultValues[name] = input.options[0].value
        }
      }
    })

    setValues(defaultValues)
    setResult(null)
    setError(null)
  }

  const loadExample = (example) => {
    // Only update size if the method has a size property and example has a size-dependent input
    if (methodSchema?.size) {
      // Find the first input that depends on size
      const sizeDepInput = Object.entries(methodSchema.inputs).find(([_, input]) => {
        const shape = input.shape && typeof input.shape === "function" ? input.shape(1) : null
        return shape && Array.isArray(shape)
      })

      if (sizeDepInput) {
        const [name] = sizeDepInput
        // Get size from the example's first dimension
        if (example.inputs[name] && example.inputs[name][0]) {
          const exampleSize =
            methodSchema.inputs[name].shape(0)[1] === 1
              ? example.inputs[name].length // For column vectors
              : example.inputs[name][0].length // For row vectors
          setSize(exampleSize)
        }
      }
    }

    // Set the values after a short delay to ensure size state is updated
    setTimeout(() => {
      setValues(example.inputs)
    }, 50)
  }

  const handleSizeChange = (newSize) => {
    setSize(newSize)
  }

  const calculateResult = async () => {
    setLoading(true)
    setError(null)

    try {
      // Prepare input parameters for WASM function
      const params = []

      // Extract the input parameters in the correct order based on ioSchema
      Object.keys(ioSchema.input).forEach((key) => {
        // Convert 2D array to 1D if needed
        if (values[key] && Array.isArray(values[key]) && values[key].length === 1) {
          params.push(values[key][0])
        } else {
          params.push(values[key])
        }
      })

      // Call the WASM function
      const wasmFunction = wasmModule[ioSchema.wasmFunction]
      const result = await wasmFunction(...params)

      setResult(result)
    } catch (err) {
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    const renderedOutput = ioSchema.output.render(result)

    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-bold">Results</h2>

        {renderedOutput.components.map((component, idx) => {
          switch (component.type) {
            case "table":
              return (
                <div key={idx} className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {component.data.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {component.data.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )

            case "result":
              return (
                <div key={idx} className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium">{component.data.label}:</div>
                  <div className="text-lg font-bold">{component.data.value}</div>
                </div>
              )

            case "equations":
              return (
                <div key={idx} className="space-y-2">
                  <h3 className="font-medium">Spline Equations:</h3>
                  {component.data.segments.map((segment, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium">{segment.range}:</div>
                      <div className="font-mono">{segment.equation}</div>
                    </div>
                  ))}
                </div>
              )

            case "steps":
              return (
                <div key={idx} className="space-y-4">
                  <h3 className="font-medium">Elimination Steps:</h3>
                  {component.data.steps.map((step, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium mb-2">{step.title}:</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody>
                            {step.matrix.map((row, r) => (
                              <tr key={r}>
                                {row.map((cell, c) => (
                                  <td key={c} className="px-3 py-2 text-center border">
                                    {typeof cell === "number" ? cell.toFixed(4) : cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )

            default:
              return null
          }
        })}
      </div>
    )
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
            size: methodSchema?.size,
            inputs: methodSchema?.inputs,
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
  )
}
