#[cfg(test)]
mod differential {
    use cal_core::{derivative_core, Forward, Backward, Central};

    fn sample() -> (&'static str, f64, f64, Vec<f64>) {
        let equation = "x*x + 3.0*x + 2.0";
        let x = 1.0;
        // let h = 0.0001;
        let h = 1.;
        let true_result = vec![
            5., 2., 0., 0.
        ];

        (equation, x, h, true_result)
    }

    #[test]
    fn test_forward_diff() {
        let (equation, x, h, true_result) = sample();
        for prec in 1..=3 {
            for times in 1..=4 {
                let result = derivative_core::<Forward>(equation, x, h, prec, times, true_result[(times - 1) as usize]).unwrap();
                println!("precision: {}\ndiff times: {}\nresult: {}\ntrue result: {}\nerror: {}\n\n", 
                prec, times, result.result, result.true_value, result.error);
            }
            println!("--------------------------")
        }
    }

    #[test]
    fn test_backward_diff() {
        let (equation, x, h, true_result) = sample();
        for prec in 1..=3 {
            for times in 1..=4 {
                let result = derivative_core::<Backward>(equation, x, h, prec, times, true_result[(times - 1) as usize]).unwrap();
                println!("precision: {}\ndiff times: {}\nresult: {}\ntrue result: {}\nerror: {}\n\n", 
                prec, times, result.result, result.true_value, result.error);
            }
            println!("--------------------------")
        }
    }

    #[test]
    fn test_central_diff() {
        let (equation, x, h, true_result) = sample();
        for prec in 1..=3 {
            for times in 1..=4 {
                let result = derivative_core::<Central>(equation, x, h, prec, times, true_result[(times - 1) as usize]).unwrap();
                println!("precision: {}\ndiff times: {}\nresult: {}\ntrue result: {}\nerror: {}\n\n", 
                prec, times, result.result, result.true_value, result.error);
            }
            println!("--------------------------")
        }
    }
}