import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useValidatorStore } from '../../store/validatorStore';

export const ValidatorUptimeChart = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const { validators } = useValidatorStore();

    useEffect(() => {
        if (!validators.length || !containerRef.current || !svgRef.current) return;


        const data = [...validators].sort((a, b) => b.stake - a.stake).slice(0, 20);

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 20, right: 10, bottom: 20, left: 40 };

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const x = d3.scaleBand()
            .domain(data.map(d => d.id))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);


        svg.selectAll<SVGRectElement, any>(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.id)!)
            .attr("y", d => y(d.uptime))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.uptime))
        const defs = svg.append("defs");
        

        const gradientHigh = defs.append("linearGradient").attr("id", "grad-high").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%");
        gradientHigh.append("stop").attr("offset", "0%").attr("stop-color", "#059669");
        gradientHigh.append("stop").attr("offset", "100%").attr("stop-color", "#34d399");


        const gradientMed = defs.append("linearGradient").attr("id", "grad-med").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%");
        gradientMed.append("stop").attr("offset", "0%").attr("stop-color", "#d97706");
        gradientMed.append("stop").attr("offset", "100%").attr("stop-color", "#fbbf24");


        const gradientLow = defs.append("linearGradient").attr("id", "grad-low").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%");
        gradientLow.append("stop").attr("offset", "0%").attr("stop-color", "#be123c");
        gradientLow.append("stop").attr("offset", "100%").attr("stop-color", "#f43f5e");



        svg.selectAll<SVGRectElement, any>(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.id)!)
            .attr("y", d => y(d.uptime))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.uptime))
            .attr("fill", d => d.uptime > 99 ? "url(#grad-high)" : d.uptime > 90 ? "url(#grad-med)" : "url(#grad-low)")
            .attr("rx", 4);


        svg.selectAll(".bar")
            .append("title")
            .text((d: any) => `${d.name}: ${d.uptime.toFixed(2)}%`);


        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5));

    }, [validators]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};
