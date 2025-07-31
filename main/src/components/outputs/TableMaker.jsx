// import "katex/dist/katex.min.css"
import { InlineMath } from "react-katex";
import ScrollFocus from "../common/ScrollFocus.jsx";

const renderVec = (math) => {
    return `\\begin{bmatrix} ${math.join(' \\\\ ')} \\end{bmatrix}`;
}

const TableMaker = ({ datas }) => {
    if (!datas || datas.length === 0) return <div className="alert alert-error">No Data for formatting table.</div>
    
    const entries = Object.entries(datas);
    const headers = entries.length > 0 ? Object.keys(entries[0][1]) : [];
    
    return (
        <>
            <ScrollFocus>
                <table className="table">
                    <thead>
                        <tr>
                            {headers.map((key) => (
                                <th key={key}>{key.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(([key, row]) => (
                            <tr key={key} className="hover">
                            {headers.map((header) => (
                                <td key={header}>
                                {
                                    Array.isArray(row[header]) ? (
                                        <InlineMath math={renderVec(row[header])} />
                                    ) : typeof row[header] === "number" && header !== "iteration" ? (
                                        row[header].toFixed(9)
                                    ) : (
                                        row[header]
                                    )
                                }
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollFocus>
        </>
    );
}

export default TableMaker;