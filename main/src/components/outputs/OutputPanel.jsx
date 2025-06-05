import TableMaker from "./TableMaker";
import Graph2DMaker from "./graph/graph2d/Graph2DMaker"

export default function OutputPanel({ topic, ioDisplay, result }) {
    return (
        <div className="space-y-4 block">
            {ioDisplay.includes("graph2D") && <Graph2DMaker datas={result} context={topic} />}
            <hr />
            {ioDisplay.includes("table") && <TableMaker datas={result} />}
            {/* {ioDisplay.includes("graph3D") && } */}
        </div>
    )
}