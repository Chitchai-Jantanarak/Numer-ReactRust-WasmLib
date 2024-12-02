import React from 'react';
import { motion } from "framer-motion";
import Loader from './Loader';

export default function WasmLoader() {
    return (
        <div>
            <Loader />
            <motion.h2
                initial    = {{ opacity: 0 }}
                animate    = {{ opacity: 1 }}
                exit       = {{ opacity: 0 }}
                transition = {{ duration: 1 }}
            >
                Calculator Loading...
            </motion.h2>
        </div>
    );
}
