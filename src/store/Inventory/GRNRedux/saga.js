import { call, put, takeLatest } from "redux-saga/effects";
import {
  AccountingGRNSuccess,
  GrnApiErrorAction,
  Update_accounting_GRN_Success,
  deleteGRNIdSuccess,
  editGRNIdSuccess,
  getGRNListPageSuccess,
  hideInvoiceForGRFActionSuccess,
  makeGRN_Mode_1ActionSuccess,
  saveGRNSuccess,
  updateGRNIdSuccess,
} from "./actions";
import {
  Accounting_GRN_update_API,
  AccountingGRN_delete_API,
  CheckStockEntryforBackDatedTransaction,
  get_Demand_Details_Post_API,
  GRN_delete_API,
  GRN_Edit_API,
  GRN_get_API, GRN_Make_API, GRN_Post_API,
  GRN_update_API,
  Hide_Invoice_For_GRN_API,
} from "../../../helpers/backend_helper";
import {
  DELETE_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE,
  MAKE_GRN_MODE_1_ACTION,
  GET_GRN_LIST_PAGE,
  SAVE_GRN_FROM_GRN_PAGE_ACTION,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
  HIDE_INVOICE_FOR_GRN_ACTION,
  ACCOUNTING_GRN,
  UPDATE_ACCOUNTING_GRN,
} from "./actionType";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url } from "../../../routes";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

function* saveGRNGenFunc({ config }) {            // Save GRN  genrator function
  try {
    const response = yield call(GRN_Post_API, config);
    response["GRN_Reference"] = config.GRNReferencesUpdate[0]?.GRN_From
    yield put(saveGRNSuccess(response));
  } catch (error) { yield put(GrnApiErrorAction()) }
}


function* DeleteGRNGenFunc({ config }) {
  debugger
  try {
    const SelectedPartyID = JSON.parse(localStorage.getItem("selectedParty")).value
    const jsonBodyForBackdatedTransaction = JSON.stringify({
      "TransactionDate": config.rowData.GRNDate,
      "PartyID": SelectedPartyID,
    });
    if (!(config.subPageMode === url.ACCOUNTING_GRN_LIST)) {
      const BackDateresponse = yield CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction })
      if (BackDateresponse.Status === true && BackDateresponse.StatusCode === 400) {
        customAlert({ Type: 3, Message: BackDateresponse.Message });
        yield put(GrnApiErrorAction())
        return
      }
    }

    let response = {}
    if (config.subPageMode === url.ACCOUNTING_GRN_LIST) {
      const jsonBody = JSON.stringify({ GRNid: config.deleteId })

      response = yield call(AccountingGRN_delete_API, jsonBody);
    } else {
      response = yield call(GRN_delete_API, config);
    }
    yield put(deleteGRNIdSuccess(response));
  } catch (error) { yield put(GrnApiErrorAction()) }
}

function* Edit_GRN_GenratorFunction({ config }) { // Edit  GRN  genrator function
  try {
    const { btnmode } = config;
    const response = yield call(GRN_Edit_API, config);
    response.pageMode = btnmode
    response.Data = response.Data[0];
    yield put(editGRNIdSuccess(response));
  } catch (error) { yield put(GrnApiErrorAction()) }
}






function* Accounting_GRN_GenratorFunction({ config }) { // Edit  GRN  genrator function
  try {
    const { btnmode, path } = config;
    const response = yield call(GRN_Edit_API, config);
    response.pageMode = btnmode
    response.pageMode = btnmode
    response["path"] = path;
    response.Data = response.Data[0];
    yield put(AccountingGRNSuccess(response));
  } catch (error) { yield put(GrnApiErrorAction()) }
}




function* UpdateGRNGenFunc({ config }) {             // Upadte GRN  genrator function
  try {
    const response = yield call(GRN_update_API, config);
    yield put(updateGRNIdSuccess(response))
  } catch (error) { yield put(GrnApiErrorAction()) }
}


function* UpdateAccountingGRNGenFunc({ config }) {             // Upadte GRN  genrator function
  try {
    const response = yield call(Accounting_GRN_update_API, config);
    yield put(Update_accounting_GRN_Success(response))
  } catch (error) { yield put(GrnApiErrorAction()) }
}





function* GRNListfilterGerFunc({ config }) {          // Grn_List filter  genrator function
  try {
    const response = yield call(GRN_get_API, config);
    let filteredData = response.Data;
    if (config.subPageMode === url.ACCOUNTING_GRN_LIST) {
      debugger
      filteredData = response.Data.filter(i => i.IsSave === 0);

      filteredData = filteredData.map((i) => {
        i.TotalExpenses = (i.TotalExpenses === null) ? 0 : i.TotalExpenses;
        i["FinalTotal"] = (Number(i.GrandTotal) + Number(i.TotalExpenses)).toFixed(2);
        return i;
      });
    } if (config.subPageMode === url.GRN_LIST_3) {
      filteredData = response.Data;
    } if (config.subPageMode === url.GRN_FOR_ACCOUNTING_GRN) {
      filteredData = response.Data.filter(i => i.IsSave === 1);
    }

    const newList = yield filteredData.map((i) => {
      i["forceMakeBtnHide"] = i.IsSave === 0 ? true : false;
      i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
      i.GrandTotal = _cfunc.amountCommaSeparateFunc(i.GrandTotal) //  GrandTotal show with commas
      i.InvoiceDate = _cfunc.date_dmy_func(i.InvoiceDate);
      const DateAndTimeLable = _cfunc.listpageConcatDateAndTime(i.GRNDate, i.CreatedOn);
      i["transactionDate"] = `${i.CreatedOn}${DateAndTimeLable}`; // transactionDate for sorting and filtering data 
      i["transactionDateLabel"] = DateAndTimeLable;

      return i
    })
    yield put(getGRNListPageSuccess(newList))
  } catch (error) { yield put(GrnApiErrorAction()) }
}

