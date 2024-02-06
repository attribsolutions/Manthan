import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardFooter, CardHeader, Label } from "reactstrap";
import { C_Button } from "../../Common/CommonButton";
import { C_Select } from "../../../CustomValidateForm";
import { loginUserAdminRole } from "../../Common/CommonFunction";
import { commonPartyDropSelectAction } from "../../../store/Utilites/PartyDrodown/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { mode } from "../../../routes";
import './changeParty.scss'; // Add your styles here
import { useRef } from "react";
import { Bounce, toast } from "react-toastify";
import { showToastAlert } from "../../../helpers/axios_Config";

const ChangeCommonParty = (props) => {

    const dispatch = useDispatch();
    const componentRef = useRef(null);

    // Local state
    const [selectedParty, setSelectedParty] = useState({ value: 0, label: "select party...", SAPPartyCode: "" });
    const [changeButtonShow, setChangeButtonShow] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Selectors from Redux store
    const {
        commonPartyDropdownOption,
        partyDropdownLoading,
        commonPartyDropSelect,
        forceDisable,
        isShow,
        isShowOnlySAPParty
    } = useSelector((state) => state.CommonPartyDropdownReducer);

    // useEffect to update selected party when commonPartyDropSelect changes
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            setSelectedParty(commonPartyDropSelect);
            setChangeButtonShow(true);
        }
    }, [commonPartyDropSelect]);


    useEffect(() => {
        const closeDrawerOnOutsideClick = (event) => {
            // Check if the click is outside the component and if the drawer is open
            if (componentRef.current && isDrawerOpen && !componentRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
        };

        // Add event listener to the document for outside clicks
        document.addEventListener("mousedown", closeDrawerOnOutsideClick);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", closeDrawerOnOutsideClick);
        };
    }, [isDrawerOpen]);


    // Function to update the selected party
    const updateSelectedParty = () => {
        if (selectedParty.value === 0) {
            customAlert({ Type: 3, Message: "Please Select Party" });
            return;
        }
        setIsDrawerOpen(false);
        setChangeButtonShow(true);
        dispatch(commonPartyDropSelectAction(selectedParty));
        localStorage.setItem("selectedParty", JSON.stringify(selectedParty));
    };

    // Function to handle party change
    const partyOnchange = () => {
        setChangeButtonShow(false);
        setSelectedParty({ value: 0, label: "select party...", SAPPartyCode: "" });
        dispatch(commonPartyDropSelectAction({ value: 0, label: "select party...", SAPPartyCode: "" }));
        localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select...", SAPPartyCode: "" }));
    };

        // Function to handle to Cancel button
        const handleCancelBtn = () => {
            setIsDrawerOpen(false);
        };

        const PartyDropdownOptions = commonPartyDropdownOption.map(data => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode
    })).filter(index => !isShowOnlySAPParty || index.SAPPartyCode !== null);

    // Function to toggle drawer
    const handleLabelClick = () => {
        if (!props.isPartyWisePage || !isShow || forceDisable) {
            showToastAlert("This page does not require party information.", "warning");
            return
        }
        setIsDrawerOpen(!isDrawerOpen);
    };



    // Function to check is party wise page and has show true
    function funcSelectedPartylabel() {
        if (!props.isPartyWisePage || !isShow) {
            return "Party not required."
        }
        //to capitalize the first letter and convert the rest to lowercase
        const partylable = commonPartyDropSelect?.label || ''
        return partylable.charAt(0).toUpperCase() + partylable.slice(1).toLowerCase();
    }

    // Check user role, if not admin return null
    if (!loginUserAdminRole()) {
        return null;
    };

    const partylabelStyle = !props.isPartyWisePage || !isShow || forceDisable ? { color: "gray" } : {};

    return (
        <div className="change-party-contener" ref={componentRef}>
            <div className="party-label-wapper" onClick={handleLabelClick}>
                <div className="party-label" style={partylabelStyle}  >
                    <i className="fas fa-user pr-1" style={{ paddingTop: "7px", fontSize: "small" }}></i>
                    <span className="party-label-name">{funcSelectedPartylabel()}</span>
                </div>
                <div style={{ alignSelf: "center", ...partylabelStyle }}>
                    {isDrawerOpen ? <i className="fas fa-times"></i> : <i className="fas fa-angle-right"></i>}
                </div>
            </div>

            {isDrawerOpen && (
                <div className="mini-drawer">
                    <div className="modal-content1">
                        <Card>
                            <CardHeader className=" c_card_filter text-black">
                                <strong> Party selection </strong></CardHeader>
                            <CardBody>
                                <C_Select
                                    value={selectedParty}
                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                    isSearchable={true}
                                    isLoading={partyDropdownLoading}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={PartyDropdownOptions}
                                    isDisabled={changeButtonShow && !(selectedParty.value === 0)}
                                    onChange={(e) => setSelectedParty(e)}
                                />
                                {/* <CardFooter> */}
                                <div className="_modal-footer">
                                    {!changeButtonShow ? (
                                        <C_Button
                                            type="button"
                                            className="btn btn-primary border-1 font-size-12 text-center"
                                            onClick={updateSelectedParty}
                                        >
                                            Select
                                        </C_Button>

                                    ) : (!forceDisable) && (
                                        // ) : !(pageMode === mode.view || pageMode === mode.edit) && (
                                        <C_Button
                                            type="button"
                                            spinnerColor={"info"}
                                            className="btn btn-info border-1 font-size-12 "
                                            onClick={partyOnchange}
                                        >
                                            Change
                                        </C_Button>
                                    )}
                                    <C_Button
                                        type="button"
                                        className="btn btn-danger border-1 font-size-12 text-center"
                                        onClick={handleCancelBtn}
                                    >
                                        Cancel
                                    </C_Button>
                                </div>
                            </CardBody>

                        </Card>


                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangeCommonParty;
