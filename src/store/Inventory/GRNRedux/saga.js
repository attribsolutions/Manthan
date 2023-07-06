import { call, put, takeEvery } from "redux-saga/effects";
import {
  GrnApiErrorAction,
  deleteGRNIdSuccess,
  editGRNIdSuccess,
  getGRNListPageSuccess,
  makeGRN_Mode_1ActionSuccess,
  saveGRNSuccess,
  updateGRNIdSuccess,
} from "./actions";
import {
  GRN_delete_API,
  GRN_Edit_API,
  GRN_get_API, GRN_Make_API, GRN_Post_API,
  GRN_update_API,
} from "../../../helpers/backend_helper";
import {
  DELETE_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE,
  MAKE_GRN_MODE_1_ACTION,
  GET_GRN_LIST_PAGE,
  SAVE_GRN_FROM_GRN_PAGE_ACTION,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
} from "./actionType";
import { CommonConsole, date_dmy_func, convertTimefunc } from "../../../components/Common/CommonFunction";
import * as _cfunc from "../../../components/Common/CommonFunction";

function* saveGRNGenFunc({ config }) {            // Save GRN  genrator function
  try {
    const response = yield call(GRN_Post_API, config);
    yield put(saveGRNSuccess(response));
  } catch (error) { yield put(GrnApiErrorAction()) }
}


function* DeleteGRNGenFunc({ config }) {            // Delete GRN  genrator function
  try {
    const response = yield call(GRN_delete_API, config);
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

function* UpdateGRNGenFunc({ config }) {             // Upadte GRN  genrator function
  try {
    const response = yield call(GRN_update_API, config);
    yield put(updateGRNIdSuccess(response))
  } catch (error) { yield put(GrnApiErrorAction()) }
}

function* GRNListfilterGerFunc({ config }) {          // Grn_List filter  genrator function
  try {
    const response = yield call(GRN_get_API, config);
    const newList = yield response.Data.map((i) => {
      // i.BatchDate = _cfunc.date_ymd_func(i.BatchDate)
      i.GrandTotal = _cfunc.amountCommaSeparateFunc(i.GrandTotal) //  GrandTotal show with commas

      var date = date_dmy_func(i.GRNDate)
      var time = convertTimefunc(i.CreatedOn)
      i.GRNDate = (`${date} ${time}`)
      return i
    })
    yield put(getGRNListPageSuccess(newList))
  } catch (error) { yield put(GrnApiErrorAction()) }
}

function* makeGRN_Mode1_GenFunc({ config }) {
  // Make_GRN Items  genrator function
  debugger
  const { jsonBody, pageMode = '', path = '', grnRef = [], challanNo = '' } = config
  try {
    const response = yield call(GRN_Make_API, config);

    response.Data.OrderItem.forEach(index => {
      index["GSToption"] = index.GSTDropdown.map(i => ({ value: i.GST, label: i.GSTPercentage, }));
      index["MRPOps"] = index.MRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP }));
      index["defaultMRP"] = index["MRPOps"].reduce((maxObj, obj) => {
        return obj.value > maxObj.value ? obj : maxObj;
      }, { value: -Infinity });

      if (index.GST === null) {
        const deFaultValue = index.GSTDropdown.filter(i => i.GSTPercentage === index.GSTPercentage);
        const value = { label: deFaultValue[0].GSTPercentage, value: deFaultValue[0].GST }
        index["DefaultGST"] = value
      } else {
        const deFaultValue = index.GSTDropdown.filter(i => i.GST === index.GST);
        const value = { label: deFaultValue[0].GSTPercentage, value: deFaultValue[0].GST }
        index["DefaultGST"] = value
      }

    })

    response.Data.OrderItem.sort(function (a, b) {
      if (a.Item > b.Item) { return 1; }
      else if (a.Item < b.Item) { return -1; }
      return 0;
    });

    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath
    response.Data["GRNReferences"] = grnRef;
    response.Data["challanNo"] = challanNo;
    yield put(makeGRN_Mode_1ActionSuccess(response))
  } catch (error) { yield put(GrnApiErrorAction()) }
}
// 

function* GRNSaga() {

  yield takeEvery(MAKE_GRN_MODE_1_ACTION, makeGRN_Mode1_GenFunc);
  yield takeEvery(SAVE_GRN_FROM_GRN_PAGE_ACTION, saveGRNGenFunc);
  yield takeEvery(EDIT_GRN_FOR_GRN_PAGE, Edit_GRN_GenratorFunction);
  yield takeEvery(UPDATE_GRN_ID_FROM_GRN_PAGE, UpdateGRNGenFunc)
  yield takeEvery(DELETE_GRN_FOR_GRN_PAGE, DeleteGRNGenFunc);
  yield takeEvery(GET_GRN_LIST_PAGE, GRNListfilterGerFunc);
}

export default GRNSaga;
