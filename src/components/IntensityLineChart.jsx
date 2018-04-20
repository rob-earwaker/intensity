import * as d3 from 'd3';
import React from 'react';
import styled from 'styled-components';
import CircleMarkers from 'components/CircleMarkers'
import Line from 'components/Line';
import Tooltip from 'components/Tooltip';

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

function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

function IntensityLineChart(props) {
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = props.width - margin.left - margin.left;
    const height = props.height - margin.top - margin.bottom;

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

    const xAxis = d3.select('#x-axis')
        .call(d3.axisBottom(xScale))
        .attr('transform', translate(0, height))

    const yAxis = d3.select('#y-axis')
        .call(d3.axisLeft(yScale))

    return (
        <svg viewBox={'0 0 ' + props.width + ' ' + props.height} visibility={props.visible ? null : 'hidden'}>
            <g transform={translate(margin.left, margin.top)} pointerEvents='all'>
                <g id='x-axis' />
                <g id='y-axis' />
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
                <Tooltip width={width} height={height} xScale={xScale} />
            </g>
        </svg>
    )
}

export default IntensityLineChart;