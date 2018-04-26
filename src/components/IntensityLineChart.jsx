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

const VERY_LOW = { name: 'very low', rank: 0, colour: 'blue' };
const LOW = { name: 'low', rank: 1, colour: 'green' };
const MODERATE = { name: 'moderate', rank: 2, colour: 'yellow' };
const HIGH = { name: 'high', rank: 3, colour: 'orange' };
const VERY_HIGH = { name: 'very high', rank: 4, colour: 'red' };

const intensityIndexNameMap = {
    [VERY_LOW.name]: VERY_LOW,
    [LOW.name]: LOW,
    [MODERATE.name]: MODERATE,
    [HIGH.name]: HIGH,
    [VERY_HIGH.name]: VERY_HIGH
};

const intensityIndexRankMap = [
    VERY_LOW,
    LOW,
    MODERATE,
    HIGH,
    VERY_HIGH
];

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

        const xScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(this.props.data, timeAccessor));

        function xPixel(d) {
            return Math.round(xScale(timeAccessor(d)));
        }

        const data = d3.nest()
            .key(xPixel)
            .rollup(g => {
                const indexRanks = g.map(d => intensityIndexNameMap[d.intensity.index].rank);
                const medianRankIndex = Math.floor(indexRanks.length / 2);
                const medianRank = indexRanks[medianRankIndex];
                return {
                    from: d3.isoFormat(d3.min(g, d => d3.isoParse(d.from))),
                    to: d3.isoFormat(d3.max(g, d => d3.isoParse(d.to))),
                    intensity: {
                        actual: d3.max(g, d => d.intensity.actual),
                        forecast: d3.max(g, d => d.intensity.forecast),
                        index: intensityIndexRankMap[medianRank]
                    }
                }
            })
            .entries(this.props.data)
            .map(d => d.value);

        const maxIntensity = d3.max(data, d => d3.max([d.intensity.actual, d.intensity.forecast]))

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
                        data={data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={d => d.intensity.actual}
                    />
                    <ForecastIntensityLine
                        data={data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={d => d.intensity.forecast}
                    />
                    <CircleMarkers
                        data={data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yScale={yScale}
                        yAccessor={d => d.intensity.actual}
                        r={2}
                        fillAccessor={d => d.intensity.index.colour}
                    />
                    <Tooltip
                        display={this.props.visible && this.state.mouseInChart}
                        height={height}
                        data={data}
                        xScale={xScale}
                        xAccessor={timeAccessor}
                        yAccessor={d => d.intensity.actual}
                        mouseXPixel={this.state.mouseXPixel} />
                </g>
            </svg>
        )
    }
}

export default IntensityLineChart;