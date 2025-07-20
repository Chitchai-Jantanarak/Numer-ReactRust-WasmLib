import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import { derivative, parse } from "mathjs"

export default function NewtonRaphson() {
  const externalParams = {
    equation_diff: ''
  };
  const methodSchema = inputSchemas.root_equation.newton_raphson;
  const ioSchema = ioSchemas.root_equation.newton_raphson;
  const exampleSchema = exampleSchemas.root_equation.newton_raphson;  

  const handleInput = (ctx) => {
    const { equation } = ctx;

    let node = parse(equation);
    node = derivative(node, 'x');

    const diff = node.toString();
    console.log(diff);
    
    return {
      equation_diff: diff
    }
  }

  return (
    <MethodPage
      methodName={"newton raphson"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
