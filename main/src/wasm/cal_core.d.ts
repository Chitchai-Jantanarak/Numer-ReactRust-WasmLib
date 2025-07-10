/* tslint:disable */
/* eslint-disable */
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function cramer(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function guass_naive(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function guass_jordan(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function inverse_matrix(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function lu_decomposition(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function cholesky(mat: Float64Array, rows: number, ans: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function jacobi(mat: Float64Array, rows: number, ans: Float64Array, init: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function guass_seidel(mat: Float64Array, rows: number, ans: Float64Array, init: Float64Array): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @param {number} omega
 * @returns {any}
 */
export function over_relaxation(mat: Float64Array, rows: number, ans: Float64Array, init: Float64Array, omega: number): any;
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function conjugate_gradient(mat: Float64Array, rows: number, ans: Float64Array, init: Float64Array): any;
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @returns {any}
 */
export function newton_divided(x: Float64Array, y: Float64Array, target_x: number): any;
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @returns {any}
 */
export function lagrange(x: Float64Array, y: Float64Array, target_x: number): any;
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @param {number} degree
 * @returns {any}
 */
export function spline(x: Float64Array, y: Float64Array, target_x: number, degree: number): any;
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} degree
 * @returns {any}
 */
export function lsq_regression(x: Float64Array, y: Float64Array, degree: number): any;
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {Uint32Array} degree
 * @returns {any}
 */
export function mult_lsq_regression(x: Float64Array, y: Float64Array, degree: Uint32Array): any;
/**
 * @param {Uint32Array} sizes
 * @returns {any}
 */
export function combinations_regression(sizes: Uint32Array): any;
/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function trapezodial(equation: string, bound_least: number, bound_most: number, trapezoid_count: number, true_result: number): any;
/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function simpson_1in3(equation: string, bound_least: number, bound_most: number, trapezoid_count: number, true_result: number): any;
/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function simpson_3in8(equation: string, bound_least: number, bound_most: number, trapezoid_count: number, true_result: number): any;
/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @returns {any}
 */
export function romberg(equation: string, bound_least: number, bound_most: number): any;
/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} true_result
 * @param {number} points
 * @returns {any}
 */
export function guass_integration(equation: string, bound_least: number, bound_most: number, true_result: number, points: number): any;
/**
 * @param {string} equation
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function bisection(equation: string, xl: number, xr: number): any;
/**
 * @param {string} equation
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function false_position(equation: string, xl: number, xr: number): any;
/**
 * @param {string} equation
 * @param {number} x
 * @returns {any}
 */
export function fixed_point(equation: string, x: number): any;
/**
 * @param {(string)[]} equations
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function taylor(equations: (string)[], xl: number, xr: number): any;
/**
 * @param {string} equation_base
 * @param {string} equation_diff
 * @param {number} x
 * @returns {any}
 */
export function newton_raphson(equation_base: string, equation_diff: string, x: number): any;
/**
 * @param {string} equation
 * @param {number} x0
 * @param {number} x1
 * @returns {any}
 */
export function secant(equation: string, x0: number, x1: number): any;
/**
 * @param {string} equation
 * @param {number} x
 * @param {number} h
 * @param {number} method_type
 * @param {number} precision_type
 * @param {number} diff_times
 * @param {number} true_result
 * @returns {any}
 */
export function derivative(equation: string, x: number, h: number, method_type: number, precision_type: number, diff_times: number, true_result: number): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly cramer: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly guass_naive: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly guass_jordan: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly inverse_matrix: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly lu_decomposition: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly cholesky: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly jacobi: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly guass_seidel: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly over_relaxation: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly conjugate_gradient: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly newton_divided: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly lagrange: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly spline: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly lsq_regression: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly mult_lsq_regression: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly combinations_regression: (a: number, b: number) => number;
  readonly trapezodial: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly simpson_1in3: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly simpson_3in8: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly romberg: (a: number, b: number, c: number, d: number) => number;
  readonly guass_integration: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly bisection: (a: number, b: number, c: number, d: number) => number;
  readonly false_position: (a: number, b: number, c: number, d: number) => number;
  readonly fixed_point: (a: number, b: number, c: number) => number;
  readonly taylor: (a: number, b: number, c: number, d: number) => number;
  readonly newton_raphson: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly secant: (a: number, b: number, c: number, d: number) => number;
  readonly derivative: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
