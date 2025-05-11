import { useState } from "react";
import { matrixSchemas } from "../config/matrixSchemas";
import { ParamInput } from "../components/ParamInput";

// Pick one schema and one input at random
const selectedSchema = matrixSchemas[Math.floor(Math.random() * matrixSchemas.length)];
const selectedInput = selectedSchema.inputs[Math.floor(Math.random() * selectedSchema.inputs.length)];const initSize = selectedSchema.initSize;

function Test() {
  const [size, setSize] = useState(initSize);

  const [values, setValues] = useState(() =>
    Object.fromEntries(
      Object.entries(selectedInput).filter(([k]) => k !== "initSize").map(([key, val]) => [
        key,
        typeof val === "function" ? val(initSize) : val
      ])
    )
  );

  const inputConfig = {
    size: {
      label: "Matrix Size",
      min: 2,
      max: 6
    },
    inputs: Object.fromEntries(
      Object.keys(values).map((key) => [
        key,
        {
          shape: (s) => [s, key.includes("vector") ? 1 : s],
          min: -10,
          max: 10
        }
      ])
    )
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    const updated = Object.fromEntries(
      Object.entries(selectedInput).filter(([k]) => k !== "initSize").map(([key, val]) => [
        key,
        typeof val === "function" ? val(newSize) : val
      ])
    );
    setValues(updated);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">{selectedSchema.name}</h2>

      <ParamInput
        param={{
          size: inputConfig.size,
          inputs: inputConfig.inputs,
          currentSize: size,
          onSizeChange: handleSizeChange
        }}
        values={values}
        onChange={setValues}
      />
    </div>
  );
}

export default Test;
