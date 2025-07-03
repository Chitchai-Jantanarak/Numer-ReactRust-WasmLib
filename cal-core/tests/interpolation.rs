#[cfg(test)]
mod interpolation {
    use::cal_core::{
        newton_divided_core,
        lagrange_core,
        spline_core
    };

    fn sample_i() -> (Vec<f64>, Vec<f64>, f64) {
        let x: Vec<f64> = vec![
            0., 20000., 40000., 60000., 80000.
        ];
        let y: Vec<f64> = vec![
            9.81, 9.7487, 9.6879, 9.6879, 9.5682
        ];
        let target_x = 42000.;

        (x, y, target_x)
    }

    fn sample_ii() -> (Vec<f64>, Vec<f64>, f64) {
        let x: Vec<f64> = vec![
            1., 2., 3., 5., 6.
        ];
        let y: Vec<f64> = vec![
            4.75, 4., 5.25, 19.45, 36.
        ];
        let target_x = 2.5;

        (x, y, target_x)
    }

    #[test]
    fn test_newton_divided() {
        let (x, y, target_x) = sample_i();
        let result = newton_divided_core(x, y, target_x).unwrap();
        for coeff in result.coefficient {
            print!("{} ", coeff);
        }
        println!();
        println!("target: {} \n err: {}", result.target_y, result.error);
    }

    #[test]
    fn test_lagrange() {
        let (x, y, target_x) = sample_i();
        let result = lagrange_core(x, y, target_x).unwrap();
        for coeff in result.coefficient {
            print!("{} ", coeff);
        }
        println!();
        println!("target: {} \n err: {}", result.target_y, result.error);
    }

    #[test]
    fn test_spline_linear() {
        let (x, y, target_x) = sample_ii();
        let result = spline_core(x, y, target_x, 1).unwrap();
        for list in result.equation {
            for eq in list {
                print!("{} ", eq);
            }
            println!();
        }
        println!();
        match result.guass_result {
            Some(vec) => {
                for rs in vec {
                    print!("{}", rs);
                }
            },
            None => println!("None of guass result"),
        }
        println!();
        println!("target: {} \n err: {}", result.target_y, result.error);
    }

    #[test]
    fn test_spline_poly() {
        let (x, y, target_x) = sample_ii();
        let result = spline_core(x, y, target_x, 2).unwrap();
        for list in result.equation {
            for eq in list {
                print!("{} ", eq);
            }
            println!();
        }
        println!();
        match result.guass_result {
            Some(vec) => {
                for rs in vec {
                    println!("{} ", rs);
                }
            },
            None => println!("None of guass result"),
        }
        println!();
        println!("target: {} \n err: {}", result.target_y, result.error);
    }
}