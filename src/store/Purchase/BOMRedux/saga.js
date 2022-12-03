import { call, put, takeEvery } from "redux-saga/effects";
import { BOM_ListPage_API, BOM_Post_API, editBOMListID_forBOMPage_ApiCall, GetItemUnits_For_Dropdown } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { editBOMListSuccess, getBOMListPageSuccess, GetItemUnitsDrodownAPISuccess, postBOMSuccess } from "./action";
import { EDIT_BOM_LIST_ID, GET_BOM_LIST_PAGE, GET_ITEM_UNITS_DROPDOWN_API, POST_BOM } from "./actionTypes";

//post api
function* Post_BOM_GenratorFunction({ data }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(BOM_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postBOMSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// GetItemUnits API
function* GetItemUnits_saga({ data }) {
  try {
    const response = yield call(GetItemUnits_For_Dropdown, data);
    const UnitDataConvert = response.Data.ItemUnitDetails.map((data) => ({
      value: data.id,
      label: data.UnitName,
      UnitID: data.UnitID,
    }))
    yield put(GetItemUnitsDrodownAPISuccess(UnitDataConvert));
  } catch (error) {
    console.log("GetItemUnits saga page error", error);
  }
}

// List Page API
function* get_BOMList_GenFunc({ filters }) {

  yield put(SpinnerState(true))
  try {

    const response = yield call(BOM_ListPage_API, filters);
    yield put(SpinnerState(false))
    yield put(getBOMListPageSuccess(response.Data))
    console.log(response)
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error  Get BOMList",
    }));
  }
}

// edit List page
function* editBOMListGenFunc({ id1, id2, pageMode }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(editBOMListID_forBOMPage_ApiCall, id1, id2);
    response.pageMode = pageMode
    yield put(SpinnerState(false))
    yield put(editBOMListSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error BOM Edit Method ",
    }));
  }
}
function* BOMSaga() {
  yield takeEvery(POST_BOM, Post_BOM_GenratorFunction)
  yield takeEvery(GET_ITEM_UNITS_DROPDOWN_API, GetItemUnits_saga)
  yield takeEvery(GET_BOM_LIST_PAGE, get_BOMList_GenFunc)
  yield takeEvery(EDIT_BOM_LIST_ID, editBOMListGenFunc)
}

export default BOMSaga;