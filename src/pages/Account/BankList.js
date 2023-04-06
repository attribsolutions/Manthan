import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BankMaster from "./BankMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../store/actions";
import CommonListPage from "../../components/Common/CommonMasterListPage";
import * as pageId from "../../routes/allPageID"
import * as url from "../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteBankIDSuccess,
    delete_Bank_ID,
    editBankID,
    postBanklist,
    saveBankMaster_Success,
    updateBankIDSuccess
} from "../../store/Account/BankRedux/action";
import { loginCompanyID, loginPartyID } from "../../components/Common/CommonFunction";

const BankList = () => {

    const dispatch = useDispatch();
    debugger
    const reducers = useSelector(
        (state) => ({
            tableList: state.BankReducer.BankList,
            postMsg: state.BankReducer.postMsg,
            editData: state.BankReducer.editMsg,
            updateMsg: state.BankReducer.updateMessage,
            deleteMsg: state.BankReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: postBanklist,
        editId: editBankID,
        deleteId: delete_Bank_ID,
        postSucc: saveBankMaster_Success,
        updateSucc: updateBankIDSuccess,
        deleteSucc: deleteBankIDSuccess,
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.BANK_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Company: loginCompanyID(),
        });
        dispatch(postBanklist(jsonBody));
    }, []);

    const { pageField, userAccess = [] } = reducers;

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={BankMaster}
                        masterPath={url.BANK}
                        ButtonMsgLable={"Bank"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default BankList;
