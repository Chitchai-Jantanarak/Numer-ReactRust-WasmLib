#[cfg(test)]
mod integration {
    use cal_core::guass_integration_core;
    use::cal_core::{
        trapezodial_core,
        simpson_1in3_core,
        simpson_3in8_core,
        romberg_core
    };

    fn sample_i() -> (&'static str, f64, f64, f64) {
        let equation: &str = "4 * x^5 - 3 * x^4 + x^3 - 6 * x + 2";
        let bound_least: f64 = 2.;
        let bound_most: f64 = 8.;
        let true_result: f64 = 155930.4;

        (equation, bound_least, bound_most, true_result)
    }

    #[test]
    fn test_trapzodial() {
        let (equation, bound_least, bound_most, true_result) = sample_i();
        let result2c = trapezodial_core(equation, bound_least, bound_most, 2, true_result).unwrap();
        let result4c = trapezodial_core(equation, bound_least, bound_most, 4, true_result).unwrap();
        let result6c = trapezodial_core(equation, bound_least, bound_most,6, true_result).unwrap();

        println!(" 
            ----- 2C ----- 
            \n{}\n{}\n{}\n
        ", result2c.result, result2c.true_result, result2c.error
        );
        println!(" 
            ----- 4C ----- 
            \n{}\n{}\n{}\n
        ", result4c.result, result4c.true_result, result4c.error
        );
        println!(" 
            ----- 6C ----- 
            \n{}\n{}\n{}\n
        ", result6c.result, result6c.true_result, result6c.error
        );
    }

    #[test]
    fn test_simpson1in3() {
        let (equation, bound_least, bound_most, true_result) = sample_i();
        let result2c = simpson_1in3_core(equation, bound_least, bound_most, 2, true_result).unwrap();
        let result4c = simpson_1in3_core(equation, bound_least, bound_most, 4, true_result).unwrap();
        let result6c = simpson_1in3_core(equation, bound_least, bound_most,6, true_result).unwrap();

        println!(" 
            ----- 2C ----- 
            \n{}\n{}\n{}\n
        ", result2c.result, result2c.true_result, result2c.error
        );
        println!(" 
            ----- 4C ----- 
            \n{}\n{}\n{}\n
        ", result4c.result, result4c.true_result, result4c.error
        );
        println!(" 
            ----- 6C ----- 
            \n{}\n{}\n{}\n
        ", result6c.result, result6c.true_result, result6c.error
        );
    }

    #[test]
    fn test_simpson3in8() {
        let (equation, bound_least, bound_most, true_result) = sample_i();
        let result2c = simpson_3in8_core(equation, bound_least, bound_most, 2, true_result).unwrap();
        let result4c = simpson_3in8_core(equation, bound_least, bound_most, 4, true_result).unwrap();
        let result6c = simpson_3in8_core(equation, bound_least, bound_most,6, true_result).unwrap();

        println!(" 
            ----- 2C ----- 
            \n{}\n{}\n{}\n
        ", result2c.result, result2c.true_result, result2c.error
        );
        println!(" 
            ----- 4C ----- 
            \n{}\n{}\n{}\n
        ", result4c.result, result4c.true_result, result4c.error
        );
        println!(" 
            ----- 6C ----- 
            \n{}\n{}\n{}\n
        ", result6c.result, result6c.true_result, result6c.error
        );
    }

    #[test]
    fn test_rombreg_fn1() {
        let (mut equation, bound_least, bound_most, true_result) = sample_i();
        let result = romberg_core(equation, bound_least, bound_most).unwrap();

        println!("RESULT");
        for i in result.result {
            for j in i {
                print!("{:.2} ", j)
            }
            println!();
        }
        println!();

        println!("ERROR");
        for i in result.error {
            for j in i {
                print!("{:.2} ", j)
            }
            println!();
        }
        println!();
    }

    #[test]
    fn test_rombreg_fn2() {
        let (mut equation, bound_least, bound_most, true_result) = sample_i();
        equation = "200 * (x / (5 + x)) * exp( -2 * x / 30 )";
        let result = romberg_core(equation, 0., 30.).unwrap();

        println!("RESULT");
        for i in result.result {
            for j in i {
                print!("{:.2} ", j)
            }
            println!();
        }
        println!();

        println!("ERROR");
        for i in result.error {
            for j in i {
                print!("{:.2} ", j)
            }
            println!();
        }
        println!();
    }

    #[test]
    fn test_guass_integral() {
        let (equation, bound_least, bound_most, true_result) = sample_i();
        let result = guass_integration_core(
            equation, 
            bound_least, 
            bound_most,
            true_result, 
            1)
        .unwrap();

        // println!("result: {}\ntrue result: {}\nerror: {}", result.result, result.true_result, result.error);
        println!();
        for i in result.abscissas {
            println!("{} ", i)
        }
        println!();
        for i in result.weight {
            println!("{} ", i)
        }
    }
}