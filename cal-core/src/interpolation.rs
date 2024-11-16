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



// wasm conversion JsValue

#[wasm_bindgen]
pub fn newton(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> JsValue {
    match newton_core(x, y, target_x) {
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





// Add implement method

pub(crate) fn newton_core(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> Result<InterpolationResult, String> {
    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
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
    let mut result = 0.0;
    for i in 0..=degree {
        let mut term = coeff[i];
        for j in 0..i {
            term *= target_x - sorted_x[j];
        }
        result += term;
    }

    // Exact calc
    let mut idx = 0;
    while idx < degree && target_x > sorted_x[idx + 1] {
        idx += 1;
    }

    let exact = if idx == degree {
        sorted_y[idx]
    } else {
        sorted_y[idx] + (sorted_y[idx + 1] - sorted_y[idx]) / (sorted_x[idx + 1] - sorted_x[idx]) * (target_x - sorted_x[idx])
    };

    let error: f64 = utils::error_calc(exact, result);

    Ok(InterpolationResult {
        coefficient: coeff,
        target_y: result,
        error
    })
}

pub(crate) fn lagrange_core(x: Vec<f64>, y: Vec<f64>, target_x: f64) -> Result<InterpolationResult, String> {
    if x.len() != y.len() {
        return Err("X & Y is not matches".to_string());
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
    let mut result = 0.0;
    for i in 0..=degree {
        result += coeff[i] * sorted_y[i];
    }

    // Exact calc
    let mut idx = 0;
    while idx < degree && target_x > sorted_x[idx + 1] {
        idx += 1;
    }

    let exact = if idx == degree {
        sorted_y[idx]
    } else {
        sorted_y[idx] + (sorted_y[idx + 1] - sorted_y[idx]) / (sorted_x[idx + 1] - sorted_x[idx]) * (target_x - sorted_x[idx])
    };

    let error: f64 = utils::error_calc(exact, result);

    Ok(InterpolationResult {
        coefficient: coeff,
        target_y: result,
        error
    })
}





// Calculations