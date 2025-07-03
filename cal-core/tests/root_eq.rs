#[cfg(test)]
mod root_eq {
    use cal_core::{ 
        bisection_core, 
        false_position_core, 
        fixed_point_core, 
        taylor_core, 
        newton_raphson_core, 
        secant_core 
    };

    #[test]
    fn test_bisection() {
        const EXPRESSION: &str = "43 * x - 1";
        const XL: f64 = 0.02;
        const XR: f64 = 0.03;

        let results = bisection_core(EXPRESSION, XL, XR).unwrap();
        for r in &results {
            println!("iter: {}, xl: {}, xr: {}, xm: {}, error: {}", 
                r.iteration, r.xl, r.xr, r.xm, r.error);
        }
    }

    #[test]
    fn test_false_position() {
        const EXPRESSION: &str = "43 * x - 1";
        const XL: f64 = 0.02;
        const XR: f64 = 0.03;

        let results = false_position_core(EXPRESSION, XL, XR).unwrap();
        for r in &results {
            println!("iter: {}, xl: {}, xr: {}, xm: {}, error: {}", 
                r.iteration, r.xl, r.xr, r.xm, r.error);
        }
    }

    #[test]
    fn test_fixed_point() {
        const EXPRESSION: &str = "2 - exp(x/4)";
        const X: f64 = 0.;

        let results = fixed_point_core(EXPRESSION, X).unwrap();
        for r in &results {
            println!("iter: {}, x: {}, error: {}", 
                r.iteration, r.x, r.error);
        }
    }

    #[test]
    fn test_taylor() {
        /*
         *  ln(x)
         *  TODO: has external params that to calc the expression
         *  to derivative expression for easier to call.
         */
        let expression: Vec<String> = vec![
            "ln(x)".to_string(), 
            "1/x".to_string(), 
            "-1/(x^2)".to_string(), 
            "2/(x^3)".to_string()
        ];
        const XL: f64 = 2.;
        const XR: f64 = 4.;

        let results = taylor_core(expression, XL, XR).unwrap();
        for r in &results {
            println!("iter: {}, x: {}, sum: {}, error: {}", 
                r.iteration, r.x, r.sum, r.error);
        }
    }

    #[test]
    fn test_newton_raphson() {
        const EXPRESSION_BASE: &str = "x^2 - 7";
        const EXPRESSION_DIFF: &str = "2 * x";
        const X: f64 = 2.;

        let results = newton_raphson_core(EXPRESSION_BASE, EXPRESSION_DIFF, X).unwrap();
        for r in &results {
            println!("iter: {}, x: {}, error: {}", 
                r.iteration, r.x, r.error);
        }
    }

    #[test]
    fn test_secant() {
        const EXPRESSION: &str = "43 * x - 1";
        const X0: f64 = 0.02;
        const X1: f64 = 0.03;

        let results = secant_core(EXPRESSION, X0, X1).unwrap();
        for r in &results {
            println!("iter: {}, x0: {}, x1: {}, error: {}", 
                r.iteration, r.x0, r.x1, r.error);
        }
    }
}