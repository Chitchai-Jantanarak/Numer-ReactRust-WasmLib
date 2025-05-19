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
 *  }
 * 
 *  @property {object}   topic                - Display the topic.
 *  @property {object}   method               - Display the method configs.
 * 
 *  @property {string}   fn                   - wasm's function name
 *  @property {Array}    inputs               - Wasm's input params name.
 *  @property {Array}    map                  - Name for mapping between configs.
 *  @property {object}   outputs              - Wasm's output structure @see outputStructs
 */
export const ioSchemas = {
    root_equation: {
        bisection: {
            fn: "bisection",
            inputs: ["equation", "xl", "xr"],
            outputs: outputStructs.root_equation.BisectionResult
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
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.CramerResult
        },
        guass_naive: {
            fn: "guass_naive",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult
        },
        guass_jordan: {
            fn: "guass_jordan",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult
        },
        inverse: {
            fn: "inverse_matrix",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.InverseResult
        },
        LU: {
            fn: "lu_decomposition",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        cholesky: {
            fn: "cholesky",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        jacobi: {
            fn: "jacobi",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult
        },
        guass_seidel: {
            fn: "guass_seidel",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult
        },
        over_relaxation: {
            fn: "over_relaxation",
            inputs: ["mat", "rows", "ans", "init", "omega"],
            map: {
                "mat": "A",
                "rows": "r",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult
        },
        conjugate_gradient: {
            fn: "conjugate_gradient",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "r",
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

const outputStructs = {
    root_equation: {
        BisectionResult: { 
            iteration: { type: "number" },
            xl: { type: "number" },
            xr: { type: "number" },
            xm: { type: "number" },
            error: { type: "number" }
        },
        FalsePositionResult: { 
            iteration: { type: "number" },
            xl: { type: "number" },
            xr: { type: "number" },
            xm: { type: "number" },
            error: { type: "number" }
        },
        FixedPointResult: {
            iteration: { type: "number" },
            x: { type: "number" },
            error: { type: "number" }
        },
        TaylorResult: {
            iteration: { type: "number" },
            x: { type: "number" },
            sum: { type: "number" },
            error: { type: "number" }
        },
        NewtonResult: {
            iteration: { type: "number" },
            x: { type: "number" },
            error: { type: "number" }
        },
        SecantResult: {
            iteration: { type: "number" },
            x0: { type: "number" },
            x1: { type: "number" },
            error: { type: "number" }
        }
    },
    linear_equation: {
        CramerResult: {
            det_true: { type: "number" },
            det_iter: { type: "array", items: { type: "number" } },
            value: { type: "array", items: { type: "number" } }
        },
        GuassResult: {
            value: { type: "array", items: { type: "number" } }
        },
        InverseResult: {
            inverse_mat: { type: "array", items: { type: "array", items: { type: "number" } } },
            value: { type: "array", items: { type: "number" } }
        },
        DecompositionResult: {
            lower_mat: { type: "array", items: { type: "array", items: { type: "number" } } },
            upper_mat: { type: "array", items: { type: "array", items: { type: "number" } } },
            forward_value: { type: "array", items: { type: "number" } },
            backward_value: { type: "array", items: { type: "number" } }
        },
        LinearIterationResult: {
            iteration: { type: "number" },
            x: { type: "array", items: { type: "number" } },
            error: { type: "number" }
        },
        ConjugateResult: {
            iteration: { type: "number" },
            x: { type: "array", items: { type: "number" } },
            residual: { type: "array", items: { type: "number" } },
            direction: { type: "array", items: { type: "number" } },
            error: { type: "number" },
            lambda: { type: "number" },
            alpha: { type: "number" }
        }
    },
    intepolation: {
        InterpolationResult: { // newton divided, lagrange
            coefficient: { type: "array", items: { type: "number" } },
            target_y: { type: "number" },
            error: { type: "number" }
        },
        SplineResult: {
            equation: { type: "array", items: { type: "array", items: { type: "number" } } },
            guass_result: { type: ["array", "null"], items: { type: "number" } }, // optional Vec<f64>
            target_y: { type: "number" },
            error: { type: "number" }
        }
    },
    regression: {
        RegressionResult: {
            matrix: { type: "array", items: { type: "array", items: { type: "number" } } },
            solution: { type: "array", items: { type: "number" } },
            answer: { type: "array", items: { type: "number" } }
        }
    },
    integration: {
        IntegralResult: { // !(Romberg, Guass integration)
            true_result: { type: "number" },
            result: { type: "number" },
            error: { type: "number" }
        },
        RombergResult: { // Romberg integration
            true_result: { type: "number" },
            result: { type: "array", items: { type: "array", items: { type: "number" } } },
            error: { type: "array", items: { type: "array", items: { type: "number" } } }
        },
        GuassIntegralResult: { // Guass integration
            true_result: { type: "number" },
            result: { type: "number" },
            error: { type: "number" },
            abscissas: { type: "array", items: { type: "number" } },
            weight: { type: "array", items: { type: "number" } }
        }
    },
    differential: {
        DerivativeResult: {
            true_value: { type: "number" },
            result: { type: "number" },
            error: { type: "number" }
        }
    }
}