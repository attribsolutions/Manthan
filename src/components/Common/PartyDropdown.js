import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { C_Button, Change_Button } from "./CommonButton";
import { C_Select } from "../../CustomValidateForm";
import { loginUserAdminRole } from "./CommonFunction";

const initialLocalStorageParty = () => {
    let party = JSON.parse(localStorage.getItem("selectedParty"));
    if (party.value === 0) {
        return { value: 0, label: "Select..." }
    }
    return party
}
const PartyDropdown = ({ goButtonHandler, changeButtonHandler }) => {

    const [selectedParty, setSelectedParty] = useState(initialLocalStorageParty);
    const [changeButtonShow, setChangeButtonShow] = useState(() => !(initialLocalStorageParty().value === 0));


    const partyList = useSelector((state) => state.CommonPartyDropdownReducer.commonPartyDropdown);

    const updateSelectedParty = (newValue) => {
        setSelectedParty(newValue);
    };

    const internalGoBtnHandler = async () => {
        localStorage.setItem("selectedParty", JSON.stringify(selectedParty));
        if (goButtonHandler) {
            await goButtonHandler();
        }
        setChangeButtonShow(true)
    }

    const internalChangeBtnHandler = () => {
        if (changeButtonHandler) {
            changeButtonHandler();
        }
        localStorage.setItem("selectedParty", JSON.stringify({ value: 0 }));
        setSelectedParty({ value: 0, label: "Select..." })
        setChangeButtonShow(false)
    };

    return (
        loginUserAdminRole() && (
            <div className="px-2 c_card_header text-black mb-1">
                <div className="row pt-2">
                    <Col sm="5">
                        <FormGroup className="row">
                            <Label className="col-sm-5 p-2" style={{ width: "83px" }}>
                                Party
                            </Label>
                            <Col sm="6">
                                <C_Select
                                    value={selectedParty}
                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={partyList.map((data) => ({
                                        value: data.id,
                                        label: data.Name,
                                    }))}
                                    isDisabled={(changeButtonShow)}
                                    onChange={(e) => updateSelectedParty(e)}
                                />
                            </Col>
                        </FormGroup>
                    </Col>


                    <Col sm="1">
                        {(!changeButtonShow) ? (
                            <C_Button
                                type="button"
                                loading={false}
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={internalGoBtnHandler}
                            >
                                Select
                            </C_Button>
                        ) : (
                            <Change_Button onClick={internalChangeBtnHandler} />
                        )}
                    </Col>

                </div>
            </div>
        )
    );
};

export default PartyDropdown;