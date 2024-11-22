// differential.rs
use crate::utils;

use meval::Expr;
use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;



#[derive(Serialize)] // Serialize the struct
pub(crate) struct DerivativeResult {
    pub(crate) true_value: f64,
    pub(crate) result: f64,
    pub(crate) error: f64
} 



// wasm conversion JsValue

#[wasm_bindgen]
pub fn derivative
(
    equation: &str, 
    x: f64, 
    h: f64, 
    method_type: u32, 
    precision_type: u32, 
    diff_times: u32, 
    true_result: f64
) -> JsValue {

    match derivative_core(equation, x, h, method_type, precision_type, diff_times, true_result) {
        Ok(result) => to_value(&result).unwrap_or_else(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
        Err(e) => JsValue::from_str(&e),
    }
}



// Calc method => Finite difference {REF: https://en.wikipedia.org/wiki/Finite_difference_coefficient#cite_note-5}

/** Structure & implementation
 * 
 * Implementation method
 *   - Forward difference
 *   - Backward difference
 *   - Central difference
 * 
 *  Collecting in form of struct
 * 
 *  Interface for implementing (trait)
 *  function TODO in calculation case with precision & times of differential
 * 
 * */
struct Forward;
struct Backward;
struct Central;
enum Precision {
    First,
    Second,
    Third
}

// No cache for evaluate the function in single call
trait Differential {
    fn first_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String>;
    fn second_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String>;
    fn third_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String>;
    fn fourth_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String>;
}

impl Differential for Forward {

    fn first_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h - fx) / h
            }
            Precision::Second => {
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-1. * fx_h2) + (4. * fx_h) - (3. * fx)) / (2. * h) 
            }  
            Precision::Third  => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((2. * fx_h3) - (9. * fx_h2) + (18. * fx_h) - (11. * fx)) / (6. * h)
            } 
        };

        Ok(result)
    }

    fn second_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h2 - (2. * fx_h) + fx) / (h * h)
            }
            Precision::Second => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-1. * fx_h3) + (4. * fx_h2) - (5. * fx_h) + (2. * fx)) / (h * h) 
            }  
            Precision::Third  => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((11. * fx_h4) - (56. * fx_h3) + (114. * fx_h2) - (104. * fx_h) + (35. * fx)) / (12. * h * h)
            } 
        };

        Ok(result)
    }

    fn third_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h3 - (3. * fx_h2) + (3. * fx_h) - fx) / (h.powi(3))
            }
            Precision::Second => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-3. * fx_h4) + (14. * fx_h3) - (24. * fx_h2) + (18. * fx_h) - (5. * fx)) / (2. * h.powi(3))
            }  
            Precision::Third  => {
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x + h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((14. * fx_h5) - (82. * fx_h4) + (196. * fx_h3) - (236. * fx_h2) + (142. * fx_h) - (34. * fx)) / (8. * h.powi(3))
            } 
        };

        Ok(result)
    }

    fn fourth_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h4 - (4. * fx_h3) + (6. * fx_h2) - (4. * fx_h) + fx) / (h.powi(4))
            }
            Precision::Second => {
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x + h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-2. * fx_h5) + (11. * fx_h4) - (24. * fx_h3) + (26. * fx_h2) - (14. * fx_h)) + (3. * fx) / (h.powi(4))
            }  
            Precision::Third  => {
                let fx_h6 : f64 = utils::evaluate_expr(&expr, x + h * 6.);
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x + h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x + h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((34. * fx_h6) - (228. * fx_h5) + (642. * fx_h4) - (968. * fx_h3) + (822. * fx_h2) - (372. * fx_h) + (70. * fx)) / (12. * h.powi(4))
            } 
        };

        Ok(result)
    }
}

impl Differential for Backward {

