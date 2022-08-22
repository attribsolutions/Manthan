import { call, put, takeEvery } from "redux-saga/effects";
import { saveH_SubModules, putUpdateSubModule, get_SubModulesListData_ApiCall, deleteSubModulesUsingID_ApiCall, getSubModulesEditDataUsingID_ApiCall } from "../../../helpers/backend_helper";
import { POST_SUB_MODULE_ID, UPDATE_MODULE, GET_SUB_MODULES, DELETE_SUB_MODULES_USING_ID, GET_SUB_MODULES_EDIT_DATA_USING_ID } from './actionTypes'
import {
  getSubModulesSuccess,
  GetSubModuleEditDataUsingIDSuccess,
  getSubModules,
  updateSubModuleSuccess,
  SaveSubModuleSuccess
} from "./actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";

function* GetSubModulesData_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_SubModulesListData_ApiCall);    console.log(response)
    yield put(getSubModulesSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
  }
}

function* Save_SubModules_GenratorFunction({ Data }) {
  console.log("saveH_SubModules Data",Data)
  try {
    yield put(SpinnerState(true))
    const response = yield call(saveH_SubModules, Data);
    console.log("saveH_SubModules response",response)
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(SaveSubModuleSuccess({ Status: true }));
      yield put(AlertState({ Type: 1, Status: true, Message: response.Message, RedirectPath: '/SubModulesList', AfterResponseAction: false }));
    } else {
      // yield put(AlertState({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 3, Status: true, Message: "  SubModules save error", RedirectPath: false, AfterResponseAction: false }));
    yield console.log("postModule saga error :", error);
  }
}
//// delete api 
function* deleteSubModulesUsingID_genratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(deleteSubModulesUsingID_ApiCall, id);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: getSubModules,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: "deleteSubModulesUsingID faild",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    yield console.log("delete Module Error : ", error);
  }
}

function* GetSubModulesEditData_GenratorFunction({ id }) {
  try {
    const response = yield call(getSubModulesEditDataUsingID_ApiCall, id);
    yield put(GetSubModuleEditDataUsingIDSuccess(response));
  } catch (error) {

  }
}

function* updateSubModulesaga({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(putUpdateSubModule, updateData, ID);
    yield put(SpinnerState(false))
    yield put (GetSubModuleEditDataUsingIDSuccess({Status:"false"}))
    
    if (response.StatusCode === 200) {
      yield put(updateSubModuleSuccess(({ Status: true })));
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: getSubModules,
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
    yield put (GetSubModuleEditDataUsingIDSuccess({Status:"false"}))
    yield put(SpinnerState(false))
    yield console.log(" updateModule saga error", error);
  }
}

function* SubModuleSaga() {
  yield takeEvery(POST_SUB_MODULE_ID, Save_SubModules_GenratorFunction);
  yield takeEvery(GET_SUB_MODULES, GetSubModulesData_GenratorFunction);
  yield takeEvery(DELETE_SUB_MODULES_USING_ID, deleteSubModulesUsingID_genratorFunction);
  yield takeEvery(GET_SUB_MODULES_EDIT_DATA_USING_ID, GetSubModulesEditData_GenratorFunction);
  yield takeEvery(UPDATE_MODULE, updateSubModulesaga);
}

export default SubModuleSaga;