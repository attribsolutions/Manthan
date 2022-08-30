import { call, put, takeEvery } from "redux-saga/effects";
import { BaseUnit_Get_DropDown_API, CategoryType_Get_DropDown_API, Category_Get_DropDown_API, ImageType_Get_DropDown_API, Items_Group_Get_API, Items_Master_Delete_API, Items_Master_Edit_API, Items_Master_Get_API, Items_Master_Post_API, Items_Master_Update_API, MRPType_Get_DropDown_API, SubCategory_Get_DropDown_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteItemIdSuccess, editItemSuccess, getBaseUnit_ForDropDownSuccess, getItemGroup_ForDropDownSuccess, getItemListSuccess, get_CategoryTypes_ForDropDown_Success, get_Category_ForDropDown_Success, get_ImageType_ForDropDown_Success, get_MRPTypes_ForDropDown_Success, get_SubCategory_ForDropDown_Success, PostItemDataSuccess, updateItemSuccess } from "./action";
import { DELETE_ITEM_ID, EDIT_ITEM_ID, GET_BASEUNIT_FOR_DROPDOWN, GET_CATEGORYTYPE_FOR_DROPDOWN, GET_CATEGORY_FOR_DROPDOWN, GET_IMAGETYPE_FOR_DROPDOWN, GET_ITEM_GROUP_FOR_DROPDOWN, GET_ITEM_LIST_API, GET_MRPTYPE_FOR_DROPDOWN, GET_SUBCATEGORY_FOR_DROPDOWN, POST_ITEM_DATA, UPDATE_ITEM_ID } from "./actionType";


function* Get_Items_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Items_Master_Get_API);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) yield put(getItemListSuccess(response.Data))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Items_Group_GenratorFunction() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(Items_Group_Get_API);
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
    const response = yield call(Items_Master_Post_API, data);
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
    const response = yield call(Items_Master_Delete_API, id);
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

function* Edit_Items_GenratorFunction({ ID }) {
  try {
    const response = yield call(Items_Master_Edit_API, ID);
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
    const response = yield call(Items_Master_Update_API, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateItemSuccess(response))
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
    const response = yield call(BaseUnit_Get_DropDown_API);
    yield put(getBaseUnit_ForDropDownSuccess(response.Data));
  } catch (error) {
    console.log("Category Type saga page error", error);
  }
}

function* CategoryType_DropDown_GenratorFunction() {
  try {
    const response = yield call(CategoryType_Get_DropDown_API);
    yield put(get_CategoryTypes_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Category Type saga page error", error);
  }
}

function* Category_DropDown_GenratorFunction() {
  try {
    const response = yield call(Category_Get_DropDown_API);
    yield put(get_Category_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Category saga Page error", error);
  }
}

function* SubCategory_DropDown_GenratorFunction() {
  try {
    const response = yield call(SubCategory_Get_DropDown_API);
    yield put(get_SubCategory_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("Sub-Category saga page error", error);
  }
}

function* ImageType_DropDown_GenratorFunction() {
  try {
    const response = yield call(ImageType_Get_DropDown_API);
    yield put(get_ImageType_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("ImageType saga page error", error);
  }
}

function* MRPType_DropDown_GenratorFunction() {
  try {
    const response = yield call(MRPType_Get_DropDown_API);
    yield put(get_MRPTypes_ForDropDown_Success(response.Data));
  } catch (error) {
    console.log("MRP Type saga page error", error);
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
  yield takeEvery(GET_CATEGORY_FOR_DROPDOWN, Category_DropDown_GenratorFunction);
  yield takeEvery(GET_SUBCATEGORY_FOR_DROPDOWN, SubCategory_DropDown_GenratorFunction);
  yield takeEvery(GET_BASEUNIT_FOR_DROPDOWN, BaseUnit_DropDown_GenratorFunction);
  yield takeEvery(GET_IMAGETYPE_FOR_DROPDOWN, ImageType_DropDown_GenratorFunction);
  yield takeEvery(GET_MRPTYPE_FOR_DROPDOWN, MRPType_DropDown_GenratorFunction);

}

export default ItemsMastersSaga;
