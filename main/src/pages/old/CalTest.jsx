import { Test } from "./Test"

export default function RootEquationPage() {
  return (
    <Test
      category="root-equation"
      title="Root Equation Methods"
      description="Find roots of equations using numerical methods like Bisection, Newton-Raphson, and Secant."
      methods={[
        {
          id: "bisection",
          name: "Bisection Method",
          schemaPath: ["root_equation", "bisection"],
        },
        {
          id: "false_position",
          name: "False Position Method",
          schemaPath: ["root_equation", "false_position"],
        },
        {
          id: "fixed_point",
          name: "Fixed Point Method",
          schemaPath: ["root_equation", "fixed_point"],
        },
        {
          id: "newton_raphson",
          name: "Newton-Raphson Method",
          schemaPath: ["root_equation", "newton_raphson"],
        },
        {
          id: "secant",
          name: "Secant Method",
          schemaPath: ["root_equation", "secant"],
        },
      ]}
    />
  )
}
