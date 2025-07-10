import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function LU() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.LU;
  const ioSchema = ioSchemas.linear_equation.LU;
  const exampleSchema = exampleSchemas.linear_equation.guass_naive;

  return (
    <MethodPage
      methodName={"LU decomposition"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
