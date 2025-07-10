import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function Simpson3_8() {
  const externalParams = {}
  const methodSchema = inputSchemas.integration.simpson_3in8;
  const ioSchema = ioSchemas.integration.simpson_3in8;
  const exampleSchema = exampleSchemas.integration.trapezodial;

  return (
    <MethodPage
      methodName={"simpson's 3/8 rule"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
