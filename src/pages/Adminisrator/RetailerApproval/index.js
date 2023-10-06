import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { mode } from "../../../routes";
import { loginPartyID } from "../../../components/Common/CommonFunction";
import { PartyListforApproval_Action, PartyListforApproval_Success, GetPartyListforApprovalID_Action, GetPartyListforApprovalID_Success } from "../../../store/Administrator/PartyRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const RetailerApprovalList = () => {

    const dispatch = useDispatch();

    const [pageMode] = useState(mode.modeSTPsave);

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PartyMasterReducer.goBtnLoading,
            listBtnLoading: state.PartyMasterReducer.listBtnLoading,
            tableList: state.PartyMasterReducer.PartyListForApproval,
            RetailerApprovalID: state.PartyMasterReducer.PartyListForApproval_ID,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { pageField, goBtnLoading, RetailerApprovalID } = reducers;

    const action = {}

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.RETAILER_APPROVAL
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageFieldList(page_Id));
        goButtonHandler();
        return () => {
            dispatch(PartyListforApproval_Success([]));
        }
    }, []);

    useEffect(() => {

        if ((RetailerApprovalID.Status === true) && (RetailerApprovalID.StatusCode === 200)) {
            dispatch(GetPartyListforApprovalID_Success({ Status: false }))
            customAlert({ Type: 1, Message: RetailerApprovalID.Message });
            goButtonHandler();
        }
        else if ((RetailerApprovalID.Status === true)) {
            dispatch(GetPartyListforApprovalID_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(RetailerApprovalID.Message),
            })
        }
    }, [RetailerApprovalID])

    const goButtonHandler = () => {
        try {
            const jsonBody = JSON.stringify({
                PartyID: loginPartyID(),
            });

            dispatch(PartyListforApproval_Action(jsonBody));
        } catch (error) { }
        return
    };

    const makeBtnFunc = (list = [], btnId) => {

        var { id } = list[0]
        try {
            dispatch(GetPartyListforApprovalID_Action({ btnId: btnId, transactionId: id }))
        } catch (e) { }
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            <div className="page-content">

                {
                    (pageField) &&
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            pageMode={pageMode}
                            makeBtnShow={true}
                            ButtonMsgLable={"Retailer Approval"}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                        />
                    </div>

                }
            </div>

        </React.Fragment>
    )
}

export default RetailerApprovalList;
