import * as d3 from 'd3';
import React from 'react';

class Line extends React.Component {
    render() {
        const line = d3.line()
            .x(d => this.props.xScale(this.props.xAccessor(d)))
            .y(d => this.props.yScale(this.props.yAccessor(d)));

        const pathData = line(this.props.data)

        return <path d={pathData} className={this.props.className} />
    }
}

export default Line;