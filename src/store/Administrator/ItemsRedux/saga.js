import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  deleteItemIdSuccess,
  editItemSuccess,
  getBaseUnit_ForDropDownSuccess,
  getItemGroup_ForDropDownSuccess,
  getItemListSuccess, get_CategoryTypes_ForDropDown_Success,
  get_Category_By_CategoryType_ForDropDownAPI_Success,
  get_Category_By_CategoryType_ForDropDown_Success,
  get_Division_ForDropDown_Success,
  get_Group_By_GroupType_ForDropDown_Success,
  get_ImageType_ForDropDown_Success,
  get_MRPTypes_ForDropDown_Success,
  get_Party_ForDropDown_Success,
  get_PriceList_ForDropDown_Success,
  get_Sub_Category_By_CategoryType_ForDropDown_Success,
  get_Sub_Group_By_Group_ForDropDown_Success,
  PostItemDataSuccess,
  updateItemSuccess
} from "./action";
import {
  DELETE_ITEM_ID, EDIT_ITEM_ID,
  GET_BASEUNIT_FOR_DROPDOWN,
  GET_CATEGORYTYPE_FOR_DROPDOWN,
  GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN,
  GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API,
  GET_CATEGORY_FOR_DROPDOWN,
  GET_DIVISION_FOR_DROPDOWN,
  GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN,
  GET_IMAGETYPE_FOR_DROPDOWN,
  GET_ITEM_GROUP_FOR_DROPDOWN,
  GET_ITEM_LIST_API,
  GET_MRPTYPE_FOR_DROPDOWN,
  GET_PARTY_FOR_DROPDOWN,
  GET_PRICE_LIST_FOR_DROPDOWN,
  GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN,
  GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN,
  POST_ITEM_DATA,
  UPDATE_ITEM_ID
} from "./actionType";


function* Get_Items_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(apiCall.Items_Master_Get_API);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) yield put(getItemListSuccess(response.Data))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error for Item Master",
    }));
  }
}

