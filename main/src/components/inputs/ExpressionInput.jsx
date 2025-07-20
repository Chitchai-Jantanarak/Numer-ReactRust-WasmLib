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
    const lastSentValueRef = useRef(value);

    useEffect(() => {
        if (value !== lastSentValueRef.current && value !== localValue) {
            setLocalValue(value || "");
            lastSentValueRef.current = value;

            try {
                const node = parse(value || "");
                const tex = node.toTex({ ParenthesisNode: "keep", implicit: "show" })
                setLatex(tex);
                setIsValid(true);
                setError("");
            } catch (err) {
                setLatex("");
                setIsValid(false);
                setError(err.message);
            }
        }
    }, [value]);

    useEffect(() => {
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const trimmed = localValue.trim();

            if (!trimmed) {
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
                const node = parse(trimmed);
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

    const handleBlur = () => {
        try {
            const node = parse(localValue);
            const parsed = node.toString({ implicit: "show" });
            if (parsed !== localValue) {
                setLocalValue(parsed);
                lastSentValueRef.current = parsed;
                onChange?.(parsed);
            }
        } catch (_) {}
    }

    return (
        <div className="relative w-full space-y-2">
            <input
                id="expression-input"
                name="equation"
                type="text"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
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
