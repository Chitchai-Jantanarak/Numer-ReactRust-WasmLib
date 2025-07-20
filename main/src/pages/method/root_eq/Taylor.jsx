import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import { derivative, parse } from "mathjs"

export default function Taylor() {
  const externalParams = {
    equations: []
  }
  const methodSchema = inputSchemas.root_equation.taylor;
  const ioSchema = ioSchemas.root_equation.taylor;
  const exampleSchema = exampleSchemas.root_equation.taylor;

  const handleInput = (ctx) => {    
    const { equation } = ctx;
    const MAX_LOOP = 4;
    let equations = [equation];
    
    let diff_string = equation;
    let iter = 1;
    
    // ln (neutral log) unusual case (mathjs NOT SUPPORTED)
    // ln(x) dx -> 1/x 
    diff_string = diff_string.replace(/ln\s*\(([^)]+)\)/g, 'log($1)');

    while (iter < MAX_LOOP) {
      let node = parse(diff_string);
      node = derivative(node, 'x');

      diff_string = node.toString();
      equations.push(diff_string);

      if (diff_string === '0') break;
      iter++;
    }

    return {
      equations: equations
    };
  }

  return (
    <MethodPage
      methodName={"taylor"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
