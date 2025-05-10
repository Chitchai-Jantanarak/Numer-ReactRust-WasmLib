import React from 'react';
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function WasmError() {
    return (
        <motion.div
            initial    = {{ opacity: 0 }}
            animate    = {{ opacity: 1 }}
            transition = {{ duration: 1 }}
        >
            <X size={100} color="red" />
            <h2>Error: WebAssembly module could not be loaded.</h2>
        </motion.div>
    );
}
