import MethodPage from "./MethodPage"
import { inputSchemas } from "../../config/inputSchemas";
import { ioSchemas } from "../../config/ioSchemas";

export default function Bisection() {
    const externalParams = {};
    const methodSchema = inputSchemas.differential.derivative; 
    const ioSchema = ioSchemas.differential.derivative;

    return (
        <MethodPage
            methodName={"Bisection"}
            methodSchema={methodSchema}
            exampleSchema={null}
            ioSchema={ioSchema}
            externalParams={externalParams}
        />
    );
}