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
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { getCurrent_Month_And_Year } from "./ClaimRelatedFunc";

const ClaimTrackingEntryList = (props) => {

    const dispatch = useDispatch();

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.ClaimTrackingEntry_Reducer.listBtnLoading,
            goBtnLoading: state.ClaimTrackingEntry_Reducer.loading,
            tableList: state.ClaimTrackingEntry_Reducer.claimTrackingEntryList,
            editData: state.ClaimTrackingEntry_Reducer.editData,
            updateMsg: state.ClaimTrackingEntry_Reducer.updateMessage,
            deleteMsg: state.ClaimTrackingEntry_Reducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getClaimTrackingEntrylist,
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
        dispatch(getClaimTrackingEntrylist());
        goButtonHandler()
        return () => {
            dispatch(getClaimTrackingEntrySuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const { pageField, goBtnLoading } = reducers

    function goButtonHandler(e) {

        const jsonBody = JSON.stringify({
            "Year": yearAndMonth.Year,
            "Month": yearAndMonth.Month,
        })
        dispatch(getClaimTrackingEntrylist(jsonBody));
    };

    async function MonthAndYearOnchange(e) {
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
    }

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(reducers.goBtnLoading || !pageField)} />
            <div className="page-content">

                <div className="px-3 c_card_filter header text-black mb-1" >

                    <Row >
                        <Col sm="6" className="mt-1 mb-n1">
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