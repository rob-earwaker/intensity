import * as d3 from 'd3';
import React from 'react';

function CircleMarkers(props) {
    function createCircleMarker(d, i) {
        return <circle
            key={i}
            cx={props.xScale(props.xAccessor(d))}
            cy={props.yScale(props.yAccessor(d))}
            r={props.r}
            fill={props.fillAccessor(d)}
        />
    }

    return <g className={props.className}>
        {props.data.map(createCircleMarker)}
    </g>
}

export default CircleMarkers;