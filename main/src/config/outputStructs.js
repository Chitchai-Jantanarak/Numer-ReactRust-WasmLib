export const outputStructs = {
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