let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;

function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function cramer(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.cramer(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function guass_naive(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.guass_naive(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function guass_jordan(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.guass_jordan(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function inverse_matrix(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.inverse_matrix(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function lu_decomposition(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.lu_decomposition(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @returns {any}
 */
export function cholesky(mat, rows, ans) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.cholesky(ptr0, len0, rows, ptr1, len1);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function jacobi(mat, rows, ans, init) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.jacobi(ptr0, len0, rows, ptr1, len1, ptr2, len2);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function guass_seidel(mat, rows, ans, init) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.guass_seidel(ptr0, len0, rows, ptr1, len1, ptr2, len2);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @param {number} omega
 * @returns {any}
 */
export function over_relaxation(mat, rows, ans, init, omega) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.over_relaxation(ptr0, len0, rows, ptr1, len1, ptr2, len2, omega);
    return ret;
}

/**
 * @param {Float64Array} mat
 * @param {number} rows
 * @param {Float64Array} ans
 * @param {Float64Array} init
 * @returns {any}
 */
export function conjugate_gradient(mat, rows, ans, init) {
    const ptr0 = passArrayF64ToWasm0(mat, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(ans, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.conjugate_gradient(ptr0, len0, rows, ptr1, len1, ptr2, len2);
    return ret;
}

/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @returns {any}
 */
export function newton_divided(x, y, target_x) {
    const ptr0 = passArrayF64ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(y, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.newton_divided(ptr0, len0, ptr1, len1, target_x);
    return ret;
}

/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @returns {any}
 */
export function lagrange(x, y, target_x) {
    const ptr0 = passArrayF64ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(y, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.lagrange(ptr0, len0, ptr1, len1, target_x);
    return ret;
}

/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} target_x
 * @param {number} degree
 * @returns {any}
 */
export function spline(x, y, target_x, degree) {
    const ptr0 = passArrayF64ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(y, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.spline(ptr0, len0, ptr1, len1, target_x, degree);
    return ret;
}

/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {number} degree
 * @returns {any}
 */
export function lsq_regression(x, y, degree) {
    const ptr0 = passArrayF64ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(y, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.lsq_regression(ptr0, len0, ptr1, len1, degree);
    return ret;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Float64Array} x
 * @param {Float64Array} y
 * @param {Uint32Array} degree
 * @returns {any}
 */
export function mult_lsq_regression(x, y, degree) {
    const ptr0 = passArrayF64ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(y, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray32ToWasm0(degree, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.mult_lsq_regression(ptr0, len0, ptr1, len1, ptr2, len2);
    return ret;
}

/**
 * @param {Uint32Array} sizes
 * @returns {any}
 */
export function combinations_regression(sizes) {
    const ptr0 = passArray32ToWasm0(sizes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.combinations_regression(ptr0, len0);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function trapezodial(equation, bound_least, bound_most, trapezoid_count, true_result) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.trapezodial(ptr0, len0, bound_least, bound_most, trapezoid_count, true_result);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function simpson_1in3(equation, bound_least, bound_most, trapezoid_count, true_result) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.simpson_1in3(ptr0, len0, bound_least, bound_most, trapezoid_count, true_result);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} trapezoid_count
 * @param {number} true_result
 * @returns {any}
 */
export function simpson_3in8(equation, bound_least, bound_most, trapezoid_count, true_result) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.simpson_3in8(ptr0, len0, bound_least, bound_most, trapezoid_count, true_result);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} true_result
 * @returns {any}
 */
export function romberg(equation, bound_least, bound_most, true_result) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.romberg(ptr0, len0, bound_least, bound_most, true_result);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} bound_least
 * @param {number} bound_most
 * @param {number} true_result
 * @param {number} points
 * @returns {any}
 */
export function guass_integration(equation, bound_least, bound_most, true_result, points) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.guass_integration(ptr0, len0, bound_least, bound_most, true_result, points);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function bisection(equation, xl, xr) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bisection(ptr0, len0, xl, xr);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function false_position(equation, xl, xr) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.false_position(ptr0, len0, xl, xr);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} x
 * @returns {any}
 */
export function fixed_point(equation, x) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fixed_point(ptr0, len0, x);
    return ret;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addToExternrefTable0(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
 * @param {(string)[]} equations
 * @param {number} xl
 * @param {number} xr
 * @returns {any}
 */
export function taylor(equations, xl, xr) {
    const ptr0 = passArrayJsValueToWasm0(equations, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.taylor(ptr0, len0, xl, xr);
    return ret;
}

/**
 * @param {string} equation_base
 * @param {string} equation_diff
 * @param {number} x
 * @returns {any}
 */
export function newton_raphson(equation_base, equation_diff, x) {
    const ptr0 = passStringToWasm0(equation_base, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(equation_diff, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.newton_raphson(ptr0, len0, ptr1, len1, x);
    return ret;
}

/**
 * @param {string} equation
 * @param {number} x0
 * @param {number} x1
 * @returns {any}
 */
export function secant(equation, x0, x1) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.secant(ptr0, len0, x0, x1);
    return ret;
}

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
export function derivative(equation, x, h, method_type, precision_type, diff_times, true_result) {
    const ptr0 = passStringToWasm0(equation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.derivative(ptr0, len0, x, h, method_type, precision_type, diff_times, true_result);
    return ret;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_String_91fba7ded13ba54c = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbg_set_20cbc34131e76824 = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_new_034f913e7636e987 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_e69b5f66fda8f13c = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_set_425e70f7c64ac962 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('cal_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
