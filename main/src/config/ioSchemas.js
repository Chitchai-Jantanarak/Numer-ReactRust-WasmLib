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
 *      display: {
 *          layout?: "horizontal" | "vertical",
 *          mode: Array<String>,
 *          main?: Array<String>,
 *      }
 *  }
 * 
 *  @property {object}   topic                - Display the topic.
 *  @property {object}   method               - Display the method configs.
 * 
 *  @property {string}   fn                   - wasm's function name
 *  @property {Array}    inputs               - Wasm's input params name.
 *  @property {Array}    map                  - Name for mapping between configs.
 * 
 *  @property {object}   outputs              - Wasm's output structure @see outputStructs
 *  @property {Array}    display              - Result display managers
 *  @property {Array}    display._key.mode    - Result display type ["table", "box", "graph2D", "graph3D"]
 *  @property {Array}    display._key.main    - Result keys to be at main section **For Box output**
 *  @property {Enum}     display._key.layout  - Result display's direction on main section **For Box output**
 */
export const ioSchemas = {
    root_equation: {
        bisection: {
            fn: "bisection",
            inputs: ["equation", "xl", "xr"],
            outputs: outputStructs.root_equation.BisectionResult,
            display: {
                mode: ["table", "graph2D"]
            }
        },
        false_position: {
            fn: "false_position",
            inputs: ["equation", "xl", "xr"],
            outputs: outputStructs.root_equation.FalsePositionResult,
            display: {
                mode: ["table", "graph2D"]
            }
        },
        fixed_point: {
            fn: "fixed_point",
            inputs: ["equation", "x"],
            outputs: outputStructs.root_equation.FixedPointResult,
            display: {
                mode: ["table", "graph2D"]
            }
        },
        taylor: {
            fn: "taylor",
            inputs: ["equations", "xl", "xr"],
            outputs: outputStructs.root_equation.TaylorResult,
            display: {
                mode: ["table", "graph2D"]
            }
        },
        newton_raphson: {
            fn: "newton_raphson",
            inputs: ["equation_base", "equation_diff", "x"],
            map: {
                "equation_base": "equation"
            },
            outputs: outputStructs.root_equation.NewtonResult,
            display: {
                mode: ["table", "graph2D"]
            }
        },
        secant: {
            fn: "secant",
            inputs: ["equation", "x0", "x1"],
            outputs: outputStructs.root_equation.SecantResult,
            display: {
                mode: ["table", "graph2D"]
            }
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
            outputs: outputStructs.linear_equation.CramerResult,
            display: {
                mode: ["box"],
                main: ["A", "value", "=", "b"],
                layout: "horizontal"
            }
        },
        guass_naive: {
            fn: "guass_naive",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult,
            display: {
                mode: ["box"],
                main: ["A", "result", "=", "b"],
                layout: "horizontal"
            }
        },
        guass_jordan: {
            fn: "guass_jordan",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.GuassResult,
            display: {
                mode: ["box"],
                main: ["A", "result", "=", "b"],
                layout: "horizontal"
            }
        },
        inverse: {
            fn: "inverse_matrix",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.InverseResult,
            display: {
                mode: ["box"],
                main: ["A", "result", "=", "b"],
                layout: "horizontal"
            }
        },
        LU: {
            fn: "lu_decomposition",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult,
            display: {
                mode: ["box"],
                main: ["A", "result", "=", "b"],
                layout: "horizontal"
            }
        },
        cholesky: {
            fn: "cholesky",
            inputs: ["mat", "rows", "ans"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult,
            display: {
                mode: ["box"],
                main: ["A", "result", "=", "b"],
                layout: "horizontal"
            }
        },
        jacobi: {
            fn: "jacobi",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.DecompositionResult,
            display: {
                mode: ["table"]
            }
        },
        guass_seidel: {
            fn: "guass_seidel",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult,
            display: {
                mode: ["table"]
            }
        },
        over_relaxation: {
            fn: "over_relaxation",
            inputs: ["mat", "rows", "ans", "init", "omega"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.LinearIterationResult,
            display: {
                mode: ["table"]
            }
        },
        conjugate_gradient: {
            fn: "conjugate_gradient",
            inputs: ["mat", "rows", "ans", "init"],
            map: {
                "mat": "A",
                "rows": "size",
                "ans": "b"
            },
            outputs: outputStructs.linear_equation.ConjugateResult,
            display: {
                mode: ["table", "graph3D"]
            }
        }
    },
    interpolation: {
        newton_divided: {
            fn: "newton_divided",
            inputs: ["x", "y", "target_x"],
            outputs: outputStructs.intepolation.InterpolationResult,
            display: {
                mode: ["box"]
            }
        },
        lagrange: {
            fn: "lagrange",
            inputs: ["x", "y", "target_x"],
            outputs: outputStructs.intepolation.InterpolationResult,
            display: {
                mode: ["box"]
            }
        },
        spline: {
            fn: "spline",
            inputs: ["x", "y", "target_x", "degree"],
            outputs: outputStructs.intepolation.SplineResult,
            display: {
                mode: ["box"]
            }
        }
    },
    regression: {
        least_square: {
            fn: "lsq_regression",
            inputs: ["x", "y", "degree"],
            outputs: outputStructs.regression.RegressionResult,
            display: {
                mode: ["box"]
            }
        },
        multi_least_square: {
            fn: "mult_lsq_regression",
            inputs: ["x", "y", "degree"],
            outputs: outputStructs.regression.RegressionResult,
            display: {
                mode: ["box"]
            }
        },
        degree_combinations: {
            fn: "combinations_regression",
            inputs: ["sizes"],
            map: {
                "sizes": "degree"
            },
            outputs: { type: "array", items: { type: "array", items: { type: "number" } } }, // No struct :(
            display: {
                mode: ["box"]
            }
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
            outputs: outputStructs.integration.IntegralResult,
            display: {
                mode: ["graph2D", "box"]
            }
        },
        simpson_1in3: {
            fn: "simpson_1in3",
            inputs: ["equation", "bound_least", "bound_most", "trapezoid_count", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.IntegralResult,
            display: {
                mode: ["graph2D", "box"]
            }
        },
        simpson_3in8: {
            fn: "simpson_3in8",
            inputs: ["equation", "bound_least", "bound_most", "trapezoid_count", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.IntegralResult,
            display: {
                mode: ["graph2D", "box"]
            }
        },
        romberg: {
            fn: "romberg",
            inputs: ["equation", "bound_least", "bound_most", "true_result"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.RombergResult,
            display: {
                mode: ["graph2D", "box"]
            }
        },
        guass: {
            fn: "guass_integration",
            inputs: ["equation", "bound_least", "bound_most", "true_result", "points"],
            map: {
                "bound_least": "xl",
                "bound_most": "xr",
            },
            outputs: outputStructs.integration.GuassIntegralResult,
            display: {
                mode: ["graph2D", "box"]
            }
        },
    },
    differential: {
        derivative: {
            fn: "derivative",
            inputs: ["equation", "x", "h", "method_type", "precision_type", "diff_times", "true_result"],
            outputs: outputStructs.differential.DerivativeResult,
            display: {
                mode: ["table"]
            }
        }
    }
};