import * as d3 from 'd3';
import React from 'react';

function CircleMarkers(props) {
    function createCircleMarker(d) {
        return <circle
            cx={props.xScale(props.xAccessor(d))}
            cy={props.yScale(props.yAccessor(d))}
        />
    }

    return <g className={this.props.className}>
        {props.data.map(createCircleMarker)}
    </g>
}

export default CircleMarkers;