    fn first_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx - fx_h) / h
            }
            Precision::Second => {
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h2 - (4. * fx_h) + (3. * fx)) / (2. * h) 
            }  
            Precision::Third  => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-2. * fx_h3) + (9. * fx_h2) - (18. * fx_h) + (11. * fx)) / (6. * h)
            } 
        };

        Ok(result)
    }

    fn second_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-1. * fx_h2) + (2. * fx_h) - fx) / (h * h)
            }
            Precision::Second => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                (fx_h3 - (4. * fx_h2) + (5. * fx_h) - (2. * fx)) / (h * h) 
            }  
            Precision::Third  => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-11. * fx_h4) + (56. * fx_h3) - (114. * fx_h2) + (104. * fx_h) - (35. * fx)) / (12. * h * h)
            } 
        };

        Ok(result)
    }

    fn third_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-1. * fx_h3) + (3. * fx_h2) - (3. * fx_h) + fx) / (h.powi(3))
            }
            Precision::Second => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((3. * fx_h4) - (14. * fx_h3) + (24. * fx_h2) - (18. * fx_h) + (5. * fx)) / (2. * h.powi(3))
            }  
            Precision::Third  => {
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x - h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-14. * fx_h5) + (82. * fx_h4) - (196. * fx_h3) + (236. * fx_h2) - (142. * fx_h) + (34. * fx)) / (8. * h.powi(3))
            } 
        };

        Ok(result)
    }

    fn fourth_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-1. * fx_h4) + (4. * fx_h3) - (6. * fx_h2) + (4. * fx_h) - fx) / (h.powi(4))
            }
            Precision::Second => {
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x - h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((2. * fx_h5) - (11. * fx_h4) + (24. * fx_h3) - (26. * fx_h2) + (14. * fx_h)) - (3. * fx) / (h.powi(4))
            }  
            Precision::Third  => {
                let fx_h6 : f64 = utils::evaluate_expr(&expr, x - h * 6.);
                let fx_h5 : f64 = utils::evaluate_expr(&expr, x - h * 5.);
                let fx_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_h  : f64 = utils::evaluate_expr(&expr, x - h);
                let fx    : f64 = utils::evaluate_expr(&expr, x);
                ((-34. * fx_h6) + (228. * fx_h5) - (642. * fx_h4) + (968. * fx_h3) - (822. * fx_h2) + (372. * fx_h) - (70. * fx)) / (12. * h.powi(4))
            } 
        };

        Ok(result)
    }
}

impl Differential for Central {

