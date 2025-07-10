import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Inverse() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.inverse;
  const ioSchema = ioSchemas.linear_equation.inverse;
  const exampleSchema = exampleSchemas.linear_equation.guass_naive;

  return (
    <MethodPage
      methodName={"inverse matrix method"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
