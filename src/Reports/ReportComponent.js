import React from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { C_Button } from "../components/Common/CommonButton";
import { C_Select } from "../CustomValidateForm";
import { loginIsSCMParty } from "../components/Common/CommonFunction";

export const ShowAndExcelBtn = (props) => {
    const { sm, margin, showLoading, excelLoading, showOnClick, excelOnClick } = props

    return (
        <>
            <Col sm={sm} className={margin} >
                <C_Button
                    type="button"
                    spinnerColor="white"
                    loading={showLoading}
                    className="btn btn-success"
                    onClick={showOnClick}
                >
                    Show
                </C_Button>

            </Col>

            <Col sm={2} className={margin}>
                <C_Button
                    type="button"
                    spinnerColor="white"
                    loading={excelLoading}
                    className="btn btn-primary"
                    onClick={excelOnClick}
                >
                    Excel
                </C_Button>
            </Col>
        </>)

}

const PartyDropdownForReport = (props) => {

    const isSCMParty = loginIsSCMParty();
    const { partyValue, setPartyValue } = props

    const { partyList, partyDropdownLoading } = useSelector((state) => ({
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
    }));

    const PartyDropdownOptions = partyList.map((data) => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode
    }))

    return (
        isSCMParty && (
            <>
                <Col sm={3}>
                    <FormGroup className=" row mt-3 " >
                        <Label className="col-md-3 p-2 "
                            style={{ width: "90px" }}>Party</Label>
                        <Col sm={7}>
                            <C_Select
                                value={partyValue}
                                styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                isSearchable={true}
                                isLoading={partyDropdownLoading}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={PartyDropdownOptions}
                                onChange={(e) => setPartyValue(e)}
                            />
                        </Col>
                    </FormGroup>
                </Col >
            </>
        )
    );
};

export default PartyDropdownForReport;
