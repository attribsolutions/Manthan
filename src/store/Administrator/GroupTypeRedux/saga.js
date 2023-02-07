import { call, put, takeEvery } from "redux-saga/effects";
import { GroupTypes_API, GroupTypes_Delete_API, GroupTypes_Edit_API, GroupTypes_Post_API, GroupTypes_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteGroupType_IDSuccess, editGroupTypeIdSuccess, getGroupTypeslistSuccess, PostGroupTypeSubmitSuccess, updateGroupTypeIDSuccess } from "./action";
import { DELETE_GROUP_TYPE_ID, EDIT_GROUP_TYPE_ID, GET_GROUP_TYPES_LIST, POST_GROUP_TYPE_SUBMIT, UPDATE_GROUP_TYPE_ID } from "./actionType";

// get api
function* Get_GropuTypeList_GenratorFunction() {
  
    try {
        const response = yield call(GroupTypes_API);
        yield put(getGroupTypeslistSuccess(response.Data));
       
    } catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

//post api
function* Submit_GroupType_GenratorFunction({ data }) {
   
  
    try {
        const response = yield call(GroupTypes_Post_API, data);
       
        yield put(PostGroupTypeSubmitSuccess(response));
    } catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// delete api 
function* Delete_GroupTypeID_GenratorFunction({ id }) {
    try {
      
        const response = yield call(GroupTypes_Delete_API, id);
       
        yield put(deleteGroupType_IDSuccess(response))
    } catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* Edit_GroupTypeID_GenratorFunction({ id, pageMode }) {
    try {
        const response = yield call(GroupTypes_Edit_API, id);
        response.pageMode = pageMode
        yield put(editGroupTypeIdSuccess(response));
        console.log("response in saga", response)

    } catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* Update_GroupTypeID_GenratorFunction({ updateData, ID }) {
    try {
      
        const response = yield call(GroupTypes_Update_API, updateData, ID);
       
        yield put(updateGroupTypeIDSuccess(response))
    }
    catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* GroupTypeSaga() {
    yield takeEvery(GET_GROUP_TYPES_LIST, Get_GropuTypeList_GenratorFunction)
    yield takeEvery(POST_GROUP_TYPE_SUBMIT, Submit_GroupType_GenratorFunction)
    yield takeEvery(DELETE_GROUP_TYPE_ID, Delete_GroupTypeID_GenratorFunction)
    yield takeEvery(EDIT_GROUP_TYPE_ID, Edit_GroupTypeID_GenratorFunction)
    yield takeEvery(UPDATE_GROUP_TYPE_ID, Update_GroupTypeID_GenratorFunction)

}

export default GroupTypeSaga;