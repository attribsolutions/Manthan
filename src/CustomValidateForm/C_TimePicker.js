
import React from "react";
import Flatpickr from "react-flatpickr";
import { Input } from "reactstrap";
import { convertDateTime_ydm } from "../components/Common/CommonFunction";

export const C_TimePicker = ({
    disabled,
    value,
    options = {
        enableTime: true, // Enable time picker
        dateFormat: 'd-m-Y H:i', // Date and time format
        time_24hr: true, // Use 24-hour time format
    },
    ...rest
}) => {

    return (
        <>{
            disabled ?
                <Input value={convertDateTime_ydm(value)} style={{ backgroundColor: "hsl(0, 0%, 95%)" }} disabled={true} />
                :
                <Flatpickr
                    {...rest}
                    value={value}
                    className="form-control d-block p-2 bg-white text-dark"
                    options={options}
                />
        }
        </>
    )
}