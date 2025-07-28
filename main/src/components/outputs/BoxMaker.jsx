import { parse } from "mathjs";
// import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex";

import { Copy } from "lucide-react";

const KaTexRenderer = ({ expression }) => {
    try {
        const expr = parse(expression);
        const latex = expr.toTex();

        return <InlineMath math={latex} />;
    } catch (err) {
        return <InlineMath math={expression} />;
    }
}

const ArrayRenderer = ({ values, title }) => {
    
    // counts as dim
    function getType(data) {
        let depth = 0;
        while (Array.isArray(data)) {
            depth++; 
            data = data[0];
        }
        return depth;
    }

    const renderMat = (math) => {
        return `\\begin{bmatrix} ${math.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
    }

    const renderVec = (math) => {
        return `\\begin{bmatrix} ${math.join(' & ')} \\end{bmatrix}`;
    }

    const type = getType(values);

    switch (type) {
        case 1:
            return (
                <div className="grid-rows-2">
                    <strong>{title}</strong>
                    <BlockMath math={renderVec(values)} /> 
                </div>
            );
        case 2:
            return (
                <div className="grid-rows-2">
                    <strong>{title}</strong>
                    <BlockMath math={renderMat(values)} /> 
                </div>
            );
        default:
            // FALLBACK !Unimplements
            console.error("Unimplements 3 Dims or upper!");
            return;
    }
}

const ValueRenderer = ({ value, title }) => {
    if (Array.isArray(value)) {
        return <ArrayRenderer values={value} title={title} />;
    }

    if (typeof value === "string" && /[a-zA-Z0-9+\-*/^]/.test(value)) {
        return (
            <div className="flex justify-between p-2">
                <p>{title}</p>
                <KaTexRenderer expression={value} />
            </div>
        )
    }

    return (
        <div className="flex justify-between p-2">
            <p>{title}</p>
            {value.toString()}
        </div>
    );
}

const BoxMaker = ({ datas }) => {
    return (
        <>
            <div className="rounded-lg p-4">
                { Object.entries(datas).map(([groupKey, groupValues]) => 
                    <div 
                        key={groupKey}
                        className="space-y-8 bg-base-100"    
                    >
                        <div className="flex flex-col p-4 space-y-4 justify-between">
                            {Object.entries(groupValues).map(([key, value]) => (
                                <ValueRenderer key={key} title={key} value={value} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default BoxMaker;