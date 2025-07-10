import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function FixedPoint() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.fixed_point
  const ioSchema = ioSchemas.root_equation.fixed_point
  const exampleSchema = exampleSchemas.root_equation.fixed_point

  return (
    <MethodPage
      methodName={"fixed point iteration"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
