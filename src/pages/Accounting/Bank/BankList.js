import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BankMaster from "./BankMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {
    deleteBankIDSuccess,
    delete_Bank_ID,
    editBankID,
    getBanklist,
    saveBankMaster_Success,
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";
import { Listloader } from "../../../components/Common/CommonButton";


const BankList = () => {

    const dispatch = useDispatch();

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.BankReducer.listBtnLoading,
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
        getList: getBanklist,
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

    const { pageField} = reducers;

    return (
        <React.Fragment>
            {
                 reducers.loading ?
                 <Listloader />
                 :
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={BankMaster}
                        masterPath={url.BANK}
                        ButtonMsgLable={"Bank"}
                        deleteName={"Name"}
                    />
                    : <><Listloader /></>
            }
        </React.Fragment>
    )
}

export default BankList;
