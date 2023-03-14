import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";
import { BOM_Delete_API, BOM_ListPage_API, BOM_Post_API, BOM_Update_API, editBOMListID_forBOMPage_ApiCall, bOM_Edit_API, GetItemUnits_For_Dropdown } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteBOMIdSuccess, editBOMListSuccess, getBOMListPageSuccess, GetItemUnitsDrodownAPISuccess, postBOMSuccess, updateBOMListSuccess } from "./action";
import { DELETE_BOM_LIST_PAGE, EDIT_BOM_LIST_ID, GET_BOM_LIST_PAGE, GET_ITEM_UNITS_DROPDOWN_API, SAVE_BOM_MASTER, UPDATE_BOM_LIST } from "./actionTypes";

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
    let data = response.Data.map((i) => {
      i.id = `${i.id}/${i.Company}`;
      var date = convertDatefunc(i.BomDate)
      var time = convertTimefunc(i.CreatedOn)
      i.BomDate = (`${date} ${time}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(getBOMListPageSuccess(data))
   
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error  Get BOMList",
    }));
  }
}

// edit List page
function* editBOMListGenFunc({ id1, pageMode }) {

  yield put(SpinnerState(true))
  try {
    let response = yield call(bOM_Edit_API, id1);
    response.pageMode = pageMode
    response.Data = response.Data[0];
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) yield put(editBOMListSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error BOM Edit Method ",
    }));
  }
}

function* UpdateBOM_ID_GenFunc({ data, id1 }) {

  try {
    yield put(SpinnerState(true))
    const response = yield call(BOM_Update_API, data, id1);
    yield put(SpinnerState(false))
    yield put(updateBOMListSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error UpdateOrder",
    }));
  }
}

function* DeleteBOM_GenFunc({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(BOM_Delete_API, id);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) yield put(deleteBOMIdSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteOrder",
    }));
  }
}

function* BOMSaga() {
  yield takeEvery(SAVE_BOM_MASTER, Post_BOM_GenratorFunction)
  yield takeEvery(GET_ITEM_UNITS_DROPDOWN_API, GetItemUnits_saga)
  yield takeEvery(GET_BOM_LIST_PAGE, get_BOMList_GenFunc)
  yield takeEvery(EDIT_BOM_LIST_ID, editBOMListGenFunc)
  yield takeEvery(UPDATE_BOM_LIST, UpdateBOM_ID_GenFunc)
  yield takeEvery(DELETE_BOM_LIST_PAGE, DeleteBOM_GenFunc)
}

export default BOMSaga;