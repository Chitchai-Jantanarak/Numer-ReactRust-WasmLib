import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import { derivative, parse } from "mathjs"

export default function Derivative() {
  const externalParams = {
    true_result: NaN
  }
  const methodSchema = inputSchemas.differential.derivative
  const ioSchema = ioSchemas.differential.derivative
  const exampleSchema = exampleSchemas.differential.derivative
  

  const handleInput = (ctx) => {    
    const { equation, x, diff_times } = ctx;
    
    let node = parse(equation);
    for (let i = 0; i < diff_times; i++) {
      node = derivative(node, 'x');
    }

    const result = node.evaluate({ x });     
    return {
      true_result: result
    };
  }

  return (
    <MethodPage
      methodName={"Finite difference method"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
