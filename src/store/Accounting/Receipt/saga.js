import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, convertDatefunc, convertTimefunc, loginJsonBody } from "../../../components/Common/CommonFunction";


function* ReceiptGoButtonGenFunc({ jsonBody }) {                                   // getList API
  try {
    const response = yield call(apiCall.Receipt_Go_Button_API, jsonBody);
    response.Data.map((index) => {
      return index["Calculate"] = ""
    });
    yield put(action.ReceiptGoButtonMaster_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Depositor_Bank_GenFunc({ jsonBody }) {
  const filters = loginJsonBody()
  try {
    const response = yield call(apiCall.Depositor_Bank_Filter_API, filters);
    yield put(action.DepositorBankFilter_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* get_Receipt_List_GenFun({filters}) {
  try {
      const response = yield call(apiCall.Receipt_get_API, filters);
      const newList = yield response.Data.map((i) => {
          var date = convertDatefunc(i.Date)
          var time = convertTimefunc(i.CreatedOn)
          i.Date = (`${date} ${time}`)
          return i
  })
      yield put(action.getReceiptListPageSuccess(newList));
  } catch (error) { CommonConsole(error) }  
}

function* Receiptfilter_Post_API_GenFun({ filters }) {
     
  try {
      const response = yield call(apiCall.ReceiptFilter_Go_Button_API, filters);
      response.Data.map((index) => {
          index["Check"] = false
          return index
      });
      yield put(action.Receiptlistfilters(response));
    }catch (error) { CommonConsole(error) } 
}

function* save_Receipt_GenFunc({ config }) { 
 
  try {
    const response = yield call(apiCall.Receipt_Post_API, config);
    yield put(action.saveReceiptMaster_Success(response));

  } catch (error) { CommonConsole(error) }
}

function* ReceiptSaga() {
  yield takeEvery(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)
  yield takeEvery(actionType.DEPOSITOR_BANK_FILTER, Depositor_Bank_GenFunc)

  yield takeEvery(actionType.GET_RECEIPT_LIST_PAGE, get_Receipt_List_GenFun)
  yield takeEvery(actionType.RECEIPT_LIST_FILTERS, Receiptfilter_Post_API_GenFun)

  yield takeEvery(actionType.SAVE_RECEIPT_MASTER, save_Receipt_GenFunc)

}
export default ReceiptSaga;  