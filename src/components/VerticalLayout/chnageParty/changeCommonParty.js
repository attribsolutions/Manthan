import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { C_Button } from "../../Common/CommonButton";
import { C_Select } from "../../../CustomValidateForm";
import { loginCompanyID, loginEmployeeID, loginUserAdminRole } from "../../Common/CommonFunction";
import { commonPartyDropSelectAction } from "../../../store/Utilites/PartyDrodown/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import './changeParty.scss'; // Add your styles here
import { useRef } from "react";
import { showToastAlert } from "../../../helpers/axios_Config";
import { alertMessages } from "../../Common/CommonErrorMsg/alertMsg";
import { hideBtnCss } from "../../Common/ListActionsButtons";
import { Col, Spinner } from "reactstrap";
import { url } from "../../../routes";
import { useHistory } from 'react-router-dom';
import { getPartyEmployeeDetails } from "../../../store/Administrator/PartyEmployeeDetailsRedux/action";
import { getpartysetting_API, getpartysetting_API_Success } from "../../../store/Administrator/PartySetting/action";

const ChangeCommonParty = (props) => {

    const dispatch = useDispatch();
    const componentRef = useRef(null);
    const history = useHistory()

    // Local state
    const [selectedParty, setSelectedParty] = useState({ value: 0, label: "select party...", SAPPartyCode: "" });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Selectors from Redux store
    const {
        commonPartyDropdownOption,
        partyDropdownLoading,
        commonPartyDropSelect,
        forceDisable,
        isShow,
        isShowOnlySAPParty
    } = useSelector((state) => state.CommonPartyDropdownReducer);


    const { loading } = useSelector((state) => ({
        loading: state.PartyEmployeeDetailsReducer.loading,
    }));


    // useEffect to update selected party when commonPartyDropSelect changes
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {

            setSelectedParty(commonPartyDropSelect);
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
            customAlert({ Type: 3, Message: alertMessages.selectPartyName });
            return;
        }
        setIsDrawerOpen(false);
        dispatch(commonPartyDropSelectAction(selectedParty));
        dispatch(getpartysetting_API(selectedParty.value, loginCompanyID()))
        localStorage.setItem("selectedParty", JSON.stringify(selectedParty));
    };


    // Function to handle to Cancel button
    const handleClearBtn = () => {
        setSelectedParty({ value: 0, label: "select party...", SAPPartyCode: "" });
        dispatch(commonPartyDropSelectAction({ value: 0, label: "select party...", SAPPartyCode: "" }));
        dispatch(getpartysetting_API_Success([]));
        localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select...", SAPPartyCode: "" }));
    };

    const PartyDropdownOptions = commonPartyDropdownOption.map(data => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode,
        Latitude: data.Latitude,
        Longitude: data.Longitude,
        MobileNo: data.MobileNo,
        Address: data.Address,
        PartyType: data.PartyType

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

    const handleClick = () => {
        setIsLoading(true);
        dispatch(getPartyEmployeeDetails({ EmployeeId: loginEmployeeID() }))




        setTimeout(() => {
            history.push(url.PARTY_EMPLOYEE_DETAILS);
            setIsLoading(false);
        }, 1000);
    };

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
                    <div className="c_modal-content">
                        <div style={{ boxShadow: "none" }} className="modal-header c_card_filter text-black"                                >
                            <strong> Party selection </strong>

                            <button
                                type="button"
                                onClick={() => setIsDrawerOpen(false)}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                style={{ color: "black", fontWeight: "bold" }}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            <C_Select
                                value={selectedParty}
                                styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                isSearchable={true}
                                isLoading={partyDropdownLoading}
                                className="react-dropdown"
                                classNamePrefix="dropdown"

                                options={PartyDropdownOptions}
                                isDisabled={(commonPartyDropSelect.value > 0)}
                                onChange={(e) => setSelectedParty(e)}
                            />
                            {selectedParty.value > 0 && <div className="mt-2">
                                <span className="mb-1" style={{ display: 'block' }}> <strong>Party Type: </strong> {selectedParty.PartyType}</span>

                                <span className="mb-1" style={{ display: 'block' }}><strong>Address: </strong>{selectedParty.Address}</span>

                                <span style={{ display: 'block' }}> <strong>Contact: </strong> <a href={"tel:" + selectedParty.MobileNo}>{selectedParty.MobileNo}</a></span>

                            </div>}
                        </div>
                        <div className="modal-footer d-flex justify-content-between align-items-center">




                            {selectedParty.value > 0 ? <C_Button
                                type="button"

                                className={`${hideBtnCss} px-2`}
                                title={"Party Location"}
                                onClick={() => {
                                    if (selectedParty && selectedParty.Latitude !== undefined && selectedParty.Longitude !== undefined && selectedParty.Latitude !== null && selectedParty.Longitude !== null) {
                                        window.open(`https://maps.google.com/?q=${selectedParty.Latitude},${selectedParty.Longitude}`, "_blank");
                                    }
                                }}
                            >
                                <i className="bx bx-map-pin"></i>
                            </C_Button> : null}
                            <C_Button
                                type="button"
                                style={{ marginRight: "156px" }}
                                className={`${"badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light"} px-2`}
                                title={"Party Employee Details"}
                                onClick={handleClick}
                            >
                                {isLoading || loading ? <Spinner style={{ width: "15px", height: "15px" }} /> : <i className="fas fa-users"></i>}
                            </C_Button>

                            <div className="">
                                {
                                    !(commonPartyDropSelect.value > 0) ?
                                        <C_Button
                                            type="button"
                                            style={{ margin: "3px" }}
                                            className="btn btn-primary border-1 font-size-12 text-center ml-1"
                                            onClick={updateSelectedParty}
                                        >
                                            Select
                                        </C_Button>
                                        :
                                        <C_Button
                                            type="button"
                                            style={{ margin: "3px" }}
                                            className="btn btn-success border-1 font-size-12 text-center ml-1"
                                            onClick={handleClearBtn}
                                        >
                                            Change
                                        </C_Button>
                                }





                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangeCommonParty;
