import { call, put, takeEvery } from "redux-saga/effects";
import { commonPageFiled_API } from "../../../helpers/backend_helper";
import { COMMON_PAGE_FILED, COMMON_PAGE_FILED_lIST } from "./actionType";

import {
  commonPageFieldSuccess,
  SpinnerState,
  commonPageFieldListSuccess
} from "../../actions"
import { hasError500 } from "../CommonError/actions";


function* commonPageFiled_GenFunc({ pageId }) {

  try {
    const response = yield call(commonPageFiled_API, pageId);

    yield put(commonPageFieldSuccess(response.Data));
   
  } catch (error) {
   
    yield put(hasError500(`PageMaster API Error : Page-Id=${pageId}`))

  }
}
function* commonPageFiledList_GenFunc({ pageId }) {

debugger
  try {
    const response = yield call(commonPageFiled_API, pageId);
    yield put(commonPageFieldListSuccess(response.Data));
   
  } catch (error) {

    yield put(hasError500(`PageMaster API Error : Page-Id=${pageId}`))
   
  }
}

function* CommonPageField_Saga() {
  yield takeEvery(COMMON_PAGE_FILED, commonPageFiled_GenFunc);
  yield takeEvery(COMMON_PAGE_FILED_lIST, commonPageFiledList_GenFunc);
}
export default CommonPageField_Saga;
