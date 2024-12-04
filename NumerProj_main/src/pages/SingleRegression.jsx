import { useState, useEffect, useRef } from 'react';
import { motion } from "motion/react";
import init, { lsq_regression } from '../pkg/cal_core.js';
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function SingleRegression() {
  const MIN_INPUT_SIZE  = 3;  // Minimum input size
  const MAX_INPUT_SIZE  = 20; // Maximum input size
  const MIN_DEGREE_SIZE = 2;  // Minimum degree size
  const MAX_DEGREE_SIZE = 10; // Maximum degree size

  const [size, setSize]     = useState(3);
  const [x, setX]           = useState([1.0, 2.0, 5.0]);
  const [y, setY]           = useState([3.0, 4.0, 6.0]);
  const [degree, setDegree] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState("");

  // Detection state-case for reset error & result
  useEffect(() => {    
    setResult(null);
    setError('');
  }, [size, x, y, degree]);

  // useRef controller
  const resultSectionRef = useRef(null);
  const handleClick = () => {
    if (resultSectionRef.current) {
      resultSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function resultMathDegreeSetter(result) {
    return result.map((value, index) => {
      if (index === 0) {
        return `${value}`;
      }

      if (index === 1) {
        return `${value} * x`;
      }

      return `${value} * x^${index}`;
    });
  }

  function resultKatexDegreeSetter(result) {
    return result.map((value, index) => {
      return index === 0 ? `${value}` : index === 1 ? `${value}x` : `${value}x^{${index}}`;
    });
  }

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
    return !x.some(value => value === "" || isNaN(value)) && 
           !y.some(value => value === "" || isNaN(value));
  };

  const isSufficientData = () => {
    return x.length >= degree + 1 && y.length >= degree + 1;
  };

  const handleXChange = (index, value) => {
    const newValue = value === '' ? '' : Math.min(1000, Math.max(-1000, Number(value)));
    const newX = [...x];
    newX[index]  = newValue;
    setX(newX);
  };

  const handleYChange = (index, value) => {
    const newValue = value === '' ? '' : Math.min(32767, Math.max(-32768, Number(value)));
    const newY = [...y];
    newY[index] = newValue;
    setY(newY);
  };

  const handleDegreeChange = (event) => {
    const degree = Math.max(MIN_DEGREE_SIZE, Math.min(MAX_DEGREE_SIZE, Number(event.target.value)));
    if (degree < MIN_DEGREE_SIZE && degree > MAX_DEGREE_SIZE) {
      return;
    }

    setDegree(degree);
  };

  const handleSizeChange = (event) => {
    const newSize = Math.max(MIN_INPUT_SIZE, Math.min(MAX_INPUT_SIZE, Number(event.target.value))); // Bound the size
    setSize(newSize);
    // Ensure x and y arrays match the new size
    setX(prev => [...prev.slice(0, newSize), ...new Array(Math.max(0, newSize - prev.length)).fill(0)]);
    setY(prev => [...prev.slice(0, newSize), ...new Array(Math.max(0, newSize - prev.length)).fill(0)]);
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

  const plotData = result ? (() => {

    const xMinBound = Math.min(...x) - 10;
    const xMaxBound = Math.max(...x) + 10;
    // May collapse by many number (O(2n))
    const xFuncValues = Array.from( { length: (xMaxBound - xMinBound) * 2 }, (_, i) => xMinBound + (i * 0.5) );
    const yFuncValues = xFuncValues.map((x) => {
      return resultMathDegreeSetter(result.answer)
        .map((expr) => evaluate(expr, { x })) 
        .reduce((sum, value) => sum + value, 0);
    });
    
    return {
      data : [
        {
          x: x,
          y: y,
          mode: 'markers',
          type: 'scatter',
          marker: { color: 'green', size: 10 }
        },

        {
          x: xFuncValues,
          y: yFuncValues,
          mode: 'lines',
          type: 'scatter',
          line: { color: 'black' }
        }
      ],

      layout : {
          xaxis: { title: 'x-axis' },
          yaxis: { title: 'y-axis' }
      }
    }
  })() : null;

  return (
    <motion.div className="SingleRegression" 
      initial = {{ scale: 0.45 }} 
      animate = {{ scale: 1, x: 0, transition: { duration: 0.5, ease: 'circOut' } }}
    >
      <h1>Linear Regression</h1>
      
      {/* Input Size Control */}
      <div className='container-input'>
        <div>
          <label>
            Size of Input (Number of Data Points):
            <input 
              type      = "number" 
              value     = {size} 
              onChange  = {handleSizeChange} 
              min       = {MIN_INPUT_SIZE} 
              max       = {MAX_INPUT_SIZE}
            />
          </label>
        </div>
      </div>

      {/* Input Section */}
      <div className='container-input'>
        {Array.from({ length: size }).map((_, index) => (
          <div key={index}>
            <label>
              X Value {index + 1}:
              <input
                type      = "number"
                value     = {x[index]}
                onChange  = {(e) => handleXChange(index, e.target.value)}
                step      = "any"
                min       = "-1000"
                max       = "1000"
              />
            </label>
            <label>
              Y Value {index + 1}:
              <input
                type      = "number"
                value     = {y[index]}
                onChange  = {(e) => handleYChange(index, e.target.value)}
                step      = "any"
                min       = "-32768"
                max       = "32767"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Degree Control */}
      <div className='container-input'>
        <div>
          <label>
            Degree:
            <input type="number" value={degree} onChange={handleDegreeChange} />
          </label>
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        className  = 'box'
        onClick    = { async () => { await calculateRegression(); handleClick() }}
        animate    = {isInputsValid() && isSufficientData() ? { scale: [1, 0.9, 1] } : { scale: 1 }} 
        transition = {{ duration: 0.5, ease: 'circOut', repeat: Infinity, repeatType: 'mirror', repeatDelay: 0.5 }}
        whileTap   = {{ scale: 0.8, transition: { duration: 0.5, ease: 'circOut' } }}
        disabled   = {!(isInputsValid() && isSufficientData())}
      >
        Calculate Regression
      </motion.button>

      {/* Error Messages */}
      {error && <div style = {{ color: 'red' }}>
        <h3> {error} </h3>
      </div>}

      {!isInputsValid() && <div style = {{ color: 'red' }}>
        <h3> All X and Y values must be valid numbers. </h3>
      </div>}

      {!isSufficientData() && <div style = {{ color: 'red' }}>
        <h3> The datas should more than degree. </h3>
      </div>}
      
      {/* Results Section */}
      {(result && isInputsValid()) && isSufficientData() && (
        <motion.div
          ref        = {resultSectionRef} 
          className  = 'container-flex'
          initial    = {{ opacity: 0 }}
          animate    = {{ opacity: 1 }}
          transition = {{ duration: 0.5, ease: "backInOut" }}
        >
          <h2>Regression Result:</h2>
          <div className='container-scroll'>
            <h3>Matrix:</h3>
            <div dangerouslySetInnerHTML = {{ __html: renderLatex(`\\begin{bmatrix} ${result.matrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`) }} />
          </div>
          <div className='container-grid-2'>
            <div>
              <h3>Solution:</h3>
              <div dangerouslySetInnerHTML = {{ __html: renderLatex(`\\begin{bmatrix} ${result.solution.join(' \\\\ ')} \\end{bmatrix}`) }} />
            </div>
            <div>
              <h3>Answer:</h3>
              <div dangerouslySetInnerHTML = {{ __html: renderLatex(`\\begin{bmatrix} ${resultKatexDegreeSetter(result.answer).join(' \\\\ ')} \\end{bmatrix}`) }} />
            </div>
          </div>

          {/* Plot section */}
          {plotData && (
            <div className='container-plot'>
              <Plot
                data = {plotData.data}
                layout = {{
                  ...plotData.layout
                }}
              />
            </div>
          )}

        </motion.div>
      )}
    </motion.div>
  );
}

export default SingleRegression;