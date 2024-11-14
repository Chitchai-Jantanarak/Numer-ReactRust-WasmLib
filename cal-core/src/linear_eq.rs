// linear_eq.rs
use crate::utils::{self};

use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*; 

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
    pub(crate) value : Vec<f64>
}

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



pub(crate) fn cramer_core(mat: Vec<f64>, rows: usize, ans: Vec<f64>) -> Result<CramerResult, String> {

    let cols: usize = mat.len() / rows;

    if rows != cols {
        return Err(format!("Matrix is not square: {} * {}", rows, cols));
    }

    let matrix      : Vec<Vec<f64>> = utils::mat_conv2d(&mat, rows);
    let det_true    : f64           = utils::det(&matrix);
    let mut det_iter: Vec<f64>      = Vec::new();
    let mut answer  : Vec<f64>      = Vec::new();


    if det_true == 0.0 {
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

        if aug_matrix[i][i] == 0.0 {
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

        if aug_matrix[i][i] == 0.0 {
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

    if utils::det(&matrix) == 0.0 {
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

        if aug_matrix[i][i] == 0.0 {
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


// pub fn lu
// pub fn cholesky
// pub fn jacobi
// pub fn guass_seidel
// pub fn cg