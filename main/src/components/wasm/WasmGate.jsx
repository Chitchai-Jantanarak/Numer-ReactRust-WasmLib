import WasmLoader from './WasmLoader.jsx';
import WasmError from './WasmError.jsx';
import useWasmInit from '../../hooks/useWasmInit.js';

export default function WasmGate({ children }) {
  const { wasmStatus, loadDelay } = useWasmInit();

  if (wasmStatus === 'loading' || !loadDelay) return <WasmLoader />;
  if (wasmStatus === 'missing') return <WasmError />;

  return children;
}
