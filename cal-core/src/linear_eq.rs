// linear_eq.rs
use crate::utils::{self};

use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*; 



// Duplication struct

#[derive(Serialize)] // Serialize the struct
pub(crate) struct CramerResult {
    pub(crate) det_true: f64,
    pub(crate) det_iter: Vec<f64>,
    pub(crate) value: Vec<f64>
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct GuassResult {
    pub(crate) value: Vec<f64>
} 

#[derive(Serialize)] // Serialize the struct
pub(crate) struct InverseResult {
    pub(crate) inverse_mat: Vec<Vec<f64>>,
    pub(crate) value: Vec<f64>
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct DecompositionResult {
    pub(crate) lower_mat: Vec<Vec<f64>>,
    pub(crate) upper_mat: Vec<Vec<f64>>,
    pub(crate) forward_value: Vec<f64>,
    pub(crate) backward_value: Vec<f64>
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct LinearIterationResult {
    pub(crate) iteration: u64,
    pub(crate) x: Vec<f64>,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct ConjugateResult {
    pub(crate) iteration: u64,
    pub(crate) x: Vec<f64>,
    pub(crate) residual: Vec<f64>,
    pub(crate) direction: Vec<f64>,
    pub(crate) error: f64,
    pub(crate) lambda: f64,
    pub(crate) alpha: f64
}



// wasm conversion JsValue

#[wasm_bindgen]
pub fn cramer(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match cramer_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn guass_naive(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match guass_naive_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn guass_jordan(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match guass_jordan_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn inverse_matrix(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match inverse_matrix_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn lu_decomposition(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match lu_decomposition_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn cholesky(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> JsValue {
    match cholesky_core(mat, rows, ans) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn jacobi(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> JsValue {
    match jacobi_core(mat, rows, ans, init) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn guass_seidel(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> JsValue {
    match guass_seidel_core(mat, rows, ans, init) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn over_relaxation(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>, omega: f64) -> JsValue {
    match over_relaxation_core(mat, rows, ans, init, omega) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn conjugate_gradient(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> JsValue {
    match cg_core(mat, rows, ans, init) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}



// Add implement method

pub(crate) fn cramer_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<CramerResult, String> {

    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix      : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let det_true    : f64           = utils::det(&matrix);
    let mut det_iter: Vec<f64>      = Vec::new();
    let mut answer  : Vec<f64>      = Vec::new();


    if det_true.abs() < 1e-12 {
        return Err("The determinant of true matrix is 0".to_string());
    }
    /*
     * rows is named as size  
     * iter is start when passed at true det
     */
    for i in 0..rows {
        let mut mod_mat = matrix.clone();
        for j in 0..rows {
            mod_mat[j][i] = ans[j];
        }

        det_iter.push(utils::det(&mod_mat));
    }

    for det in &det_iter {
        answer.push(det / det_true);
    }


    let result: CramerResult = CramerResult{
        det_true,
        det_iter,
        value: answer
    };

    Ok(result)
}

pub(crate) fn guass_naive_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<GuassResult, String> {

    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix          : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let mut aug_matrix  : Vec<Vec<f64>> = matrix.clone();
    let size            : usize         = matrix.len();

    for i in 0..rows {
        aug_matrix[i].push(ans[i]);
    }

    for i in 0..size {
        let mut max_row: usize = i;
        for j in i+1 ..size {
            if aug_matrix[j][i].abs() >aug_matrix[max_row][i].abs() {
                max_row = j;
            }
        }

        if max_row != i {
            aug_matrix.swap(i, max_row);
        }

        if aug_matrix[i][i].abs() < 1e-12 {
            return Err("Matrix is no unique solution".to_string());
        }


        for j in i + 1..size {
            let ratio: f64 = aug_matrix[j][i] / aug_matrix[i][i];
            for k in i..=size {
                aug_matrix[j][k] -= ratio * aug_matrix[i][k];
            }
        }
    }

    let mut solution: Vec<f64> = vec![0.0; rows];
    for i in (0..size).rev() {
        solution[i] = aug_matrix[i][size] / aug_matrix[i][i];
        for j in (0..i).rev() {
            aug_matrix[j][size] -= aug_matrix[j][i] * solution[i];
        }
    }

    Ok(GuassResult {
        value: solution
    })
}

pub(crate) fn guass_jordan_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<GuassResult, String> {

    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix          : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let mut aug_matrix  : Vec<Vec<f64>> = matrix.clone();
    let size            : usize         = matrix.len();

    for i in 0..rows {
        aug_matrix[i].push(ans[i]);
    }

    for i in 0..size {
        let mut max_row: usize = i;
        for j in i+1 ..size {
            if aug_matrix[j][i].abs() >aug_matrix[max_row][i].abs() {
                max_row = j;
            }
        }

        if max_row != i {
            aug_matrix.swap(i, max_row);
        }

        if aug_matrix[i][i] .abs() < 1e-12 {
            return Err("Matrix is no unique solution".to_string());
        }

        let pivot: f64 = aug_matrix[i][i];
        for j in 0..=size {
            aug_matrix[i][j] /= pivot;
        }

        for j in 0..size {
            if j != i {
                let ratio: f64 = aug_matrix[j][i];
                for k in 0..=size {
                    aug_matrix[j][k] -= ratio * aug_matrix[i][k];
                }
            }
        }
    }

    let solution: Vec<f64> = aug_matrix.iter().map(|row| row[size]).collect();

    Ok(GuassResult {
        value: solution
    })
}

pub(crate) fn inverse_matrix_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<InverseResult, String> {
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix          : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let mut aug_matrix  : Vec<Vec<f64>> = matrix.clone();
    let size            : usize         = matrix.len();

    if utils::det(&matrix).abs() < 1e-12 {
        return Err("Determinant is 0. Inverse matrix doesn't exist".to_string())
    }

    // Add inverse matrix (I)
    for i in 0..size {
        aug_matrix[i].extend((0..size).map(|j| if i == j { 1.0 } else { 0.0 }));
    }

    for i in 0..size {
        let mut max_row: usize = i;
        for j in i+1 ..size {
            if aug_matrix[j][i].abs() >aug_matrix[max_row][i].abs() {
                max_row = j;
            }
        }

        if max_row != i {
            aug_matrix.swap(i, max_row);
        }

        if aug_matrix[i][i].abs() < 1e-12 {
            return Err("Matrix is no unique solution".to_string());
        }

        let pivot: f64 = aug_matrix[i][i];
        for j in 0..aug_matrix[i].len() {
            aug_matrix[i][j] /= pivot;
        }

        for j in 0..size {
            if j != i {
                let ratio: f64 = aug_matrix[j][i];
                for k in 0..aug_matrix[i].len() {
                    aug_matrix[j][k] -= ratio * aug_matrix[i][k];
                }
            }
        }
    }

    let mut inverse_mat: Vec<Vec<f64>> = vec![vec![0.0; size]; size];
    for i in 0..size {
        for j in 0..size {
            inverse_mat[i][j] = aug_matrix[i][j + size] / aug_matrix[i][i];
        }
    }

    let value: Vec<f64> = utils::mat_imul_vec(&inverse_mat, &ans);

    Ok(InverseResult {
        inverse_mat,
        value
    })
}

pub(crate) fn lu_decomposition_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<DecompositionResult, String> {

    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let (lower, upper)  = lu_decomposition_generate(matrix);

    let lower_result: Vec<f64>;
    // forward substitution
    match utils::guass(&lower, &ans) {
        Ok(result) => lower_result = result,
        Err(e) => return Err(format!("guassian calculation error: {}", e)),
    }

    let upper_result: Vec<f64>;
    // backward substitution
    match utils::guass(&upper, &lower_result) {
        Ok(result) => upper_result = result,
        Err(e) => return Err(format!("guassian calculation error: {}", e)),
    }

    Ok(DecompositionResult {
        lower_mat: lower,
        upper_mat: upper,
        forward_value: lower_result,
        backward_value: upper_result
    })
}

pub(crate) fn cholesky_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<DecompositionResult, String> {
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);

    if !utils::is_positive_definite(&matrix) {
        return Err("Matrix is not positive definite".to_string());
    }

    let (lower, upper);

    match cholesky_generate(matrix) {
        Ok(result) => {
            lower = result.0;
            upper = result.1;
        }
        Err(e) => return Err(e),
    }

    let lower_result: Vec<f64>;
    // forward substitution
    match utils::guass(&lower, &ans) {
        Ok(result) => lower_result = result,
        Err(e) => return Err(format!("guassian calculation error: {}", e)),
    }

    let upper_result: Vec<f64>;
    // backward substitution
    match utils::guass(&upper, &lower_result) {
        Ok(result) => upper_result = result,
        Err(e) => return Err(format!("guassian calculation error: {}", e)),
    }

    Ok(DecompositionResult {
        lower_mat: lower,
        upper_mat: upper,
        forward_value: lower_result, 
        backward_value: upper_result 
    })
}

pub(crate) fn jacobi_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> Result<Vec<LinearIterationResult>, String> {
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let x_size : usize         = ans.len();

    let mut x_old  : Vec<f64>   = init.clone();
    let mut x_new  : Vec<f64>   = vec![0.0; x_size];
    let mut result : Vec<LinearIterationResult> = Vec::new();

    // init
    result.push(LinearIterationResult {
        iteration: 0,
        x: x_old.clone(),
        error: 100.0
    });

    for iter in 0..100 {
        for i in 0..x_size {

            let mut sum: f64 = 0.0;
            for j in 0..x_size {
                if j != i {
                    sum += matrix[i][j] * x_old[j];
                }
            }

            if matrix[i][i].abs() < 1e-12 {
                return Err("Matrix's diagonal elems is 0".to_string());
            }

            x_new[i] = (ans[i] - sum) / matrix[i][i];
        }

        let error: f64 = utils::error_calc(x_new[0], x_old[0]);

        result.push(LinearIterationResult {
            iteration: iter + 1,
            x: x_new.clone(),
            error
        });

        if error < 1e-6 {
            break;
        }

        x_old = x_new.clone();
    }

    Ok(result)
}

pub(crate) fn guass_seidel_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> Result<Vec<LinearIterationResult>, String> {
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let x_size : usize         = ans.len();

    let mut x  : Vec<f64>   = init.clone();
    let mut result : Vec<LinearIterationResult> = Vec::new();

    // init
    result.push(LinearIterationResult {
        iteration: 0,
        x: x.clone(),
        error: 100.0
    });

    for iter in 0..100 {

        let prev_x = x[0];

        for i in 0..x_size {

            let mut sum: f64 = 0.0;
            for j in 0..x_size {
                if j != i {
                    sum += matrix[i][j] * x[j];
                }
            }

            if matrix[i][i].abs() < 1e-12 {
                return Err("Matrix's diagonal elems is 0".to_string());
            }

            x[i] = (ans[i] - sum) / matrix[i][i];
        }

        let error: f64 = utils::error_calc(x[0], prev_x);

        result.push(LinearIterationResult {
            iteration: iter + 1,
            x: x.clone(),
            error
        });

        if error < 1e-6 {
            break;
        }
    }

    Ok(result)
}

pub(crate) fn over_relaxation_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>, omega: f64) -> Result<Vec<LinearIterationResult>, String> {

    if omega <= 0.0 || omega >= 2.0 {
        return Err("Relaxation factor omega must be in (0, 2)".to_string());
    }
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let x_size : usize         = ans.len();

    let mut x  : Vec<f64>   = init.clone();
    let mut result : Vec<LinearIterationResult> = Vec::new();

    // init
    result.push(LinearIterationResult {
        iteration: 0,
        x: x.clone(),
        error: 100.0
    });

    for iter in 0..100 {

        let prev_x = x[0];

        for i in 0..x_size {

            let mut sum: f64 = 0.0;
            for j in 0..x_size {
                if j != i {
                    sum += matrix[i][j] * x[j];
                }
            }

            if matrix[i][i].abs() < 1e-12 {
                return Err("Matrix's diagonal elems is 0".to_string());
            }

            x[i] = ((ans[i] - sum) / matrix[i][i] * omega) + ((1.0 - omega) * x[i]);
        }

        let error: f64 = utils::error_calc(x[0], prev_x);

        result.push(LinearIterationResult {
            iteration: iter + 1,
            x: x.clone(),
            error
        });

        if error < 1e-6 {
            break;
        }
    }

    Ok(result)
}

pub(crate) fn cg_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>, init: Vec<f64>) -> Result<Vec<ConjugateResult>, String> {
    
    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);

    if !utils::is_positive_definite(&matrix) {
        return Err("Matrix is not positive definite".to_string());
    }

    let mut result : Vec<ConjugateResult> = Vec::new();
    
    // Initialize
    let mut x         : Vec<f64> = init.clone();
    let mut residual  : Vec<f64> = utils::vec_sub(&utils::mat_imul_vec(&matrix, &x), &ans);
    let mut direction : Vec<f64> = utils::scalar_mult(&residual, -1.0);
    let mut alpha     : f64 = 0.0;
    let mut error     : f64 = utils::dot_prod_self(&residual).sqrt();

    result.push(ConjugateResult {
        iteration: 0,
        x: x.clone(),
        residual: residual.clone(),
        direction: direction.clone(),
        error,
        lambda: -1.0,
        alpha: -1.0
    });

    for iter in 0..100 {
        let a_imul_d = utils::mat_imul_vec(&matrix, &direction);

        // |D^t| * r
        let lambda_numerator = utils::dot_prod(&direction, &residual);
        // |D^t| * AD
        let lambda_denominator = utils::dot_prod(&direction, &a_imul_d);

        // zero-division
        if lambda_denominator.abs() < 1e-12 {
            break;
        }

        // new lambda --> x --> residual
        let lambda   = lambda_numerator / lambda_denominator * -1.0;
        x        = utils::vec_add(&x, &utils::scalar_mult(&direction, lambda));
        residual = utils::vec_sub(&utils::mat_imul_vec(&matrix, &x), &ans);
        error    = (utils::dot_prod_self(&residual)).sqrt();

        result.push(ConjugateResult {
            iteration: iter+1,
            x: x.clone(),
            residual: residual.clone(),
            direction: direction.clone(),
            error,
            lambda,
            alpha
        });


        if error < 1e-6 {
            break;
        }

        // new Alpha --> direction
        let alpha_numerator = utils::dot_prod(&residual, &a_imul_d);
        alpha = alpha_numerator / lambda_denominator;
        direction = utils::vec_add(&utils::scalar_mult(&residual, -1.0), &utils::scalar_mult(&direction, alpha));

    }


    Ok(result)
}



// Calculations

// Create lower-Upper matrix
fn lu_decomposition_generate(mat: Vec<Vec<f64>>) -> (Vec<Vec<f64>>, Vec<Vec<f64>>) {
    let n: usize = mat.len();
    let mut lower: Vec<Vec<f64>> = vec![vec![0.0; n]; n];
    let mut upper: Vec<Vec<f64>> = vec![vec![0.0; n]; n];

    for i in 0..n {

        // diagonal (init)
        upper[i][i] = 1.0;

        // Lower calc
        for j in 0..=i {
            let mut sum = 0.0;
            for k in 0..j {
                sum += lower[i][k] * upper[k][j];
            }
            lower[i][j] = mat[i][j] - sum;
        }

        // Upper
        for j in i + 1..n {
            let mut sum = 0.0;
            for k in 0..i {
                sum += lower[i][k] * upper[k][j];
            }
            upper[i][j] = (mat[i][j] - sum) / lower[i][i];
        }
    }

    (lower, upper)
}

// Create Lower-Upper matrix
fn cholesky_generate(mat: Vec<Vec<f64>>) -> Result< ( Vec<Vec<f64>>, Vec<Vec<f64>> ), String> {
    let n = mat.len();

    let mut lower = vec![vec![0.0; n]; n];

    for i in 0..n {
        for j in 0..=i {
            let mut sum = 0.0;

            // diagonal
            if j == i {
                for k in 0..j {
                    sum += lower[j][k] * lower[j][k];
                }
                let diag_value = mat[j][j] - sum;
                if diag_value <= 0.0 {
                    return Err(format!("Diagonal elements is not positive definite at {}{}", j, j));
                }

                lower[j][j] = (diag_value).sqrt();
            }
            else {

                for k in 0..j {
                    sum += lower[i][k] * lower[j][k];
                }
                lower[i][j] = (mat[i][j] - sum) / lower[j][j];
            }
        }
    }

    let upper = utils::mat_transpose(&lower);

    Ok((lower, upper))
}