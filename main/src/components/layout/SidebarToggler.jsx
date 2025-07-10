import { motion } from "motion/react";
import { X, Menu } from "lucide-react";

import IconWrapper from "../common/IconWrapper"

const SidebarToggler = ({isSidebarVisible, toggleSidebar}) => {
    return (
        <button onClick={toggleSidebar} aria-label="Toggle theme">
            <motion.div
                key={isSidebarVisible}
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isSidebarVisible ? (
                    <IconWrapper className="relative">
                        <div className="relative w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
                            <X size={18} />
                        </div>
                    </IconWrapper>
                ) : 
                    <IconWrapper>
                        <Menu size={18} />
                    </IconWrapper>
                }            
            </motion.div>
        </button>
    );
}

export default SidebarToggler;