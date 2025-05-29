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
                    <IconWrapper>
                        <X size={18} />
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