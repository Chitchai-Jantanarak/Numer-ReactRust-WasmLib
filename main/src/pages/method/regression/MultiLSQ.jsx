import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function MultiLSQ() {
  const externalParams = {}
  const methodSchema = inputSchemas.regression.multi_least_square;
  const ioSchema = ioSchemas.regression.multi_least_square;
  const exampleSchema = exampleSchemas.regression.least_square;

  return (
    <MethodPage
      methodName={"multiple least square regression"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
