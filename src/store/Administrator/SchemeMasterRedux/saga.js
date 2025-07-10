import { call, put, takeLatest } from "redux-saga/effects";
import {
  DeleteGiftVouchersBySchemeSuccess,
  SchemeApiErrorAction,
  Upload_Voucher_Success,
  deleteSchemelistSuccess,
  editSchemeIDSuccess,
  getSchemeListSuccess,
  saveSchemeMaster_Success,
  updateSchemeIDSuccess
} from "./action";
import {
  del_Scheme_List_API,
  del_Voucher_By_Scheme_API,
  edit_Scheme_List_Api,
  Get_Scheme_List,
  save_Scheme_API,
  update_Scheme_List_Api,
  Voucher_Upload_API
} from "../../../helpers/backend_helper";
import {
  DELETE_SCHEME_LIST_ID,
  DELETE_VOUCHERS_BY_SCHEME,
  EDIT_SCHEMEMASTER_ID,
  GET_SCHEME_LIST,
  SAVE_SCHEME_MASTER,
  UPDATE_SCHEMEMASTER_ID,
  UPLOAD_VOUCHER
} from "./actionType";
import { date_dmy_func, loginPartyTypeID } from "../../../components/Common/CommonFunction";
import SchemeMaster from "../../../pages/Adminisrator/SchemeMaster/SchemeTabForm";
function* Save_Method_ForSchemeMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_Scheme_API, config);
    yield put(saveSchemeMaster_Success(response));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Get_Scheme_List_GenFunc({ config }) {
  debugger
  const PartyTypeID = loginPartyTypeID()                                 // getList API
  try {
    const response = yield call(Get_Scheme_List, config); // config is optional
    const List = response.Data.map((item) => {
      return {
        ...item,
        PartyTypeID: PartyTypeID,
        isEditButtonDisabled: !item.IsSchemeActive,
        SchemePeriod: `${date_dmy_func(item?.FromPeriod)} - ${date_dmy_func(item?.ToPeriod)}`,
      }
    })

    yield put(getSchemeListSuccess(List));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Delete_SchemeList_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Scheme_List_API, config);
    yield put(deleteSchemelistSuccess(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Delete_Voucher_By_Scheme_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Voucher_By_Scheme_API, config);
    yield put(DeleteGiftVouchersBySchemeSuccess(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Edit_Schemelist_ID_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    debugger                  // edit API 
    const response = yield call(edit_Scheme_List_Api, config);
    response.pageMode = btnmode;
    yield put(editSchemeIDSuccess(response));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Update_Schemelist_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_Scheme_List_Api, config);
    yield put(updateSchemeIDSuccess(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}


function* Upload_Voucher_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(Voucher_Upload_API, config);
    yield put(Upload_Voucher_Success(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* SchemeSaga() {
  yield takeLatest(SAVE_SCHEME_MASTER, Save_Method_ForSchemeMaster_GenFun)
  yield takeLatest(GET_SCHEME_LIST, Get_Scheme_List_GenFunc)
  yield takeLatest(DELETE_SCHEME_LIST_ID, Delete_SchemeList_ID_GenFunc)
  yield takeLatest(EDIT_SCHEMEMASTER_ID, Edit_Schemelist_ID_GenFunc)
  yield takeLatest(UPDATE_SCHEMEMASTER_ID, Update_Schemelist_ID_GenFunc)
  yield takeLatest(UPLOAD_VOUCHER, Upload_Voucher_GenFunc)
  yield takeLatest(DELETE_VOUCHERS_BY_SCHEME, Delete_Voucher_By_Scheme_GenFunc)
}

export default SchemeSaga;