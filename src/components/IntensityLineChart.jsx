import * as d3 from 'd3';
import React from 'react';
import styled from 'styled-components';
import CircleMarkers from 'components/CircleMarkers'
import Line from 'components/Line';

const ActualIntensityLine = styled(Line) `
    fill: none;
    stroke: black;
`;

const ForecastIntensityLine = styled(Line) `
    fill: none;
    stroke: red;
    stroke-dasharray: 2, 2;
`;

function mapIntensityIndexToColour(index) {
    return {
        'very low': 'blue',
        low: 'green',
        moderate: 'yellow',
        high: 'orange',
        'very high': 'red'
    }[index];
}

function IntensityLineChart(props) {
    const svg = d3.select('svg');

    const margin = { top: 10, right: 10, bottom: 30, left: 30 };
    const width = props.width - margin.left - margin.left;
    const height = props.height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const timeAccessor = d => d3.isoParse(d.from);
    const actualIntensityAccessor = d => d.intensity.actual;
    const forecastIntensityAccessor = d => d.intensity.forecast;

    const xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(props.data, timeAccessor));

    const maxIntensity = d3.max(
        props.data,
        d => d3.max([actualIntensityAccessor(d), forecastIntensityAccessor(d)]))

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1.05 * maxIntensity]);

    const xAxis = g.append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', 'translate(0,' + height + ')')

    const yAxis = g.append('g')
        .call(d3.axisLeft(yScale))

    const tooltipGroup = g.append('g')
        .attr('display', 'none');

    const tooltipLine = tooltipGroup.append('line')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'black');

    const tooltipText = tooltipGroup.append('text');

    const chartArea = g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', () => tooltipGroup.attr('display', null))
        .on('mouseout', () => tooltipGroup.attr('display', 'none'))
        .on('mousemove', function () {
            const xPixel = d3.mouse(this)[0];
            const xValue = xScale.invert(xPixel);
            tooltipLine.attr('transform', 'translate(' + xPixel + ',0)');
            tooltipText
                .attr('transform', 'translate(' + xPixel + ',' + height + ')')
                .attr('dx', '0.50em')
                .attr('dy', '-0.50em')
                .text(xValue);
        });

    return (
        <svg
            viewBox={'0 0 ' + props.width + ' ' + props.height}
            visibility={props.visible ? null : 'hidden'}>
            <g
                width={width}
                height={height}
                transform={'translate(' + margin.left + ',' + margin.top + ')'}>
                <ActualIntensityLine
                    data={props.data}
                    xScale={xScale}
                    xAccessor={timeAccessor}
                    yScale={yScale}
                    yAccessor={actualIntensityAccessor}
                />
                <ForecastIntensityLine
                    data={props.data}
                    xScale={xScale}
                    xAccessor={timeAccessor}
                    yScale={yScale}
                    yAccessor={forecastIntensityAccessor}
                />
                <CircleMarkers
                    data={props.data}
                    xScale={xScale}
                    xAccessor={timeAccessor}
                    yScale={yScale}
                    yAccessor={actualIntensityAccessor}
                    r={2}
                    fillAccessor={d => mapIntensityIndexToColour(d.intensity.index)}
                />
            </g>
        </svg>
    )
}

export default IntensityLineChart;