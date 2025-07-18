import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Trapezodial() {
  const externalParams = {}
  const methodSchema = inputSchemas.integration.trapezodial;
  const ioSchema = ioSchemas.integration.trapezodial;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  return (
    <MethodPage
      methodName={"trapezodial rule"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
