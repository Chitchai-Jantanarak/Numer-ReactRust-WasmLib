#[cfg(test)]
mod linear_eq {
    use std::vec;

    use::cal_core::{
        cramer_core,
        guass_naive_core,
        guass_jordan_core,
        inverse_matrix_core,
        lu_decomposition_core,
        cholesky_core,
        jacobi_core,
        guass_seidel_core,
        over_relaxation_core,
        cg_core
    };

    // Singular matrix
    fn sample_i() -> (Vec<f64>, usize, Vec<f64>) {
        let mat = vec![
            6., -2., 2., 4.,
            12., -8., 6., 10.,
            3., -13., 9., 3.,
            -6., 4., 1., -18.
        ];

        let ans = vec![
            16.,
            26.,
            -19.,
            -34.
        ];

        let rows = 4;

        (mat, rows, ans)
    }

    // Positive definite
    fn sample_ii() -> (Vec<f64>, usize, Vec<f64>) {
        let mat = vec![
            5., 2., 0., 0., 
            2., 5., 2., 0., 
            0., 2., 5., 2., 
            0., 0., 2., 5.
        ];

        let ans = vec![
            12.,
            17., 
            14., 
            7.
        ];

        let rows = 4;

        (mat, rows, ans)
    }

    fn sample_iii() -> (Vec<f64>, usize, Vec<f64>, Vec<f64>, f64) {
    // SOR test
        let omega: f64 = 1.25;
        let init: Vec<f64> = vec![0., 0., 0.];
        let mat: Vec<f64> = vec![
            4., -1., 1.,
            -2., 6., 1., 
            -1., 1., 7.
        ];
        let ans: Vec<f64> = vec![7., 9., -6.];

        (mat, 3, ans, init, omega)
    }

    #[test]
    fn test_cramer() {
        let (mat, rows, ans) = sample_i();
        let result = cramer_core(mat, rows, ans).unwrap();
        println!("det_true: {}", result.det_true);

        println!("det_iter:");
        for (i, d) in result.det_iter.iter().enumerate() {
            println!("  det_iter[{}] = {}", i, d);
        }

        println!("value:");
        for (i, v) in result.value.iter().enumerate() {
            println!("  value[{}] = {}", i, v);
        }
    }

    #[test]
    fn test_guass_naive() {
        let (mat, rows, ans) = sample_i();
        let result = guass_naive_core(mat, rows, ans).unwrap();
        for (i, v) in (result.value).iter().enumerate() {
            println!("[result{}]: {}", i, v);
        }
    }

    #[test]
    fn test_guass_jordan() {
        let (mat, rows, ans) = sample_i();
        let result = guass_jordan_core(mat, rows, ans).unwrap();
        for (i, v) in (result.value).iter().enumerate() {
            println!("[result{}]: {}", i, v);
        }
    }

    #[test]
    fn test_inverse_matrix() {
        let (mat, rows, ans) = sample_i();
        let result = inverse_matrix_core(mat, rows, ans).unwrap();

        for i in result.inverse_mat {
            for (_, val) in i.iter().enumerate() {
                print!("{} ", val);
            }
            println!();
        }

        for (i, v) in (result.value).iter().enumerate() {
            println!("[result{}]: {}", i, v);
        }
    }

    #[test]
    fn test_lu_decomposition() {
        let (mat, rows, ans) = sample_i();
        let result = lu_decomposition_core(mat, rows, ans).unwrap();

        println!("LOWER MAT");
        for i in result.lower_mat {
            for (_, val) in i.iter().enumerate() {
                print!("{} ", val);
            }
            println!();
        }
        println!();

        println!("UPPER MAT");
        for i in result.upper_mat {
            for (_, val) in i.iter().enumerate() {
                print!("{} ", val);
            }
            println!();
        }
        println!();

        println!("FORWARD");
        for val in result.forward_value.iter() {
            println!("{} ", val);
        }
        println!();

        println!("BACKWARD");
        for val in result.backward_value.iter() {
            println!("{} ", val);
        }
        println!();
    }

    #[test]
    fn test_cholesky() {
        let init: Vec<f64> = vec![0., 0., 0., 0.];
        let (mat, rows, ans) = sample_ii();
        let result = jacobi_core(mat, rows, ans, init).unwrap();

        for r in &result {
            println!(
                "iteraions: {} err: {}",
                r.iteration, r.error
            );

            for val in r.x.iter() {
                print!("{} ", val);
            }
            println!();
        }
    }

    #[test]
    fn test_guass_seidel() {
        let init: Vec<f64> = vec![0., 0., 0., 0.];
        let (mat, rows, ans) = sample_ii();
        let result = guass_seidel_core(mat, rows, ans, init).unwrap();

        for r in &result {
            println!(
                "iteraions: {} err: {}",
                r.iteration, r.error
            );

            for val in r.x.iter() {
                print!("{} ", val);
            }
            println!();
        }
    }

    #[test]
    fn test_over_relaxation() {
        let (mat, rows, ans, init, omega) = sample_iii();
        let result = over_relaxation_core(mat, rows, ans, init, omega).unwrap();

        for r in &result {
            println!(
                "iteraions: {} err: {}",
                r.iteration, r.error
            );

            for val in r.x.iter() {
                print!("{} ", val);
            }
            println!();
        }
    }

    #[test]
    fn test_cg() {
        let init = vec![0., 0., 0., 0.];
        let (mat, rows, ans) = sample_ii();
        let result = cg_core(mat, rows, ans, init).unwrap();
        for r in &result {
            println!(
                "iteraions: {} err: {} lambda: {} alpha: {}",
                r.iteration, r.error, r.lambda, r.alpha
            );

            println!("---------- X ----------");
            for val in r.x.iter() {
                print!("{} ", val);
            }
            println!();
            println!("----------RES----------");
            for val in r.residual.iter() {
                print!("{} ", val);
            }
            println!();
            println!("----------DIR----------");
            for val in r.direction.iter() {
                print!("{} ", val);
            }
            println!("\n\n\n\n");
        }
    }    
}