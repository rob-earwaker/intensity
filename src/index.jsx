import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

class ChartArea extends React.Component {
    render() {
        const svg = d3.select('svg');

        svg.selectAll('*').remove();

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

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 1.05 * d3.max(this.props.data, function (d) { return d.intensity.actual; })]);

        const xAxis = g.append('g')
            .call(d3.axisBottom(xScale))
            .attr('transform', 'translate(0,' + height + ')')

        const yAxis = g.append('g')
            .call(d3.axisLeft(yScale))

        const dataLine = g.append('path')
            .datum(this.props.data)
            .attr('d', d3.line()
                .x(function (d) { return xScale(d3.isoParse(d.from)); })
                .y(function (d) { return yScale(d.intensity.actual); }))
            .attr('fill', 'none')
            .attr('stroke', 'black');

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

        return <svg width={this.props.width} height={this.props.height} />
    }
}

class Button extends React.Component {
    render() {
        return (
            <button type='button' onClick={this.props.onClick}>
                {this.props.content}
            </button>
        )
    }
}

class DateInput extends React.Component {
    render() {
        return (
            <input
                type="text"
                value={this.props.value}
                onChange={this.props.onChange} />
        )
    }
}

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFrom: '2017-10-01',
            dateTo: '2017-10-29',
            data: []
        };
        this.onLoad = this.onLoad.bind(this);
        this.onDateFromChange = this.onDateFromChange.bind(this);
        this.onDateToChange = this.onDateToChange.bind(this);
    }

    onDateFromChange(event) {
        this.setState({ dateFrom: event.target.value });
    }

    onDateToChange(event) {
        this.setState({ dateTo: event.target.value });
    }

    onLoad() {
        const dateFrom = this.state.dateFrom;
        const dateTo = this.state.dateTo;
        const url = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/${dateTo}`;
        d3.json(url).then(json => this.setState({ data: json.data }));
    }

    render() {
        return (
            <React.Fragment>
                <h1>Chart #1</h1>
                <div>
                    <DateInput value={this.state.dateFrom} onChange={this.onDateFromChange} />
                    <DateInput value={this.state.dateTo} onChange={this.onDateToChange} />
                    <Button onClick={this.onLoad} content='Load' />
                </div>
                <ChartArea width={960} height={480} data={this.state.data} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<Chart />, document.getElementById('root'));
