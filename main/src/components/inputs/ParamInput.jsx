import { ExpressionInput } from "./ExpressionInput"

export const ParamInput = ({ param, values, onChange }) => {
  const { size, inputs } = param

  // Helper function to clamp a value between min and max
  const clampValue = (value, min, max) => {
    if (typeof value !== "number") return value
    if (min !== undefined && value < min) return min
    if (max !== undefined && value > max) return max
    return value
  }

  function handleMatInputChange(name, r, c, newValue) {
    const input = inputs[name]
    // Apply min/max constraints if they exist
    if (input.type === "number") {
      newValue = clampValue(newValue, input.min, input.max)
    }

    const updated = { ...values }
    if (!updated[name]) updated[name] = []
    if (!updated[name][r]) updated[name][r] = []
    updated[name][r][c] = newValue

    onChange?.(updated)
  }

  function handleScalarChange(name, newValue) {
    const input = inputs[name]
    // Apply min/max constraints if they exist
    if (input.type === "number") {
      newValue = clampValue(newValue, input.min, input.max)
    }

    const updated = { ...values, [name]: newValue };
    onChange?.(updated);
  }

  return (
    <div className="space-y-4">
      {size && (
        <div className="flex items-center gap-2">
          <label htmlFor="size-control" className="font-medium">
              {size.label}:
            </label>
          <input
            type="number"
            min={size.min}
            max={size.max}
            value={param.currentSize || size.min}
            onChange={(e) => {
              const val = Math.max(size.min, Math.min(size.max, Number.parseInt(e.target.value) || size.min))
              param.onSizeChange?.(val)
            }}
            className="input input-bordered w-full"
          />
        </div>
      )}

      {/* Render all input fields */}
      {Object.entries(inputs).map(([name, input]) => {
        // Get shape if it's a function that returns a non-null value
        const shape = input.shape && typeof input.shape === "function" ? input.shape(param.currentSize || 0) : null

        // If shape is an array with two elements, render a matrix input
        if (shape && Array.isArray(shape) && shape.length === 2) {
          const [rows, cols] = shape
          return (
            <div key={name} className="space-y-2">
              <label htmlFor={`${name}-${rows}-${cols}`} className="font-semibold uppercase">
                {name} ({rows}x{cols})
              </label>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))` }}>
                {Array.from({ length: rows }).map((_, r) =>
                  Array.from({ length: cols }).map((_, c) => (
                    <input
                      key={`${name}-${r}-${c}`}
                      type="number"
                      id={`${name}-${r}-${c}`} 
                      name={`${name}[${r}][${c}]`}
                      value={values?.[name]?.[r]?.[c] ?? ""}
                      onChange={(e) => {
                        const value = input.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value
                        handleMatInputChange(name, r, c, value)
                      }}
                      className="input input-bordered w-full"
                      min={input.min}
                      max={input.max}
                      step="any"
                    />
                  )),
                )}
              </div>
              {input.min !== undefined && input.max !== undefined && (
                <p className="text-xs text-gray-500">
                  Range: {input.min} to {input.max}
                </p>
              )}
            </div>
          )
        }
        // Otherwise, render a scalar input (text, number, or select)
        else {
          // For select type inputs
          if (input.type === "select" && input.options) {
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={`select-${name}`} className="label font-medium uppercase">{name}:</label>
                <select
                  id={`select-${name}`}
                  name={name}
                  value={values?.[name] ?? input.options[0]?.value ?? ""}
                  onChange={(e) => {
                    const value = typeof input.options[0]?.value === "number" ? Number(e.target.value) : e.target.value
                    handleScalarChange(name, value)
                  }}
                  className="select select-bordered w-full"
                >
                  {input.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          // For number type inputs
          else if (input.type === "number") {
            return (
              <div key={name} className="space-y-1">
                <label htmlFor={`input-${name}`} className="font-medium uppercase">{name}:</label>
                <input
                  id={`input-${name}`}
                  name={name}
                  type="number"
                  value={values?.[name] ?? ""}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value) || 0
                    handleScalarChange(name, value)
                  }}
                  className="input input-bordered w-full"
                  min={input.min}
                  max={input.max}
                  step="any"
                />
                {input.min !== undefined && input.max !== undefined && (
                  <p className="text-xs text-gray-500">
                    Range: {input.min} to {input.max}
                  </p>
                )}
              </div>
            )
          }
          // For string type inputs
          else if (input.type === "string") {
            return (
              <div key={name} className="space-y-1">
                <label htmlFor="expression-input" className="font-medium uppercase">{name}:</label>
                <ExpressionInput
                  key={`${name}-expression || "empty"}`}
                  value={values?.[name] ?? ""}
                  onChange={(val) => handleScalarChange(name, val)}
                />
              </div>
            )
          }
        }
      })}
    </div>
  )
}

export default ParamInput;
