import { call, put, takeEvery } from "redux-saga/effects";
import { Role_Master_Delete_API, Role_Master_Edit_API, Role_Master_Get_API, Role_Master_Post_API, Role_Master_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {getRoleSuccess ,PostSuccess,deleteSuccess,editSuccess, updateSuccess, getRole} from "./action";
import { POST_ROLE,DELETE_ROLE,EDIT_ROLE,UPDATE_ROLE,GET_Role_API } from "./actionTypes";

// get api
function* sagaGetApi() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Get_API);
    yield put(getRoleSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    // yield put(fetchModelsListError(error));
    yield console.log("fetchModulesList  saga page error ***  :", error);
  }
}

//Post Method
function* PostPage({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Post_API, Data);
    console.log("response",response)
    if (response.StatusCode === 200) {
      // yield put(SpinnerState(false))
      yield put(PostSuccess({ Status: true }));
      yield put(AlertState({ Type: 1, Status: true, Message: response.Message, RedirectPath: '/RoleListPage', AfterResponseAction: false }));
    } else {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    }
    console.log("response after ifelse",response)

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 3, Status: true, Message: "Network Error", RedirectPath: false, AfterResponseAction: false }));

    yield console.log("PostSubmit RoleMaster  saga page error", error);
  }
  
}

//Post Method
// function* PostPage({ Data }) {
//   try {
//     const response = yield call(Role_Master_Post_API, Data);
//     yield put(PostSuccess(response));
//     console.log("response in saga page",response)
//   } catch (error) {
//     yield console.log("postRole saga error :", error);
//   }
// }

  // delete api
    function* deleteRole({ id }) {
    try {
      yield put(SpinnerState(true))
      const response = yield call(Role_Master_Delete_API, id);
      yield put(SpinnerState(false))
  
      if (response.StatusCode === 200) {
        yield put(AlertState({
          Type: 1, Status: true,
          Message: response.Message,
          RedirectPath: false,
          AfterResponseAction: getRole,
        }))
      }
      else {
        yield put(AlertState({
          Type: 3, Status: true,
          Message: response.Message,
          RedirectPath: false,
          AfterResponseAction: false
        }));
      }
    } catch (error) {
      yield put(SpinnerState(false))
      yield console.log("deleteModule_ID  saga page error ***  :", error);
    }
  }

  // edit api
  function* editRole({ id }) {
    try {   
  if(!id<=0){
      const response = yield call(Role_Master_Edit_API, id);
      yield put(editSuccess(response));
    
  }else{
   yield put(editSuccess({ID:0}));
    }    
  } catch (error) {
   // yield console.log("editID Error :", error);
  }
}

 // upadate api
function* updateRole({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(Role_Master_Update_API, updateData, ID);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(updateSuccess({ Status: true }));
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: getRole,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield console.log("editModule_ID  saga page error ***  :", error);
  }
}

  function* RoleMaster_Saga() {
    yield takeEvery(GET_Role_API, sagaGetApi);
    yield takeEvery(POST_ROLE,PostPage );
    yield takeEvery(EDIT_ROLE, editRole);
    yield takeEvery(DELETE_ROLE, deleteRole);
    yield takeEvery(UPDATE_ROLE, updateRole);
  }
  export default RoleMaster_Saga;
  