import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

import nerdamer from "nerdamer";
import "nerdamer/calculus";

export default function GuassIntegral() {
  const externalParams = {
    true_result: NaN
  }
  const methodSchema = inputSchemas.integration.guass;
  const ioSchema = ioSchemas.integration.guass;
  const exampleSchema = exampleSchemas.integration.guass;
  
  const handleInput = (ctx) => {
    const { equation, xl, xr } = ctx;
    const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();

    return {
      true_result: result
    }
  }

  return (
    <MethodPage
      methodName={"guassian integral"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
      onInput={handleInput}
    />
  )
}
