import TableMaker from "./TableMaker";
import Graph2DMaker from "./graph/graph2d/Graph2DMaker"

export const OutputPanel = ({ topic, ioDisplay, Result}) => {

    const { values, result } = Result;

    console.log("OUTPUT PANEL\n", {
        topic,
        ioDisplay,
        Result
    });
    
    return (
        <div className="space-y-10 block">
            {ioDisplay.includes("graph2D") && 
                <>
                    <Graph2DMaker datas={Result} context={topic} />
                    <hr />    
                </>
            }
            {ioDisplay.includes("table") && 
                <>
                    <TableMaker datas={result} />
                    <hr />    
                </>
            }
            {/* {ioDisplay.includes("graph3D") && } */}
        </div>
    )
}