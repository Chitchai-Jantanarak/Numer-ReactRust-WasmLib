import React, { useState } from "react";
import { ReferenceLine } from "recharts";

export function withTrack(Wrapped) {
    return function TrackableChart({ data, domain, children, ...rest }) {
        const [currentIteration, setCurrentIteration] = useState(0);
        const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

        const currentStep = data[currentIteration];

    const refColors = {
      xl: "#ef4444",
      xr: "#3b82f6",
      xm: "#10b981",
    };

    const showTooltip = (key) => (e) => {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        key,
      });
    };

    const moveTooltip = (e) => {
      setTooltip((prev) =>
        prev.visible
          ? {
              ...prev,
              x: e.clientX,
              y: e.clientY,
            }
          : prev
      );
    };

    const hideTooltip = () => {
      setTooltip({ ...tooltip, visible: false, key: null });
    };

    const referenceLines = Object.entries(refColors).map(([key, color]) => {
      const value = currentStep?.[key];
      return value != null ? (
        <React.Fragment key={key}>
            <ReferenceLine
                x={value}
                stroke={color}
                strokeWidth={3} 
            /> 
            <ReferenceLine
                x={value}
                stroke="transparent"
                strokeWidth={10} 
                onMouseEnter={showTooltip(key)}
                onMouseMove={moveTooltip}
                onMouseLeave={hideTooltip}
            /> 
        </React.Fragment>
      ) : null;
    });

    return (
      <div className="space-y-4 relative">
        <div className="flex flex-col w-full aspect-[3/2]">
          <Wrapped {...rest} data={data} domain={domain}>
            {children}
            {referenceLines}
          </Wrapped>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Step</span>
            <span>
              {currentIteration + 1} / {data.length}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={data.length - 1}
            value={currentIteration}
            onChange={(e) => setCurrentIteration(+e.target.value)}
            className="w-full"
          />
        </div>

        {tooltip.visible && (
          <div
            className="reference-tooltip fixed pointer-events-none z-50 transition-all duration-150 ease-linear"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            <div className="p-2 bg-transparent backdrop-blur-sm backdrop-brightness-200 rounded">
                <p>
                    {tooltip.key}: {currentStep[tooltip.key].toFixed(6)}
                </p>
            </div>
          </div>
        )}
      </div>
    );
  };
}
