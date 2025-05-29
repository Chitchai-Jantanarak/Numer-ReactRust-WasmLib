import TableMaker from "./TableMaker";

export default function OutputPanel({ ioDisplay, result }) {
    return (
        <div className="space-y-4">
            {ioDisplay.includes("table") && <TableMaker datas={result} />}
            {/* {ioDisplay.includes("graph2D") && }
            {ioDisplay.includes("graph3D") && } */}
        </div>
    )
}