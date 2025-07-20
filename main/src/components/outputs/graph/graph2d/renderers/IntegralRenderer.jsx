import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts"
import { withOrigin } from "../decorators/withOrigin"
import { withZoom } from "../decorators/withZoom"
import BaseRenderer from "./BaseRenderer"
import { parse } from "mathjs"

export default class IntegralRenderer extends BaseRenderer {
    decorators = [withOrigin, withZoom]

    constructor(props) {
        super(props)
        this.Chart = this.composeDecorators(...this.decorators)(AreaChart);
    }

    supports(topic, method) {
        return true;
    }

    render() {
        const { datas } = this.props;
        const Chart = this.Chart;
        console.log(datas);
        

        const { xl, xr, trapezoid_count, equation } = datas.values;
        
        const step = (xr - xl) / trapezoid_count;        
        const axisX = Array.from({ length: trapezoid_count + 1 }, (_, i) => xl + i * step);

        const compiled = parse(equation).compile();
        const axisY = axisX.map(x => {
            try {
                return compiled.evaluate({ x });
            } catch (e) {
                console.error(e);
                return null;
            }
        });
        // WithZoom least area y bound
        axisY.push(0);

        const mapped = axisX.map((x, i) => ({
            x: x,
            y: axisY[i] !== undefined ? axisY[i] : 0,
        }))

        return (
            <>
                <ResponsiveContainer width="100%" height="100%">
                <Chart data={datas} zoomData={mapped}>
                    <XAxis dataKey="x" type="number" tickFormatter={(val) => val.toFixed(6)} />
                    <YAxis dataKey="y" type="number" tickFormatter={(val) => val.toFixed(6)} />
                    <CartesianGrid strokeDasharray={"10, 5, 5, 5"} opacity={0.6} />
                    <Tooltip content={this.tooltip} />
                    <Area type="monotone" dataKey="y" fillOpacity={0.1} dot={true} />
                </Chart>
                </ResponsiveContainer>
            </>
        )
    }
}