import { call, put, takeLatest } from "redux-saga/effects";
import {
    CityApiErrorAction,
    getCitylistSuccess,
    saveCityMaster_Success,
} from "./action";
import {
    Post_City_Master_API, get_City_List_Api,
} from "../../../helpers/backend_helper";
import {
    GET_CITY_LIST,
    SAVE_CITY_MASTER,
} from "./actionType";

function* Save_Method_ForCityMaster_GenFun({ config }) {             // Save API

    try {

        const response = yield call(Post_City_Master_API, config);

        yield put(saveCityMaster_Success(response));
    } catch (error) { yield put(CityApiErrorAction()) }
}


function* Get_City_List_GenratorFunction() {                        // getList API
    try {
        const response = yield call(get_City_List_Api);
        yield put(getCitylistSuccess(response.Data));
    } catch (error) { yield put(CityApiErrorAction()) }

}



function* CitySaga() {
    yield takeLatest(SAVE_CITY_MASTER, Save_Method_ForCityMaster_GenFun)
    yield takeLatest(GET_CITY_LIST, Get_City_List_GenratorFunction)


}

export default CitySaga;