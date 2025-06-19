export default class BaseRenderer {
    decorators = [];
    composeDecorators = (...decorators) => (BaseComponent) =>
        decorators.reduce((acc, decorator) => decorator(acc), BaseComponent);

    tooltip = ({ active, payload, label }) => {        
        if (active && payload && payload.length) {            
            const { x, y } = payload[0].payload;
            return (
                <div className="p-2 bg-transparent backdrop-blur-sm backdrop-brightness-200 rounded">
                    <p><strong>x:</strong> {x.toFixed(8)}</p>
                    <p><strong>y:</strong> {y.toFixed(8)}</p>
                </div>
            );
        }
        return null;
    };


    supports(topic, method) {
        throw new Error("BaseRenderer is an abstract class form");
    }

    render(datas) {
        throw new Error("BaseRenderer is an abstract class form");
    }

}