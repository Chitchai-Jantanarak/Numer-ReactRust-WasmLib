export const ParamInput = ({ param, values, onChange }) => {
    const { size, inputs } = param;

    const handleInputChange = (name, r, c, val) => {
        const updated = structuredClone(values);
        if (!updated[name]) updated[name] = [];
        if (!updated[name][r]) updated[name][r] = [];
        updated[name][r][c] = val;

        onChange?.(updated);
    };

    return (
        <div className="space-y-4">
        <div className="flex items-center gap-2">
            <label className="font-medium">{size.label}:</label>
            <input
            type="number"
            min={size.min}
            max={size.max}
            value={param.currentSize}
            onChange={(e) => {
                const val = Math.max(size.min, Math.min(size.max, parseInt(e.target.value) || size.min));
                param.onSizeChange?.(val);
            }}
            className="border rounded px-2 py-1 w-16"
            />
        </div>

        {Object.entries(inputs).map(([name, input]) => {
            const [rows, cols] = input.shape(param.currentSize);
            return (
            <div key={name} className="space-y-2">
                <label className="font-semibold">{name.toUpperCase()} ({rows}x{cols})</label>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))` }}>
                {Array.from({ length: rows }).map((_, r) =>
                    Array.from({ length: cols }).map((_, c) => (
                    <input
                        key={`${name}-${r}-${c}`}
                        type="number"
                        value={values?.[name]?.[r]?.[c] ?? ''}
                        onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleInputChange(name, r, c, value);
                        }}
                        className="border px-2 py-1 w-full text-center rounded"
                        min={input.min}
                        max={input.max}
                    />
                    ))
                )}
                </div>
            </div>
            );
        })}
        </div>
    );
};