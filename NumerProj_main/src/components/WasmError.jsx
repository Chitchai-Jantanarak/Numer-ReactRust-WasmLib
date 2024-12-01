import React from 'react';
import { motion } from "framer-motion";
import errorIcon from '../assets/error.svg';

export default function WasmError() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <img src={errorIcon} alt="Error Icon" />
            <h2>Error: WebAssembly module could not be loaded.</h2>
        </motion.div>
    );
}
