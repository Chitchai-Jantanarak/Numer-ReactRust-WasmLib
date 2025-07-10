import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Spline() {
  const externalParams = {}
  const methodSchema = inputSchemas.interpolation.spline;
  const ioSchema = ioSchemas.interpolation.spline;
  const exampleSchema = exampleSchemas.interpolation.newton_divided;

  return (
    <MethodPage
      methodName={"spline interpolation"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
