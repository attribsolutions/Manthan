import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { GroupTypes_API, GroupTypes_Delete_API, GroupTypes_Edit_API, GroupTypes_Post_API, GroupTypes_Update_API } from "../../../helpers/backend_helper";
import { GroupTypeApiErrorAction, deleteGroupTypeIDSuccess, editGroupTypeIDSuccess, getGroupTypeslistSuccess, saveGroupTypeMasterSuccess, updateGroupTypeIDSuccess } from "./action";
import { DELETE_GROUP_TYPE_ID, EDIT_GROUP_TYPE_ID, GET_GROUP_TYPES_LIST, SAVE_GROUP_TYPE_MASTER, UPDATE_GROUP_TYPE_ID } from "./actionType";

function* save_GroupType_GenFun({ config }) {                      // Save API
    try {
        const response = yield call(GroupTypes_Post_API, config);
        yield put(saveGroupTypeMasterSuccess(response));
    } catch (error) { yield put(GroupTypeApiErrorAction()) }
}

function* Get_GroupType_List_GenrFun() {                            // getList API
    try {
        const response = yield call(GroupTypes_API);
        yield put(getGroupTypeslistSuccess(response.Data));
    } catch (error) { yield put(GroupTypeApiErrorAction()) }
}

function* Edit_GroupType_ID_GenFun({ config }) {                     // edit API
    const { btnmode } = config;
    try {
        const response = yield call(GroupTypes_Edit_API, config);
        response.pageMode = btnmode;
        yield put(editGroupTypeIDSuccess(response));
    } catch (error) { yield put(GroupTypeApiErrorAction()) }
}

function* Update_GroupType_ID_GenFun({ config }) {
    // update API
    try {
        const response = yield call(GroupTypes_Update_API, config);
        yield put(updateGroupTypeIDSuccess(response))
    } catch (error) { yield put(GroupTypeApiErrorAction()) }
}

function* Delete_GroupType_ID_GenFun({ config }) {                     // delete API
    try {
        const response = yield call(GroupTypes_Delete_API, config);
        yield put(deleteGroupTypeIDSuccess(response))
    } catch (error) { yield put(GroupTypeApiErrorAction()) }
}

function* GroupTypeSaga() {
    yield takeEvery(SAVE_GROUP_TYPE_MASTER, save_GroupType_GenFun)
    yield takeEvery(GET_GROUP_TYPES_LIST, Get_GroupType_List_GenrFun)
    yield takeEvery(EDIT_GROUP_TYPE_ID, Edit_GroupType_ID_GenFun)
    yield takeEvery(UPDATE_GROUP_TYPE_ID, Update_GroupType_ID_GenFun)
    yield takeEvery(DELETE_GROUP_TYPE_ID, Delete_GroupType_ID_GenFun)

}

export default GroupTypeSaga;