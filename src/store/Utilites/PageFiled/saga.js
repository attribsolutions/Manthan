import { call, put, takeLatest } from "redux-saga/effects";
import { commonPageFiled_API } from "../../../helpers/backend_helper";
import { COMMON_PAGE_FILED, COMMON_PAGE_FILED_lIST } from "./actionType";

import {
  commonPageFieldSuccess,
  commonPageFieldListSuccess
} from "../../actions"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";


function* commonPageFiled_GenFunc({ pageId }) {

  try {
    const response = yield call(commonPageFiled_API, pageId);

    const { PageFieldMaster } = response.Data

    if ((PageFieldMaster.length > 0)) {
      yield put(commonPageFieldSuccess(response.Data));
    }

  } catch (error) { }
}
function* commonPageFiledList_GenFunc({ pageId }) {
  try {

    const response = yield call(commonPageFiled_API, pageId);
    const { PageFieldMaster } = response.Data
    if ((PageFieldMaster.length > 0)) {
      yield put(commonPageFieldListSuccess(response.Data));
    }
  } catch (error) { }
}

function* CommonPageField_Saga() {
  yield takeLatest(COMMON_PAGE_FILED, commonPageFiled_GenFunc);
  yield takeLatest(COMMON_PAGE_FILED_lIST, commonPageFiledList_GenFunc);
}
export default CommonPageField_Saga;
