// root_eq.rs
use crate::utils;

use serde::Serialize;
use serde_wasm_bindgen::to_value;
use meval::Expr;
use wasm_bindgen::prelude::*; 



// Duplication struct

#[derive(Serialize)] // Serialize the struct
pub(crate) struct BisectionResult {
    pub(crate) iteration: u64,
    pub(crate) xl: f64,
    pub(crate) xr: f64,
    pub(crate) xm: f64,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct FalsePositionResult {
    pub(crate) iteration: u64,
    pub(crate) xl: f64,
    pub(crate) xr: f64,
    pub(crate) xm: f64,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct FixedPointResult {
    pub(crate) iteration: u64,
    pub(crate) x: f64,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct TaylorResult {
    pub(crate) iteration: u64,
    pub(crate) x: f64,
    pub(crate) sum: f64,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct NewtonResult {
    pub(crate) iteration: u64,
    pub(crate) x: f64,
    pub(crate) error: f64
}

#[derive(Serialize)] // Serialize the struct
pub(crate) struct SecantResult {
    pub(crate) iteration: u64,
    pub(crate) x0: f64,
    pub(crate) x1: f64,
    pub(crate) error: f64
}



// wasm conversion JsValue

#[wasm_bindgen]
pub fn bisection(equation: &str, xl: f64, xr: f64) -> JsValue {
    match bisection_core(equation, xl, xr) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn false_position(equation: &str, xl: f64, xr: f64) -> JsValue {
    match false_position_core(equation, xl, xr) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn fixed_point(equation: &str, x: f64) -> JsValue {
    match fixed_point_core(equation, x) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn taylor(equations: Vec<String>, xl: f64, xr: f64) -> JsValue {
    match taylor_core(equations, xl, xr) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn newton_raphson(equation_base: &str, equation_diff: &str, x: f64) -> JsValue {
    match newton_raphson_core(equation_base, equation_diff, x) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}

#[wasm_bindgen]
pub fn secant(equation: &str, x0: f64, x1: f64) -> JsValue {
    match secant_core(equation, x0, x1) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e)
    }
}


// Add implement method

pub(crate) fn bisection_core(equation: &str, mut xl: f64, mut xr: f64) -> Result<Vec<BisectionResult>, String> {
    let expr: Expr = match equation.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
    };

    if xl >= xr {
        return Err(format!("Invalid interval: xl: {} must be less than xr: {}", xl, xr));
    }
    

    let mut result  : Vec<BisectionResult>  = Vec::new();
    let mut xm      : f64                   = bisection_calc(xl, xr);
    let mut err     : f64                   = 100.0;
    let mut xm_prev : f64;

    for iter in 0..100 {

        // let fx_left : f64  = function_calc(expr, xl); <-- unused function
        let fx_right: f64  = utils::evaluate_expr(&expr, xr); 
        let fx_mid  : f64  = utils::evaluate_expr(&expr, xm);

        result.push(BisectionResult {
            iteration: iter + 1,
            xl,
            xr,
            xm,
            error: err
        });

        if fx_mid * fx_right < 0.0 {
            xl = xm;
        }
        else {
            xr = xm;
        }

        xm_prev     = xm;
        xm          = bisection_calc(xl, xr);
        err         = utils::error_calc(xm, xm_prev);
        
        if err < 1e-6 {
            break;
        }
    }

    Ok(result)
}

pub(crate) fn false_position_core(equation: &str, mut xl: f64, mut xr: f64) -> Result<Vec<FalsePositionResult>, String> { 
    let expr: Expr = match equation.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
    };

    if xl >= xr {
        return Err(format!("Invalid interval: xl: {} must be less than xr: {}", xl, xr));
    }

    let mut result  : Vec<FalsePositionResult>  = Vec::new();
    let mut err     : f64                       = 100.0;
    let mut xm      : f64;
    let mut xm_prev : f64;

    for iter in 0..100 {

        let fx_left : f64  = utils::evaluate_expr(&expr, xl);
        let fx_right: f64  = utils::evaluate_expr(&expr, xr); 

        xm = false_position_calc(xl, xr, fx_left, fx_right);
        let fx_mid  : f64  = utils::evaluate_expr(&expr, xm);

        result.push(FalsePositionResult {
            iteration: iter + 1,
            xl,
            xr,
            xm,
            error: err
        });

        if fx_mid * fx_right < 0.0 {
            xl = xm;
        }
        else {
            xr = xm;
        }

        xm_prev = xm;
        err     = utils::error_calc(xm, xm_prev);

        if err < 1e-6 {
            break;
        }
    }

    Ok(result)
}

pub(crate) fn fixed_point_core(equation: &str, mut x: f64) -> Result<Vec<FixedPointResult>, String> {
    let expr: Expr = match equation.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
    };

    let mut result  : Vec<FixedPointResult>  = Vec::new();
    let mut x_prev  : f64                    = 0.0;
    let mut err     : f64                    = 100.0;

    for iter in 0..100 {
        x = utils::evaluate_expr(&expr, x);

        result.push(FixedPointResult {
            iteration: iter+1,
            x,
            error: err
        });
        
        err    = utils::error_calc(x, x_prev);
        x_prev = x;

        if err < 1e-6 {
            break;
        }
    }
    
    Ok(result)
}

pub(crate) fn taylor_core(equations: Vec<String>, xl: f64, xr: f64) -> Result<Vec<TaylorResult>, String> {
    let len          : usize              = equations.len();

    let mut result   : Vec<TaylorResult>  = Vec::new();
    let mut sum      : f64                = 0.0;
    let mut sum_prev : f64                = 0.0;

    for iter in 0..len {
        let expr: Expr = match equations[iter].parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let fac     : usize     = utils::factorial(iter);
        let  x      : f64       = utils::evaluate_expr(&expr, xl);
        let pow     : f64       = if iter != 0 { (xr - xl).powf(iter as f64) } else { 1.0 };

        let term    : f64       =  x * pow / fac as f64;    
        sum    += term;
        
        let err     : f64       = utils::error_calc(sum, sum_prev);

        sum_prev =  sum;
        
        result.push(TaylorResult {
            iteration: iter as u64 +1,
            x,
            sum,
            error: err
        });
    }

    Ok(result)
}

pub(crate) fn newton_raphson_core(equation_base: &str, equation_diff: &str, mut x: f64) -> Result<Vec<NewtonResult>, String> {
    let expr_base: Expr = match equation_base.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
        };
    let expr_diff: Expr = match equation_diff.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
        };

    let mut result  : Vec<NewtonResult>  = Vec::new();

    for iter in 0..100 {
        let x_prev  : f64 = x;
        let fx_base : f64 = utils::evaluate_expr(&expr_base, x);
        let fx_diff : f64 = utils::evaluate_expr(&expr_diff, x);

        x = newton_calc(x, fx_base, fx_diff);
        let err     : f64 = utils::error_calc(x, x_prev);

        result.push(NewtonResult {
            iteration: iter+1,
            x,
            error: err
        });
    }
    
    Ok(result)
}

pub(crate) fn secant_core(equation: &str, mut x0: f64, mut x1: f64) -> Result<Vec<SecantResult>, String> {
    let expr: Expr = match equation.parse() {
        Ok(e)  => e,
        Err(_) => return Err("Invalid function".to_string()),
    };

    let mut result  : Vec<SecantResult>  = Vec::new();

    for iter in 0..100 {
        let fx_x0: f64 = utils::evaluate_expr(&expr, x0);
        let fx_x1: f64 = utils::evaluate_expr(&expr, x1);

        let x2   : f64 = secant_calc(x0, x1, fx_x0, fx_x1);
        let err  : f64 = utils::error_calc(x2, x1);

        x0 = x1;
        x1 = x2;

        result.push(SecantResult {
            iteration: iter+1,
            x0,
            x1,
            error: err
        });
    }

    Ok(result)
}



// Calculations

fn bisection_calc(xl: f64, xr: f64) -> f64 {
    ( xl + xr ) / 2.0
}

fn false_position_calc(xl: f64, xr: f64, fx_left: f64, fx_right: f64) -> f64 {
    ( (xl * fx_right) - (xr * fx_right) ) / (fx_right - fx_left)
}

fn newton_calc(x: f64, fx_base: f64, fx_diff: f64) -> f64 {
    x - ( fx_base / fx_diff )
}

fn secant_calc(x0: f64, x1: f64, fx_x0: f64, fx_x1: f64) -> f64 {
    x1 - ( fx_x0 * ( (x1 - x0) / (fx_x1 - fx_x0) ) )
}