function* HideInvoiceForGRNGenFunc({ config }) {             // Upadte GRN  genrator function
  try {
    const response = yield call(Hide_Invoice_For_GRN_API, config);
    yield put(hideInvoiceForGRFActionSuccess(response))
  } catch (error) { yield put(GrnApiErrorAction()) }
}

function* makeGRN_Mode1_GenFunc({ config }) {
  // Make_GRN Items  genrator function

  const { pageMode = '', path = '', grnRef = [], InvoiceDate, subPageMode } = config

  try {
    if (subPageMode === url.IB_ORDER_SO_LIST) {
      const response = yield call(get_Demand_Details_Post_API, config);
      response["pageMode"] = pageMode;
      response["path"] = path;
      response["Demand_Reference"] = grnRef;

      yield put(makeGRN_Mode_1ActionSuccess(response))
    }
    else {
      const response = yield call(GRN_Make_API, config);

      response.Data.OrderItem.forEach(index => {

        index["GSToption"] = index.GSTDropdown?.map(i => ({ value: i.GST, label: i.GSTPercentage, }));
        index["MRPOps"] = index.MRPDetails?.map(i => ({ label: i.MRPValue, value: i.MRP }));

        let deFaultValue = { value: 0 }; // Default value for case when MRPOps is undefined
        if (index["MRPOps"]) {
          deFaultValue = index["MRPOps"].reduce((maxObj, obj) => {
            return obj.value > maxObj.value ? obj : maxObj;
          }, { value: -Infinity });
        }
        // const deFaultValue = index["MRPOps"].reduce((maxObj, obj) => {
        //   return obj.value > maxObj.value ? obj : maxObj;
        // }, { value: -Infinity });

        index["MRPValue"] = (deFaultValue?.value === 0) ? index.MRPValue : deFaultValue?.label;
        index["MRP"] = (deFaultValue?.value === 0) ? index.MRP : deFaultValue?.value;
        index["vendorOrderRate"] = index.Rate;

        if (index.GST === null) {
          const deFaultValue = index.GSTDropdown?.filter(i => i.GSTPercentage === index.GSTPercentage);
          if (deFaultValue.length === 0) {
            const highestGSTObject = index.GSTDropdown?.reduce((maxObj, current) =>
              current.GST > maxObj.GST ? current : maxObj, index.GSTDropdown[0]);
            index["GSTPercentage"] = highestGSTObject.GSTPercentage
            index["GST"] = highestGSTObject.GST;
          }
          else {
            index["GSTPercentage"] = deFaultValue[0]?.GSTPercentage
            index["GST"] = deFaultValue[0]?.GST;
          }

        } else {
          if (index.GSTDropdown) {
            const deFaultValue = index.GSTDropdown?.filter(i => i.GST === index.GST);
            index["GSTPercentage"] = (deFaultValue === undefined) ? "" : deFaultValue[0]?.GSTPercentage;
            index["GST"] = (deFaultValue === undefined) ? "" : deFaultValue[0]?.GST;
          } else {
            index["GSTPercentage"] = index.GSTPercentage
          }
        }

      })

      response.Data.OrderItem?.sort(function (a, b) {
        if (a.Item > b.Item) { return 1; }
        else if (a.Item < b.Item) { return -1; }
        return 0;
      });


      response["pageMode"] = pageMode;
      response["path"] = path; //Pagepath
      response.Data["GRNReferences"] = grnRef;
      response.Data["InvoiceDate"] = InvoiceDate
      yield put(makeGRN_Mode_1ActionSuccess(response))
    }


  } catch (error) { yield put(GrnApiErrorAction()) }
}
// 

function* GRNSaga() {

  yield takeLatest(HIDE_INVOICE_FOR_GRN_ACTION, HideInvoiceForGRNGenFunc);
  yield takeLatest(MAKE_GRN_MODE_1_ACTION, makeGRN_Mode1_GenFunc);
  yield takeLatest(SAVE_GRN_FROM_GRN_PAGE_ACTION, saveGRNGenFunc);
  yield takeLatest(EDIT_GRN_FOR_GRN_PAGE, Edit_GRN_GenratorFunction);
  yield takeLatest(UPDATE_GRN_ID_FROM_GRN_PAGE, UpdateGRNGenFunc)
  yield takeLatest(DELETE_GRN_FOR_GRN_PAGE, DeleteGRNGenFunc);
  yield takeLatest(GET_GRN_LIST_PAGE, GRNListfilterGerFunc);
  yield takeLatest(ACCOUNTING_GRN, Accounting_GRN_GenratorFunction);
  yield takeLatest(UPDATE_ACCOUNTING_GRN, UpdateAccountingGRNGenFunc);



}

export default GRNSaga;
