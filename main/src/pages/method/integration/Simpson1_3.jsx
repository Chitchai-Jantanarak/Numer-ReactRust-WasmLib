import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Simpson1_3() {
  const externalParams = {}
  const methodSchema = inputSchemas.integration.simpson_1in3;
  const ioSchema = ioSchemas.integration.simpson_1in3;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  return (
    <MethodPage
      methodName={"simpson's 1/3 rule"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
