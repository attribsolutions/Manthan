import { call, put, takeLatest } from "redux-saga/effects";
import { date_dmy_func, convertTimefunc } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { BOM_Delete_API, BOM_ListPage_API, BOM_Post_API, BOM_Update_API, GetItemUnits_For_Dropdown, BOM_Edit_API } from "../../../helpers/backend_helper";
import { BOMApiErrorAction, deleteBOMIdSuccess, editBOMListSuccess, getBOMListPageSuccess, GetItemUnitsDrodownAPISuccess, saveBOMMasterSuccess, updateBOMListSuccess } from "./action";
import { DELETE_BOM_LIST_PAGE, EDIT_BOM_LIST_ID, GET_BOM_LIST_PAGE, GET_ITEM_UNITS_DROPDOWN_API, SAVE_BOM_MASTER, UPDATE_BOM_LIST } from "./actionTypes";

//post api
function* Post_BOM_GenratorFunction({ config }) {
  try {
    const response = yield call(BOM_Post_API, config);
    yield put(saveBOMMasterSuccess(response));
  }
  catch (error) { yield put(BOMApiErrorAction()) }
}

function* get_BOMList_GenFunc({ filters }) {
  try {
    const response = yield call(BOM_ListPage_API, filters);
    let data = response.Data.map((i) => {
      i["ID"] = i.id  // use For Dropdown 
      i.id = `${i.id}/${i.Company}`;  // use For List Page
      var date = date_dmy_func(i.BomDate)
      var time = convertTimefunc(i.CreatedOn)
      i.transactionDateLabel = (`${date} ${time}`)
      i.BomDate = date

      return i
    })
    yield put(getBOMListPageSuccess(data))
  } catch (error) { yield put(BOMApiErrorAction()) }
}

function* editBOMListGenFunc({ config }) {

  const { btnmode } = config;
  try {
    let response = yield call(BOM_Edit_API, config);
    response.pageMode = btnmode
    response.Data = response.Data[0];
    if (response.StatusCode === 200) yield put(editBOMListSuccess(response))
    else {
      customAlert({
        Type: 4,
        Status: true, Message: JSON.stringify(response.Message),
      })
    }
  } catch (error) { yield put(BOMApiErrorAction()) }
}

function* UpdateBOM_ID_GenFunc({ config }) {
  try {
    const response = yield call(BOM_Update_API, config);
    yield put(updateBOMListSuccess(response))
  } catch (error) { yield put(BOMApiErrorAction()) }
}

function* DeleteBOM_GenFunc({ config }) {
  try {
    const response = yield call(BOM_Delete_API, config);
    if (response.StatusCode === 200) yield put(deleteBOMIdSuccess(response))
    else {
      customAlert({
        Type: 4,
        Message: JSON.stringify(response.Message),
      })
    }

  } catch (error) { yield put(BOMApiErrorAction()) }
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
  } catch (error) { yield put(BOMApiErrorAction()) }
}

function* BOMSaga() {
  yield takeLatest(SAVE_BOM_MASTER, Post_BOM_GenratorFunction)
  yield takeLatest(GET_ITEM_UNITS_DROPDOWN_API, GetItemUnits_saga)
  yield takeLatest(GET_BOM_LIST_PAGE, get_BOMList_GenFunc)
  yield takeLatest(EDIT_BOM_LIST_ID, editBOMListGenFunc)
  yield takeLatest(UPDATE_BOM_LIST, UpdateBOM_ID_GenFunc)
  yield takeLatest(DELETE_BOM_LIST_PAGE, DeleteBOM_GenFunc)
}

export default BOMSaga;
