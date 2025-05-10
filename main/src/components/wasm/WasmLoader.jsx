import React from 'react';
import { motion } from "framer-motion";
import Loader from '../transition/Loader';

export default function WasmLoader() {
    return (
        <div className='z-50 flex flex-col justify-center items-center h-screen'>
            <Loader />
            <motion.h2
                initial    = {{ opacity: 0 }}
                animate    = {{ opacity: 1 }}
                exit       = {{ opacity: 0 }}
                transition = {{ duration: 1 }}
                className  = 'mt-5'
            >
                <p className='font-en'> Calculator Loading... </p>
            </motion.h2>
        </div>
    );
}
