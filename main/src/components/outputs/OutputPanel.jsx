import TableMaker from "./TableMaker";
import Graph2DMaker from "./graph/graph2d/Graph2DMaker"
import BoxMaker from "./BoxMaker";

export const OutputPanel = ({ topic, ioDisplay, Result}) => {

    const { values, result } = Result;
    const { mode } = ioDisplay 

    console.log("OUTPUT PANEL\n", {
        topic,
        ioDisplay,
        Result
    });
    
    return (
        <div className="space-y-10 block">
            {mode.includes("graph2D") && 
                <>
                    <Graph2DMaker datas={Result} context={topic} />
                    <hr />    
                </>
            }
            {mode.includes("table") && 
                <>
                    <TableMaker datas={result} />
                    <hr />    
                </>
            }
            {mode.includes("box") &&
                <>
                    <BoxMaker datas={Result} io={ioDisplay} />
                </>
            }
            {/* {mode.includes("graph3D") && } */}
        </div>
    )
}

export default OutputPanel;
