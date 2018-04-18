import * as d3 from 'd3';
import React from 'react';

function Line(props) {
    const line = d3.line()
        .x(d => props.xScale(props.xAccessor(d)))
        .y(d => props.yScale(props.yAccessor(d)));

    const pathData = line(props.data)

    return <path d={pathData} className={props.className} />
}

export default Line;