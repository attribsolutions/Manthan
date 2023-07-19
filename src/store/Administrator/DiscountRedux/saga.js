import { call, put, takeEvery } from "redux-saga/effects";
import { loginJsonBody } from "../../../components/Common/CommonFunction";
import {
  Discount_AddPage_Button_Api,
  Discount_Delete_Api,
  Discount_List_Api,
  Discount_Save_Api,
  Discount_Edit_Api,
  Discount_Update_Api
} from "../../../helpers/backend_helper";
import {
  deleteDiscountIDSuccess,
  editDiscountIDSuccess,
  getDiscountListSuccess,
  saveDiscountActionSuccess,
  updateDiscountIDSuccess,
  discountApiErrorAction
} from "./actions";
import {
  DELETE_DISCOUNT_ID,
  EDIT_DISCOUNT_ID,
  GET_DISCOUNT_LIST,
  GO_BUTTON_DISCOUNT_ACTION,
  SAVE_DISCOUNT_SUBMIT,
  UPDATE_DISCOUNT_ID,
} from "./actionType";

function* GoBtn_Discount_GenFunc() {
  try {
    const response = yield call(Discount_AddPage_Button_Api, loginJsonBody());
    yield put(getDiscountListSuccess(response.Data));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* Save_Method_ForDiscount_GenFun({ config }) {    
  try {
    const response = yield call(Discount_Save_Api, config);
    yield put(saveDiscountActionSuccess(response));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* Get_Discount_List_GenFunc() {                        
  try {
    const response = yield call(Discount_List_Api, loginJsonBody());
    yield put(getDiscountListSuccess(response.Data));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* deleteDiscount_ID({ config }) {                      
  try {
    const response = yield call(Discount_Delete_Api, config);
    yield put(deleteDiscountIDSuccess(response))
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* editDiscount_ID({ config }) {               
  const { btnmode } = config;
  try {
    const response = yield call(Discount_Edit_Api, config);
    response.pageMode = btnmode
    yield put(editDiscountIDSuccess(response));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* update_Discount({ config }) {            
  try {
    const response = yield call(  Discount_Update_Api, config);
    yield put(updateDiscountIDSuccess(response))
  } catch (error) { yield put(discountApiErrorAction()) }
}


function* DiscountSaga() {
  yield takeEvery(GO_BUTTON_DISCOUNT_ACTION, GoBtn_Discount_GenFunc);
  yield takeEvery(GET_DISCOUNT_LIST, Get_Discount_List_GenFunc);
  yield takeEvery(EDIT_DISCOUNT_ID, editDiscount_ID);
  yield takeEvery(SAVE_DISCOUNT_SUBMIT, Save_Method_ForDiscount_GenFun);
  yield takeEvery(DELETE_DISCOUNT_ID, deleteDiscount_ID);
  yield takeEvery(UPDATE_DISCOUNT_ID, update_Discount);

}

export default DiscountSaga;
