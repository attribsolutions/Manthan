import { call, put, takeEvery } from "redux-saga/effects";
import { Role_Master_Delete_API, Role_Master_Edit_API, Role_Master_Get_API, Role_Master_Post_API, Role_Master_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {getRoleSuccess ,PostSuccess,editSuccess, updateSuccess, getRole, deleteSuccess} from "./action";
import { POST_ROLE,DELETE_ROLE,EDIT_ROLE,UPDATE_ROLE,GET_Role_API } from "./actionTypes";

function* Get_Roles_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Get_API);
    yield put(getRoleSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Submit_Roles_GenratorFunction({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Post_API, Data);
    yield put(SpinnerState(false))
    yield put(PostSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

  function* Delete_Roles_GenratorFunction({ id }) {
    try {
      yield put(SpinnerState(true))
      const response = yield call(Role_Master_Delete_API, id);
      yield put(SpinnerState(false))
      yield put(deleteSuccess(response))
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }

function* Edit_Roles_GenratorFunction({ id ,pageMode}) {
  
  try {
    const response = yield call(Role_Master_Edit_API, id);
    response.pageMode=pageMode
    yield put(editSuccess(response));
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* Update_Roles_GenratorFunction({ updateData, ID }) {
  console.log("response in GenratorFunction ",updateData,ID)
  try {
    yield put(SpinnerState(true))
    const response = yield call(Role_Master_Update_API, updateData, ID);
    console.log("response in saga file",response)
    yield put(SpinnerState(false))
    yield put(updateSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

  function* RoleMaster_Saga() {
    yield takeEvery(GET_Role_API, Get_Roles_GenratorFunction);
    yield takeEvery(POST_ROLE,Submit_Roles_GenratorFunction );
    yield takeEvery(EDIT_ROLE, Edit_Roles_GenratorFunction);
    yield takeEvery(DELETE_ROLE, Delete_Roles_GenratorFunction);
    yield takeEvery(UPDATE_ROLE, Update_Roles_GenratorFunction);
  }
  
  export default RoleMaster_Saga;
  