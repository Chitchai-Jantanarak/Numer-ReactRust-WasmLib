import { useContext } from "react"
import { ThemeContext } from "../components/ThemeProvider";

export const useTheme = () => {
    const context = useContext(ThemeContext);
    console.log(ThemeContext);
    
    if (context === undefined) {
        throw new Error("useTheme be used on self-provider!!");
    }
    
    return context;
};