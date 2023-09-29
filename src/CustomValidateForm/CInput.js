import React, { useRef } from 'react'
import { Input } from 'reactstrap';

export const CInput = ({ onChange = () => { }, cpattern = '', ...rest }) => {
    const prevValueRef = useRef('');
    function on_Change(e) {
        let val = e.target.value;
        const result = cpattern.test(val);
        const isEmpty = val === '';

        if (result || isEmpty) {
            prevValueRef.current = val;
            onChange(e);
        } else {
            e.target.value = prevValueRef.current;
        }
    }
    return (
        <Input
            autoComplete='off'
            onChange={on_Change}
            {...rest} />
    )
}




