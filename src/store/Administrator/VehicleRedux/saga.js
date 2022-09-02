import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getMethod_ForDriverList_ForDropDown_Success, getMethod_ForVehicleTypes_ForDropDown_Success,getMethod_ForVehicleAPISuccess, PostMethod_ForVehicleAPISuccess } from "./action";
import {
  get_Vehicle_API,
  Post_Vehicle_API,
  get_VehicleTypes_API,
  get_DriverListAPI
} from "../../../helpers/backend_helper";

import { GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN, GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN,  GET_METHOD_HANDLER_FOR_VEHICLE_API, POST_METHOD_HANDLER_FOR_VEHICLE_API } from "./actionType";
import { AlertState } from "../../actions";

// Get List Page API
function* Get_Vehicle_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_Vehicle_API);
    yield put(getMethod_ForVehicleAPISuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}
// post api
function* Post_Method_ForVehicle_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_Vehicle_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForVehicleAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


// get VehicleTypes Dropdown API
function* get_VehicleTypes_DropDown_GenFun() {

  try {
    const response = yield call(get_VehicleTypes_API);
    yield put(getMethod_ForVehicleTypes_ForDropDown_Success(response.Data));
    console.log("response", response)
  } catch (error) {
    console.log(" Vehicle API page error", error);
  }
}

// get DriverList Types Dropdown API
function* get_DriverList_DropDown_GenFun() {

  try {
    const response = yield call(get_DriverListAPI );
    yield put(getMethod_ForDriverList_ForDropDown_Success(response.Data));
    console.log("response", response)
  } catch (error) {
    console.log(" Vehicle API page error", error);
  }
}


function* VehicleSaga() {
  yield takeEvery(POST_METHOD_HANDLER_FOR_VEHICLE_API, Post_Method_ForVehicle_GenFun)
  yield takeEvery(GET_METHOD_HANDLER_FOR_VEHICLE_API, Get_Vehicle_GenratorFunction)
  yield takeEvery(GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN, get_VehicleTypes_DropDown_GenFun)
  yield takeEvery(GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN, get_DriverList_DropDown_GenFun)

}

export default VehicleSaga;