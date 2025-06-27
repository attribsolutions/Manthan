import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { mode, url } from "../../../routes";
import { PartyListforApproval_Action, PartyListforApproval_Success, editPartyID } from "../../../store/Administrator/PartyRedux/action";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const RetailerApprovalList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.modeSTPList);

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PartyMasterReducer.goBtnLoading,
            listBtnLoading: state.PartyMasterReducer.listBtnLoading,
            tableList: state.PartyMasterReducer.PartyListForApproval,
            editData: state.PartyMasterReducer.editData,
            RetailerApprovalID: state.PartyMasterReducer.PartyListForApproval_ID,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        })
    );

    const { pageField, goBtnLoading, commonPartyDropSelect, editData } = reducers;

    const action = {}

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.RETAILER_APPROVAL
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageFieldList(page_Id));
        return () => {
            dispatch(PartyListforApproval_Success([]));
        }
    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            goButtonHandler();
        }
        return () => {
            dispatch(PartyListforApproval_Success([]));
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {

        if (editData.Status === true && editData.StatusCode === 200) {
            history.push({
                pathname: url.FRANCHISE_PARTY_MASTER,
                pageMode: mode.edit,
                editValue: editData.Data,
                IsMobileRetailer: true,
                Redirect_From: url.RETAILER_APPROVAL
            })
        }
    }, [editData])

    const goButtonHandler = () => {
        try {
            const jsonBody = JSON.stringify({
                PartyID: commonPartyDropSelect.value,
            });
            dispatch(PartyListforApproval_Action(jsonBody));
        } catch (error) { }

    };

    const makeBtnFunc = (list = [], btnId) => {
        var { id } = list[0]
        try {
            dispatch(editPartyID({ btnId: `btn-edit-${id}`, btnmode: mode.edit, editId: id }))
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
