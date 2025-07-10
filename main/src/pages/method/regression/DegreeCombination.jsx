import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function DegreeCombination() {
  const externalParams = {}
  const methodSchema = inputSchemas.regression.degree_combinations;
  const ioSchema = ioSchemas.regression.degree_combinations;
  const exampleSchema = exampleSchemas.regression.degree_combinations;

  return (
    <MethodPage
      methodName={"expression combinator for multi regression"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
