import React, { useState, useRef, useMemo, useCallback } from "react";

// NOTE: Before calling this wrapped do map the value as x, y first!
export function withZoom(Wrapped) {
    return function ZoomableChart({ children, data, ...rest }) {
        const containerRef = useRef(null);

        const dataBound = useMemo(() => {
            // Handling un-fetchable value graph
            if (!data || data.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
            const xValues = data.map(d => d.x);
            const yValues = data.map(d => d.y);
            return {
                minX: Math.min(xValues),
                maxX: Math.max(xValues),
                minY: Math.min(yValues),
                maxY: Math.max(yValues)
            };
        }, [data]);

        const [domain, setDomain] = useState({
            x: [dataBound.minX, dataBound.maxX],
            y: [dataBound.minY, dataBound.maxY]
        });

        const [selection, setSelection] = useState(null);
        const [isSelecting, setIsSelecting] = useState(false);

        const getChartCoordinates = useCallback((clientX, clientY) => {
            if (!containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            const chartArea = {
                left: rect.left + 60,
                right: rect.right - 20,
                top: rect.top + 20,
                bottom: rect.bottom - 60
            };
            const xRange = chartArea.right - chartArea.left;
    const yRange = chartArea.bottom - chartArea.top;

    if (xRange <= 0 || yRange <= 0) return null;

            const xRatio = (clientX - chartArea.left) / (chartArea.right - chartArea.left);
            const yRatio = (chartArea.bottom - clientY) / (chartArea.bottom - chartArea.top);
            const x = domain.x[0] + (domain.x[1] - domain.x[0]) * xRatio;
            const y = domain.y[0] + (domain.y[1] - domain.y[0]) * yRatio;
            return {x, y};
        }, [domain]);

        const handleMouseMove = useCallback((e) => {
            if (!isSelecting || !selection) return;
            const coords = getChartCoordinates(e.clientX, e.clientY);
            if (coords) {
                setSelection(prev => ({ ...prev, endX: coords.x, endY: coords.y }));
            }
        }, [isSelecting, selection, getChartCoordinates]);

        const handleMouseUp = useCallback((e) => {
            if (!isSelecting && selection) {
                const { startX, startY, endX, endY } = selection;
                // Set chart domain can be slice on .05
                const minWidth = (domain.x[1] - domain.x[0]) * 0.05;
                const minHeight = (domain.y[1] - domain.y[0]) * 0.05;
                if (Math.abs(endX - startX) > minWidth && Math.abs(endY - startY) > minHeight) {
                    setDomain({
                        x: [Math.min(startX, endX), Math.max(startX, endX)],
                        y: [Math.min(startY, endY), Math.max(startY, endY)]
                    });
                }
            }
            setIsSelecting(false);
            setSelection(null);
        });

        const handleMouseDown = useCallback((e) => {
            const coords = getChartCoordinates(e.clientX, e.clientY);
            if (coords) {
                setIsSelecting(true);
                setSelection({ 
                    startX: coords.x, 
                    startY: coords.y, 
                    endX: coords.x, 
                    endY: coords.y 
                });
            }
        })

        const resetZoom = () => {
            console.log("Zoom Triggered");
            
            const padding = 5;
            setDomain({
                x: [dataBound.minX - padding, dataBound.maxX + padding],
                y: [dataBound.minY - padding, dataBound.maxY + padding]
            });
        };

        const zoomIn = () => {
            console.log("Zoom Triggered");
            
            const xRange = domain.x[1] - domain.x[0];
            const yRange = domain.y[1] - domain.y[0];
            const xCenter = (domain.x[0] + domain.x[1]) / 2;
            const yCenter = (domain.y[0] + domain.y[1]) / 2;
            setDomain({
                x: [xCenter - xRange * 0.25, xCenter + xRange * 0.25],
                y: [yCenter - yRange * 0.25, yCenter + yRange * 0.25]
            });
        };

        const zoomOut = () => {
            console.log("Zoom Triggered");
            
            const xRange = domain.x[1] - domain.x[0];
            const yRange = domain.y[1] - domain.y[0];
            const xCenter = (domain.x[0] + domain.x[1]) / 2;
            const yCenter = (domain.y[0] + domain.y[1]) / 2;
            setDomain({
                x: [xCenter - xRange, xCenter + xRange],
                y: [yCenter - yRange, yCenter + yRange]
            });
        };

        const SelectionOverlay = () => {
            if (!selection || !containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            const chartArea = {
                left: 60,
                right: rect.width - 20,
                top: 20,
                bottom: rect.height - 60
            };
            const xRatio1 = (selection.startX - domain.x[0]) / (domain.x[1] - domain.x[0]);
            const xRatio2 = (selection.endX - domain.x[0]) / (domain.x[1] - domain.x[0]);
            const yRatio1 = (selection.startY - domain.y[0]) / (domain.y[1] - domain.y[0]);
            const yRatio2 = (selection.endY - domain.y[0]) / (domain.y[1] - domain.y[0]);
            const x1 = chartArea.left + xRatio1 * (chartArea.right - chartArea.left);
            const x2 = chartArea.left + xRatio2 * (chartArea.right - chartArea.left);
            const y1 = chartArea.bottom - yRatio1 * (chartArea.bottom - chartArea.top);
            const y2 = chartArea.bottom - yRatio2 * (chartArea.bottom - chartArea.top);

            return (
                <div
                style={{
                    position: 'absolute',
                    left: Math.min(x1, x2),
                    top: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1),
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    border: '1px dashed #8884d8',
                    pointerEvents: 'none'
                }}
                />
            )
        };

        return (
            <div className="width-full">
                <div className="flex space-x-4">
                    <button onClick={resetZoom}>Reset</button>
                    <button onClick={zoomIn}>Zoom In</button>
                    <button onClick={zoomOut}>Zoom Out</button>
                </div>

                <div
                    ref={containerRef}
                    style={{ position: 'relative', height: 400 }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        setIsSelecting(false);
                        setSelection(null);
                    }}
                    >
                    <Wrapped {...rest}>
                        {
                        // Pass children, but override domain-related props on axes
                        React.Children.map(children, child => {
                            if (!child) return null;
                            if (child.type?.displayName === 'XAxis') {
                            return React.cloneElement(child, { domain: domain.x, allowDataOverflow: true });
                            }
                            if (child.type?.displayName === 'YAxis') {
                            return React.cloneElement(child, { domain: domain.y, allowDataOverflow: true });
                            }
                            return child;
                        })
                        }
                    </Wrapped>
                    <SelectionOverlay />
                </div>
            </div>
        )
    }
}