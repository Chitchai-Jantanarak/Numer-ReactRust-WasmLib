import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion"; // fixed import path for consistency
import init, { cholesky } from '../pkg/cal_core.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import CpnTransition from '../components/transition/CpnTransition.jsx';

function CholeskyLinear() {
    const MIN_MATRIX_SIZE = 2;
    const MAX_MATRIX_SIZE = 10;

    const [size, setSize] = useState(3);
    const [mat, setMat] = useState([
        [4.0, 12.0, -16.0],
        [12.0, 37.0, -43.0],
        [-16.0, -43.0, 98.0],
    ]);
    const [ans, setAns] = useState([1.0, 2.0, 3.0]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const resultSectionRef = useRef(null);

    useEffect(() => {
        setResult(null);
        setError('');
    }, [size, mat, ans]);

    const handleClick = () => {
        if (resultSectionRef.current) {
            resultSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const calculateDecomposition = async () => {
        try {
            setError('');
            await init();
            const mat_input = mat.flat();
            const decompositionResult = cholesky(mat_input, size, ans);

            if (typeof decompositionResult === 'string') {
                setError(decompositionResult);
                throw new Error(decompositionResult);
            }

            setResult(decompositionResult);
            console.log('Decomposition Result:', decompositionResult);
        } catch (error) {
            console.error('Error running Cholesky-decomposition:', error);
        }
    };

    const isInputsValid = () => {
        return (
            mat.every(row => row.every(value => value !== "" && !isNaN(value))) &&
            ans.every(value => value !== "" && !isNaN(value))
        );
    };

    const handleSizeChange = (event) => {
        const newSize = Math.max(MIN_MATRIX_SIZE, Math.min(MAX_MATRIX_SIZE, Number(event.target.value)));
        setSize(newSize);
        setMat((prev) =>
            Array.from({ length: newSize }).map((_, i) =>
                prev[i]
                    ? prev[i].slice(0, newSize).concat(Array(Math.max(0, newSize - prev[i].length)).fill(0))
                    : Array(newSize).fill(0)
            )
        );
        setAns((prev) =>
            [...prev.slice(0, newSize), ...new Array(Math.max(0, newSize - prev.length)).fill(0)]
        );
    };

    const handleMatChange = (i, j, value) => {
        const newMat = [...mat];
        const parsedValue = parseFloat(value);
        newMat[i][j] = (value !== "" && !isNaN(parsedValue)) ? parsedValue : '';
        setMat(newMat);
    };

    const handleAnsChange = (index, value) => {
        const newAns = [...ans];
        const parsedValue = parseFloat(value);
        newAns[index] = (value !== "" && !isNaN(parsedValue)) ? parsedValue : '';
        setAns(newAns);
    };

    const renderLatex = (expression) => {
        try {
            return katex.renderToString(expression, { throwOnError: false });
        } catch (error) {
            console.error('Error rendering LaTeX:', error);
            return '';
        }
    };

    return (
        <div className="CholeskyLinear">
            <h1 className="text-red-600">Cholesky Decomposition</h1>

            <div className="container-input">
                <label>
                    Size of Matrix:
                    <input
                        id="size"
                        type="number"
                        value={size}
                        onChange={handleSizeChange}
                        step="1"
                        min={MIN_MATRIX_SIZE}
                        max={MAX_MATRIX_SIZE}
                    />
                </label>
            </div>

            <div className="container-input">
                {Array.from({ length: size }).map((_, i) => (
                    <div key={i} className="row">
                        {Array.from({ length: size }).map((_, j) => (
                            <label key={`mat-${i}-${j}`}>
                                <input
                                    id={`mat-${i}-${j}`}
                                    type="number"
                                    value={mat[i]?.[j] ?? ''}
                                    onChange={(e) => handleMatChange(i, j, e.target.value)}
                                    step="any"
                                />
                            </label>
                        ))}
                        <label key={`ans-${i}`}>
                            <input
                                id={`ans-${i}`}
                                type="number"
                                value={ans[i] ?? ''}
                                onChange={(e) => handleAnsChange(i, e.target.value)}
                                step="any"
                            />
                        </label>
                    </div>
                ))}
            </div>

            <motion.button
                className="box"
                onClick={async () => {
                    await calculateDecomposition();
                    handleClick();
                }}
                animate={isInputsValid() ? { scale: [1, 0.95, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, ease: 'circOut', repeat: Infinity, repeatType: 'mirror', repeatDelay: 0.5 }}
                whileTap={{ scale: 0.9 }}
                disabled={!isInputsValid()}
            >
                Calculate
            </motion.button>

            {error && (
                <div style={{ color: 'red' }}>
                    <h3>{error}</h3>
                </div>
            )}

            {!isInputsValid() && (
                <div style={{ color: 'red' }}>
                    <h3>All inside matrix values must be valid numbers.</h3>
                </div>
            )}

            {result && isInputsValid() && (
                <motion.div
                    ref={resultSectionRef}
                    className="container-flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: "backInOut" }}
                >
                    <h2>Result:</h2>

                    <div className="container-grid-2">
                        <div>
                            <h3>Lower:</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderLatex(
                                        `\\begin{bmatrix} ${result.lower_mat.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <h3>Upper:</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderLatex(
                                        `\\begin{bmatrix} ${result.upper_mat.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="container-grid-2">
                        <div>
                            <h3>Forward:</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderLatex(`\\begin{bmatrix} ${result.forward_value.join(' \\\\ ')} \\end{bmatrix}`)
                                }}
                            />
                        </div>
                        <div>
                            <h3>Backward (Answer):</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderLatex(`\\begin{bmatrix} ${result.backward_value.join(' \\\\ ')} \\end{bmatrix}`)
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default CpnTransition(CholeskyLinear);