function* Items_Group_GenratorFunction() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(apiCall.Items_Group_Get_API);
    yield put(getItemGroup_ForDropDownSuccess(response.Data));
    // yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* Submit_Items_GenratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(apiCall.Items_Master_Post_API, data);
    yield put(SpinnerState(false))
    yield put(PostItemDataSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Delete_Items_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(apiCall.Items_Master_Delete_API, id);
    yield put(SpinnerState(false))
    yield put(deleteItemIdSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Edit_Items_GenratorFunction({ id, pageMode }) {

  try {
    const response = yield call(apiCall.Items_Master_Edit_API, id);
    response.pageMode = pageMode
    yield put(editItemSuccess(response));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* Update_Items_GenratorFunction({ updateData, ID }) {

  try {
    yield put(SpinnerState(true))
    const response = yield call(apiCall.Items_Master_Update_API, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateItemSuccess(response))
    console.log("response", response)
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* BaseUnit_DropDown_GenratorFunction() {
  try {
    const response = yield call(apiCall.BaseUnit_Get_DropDown_API);
    yield put(getBaseUnit_ForDropDownSuccess(response.Data));
  } catch (error) {
    console.log("Category Type saga page error", error);
  }
}

function* CategoryType_DropDown_GenratorFunction() {
  try {
    const response = yield call(apiCall.CategoryType_Get_DropDown_API);
    yield put(get_CategoryTypes_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Category Type saga page error", error);
  }
}


// Category  API dependent on CategoryType api
function* Category_DropDown_GenratorFunction({ id, key }) {
  try {
    const response = yield call(apiCall.Category_By_CategoryTypes_DropDown_API, id);
    yield put(get_Category_By_CategoryType_ForDropDown_Success({ Data: response.Data, key: key }));
  } catch (error) {
    console.log("Category saga Page error", error);
  }
}

//Sub Category API dependent on Category api 
function* SubCategory_DropDown_GenratorFunction({ id, key }) {
  try {
    const response = yield call(apiCall.SubCategory_By_CategoryTypes_DropDown_API, id);
    yield put(get_Sub_Category_By_CategoryType_ForDropDown_Success({ Data: response.Data, key: key }));
  } catch (error) {
    console.log("Sub-Category saga page error", error);
  }
}

function* ImageType_DropDown_GenratorFunction() {
  
  try {
    const response = yield call(apiCall.ImageType_Get_DropDown_API);
    yield put(get_ImageType_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("ImageType saga page error", error);
  }
}

function* MRPType_DropDown_GenratorFunction() {
  try {
    const response = yield call(apiCall.MRPType_Get_DropDown_API);
    yield put(get_MRPTypes_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("MRP Type saga page error", error);
  }
}

function* Division_DropDown_GenratorFunction({ id = 1 }) {
  try {
    const response = yield call(apiCall.Division_Get_DropDown_API, id);
    yield put(get_Division_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Division saga page error", error);
  }
}

function* Party_DropDown_GenratorFunction({ id = 0 }) {
  try {
    const response = yield call(apiCall.Party_Get_DropDown_API, id);
    yield put(get_Party_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Party saga page error", error);
  }
}

function* PriceList_DropDown_GenratorFunction() {
  try {
    const response = yield call(apiCall.PriceList_Get_DropDown_API);
    yield put(get_PriceList_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("MRP Type saga page error", error);
  }
}

function* Group_DropDown_GenratorFunction({ id }) {
  try {
    const response = yield call(apiCall.Group_By_GroupTypes_DropDown_API, id);
    yield put(get_Group_By_GroupType_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Group saga page error", error);
  }
}

function* SubGroup_DropDown_GenratorFunction({ id }) {
  try {
    const response = yield call(apiCall.SubGroup_By_Group_DropDown_API, id);
    yield put(get_Sub_Group_By_Group_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("sub Group saga page error", error);
  }
}

// Category  API dependent on CategoryType api
function* Category_DropDown_API_GenratorFunction({ id }) {
  try {
    const response = yield call(apiCall.Category_By_CategoryTypes_DropDown_API, id);
    yield put(get_Category_By_CategoryType_ForDropDownAPI_Success(response.Data));
  } catch (error) {
    console.log("Category saga Page error", error);
  }
}

function* ItemsMastersSaga() {
  yield takeEvery(GET_ITEM_LIST_API, Get_Items_GenratorFunction);
  yield takeEvery(GET_ITEM_GROUP_FOR_DROPDOWN, Items_Group_GenratorFunction);
  yield takeEvery(POST_ITEM_DATA, Submit_Items_GenratorFunction);
  yield takeEvery(EDIT_ITEM_ID, Edit_Items_GenratorFunction);
  yield takeEvery(DELETE_ITEM_ID, Delete_Items_GenratorFunction);
  yield takeEvery(UPDATE_ITEM_ID, Update_Items_GenratorFunction);
  yield takeEvery(GET_CATEGORYTYPE_FOR_DROPDOWN, CategoryType_DropDown_GenratorFunction);
  yield takeEvery(GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN, Category_DropDown_GenratorFunction);
  yield takeEvery(GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN, SubCategory_DropDown_GenratorFunction);
  yield takeEvery(GET_BASEUNIT_FOR_DROPDOWN, BaseUnit_DropDown_GenratorFunction);
  yield takeEvery(GET_IMAGETYPE_FOR_DROPDOWN, ImageType_DropDown_GenratorFunction);
  yield takeEvery(GET_MRPTYPE_FOR_DROPDOWN, MRPType_DropDown_GenratorFunction);
  yield takeEvery(GET_DIVISION_FOR_DROPDOWN, Division_DropDown_GenratorFunction);
  yield takeEvery(GET_PARTY_FOR_DROPDOWN, Party_DropDown_GenratorFunction);
  yield takeEvery(GET_PRICE_LIST_FOR_DROPDOWN, PriceList_DropDown_GenratorFunction);
  yield takeEvery(GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN, Group_DropDown_GenratorFunction);
  yield takeEvery(GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN, SubGroup_DropDown_GenratorFunction);
  yield takeEvery(GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API, Category_DropDown_API_GenratorFunction);
}

export default ItemsMastersSaga;
