import { call, put, takeLatest } from "redux-saga/effects";
import {
  challanItemForDropdownSuccess,
  deleteChallanIdSuccess,
  challanList_ForListPageSuccess,
  GoButtonForChallanAddSuccess,
  makeChallanActionSuccess,
  saveChallan_ChallanAddSuccess,
  VDC_Item,
  VDC_Item_Success,
  VDC_Item_Details_Success,
  IB_Invoice_Error_Action,
} from "./actions";
import {
  Challan_delete_API,
  Challan_get_API,
  Challan_items_API,
  Challan_items_Stock_API,
  Challan_Make_API,
  Challan_Save_API,
  VDC_Item_API,
  VDC_Item_Details_API,
} from "../../../helpers/backend_helper";
import {
  CHALLAN_POST_API,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  CHALLAN_LIST_FOR_LIST_PAGE,
  GO_BUTTON_CHALLAN_POST_API,
  ITEM_DROPDOWN_CHALLAN,
  MAKE_CHALLAN_ACTION,
  VDC_ITEM,
  VDC_ITEM_DETAILS,
} from "./actionType";
import { CommonConsole, date_dmy_func, convertTimefunc, listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";
import { makeGRN_Mode_1ActionSuccess } from "../GRNRedux/actions";


function* save_Challan_GerFunc({ data }) {                   // Save Challan  genrator function
  try {
    const response = yield call(Challan_Save_API, data);
    yield put(saveChallan_ChallanAddSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Challan_List_filterGerFunc({ filters }) {          // Challan List Filter  genrator function
  try {
    const response = yield call(Challan_get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = date_dmy_func(i.ChallanDate)
      var time = convertTimefunc(i.CreatedOn)
      i.ChallanDate = (`${date} ${time}`)
      i["transactionDate"] = i.CreatedOn
      i["transactionDateLabel"] = listpageConcatDateAndTime(i.ChallanDate, i.CreatedOn);
      if ((i?.inward)) {
        i.forceMakeBtnHide = true;
        i.Status = "Close"
      } else {
        i.forceMakeBtnHide = false;
        i.Status = "Open"
      }
      return i
    })
    yield put(challanList_ForListPageSuccess(newList))

  } catch (error) { CommonConsole(error) }
}

function* DeleteChallanGenFunc({ config }) { // Delete Challan  genrator function

  try {
    const response = yield call(Challan_delete_API, config);

    yield put(deleteChallanIdSuccess(response));
  } catch (error) { CommonConsole(error) }
};

function* Make_Challan_GerFunc({ config }) {                  // Make Chalan Challan  genrator function
  const { pageMode = '', path = '' } = config
  try {
    const response = yield call(Challan_Make_API, config);
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath
    yield put(makeChallanActionSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* gobutton_challan_genFunc({ data }) {              //  GoButton Challan Addpage genrator function
  try {
    const arr = []
    const response = yield call(Challan_items_Stock_API, data);
    arr.push({ StockDetails: response.Data, })
    yield put(GoButtonForChallanAddSuccess(arr));
  } catch (error) { CommonConsole(error) }
}


function* VDC_Item_genFunc({ config }) {              //  GoButton Challan Addpage genrator function
  try {

    const response = yield call(VDC_Item_API, config);

    yield put(VDC_Item_Success(response.Data));
  } catch (error) { IB_Invoice_Error_Action(error) }
}

function* VDC_Item_Details_genFunc({ config }) {              //  GoButton Challan Addpage genrator function
  try {

    const response = yield call(VDC_Item_Details_API, config);

    yield put(makeGRN_Mode_1ActionSuccess(response));
  } catch (error) { yield put(IB_Invoice_Error_Action(error)) }
}




function* itemDropDown_Challan_AddPage_genFunc({ data }) {   //  Challan Addpage  IttemDropDown genrator function
  try {
    const response = yield call(Challan_items_API, data);
    yield put(challanItemForDropdownSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ChallanSaga() {
  yield takeLatest(CHALLAN_POST_API, save_Challan_GerFunc);
  yield takeLatest(CHALLAN_LIST_FOR_LIST_PAGE, Challan_List_filterGerFunc);
  yield takeLatest(GO_BUTTON_CHALLAN_POST_API, gobutton_challan_genFunc);
  yield takeLatest(MAKE_CHALLAN_ACTION, Make_Challan_GerFunc);
  yield takeLatest(DELETE_CHALLAN_FOR_CHALLAN_PAGE, DeleteChallanGenFunc);
  yield takeLatest(ITEM_DROPDOWN_CHALLAN, itemDropDown_Challan_AddPage_genFunc);

  yield takeLatest(VDC_ITEM_DETAILS, VDC_Item_Details_genFunc);

  yield takeLatest(VDC_ITEM, VDC_Item_genFunc);



}

export default ChallanSaga;
