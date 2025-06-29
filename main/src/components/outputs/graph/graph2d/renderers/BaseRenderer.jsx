import React from "react";

export default class BaseRenderer extends React.Component {
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

    // Abstract — subclasses must override 
    supports(topic, method) {
        throw new Error("BaseRenderer is an abstract class form");
    }

    // Abstract — subclasses must override
    render() {
        throw new Error("BaseRenderer is an abstract class form");
    }

}
