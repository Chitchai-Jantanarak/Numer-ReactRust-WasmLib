import { ReferenceLine } from "recharts";
console.log("Test outer");


const Test = (props) => {
    console.log("Test inner");
    
    return (<ReferenceLine {...props} />);
}

export default Test;
