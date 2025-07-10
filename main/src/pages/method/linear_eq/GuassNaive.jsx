import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function GuassNaive() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.guass_naive;
  const ioSchema = ioSchemas.linear_equation.guass_naive;
  const exampleSchema = exampleSchemas.linear_equation.guass_naive;

  return (
    <MethodPage
      methodName={"naive guassian elimination"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
