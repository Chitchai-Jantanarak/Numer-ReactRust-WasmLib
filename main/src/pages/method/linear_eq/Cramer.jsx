import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Cramer() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.cramer;
  const ioSchema = ioSchemas.linear_equation.cramer;
  const exampleSchema = exampleSchemas.linear_equation.cramer;

  return (
    <MethodPage
      methodName={"bisection"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
