import * as d3 from 'd3';
import React from 'react';
import styled from 'styled-components';

const TooltipLine = styled.line`
    stroke: black
`;

function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

function findClosestDataPoint(props) {
    const mouseXValue = props.xScale.invert(props.mouseXPixel);

    const bisectX = d3.bisector(props.xAccessor).left;
    const bisectionIndex = bisectX(props.data, mouseXValue, 1);

    const lowerDataPoint = props.data[bisectionIndex - 1];
    const upperDataPoint = props.data[bisectionIndex];

    const lowerXValue = props.xAccessor(lowerDataPoint);
    const upperXValue = props.xAccessor(upperDataPoint);

    return mouseXValue - lowerXValue < upperXValue - mouseXValue
        ? lowerDataPoint
        : upperDataPoint;
}

function Tooltip(props) {
    if (!props.display) {
        return null;
    }

    const closestDataPoint = findClosestDataPoint(props);
    const tooltipXValue = props.xAccessor(closestDataPoint);
    const tooltipXPixel = props.xScale(tooltipXValue);

    const formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    return <g display={props.display ? null : 'none'} >
        <TooltipLine y1={0} y2={props.height} transform={translate(tooltipXPixel, 0)} />
        <text transform={translate(tooltipXPixel, props.height)} dx='0.50em' dy='-0.50em' >
            {formatTime(tooltipXValue)}
        </text>
    </g>
}

export default Tooltip;