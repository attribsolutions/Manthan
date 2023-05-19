import React from 'react'
import { Input } from 'reactstrap';

export const  CInput = (prop) => {
    const { onChange = () => { }, cpattern = '' } = prop

    function on_Change(e) {
        let val = e.target.value
        const result = cpattern.test(val);
        if (result) {
            onChange(e)
        }
        else {
            if ((val === '')) {
                onChange(e)
                return
            }
            e.target.value = val.slice(0, -1);
        }
    }
    const param = Object.assign({}, prop, { onChange: on_Change });

    return (<Input {...param} />)
}




