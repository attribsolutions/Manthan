import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { BOM_Delete_API, BOM_ListPage_API, BOM_Post_API, BOM_Update_API, edit_BOMListID, GetItemUnits_For_Dropdown } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { deleteBOMIdSuccess, editBOMListSuccess, getBOMListPageSuccess, GetItemUnitsDrodownAPISuccess, postBOMSuccess, updateBOMListSuccess } from "./action";
import { DELETE_BOM_LIST_PAGE, EDIT_BOM_LIST_ID, GET_BOM_LIST_PAGE, GET_ITEM_UNITS_DROPDOWN_API, POST_BOM, UPDATE_BOM_LIST } from "./actionTypes";

//post api
function* Post_BOM_GenratorFunction({ data }) {
  try {
    const response = yield call(BOM_Post_API, data);
    yield put(postBOMSuccess(response));
  } catch (error) { CommonConsole(error) }
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
  } catch (error) { CommonConsole(error) }
}


function* get_BOMList_GenFunc({ filters }) {
  try {
    const response = yield call(BOM_ListPage_API, filters);
    let data = response.Data.map((i) => {
      i.id = `${i.id}/${i.Company}`;
      var date = convertDatefunc(i.BomDate)
      var time = convertTimefunc(i.CreatedOn)
      i.BomDate = (`${date} ${time}`)
      return i
    })
    yield put(getBOMListPageSuccess(data))

  } catch (error) { CommonConsole(error) }
}


function* editBOMListGenFunc({ id1, pageMode }) {
  try {
    let response = yield call(edit_BOMListID, id1);
    response.pageMode = pageMode
    response.Data = response.Data[0];
    if (response.StatusCode === 200) yield put(editBOMListSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) { CommonConsole(error) }
}

function* UpdateBOM_ID_GenFunc({ data, id1 }) {
  try {
    const response = yield call(BOM_Update_API, data, id1);
    yield put(updateBOMListSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* DeleteBOM_GenFunc({ id }) {
  try {
    const response = yield call(BOM_Delete_API, id);
    if (response.StatusCode === 200) yield put(deleteBOMIdSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) { CommonConsole(error) }
}

function* BOMSaga() {
  yield takeEvery(POST_BOM, Post_BOM_GenratorFunction)
  yield takeEvery(GET_ITEM_UNITS_DROPDOWN_API, GetItemUnits_saga)
  yield takeEvery(GET_BOM_LIST_PAGE, get_BOMList_GenFunc)
  yield takeEvery(EDIT_BOM_LIST_ID, editBOMListGenFunc)
  yield takeEvery(UPDATE_BOM_LIST, UpdateBOM_ID_GenFunc)
  yield takeEvery(DELETE_BOM_LIST_PAGE, DeleteBOM_GenFunc)
}

export default BOMSaga;