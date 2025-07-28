import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import nerdamer from "nerdamer";
// @ts-ignore
import "nerdamer/calculus";

export default function Simpson1_3() {
  const externalParams = {
    true_result: NaN
  }
  const methodSchema = inputSchemas.integration.simpson_1in3;
  const ioSchema = ioSchemas.integration.simpson_1in3;
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
      methodName={"simpson's 1/3 rule"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
