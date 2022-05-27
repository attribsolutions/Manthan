import { call, put, takeEvery } from "redux-saga/effects";
import {
  editModuleIDSuccess,
  fetchModelsList,
  fetchModelsListError,
  fetchModelsListSuccess,
  PostModelsSubmitSuccess,
  updateModuleIDSuccess
} from "./actions";
import {
  delete_ModuleID,
  edit_ModuleID,
  Fetch_ModulesList,
  postSubmitModules,
  updateModule_ID
} from "../../../helpers/backend_helper";
import {
  DELETE_MODULE_ID,
  EDIT_MODULE_ID,
  FETCH_MODULES_LIST,
  POST_MODULES_SUBMIT,
  UPDATE_MODULE_ID
} from "./actionType";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";

function* SubmitModules({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(postSubmitModules, data);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) {
      yield put(PostModelsSubmitSuccess(response));
    } else {
      yield put(PostModelsSubmitSuccess({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(PostModelsSubmitSuccess({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    yield put(AlertState({ Type: 3, Status: true, Message: "Network Error", RedirectPath: false, AfterResponseAction: false }));
    console.log("$$PostSubmitModules  saga page error$", error);
  }
}

function* fetchModulesList() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(Fetch_ModulesList);
    yield put(fetchModelsListSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(fetchModelsListError(error));
    yield console.log("fetchModulesList  saga page error ***  :", error);
  }
}
function* deleteModule_ID({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(delete_ModuleID, id);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: fetchModelsList,
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

function* editModule_ID({ id }) {
  try {
    const response = yield call(edit_ModuleID, id);
    yield put(editModuleIDSuccess(response));
  } catch (error) {
    console.log("editModule_ID  saga page error ***  :", error);
  }
}
function* update_Module({ data, id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(updateModule_ID, data, id);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(updateModuleIDSuccess(response));
      // yield put(AlertState({
      //   Type: 1, Status: true,
      //   Message: response.Message,
      //   RedirectPath: false,
      //   AfterResponseAction: fetchModelsList,
      // }))
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
function* ModulesSaga() {
  yield takeEvery(POST_MODULES_SUBMIT, SubmitModules);
  yield takeEvery(FETCH_MODULES_LIST, fetchModulesList);
  yield takeEvery(DELETE_MODULE_ID, deleteModule_ID);
  yield takeEvery(EDIT_MODULE_ID, editModule_ID);
  yield takeEvery(UPDATE_MODULE_ID, update_Module);


}

export default ModulesSaga;
