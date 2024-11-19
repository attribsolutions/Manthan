import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import CommonListPage from "../../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, } from "../../../../store/actions";
import { POS_USER } from "../../../../routes/route_url";

import * as pageId from "../../../../routes/allPageID"
import { PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import { POSuserDeleteAction, POSuserDeleteActionSuccess, POSuserEditAction, POSuserUpdateActionSuccess, getPOSUserList, savePOSUserMasterAction } from "../../../../store/SweetPOSStore/Administrator/UserMasterRedux/actions";
import POSUSER from "./POSUserMaster";

const POSUserList = () => {
    const dispatch = useDispatch();
    const reducers = useSelector(

        (state) => ({
            listBtnLoading: state.POS_User_Registration_Reducer.listBtnLoading,
            loading: state.POS_User_Registration_Reducer.loading,
            tableList: state.POS_User_Registration_Reducer.List,
            editData: state.POS_User_Registration_Reducer.editData,
            updateMsg: state.POS_User_Registration_Reducer.updateMessage,
            deleteMsg: state.POS_User_Registration_Reducer.deleteSuccessRole,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.POS_User_Registration_Reducer.postMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getPOSUserList,
        editId: POSuserEditAction,
        deleteId: POSuserDeleteAction,
        postSucc: savePOSUserMasterAction,
        updateSucc: POSuserUpdateActionSuccess,
        deleteSucc: POSuserDeleteActionSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldList(pageId.POS_USER_lIST))
        dispatch(getPOSUserList());
    }, []);


    const { pageField, userAccess = [] } = reducers
    
    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(!pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    showBreadcrumb={true}
                    reducers={reducers}
                    MasterModal={POSUSER}
                    masterPath={POS_USER}
                    ButtonMsgLable={"POS User"}
                    deleteName={"LoginName"}
                />
            }

        </React.Fragment>
    )
}

export default POSUserList;



