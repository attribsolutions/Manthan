import { call, put, takeEvery } from "redux-saga/effects";
import {
  saveVehicleMasterSuccess, getVehicleListSuccess,
  getVehicleType_for_dropdown_Success, deleteVehicleID_Success,
  editVehicleID_Success, updateVehicleID_Success, VehicleErrorAction
} from "./action";
import {
  Vehicle_Get_API,
  Vehicle_Post_API,
  VehicleTypes_Get_API_for_Dropdown,
  Vehicle_Delete_API,
  Vehicle_Edit_API,
  Vehicle_Update_API,
} from "../../../helpers/backend_helper";
import {
  SAVE_VEHICLE_MASTER,
  GET_VEHICLE_LIST,
  GET_VEHICLE_TYPES_FOR_DROPDOWN,
  DELETE_VEHICLE_ID,
  EDIT_VEHICLE_ID,
  UPDATE_VEHICLE_ID
} from "./actionType";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";

// const jsonBody = { "Party": loginPartyID(), "Company": loginCompanyID() }
// Get List Page API
function* Get_Vehicle_GenFun({ jsonBody }) {

  const filters = (jsonBody === undefined || null ? loginJsonBody() : jsonBody); // required only PartyID and CompanyID
  try {
    const response = yield call(Vehicle_Get_API, filters);
    yield put(getVehicleListSuccess(response.Data));
  } catch (error) { yield put(VehicleErrorAction()) }
}

// post api
function* Post_Vehicle_Master_GenFun({ config }) {
  try {
    const response = yield call(Vehicle_Post_API, config);
    yield put(saveVehicleMasterSuccess(response));
  } catch (error) { yield put(VehicleErrorAction()) }
}


// edit api
function* Edit_Vehicle_ID_GenFun({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(Vehicle_Edit_API, config);
    response.pageMode = btnmode
    yield put(editVehicleID_Success(response));
  } catch (error) { yield put(VehicleErrorAction()) }
}

// update api
function* Update_Vehicle_ID_GenFun({ config }) {
  try {
    const response = yield call(Vehicle_Update_API, config);
    yield put(updateVehicleID_Success(response))
  } catch (error) { yield put(VehicleErrorAction()) }
}

// delete api 
function* Delete_Vehicle_ID_GenFun({ config }) {
  try {
    const response = yield call(Vehicle_Delete_API, config);
    yield put(deleteVehicleID_Success(response))
  } catch (error) { yield put(VehicleErrorAction()) }
}

// get VehicleTypes Dropdown API
function* get_VehicleTypes_DropDown_GenFun() {
  const filters = loginJsonBody()
  try {
    const response = yield call(VehicleTypes_Get_API_for_Dropdown, filters);
    yield put(getVehicleType_for_dropdown_Success(response.Data));
  } catch (error) { yield put(VehicleErrorAction()) }
}

function* VehicleSaga() {
  yield takeEvery(GET_VEHICLE_LIST, Get_Vehicle_GenFun)
  yield takeEvery(SAVE_VEHICLE_MASTER, Post_Vehicle_Master_GenFun)
  yield takeEvery(EDIT_VEHICLE_ID, Edit_Vehicle_ID_GenFun)
  yield takeEvery(UPDATE_VEHICLE_ID, Update_Vehicle_ID_GenFun)
  yield takeEvery(DELETE_VEHICLE_ID, Delete_Vehicle_ID_GenFun)
  yield takeEvery(GET_VEHICLE_TYPES_FOR_DROPDOWN, get_VehicleTypes_DropDown_GenFun)
}

export default VehicleSaga;