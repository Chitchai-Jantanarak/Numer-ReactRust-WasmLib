import { useEffect, useState } from 'react';
import init, { lsq_regression } from './pkg/cal_core.js';

function App() {
  const [x, setX] = useState([1.0, 2.0, 3.0]); 
  const [y, setY] = useState([2.0, 4.0, 6.0]); 
  const [degree, setDegree] = useState(2); 
  const [result, setResult] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track is mounted

    const runWasm = async () => {
      await init(); // Initialize WASM mod

      if (isMounted) {
        const regressionResult = lsq_regression(x, y, degree);
        setResult(regressionResult);
        console.log('Regression Result:', regressionResult);
      }
    };

    runWasm().catch(console.error);

    return () => {
      isMounted = false; // Clean up
    };
  }, [x, y, degree]);

  // input handler
    const handleXChange = (event) => {
      const values = event.target.value.split(',').map(Number);
      setX(values);
    };

    const handleYChange = (event) => {
      const values = event.target.value.split(',').map(Number);
      setY(values);
    };

    const handleDegreeChange = (event) => {
      setDegree(Number(event.target.value));
    };

  return (
    <div className="App">
      <h1>WASM Linear Regression</h1>
      <div>
        <label>
          X Values (comma-separated):
          <input type="text" value={x.join(',')} onChange={handleXChange} />
        </label>
      </div>
      <div>
        <label>
          Y Values (comma-separated):
          <input type="text" value={y.join(',')} onChange={handleYChange} />
        </label>
      </div>
      <div>
        <label>
          Degree:
          <input type="number" value={degree} onChange={handleDegreeChange} />
        </label>
      </div>
      <button onClick={() => console.log('Result:', result)}>Log Result</button>
      {result && (
        <div>
          <h2>Regression Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
