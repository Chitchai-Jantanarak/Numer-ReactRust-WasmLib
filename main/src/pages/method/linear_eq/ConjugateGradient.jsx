import MethodPage from "../MethodPage"
import { inputSchemas } from "../../../config/inputSchemas"
import { ioSchemas } from "../../../config/ioSchemas"
import { exampleSchemas } from "../../../config/exampleSchemas"

export default function ConjugateGradient() {
  const externalParams = {}
  const methodSchema = inputSchemas.linear_equation.conjugate_gradient;
  const ioSchema = ioSchemas.linear_equation.conjugate_gradient;
  const exampleSchema = exampleSchemas.linear_equation.guass_naive;

  return (
    <MethodPage
      methodName={"conjugate gradient method"}
      methodSchema={methodSchema}
      exampleSchema={exampleSchema}
      ioSchema={ioSchema}
      externalParams={externalParams}
    />
  )
}
