import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Bisection() {
  const externalParams = {}
  const methodSchema = inputSchemas.interpolation.lagrange;
  const ioSchema = ioSchemas.interpolation.lagrange;
  const exampleSchema = exampleSchemas.interpolation.lagrange;

  return (
    <MethodPage
      methodName={"lagrange"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
