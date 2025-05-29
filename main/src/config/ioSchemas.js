import { outputStructs } from "./outputStructs";

/**
 *  Input / Output structurer
 * 
 *  @description
 *  I/O Schema configuration for params aligner & output structure specifications from rust
 *  Main purpose of mapping parameters between ./inputSchemas and wasm module params
 *  for flowing reusable wasm caller
 * 
 *  Structure :
 *  {
 *      [topic: string]: {
 *          [methodKey: string]: ## Inner Structure ##
 *      }
 *  }
 * 
 *  Inner Structure :
 *  {
 *      fn: string
 *      inputs: string[],
 *      map?: string[],
 *      outputs: object // Output structure spec 
 *      display: string[], // "table", "2DGraph", "3DGraph"
 *  }
 * 
 *  @property {object}   topic                - Display the topic.
 *  @property {object}   method               - Display the method configs.
 * 
 *  @property {string}   fn                   - wasm's function name
 *  @property {Array}    inputs               - Wasm's input params name.
 *  @property {Array}    map                  - Name for mapping between configs.
 *  @property {object}   outputs              - Wasm's output structure @see outputStructs
 *  @property {Array}    display              - Result display type ["table", "2DGraph", "3DGraph"]
 */
export const ioSchemas = {
    root_equation: {
        bisection: {
            fn: "bisection",
            inputs: ["equation", "xl", "xr"],
            outputs: outputStructs.root_equation.BisectionResult,
            display: ["table"]
        },
        false_position: {
            fn: "false_position",
            inputs: ["equation", "xl", "xr"],
            outputs: outputStructs.root_equation.FalsePositionResult
        },
        fixed_point: {
            fn: "fixed_point",
            inputs: ["equation", "x"],
            outputs: outputStructs.root_equation.FixedPointResult
        },
        taylor: {
            fn: "taylor",
            inputs: ["equation", "xl", "xr"],
            map: {
                "xl": "x"
            },
            outputs: outputStructs.root_equation.TaylorResult
        },
        newton_raphson: {
            fn: "newton_raphson",
            inputs: ["equation_base", "equation_diff", "x"],
            map: {
                "equation_base": "equation"
            },
            outputs: outputStructs.root_equation.NewtonResult
        },
        secant: {
            fn: "secant",
            inputs: ["equation", "x0", "x1"],
            outputs: outputStructs.root_equation.SecantResult
        }
    },
    linear_equation: {
        cramer: {
            fn: "cramer",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.CramerResult
        },
        guass_naive: {
            fn: "guass_naive",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult
        },
        guass_jordan: {
            fn: "guass_jordan",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult
        },
        inverse: {
            fn: "inverse_matrix",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.InverseResult
        },
        LU: {
            fn: "lu_decomposition",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        cholesky: {
            fn: "cholesky",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        jacobi: {
            fn: "jacobi",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        guass_seidel: {
            fn: "guass_seidel",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult
        },
        over_relaxation: {
            fn: "over_relaxation",
            inputs: ["mat", "rows", "ans", "init", "omega"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult
        },
        conjugate_gradient: {
            fn: "conjugate_gradient",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.ConjugateResult
        }
    },
    interpolation: {
        newton_divided: {
            fn: "newton_divided",
            inputs: ["x", "y", "target_x"],
            outputs: outputStructs.intepolation.InterpolationResult
        },
        lagrange: {
            fn: "lagrange",
            inputs: ["x", "y", "target_x"],
            outputs: outputStructs.intepolation.InterpolationResult
        },
        spline: {
            fn: "spline",
            inputs: ["x", "y", "target_x", "degree"],
            outputs: outputStructs.intepolation.SplineResult
        }
    },
    regression: {
        least_square: {
            fn: "lsq_regression",
            inputs: ["x", "y", "degree"],
            outputs: outputStructs.regression.RegressionResult
        },
        multi_least_square: {
            fn: "mult_lsq_regression",
            inputs: ["x", "y", "degree"],
            outputs: outputStructs.regression.RegressionResult
        },
        degree_combinations: {
            fn: "combinations_regression",
            inputs: ["sizes"],
            map: {
                "sizes": "degree"
            },
            outputs: { type: "array", items: { type: "array", items: { type: "number" } } } // No struct :(
        },
    },
    integration: {
        trapezodial: {
            fn: "trapezodial",
            inputs: ["equation", "bound_least", "bound_most", "trapezoid_count", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.IntegralResult
        },
        simpson_1in3: {
            fn: "simpson_1in3",
            inputs: ["equation", "bound_least", "bound_most", "trapezoid_count", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.IntegralResult
        },
        simpson_3in8: {
            fn: "simpson_3in8",
            inputs: ["equation", "bound_least", "bound_most", "trapezoid_count", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.IntegralResult
        },
        romberg: {
            fn: "romberg",
            inputs: ["equation", "bound_least", "bound_most", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.RombergResult
        },
        guass: {
            fn: "guass_integration",
            inputs: ["equation", "bound_least", "bound_most", "true_result", "points"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.GuassIntegralResult
        },
    },
    differential: {
        derivative: {
            fn: "derivative",
            inputs: ["equation", "x", "h", "method_type", "precision_type", "diff_times", "true_result"],
            outputs: outputStructs.differential.DerivativeResult
        }
    }
};