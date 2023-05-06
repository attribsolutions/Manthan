import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";


function* Get_Items_GenFunc() {
  const filters = loginJsonBody()
  try {
    const response = yield call(apiCall.Items_Filter_API, filters);
    yield put(action.getItemListSuccess(response.Data))
  } catch (error) { CommonConsole(error) }
}

function* Items_Group_GenFunc() {
  try {
    const response = yield call(apiCall.Items_Group_Get_API);
    yield put(action.getItemGroup_ForDropDownSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* save_Items_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Items_Master_Post_API, config);
    yield put(action.SaveItemMasterActionSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Items_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Items_Master_Delete_API, config);
    yield put(action.deleteItemIdSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_Items_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(apiCall.Items_Master_Edit_API, config);
    response.pageMode = btnmode
    yield put(action.editItemSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_Items_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Items_Master_Update_API, config);
    yield put(action.updateItemMasterActionSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* BaseUnit_DropDown_GenFunc() {
  try {
    const response = yield call(apiCall.BaseUnit_Get_DropDown_API);
    yield put(action.getBaseUnit_ForDropDownSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* CategoryType_DropDown_GenFunc() {
  try {
    const response = yield call(apiCall.CategoryType_Get_DropDown_API);
    yield put(action.get_CategoryTypes_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ImageType_DropDown_GenFunc() {
  try {
    const response = yield call(apiCall.ImageType_Get_DropDown_API);
    yield put(action.get_ImageType_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* MRPType_DropDown_GenFunc() {
  try {
    const response = yield call(apiCall.MRPType_Get_DropDown_API);
    yield put(action.get_MRPTypes_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Division_DropDown_GenFunc({ id = 1 }) {
  try {
    const response = yield call(apiCall.Division_Get_DropDown_API, id);
    yield put(action.get_Division_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Party_DropDown_GenFunc({ id = 0 }) {
  try {
    const response = yield call(apiCall.Party_Get_DropDown_API, id);
    yield put(action.get_Party_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Item tag Name 
function* Item_tagname_GenFunc() {
  try {
    const response = yield call(apiCall.Get_Item_Tag);
    yield put(action.getItemtagSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Brand tag Name 
// function* Brand_tagname_GenFunc() {
//   try {
//     const response = yield call(apiCall.Get_Brand_Tag);
//     yield put(action.getBrandtagSuccess(response.Data));
//   } catch (error) { CommonConsole(error) }
// }

function* Group_DropDown_GenFunc({ id }) {
  try {
    const response = yield call(apiCall.Group_By_GroupTypes_DropDown_API, id);
    yield put(action.get_Group_By_GroupType_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* SubGroup_DropDown_GenFunc({ id }) {
  try {
    const response = yield call(apiCall.SubGroup_By_Group_DropDown_API, id);
    yield put(action.get_Sub_Group_By_Group_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Category  API dependent on CategoryType api
function* Category_DropDown_API_GenFunc({ id }) {
  try {
    const response = yield call(apiCall.Category_By_CategoryTypes_DropDown_API, id);
    yield put(action.get_Category_By_CategoryType_ForDropDownAPI_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ItemsMastersSaga() {
  yield takeEvery(actionType.GET_ITEM_LIST_API, Get_Items_GenFunc);
  yield takeEvery(actionType.GET_ITEM_GROUP_FOR_DROPDOWN, Items_Group_GenFunc);
  yield takeEvery(actionType.SAVE_ITEM_MASTER, save_Items_GenFunc);
  yield takeEvery(actionType.EDIT_ITEM_ID, Edit_Items_GenFunc);
  yield takeEvery(actionType.DELETE_ITEM_ID, Delete_Items_GenFunc);
  yield takeEvery(actionType.UPDATE_ITEM_ID, Update_Items_GenFunc);
  yield takeEvery(actionType.GET_CATEGORYTYPE_FOR_DROPDOWN, CategoryType_DropDown_GenFunc);

  yield takeEvery(actionType.GET_BASEUNIT_FOR_DROPDOWN, BaseUnit_DropDown_GenFunc);
  yield takeEvery(actionType.GET_IMAGETYPE_FOR_DROPDOWN, ImageType_DropDown_GenFunc);
  yield takeEvery(actionType.GET_MRPTYPE_FOR_DROPDOWN, MRPType_DropDown_GenFunc);
  yield takeEvery(actionType.GET_DIVISION_FOR_DROPDOWN, Division_DropDown_GenFunc);
  yield takeEvery(actionType.GET_PARTY_FOR_DROPDOWN, Party_DropDown_GenFunc);
  yield takeEvery(actionType.GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN, Group_DropDown_GenFunc);
  yield takeEvery(actionType.GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN, SubGroup_DropDown_GenFunc);
  yield takeEvery(actionType.GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API, Category_DropDown_API_GenFunc);
  yield takeEvery(actionType.GET_ITEMTAG_API, Item_tagname_GenFunc);
}

export default ItemsMastersSaga;
