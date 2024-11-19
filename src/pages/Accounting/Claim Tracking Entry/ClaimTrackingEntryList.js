import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbRadioButtonView, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import ClaimTrackingEntry from "./ClaimTrackingEntry";
import {
    delete_ClaimTrackingEntryID_Success,
    delete_ClaimTrackingEntry_ID,
    editClaimTrackingEntryID,
    getClaimTrackingEntrySuccess,
    getClaimTrackingEntrylist,
    saveClaimTrackingEntry_Success,
    updateClaimTrackingEntryIDSuccess
} from "../../../store/Accounting/ClaimTrackingEntryRedux/action";
import { Col, FormGroup, Label, } from "reactstrap";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { CommonConsole, date_ymd_func, loginEmployeeID, loginIsSCMParty, loginPartyID } from "../../../components/Common/CommonFunction";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import * as _cfunc from "../../../components/Common/CommonFunction"

const ClaimTrackingEntryList = () => {

    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();
    const isSCMParty = loginIsSCMParty();

    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)

    const [partySelect, setPartySelect] = useState({
        value: "",
        label: " All"
    });

    const reducers = useSelector(
        (state) => ({
            partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            listBtnLoading: state.ClaimTrackingEntry_Reducer.listBtnLoading,
            goBtnLoading: state.ClaimTrackingEntry_Reducer.GoBtnLoading,
            tableList: state.ClaimTrackingEntry_Reducer.claimTrackingEntryList,
            editData: state.ClaimTrackingEntry_Reducer.editData,
            updateMsg: state.ClaimTrackingEntry_Reducer.updateMessage,
            deleteMsg: state.ClaimTrackingEntry_Reducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        editId: editClaimTrackingEntryID,
        deleteId: delete_ClaimTrackingEntry_ID,
        postSucc: saveClaimTrackingEntry_Success,
        updateSucc: updateClaimTrackingEntryIDSuccess,
        deleteSucc: delete_ClaimTrackingEntryID_Success
    }
    const { pageField, goBtnLoading } = reducers

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.CLAIM_TRACKING_ENTRY_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbRadioButtonView(true));
        goButtonHandler()
        return () => {
            dispatch(getClaimTrackingEntrySuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    // sideBar Page Filters Information
    useEffect(() => {

        dispatch(sideBarPageFiltersInfoAction([
            { label: "FromDate", content: _cfunc.date_dmy_func(fromDate), },
            { label: "ToDate", content: _cfunc.date_dmy_func(toDate), },
            { label: "Party", content: partySelect.label, }
        ]));

    }, [partySelect, fromDate, toDate]);

    function goButtonHandler(e) {

        const jsonBody = JSON.stringify({
            "FromDate": fromDate,
            "ToDate": toDate,
            "Party": isSCMParty ? partySelect.value : loginPartyID(),
            "Employee": !isSCMParty ? 0 : loginEmployeeID(),
        })
        dispatch(getClaimTrackingEntrylist({ jsonBody }));
    };

    function downBtnFunc(config) {

        if (config.rowData.CreditNoteUpload === null) {
            if (config.rowData.CreditNoteUpload === null || config.rowData.CreditNoteUpload === "") {
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: alertMessages.CreditNote_Not_Upload,
                })
                return
            }
        } else {
            const link = document.createElement('a');
            link.href = config.rowData.CreditNoteUpload;
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            CommonConsole(config.rowData.CreditNoteUpload)
        }
    }

    const Party_Option = reducers.partyList.map(i => ({
        value: i.id,
        label: i.Name
    }));

    Party_Option.unshift({
        value: "",
        label: " All"
    });

    function fromdateOnchange(e, date) {
        setFromDate(date);
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>FromDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='FromDate'
                                    value={fromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>ToDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    options={{
                                        minDate: (_cfunc.disablePriviousTodate({ fromDate: fromDate })),
                                        maxDate: "today",
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    value={_cfunc.ToDate({ FromDate: fromDate, Todate: toDate })}
                                    name="ToDate"
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Party</Label>
                            <Col sm="5">
                                <C_Select
                                    name="PartyName"
                                    value={partySelect}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    options={Party_Option}
                                    onChange={(e) => {
                                        setPartySelect(e);
                                        dispatch(getClaimTrackingEntrySuccess([]));
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >
                    <Col sm="1" className="mt-3 ">
                        < Go_Button
                            loading={goBtnLoading}
                            onClick={(e) => goButtonHandler()}
                        />
                    </Col>
                </div>
            </div>
        )
    }


    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(reducers.goBtnLoading || !pageField)} />
            <div className="page-content">
                {
                    (pageField) &&
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            HeaderContent={HeaderContent}
                            downBtnFunc={downBtnFunc}
                            MasterModal={ClaimTrackingEntry}
                            masterPath={url.CLAIM_TRACKING_ENTRY}
                            newBtnPath={url.CLAIM_TRACKING_ENTRY}
                            ButtonMsgLable={"Claim Tracking Entry"}
                            deleteName={"id"}
                            goButnFunc={goButtonHandler}
                        />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default ClaimTrackingEntryList;