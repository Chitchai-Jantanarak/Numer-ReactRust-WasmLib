import { useState, useEffect } from 'react';
import init from '../wasm/cal_core.js';

export default function useWasmInit(delay = 2000) {
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
  }, []);

  useEffect(() => {
    if (wasmStatus === 'pass') {
      const timer = setTimeout(() => setLoadDelay(true), delay);
      return () => clearTimeout(timer);
    }
  }, [wasmStatus, delay]);

  return { wasmStatus, loadDelay };
}
