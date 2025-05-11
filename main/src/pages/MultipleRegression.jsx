import { useState, useEffect, useRef } from 'react';
import { motion } from "motion/react";
import { evaluate } from 'mathjs';
import init, { mult_lsq_regression, combinations_regression } from '../wasm/cal_core.js';
import Plot from 'react-plotly.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function MultipleRegression() {
  const MIN_INPUT_SIZE   = 3;  // Minimum input size
  const MAX_INPUT_SIZE   = 20; // Maximum input size
  const MIN_DEGREE_SIZE  = 1;  // Minimum degree size
  const MAX_DEGREE_SIZE  = 3;  // Maximum degree size
  const MIN_FEATURE_SIZE = 2;  // Minimum feature size
  const MAX_FEATURE_SIZE = 5;  // Maximum feature size
  const MIN_X_NUMBER     = -100;
  const MAX_X_NUMBER     = 100;
  const MIN_Y_NUMBER     = -250;
  const MAX_Y_NUMBER     = 250;

  const [size, setSize]         = useState(3);
  const [x, setX]               = useState([[1.0, 2.0], [2.0, 3.0], [5.0, 6.0]]);
  const [y, setY]               = useState([3.0, 4.0, 6.0]);
  const [degree, setDegree]     = useState([2, 2]);
  const [feature, setFeature]   = useState(2);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [plotInfo, setPlotInfo] = useState(null);
  const [latexAnswer, setlatexAnswer] = useState('');

  // Detection state-case for reset error & result
  useEffect(() => {    
    setResult(null);
    setError('');
  }, [size, x, y, degree, feature]);

  // Detection result generated ( Handling asynchronous )
  useEffect(() => {
    const generateLatex = async () => {
      const degreed = await resultKatexDegreeSetter(result.answer);
      const latexExpression = `\\begin{bmatrix} ${degreed.join(' \\\\ ')} \\end{bmatrix}`;
      setlatexAnswer(renderLatex(latexExpression));
    }

    const fetchPlotData = async () => {
      const plot = await plotData();
      setPlotInfo(plot);
    }
  
    if (result && result.answer) {
      generateLatex();
      fetchPlotData();
    }

  }, [result]);

  // useRef controller
  const resultSectionRef = useRef(null);
  const handleClick = () => {
    if (resultSectionRef.current) {
      resultSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  async function resultMathDegreeSetter(result) {
    let combinations = await combination(degree);    
    const degreed = result.map((value, i) => {
      return value + combinations[i].map((comb, j) => 
        comb !== 0 ? ` * x${j + 1}^${comb}` : '' ).join('');
    });    

    return degreed;
  }

  async function resultKatexDegreeSetter(result) {
    let combinations = await combination(degree);    
    const degreed = result.map((value, i) => {
      return value + combinations[i].map((comb, j) => 
        comb !== 0 ? comb !== 1 ? `x_${j + 1}^${comb}` : `x_${j + 1}` : '' ).join('');
    });

    return degreed;
  }

  function mapping_calculation(arr) {
    return Array.from({ length: arr[0].length }, (_, col) => 
      arr.map(row => row[col])
    ).flat();
  }

  const calculateRegression = async () => {
    try {
      setError(''); // Re-Setter

      console.log('Inputs: x:', x, 'y:', y, 'degree:', degree);

      await init(); // Initialize the WASM module
      const d_input = degree.map(deg => deg - 1); // Rust is take degree as x - 1
      const x_input = mapping_calculation(x);
      const regressionResult = mult_lsq_regression(x_input, y, d_input);

      if (typeof regressionResult === 'string') {
        setError(regressionResult);
        throw new Error(regressionResult);
      }

      resultMathDegreeSetter(regressionResult.answer);
      
      setResult(regressionResult);
      console.log('Regression Result:', regressionResult);
    } catch (error) {
      console.error('Error running regression:', error);
    }
  };

  const combination = async (sizes) => {
    try {
      // no error from this implementation
      await init(); 
      return combinations_regression(sizes);

    } catch(error) {
      console.error('Error running combinations:', error);
    }
  }

  const isInputsValid = () => {
    return (
      x.every(row => row.every(value => value !== "" && !isNaN(value))) &&
      !y.some(value => value === "" || isNaN(value))
    )
  };  

  const isSufficientData = () => {
    return x.length >= (Math.max(...degree) + 1) && y.length >= (Math.max(...degree) + 1);
  };

  const isSufficiendDegree = () => {
    return degree.every(deg => deg === 1) || degree.every(deg => deg !== 1);
  }

  const handleXChange = (i, j, value) => {
    const newValue = value === '' ? '' : Math.min(MAX_X_NUMBER, Math.max(MIN_X_NUMBER, Number(value)));
    setX(prev => {
        const newX = [...prev];
        newX[i]    = [...newX[i]];
        newX[i][j] = newValue;
        return newX;
    });
  };

  const handleYChange = (index, value) => {
    const newValue = value === '' ? '' : Math.min(MAX_Y_NUMBER, Math.max(MIN_Y_NUMBER, Number(value)));
    setY(prev => {
        const newY  = [...prev];
        newY[index] = newValue;
        return newY;
    });
  };

  const handleDegreeChange = (index, value) => {
    const newDegree = Math.max(MIN_DEGREE_SIZE, Math.min(MAX_DEGREE_SIZE, Number(value)));
    setDegree(prev => {
        const newDegrees  = [...prev];
        newDegrees[index] = newDegree;
        return newDegrees;
    });
  };

  const handleFeatureChange = (event) => {
    const newFeature = Math.max(MIN_FEATURE_SIZE, Math.min(MAX_FEATURE_SIZE, Number(event.target.value)));
    setFeature(newFeature);

    // Update x n-Dim array
    setX((prev) =>
      prev.map(row =>
        Array.from({ length: newFeature }).map((_, j) => row[j] ?? 0)
      )
    );
  
    setDegree((prev) =>
      Array.from({ length: newFeature }).map((_, i) => prev[i] ?? MIN_DEGREE_SIZE)
    );
  };

  const handleSizeChange = (event) => {
    const newSize = Math.max(MIN_INPUT_SIZE, Math.min(MAX_INPUT_SIZE, Number(event.target.value))); // Bound the size
    setSize(newSize);

    // Adjust x and y arrays match the new size
    setX((prev) =>
      Array.from({ length: newSize }).map((_, i) =>
        prev[i] ? prev[i].slice(0, feature) : Array(feature).fill(0)
      )
    );
  
    setY((prev) =>
      Array.from({ length: newSize }).map((_, i) => prev[i] ?? 0)
    );
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

  const plotData = async () => {
    if (!result || feature > 2) return null;  // Can't plot if collection of datas is more than 2 (more than 3D)

    const exprs = await resultMathDegreeSetter(result.answer);    
    
    const xMinBound = Math.min(...x.flat()) - 10;
    const xMaxBound = Math.max(...x.flat()) + 10;
    const xFuncValues = Array.from( { length: (xMaxBound - xMinBound) * 2 }, (_, i) => xMinBound + (i * 0.5) );
    // Copied categories
    const xSurface = xFuncValues;
    const ySurface = xFuncValues;

    let zSurface = [];
    for (let i = 0; i < xSurface.length; i++) {
      zSurface[i] = [];
      for (let j = 0; j < ySurface.length; j++) {
        const values = exprs.map((expr) => evaluate(expr, { x1: xSurface[i], x2: ySurface[j] }));
        const sum = await Promise.all(values);
        zSurface[i].push(sum.reduce((total, value) => total + value, 0));
      }
    }

    return {
      data: [
        {
          type: 'scatter3d',
          mode: 'markers',
          x: x.map(pair => pair[0]),
          y: x.map(pair => pair[1]), 
          z: y.map(val => val), 
          marker: {
            size: 4,
            color: y,
            coloraxis: 'coloraxis',
          },
        },
        {
          type: 'surface',
          x: xSurface,
          y: ySurface,
          z: zSurface,
          coloraxis: 'coloraxis',
          opacity: 0.25
        },
      ],
      layout: {
        scene: {
          xaxis: { title: 'x1' },
          yaxis: { title: 'x2' },
          zaxis: { title: 'y' },
          aspectmode: 'manual',
          aspectratio: {
              x: 1, 
              y: 1, 
              z: 1  
        }
        },
        coloraxis: { 
          colorscale: 'Portland', 
        },
        hovermode: 'closest',
        animation: false
      },
      autosize: true,
    };
  };
  
  return (
    <motion.div className="MultipleRegression" 
      initial = {{ scale: 0.45 }} 
      animate = {{ scale: 1, x: 0, transition: { duration: 0.5, ease: 'circOut' } }}
    >
      <h4 className='warning'> This topic is lack of multiple degrees whenever,<br /> the graph is can't make as more 3 of data categories </h4>

      <h1> Multiple Regression </h1>
      
      {/* Input Size Control */}
      <div className='container-input'>
        <div>
          <label>
            Size of Input (Number of Data Points):
            <input 
              id        = {'size'}
              type      = "number" 
              value     = {size} 
              onChange  = {handleSizeChange} 
              step      = "any"
              min       = {MIN_INPUT_SIZE} 
              max       = {MAX_INPUT_SIZE}
            />
          </label>
        </div>
      </div>

      {/* Feature Collection Control */}
      <div className='container-input'>
        <div>
          <label>
            Datas Collection (Set of Data Points):
            <input 
              id        = {'feature'}
              type      = "number" 
              value     = {feature} 
              onChange  = {handleFeatureChange}
              step      = "any"
              min       = {MIN_FEATURE_SIZE} 
              max       = {MAX_FEATURE_SIZE}
            />
          </label>
        </div>
      </div>

      {/* Input Section */}
      <div className='container-input'>
        {Array.from({ length: size }).map((_, i) => (
          <div key={i} className='row'>
            {Array.from({ length: feature }).map((_, j) => (
              <label key={`x-${i}-${j}`}>
                X[{i + 1}][{j + 1}]:
                <input
                    id       = {`x-${i}-${j}`}
                    type     = "number"
                    value    = {x[i]?.[j] ?? ''}
                    onChange = {(e) => handleXChange(i, j, e.target.value)}
                    step     = "any"
                    min      = {MIN_X_NUMBER}
                    max      = {MAX_X_NUMBER}
                />
              </label>
            ))}

            <label key={`y-${i}`}>  {/* Unique key for each Y input */}
              Y[{i + 1}]:
              <input
                  id       = {`y-${i}`}
                  type     = "number"
                  value    = {y[i] ?? ''}
                  onChange = {(e) => handleYChange(i, e.target.value)}
                  step     = "any"
                  min      = {MIN_Y_NUMBER}
                  max      = {MAX_Y_NUMBER}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Degree Control */}
      {Array.from({ length: feature }).map((_, i) => (
        <div className='container-input'  key={`degree-${i}`}>
            <div>
                <label>
                    Degree {i + 1}:
                    <input 
                        id       = {`degree-${i}`}
                        type     = "number" 
                        value    = {degree[i] || ''} 
                        onChange = {(e) => handleDegreeChange(i, e.target.value)} 
                        step     = "any"
                        min      = {MIN_DEGREE_SIZE}
                        max      = {MAX_DEGREE_SIZE}
                    />
                </label>
            </div>
        </div>
      ))}

      {/* Calculate Button */}
      <motion.button
        className  = 'box'
        onClick    = { async () => { await calculateRegression(); handleClick() } }
        animate    = { isInputsValid() && isSufficientData() && isSufficiendDegree() ? { scale: [1, 0.9, 1] } : { scale: 1 } } 
        transition = {{ duration: 0.5, ease: 'circOut', repeat: Infinity, repeatType: 'mirror', repeatDelay: 0.5 }}
        whileTap   = {{ scale: 0.8, transition: { duration: 0.5, ease: 'circOut' } }}
        disabled   = { !(isInputsValid() && isSufficientData() && isSufficiendDegree()) }
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

      {!isSufficiendDegree() && <div style = {{ color: 'red'}}>
        <h3> The degree is allowed only single or polynomial
            e.g. [1, 1, 1] or [2, 3, 2]  
        </h3>
      </div>}
      
      {/* Results Section */}
      {(result && isInputsValid()) && isSufficientData() && isSufficiendDegree() && (
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
              {latexAnswer ? (
                <div dangerouslySetInnerHTML={{ __html: latexAnswer }} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Plot section */}
          {plotInfo && (
            <div className='container-plot'>
              <Plot
                data = {plotInfo.data}
                layout = {{
                  ...plotInfo.layout,
                }}
              />
            </div>
          )}

        </motion.div>
      )}
    </motion.div>
  );
}

export default MultipleRegression;