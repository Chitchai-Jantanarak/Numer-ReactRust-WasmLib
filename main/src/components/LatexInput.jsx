import React, { useState, useEffect } from "react"
import { parse } from "mathjs"
import "katex/dist/katex.min.css"
import { InlineMath } from "react-katex"

export const LatexInput = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || "");
    const [latex, setLatex] = useState("");

    // Debouncer
    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                const node = parse(localValue);
                setLatex(node.toTex());
            } catch {
                setLatex(localValue);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [localValue]);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    return (
        <div className="space-y-1">
            <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={localValue}
                onChange={(e) => {
                    const val = e.target.value;
                    setLocalValue(val);
                    onChange(val);
                }}
                placeholder="Math Expression"
            />
            <div className="mt-1 text-purple-700 text-sm min-h-[1.5em]">
                {latex ? <InlineMath math={latex} /> : <em>Enter expression to render LaTeX</em>}
            </div>
        </div>
    )
}