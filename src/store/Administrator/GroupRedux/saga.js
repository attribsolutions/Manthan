import { call, put, takeEvery } from "redux-saga/effects";
import { deleteGrouplistSuccess, editGroupIDSuccess, getGroupListSuccess, PostMethod_GroupList_Success, updategroupIDSuccess} from "./action";


import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import { 
  del_Group_List_API,
        edit_Group_List_Api,
        get_Group_List_Api, Post_GroupList_API, update_Group_List_Api

     } from "../../../helpers/backend_helper";
  
import { DELETE_GROUP_LIST_ID, EDIT_GROUPMASTER_ID, GET_GROUP_LIST, POST_GROUPLIST, UPDATE_GROUPMASTER_ID } from "./actionType";
import { deleteGroupType_ID } from "../GroupTypeRedux/action";
import { updateCategoryIDSuccess } from "../CategoryRedux/action";



// post api
function* Post_Method_ForGroupMaster_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_GroupList_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_GroupList_Success(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


// get api
function* Get_Group_List_genFunc() {
  yield put(SpinnerState(true))
  try {
    
    const response = yield call(get_Group_List_Api);
    yield put(getGroupListSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_GroupList_ID_GenratorFunction({id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(del_Group_List_API, id);
    yield put(SpinnerState(false))
    yield put(deleteGrouplistSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_Grouplist_ID_GenratorFunction({ id,pageMode }) {
  try {
    const response = yield call(edit_Group_List_Api, id);
    response.pageMode=pageMode
    yield put(editGroupIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_Grouplist_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_Group_List_Api,ID);
    yield put(SpinnerState(false))
    yield put(updategroupIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}




  function*  GroupSaga() {
    yield takeEvery( POST_GROUPLIST,Post_Method_ForGroupMaster_GenFun)
    yield takeEvery(GET_GROUP_LIST, Get_Group_List_genFunc)
    yield takeEvery(DELETE_GROUP_LIST_ID, Delete_GroupList_ID_GenratorFunction)
    yield takeEvery(EDIT_GROUPMASTER_ID, Edit_Grouplist_ID_GenratorFunction)
    yield takeEvery(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_GenratorFunction)
  }
  
  export default GroupSaga;