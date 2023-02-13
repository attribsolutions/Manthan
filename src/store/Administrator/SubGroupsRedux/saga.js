import { call, put, takeEvery } from "redux-saga/effects";
import { deleteSubGrouplistSuccess, editSubGroupIDSuccess, getSubGroupListSuccess, postSubGroupSuccess, updateSubgroupIDSuccess} from "./action";


import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import { 
  del_SubGroup_List_API,
        edit_SubGroup_List_Api,
        get_SubGroup_List_Api, Post_SubGroupList_API, update_SubGroup_List_Api

     } from "../../../helpers/backend_helper";
  
import { DELETE_SUBGROUP_LIST_ID, EDIT_SUBGROUPMASTER_ID, GET_SUBGROUP_LIST, POST_SUBGROUPLIST, UPDATE_SUBGROUPMASTER_ID } from "./actionType";



// post api
function* Post_Method_ForSubGroupMaster_GenFun({ data }) {

  try {
    const response = yield call(Post_SubGroupList_API, data);
   
    yield put(postSubGroupSuccess(response));
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


// get api
function* Get_SubGroup_List_genFunc() {

  try {
    
    const response = yield call(get_SubGroup_List_Api);
    yield put(getSubGroupListSuccess(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_SubGroupList_ID_GenratorFunction({id }) {
  try {
  
    const response = yield call(del_SubGroup_List_API, id);
   
    yield put(deleteSubGrouplistSuccess(response))
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_SubGrouplist_ID_GenratorFunction({ id,pageMode }) {
  try {
    const response = yield call(edit_SubGroup_List_Api, id);
    response.pageMode=pageMode
    yield put(editSubGroupIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_SubGrouplist_ID_GenratorFunction({ updateData, ID }) {
  try {
  
    const response = yield call(update_SubGroup_List_Api,updateData,ID);
   
    yield put(updateSubgroupIDSuccess(response))
  }
  catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}




  function*  SubGroupSaga() {
    yield takeEvery( POST_SUBGROUPLIST,Post_Method_ForSubGroupMaster_GenFun)
    yield takeEvery(GET_SUBGROUP_LIST, Get_SubGroup_List_genFunc)
    yield takeEvery(DELETE_SUBGROUP_LIST_ID, Delete_SubGroupList_ID_GenratorFunction)
    yield takeEvery(EDIT_SUBGROUPMASTER_ID, Edit_SubGrouplist_ID_GenratorFunction)
    yield takeEvery(UPDATE_SUBGROUPMASTER_ID, Update_SubGrouplist_ID_GenratorFunction)
  }
  
  export default SubGroupSaga;