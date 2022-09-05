import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { PostMethod_ForVehicleMasterSuccess, getMethod_ForVehicleListSuccess,getMethod_DriverList_ForDropDown_Success, getMethod_VehicleTypes_ForDropDown_Success, deleteVehicleTypeIDSuccess, editVehicleTypeSuccess, updateVehicleTypeIDSuccess} from "./action";
import {
  get_Vehicle_API,
  Post_Vehicle_API,
  get_VehicleTypes_API,
  get_DriverListAPI,
  detelet_VehicleType_List_Api,
  edit_VehicleType_List_Api,
  update_VehicleType_List_Api,
} from "../../../helpers/backend_helper";

import { POST_METHOD_FOR_VEHICLE_MASTER,
  GET_METHOD_FOR_VEHICLE_LIST,
  GET_METHOD_DRIVERLIST_FOR_DROPDOWN,
  GET_METHOD_VEHICLETYPES_FOR_DROPDOWN,
  DELETE_VEHICLE_TYPE_ID,
  EDIT_VEHICLE_TYPE_ID,
  UPDATE_VEHICLE_TYPE_ID

} from "./actionType";
import { AlertState } from "../../actions";
import { PaginationListStandalone } from "react-bootstrap-table2-paginator";

// Get List Page API
function* Get_Vehicle_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_Vehicle_API);
    yield put(getMethod_ForVehicleListSuccess(response.Data));
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
    yield put(PostMethod_ForVehicleMasterSuccess(response));
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
    yield put(getMethod_VehicleTypes_ForDropDown_Success(response.Data));
    console.log("response", response)
  } catch (error) {
    console.log(" Vehicle API page error", error);
  }
}

// get DriverList Types Dropdown API
function* get_DriverList_DropDown_GenFun() {

  try {
    const response = yield call(get_DriverListAPI );
    yield put(getMethod_DriverList_ForDropDown_Success(response.Data));
    console.log("response", response)
  } catch (error) {
    console.log(" Vehicle API page error", error);
  }
}

// delete api 
function* Delete_VehicleType_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_VehicleType_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteVehicleTypeIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_VehicleType_ID_GenratorFunction({ id ,pageMode}) {
  try {
    const response = yield call(edit_VehicleType_List_Api, id);
    response.pageMode=pageMode
    yield put(editVehicleTypeSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_VehicleType_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_VehicleType_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateVehicleTypeIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}



function* VehicleSaga() {
  yield takeEvery(POST_METHOD_FOR_VEHICLE_MASTER, Post_Method_ForVehicle_GenFun)
  yield takeEvery(GET_METHOD_FOR_VEHICLE_LIST, Get_Vehicle_GenratorFunction)
  yield takeEvery(GET_METHOD_DRIVERLIST_FOR_DROPDOWN, get_DriverList_DropDown_GenFun)
  yield takeEvery(GET_METHOD_VEHICLETYPES_FOR_DROPDOWN, get_VehicleTypes_DropDown_GenFun)
  yield takeEvery(DELETE_VEHICLE_TYPE_ID, Delete_VehicleType_ID_GenratorFunction)
  yield takeEvery(EDIT_VEHICLE_TYPE_ID, Edit_VehicleType_ID_GenratorFunction)
  yield takeEvery(UPDATE_VEHICLE_TYPE_ID, Update_VehicleType_ID_GenratorFunction)
}

export default VehicleSaga;