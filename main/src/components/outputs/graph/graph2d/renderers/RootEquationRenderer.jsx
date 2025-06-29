import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { withOrigin } from "../decorators/withOrigin";
import { withZoom } from "../decorators/withZoom";
import { withTrack } from "../decorators/withTrack.jsx";
import BaseRenderer from "./BaseRenderer.jsx";

export default class RootEquationRenderer extends BaseRenderer {
  decorators = [withOrigin, withZoom, withTrack];

  constructor(props) {
    super(props);
    this.Chart = this.composeDecorators(...this.decorators)(ScatterChart);
  }

  supports(topic, method) {
    return true;
  }

  render() {
    const { datas } = this.props;
    const Chart = this.Chart;    

    const axisConvertX = datas.flatMap(({ xl, xr }) => [xl, xr]);
    const axisConvertY = Object.values(axisConvertX)
    const mapped = axisConvertX.map((x, i) => ({
      x: x,
      y: axisConvertY[i] !== undefined ? axisConvertY[i] : null,
    }));
    
    return (
      <>
        <ResponsiveContainer width="100%" height="100%">
          <Chart 
            data={datas}
            zoomData={mapped}
          >
            <XAxis dataKey="x" type="number" tickFormatter={(val) => val.toFixed(6)} />
            <YAxis dataKey="y" type="number" tickFormatter={(val) => val.toFixed(6)} />
            <CartesianGrid strokeDasharray={"10, 5, 5, 5"} opacity={0.6} />
            <Tooltip content={this.tooltip} />
          </Chart>
        </ResponsiveContainer>
      </>
    );
  }
}