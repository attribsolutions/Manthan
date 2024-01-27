import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
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
import { Col, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { getCurrent_Month_And_Year } from "./ClaimRelatedFunc";
import { loginEmployeeID, loginIsSCMParty, loginPartyID } from "../../../components/Common/CommonFunction";
import { C_Select } from "../../../CustomValidateForm";

const ClaimTrackingEntryList = (props) => {

    const dispatch = useDispatch();
    const isSCMParty = loginIsSCMParty();

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);
    const [UploadFile, setUploadFile] = useState([]);
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not
    const [partySelect, setPartySelect] = useState({
        value: "",
        label: " All"
    });

    const reducers = useSelector(
        (state) => ({
            partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
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

    //Max Month is current Month
    const maxMonthCurrent = useMemo(() => {
        const current = getCurrent_Month_And_Year();
        return `${current.Year}-${current.Month}`
    }, []);

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.CLAIM_TRACKING_ENTRY_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler()
        return () => {
            dispatch(getClaimTrackingEntrySuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    useEffect(() => {
        if (UploadFile.length > 0) {
            setmodal_backdrop(true)
        }
    }, [UploadFile])

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    const { pageField, goBtnLoading } = reducers

    function goButtonHandler(e) {

        const jsonBody = JSON.stringify({
            "Year": yearAndMonth.Year,
            "Month": yearAndMonth.Month,
            "Party": isSCMParty ? partySelect.value : loginPartyID(),
            "Employee": !isSCMParty ? 0 : loginEmployeeID(),
        })
        dispatch(getClaimTrackingEntrylist({ jsonBody }));
    };

    async function MonthAndYearOnchange(e) {
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    function downBtnFunc(config) {

        if (config.rowData.CreditNoteUpload === null) {
            return null
        } else {
            const link = document.createElement('a');
            link.href = config.rowData.CreditNoteUpload;
            link.setAttribute('download', 'yourFileName.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(config.rowData.CreditNoteUpload)
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

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(reducers.goBtnLoading || !pageField)} />
            <div className="page-content">

                <div className="px-3 c_card_filter header text-black mb-1" >
                    <Row >
                        <Col sm="5" className="mt-1 mb-n1">
                            <FormGroup className="row mt-2" >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>Claim For The Month </Label>
                                <Col sm="7">
                                    <Input className="form-control"
                                        type="month"
                                        value={`${yearAndMonth.Year}-${yearAndMonth.Month}`}
                                        onChange={(e) => MonthAndYearOnchange(e)}
                                        max={maxMonthCurrent}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        {isSCMParty &&
                            <Col sm="5" className="mt-1 mb-n1">
                                <FormGroup className="row mt-2" >
                                    <Label className="col-sm-6 p-2" style={{ width: "65px" }}> Party</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="PartyName"
                                            value={partySelect}
                                            isSearchable={true}
                                            // isLoading={partyLoading}
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
                            </Col>
                        }
                        <Col sm="1" className="mx-6 mt-3" >
                            < Go_Button
                                loading={goBtnLoading}
                                onClick={(e) => goButtonHandler()}
                            />
                        </Col>
                    </Row>
                </div>

                {
                    (pageField) &&
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
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