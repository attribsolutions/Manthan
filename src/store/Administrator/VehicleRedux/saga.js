import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForVehicleMasterSuccess, getMethod_ForVehicleListSuccess, getMethod_DriverList_ForDropDown_Success, getMethod_VehicleTypes_ForDropDown_Success, deleteVehicleTypeIDSuccess, editVehicleTypeSuccess, updateVehicleTypeIDSuccess } from "./action";
import {
  get_Vehicle_API,
  Post_Vehicle_API,
  get_VehicleTypes_API,
  get_DriverListAPI,
  detelet_VehicleType_List_Api,
  edit_VehicleType_List_Api,
  update_VehicleType_List_Api,
} from "../../../helpers/backend_helper";
import {
  POST_METHOD_FOR_VEHICLE_MASTER,
  GET_METHOD_FOR_VEHICLE_LIST,
  GET_METHOD_DRIVERLIST_FOR_DROPDOWN,
  GET_METHOD_VEHICLETYPES_FOR_DROPDOWN,
  DELETE_VEHICLE_TYPE_ID,
  EDIT_VEHICLE_TYPE_ID,
  UPDATE_VEHICLE_TYPE_ID
} from "./actionType";
import { CommonConsole, loginCompanyID, loginPartyID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

const jsonBody = { "Party": loginPartyID(), "Company": loginCompanyID() }
// Get List Page API
function* Get_Vehicle_GenratorFunction() {

  try {
    const response = yield call(get_Vehicle_API, jsonBody);
    yield put(getMethod_ForVehicleListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// post api
function* Post_Method_ForVehicle_GenFun({ data }) {
  try {
    const response = yield call(Post_Vehicle_API, data);
    yield put(PostMethod_ForVehicleMasterSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get VehicleTypes Dropdown API
function* get_VehicleTypes_DropDown_GenFun() {
  try {
    const response = yield call(get_VehicleTypes_API, jsonBody);
    yield put(getMethod_VehicleTypes_ForDropDown_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_VehicleType_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_VehicleType_List_Api, id);
    yield put(deleteVehicleTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_VehicleType_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_VehicleType_List_Api, id);
    response.pageMode = pageMode
    yield put(editVehicleTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_VehicleType_ID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_VehicleType_List_Api, updateData, ID);
    yield put(updateVehicleTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* VehicleSaga() {
  yield takeEvery(POST_METHOD_FOR_VEHICLE_MASTER, Post_Method_ForVehicle_GenFun)
  yield takeEvery(GET_METHOD_FOR_VEHICLE_LIST, Get_Vehicle_GenratorFunction)
  yield takeEvery(GET_METHOD_VEHICLETYPES_FOR_DROPDOWN, get_VehicleTypes_DropDown_GenFun)
  yield takeEvery(DELETE_VEHICLE_TYPE_ID, Delete_VehicleType_ID_GenratorFunction)
  yield takeEvery(EDIT_VEHICLE_TYPE_ID, Edit_VehicleType_ID_GenratorFunction)
  yield takeEvery(UPDATE_VEHICLE_TYPE_ID, Update_VehicleType_ID_GenratorFunction)
}

export default VehicleSaga;