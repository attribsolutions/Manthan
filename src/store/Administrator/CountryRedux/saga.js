import { call, put, takeLatest } from "redux-saga/effects";
import {
    Country_Post_API,
    Country_get_API,
    Country_delete_API,
    Country_edit_API,
    Country_update_API,
} from "../../../helpers/backend_helper";
import {
    CountryApiError_Action,
    deleteCountry_ID_Success,
    editCountry_ID_Success,
    getCountryList_Success,
    saveCountryMaster_Success,
    updateCountry_ID_Success
} from "./action";
import {
    DELETE_COUNTRY_ID_ACTION,
    EDIT_COUNTRY_ID_ACTION,
    GET_COUNTRY_LIST_ACTION,
    SAVE_COUNTRY_MASTER_ACTION,
    UPDATE_COUNTRY_ID_ACTION
} from "./actionType";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

function* Get_Country_GenFun() { // List API Using Post Method

    try {
        const response = yield call(Country_get_API);
        yield put(getCountryList_Success(response.Data));
    } catch (error) { yield put(CountryApiError_Action()) }
}

function* save_CountryMaster_GenFun({ config }) { // post api
    try {
        const response = yield call(Country_Post_API, config);
        yield put(saveCountryMaster_Success(response));
    } catch (error) { yield put(CountryApiError_Action()) }
}

function* Delete_Country_ID_GenFun({ config }) { // delete api 
    const { deleteId } = config
    try {
        
        if (deleteId === 1) {
            customAlert({
                Type: 3,
                Message: "This Country is used in another table",
            })
            return
        }
        const response = yield call(Country_delete_API, config);
        yield put(deleteCountry_ID_Success(response))
    } catch (error) { yield put(CountryApiError_Action()) }
}

function* Edit_Country_ID_GenFun({ config }) { // edit api
    const { btnmode } = config;
    try {
        const response = yield call(Country_edit_API, config);
        response.pageMode = btnmode
        yield put(editCountry_ID_Success(response));
    } catch (error) { yield put(CountryApiError_Action()) }
}

function* Update_Country_ID_GenFun({ config }) { // update api
    try {
        const response = yield call(Country_update_API, config);
        yield put(updateCountry_ID_Success(response))
    } catch (error) { yield put(CountryApiError_Action()) }
}

function* CountrySaga() {
    yield takeLatest(SAVE_COUNTRY_MASTER_ACTION, save_CountryMaster_GenFun)
    yield takeLatest(GET_COUNTRY_LIST_ACTION, Get_Country_GenFun)
    yield takeLatest(EDIT_COUNTRY_ID_ACTION, Edit_Country_ID_GenFun)
    yield takeLatest(UPDATE_COUNTRY_ID_ACTION, Update_Country_ID_GenFun)
    yield takeLatest(DELETE_COUNTRY_ID_ACTION, Delete_Country_ID_GenFun)
}

export default CountrySaga;