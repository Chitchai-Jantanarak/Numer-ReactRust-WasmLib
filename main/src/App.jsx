import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useEffect, useRef } from "react"
import { AnimatePresence } from 'motion/react';
import Lenis from "lenis"

import Layout from './components/layout/Layout.jsx';
import { ThemeProvider } from './components/providers/ThemeProvider.jsx';

import WasmGate from './components/wasm/WasmGate.jsx';
import { methodConfigs } from "./config/methodConfigs";
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route element={<Layout />} >
            { Object.entries(methodConfigs).flatMap(([groupKey, group]) =>
              Object.entries(group).map(([methodKey, config]) => {
                const {
                  route,
                  component: Component
                } = config;
                const path = `${groupKey}${route}`;
                console.log(path);
                
                
                return (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <Component
                        methodKey={methodKey}
                        methodConfig={config}
                      />
                    }
                  />
                );
              })
            )}
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
