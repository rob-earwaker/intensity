import React from 'react';

function DateTimeInput(props) {
    return <input
        className={props.className}
        type='datetime-local'
        step={30 * 60}
        value={props.value}
        onChange={props.onChange}
    />
}

export default DateTimeInput;