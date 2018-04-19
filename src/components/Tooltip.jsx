import * as d3 from 'd3';
import React from 'react';

function Tooltip(props) {
    const tooltipGroup = d3.select('#tooltip')
        .attr('display', 'none');

    const tooltipLine = tooltipGroup.append('line')
        .attr('y1', 0)
        .attr('y2', props.height)
        .attr('stroke', 'black');

    const tooltipText = tooltipGroup.append('text');

    const chartArea = d3.select('#chart-area')
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', () => tooltipGroup.attr('display', null))
        .on('mouseout', () => tooltipGroup.attr('display', 'none'))
        .on('mousemove', function () {
            const xPixel = d3.mouse(this)[0];
            const xValue = props.xScale.invert(xPixel);
            tooltipLine.attr('transform', 'translate(' + xPixel + ',0)');
            tooltipText
                .attr('transform', 'translate(' + xPixel + ',' + height + ')')
                .attr('dx', '0.50em')
                .attr('dy', '-0.50em')
                .text(xValue);
        });

    return <g id='tooltip'>
        <rect id='chart-area'/>
    </g>
}

export default Tooltip;