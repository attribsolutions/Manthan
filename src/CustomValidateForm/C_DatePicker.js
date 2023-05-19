
import React from "react";
import Flatpickr from "react-flatpickr";
import { Input } from "reactstrap";
import { date_dmy_func } from "../components/Common/CommonFunction";

export const C_DatePicker = (props) => {
    return (
        <>{
            props.disabled ?
                <Input value={date_dmy_func(props.value)} style={{ backgroundColor: "hsl(0, 0%, 95%)" }} disabled={true} />
                :
                <Flatpickr
                    style={{ userselect: "all" }}
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    defaultValue={props.defaultValue}
                    className="form-control d-block p-2 bg-white text-dark"
                    placeholder={props.placeholder}
                    options={{
                        altInput: true,
                        altFormat: "d-m-Y",
                        dateFormat: "Y-m-d",
                    }}
                    onChange={props.onChange}
                />
        }
        </>
    )
}