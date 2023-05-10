import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BankMaster from "./BankMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteBankIDSuccess,
    delete_Bank_ID,
    editBankID,
    getBankList,
    saveBankMaster_Success,
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";


const BankList = () => {

    const dispatch = useDispatch();

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
        getList: getBankList,
        editId: editBankID,
        deleteId: delete_Bank_ID,
        postSucc: saveBankMaster_Success,
        updateSucc: updateBankIDSuccess,
        deleteSucc: deleteBankIDSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.BANK_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getBanklist());
    }, []);

    const { pageField, userAccess = [] } = reducers;

    return (
        <React.Fragment>
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
