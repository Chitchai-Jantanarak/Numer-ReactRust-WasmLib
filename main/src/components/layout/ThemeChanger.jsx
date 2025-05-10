import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "lucide-react";

import IconWrapper from "../IconWrapper";
import { useTheme } from "../../hooks/useTheme";

const ThemeChanger = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: 90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <IconWrapper>
            <MoonIcon size={18} />
          </IconWrapper>
        ) : (
          <IconWrapper>
            <SunIcon size={18} />
          </IconWrapper>
        )}
      </motion.div>
    </button>
  );
};

export default ThemeChanger;