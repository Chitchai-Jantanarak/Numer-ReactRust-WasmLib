import React, { useState, useEffect } from "react";
import { ReferenceLine } from "recharts";

export function ReferenceLineWithTooltip(props) {
  const [hovered, setHovered] = useState(false);

  const { y, x, stroke = 'red', strokeWidth = 2, containerRef, domain } = props;

  const isHorizontal = y !== undefined;

  // Calculate pixel positions from domain
  const [linePos, setLinePos] = useState(null);

  useEffect(() => {
    if (!containerRef?.current || !domain) return;

    const rect = containerRef.current.getBoundingClientRect();
    const chartArea = {
      left: 60,
      right: rect.width - 20,
      top: 20,
      bottom: rect.height - 60
    };

    if (isHorizontal) {
      const yRatio = (y - domain.y[0]) / (domain.y[1] - domain.y[0]);
      const py = chartArea.bottom - yRatio * (chartArea.bottom - chartArea.top);
      setLinePos({
        x1: chartArea.left,
        x2: chartArea.right,
        y1: py,
        y2: py
      });
    } else {
      const xRatio = (x - domain.x[0]) / (domain.x[1] - domain.x[0]);
      const px = chartArea.left + xRatio * (chartArea.right - chartArea.left);
      setLinePos({
        x1: px,
        x2: px,
        y1: chartArea.top,
        y2: chartArea.bottom
      });
    }
  }, [containerRef, domain, x, y]);

  return (
    <>
      <ReferenceLine {...props} stroke={stroke} strokeWidth={strokeWidth} />
      {hovered && (
        <ReferenceLine
          {...props}
          stroke="orange"
          strokeDasharray="3 3"
          isFront
        />
      )}
      {linePos && (
        <svg
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: 100 }}
        >
          <g
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="pointer-events-auto"
          >
            <line
              x1={linePos.x1}
              y1={linePos.y1}
              x2={linePos.x2}
              y2={linePos.y2}
              stroke="transparent"
              strokeWidth={10}
            />
          </g>
        </svg>
      )}
    </>
  );
}

ReferenceLineWithTooltip.displayName = "ReferenceLineWithTooltip";
