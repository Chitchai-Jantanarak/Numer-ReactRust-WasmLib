import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function GuassIntegral() {
  const externalParams = {}
  const methodSchema = inputSchemas.integration.guass;
  const ioSchema = ioSchemas.integration.guass;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  return (
    <MethodPage
      methodName={"guassian integral"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
