import React, { useState, useRef, useMemo, useCallback } from "react"
import { RefreshCcw, ZoomIn, ZoomOut } from "lucide-react"
import { ReferenceLineWithTooltip } from "../utils/ReferenceLineWithTooltip";

// NOTE: Before calling this wrapped do map the value as x, y first!
export function withZoom(Wrapped) {
    return function ZoomableChart({ children, data, ...rest }) {
        const containerRef = useRef(null);

        const graphBound = useMemo(() => {
            // Handling un-fetchable value graph
            if (!data || data.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
            const paddingRatio = 0.05;
            let minX = Infinity,    minY = Infinity;
            let maxX = -Infinity,   maxY = -Infinity;
            
            for (const {x, y} of data) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }

            const xPadding = (maxX - minX) * paddingRatio;
            const yPadding = (maxY - minY) * paddingRatio;

            return {
                minX: minX - xPadding,
                maxX: maxX + xPadding,
                minY: minY - yPadding,
                maxY: maxY + yPadding
            };
        }, [data]);

        const [domain, setDomain] = useState({
            x: [graphBound.minX, graphBound.maxX],
            y: [graphBound.minY, graphBound.maxY]
        });

        const filteredData = useMemo(() => {
            return data.filter(({ x, y }) =>
                x >= domain.x[0] && x <= domain.x[1] &&
                y >= domain.y[0] && y <= domain.y[1]
            );
        }, [data, domain]);

        const [selection, setSelection] = useState(null);
        const [isSelecting, setIsSelecting] = useState(false);
        const [history, setHistory] = useState([]);
        const [isOuterZoom, setIsOuterZoom] = useState(false);

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

        const pushDomain = (newDomain) => {
            setHistory(prev => [...prev, domain]);
            setDomain(newDomain);
        }

        const handleMouseMove = useCallback((e) => {
            if (!isSelecting || !selection) return;
            const coords = getChartCoordinates(e.clientX, e.clientY);
            if (coords) {
                setSelection(prev => ({ ...prev, endX: coords.x, endY: coords.y }));
            }
        }, [isSelecting, selection, getChartCoordinates]);

        const handleMouseUp = useCallback((e) => {
            if (isSelecting && selection) {
                const { startX, startY, endX, endY } = selection;
                // Set chart domain can be slice on .05
                const minWidth = (domain.x[1] - domain.x[0]) * 0.05;
                const minHeight = (domain.y[1] - domain.y[0]) * 0.05;
                
                if (Math.abs(endX - startX) > minWidth && Math.abs(endY - startY) > minHeight) {
                    pushDomain({
                        x: [Math.min(startX, endX), Math.max(startX, endX)],
                        y: [Math.min(startY, endY), Math.max(startY, endY)]
                    });
                    setIsOuterZoom(false);
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
            setHistory([]);
            setDomain({
                x: [graphBound.minX, graphBound.maxX],
                y: [graphBound.minY, graphBound.maxY]
            });
        };

        const zoomIn = () => {
            const xRange = domain.x[1] - domain.x[0];
            const yRange = domain.y[1] - domain.y[0];
            const xCenter = (domain.x[0] + domain.x[1]) / 2;
            const yCenter = (domain.y[0] + domain.y[1]) / 2;
            pushDomain({
                x: [xCenter - xRange * 0.25, xCenter + xRange * 0.25],
                y: [yCenter - yRange * 0.25, yCenter + yRange * 0.25]
            });
        };

        const zoomOut = () => {            
            if (history.length !== 0 && !isOuterZoom) {
                const lastHistory = history[history.length - 1];
                setHistory(prev => prev.slice(0, -1));
                setDomain(lastHistory);
                setIsOuterZoom(false);
            } else {
                const xRange = domain.x[1] - domain.x[0];
                const yRange = domain.y[1] - domain.y[0];
                const xCenter = (domain.x[0] + domain.x[1]) / 2;
                const yCenter = (domain.y[0] + domain.y[1]) / 2;
                setDomain({
                    x: [xCenter - xRange, xCenter + xRange],
                    y: [yCenter - yRange, yCenter + yRange]
                });

                setIsOuterZoom(true);
            }
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
            <div className="width-full space-y-4">
                <div className="flex justify-end space-x-2">
                    <button className="btn btn-sm btn-circle" onClick={resetZoom}>
                        <RefreshCcw size={16} />
                    </button>
                    <button className="btn btn-sm btn-circle" onClick={zoomIn}>
                        <ZoomIn size={16} />
                    </button>
                    <button className="btn btn-sm btn-circle" onClick={zoomOut}>
                        <ZoomOut size={16} />
                    </button>
                </div>

                <div
                    ref={containerRef}
                    className="relative inset-0 aspect-[3/2]"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        setIsSelecting(false);
                        setSelection(null);
                    }}
                >
                    <Wrapped {...rest} data={filteredData}>
                        {React.Children.map(children, child => {
                            if (!child) return null;

                            console.log('Full Element:', child);

                            if (child.type?.displayName === 'XAxis') {
                                return React.cloneElement(child, {
                                    domain: domain.x,
                                    allowDataOverflow: true
                                });
                            }
                            if (child.type?.displayName === 'YAxis') {
                                return React.cloneElement(child, {
                                    domain: domain.y,
                                    allowDataOverflow: true
                                });
                            }
                            if (child.type?.displayName === 'ReferenceLineWithTooltip') {
                                return React.cloneElement(child, {
                                domain,
                                containerRef
                                });
                            }
                            return child;
                        })}
                    </Wrapped>
                    <SelectionOverlay />
                </div>
            </div>
        )
    }
}