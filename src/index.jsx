import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import ChartArea from '../src/ChartArea.jsx';

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFrom: '2017-10-01',
            dateTo: '2017-10-07',
            isLoading: false,
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
        this.setState({ isLoading: true });
        const dateFrom = this.state.dateFrom;
        const dateTo = this.state.dateTo;
        const url = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/${dateTo}`;
        d3.json(url).then(json => this.setState({ data: json.data, isLoading: false }));
    }

    render() {
        return (
            <React.Fragment>
                <h1>Chart #1</h1>
                <Form inline>
                    <FormGroup>
                        <ControlLabel>Start</ControlLabel>
                        <FormControl type='date' value={this.state.dateFrom} onChange={this.onDateFromChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>End</ControlLabel>
                        <FormControl type='date' value={this.state.dateTo} onChange={this.onDateToChange} />
                    </FormGroup>
                    <Button disabled={this.state.isLoading} onClick={this.onLoad}>
                        {this.state.isLoading ? 'Loading...' : 'Load Data'}
                    </Button>
                </Form>
                <ChartArea visible={this.state.data.length > 0} width={960} height={480} data={this.state.data} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<Chart />, document.getElementById('root'));
