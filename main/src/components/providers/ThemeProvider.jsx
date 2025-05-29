import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    const getInitTheme = () => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            return window.matchMedia && window.matchMedia('(prefers-color-shceme: dark)').matches ? 
                'dark' : 'light';
        }
        // undefined
        return 'dark';
    };

    const [theme, setTheme] = useState(getInitTheme);

    const toggleTheme = () => {
        setTheme((prev) => prev === 'light' ? 'dark' : 'light');
    };

    const themeExplicit = (theme) => {
        if (theme === 'light' || theme == 'dark') {
            setTheme(theme);
        }
    }; 

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            };
            mediaQuery.addEventListener('themeChange', handleChange);
            return () => mediaQuery.removeEventListener('themeChange', handleChange);
        }

    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const value = {
        theme,
        toggleTheme,
        setTheme: themeExplicit,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}