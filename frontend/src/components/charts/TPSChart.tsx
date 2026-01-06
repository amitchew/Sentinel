import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNetworkStore } from '../../store/networkStore';

export const TPSChart = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const { metrics } = useNetworkStore();

    useEffect(() => {
        if (!metrics.length || !containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const now = metrics.length ? metrics[metrics.length - 1].timestamp : Date.now();
        const duration = 60 * 1000;

        const x = d3.scaleTime()
            .domain([new Date(now - duration), new Date(now)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, Math.max(d3.max(metrics, d => d.tps) || 0, 5)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = (g: any) => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = (g: any) => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call((g: any) => g.select(".domain").remove())
            .call((g: any) => g.selectAll(".tick line").clone()
                .attr("x2", width - margin.left - margin.right)
                .attr("stroke-opacity", 0.1))
            .call((g: any) => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("TPS"));

        const line = d3.line<any>()
            .defined(d => !isNaN(d.tps))
            .x(d => x(new Date(d.timestamp)))
            .y(d => y(d.tps))
            .curve(d3.curveMonotoneX);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg.append("path")
            .datum(metrics)
            .attr("fill", "none")
            .attr("stroke", "#3b82f6")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);


        const brush = d3.brushX()
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
            .on("end", brushed);

        svg.append("g")
            .call(brush);

        function brushed({ selection }: { selection: [number, number] | null }) {
            if (!selection) {
                x.domain(d3.extent(metrics, d => new Date(d.timestamp)) as [Date, Date]);
            } else {
                x.domain([x.invert(selection[0]), x.invert(selection[1])]);
                svg.select(".brush").call(brush.move as any, null);
            }
            
        }

    }, [metrics]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};
