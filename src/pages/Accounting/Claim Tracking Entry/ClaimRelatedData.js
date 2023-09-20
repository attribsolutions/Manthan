
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";

export function ClaimForTheMonthOtions() {
    let currentYear = new Date().getFullYear(); // Get the current year
    let currentMonth = new Date().getMonth() + 1; // Get the current month (0-based index)

    let currentAndLastYear = [];

    for (let year = currentYear - 1; year <= currentYear; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === currentYear && month > currentMonth) {
                break; // Stop when reaching future months in the current year
            }

            const monthNames = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ];

            currentAndLastYear.push({
                year: year,
                monthNumber: month.toString().padStart(2, '0'),
                monthName: monthNames[month - 1]
            });
        }
    }

    return currentAndLastYear;
}

export const ClaimForTheMonthOtion = ClaimForTheMonthOtions().map((data, index, key) => ({
    value: index + 1,
    label: `${data.monthName}(${data.year})`,
    monthNumber: data.monthNumber,
    year: `${data.year}`
}));


// Reusable component for form groups with label and input/select
export function FormGroupWithLabel(props) {
    const { label, children } = props;
    return (
        <FormGroup className="row mt-1">
            <Label className="col-sm-1 p-2" style={{ width: "115px", marginRight: "0.4cm" }}>
                {label}
            </Label>
            <Col sm="7">{children}</Col>
        </FormGroup>
    );
}

// Reusable function for rendering a Select component
export function renderSelect(name, value, options, onChange, isError) {
    return (
        <Select
            name={name}
            value={value}
            isSearchable={true}
            className="react-dropdown"
            classNamePrefix="dropdown"
            styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
            options={options}
            onChange={(hasSelect, evn) => onChange(hasSelect, evn)}
        />
    );
}

// Reusable function for rendering an Input component
export function renderInput(name, value, isError, placeholder, onChange) {
    return (
        <Input
            type="text"
            name={name}
            id={name}
            value={value}
            placeholder={placeholder}
            autoComplete='off'
            autoFocus={true}
            className={isError.length > 0 ? "is-invalid form-control" : "form-control"}
            onChange={(event) => onChange({ event })}
        />
    );
}
