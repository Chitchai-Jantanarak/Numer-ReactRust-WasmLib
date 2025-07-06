#[cfg(test)]
mod regression {
    use std::vec;

    use cal_core::{
        lsq_regression_core,
        mult_lsq_regression_core,
        generate_combinations
    };

    fn lsq_sample_i() -> (Vec<f64>, Vec<f64>) {
        let x: Vec<f64> = vec![
            10., 15., 20., 30., 40., 50., 60., 70., 80.
        ];
        let y: Vec<f64> = vec![
            5., 9., 15., 18., 22., 30., 35., 38., 43.
        ];

        (x, y)
    }

    fn mult_sample_i() -> (Vec<f64>, Vec<f64>) {
        let x: Vec<f64> = vec![
            1., 0., 2., 3., 4., 2., 1., 
            0., 1., 4., 2., 1., 3., 6., 
            1., 3., 1., 2., 5., 3., 4.
        ];
        let y: Vec<f64> = vec![
            4., -5., -6., 0., -1., -7., -20.
        ];

        (x, y)
    }

    #[test]
    fn test_lsq_regression_d1() {
        let (x, y) = lsq_sample_i();
        let result = lsq_regression_core(x, y, 0).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{} ", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_lsq_regression_d2() {
        let (x, y) = lsq_sample_i();
        let result = lsq_regression_core(x, y, 2).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{} ", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_lsq_regression_d10() {
        let (x, y) = lsq_sample_i();
        let result = lsq_regression_core(x, y, 10).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{} ", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }


    #[test]
    fn test_mult_regression_d0() {
        let (x, y) = mult_sample_i();
        let result = mult_lsq_regression_core(x, y, vec![0, 0, 0]).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{:.2}\t\t", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_mult_regression_d1() {
        let (x, y) = mult_sample_i();
        let result = mult_lsq_regression_core(x, y, vec![1, 1, 1]).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{:.2}\t\t", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_mult_regression_dn() {
        let (x, y) = mult_sample_i();
        let result = mult_lsq_regression_core(x, y, vec![3, 0, 1]).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{:.2}\t\t", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_mult_regression_d5() {
        let (x, y) = mult_sample_i();
        let result = mult_lsq_regression_core(x, y, vec![5, 5, 5]).unwrap();

        println!("MAT");
        for i in result.matrix {
            for j in i.iter() {
                print!("{:.2}\t\t", j);
            }
            println!();
        }
        println!();

        println!("SOL");
        for val in result.solution.iter() {
            println!("{} ", val);
        }
        println!();

        println!("ANS");
        for val in result.answer.iter() {
            println!("{} ", val);
        }
        println!();
    }
    

    // IMPORTANT: Testing the possibilities how many x are includes
    #[test]
    fn test_combinations() {
        let result = generate_combinations(vec![
            4, 1, 2
        ]);

        for i in result {
            for j in i {
                print!("{} ", j);
            }
            println!();
        }
    }
}