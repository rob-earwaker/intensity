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

class IntensityLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseInChart: false,
            mouseXPixel: 0
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    onMouseEnter() {
        this.setState({ mouseInChart: true });
    }

    onMouseLeave() {
        this.setState({ mouseInChart: false, mouseXPixel: 0 });
    }

    onMouseMove(event) {
        this.setState({
            mouseInChart: true,
            mouseXPixel: d3.clientPoint(event.currentTarget, event)[0]
        });
    }

    render() {
        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        const width = this.props.width - margin.left - margin.left;
        const height = this.props.height - margin.top - margin.bottom;

        const timeAccessor = d => d3.isoParse(d.from);
        const actualIntensityAccessor = d => d.intensity.actual;
        const forecastIntensityAccessor = d => d.intensity.forecast;

        const xScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(this.props.data, timeAccessor));

        const maxIntensity = d3.max(
            this.props.data,
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
            <svg viewBox={'0 0 ' + this.props.width + ' ' + this.props.height} visibility={this.props.visible ? null : 'hidden'}>
                <rect
                    width={width}
                    height={height}
                    transform={translate(margin.left, margin.top)}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onMouseMove={this.onMouseMove}
                    pointerEvents='all'
                    fill='none'
                />
                <g transform={translate(margin.left, margin.top)} pointerEvents='none'>
                    <g id='x-axis' />
                    <g id='y-axis' />
                    <ActualIntensityLine
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={actualIntensityAccessor}
                    />
                    <ForecastIntensityLine
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={forecastIntensityAccessor}
                    />
                    <CircleMarkers
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={actualIntensityAccessor}
                        r={2}
                        fillAccessor={d => mapIntensityIndexToColour(d.intensity.index)}
                    />
                    <Tooltip
                        display={this.props.visible && this.state.mouseInChart}
                        height={height}
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        mouseXPixel={this.state.mouseXPixel} />
                </g>
            </svg>
        )
    }
}

export default IntensityLineChart;