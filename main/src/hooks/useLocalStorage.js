import { useState, useEffect } from "react"

export function useLocalStorage(key, initValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initValue;
        } catch (err) {
            console.error("Error reading localStorage: ", err);
            return initValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStorage = (value instanceof Function) ? value (storedValue) : value;
            setStoredValue(valueToStorage);

            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStorage));
            }
        } catch (err) {
            console.error("Error writing to localStorage: ", err);
        }
    }

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key) {
                try {
                    setStoredValue(JSON.parse(e.newValue))
                } catch (err) {
                    console.error("Error parsing localStorage change: ", err);
                }
            }
        }

        if (typeof window !== "undefined") {
            window.addEventListener("storage", handleStorageChange);
            return () => window.removeEventListener("storage", handleStorageChange);
        }
    }, [key])

    console.log(storedValue);
    
    return [storedValue, setValue];
}