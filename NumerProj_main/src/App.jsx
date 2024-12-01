import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import init from './pkg/cal_core.js';
import WasmLoader from './components/WasmLoader.jsx';
import WasmError from './components/WasmError.jsx';
import SingleRegression from "./components/SingleRegression";
import './App.css'

function App() {
  // Track Wasm status: 'loading', 'pass', 'missing'
  const [wasmStatus, setWasmStatus] = useState('loading'); 
  const [loadDelay, setLoadDelay] = useState(false);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init();
        setWasmStatus('pass');
      } catch (error) {
        console.error('Error loading Wasm:', error);
        setWasmStatus('missing');
      }
    };
    loadWasm();
  }, []); // runs once on mount

  useEffect(() => {
    if (wasmStatus === 'pass') {
        const timer = setTimeout(() => setLoadDelay(true), 2000);
        return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [wasmStatus]);

  if (wasmStatus === 'loading') return <WasmLoader />;
  if (wasmStatus === 'missing') return <WasmError />;
  if (!loadDelay) return <WasmLoader />;

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route pate="/" element={<App />} />
          <Route path="/SingleRegression" element={<SingleRegression />} />
        </Routes>
      </Router>
  
    </div>
  );
}

export default App;