import { call, put, takeEvery } from "redux-saga/effects";
import { commonPageFiled_API } from "../../../helpers/backend_helper";
import { COMMON_PAGE_FILED, COMMON_PAGE_FILED_lIST } from "./actionType";

import {
  commonPageFieldSuccess,
  commonPageFieldListSuccess
} from "../../actions"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { history } from "../../../components/Common/CommonFunction";


function* commonPageFiled_GenFunc({ pageId }) {
  try {
    
    const response = yield call(commonPageFiled_API, pageId);
 
   const  {PageFieldMaster}=response.Data  
   
    if ((PageFieldMaster.length > 0)) {
      yield put(commonPageFieldSuccess(response.Data));
    }
    else {
    customAlert({
        Type: 2,
        Message: `PageMaster API Error : Page-Id=${pageId}`
      })
    }
  } catch (error) {
     customAlert({
      Type: 2,
      Message: `PageMaster API Error : Page-Id=${pageId}`
    })
 
  }
}
function* commonPageFiledList_GenFunc({ pageId }) {
  try {
    
    const response = yield call(commonPageFiled_API, pageId);
    const  {PageFieldMaster}=response.Data 
    if ((PageFieldMaster.length > 0)) { 
      yield put(commonPageFieldListSuccess(response.Data));
    }
    else {
      yield customAlert({
        Type: 2,
        Message: `PageMaster API Error : Page-Id=${pageId}`
      })
     
    }
  } catch (error) {
    yield customAlert({
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
