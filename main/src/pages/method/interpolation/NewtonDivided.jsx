import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function NewtonDivided() {
  const externalParams = {}
  const methodSchema = inputSchemas.interpolation.newton_divided;
  const ioSchema = ioSchemas.interpolation.newton_divided;
  const exampleSchema = exampleSchemas.interpolation.newton_divided;

  return (
    <MethodPage
      methodName={"newton divided difference"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
