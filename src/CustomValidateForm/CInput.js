import React from 'react'
import { Input } from 'reactstrap';

const CInput = (prop) => {
    const { onChange=()=>{}, pattern = '' } = prop

    function on_Change(e) {
        let val = e.target.value
        const result = pattern.test(val);
        if (result) {
            onChange(e)
        }
        else {
            e.target.value = val.slice(0, -1);
        }
    }
    const param = Object.assign({}, prop, { onChange: on_Change });
    return (
        <div>
            <Input
                {...param}
            />
        </div>
    )
}

export default CInput
