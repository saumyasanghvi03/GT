import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Simplified GeoJSON URL for India (States)
// Using a reliable public source or a placeholder logic if fetch fails
const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson';

const IndiaGeoMap = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipToken, setTooltipToken] = useState<{ x: number, y: number, name: string, value: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 600;
        const height = 700;

        // Clear previous render
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g");

        // Fetch GeoJSON
        d3.json(INDIA_GEOJSON_URL).then((data: any) => {
            setLoading(false);
            if (!data || !data.features) {
                setError("Failed to load map data");
                return;
            }

            // Projection
            const projection = d3.geoMercator()
                .center([82, 23]) // Center on India
                .scale(1000)
                .translate([width / 2, height / 2]);

            const path = d3.geoPath().projection(projection);

            // Mock Data Generator
            const getRandomValue = () => Math.floor(Math.random() * 5000) + 500;

            // Draw Paths
            g.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                // @ts-ignore
                .attr("d", path)
                .attr("fill", () => d3.interpolateBlues(Math.random() * 0.8 + 0.2)) // Random blue shade representing sales intensity
                .attr("stroke", "#1E293B") // Terminal border color
                .attr("stroke-width", 1)
                .style("cursor", "pointer")
                .on("mouseover", (event, d: any) => {
                    d3.select(event.currentTarget)
                        .attr("opacity", 0.7)
                        .attr("stroke", "#EAB308"); // Amber highlight

                    setTooltipToken({
                        x: event.pageX,
                        y: event.pageY,
                        name: d.properties.NAME_1 || d.properties.name || "Unknown State",
                        value: getRandomValue()
                    });
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                        .attr("opacity", 1)
                        .attr("stroke", "#1E293B");
                    setTooltipToken(null);
                });

        }).catch(err => {
            console.error("Map Load Error:", err);
            setLoading(false);
            setError("Could not load map data.");
        });

    }, []);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center bg-terminal-surface/30 rounded-lg border border-terminal-border overflow-hidden">
            {loading && <div className="text-terminal-accent animate-pulse">Loading Cartography...</div>}
            {error && <div className="text-red-500">{error}</div>}

            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 700" className="max-h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"></svg>

            {/* Tooltip Overlay */}
            {tooltipToken && (
                <div
                    className="fixed pointer-events-none bg-terminal-bg border border-terminal-accent text-terminal-text text-xs p-2 rounded shadow-lg z-50 transform -translate-x-1/2 -translate-y-full mb-2"
                    style={{ left: tooltipToken.x, top: tooltipToken.y }}
                >
                    <div className="font-bold">{tooltipToken.name}</div>
                    <div className="text-terminal-text-muted">Sales: ₹ {tooltipToken.value} Cr</div>
                </div>
            )}

            <div className="absolute bottom-4 right-4 bg-terminal-bg/80 border border-terminal-border p-2 rounded text-xs text-terminal-text-muted">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-900"></div> Low Penetration
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-300"></div> High Penetration
                </div>
            </div>
        </div>
    );
};

export default IndiaGeoMap;
