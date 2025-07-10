import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function GuessSeidel() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.guass_seidel;
  const ioSchema = ioSchemas.linear_equation.guass_seidel;
  const exampleSchema = exampleSchemas.linear_equation.guass_naive;

  return (
    <MethodPage
      methodName={"guess-seidel"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
