import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import ClaimTrackingEntry from "./ClaimTrackingEntry";
import { delete_ClaimTrackingEntryID_Success, delete_ClaimTrackingEntry_ID, editClaimTrackingEntryID, getClaimTrackingEntrySuccess, getClaimTrackingEntrylist, saveClaimTrackingEntry_Success, updateClaimTrackingEntryIDSuccess } from "../../../store/Accounting/ClaimTrackingEntryRedux/action";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { ClaimForTheMonthOtion } from "./ClaimRelatedData";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"

const ClaimTrackingEntryList = (props) => {

    const dispatch = useDispatch();


    const [ClaimForTheMonthSelect, setClaimForTheMonthSelect] = useState('');

    const reducers = useSelector(
        (state) => ({
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

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.CLAIM_TRACKING_ENTRY_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getClaimTrackingEntrylist());

        return () => {
            dispatch(getClaimTrackingEntrySuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const { pageField, goBtnLoading } = reducers


    function goButtonHandler(e) {

        const jsonBody = JSON.stringify({
            "Year": ClaimForTheMonthSelect.year,
            "Month": ClaimForTheMonthSelect.monthNumber
        })
        dispatch(getClaimTrackingEntrylist(jsonBody));

    };

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(!pageField)} />
            <div className="page-content">

                <div className="px-3 c_card_filter header text-black mb-1" >

                    <Row >
                        <Col sm="6" className="mt-1 mb-n1">
                            <FormGroup className="row mt-2" >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>Claim For The Month </Label>
                                <Col sm="7">
                                    <Select
                                        name="ClaimForTheMonth"
                                        value={ClaimForTheMonthSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ClaimForTheMonthOtion}
                                        onChange={(e) => { { setClaimForTheMonthSelect(e) } }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >
                        {/* <Col md={1}></Col> */}
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
                            showBreadcrumb={false}
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