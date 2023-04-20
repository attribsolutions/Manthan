import { call, put, takeEvery } from "redux-saga/effects";
import { commonPageFiled_API } from "../../../helpers/backend_helper";
import { COMMON_PAGE_FILED, COMMON_PAGE_FILED_lIST } from "./actionType";

import {
  commonPageFieldSuccess,
  commonPageFieldListSuccess
} from "../../actions"
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { history } from "../../../components/Common/CommonFunction";


function* commonPageFiled_GenFunc({ pageId }) {
  try {
    const response = yield call(commonPageFiled_API, pageId);
    if ((response.Data.length > 0)) {
      yield put(commonPageFieldSuccess(response.Data));
    }
    else {
    CustomAlert({
        Type: 2,
        Message: `PageMaster API Error : Page-Id=${pageId}`
      })
    }
  } catch (error) {
     CustomAlert({
      Type: 2,
      Message: `PageMaster API Error : Page-Id=${pageId}`
    })
 
  }
}
function* commonPageFiledList_GenFunc({ pageId }) {
  try {
    const response = yield call(commonPageFiled_API, pageId);
    if ((response.Data.length > 0)) {
      yield put(commonPageFieldListSuccess(response.Data));
    }
    else {
      yield CustomAlert({
        Type: 2,
        Message: `PageMaster API Error : Page-Id=${pageId}`
      })
     
    }
  } catch (error) {
    yield CustomAlert({
      Type: 2,
      Message: `PageMaster API Error : Page-Id=${pageId}`
    })
  }
}

function* CommonPageField_Saga() {
  yield takeEvery(COMMON_PAGE_FILED, commonPageFiled_GenFunc);
  yield takeEvery(COMMON_PAGE_FILED_lIST, commonPageFiledList_GenFunc);
}
export default CommonPageField_Saga;
