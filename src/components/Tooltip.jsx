import * as d3 from 'd3';
import React from 'react';

function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

function Tooltip(props) {
    return <g display={props.display ? null : 'none'} >
        <line y1={0} y2={props.height} stroke='black' transform={translate(props.xPixel, 0)} />
        <text transform={translate(props.xPixel, props.height)} dx='0.50em' dy='-0.50em' >
            {d3.timeFormat("%Y-%m-%d %H:%M:%S")(props.xScale.invert(props.xPixel))}
        </text>
    </g>
}

export default Tooltip;