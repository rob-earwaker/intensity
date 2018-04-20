import React from 'react';

function DateTimeInput(props) {
    return <input
        className={props.className}
        type='date'
        value={props.value}
        onChange={props.onChange}
    />
}

export default DateTimeInput;