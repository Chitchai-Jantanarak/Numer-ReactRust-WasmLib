import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function FalsePositon() {
  const externalParams = {}
  const methodSchema = inputSchemas.root_equation.false_position
  const ioSchema = ioSchemas.root_equation.false_position
  const exampleSchema = exampleSchemas.root_equation.false_position

  return (
    <MethodPage
      methodName={"false position"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
