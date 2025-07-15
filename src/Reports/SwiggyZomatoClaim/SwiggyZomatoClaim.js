import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";

import {
    Col,
    FormGroup,
    Label
} from "reactstrap";

import CommonPurchaseList from "../../components/Common/CommonPurchaseList";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index";
import { C_Button, PageLoadingSpinner } from "../../components/Common/CommonButton";

import {
    SwiggyZomatoClaim_Action,
    SwiggyZomatoClaim_Action_Success
} from "../../store/Report/SwiggyZomatoRedux/action";


import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";


const SwiggyZomatoClaim = () => {
    const dispatch = useDispatch();
    const IsMannagementParty = !_cfunc.loginUserIsFranchisesRole() && _cfunc.loginIsSCMParty();

    const [fromDate, setFromDate] = useState(_cfunc.currentDate_ymd);
    const [toDate, setToDate] = useState(_cfunc.currentDate_ymd);
    const [PartyDropdown, setPartyDropdown] = useState([allLabelWithZero]);
    const [pageMode] = useState(mode.defaultList);

    const reducers = useSelector((state) => ({
        deleteMsg: state.ClaimSummaryReducer.deleteMsg,
        tableList: state.SwiggyZomatoClaimReducer.SwiggyZomatoClaimData,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        listBtnLoading: state.SwiggyZomatoClaimReducer.listBtnLoading,
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        userAccess: state.Login.RoleAccessUpdateData,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        pageField: state.CommonPageFieldReducer.pageFieldList
    }));

    const { pageField, Party, partyDropdownLoading, listBtnLoading } = reducers;

    const action = {
        getList: SwiggyZomatoClaim_Action
    };

    // Fetch Module Fields on Mount
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageFieldList(pageId.SWIGGY_ZOMATO_CLAIM));

        return () => {
            dispatch(SwiggyZomatoClaim_Action_Success([]));
        };
    }, []);

    // Convert party list to dropdown options
    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    }));

    const PartyDrodownOnChange = (e) => {
        if (e.length === 0) {
            setPartyDropdown([allLabelWithZero]);
        } else {
            setPartyDropdown(e.filter(i => i.value !== 0));
        }
    };

    const GoBtnHandler = () => {

        const jsonBody = JSON.stringify({
            "FromDate": fromDate,
            "ToDate": toDate,
            "PartyID": IsMannagementParty ? PartyDropdown.map(row => row.value).join(',') : String(_cfunc.loginSelectedPartyID())
        });

        dispatch(SwiggyZomatoClaim_Action({ jsonBody }));
    };

    const fromdateOnchange = (e, date) => {
        setFromDate(date);
        dispatch(SwiggyZomatoClaim_Action_Success([]));
    };

    const todateOnchange = (e, date) => {
        setToDate(date);
        dispatch(SwiggyZomatoClaim_Action_Success([]));
    };

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />
            <div className="page-content">
                <div className="px-2 c_card_filter text-black">
                    <div className="row">

                        {/* From Date */}
                        <Col sm={2}>
                            <FormGroup className="row mt-3">
                                <Label className="col-sm-4 p-2" style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="FromDate"
                                        value={fromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {/* To Date */}
                        <Col sm={2}>
                            <FormGroup className="row mt-3">
                                <Label className="col-sm-4 p-2" style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={toDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {/* Party Dropdown */}
                        {IsMannagementParty &&
                            <Col sm={3}>
                                <FormGroup className="row mt-3">
                                    <Label className="col-sm-4 p-2" style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Party"
                                            value={PartyDropdown}
                                            isSearchable={true}
                                            isMulti={true}
                                            isLoading={partyDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                                            options={Party_Option}
                                            onChange={PartyDrodownOnChange}
                                           
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

                        {/* Show Button - Aligned to right side */}
                        <Col className="d-flex justify-content-end" style={{ minHeight: "78px" }}>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading}
                                  className="btn btn-success m-3 mr"
                                onClick={GoBtnHandler}
                            >
                                Show
                            </C_Button>
                        </Col>


                    </div>
                </div>

                {/* Table Data */}
                {pageField &&
                    <CommonPurchaseList
                        action={action}
                        reducers={reducers}
                        pageMode={pageMode}
                       
                        totalAmountShow={true}
                    />
                }
            </div>

        </React.Fragment>
    );
};

export default SwiggyZomatoClaim;
