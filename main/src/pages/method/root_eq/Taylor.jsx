import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Taylor() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.taylor;
  const ioSchema = ioSchemas.root_equation.taylor;
  const exampleSchema = exampleSchemas.root_equation.taylor;

  return (
    <MethodPage
      methodName={"taylor"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
