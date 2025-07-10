import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Secant() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.secant;
  const ioSchema = ioSchemas.root_equation.secant;
  const exampleSchema = exampleSchemas.root_equation.secant;

  return (
    <MethodPage
      methodName={"secant"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
