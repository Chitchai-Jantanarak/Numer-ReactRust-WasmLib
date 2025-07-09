// utils.rs
use meval::{Context, Expr};

pub fn evaluate_expr(expr: &Expr, value: f64) -> f64 {
    let mut ctx: Context<'_> = Context::new();
    (&mut ctx).var("x", value);
    expr.eval_with_context(&ctx).unwrap_or(0.0)
}

pub fn error_calc(x_new: f64, x_old: f64) -> f64 {
    if x_new.abs() <= 1e-24 && x_old.abs() <= 1e-24 { return 0.; }
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

pub fn pair_sort_asc(x: Vec<f64>, y: Vec<f64>, indicator: u32) -> (Vec<f64>, Vec<f64>) {

    let mut paired: Vec<(f64, f64)> = x.iter().zip(y.iter()).map(|(&a, &b)| (a,b)).collect();

    match indicator {
        1 => paired.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap()),
        2 => paired.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap()),
        _ => {},
    }

    let (sorted_x, sorted_y) = paired.into_iter().unzip();

    (sorted_x, sorted_y)
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

// Duplicated method for using in other topics
pub fn guass(mat: &Vec<Vec<f64>>, ans: &Vec<f64>) -> Result<Vec<f64>, String> {

    const EPSILON: f64 = 1e-32;

    let mut aug_matrix  : Vec<Vec<f64>> = mat.clone();
    let size            : usize         = mat.len();

    if mat.len() != mat[0].len() || ans.len() != size {
        return Err("Matrix size is not match".to_string());
    }

    for i in 0..size {
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

        if aug_matrix[i][i].abs() < EPSILON {
            continue;
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

    for row in &aug_matrix {
        let lhs_zero = row[..size].iter().all(|&v| v.abs() < EPSILON);
        let rhs_nonzero = row[size].abs() >= EPSILON;
        if lhs_zero && rhs_nonzero {
            return Err("Inconsistent system (no solution)".to_string());
        }
    }

    let result = aug_matrix.iter().map(|row| row[size]).collect();

    Ok(result)
} 

pub fn is_symmetric(mat: &Vec<Vec<f64>>) -> bool {
    let size: usize = mat.len();

    for i in 0..size {
        for j in 0..size {
            if mat[i][j] != mat[j][i] {
                return false;
            }
        }
    }

    true
}

// Called when square matrix ONLY
pub fn is_positive_definite(mat: &Vec<Vec<f64>>) -> bool {
    let size = mat.len();

    // testing symmetric
    if !is_symmetric(mat) {
        return false;
    }

    // make sub-matrix
    for iter in 0..size {
        let sub_matrix: Vec<Vec<f64>> = mat.iter()
            .take(iter + 1)
            .map(|rows| rows.iter().take(iter + 1).copied().collect())
            .collect();

        if det(&sub_matrix) < 0.0 {
            return false;
        }
    }

    true
}

// ----------------- unused method ----------------- 
/*
 * pub fn mat_imul_mat(mat1: &Vec<Vec<f64>>, mat2: &Vec<Vec<f64>>) -> Vec<Vec<f64>> {
   
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
*/