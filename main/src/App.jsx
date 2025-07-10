import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from "react"
import { AnimatePresence } from 'motion/react';
import Lenis from "lenis"

// OLD
import CholeskyLinear from './pages/old/CholeskyLinear.jsx';
import CramerLinear from "./pages/old/CramerLinear.jsx";
import GuassNaiveLinear from './pages/old/GuassNaiveLinear.jsx';
import GuassJordanLinear from './pages/old/GuassJordanLinear.jsx';
import InverseMatrixLinear from './pages/old/InverseMatrixLinear.jsx';
import LULinear from './pages/old/LULinear.jsx';
import MultipleRegression from "./pages/old/MultipleRegression.jsx";
import SingleRegression from "./pages/old/SingleRegression.jsx";

// New
// -- Root equation --
import Bisection from './pages/method/root_eq/Bisection.jsx';
import FalsePositon from './pages/method/root_eq/FalsePosition.jsx';
import FixedPoint from './pages/method/root_eq/FixedPoint.jsx';
// -- Linear equation --
// -- Interpolation --
// -- Regression --
// -- Integration --
// -- Differential --
import Derivative from './pages/method/differential/Derivative.jsx';


import Layout from './components/layout/Layout.jsx';
import { ThemeProvider } from './components/providers/ThemeProvider.jsx';

import WasmGate from './components/wasm/WasmGate.jsx';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

          <Route element={<Layout />}>
            {/* -- Root equation -- */}
            <Route path="/bisection" element={<Bisection />} />
            <Route path="/false_position" element={<FalsePositon />} />
            <Route path="/fixed_point" element={<FixedPoint />} />
            {/* -- Linear equation -- */}
            {/* -- Interpolation -- */}
            {/* -- Regression -- */}
            {/* -- Integration -- */}
            {/* -- Differential -- */}
            <Route path="/diff" element={<Derivative />} />

            <Route path="/CholeskyLinear" element={<CholeskyLinear />} />
            <Route path="/CramerLinear" element={<CramerLinear />} />
            <Route path="/GuassJordanLinear" element={<GuassJordanLinear />} />
            <Route path="/GuassNaiveLinear" element={<GuassNaiveLinear />} />
            <Route path="/InverseMatrixLinear" element={<InverseMatrixLinear />} />
            <Route path="/LULinear" element={<LULinear />} />
            <Route path="/MultipleRegression" element={<MultipleRegression />} />
            <Route path="/SingleRegression" element={<SingleRegression />} />
          </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const lenis = useRef(null);
  
  useEffect(() => {
    lenis.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: 1,
      smoothWheel: 1,
      smoothTouch: 1,
      normalizeWheel: 1
    });

    const raf = (time) => {
      lenis.current.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.current.destroy();
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider>
        <WasmGate>
          <Router>
            <AnimatedRoutes />
          </Router>
        </WasmGate>
      </ThemeProvider>
    </div>
  );
}

export default App;
