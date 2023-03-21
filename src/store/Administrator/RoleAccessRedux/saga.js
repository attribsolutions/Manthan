import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  RoleAccessAdd_AddPage_Button_Api,
  RoleAccessAdd_Delete_Api,
  RoleAccessAdd_RoleDropdown_Api,
  RoleAccessAdd_List_Api,
  RoleAccessAdd_GO_Button_Api,
  RoleAccessAdd_PageDropdown_Api, RoleAccessAdd_Save_Api, RoleAccessCopy_Save_Api,

} from "../../../helpers/backend_helper";
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  DELETE_ROLE_ACCESS_lIST,
  DELETE_ROLE_ACCESS_MASTER,
  GET_ROLEACCESS_LIST_PAGE,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  SAVE_COPY_ROLE_ACCESS_ACTION,
  SAVE_ROLE_ACCESS_ADD_ACTION,
} from "./actionType";
import {
  getRoleAccessListPageSuccess,
  GetRoleListForRoleAccessListPage_Success,
  saveRoleAccessAddActionSuccess,
  saveCopyRoleAccessActionSuccess,
  DeleteRoleAcessSuccess,
  setTableData_roleAccss_AddPageSuccess,
  PageDropdownForRoleAccessList_Success,
} from "./actions";
import { btnIsDissablefunc, CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";



function* GetRoleAccessListForRoleAccessList_GenFunc({ id1, id2 }) {
  try {
    const response = yield call(RoleAccessAdd_RoleDropdown_Api, id1, id2);
    yield put(GetRoleListForRoleAccessListPage_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* PageDropdownForRoleAccessList_GenFunc({ id1, id2 }) {
  try {
    const response = yield call(RoleAccessAdd_PageDropdown_Api, id1, id2);
    yield put(PageDropdownForRoleAccessList_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* GoButtonHandlerForRoleAccessList_GenFunc({ id1, id2, id3 }) {
  try {
    const response = yield call(RoleAccessAdd_GO_Button_Api, id1, id2, id3);
    const newArray = response.Data.map((i, k) => {
      i.id = k + 1;
      return i
    })
    yield put(setTableData_roleAccss_AddPageSuccess(newArray));
  } catch (error) { CommonConsole(error) }
}

function* AddPageHandlerForRoleAccessList_GenFunc({ id }) {
  debugger
  try {
    const response = yield call(RoleAccessAdd_AddPage_Button_Api, id);
    const getState = (state) => state.RoleAccessReducer.AddPageTableDataRedux;
    const tableList = yield select(getState);

    let preArray = [...response.Data, ...tableList]
    // tableList.unshift
    let newArray = preArray.map((i, k) => {
      i.id = k + 1;
      return i
    })
    yield put(setTableData_roleAccss_AddPageSuccess(newArray));
  } catch (error) { CommonConsole(error) }
}

function* saveRoleAccessAdd_GenFunc({ config }) {
  try {
    const response = yield call(RoleAccessAdd_Save_Api, config);
    yield put(saveRoleAccessAddActionSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* getList_RoleAccessList_GenFunc() { // get api 
  const JsonBody = loginJsonBody();
  try {
    const response = yield call(RoleAccessAdd_List_Api, JsonBody);
    const newResp = response.Data.map((i, k) => {
      i.id = k;
      return i
    })
    yield put(getRoleAccessListPageSuccess(newResp));
  } catch (error) { CommonConsole(error) }
}


function* Delete_RoleAccessList_GenFunc({ config }) {// delete Api
  try {
    const response = yield call(RoleAccessAdd_Delete_Api, config);
    yield put(DeleteRoleAcessSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* saveRoleAccessCopy_GenFun({ config }) {

  try {
    const response = yield call(RoleAccessCopy_Save_Api, config);
    yield put(saveCopyRoleAccessActionSuccess(response));

  } catch (error) { CommonConsole(error) }
}

function* deleteRoleAccessMaster_GenFun({ config }) {
  try {
    const { btnId, deleteId } = config;
    const getState = (state) => state.RoleAccessReducer.AddPageTableDataRedux;
    const tableList = yield select(getState);
    const newList = tableList.filter((index) => {
      return (!(index.id === deleteId))
    })
    yield put(setTableData_roleAccss_AddPageSuccess(newList));
    btnIsDissablefunc({ btnId, state: false })

  } catch (error) {
    const { btnId } = config;
    btnIsDissablefunc({ btnId, state: false })
    CommonConsole(error)
  }
}
function* isCheckRoleAccessMaster_GenFun({ id, cell, check }) {
  try {
    debugger
    const getState = (state) => state.RoleAccessReducer.AddPageTableDataRedux;
    const tableList = yield select(getState);
    const newList = tableList.map((index) => {

      if (index.id === id) { index[`${cell}`] = check ? 1 : 0 }
      return index
    })
    yield put(setTableData_roleAccss_AddPageSuccess(newList));

  } catch (error) {

    CommonConsole(error)
  }
}



function* RoleAccessSaga() {
  yield takeEvery(DELETE_ROLE_ACCESS_lIST, Delete_RoleAccessList_GenFunc);
  yield takeEvery(PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST, PageDropdownForRoleAccessList_GenFunc);
  yield takeEvery(GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE, GetRoleAccessListForRoleAccessList_GenFunc);
  yield takeEvery(GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, GoButtonHandlerForRoleAccessList_GenFunc);
  yield takeEvery(ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, AddPageHandlerForRoleAccessList_GenFunc);
  yield takeEvery(SAVE_ROLE_ACCESS_ADD_ACTION, saveRoleAccessAdd_GenFunc);
  yield takeEvery(SAVE_COPY_ROLE_ACCESS_ACTION, saveRoleAccessCopy_GenFun);
  yield takeEvery(GET_ROLEACCESS_LIST_PAGE, getList_RoleAccessList_GenFunc);
  yield takeEvery(DELETE_ROLE_ACCESS_MASTER, deleteRoleAccessMaster_GenFun);
  yield takeEvery("IS_CHECK_ROLE_ACCESS_MASTER", isCheckRoleAccessMaster_GenFun);


}

export default RoleAccessSaga;
