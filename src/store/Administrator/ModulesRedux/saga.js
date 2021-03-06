import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteModuleIDSuccess,
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

function* SubmitModules_GenratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(postSubmitModules, data);
    yield put(SpinnerState(false))
    yield put(PostModelsSubmitSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* fetchModulesList_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Fetch_ModulesList);
    if(response.StatusCode===200){
      yield put(fetchModelsListSuccess(response.Data));
    }
    else {
      yield put(AlertState({ Type: 4, 
        Status: true, Message:response.Message,
      }));
    }

    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}
function* deleteModule_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(delete_ModuleID, id);
    yield put(SpinnerState(false))
    yield put(deleteModuleIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* editModule_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_ModuleID, id);
    yield put(editModuleIDSuccess(response));
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* update_Module_GenratorFunction({ data, id }) {
  console.log("data",data)
  try {
    yield put(SpinnerState(true))
    const response = yield call(updateModule_ID, data, id);
    yield put(SpinnerState(false))
    yield put(updateModuleIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}
function* ModulesSaga() {
  yield takeEvery(POST_MODULES_SUBMIT, SubmitModules_GenratorFunction);
  yield takeEvery(FETCH_MODULES_LIST, fetchModulesList_GenratorFunction);
  yield takeEvery(DELETE_MODULE_ID, deleteModule_ID_GenratorFunction);
  yield takeEvery(EDIT_MODULE_ID, editModule_ID_GenratorFunction);
  yield takeEvery(UPDATE_MODULE_ID, update_Module_GenratorFunction);


}

export default ModulesSaga;
