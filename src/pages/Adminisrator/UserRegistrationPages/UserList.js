import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddUser from "./UserRegistration";
import {
    getUser,
    deleteUser,
    deleteSuccess,
    editUserId,
    updateSuccess,
    addUserSuccess
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {  commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { USER } from "../../../routes/route_url";


const UserList = () => {
    debugger
    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.User_Registration_Reducer.pages,
            editData: state.User_Registration_Reducer.editData,
            updateMsg: state.User_Registration_Reducer.updateMessage,
            deleteMsg: state.User_Registration_Reducer.deleteSuccessRole,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.User_Registration_Reducer.AddUserMessage,
            pageField: state.CommonPageFieldReducer.pageFieldList

        })
    );

    const action = {
        getList: getUser,
        editId: editUserId,
        deleteId: deleteUser,
        postSucc: addUserSuccess,
        updateSucc: updateSuccess,
        deleteSucc: deleteSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(14))
        dispatch(getUser());
    }, []);

    const { pageField } = reducers

    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={AddUser}
                        masterPath={USER}
                        ButtonMsgLable={"User"}
                        deleteName={"LoginName"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default UserList;



