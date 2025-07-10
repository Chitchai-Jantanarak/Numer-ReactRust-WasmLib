import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function NewtonRaphson() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.newton_raphson;
  const ioSchema = ioSchemas.root_equation.newton_raphson;
  const exampleSchema = exampleSchemas.root_equation.newton_raphson;

  return (
    <MethodPage
      methodName={"newton raphson"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
