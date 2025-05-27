import { useState, useEffect, useRef } from "react";
import { parse } from "mathjs";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const ExpressionInput = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || "");
    const [latex, setLatex] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(true);

    const debounceRef = useRef(null);
    const isUpdating = useRef(false);
    const lastSentValueRef = useRef(value);

    useEffect(() => {
        if (value !== lastSentValueRef.current && value !== localValue) {
            isUpdating.current = true;
            setLocalValue(value || "");
            lastSentValueRef.current = value;

            clearTimeout(debounceRef.current);
            if (value && value.trim()) {
                try {
                const node = parse(value)
                const tex = node.toTex({ ParenthesisNode: "keep", implicit: "show" })
                setLatex(tex)
                setIsValid(true)
                setError("")
                } catch (err) {
                setLatex("")
                setIsValid(false)
                setError(err.message)
                }
            } else {
                setLatex("")
                setIsValid(true)
                setError("")
            }

            setTimeout(() => {
                isUpdatingFromProp.current = false
            }, 100)
        }
    }, [value]);

    useEffect(() => {
        if (isUpdating.current) return;

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (!localValue.trim()) {
                setLatex("");
                setIsValid(true);
                setError("");

                if (lastSentValueRef.current !== "") {
                    lastSentValueRef.current = ""
                    onChange?.("")
                }

                return;
            }

            try {
                const node = parse(localValue);
                const parsed = node.toString({ implicit: 'show' });
                const tex = node.toTex({ ParenthesisNode: 'keep', implicit: 'show' });

                setLatex(tex);
                setIsValid(true);
                setError("");

                if (parsed !== lastSentValueRef.current) {
                    lastSentValueRef.current = parsed;
                    onChange?.(parsed);
                }
            } catch (err) {
                setLatex("");
                setIsValid(false);
                setError(err.message);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [localValue, onChange]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
    }

    return (
        <div className="relative w-full space-y-2">
            <input
                type="text"
                value={localValue}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Type a math expression"
            />
            {latex && (
                <div className="p-2 rounded border">
                <div className="text-sm">Preview:</div>
                <BlockMath math={latex} />
                </div>
            )}
            {!isValid && <div className="text-red-600 text-sm">Error: {error}</div>}
        </div>
    );
};
