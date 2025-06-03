import { deleteSchemeIDSuccess, deleteSchemeTypeIDSuccess, editSchemeIDSuccess, editSchemeTypeIDSuccess, getSchemelistSuccess, getSchemeTypelistSuccess, saveSchemeSuccess, saveSchemeTypeSuccess, SchemeErrorAction, SchemeTypeErrorAction, updateSchemeIDSuccess, updateSchemeTypeIDSuccess, ValideSchemeIDSuccess } from "./action";

import { call, put, takeLatest } from "redux-saga/effects";
import { DELETE_SCHEME_TYPE_ID, EDIT_SCHEME_TYPE_ID, GET_SCHEME_TYPE_LIST, SAVE_SCHEME_TYPE_MASTER, UPDATE_SCHEME_TYPE_ID } from "./actionType";
import { get_Scheme_Type_API, Scheme_Type__Delete_API, Scheme_Type_API, Scheme_Type_Edit_API, Scheme_Type_Post_API, Scheme_Type_Update_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";





function* save_Scheme_Type_GenFun({ config }) {                      // Save API
    try {

        const response = yield call(Scheme_Type_Post_API, config);

        yield put(saveSchemeTypeSuccess(response));
    } catch (error) { yield put(SchemeTypeErrorAction()) }
}


function* Get_Scheme_Type_List_GenrFun() {            // getList API
  
    try {
        const response = yield call(get_Scheme_Type_API);
        yield put(getSchemeTypelistSuccess(response.Data));
    } catch (error) { yield put(SchemeTypeErrorAction()) }
}


function* Edit_Scheme_Type_ID_GenFun({ config }) {                     // edit API
    const { btnmode } = config;
    try {
        const response = yield call(Scheme_Type_Edit_API, config);
        response.pageMode = btnmode;
        yield put(editSchemeTypeIDSuccess(response));
    } catch (error) { yield put(SchemeTypeErrorAction()) }
}


function* Update_Scheme_Type_ID_GenFun({ config }) {
    // update API
    try {
        const response = yield call(Scheme_Type_Update_API, config);
        yield put(updateSchemeTypeIDSuccess(response))
    } catch (error) { yield put(SchemeTypeErrorAction()) }
}

  
function* Delete_Scheme_Type_ID_GenFun({ config }) { 
          // delete API
    try {
        const response = yield call(Scheme_Type__Delete_API, config);
        yield put(deleteSchemeTypeIDSuccess(response))
    } catch (error) { yield put(SchemeTypeErrorAction()) }
}    

function* SchemeTypeSaga() {

    yield takeLatest(SAVE_SCHEME_TYPE_MASTER, save_Scheme_Type_GenFun)
    yield takeLatest(GET_SCHEME_TYPE_LIST, Get_Scheme_Type_List_GenrFun)
    yield takeLatest(EDIT_SCHEME_TYPE_ID, Edit_Scheme_Type_ID_GenFun)
    yield takeLatest(UPDATE_SCHEME_TYPE_ID, Update_Scheme_Type_ID_GenFun)
    yield takeLatest(DELETE_SCHEME_TYPE_ID, Delete_Scheme_Type_ID_GenFun)

}

export default SchemeTypeSaga;