import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from "react"
import { AnimatePresence } from 'motion/react';
import Lenis from "lenis"

// OLD
import MultipleRegression from "./pages/old/MultipleRegression.jsx";

// New
// -- Root equation --
import Bisection from './pages/method/root_eq/Bisection.jsx';
import FalsePositon from './pages/method/root_eq/FalsePosition.jsx';
import FixedPoint from './pages/method/root_eq/FixedPoint.jsx';
import NewtonRaphson from './pages/method/root_eq/NewtonRaphson.jsx';
import Secant from './pages/method/root_eq/Secant.jsx';
import Taylor from './pages/method/root_eq/Taylor.jsx';
// -- Linear equation --
import Cholesky from './pages/method/linear_eq/Cholesky.jsx';
import ConjugateGradient from './pages/method/linear_eq/ConjugateGradient.jsx';
import Cramer from './pages/method/linear_eq/Cramer.jsx';
import GuassJordan from './pages/method/linear_eq/GuassJordan.jsx';
import GuassNaive from './pages/method/linear_eq/GuassNaive.jsx';
import GuassSeidel from './pages/method/linear_eq/GuassSeidel.jsx';
import Inverse from './pages/method/linear_eq/Inverse.jsx';
import Jacobi from './pages/method/linear_eq/Jacobi.jsx';
import LU from './pages/method/linear_eq/LU.jsx';
import OverRelax from './pages/method/linear_eq/OverRelax.jsx';
// -- Interpolation --
import Larange from './pages/method/interpolation/Larange.jsx';
import NewtonDivided from './pages/method/interpolation/NewtonDivided.jsx';
import Spline from './pages/method/interpolation/Spline.jsx';
// -- Regression --
import DegreeCombination from './pages/method/regression/DegreeCombination.jsx';
import LSQ from './pages/method/regression/LSQ.jsx';
import MultiLSQ from './pages/method/regression/MultiLSQ.jsx';
// -- Integration --
import GuassIntegral from './pages/method/integration/GuassIntegral.jsx';
import Romberg from './pages/method/integration/Romberg.jsx';
import Simpson1_3 from './pages/method/integration/Simpson1_3.jsx';
import Simpson3_8 from './pages/method/integration/Simpson3_8.jsx';
import Trapezodial from './pages/method/integration/Trapezodial.jsx';
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
            <Route path="/newton_raphson" element={<NewtonRaphson />} />
            <Route path="/secant" element={<Secant />} />
            <Route path="/taylor" element={<Taylor />} />

            {/* -- Linear equation -- */}
            <Route path="/cholesky" element={<Cholesky />} />
            <Route path="/conjugate_gradient" element={<ConjugateGradient />} />
            <Route path="/cramer" element={<Cramer />} />
            <Route path="/gauss_jordan" element={<GuassJordan />} />
            <Route path="/gauss_naive" element={<GuassNaive />} />
            <Route path="/gauss_seidel" element={<GuassSeidel />} />
            <Route path="/inverse" element={<Inverse />} />
            <Route path="/jacobi" element={<Jacobi />} />
            <Route path="/lu" element={<LU />} />
            <Route path="/over_relaxation" element={<OverRelax />} />

            {/* -- Interpolation -- */}
            <Route path="/larange" element={<Larange />} />
            <Route path="/newton_divided" element={<NewtonDivided />} />
            <Route path="/spline" element={<Spline />} />

            {/* -- Regression -- */}
            <Route path="/degree_combination" element={<DegreeCombination />} />
            <Route path="/lsq" element={<LSQ />} />
            <Route path="/multi_lsq" element={<MultiLSQ />} />

            {/* -- Integration -- */}
            <Route path="/gauss_integral" element={<GuassIntegral />} />
            <Route path="/romberg" element={<Romberg />} />
            <Route path="/simpson_1_3" element={<Simpson1_3 />} />
            <Route path="/simpson_3_8" element={<Simpson3_8 />} />
            <Route path="/trapezoidal" element={<Trapezodial />} />
            
            {/* -- Differential -- */}
            <Route path="/diff" element={<Derivative />} />


            <Route path="/test" element={<MultipleRegression />} />
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
      smooth: true,
      smoothWheel: true,
      smoothTouch: true,
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
