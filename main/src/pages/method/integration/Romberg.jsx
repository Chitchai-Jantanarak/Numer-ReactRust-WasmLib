import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Romberg() {
  const externalParams = {}
  const methodSchema = inputSchemas.integration.romberg;
  const ioSchema = ioSchemas.integration.romberg;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  return (
    <MethodPage
      methodName={"romberg integration"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
