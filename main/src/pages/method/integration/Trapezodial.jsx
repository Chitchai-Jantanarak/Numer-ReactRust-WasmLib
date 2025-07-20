import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import nerdamer from "nerdamer";
import "nerdamer/calculus";

export default function Trapezodial() {
  const externalParams = {
    true_result: NaN
  }
  const methodSchema = inputSchemas.integration.trapezodial;
  const ioSchema = ioSchemas.integration.trapezodial;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  const handleInput = (ctx) => {
    const { equation, xl, xr } = ctx;
    const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();

    return {
      true_result: result
    }
  }

  return (
    <MethodPage
      methodName={"trapezodial rule"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
