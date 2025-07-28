export const routesByCategory = {
  "Root Equations": [
    { path: "/bisection", name: "Bisection" },
    { path: "/false_position", name: "False Position" },
    { path: "/fixed_point", name: "Fixed Point" },
    { path: "/newton_raphson", name: "Newton-Raphson" },
    { path: "/secant", name: "Secant" },
    { path: "/taylor", name: "Taylor Series" },
  ],
  "Linear Equations": [
    { path: "/cramer", name: "Cramer’s Rule" },
    { path: "/gauss_naive", name: "Gauss Naive" },
    { path: "/gauss_jordan", name: "Gauss Jordan" },
    { path: "/inverse", name: "Inverse Matrix" },
    { path: "/cholesky", name: "Cholesky" },
    { path: "/lu", name: "LU Decomposition" },
    { path: "/jacobi", name: "Jacobi Method" },
    { path: "/gauss_seidel", name: "Gauss-Seidel" },
    { path: "/over_relaxation", name: "SOR" },
    { path: "/conjugate_gradient", name: "Conjugate Gradient" },
  ],
  "Interpolation": [
    { path: "/larange", name: "Lagrange" },
    { path: "/newton_divided", name: "Newton Divided" },
    { path: "/spline", name: "Spline" },
  ],
  "Regression": [
    { path: "/degree_combination", name: "Degree Combination" },
    { path: "/lsq", name: "Least Squares (LSQ)" },
    { path: "/multi_lsq", name: "Multi LSQ" },
  ],
  "Integration": [
    { path: "/trapezoidal", name: "Trapezoidal" },
    { path: "/simpson_1_3", name: "Simpson 1/3" },
    { path: "/simpson_3_8", name: "Simpson 3/8" },
    { path: "/romberg", name: "Romberg" },
    { path: "/gauss_integral", name: "Gauss Integral" },
  ],
  "Differentiation": [
    { path: "/diff", name: "Numerical Derivatives" },
  ],
};
