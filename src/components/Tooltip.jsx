import * as d3 from 'd3';
import React from 'react';

class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            xPixel: 0
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    onMouseOver() {
        this.setState({ display: true });
    }

    onMouseOut() {
        this.setState({ display: false, xPixel: 0 });
    }

    onMouseMove(event) {
        this.setState({ display: true, xPixel: d3.clientPoint(event.currentTarget, event)[0] });
    }

    render() {
        return <React.Fragment>
            <rect
                width={this.props.width}
                height={this.props.height}
                fill='none'
                onMouseOver={this.mouseOver}
                onMouseOut={this.onMouseOut}
                onMouseMove={this.onMouseMove}
            />
            <g display={this.state.display ? null : 'none'} >
                <line
                    y1={0}
                    y2={this.props.height}
                    stroke='black'
                    transform={'translate(' + this.state.xPixel + ',0)'} />
                <text
                    transform={'translate(' + this.state.xPixel + ',' + this.props.height + ')'}
                    dx='0.50em'
                    dy='-0.50em' >
                    {d3.timeFormat("%Y-%m-%d %H:%M:%S")(this.props.xScale.invert(this.state.xPixel))}
                </text>
            </g>
        </React.Fragment>
    }
}

export default Tooltip;