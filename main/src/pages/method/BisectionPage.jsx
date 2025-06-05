import MethodPage from "./MethodPage"
import { inputSchemas } from "../../config/inputSchemas"
import { ioSchemas } from "../../config/ioSchemas"
import { exampleSchemas } from "../../config/exampleSchemas"

export default function Bisection() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.bisection
  const ioSchema = ioSchemas.root_equation.bisection
  const exampleSchema = exampleSchemas.root_equation.bisection

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
