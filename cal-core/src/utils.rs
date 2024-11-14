// utils.rs
use meval::Expr;

pub fn evaluate_expr(expr: &Expr, value: f64) -> f64 {
    expr.eval_with_context(&[("x", value)]).unwrap_or(0.0)
}

pub fn error_calc(x_new: f64, x_old: f64) -> f64 {
    (x_new - x_old).abs() / x_new * 100.0
}

pub fn factorial(n: usize) -> usize {
    if n == 0 {
        1
    }
    else {
        n * factorial(n - 1)
    }
}

pub fn dot_prod_self(mat: &Vec<f64>) -> f64 {
    let mut result: f64 = 0.0;
    for iter in 0..mat.len() {
        result += mat[iter] * mat[iter];
    }
    result
}

pub fn dot_prod(mat1: &Vec<f64>, mat2: &Vec<f64>) -> f64 {
    let mut result: f64 = 0.0;
    for iter in 0..mat1.len() {
        result += mat1[iter] * mat2[iter];
    }
    result
}

pub fn scalar_mult(mat: &Vec<f64>, scalar: f64) -> Vec<f64> {
    mat.iter().map(|&val| val * scalar).collect()
}

pub fn vec_sub(mat1: &Vec<f64>, mat2: &Vec<f64>) -> Vec<f64> {
    mat1.iter()
        .zip(mat2.iter())
        .map(|(&val1, &val2)| val1 - val2)
        .collect()
}

pub fn vec_add(mat1: &Vec<f64>, mat2: &Vec<f64>) -> Vec<f64> {
    mat1.iter()
        .zip(mat2.iter())
        .map(|(&val1, &val2)| val1 + val2)
        .collect()
}

pub fn mat_conv2d(mat: &Vec<f64>, size: usize) -> Vec<Vec<f64>> {
    let mut result: Vec<Vec<f64>> = vec![vec![0.0; size]; size];
    let mut index : usize         = 0;

    for i in 0..size {
        for j in 0..size {
            result[i][j] = mat[index];
            index += 1;
        }
    }

    result
}

pub fn mat_transpose(mat: &Vec<Vec<f64>>) -> Vec<Vec<f64>> {
    // Empty Matrix
    if mat.is_empty() || mat[0].is_empty() {
        return vec![];
    }

    let cols: usize = mat[0].len();

    // Matrix has not transpose property
    if !mat.iter().all(|row| row.len() == cols) {
        panic!("Matrix is can't transpose");
    }

    let rows: usize = mat.len();

    let mut transposed: Vec<Vec<f64>> = vec![vec![0.0; rows]; cols];

    for i in 0..rows {
        for j in 0..cols {
            transposed[j][i] = mat[i][j];
        }
    }

    transposed
}

pub fn mat_imul_mat(mat1: &Vec<Vec<f64>>, mat2: &Vec<Vec<f64>>) -> Vec<Vec<f64>> {
   
    let row_mat1: usize = mat1.len();
    let col_mat1: usize = mat1[0].len();
    let row_mat2: usize = mat2.len();
    let col_mat2: usize = mat2[0].len();
   
    // Not mult property matrix
    if col_mat1 != row_mat2 {
        panic!("Matrix is can't Mult");
    }

    let mut result: Vec<Vec<f64>> = vec![vec![0.0; col_mat2]; row_mat1];

    for i in 0..row_mat1 {
        for j in 0..col_mat2 {
            for k in 0..col_mat1 {
                result[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
    }

    result
}

pub fn mat_imul_vec(mat: &Vec<Vec<f64>>, vec: &Vec<f64>) -> Vec<f64> {
    let rows: usize = mat.len();
    let cols: usize = mat[0].len();

    if cols != vec.len() {
        panic!("Matrix is can't Mult");
    }

    let mut result: Vec<f64> = vec![0.0; rows];

    for i in 0..rows {
        for j in 0..cols {
            result[i] += mat[i][j] * vec[j];
        }
    }

    result
}

// Using RREF
pub fn det(mat: &Vec<Vec<f64>>) -> f64 {
    let rows: usize = mat.len();
    let cols: usize = mat[0].len();
    if rows != cols {
        panic!("Matrix is not rectangular");
    }

    let mut m   : Vec<Vec<f64>> = mat.clone();
    let mut det : f64           = 1.0;

    let size : usize = m.len(); // rows named as size

    for i in 0..size {
        let mut max_row: usize = i;
        for j in i+1 .. size {
            if m[j][i].abs() > m[max_row][i].abs() {
                max_row = j;
            }
        }

        // minimum value that counted as 0.0
        if m[max_row][i].abs() < 1e-12 {
            return 0.0;
        }

        // Swap flag **MUST
        if max_row != i {
            m.swap(i, max_row);
            det = -det;
        }

        for j in i + 1..size {
            let ratio: f64 = m[j][i] / m[i][i];
            for k in i..size {
                m[j][k] -= ratio * m[i][k];
            }
        }
    }

    // Det calc
    for i in 0..size {
        det *= m[i][i];
    }
    
    det
}