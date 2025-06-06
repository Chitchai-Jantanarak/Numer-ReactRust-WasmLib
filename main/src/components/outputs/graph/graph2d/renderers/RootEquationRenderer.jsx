import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { withZoom } from '../decorators/withZoom';
import BaseRenderer from "./BaseRenderer";

export default class RootEquationRenderer extends BaseRenderer {
    supports(topic, method) {
        return true;
    }

    render(datas) {
        const ZoomableScatterChart = withZoom(ScatterChart);
        const mapped = datas.map(({ xl, xr }) => ({ x: xl, y: xr }));

        return (
            <ResponsiveContainer width="100%" height="100%">
            <ZoomableScatterChart data={mapped}>
                <CartesianGrid />
                <XAxis dataKey="x" type="number" displayName="XAxis" tickFormatter={(val) => val.toFixed(6)} />
                <YAxis dataKey="y" type="number" displayName="YAxis" tickFormatter={(val) => val.toFixed(6)} />
                <Tooltip />
                <Scatter data={mapped} fill="#8884d8" />
            </ZoomableScatterChart>
            </ResponsiveContainer>
        );
    }

}