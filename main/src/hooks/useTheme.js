import { useContext } from "react"
import { ThemeContext } from "../components/providers/ThemeProvider";

export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        throw new Error("useTheme be used on self-provider!!");
    }
    
    return context;
};