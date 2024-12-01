import { motion } from "motion/react";

export default function Loader() {
    return (
        <div className="container-flex">
            <motion.div 
                className="loader-outer-box"
                animate = {{
                    scale: [0, 0.9, 0.75, 0.6, 0.9, 1],
                    rotate: [0, 30, 180, 180, 330, 360],
                    borderRadius: ["10%", "25%", "50%", "10%", "25%", "10%"]
                }}
                transition = {{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                }}
            >
                <motion.div
                    className ="loader-box"
                    animate = {{
                        scale: [0, 0.9, 0.75, 0.6, 0.9, 1],
                        borderRadius: ["10%", "25%", "50%", "10%", "25%", "10%"]
                    }}
                    transition = {{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                >
                </motion.div>
            </motion.div>
        </div>
    )
}