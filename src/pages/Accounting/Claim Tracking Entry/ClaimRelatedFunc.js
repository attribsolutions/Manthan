
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { GenralMasterSubType } from "../../../helpers/backend_helper";
import { loginCompanyID } from "../../../components/Common/CommonFunction";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";

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

//GenralMasterSubType API call For Type ,TypeOfClaim,ClaimCheckBy ,CreditNoteStatus dropdowns
export const fetchDataAndSetDropdown = async (TypeID, setDropdown) => {
    const jsonBody = JSON.stringify({
        Company: loginCompanyID(),
        TypeID: TypeID,
    });

    const resp = await GenralMasterSubType(jsonBody);
    if (resp.StatusCode === 200) {
        setDropdown(
            resp.Data.map((index) => ({
                value: index.id,
                label: index.Name,
            })));
    }
};

export const getCurrent_Month_And_Year = (inputDate) => {

    let year = "";
    let month = "";

    if (!inputDate) {
        const currentDate = new Date();
        year = String(currentDate.getFullYear());
        month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    }
    else {
        const [yy, mm] = inputDate.split('-').map(Number);
        year = String(yy);
        month = String(mm).padStart(2, '0'); // Month is zero-indexed
    }

    return {
        Year: year,
        Month: month
    };
}

export const updateFormFieldsAndValidation = ({ hasEditVal, state }) => {
    const {
        id, Date, ClaimReceivedSource, ClaimAmount, Remark, CreditNoteNo, CreditNoteDate,
        CreditNoteAmount, ClaimSummaryDate, CreditNoteUpload, Claim, TypeName, Type,
        ClaimTradeName, ClaimTrade, TypeOfClaimName, TypeOfClaim, ClaimCheckByName, ClaimCheckBy,
        CreditNotestatusName, CreditNotestatus, PartyName, Party, Year, Month, PartyTypeName, FullClaimNo,
    } = hasEditVal;

    const { values, fieldLabel, hasValid, required, isError } = { ...state };

    // Set validation values to true
    for (const key in hasValid) {
        if (hasValid.hasOwnProperty(key)) {
            hasValid[key].valid = true;
        }
    }

    values.id = id;
    values.Date = Date;
    values.ClaimReceivedSource = ClaimReceivedSource;
    values.ClaimAmount = ClaimAmount;
    values.Remark = Remark;
    values.CreditNoteNo = CreditNoteNo;
    values.CreditNoteDate = CreditNoteDate;
    values.CreditNoteAmount = CreditNoteAmount;
    values.ClaimSummaryDate = ClaimSummaryDate;
    values.CreditNoteUpload = CreditNoteUpload;
    values.ClaimText = FullClaimNo;

    values.ClaimId = { label: `${id} ${PartyName} / ${PartyTypeName} (${ClaimAmount})`, value: Claim };
    values.Type = { label: TypeName, value: Type };
    values.ClaimTrade = { label: ClaimTradeName, value: ClaimTrade };
    values.TypeOfClaim = TypeOfClaimName === null ? { label: "Select...", value: null } : { label: TypeOfClaimName, value: TypeOfClaim };
    values.ClaimCheckBy = { label: ClaimCheckByName, value: ClaimCheckBy };
    values.CreditNotestatus = { label: CreditNotestatusName, value: CreditNotestatus };
    values.PartyName = { label: PartyName, value: Party };
};


