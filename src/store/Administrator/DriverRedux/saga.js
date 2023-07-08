import { call, put, takeLatest } from "redux-saga/effects";
import { saveDriverMasterSuccess, getDriverListSuccess, deleteDriverID_Success, editDriverID_Success, updateDriverID_Success, DriverApiErrorAction } from "./action";
import {
    get_DriverList_API,
    Post_Driver_API,
    detelet_DriverType_List_Api,
    edit_DriverType_List_Api,
    update_DriverType_List_Api,
} from "../../../helpers/backend_helper";
import {
    SAVE_DRIVER_MASTER,
    GET_DRIVER_LIST,
    DELETE_DRIVER_TYPE_ID,
    EDIT_DRIVER_TYPE_ID,
    UPDATE_DRIVER_TYPE_ID
} from "./actionType";
import { date_dmy_func, loginJsonBody, } from "../../../components/Common/CommonFunction";

function* Get_Driver_GenFun({ jsonBody }) { // List API Using Post Method

    const filters = (jsonBody === undefined || null ? loginJsonBody() : jsonBody);// required only PartyID and CompanyID
    try {
        const response = yield call(get_DriverList_API, filters);
        const newList = yield response.Data.map((i) => {
            var date = date_dmy_func(i.DOB)
            i.DOB = (`${date}`)
            return i
        })
        yield put(getDriverListSuccess(newList));
    } catch (error) { yield put(DriverApiErrorAction()) }
}

function* save_DriverMaster_GenFun({ config }) { // post api
    try {
        const response = yield call(Post_Driver_API, config);
        yield put(saveDriverMasterSuccess(response));
    } catch (error) { yield put(DriverApiErrorAction()) }
}

function* Delete_Driver_ID_GenFun({ config }) { // delete api 
    try {
        const response = yield call(detelet_DriverType_List_Api, config);
        yield put(deleteDriverID_Success(response))
    } catch (error) { yield put(DriverApiErrorAction()) }
}

function* Edit_Driver_ID_GenFun({ config }) { // edit api
    const { btnmode } = config;
    try {
        const response = yield call(edit_DriverType_List_Api, config);
        response.pageMode = btnmode
        yield put(editDriverID_Success(response));
    } catch (error) { yield put(DriverApiErrorAction()) }
}

function* Update_DriverType_ID_GenFun({ config }) { // update api
    try {
        const response = yield call(update_DriverType_List_Api, config);
        yield put(updateDriverID_Success(response))
    } catch (error) { yield put(DriverApiErrorAction()) }
}

function* DriverSaga() {
    yield takeLatest(SAVE_DRIVER_MASTER, save_DriverMaster_GenFun)
    yield takeLatest(GET_DRIVER_LIST, Get_Driver_GenFun)
    yield takeLatest(EDIT_DRIVER_TYPE_ID, Edit_Driver_ID_GenFun)
    yield takeLatest(UPDATE_DRIVER_TYPE_ID, Update_DriverType_ID_GenFun)
    yield takeLatest(DELETE_DRIVER_TYPE_ID, Delete_Driver_ID_GenFun)
}

export default DriverSaga;