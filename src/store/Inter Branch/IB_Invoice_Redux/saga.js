import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { IB_InvoiceList_API, Inward_Button_API, Make_IB_Invoice_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { get_IB_InvoiceListPageSuccess, InwardButtonIdSuccess, MakeIBInvoiceSuccess } from "./action";
import { GET_IB_INVOICE_LIST_PAGE, INWARD_BUTTON_ID, MAKE_IB_INVOICE } from "./actionType";

// Inward List API
function* get_IB_InvoiceList_GenFunc({ filters }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(IB_InvoiceList_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.IBChallanDate)
      i.IBChallanDate = (`${date}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(get_IB_InvoiceListPageSuccess(newList))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error InterBranch Invoice List",
    }));
  }
}

// Inward Go Button Api
function* Inward_Button_GenratorFunction({ id }) {
  debugger
  try {
    const response =  yield call(Inward_Button_API, id);
    yield put(InwardButtonIdSuccess(response.Data));

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Inward Button",
    }));
  }
}

// Make IB_Invoice API
function* MakeIBInvoice_GenFun({ data }) {
  debugger
  try {
    const response =  yield call(Make_IB_Invoice_API, data);
    yield put(MakeIBInvoiceSuccess(response.Data));

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Make IB Invoice ",
    }));
  }
}

function* IB_InvoiceSaga() {
  yield takeEvery(GET_IB_INVOICE_LIST_PAGE, get_IB_InvoiceList_GenFunc)
  yield takeEvery(INWARD_BUTTON_ID, Inward_Button_GenratorFunction)
  yield takeEvery(MAKE_IB_INVOICE, MakeIBInvoice_GenFun)

}

export default IB_InvoiceSaga;