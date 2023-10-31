import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { C_Button } from "./CommonButton";
import { C_Select } from "../../CustomValidateForm";
import { loginUserAdminRole } from "./CommonFunction";
import { commonPartyDropSelectAction } from "../../store/Utilites/PartyDrodown/action";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { mode } from "../../routes";

const NewCommonPartyDropdown = ({ pageMode }) => {

    const dispatch = useDispatch();

    const [selectedParty, setSelectedParty] = useState({ value: 0, label: "select...", SAPPartyCode: "" });
    const [changeButtonShow, setChangeButtonShow] = useState(false);

    const { partyList, partyDropdownLoading, commonPartyDropSelect } = useSelector((state) => ({
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            setSelectedParty(commonPartyDropSelect);
            setChangeButtonShow(true)
        }
    }, [commonPartyDropSelect]);

    const updateSelectedParty = () => {
        
        if (selectedParty.value === 0) {
            customAlert({ Type: 3, Message: "Please Select Party" });
            return;
        }
        setChangeButtonShow(true)
        dispatch(commonPartyDropSelectAction(selectedParty))
        localStorage.setItem("selectedParty", JSON.stringify(selectedParty));
    };

    const partyOnchange = () => {
        setChangeButtonShow(false)
        setSelectedParty({ value: 0, label: "select...", SAPPartyCode: "" })
        dispatch(commonPartyDropSelectAction({ value: 0, label: "select...", SAPPartyCode: "" }))
        localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select...", SAPPartyCode: "" }));
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
                                    options={PartyDropdownOptions}
                                    isDisabled={(changeButtonShow && !(selectedParty.value === 0))}
                                    onChange={(e) => setSelectedParty(e)}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="1">
                        {(!(changeButtonShow)) ? (
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={updateSelectedParty}
                            >
                                Select
                            </C_Button>
                        )
                            : !(pageMode === mode.view || pageMode === mode.edit) &&
                            (
                                <C_Button
                                    type="button"
                                    spinnerColor={"info"}
                                    className="btn btn-outline-info border-1 font-size-12 "
                                    onClick={partyOnchange}
                                >Change</C_Button>
                            )
                        }
                    </Col>

                </div>
            </div>
        )
    );
};

export default NewCommonPartyDropdown;