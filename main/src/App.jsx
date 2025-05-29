import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import CholeskyLinear from './pages/old/CholeskyLinear.jsx';
import CramerLinear from "./pages/old/CramerLinear.jsx";
import GuassNaiveLinear from './pages/old/GuassNaiveLinear.jsx';
import GuassJordanLinear from './pages/old/GuassJordanLinear.jsx';
import InverseMatrixLinear from './pages/old/InverseMatrixLinear.jsx';
import LULinear from './pages/old/LULinear.jsx';
import MultipleRegression from "./pages/old/MultipleRegression.jsx";
import SingleRegression from "./pages/old/SingleRegression.jsx";

import Bisection from './pages/method/BisectionPage.jsx';

import Layout from './components/layout/Layout.jsx';
import { ThemeProvider } from './components/providers/ThemeProvider.jsx';

import WasmGate from './components/wasm/WasmGate.jsx';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route path="/" element={<div className=' text-red-400'>
            <Link to={"/CholeskyLinear"}>test</Link> 
          </div>} />

          <Route element={<Layout />}>            
            <Route path="/bisection" element={<Bisection />} />
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
