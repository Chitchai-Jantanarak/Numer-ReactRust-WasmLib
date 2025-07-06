// regression.rs
use crate::utils::{self};

use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*; 



// Duplication struct

#[derive(Serialize)] // Serialize the struct
pub(crate) struct RegressionResult {
    pub(crate) matrix: Vec<Vec<f64>>,
    pub(crate) solution: Vec<f64>,
    pub(crate) answer: Vec<f64>
}



// wasm conversion JsValue

#[wasm_bindgen]
pub fn lsq_regression(x: Vec<f64>, y: Vec<f64>, degree: u32) -> JsValue {
    match lsq_regression_core(x, y, degree) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn mult_lsq_regression(x: Vec<f64>, y: Vec<f64>, degree: Vec<u32>) -> JsValue {
    match mult_lsq_regression_core(x, y, degree) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn combinations_regression(sizes: Vec<u32>) -> JsValue {
    let result = generate_combinations(sizes);
    to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}



// Calculations

pub(crate) fn lsq_regression_core(x: Vec<f64>, y: Vec<f64>, degree: u32) -> Result<RegressionResult, String> {

    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
    }

    // Sorted by x for easier calculation
    let (sorted_x, sorted_y) = utils::pair_sort_asc(x.clone(), y.clone(), 1);

    let mat_size: usize = (degree + 1) as usize;
    let mut mat: Vec<Vec<f64>> = vec![vec![0.0; mat_size]; mat_size];
    let mut ans: Vec<f64> = vec![0.0; mat_size];

    for i in 0..mat_size {
        for j in 0..mat_size {

            if i == 0 && j == 0 {
                mat[i][j] = x.len() as f64;
            }
            else {
                mat[i][j] = sorted_x.iter().map(|&value| value.powi((i + j) as i32)).sum();
            }

        }

        // x is cooperate(matches) between y
        ans[i] = sorted_x.iter().zip(&sorted_y)
                                .map(|(&x_val, &y_val)| y_val * x_val.powi(i as i32))
                                .sum();
    }

    
    match utils::guass(&mat, &ans) {
        Ok(result) => {
            
            Ok(RegressionResult {
                matrix: mat,
                solution: ans,
                answer: result 
            })
        },
        Err(e) => return Err(e),
    }
}

pub(crate) fn mult_lsq_regression_core(x: Vec<f64>, y: Vec<f64>, degree: Vec<u32>) -> Result<RegressionResult, String> {
    
    if x.len() % degree.len() != 0 {
        return Err("Datas incomplete".to_string());
    }
    
    if x.len() / degree.len() != y.len() {
        return Err("X & Y is not matches".to_string());
    }

    // no sorting cause of the y if always be matches for every row at x
    if degree.iter().all(|&value| value == 1)  {
        // LINEAR
        return mult_linear_lsq_calc(x, y, degree);
    }
    else {
        // POLYNOMIAL + CONSTANT
        return mult_polynomial_lsq_calc(x, y, degree);
    }
}



// Calculations

fn mult_linear_lsq_calc(x: Vec<f64>, y: Vec<f64>, degree: Vec<u32>) -> Result<RegressionResult, String>{
    let mat_size: usize = degree.len() + 1;

    let mut mat: Vec<Vec<f64>> = vec![vec![0.0; mat_size]; mat_size];
    let mut ans: Vec<f64>      = vec![0.0; mat_size];
    let datas  : Vec<Vec<f64>> = degree.iter().enumerate().map(|(index, &_value)| {
        let start = x.len() * index / degree.len();
        let end = x.len() * (index + 1) / degree.len();
        x[start..end].to_vec()
    }).collect();

    for i in 0..mat_size {
        for j in 0..mat_size {
            mat[i][j] = match (i, j) {
                (0, 0) => y.len() as f64,
                (0, _) => datas[j - 1].iter().sum(),
                (_, 0) => datas[i - 1].iter().sum(),
                _ => datas[i - 1]
                    .iter()
                    .zip(&datas[j - 1])
                    .map(|(&x, &y)| x * y)
                    .sum(),
            };
        }

        // x is cooperate(matches) between y
        ans[i] = if i != 0 {
                y.iter().zip(datas[i - 1].iter())
                .map(|(&value_x, &value_y)| value_x * value_y)
                .sum()
            }
            else {
                y.iter().sum()
            }
    }

    match utils::guass(&mat, &ans) {
        Ok(result) => {
            
            Ok(RegressionResult {
                matrix: mat,
                solution: ans,
                answer: result 
            })
        },
        Err(e) => return Err(e),
    }
}

fn mult_polynomial_lsq_calc(x: Vec<f64>, y: Vec<f64>, degree: Vec<u32>) -> Result<RegressionResult, String>{

    // combinations include the 0 deg.
    let combinations = generate_combinations(degree.iter().map(|&deg| deg+1).collect());
    let size = combinations.len();

    let mut mat: Vec<Vec<f64>> = vec![vec![0.0; size]; size];
    let mut ans: Vec<f64>      = vec![0.0; size];
    let datas  : Vec<Vec<f64>> = degree.iter().enumerate().map(|(index, &_value)| {
        let start = x.len() * index / degree.len();
        let end = x.len() * (index + 1) / degree.len();
        x[start..end].to_vec()
    }).collect();

    
    for i in 0..size {
        for j in 0..size {

            mat[i][j] = match (i, j) {
                (0, 0) => datas[0].len() as f64,
                (_, 0) => mat[j][i],
                _ => {
                    let mut term: Vec<Vec<f64>> = Vec::new();

                    for (k, &comb) in combinations[j].iter().enumerate() {
                        if comb == 0 {
                            continue;
                        }
                        
                        let powered_datas: Vec<f64> = datas[k]
                            .iter()
                            .map(|&value| value.powi(
                                (
                                combinations[i][k]) as i32 + 
                                combinations[j][k] as i32)
                                )
                            .collect();
                        term.push(powered_datas);
                    }

                    if term.is_empty() || term[0].is_empty() {
                        return Err(format!("Invalid term matrix generated at {} {}", i, j));
                    }

                    let result_term = (0..term[0].len())
                        .map(|col| {
                            term.iter().map(|row| row[col]).product::<f64>()
                        })
                        .sum();

                    result_term
                },
            }
        }

        let mut term: Vec<Vec<f64>> = Vec::new();
        term.push(y.clone());

        for (k, &comb) in combinations[i].iter().enumerate() {
            if comb == 0 {
                continue;
            }
            
            let powered_values: Vec<f64> = datas[k]
                .iter()
                .map(|&value| value.powi(comb as i32))
                .collect();
            term.push(powered_values);
        }
        
        let result_term: f64 = (0..term[0].len())
            .map(|col| {
                term.iter().map(|row| row[col]).product::<f64>()
            })
            .sum();

        ans[i] = result_term;
        
    }

    match utils::guass(&mat, &ans) {
        Ok(result) => {
            
            Ok(RegressionResult {
                matrix: mat,
                solution: ans,
                answer: result 
            })
        },
        Err(e) => return Err(e),
    }
}

// NOTE: Generate deg + 1 rom this ctx.
pub(crate) fn generate_combinations(sizes: Vec<u32>) -> Vec<Vec<u32>> {
    let mut result = Vec::new();
    let mut indices = vec![0; sizes.len()];
    
    loop {
        // clone the indice template where collect old value
        result.push(indices.clone());
        
        // set as while loop for counting combinations
        let mut i = sizes.len() - 1;
        while i > 0 { 
            if indices[i] < sizes[i] - 1 { // condition when indices is not max stack
                indices[i] += 1;
                break;
            } 
            else { // condition when counter the next index (that indication is full)
                indices[i] = 0;
                i -= 1;
            }
        }

        // Prevent as a last character (highest num at x0)
        if i == 0 {
            if indices[0] < sizes[0] - 1 { // last index but not maximum
                indices[0] += 1;
            } 
            else {
                break;
            }
        }
    }

    result
}