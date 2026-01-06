import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNetworkStore } from '../../store/networkStore';

export const GasPriceChart = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const { metrics } = useNetworkStore();

    useEffect(() => {
        if (!metrics.length || !containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const now = metrics.length ? metrics[metrics.length - 1].timestamp : Date.now();
        const duration = 60 * 1000;

        const x = d3.scaleTime()
            .domain([new Date(now - duration), new Date(now)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(metrics, d => d.gasPrice) || 50])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const area = d3.area<any>()
            .x(d => x(new Date(d.timestamp)))
            .y0(y(0))
            .y1(d => y(d.gasPrice))
            .curve(d3.curveStepAfter);

        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "gas-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#f59e0b").attr("stop-opacity", 0.5);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#f59e0b").attr("stop-opacity", 0);

        svg.append("path")
            .datum(metrics)
            .attr("fill", "url(#gas-gradient)")
            .attr("d", area);

        svg.append("path")
            .datum(metrics)
            .attr("fill", "none")
            .attr("stroke", "#f59e0b")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line<any>()
                .x(d => x(new Date(d.timestamp)))
                .y(d => y(d.gasPrice))
                .curve(d3.curveStepAfter)
            );


        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10));
            
    }, [metrics]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};
