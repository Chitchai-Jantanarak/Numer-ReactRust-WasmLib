// interpolation.rs
use crate::utils::{self};

use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*; 



// Duplication struct

#[derive(Serialize)] // Serialize the struct
pub(crate) struct InterpolationResult {
    pub(crate) coefficient: Vec<f64>,
    pub(crate) target_y: f64,
    pub(crate) error: f64
}

#[derive(Serialize)]
pub(crate) struct SplineResult {
    pub(crate) equation: Vec<Vec<f64>>,
    pub(crate) guass_result: Option<Vec<f64>>,
    pub(crate) target_y: f64,
    pub(crate) error: f64
}



// wasm conversion JsValue

#[wasm_bindgen]
pub fn newton_divided(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> JsValue {
    match newton_divided_core(x, y, target_x) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn lagrange(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> JsValue {
    match lagrange_core(x, y, target_x) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn spline(x: Vec<f64>, y: Vec<f64>, target_x: f64, degree: u32) -> JsValue {
    match spline_core(x, y, target_x, degree) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}



// Add implement method (exact value calculated as linear interpolation)

pub(crate) fn newton_divided_core(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> Result<InterpolationResult, String> {
    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
    }
    if x.len() < 2 || y.len() < 2 {
        return Err("Must have at least 2 points".to_string());
    }

    // Sorted by x for easier calculation
    let (sorted_x, sorted_y) = utils::pair_sort_asc(x.clone(), y.clone(), 1);

    
    let degree = x.len() - 1;
    
    // Terminal point
    if target_x < sorted_x[0] || target_x > sorted_x[degree] {
        return Err("target value is outbounded".to_string());
    }
     
    // Co-efficient calculation
    let mut coeff = y.clone();
    for i in 1..= degree  {
        for j in (i..=degree).rev()  {
            coeff[j] = (coeff[j] - coeff[j - 1]) / (sorted_x[j] - sorted_x[j - i]);
        }
    }

    // Result
    let mut target_y = 0.0;
    for i in 0..=degree {
        let mut term = coeff[i];
        for j in 0..i {
            term *= target_x - sorted_x[j];
        }
        target_y += term;
    }

    let exact = exact_linear_interpolation(&sorted_x, &sorted_y, target_x);

    let error: f64 = utils::error_calc(exact, target_y);

    Ok(InterpolationResult {
        coefficient: coeff,
        target_y,
        error
    })
}

pub(crate) fn lagrange_core(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> Result<InterpolationResult, String> {
    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
    }
    if x.len() < 2 || y.len() < 2 {
        return Err("Must have at least 2 points".to_string());
    }

    // Sorted by x for easier calculation
    let (sorted_x, sorted_y) = utils::pair_sort_asc(x.clone(), y.clone(), 1);

    
    let degree = x.len() - 1;
    
    // Terminal point
    if target_x < sorted_x[0] || target_x > sorted_x[degree] {
        return Err("target value is outbounded".to_string());
    }
     
    // Co-efficient calculation
    let mut coeff = vec![0.0; degree + 1];
    for i in 0..= degree {
        coeff[i] = sorted_x.iter()
            .filter(|&value| *value != sorted_x[i])
            .map(|&value| (value - target_x) / (value - sorted_x[i]))
            .product();
    }

    // Result
    let mut target_y = 0.0;
    for i in 0..=degree {
        target_y += coeff[i] * sorted_y[i];
    }

    let exact = exact_linear_interpolation(&sorted_x, &sorted_y, target_x);

    let error: f64 = utils::error_calc(exact, target_y);

    Ok(InterpolationResult {
        coefficient: coeff,
        target_y,
        error
    })
}

pub(crate) fn spline_core(x: Vec<f64>, y: Vec<f64>, target_x: f64, degree: u32) -> Result<SplineResult, String> {
    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
    }
    if x.len() < 2 || y.len() < 2 {
        return Err("Must have at least 2 points".to_string());
    }

    // Sorted by x for easier calculation
    let (sorted_x, sorted_y) = utils::pair_sort_asc(x.clone(), y.clone(), 1);
    
    if target_x < sorted_x[0] || target_x > sorted_x[sorted_x.len() - 1] {
        return Err("target is out of bounded".to_string());
    }

    match degree {
        1 => match spline_linear(&sorted_x, &sorted_y, target_x) {
            Ok(result) => return Ok(result),
            Err(e) => return Err(e),
        }
        2 | 3 => match spline_polynomial(&sorted_x, &sorted_y, degree, target_x) {
            Ok(result) => return Ok(result),
            Err(e) => return Err(e),
        }
        _ => return Err("Method type is mismatch".to_string()),
    }
}



// Calculations

fn exact_linear_interpolation(x: &Vec<f64>, y: &Vec<f64>, target_x: f64) -> f64 {
    // Exact calc
    let len = x.len();
    let mut idx = 0;

    while idx < len - 1 && target_x > x[idx + 1] {
        idx += 1;
    }

    let exact = if idx == len - 1 {
        y[idx]
    } else {
        y[idx] + (y[idx + 1] - y[idx]) / (x[idx + 1] - x[idx]) * (target_x - x[idx])
    };

    exact
}

fn spline_linear(x: &Vec<f64>, y: &Vec<f64>, target_x: f64) -> Result<SplineResult, String> {
    // Sorted value will be using here
    let mut result: Vec<Vec<f64>> = Vec::new();

    for i in 1..x.len() {
        // guard condition
        if x[i] == x[i - 1] {
            return Err(format!("Duplicate x value where x[{}] == x[{}]", i - 1, i));
        }

        let m: f64 = (y[i] - y[i - 1]) / (x[i] - x[i - 1]);
        let b: f64 = y[i - 1] - (m * x[i - 1]);
        result.push(vec![(i - 1) as f64, i as f64, m, b]);
    }

    let mut target_y = 0.0;
    for row in &result {
        let x1 = row[0];
        let x2 = row[1];

        if target_x > x1 && target_x <= x2 {
            target_y = row[2] * target_x + row[3];
            break;
        }
    }

    let exact = exact_linear_interpolation(x, y, target_x);

    let error = utils::error_calc(exact, target_y);

    Ok(SplineResult {
        equation: result.clone(), 
        guass_result: None, 
        target_y, 
        error 
    })
}

fn spline_polynomial(x: &Vec<f64>, y: &Vec<f64>, degree: u32, target_x: f64) -> Result<SplineResult, String> {
   
    // size is counted by degree e.g. degree 2 result: a^2x + bx + c ( unknown is degree + 1 )
    let line_size = degree as usize + 1;
    let mat_size  = (x.len() - 1) * line_size;
    let mut equation_mat : Vec<Vec<f64>> = vec![vec![0.0; mat_size]; mat_size];
    let mut solution_mat : Vec<f64>      = vec![0.0; mat_size];

    // index indicator (row*) instantiate
    let mut i = 0;
    
    // matrix form unknown equation
        
        // sensitive case
        if degree % 2 == 0 { // quadratic on degree of freedom ( ignore a1 )
            i += 1;
        }

        // linear spline loop
        for iter in 0..x.len() - 1 {
            
            for x_term in iter..=(iter + 1) {
            
                let mut j = line_size * iter;
                
                for deg in (0..=degree).rev() {
                    equation_mat[i][j] = x[x_term].powi(deg as i32);
                    j += 1;
                }

                solution_mat[i] = y[x_term];
                i += 1;
            }
        }

        // Derivative loop (result is ignore by 0.0)
        for diff in 1..degree {

            for (iter, idx) in (1..(x.len() - 1)).enumerate() {
                
                let mut j = line_size * iter;

                for deg in (0..=degree).rev() {
                    // power indicator
                    let n = if deg < diff { 0 } else { deg - diff };
                    let d =  if deg < diff { 0 } else { deg - diff + 1};
                    let diff_result: f64 = (d..=deg).map(|v| v as f64).product(); 

                    equation_mat[i][j] = x[idx].powi(n as i32) * diff_result as f64;
                    j += 1;
                }


                for _ in 0..line_size {
                    equation_mat[i][j] = equation_mat[i][j - line_size] * -1.;
                    j += 1;
                }

                i += 1;
            }
        }

        // degree of freedom 
        if degree % 2 == 0 {
            for row in equation_mat.iter_mut() {
                row[0] = 0.;
            }
        }
        else { // 3rd degree

            let diff = degree - 1;

            for (num, &idx) in [0, x.len() - 1].iter().enumerate() {


                let j_index = if num == 1 { x.len() - 2 } else { 0 };
                let mut j = line_size * j_index ;
            
                for deg in (0..=degree).rev() {
                    let n = if deg < diff { 0 } else { deg - diff };
                    let d = if deg < diff { 0 } else { deg - diff + 1 };
                    let diff_result: f64 = (d..=deg).map(|v| v as f64).product(); 
            
                    equation_mat[i][j] = x[idx].powi(n as i32) * diff_result;
                    j += 1;
                }
            
                i += 1;
            }
        }

    let answer = utils::guass(&equation_mat, &solution_mat);
    match answer {
        Ok(result) => {

            let mut target_y = 0.0;

            let mut idx = 1;
            while !(target_x > x[idx - 1] && target_x <= x[idx]) {
                idx += 1;
            }

            let mut focused_idx = line_size * (idx - 1);
            for deg in (0..=degree).rev() {
                target_y += result[focused_idx] * target_x.powi(deg as i32);
                focused_idx += 1;
            }

            let exact = exact_linear_interpolation(x, y, target_x);
            let error = utils::error_calc(exact, target_y);

            Ok(SplineResult { 
                equation: equation_mat, 
                guass_result: Some(result), 
                target_y, 
                error
            })
        }
        Err(e) => return Err(e),
    }
}