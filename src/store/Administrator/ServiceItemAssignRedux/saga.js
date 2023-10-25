import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { ServiceItemAssign_GoButton_API, ServiceItemAssign_Save_API } from "../../../helpers/backend_helper";
import { goButton_ServiceItemAssign_Success, ServiceItemAssign_ApiError_Action, save_ServiceItemAssign_Success } from "./action";
import { GO_BUTTON_SERVICE_ITEM_ASSIGN, SAVE_SERVICE_ITEM_ASSIGN_ACTION } from "./actionType";

function* save_ServiceItemAssign_GenFunc({ config }) {

  try {
    const response = yield call(ServiceItemAssign_Save_API, config);
    yield put(save_ServiceItemAssign_Success(response));

  } catch (error) {
    CommonConsole(error)
    yield put(ServiceItemAssign_ApiError_Action())
  }
}

function* goButton_ServiceItemAssign_GenFunc({ config }) {

  try {

    const response = yield call(ServiceItemAssign_GoButton_API, config);

    response.Data.map((item) => {
      item["selectCheck"] = false;

      if (item.Party > 0) {
        item["selectCheck"] = true;
      }
      return item
    });
    debugger
    yield put(goButton_ServiceItemAssign_Success(response.Data));

  } catch (error) {
    CommonConsole(error)
    yield put(ServiceItemAssign_ApiError_Action())
  }
}

function* ServiceItemAssignSaga() {
  yield takeLatest(SAVE_SERVICE_ITEM_ASSIGN_ACTION, save_ServiceItemAssign_GenFunc)
  yield takeLatest(GO_BUTTON_SERVICE_ITEM_ASSIGN, goButton_ServiceItemAssign_GenFunc)
}

export default ServiceItemAssignSaga;