    fn first_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                // Positive h
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                (fx_p_h - fx_n_h) / (2. * h)
            }
            Precision::Second => {                
                // Positive h
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                ((-1. * fx_p_h2) + (8. * fx_p_h) - (-8. * fx_n_h) + fx_n_h2) / (12. * h)
            }  
            Precision::Third  => {
                // Positive h
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                (   
                    fx_p_h3 + (-9. * fx_p_h2) + (45. * fx_p_h) -
                    fx_n_h3 + (9. * fx_n_h2) + (-45. * fx_n_h)
                ) / (60. * h)
            } 
        };

        Ok(result)
    }

    fn second_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                // Positive h
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (fx_p_h - (2. * fx) + fx_n_h) / (h * h)
            }
            Precision::Second => {                
                // Positive h
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (
                    (-1. * fx_p_h2) + (16. * fx_p_h) - (30. * fx) + 
                    (-1. * fx_n_h2) + (16. * fx_n_h)
                ) / (12. * h * h)
            }  
            Precision::Third  => {
                // Positive h
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (
                    (2. * fx_p_h3) - (27. * fx_p_h2) + (270. * fx_p_h) - (490. * fx) + 
                    (2. * fx_n_h3) - (27. * fx_n_h2) + (270. * fx_n_h)
                ) / (180. * h * h)
            } 
        };

        Ok(result)
    }

    fn third_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                // Positive h
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                (
                    fx_p_h2 - (2. * fx_p_h) - 
                    fx_n_h2 + (2. * fx_n_h)
                ) / (2. * h.powi(3))
            }
            Precision::Second => {                
                // Positive h
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                (
                    fx_n_h3 - (8. * fx_n_h2) + (13. * fx_n_h) -
                    fx_p_h3 + (8. * fx_p_h2) - (13. * fx_p_h)
                ) / (8. * h.powi(3))
            }  
            Precision::Third  => {
                // Positive h
                let fx_p_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);

                (
                    (7. * fx_p_h4) - (72. * fx_p_h3) + (338. * fx_p_h2) - (488. * fx_p_h) -
                    (7. * fx_n_h4) + (72. * fx_n_h3) - (338. * fx_n_h2) + (488. * fx_n_h)
                ) / (240. * h.powi(3))
            } 
        };

        Ok(result)
    }

    fn fourth_derivative(&self, equation: &str, x: f64, h: f64, precision: Precision) -> Result<f64, String> {
        
        let expr: Expr = match equation.parse() {
            Ok(e)  => e,
            Err(_) => return Err("Invalid function".to_string()),
        };

        let result: f64 = match precision {
            Precision::First  => {
                // Positive h
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (
                    fx_p_h2 - (4. * fx_p_h) + fx + 
                    fx_n_h2 - (4. * fx_n_h)
                ) / (h.powi(4))
            }
            Precision::Second => {                
                // Positive h
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (
                    (-2. * fx_p_h3) + (24. * fx_p_h2) - (78. * fx_p_h) + (112. * fx) + 
                    (-2. * fx_n_h3) + (24. * fx_n_h2) - (78. * fx_n_h)
                ) / (12. * h.powi(4))
            }  
            Precision::Third  => {
                // Positive h
                let fx_p_h4 : f64 = utils::evaluate_expr(&expr, x + h * 4.);
                let fx_p_h3 : f64 = utils::evaluate_expr(&expr, x + h * 3.);
                let fx_p_h2 : f64 = utils::evaluate_expr(&expr, x + h * 2.);
                let fx_p_h  : f64 = utils::evaluate_expr(&expr, x + h);
                // Negative h
                let fx_n_h4 : f64 = utils::evaluate_expr(&expr, x - h * 4.);
                let fx_n_h3 : f64 = utils::evaluate_expr(&expr, x - h * 3.);
                let fx_n_h2 : f64 = utils::evaluate_expr(&expr, x - h * 2.);
                let fx_n_h  : f64 = utils::evaluate_expr(&expr, x - h);
                // Expr x
                let fx      : f64 = utils::evaluate_expr(&expr, x);

                (
                    (7. * fx_p_h4) - (96. * fx_p_h3) + (676. * fx_p_h2) - (1952. * fx_p_h) + (2730. * fx) + 
                    (7. * fx_n_h4) - (96. * fx_n_h3) + (676. * fx_n_h2) - (1952. * fx_n_h)
                ) / (240. * h.powi(4))
            } 
        };

        Ok(result)
    }
}

fn get_precision(count: u32) -> Result<Precision, String> {
    match count {
        1 => Ok(Precision::First),
        2 => Ok(Precision::Second),
        3 => Ok(Precision::Third),
        _ => Err("Precision is mismatch".to_string())
    }
}

fn get_method(count: u32) -> Result<Box<dyn Differential>, String> {
    match count {
        1 => Ok(Box::new(Forward)),
        2 => Ok(Box::new(Backward)),
        3 => Ok(Box::new(Central)),
        _ => Err("Precision is mismatch".to_string())
    }
}



// function core

pub(crate) fn derivative_core
(
    equation: &str,
    x: f64,
    h: f64,
    method_type: u32, 
    precision_type: u32, 
    diff_times: u32, 
    true_result: f64
) -> Result<DerivativeResult, String> {
    
    let method: Box<dyn Differential> = match get_method(method_type) {
        Ok(result) => result,
        Err(e) => return Err(e)
    };
    
    let precision: Precision = match get_precision(precision_type) {
        Ok(result) => result,
        Err(e) => return Err(e)
    };
    
    let result = match diff_times {
        1 => method.first_derivative(equation, x, h, precision),
        2 => method.second_derivative(equation, x, h, precision),
        3 => method.third_derivative(equation, x, h, precision),
        4 => method.fourth_derivative(equation, x, h, precision),
        _ => return Err(format!("Not implemented where derivative times is {}", diff_times))
    };

    match result {
        Ok(value) => {
            let error = utils::error_calc(true_result, value);
            Ok(DerivativeResult {
                true_value: true_result,
                result: value,
                error
            })
        }
        Err(e) => return Err(e)
    }
}