import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import init, { lsq_regression } from '../pkg/cal_core.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function SingleRegression() {
  const MIN_SIZE = 2;  // Minimum input size
  const MAX_SIZE = 10; // Maximum input size
  const [size, setSize]     = useState(2);
  const [x, setX]           = useState([1.0, 2.0]);
  const [y, setY]           = useState([3.0, 4.0]);
  const [degree, setDegree] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState("");

  // Detection state-case for reset error & result
  useEffect(() => {
    setResult(null);
    setError('');
  }, [size, x, y, degree]);

  const calculateRegression = async () => {
    try {
      setError(''); // Re-Setter

      console.log('Inputs: x:', x, 'y:', y, 'degree:', degree);

      await init(); // Initialize the WASM module
      const regressionResult = lsq_regression(x, y, degree);

      if (typeof regressionResult === 'string') {
        setError(regressionResult);
        throw new Error(regressionResult);
      }

      setResult(regressionResult);
      console.log('Regression Result:', regressionResult);
    } catch (error) {
      console.error('Error running regression:', error);
    }
  };

  const isInputsValid = () => {
    return !x.some(value => value === "" || isNaN(value)) && !y.some(value => value === "" || isNaN(value));
  };

  const handleXChange = (index, value) => {
    const newX = [...x];
    newX[index]  = value === '' ? '' : Number(value);
    setX(newX);
  };

  const handleYChange = (index, value) => {
    const newY = [...y];
    newY[index] = value === '' ? '' : Number(value);
    setY(newY);
  };

  const handleDegreeChange = (event) => {
    const degree = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Number(event.target.value)));
    if (degree < MIN_SIZE && degree > MAX_SIZE) {
      return console.log(degree);
    }

    setDegree(degree);
  };

  const handleSizeChange = (event) => {
    const newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Number(event.target.value))); // Bound the size
    setSize(newSize);
    // Ensure x and y arrays match the new size
    setX((new Array(newSize).fill(0)));
    setY((new Array(newSize).fill(0)));
  };

  const renderLatex = (expression) => {
    try {
      return katex.renderToString(expression, {
        throwOnError: false,
      });
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      return '';
    }
  };

  return (
    <motion.div className="SingleRegression" 
      initial={{ scale: 0.45 }} animate={{ scale: 1, x: 0, transition: { duration: 0.5, ease: 'circOut' } }}
    >
      <h1>Linear Regression</h1>
      
      <div className='container-input'>
        <div>
          <label>
            Size of Input (Number of Data Points):
            <input 
              type="number" 
              value={size} 
              onChange={handleSizeChange} 
              min={MIN_SIZE} 
              max={MAX_SIZE}
            />
          </label>
        </div>
      </div>

      <div className='container-input'>
        {Array.from({ length: size }).map((_, index) => (
          <div key={index}>
            <label>
              X Value {index + 1}:
              <input
                type="number"
                value={x[index]}
                onChange={(e) => handleXChange(index, e.target.value)}
                step="any"
              />
            </label>
            <label>
              Y Value {index + 1}:
              <input
                type="number"
                value={y[index]}
                onChange={(e) => handleYChange(index, e.target.value)}
                step="any"
              />
            </label>
          </div>
        ))}
      </div>

      <div className='container-input'>
        <div>
          <label>
            Degree:
            <input type="number" value={degree} onChange={handleDegreeChange} />
          </label>
        </div>
      </div>

      <motion.button
        className='box'
        onClick={calculateRegression}
        animate={isInputsValid() ? { scale: [1, 0.9, 1] } : { scale: 1 }} 
        transition={{ duration: 0.5, ease: 'circOut', repeat: Infinity, repeatType: 'mirror', repeatDelay: 0.5 }}
        whileTap={{ scale: 0.8, transition: { duration: 0.5, ease: 'circOut' } }}
        disabled={!isInputsValid()}
      >
        Calculate Regression
      </motion.button>

      {error && <div style={{ color: 'red' }}><h3>{error}</h3></div>}
      {!isInputsValid() && <div style={{ color: 'red' }}><h3>All X and Y values must be valid numbers.</h3></div>}
      {(result && isInputsValid()) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "backInOut" }}
        >
          <h2>Regression Result:</h2>
          <div>
            <h3>Matrix:</h3>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(`\\begin{bmatrix} ${result.matrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`) }} />
          </div>
          <div>
            <h3>Solution:</h3>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(`\\begin{bmatrix} ${result.solution.join(' & ')} \\end{bmatrix}`) }} />
          </div>
          <div>
            <h3>Answer:</h3>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(`\\begin{bmatrix} ${result.answer.join(' & ')} \\end{bmatrix}`) }} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SingleRegression;