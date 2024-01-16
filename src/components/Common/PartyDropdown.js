import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { C_Button } from "./CommonButton";
import { C_Select } from "../../CustomValidateForm";
import { CommonConsole, loginCompanyID, loginUserAdminRole } from "./CommonFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { commonPartyDropSelectAction } from "../../store/Utilites/PartyDrodown/action";
import { mode } from "../../routes";
import { getpartysetting_API, getpartysetting_API_Success } from "../../store/Administrator/PartySetting/action";
import { alertMessages } from '../../components/Common/CommonErrorMsg/alertMsg';

const initialLocalStorageParty = () => {
    try {
        let party = JSON.parse(localStorage.getItem("selectedParty"));
        if (party.value === 0) {
            return { value: 0, label: "Select..." }
        }
        return party
    } catch (w) { CommonConsole(w) }
    return { value: 0, label: "Select..." }
}

const PartyDropdown = ({ goButtonHandler, changeButtonHandler, goBtnLoading, SAPLedgerOptions, pageMode }) => {

    const dispatch = useDispatch();

    const [selectedParty, setSelectedParty] = useState(initialLocalStorageParty);
    const [changeButtonShow, setChangeButtonShow] = useState(() => !(initialLocalStorageParty().value === 0));

    const { partyList, partyDropdownLoading } = useSelector((state) => ({
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
    }));

    const updateSelectedParty = (newValue) => {
        setSelectedParty(newValue);
    };

    useEffect(() => {

        const selectedParty = JSON.parse(localStorage.getItem("selectedParty"));

        if (selectedParty.value === 0) {
            setSelectedParty({ value: 0, label: "Select...", SAPPartyCode: "" })
            setChangeButtonShow(false)
        }
    }, []);

    const internalGoBtnHandler = async () => {
        if (selectedParty.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.requiredPartySelection });
            return;
        }
        dispatch(getpartysetting_API(selectedParty.value, loginCompanyID()));
        dispatch(commonPartyDropSelectAction(selectedParty))  // new common party dropdown set
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
        dispatch(commonPartyDropSelectAction({ value: 0, label: "select...", SAPPartyCode: "" }))// new common party dropdown set
        dispatch(getpartysetting_API_Success([]))
        localStorage.setItem("selectedParty", JSON.stringify({ value: 0 }));
        setSelectedParty({ value: 0, label: "Select...", SAPPartyCode: "" })
        setChangeButtonShow(false)
    };

    const PartyDropdownOptions = partyList.map((data) => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode
    }))

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
                                    isLoading={partyDropdownLoading}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={(SAPLedgerOptions === undefined) ? PartyDropdownOptions : SAPLedgerOptions}
                                    isDisabled={(changeButtonShow && !(selectedParty.value === 0))}
                                    onChange={(e) => updateSelectedParty(e)}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="1">
                        {(!(changeButtonShow)) ? (
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={internalGoBtnHandler}
                            >
                                Select
                            </C_Button>
                        ) : !(pageMode === mode.view || pageMode === mode.edit) && (
                            <C_Button
                                type="button"
                                spinnerColor={"info"}
                                className="btn btn-outline-info border-1 font-size-12 "
                                onClick={internalChangeBtnHandler}
                                loading={goBtnLoading}
                            // forceDisabled={pageMode === mode.view || pageMode === mode.edit}
                            >Change</C_Button>
                        )}
                    </Col>

                </div>
            </div>
        )
    );
};

export default PartyDropdown;