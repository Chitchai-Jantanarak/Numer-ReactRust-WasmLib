import { 
    ScatterChart, 
    Scatter, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    LineChart,
    Line,
    Tooltip, 
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { ReferenceLineWithTooltip } from '../utils/ReferenceLineWithTooltip.jsx'
import Test from '../utils/Test.jsx';
import { withOrigin } from '../decorators/withOrigin';
import { withZoom } from '../decorators/withZoom';
import BaseRenderer from "./BaseRenderer.jsx";

export default class RootEquationRenderer extends BaseRenderer {
    decorators = [withOrigin, withZoom];

    supports(topic, method) {
        return true;
    }

    render(datas) {
        const Chart = this.composeDecorators(...this.decorators)(ScatterChart);
        const mapped = datas.map(({ xl, xr }) => ({ x: xl, y: xr }));

        return (
            <ResponsiveContainer width="100%" height="100%">
            <Chart data={mapped}>
                <ReferenceLineWithTooltip y={1.240966} stroke='red' strokeWidth={5} />
                <ReferenceLine y={1.240966} stroke='red' strokeWidth={5} />
                <XAxis dataKey="x" type="number" displayName="XAxis" tickFormatter={(val) => val.toFixed(6)} domain={['auto', 'auto']} />
                <YAxis dataKey="y" type="number" displayName="YAxis" tickFormatter={(val) => val.toFixed(6)} domain={['auto', 'auto']} />
                <CartesianGrid strokeDasharray={"10, 5, 5, 5"} opacity={0.6} />
                <Tooltip content={this.tooltip} />
                {/* <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} isAnimationActive={false} /> */}
                <Scatter type="monotone" dataKey="y" data={mapped} fill="#8884d8" />
            </Chart>
            </ResponsiveContainer>
        );
    }

}