import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { getPartyListAPI } from "../../store/Administrator/PartyRedux/action";
import { C_Button, Change_Button, Go_Button } from "./CommonButton";
import { C_Select } from "../../CustomValidateForm";
import { loginUserAdminRole } from "./CommonFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";

const PartyDropdown_Common = (props) => {

    const dispatch = useDispatch();

    const userAdminRole = loginUserAdminRole();

    const { goButtonHandler, change_ButtonHandler, changeBtnShow } = props;

    const [party, setParty] = useState({ value: 0, label: "Select..." });

    const { partyList, partyDropDownLoading } = useSelector((state) => ({
        partyDropDownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
    }));

    const party_DropdownOptions = partyList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    useEffect(() => {
        const storedSelectedParty = JSON.parse(localStorage.getItem("selectedParty"));
        if (storedSelectedParty) {
            setParty(storedSelectedParty);
        }
    }, []);

    const updatePartySelectAndLocalStorage = (newValue) => {
        localStorage.setItem("selectedParty", JSON.stringify(newValue));
        setParty(newValue);
    };

    return (
        <React.Fragment>
            {userAdminRole &&
                <div className="px-2   c_card_header text-black mb-1 ">
                    <div className="row pt-2">
                        <Col sm="5">
                            <FormGroup className=" row ">
                                <Label className="col-sm-5 p-2" style={{ width: "83px" }}>
                                    Party
                                </Label>
                                <Col sm="6">
                                    <C_Select
                                        value={party}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        isLoading={partyDropDownLoading}
                                        options={party_DropdownOptions}
                                        isDisabled={changeBtnShow}
                                        onChange={(e) => {
                                            updatePartySelectAndLocalStorage(e);
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {goButtonHandler && (
                            <Col sm="1">
                                {!changeBtnShow ? (
                                    <C_Button
                                        type="button"
                                        loading={false}
                                        forceDisabled={partyDropDownLoading}
                                        className="btn btn-outline-primary border-1 font-size-12 text-center"
                                        onClick={() => goButtonHandler()}>
                                        Select
                                    </C_Button>
                                ) : (
                                    <Change_Button onClick={() => change_ButtonHandler()} />
                                )}
                            </Col>
                        )}

                    </div>
                </div>}

        </React.Fragment>
    );
};

export default PartyDropdown_Common;