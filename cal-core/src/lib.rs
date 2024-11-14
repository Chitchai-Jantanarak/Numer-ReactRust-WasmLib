mod root_eq;
mod linear_eq;
mod utils;

use serde::{Serialize};
use meval::Expr;
use wasm_bindgen::prelude::*;


#[cfg(test)]
mod tests {
    use linear_eq::{guass_jordan_core, inverse_matrix_core};

    use super::*;
    use crate::linear_eq::{cramer_core, guass_naive_core};

    // #[test]
    // fn test_bisection_invalid_bounds() {
    //     let equation = "x^2 - 4";
    //     let xl = 3.0; // Bounds that don't bracket the root
    //     let xr = 1.0;

    //     let result = bisection_core(equation, xl, xr);

    //     // Assert that the result is Err
    //     assert!(result.is_err());
    //     assert_eq!(result.err().unwrap(), "Invalid interval: xl must be less than xr");
    // }

    // #[test]
    // fn test_bisection_invalid_equation() {
    //     let equation = "x^2 -"; // Invalid equation
    //     let xl = 1.0;
    //     let xr = 3.0;

    //     let result = bisection_core(equation, xl, xr);

    //     // Assert that the result is Err
    //     assert!(result.is_err());
    //     assert_eq!(result.err().unwrap(), "Invalid function");
    // }

    // #[test]
    // fn test_cramer_valid_case() {
    //     let mat = vec![2.0, 1.0, -1.0, 
    //                 -3.0, -1.0, 2.0, 
    //                 -2.0, 1.0, 2.0];
    //     let ans = vec![8.0, -11.0, -3.0];
    //     let rows = 3;

    //     let result = cramer_core(mat, rows, ans);

    //     assert!(result.is_ok());
    //     if let Ok(cramer_result) = result {
    //         assert!((cramer_result.det_true).abs() == 1.0);
    //         assert_eq!(cramer_result.value.len(), rows);
    //         assert!((cramer_result.value[0] - 2.0).abs() < 1e-6);
    //         assert!((cramer_result.value[1] - 3.0).abs() < 1e-6);
    //         assert!((cramer_result.value[2] - -1.0).abs() < 1e-6);
    //     }
    // }

    // #[test]
    // fn test_cramer_non_square() {
    //     let mat = vec![1.0, 2.0, 3.0, 
    //                 4.0, 5.0, 6.0];
    //     let ans = vec![7.0, 8.0];
    //     let rows = 2;

    //     let result = cramer_core(mat, rows, ans);

    //     assert!(result.is_err());
    //     // assert_eq!(result.unwrap_err(), "Matrix is not square".to_string());
    // }


    // #[test]
    // fn test_cramer_zero_determinant() {
    //     let mat = vec![1.0, 2.0, 3.0, 
    //                 4.0, 5.0, 6.0, 
    //                 7.0, 8.0, 9.0];
    //     let ans = vec![10.0, 11.0, 12.0];
    //     let rows = 3;

    //     let result = cramer_core(mat, rows, ans);

    //     assert!(result.is_err());
    //     // assert_eq!(result.unwrap_err(), "The determinant of true matrix is 0".to_string());
    // }

    #[test]
    fn test_cramer_valid_case() {
        let mat = vec![
            2.0, 1.0, -1.0, 
            -3.0, -1.0, 2.0, 
            -2.0, 1.0, 2.0
        ];
        let ans = vec![8.0, -11.0, -3.0];
        let rows = 3;

        let result = cramer_core(mat, rows, ans);

        assert!(result.is_ok());
        if let Ok(cramer_result) = result {
            assert!((cramer_result.det_true - -1.0).abs() < 1e-6);
            assert_eq!(cramer_result.value.len(), rows);
            assert!((cramer_result.value[0] - 2.0).abs() < 1e-6);
            assert!((cramer_result.value[1] - 3.0).abs() < 1e-6);
            assert!((cramer_result.value[2] - -1.0).abs() < 1e-6);
        }
    }

    #[test]
    fn test_cramer_invalid_case() {
        let mat = vec![1.0, 2.0, 3.0];
        let ans = vec![4.0];
        let rows = 2;

        let result = cramer_core(mat, rows, ans);

        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Matrix is not square: 2 * 1");
    }

    #[test]
    fn test_guass_valid_case() {
        let mat = vec![
            2.0, 1.0, -1.0, 
            -3.0, -1.0, 2.0, 
            -2.0, 1.0, 2.0
        ];
        let ans = vec![8.0, -11.0, -3.0];
        let rows = 3;
    
        let result = guass_jordan_core(mat, rows, ans);
    
        assert!(result.is_ok());
        if let Ok(guass_result) = result {
            assert_eq!(guass_result.value.len(), rows);
    
            // Use a small tolerance for floating-point comparison
            let tolerance = 1e-6;
            assert!((guass_result.value[0] - 2.0).abs() < tolerance, "Expected 2.0, got {}", guass_result.value[0]);
            assert!((guass_result.value[1] - 3.0).abs() < tolerance, "Expected 3.0, got {}", guass_result.value[1]);
            assert!((guass_result.value[2] + 1.0).abs() < tolerance, "Expected -1.0, got {}", guass_result.value[2]);
        }
    }
    

    #[test]
    fn test_guass_invalid_case() {
        let mat = vec![1.0, 2.0, 3.0];
        let ans = vec![4.0];
        let rows = 2;

        let result = guass_naive_core(mat, rows, ans);

        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Matrix is not square");
    }


    #[test]
    fn test_inverse_matrix() {
        let mat = vec![
            2.0, 1.0, -1.0,
            -3.0, -1.0, 2.0,
            -2.0, 1.0, 2.0,
        ];
        let ans = vec![8.0, -11.0, -3.0];
        let rows = 3;

        let result = inverse_matrix_core(mat, rows, ans);

        assert!(result.is_ok());
        if let Ok(guass_result) = result {
            assert_eq!(guass_result.value.len(), rows);

            // Use a small tolerance for floating-point comparison
            let tolerance = 1e-6;
            assert!((guass_result.value[0] - 2.0).abs() < tolerance, "Expected 2.0, got {}", guass_result.value[0]);
            assert!((guass_result.value[1] - 3.0).abs() < tolerance, "Expected 3.0, got {}", guass_result.value[1]);
            assert!((guass_result.value[2] + 1.0).abs() < tolerance, "Expected -1.0, got {}", guass_result.value[2]);
        }
    }


}


