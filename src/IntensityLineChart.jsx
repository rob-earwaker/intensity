import * as d3 from 'd3';
import React from 'react';
import ActualIntensityLine from '../src/ActualIntensityLine';
import ForecastIntensityLine from '../src/ForecastIntensityLine';

class IntensityLineChart extends React.Component {
    indexColour(index) {
        return {
            'very low': 'blue',
            low: 'green',
            moderate: 'yellow',
            high: 'orange',
            'very high': 'red'
        }[index];
    }

    render() {
        const svg = d3.select('svg');

        const margin = { top: 10, right: 10, bottom: 30, left: 30 };
        const width = this.props.width - margin.left - margin.left;
        const height = this.props.height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        const xScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(this.props.data, function (d) { return d3.isoParse(d.from); }));

        const maxIntensity = d3.max(
            this.props.data,
            function (d) { return d3.max([d.intensity.actual, d.intensity.forecast]); })

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 1.05 * maxIntensity]);

        const xAxis = g.append('g')
            .call(d3.axisBottom(xScale))
            .attr('transform', 'translate(0,' + height + ')')

        const yAxis = g.append('g')
            .call(d3.axisLeft(yScale))

        const indexMarkers = g.selectAll('circle')
            .data(this.props.data, function (d) { return d.index; })
            .enter()
            .append('circle')
            .attr('cx', function (d) { return xScale(d3.isoParse(d.from)); })
            .attr('cy', function (d) { return yScale(d.intensity.actual); })
            .attr('fill', d => this.indexColour(d.intensity.index))
            .attr('r', 2);

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
            .on('mouseover', function () { tooltipGroup.attr('display', null); })
            .on('mouseout', function () { tooltipGroup.attr('display', 'none'); })
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
                viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
                visibility={this.props.visible ? null : 'hidden'}>
                <g
                    width={width}
                    height={height}
                    transform={'translate(' + margin.left + ',' + margin.top + ')'}>
                    <ActualIntensityLine
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={d => d3.isoParse(d.from)}
                        yScale={yScale}
                        yAccessor={d => d.intensity.actual}
                    />
                    <ForecastIntensityLine
                        data={this.props.data}
                        xScale={xScale}
                        xAccessor={d => d3.isoParse(d.from)}
                        yScale={yScale}
                        yAccessor={d => d.intensity.forecast}
                    />
                </g>
            </svg>
        )
    }
}

export default IntensityLineChart;