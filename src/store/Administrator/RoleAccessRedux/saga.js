import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import {
  RoleAccessAdd_AddPage_Button_Api,
  RoleAccessAdd_Delete_Api,
  RoleAccessAdd_RoleDropdown_Api,
  RoleAccessAdd_List_Api,
  RoleAccessAdd_GO_Button_Api,
  RoleAccessAdd_PageDropdown_Api,
  RoleAccessAdd_Save_Api,
  RoleAccessCopy_Save_Api,

} from "../../../helpers/backend_helper";
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  DELETE_ROLE_ACCESS_lIST,
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
  RoleAccessApiErrorAction,
} from "./actions";
import { btnIsDissablefunc, CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";



function* GetRoleAccessListForRoleAccessList_GenFunc({ id1, id2 }) {
  try {
    const response = yield call(RoleAccessAdd_RoleDropdown_Api, id1, id2);
    yield put(GetRoleListForRoleAccessListPage_Success(response.Data));
  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}


function* PageDropdownForRoleAccessList_GenFunc({ id1, id2 }) {
  try {

    const response = yield call(RoleAccessAdd_PageDropdown_Api, id1, id2);
    yield put(PageDropdownForRoleAccessList_Success(response.Data));
  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}

function* GoButtonHandlerForRoleAccessList_GenFunc({ id1, id2, id3 }) {

  try {

    const response = yield call(RoleAccessAdd_GO_Button_Api, id1, id2, id3);

    const newArray = response.Data.map((i, k) => {
      const { defaultSelectedValues, dynamicOptions } = defaultSelectOption(i);
      i["defaultSelectedValues"] = defaultSelectedValues;
      i["dynamicOptions"] = dynamicOptions;
      return i
    })
    yield put(setTableData_roleAccss_AddPageSuccess(newArray));
  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}

function* AddPageHandlerForRoleAccessList_GenFunc({ id }) {

  try {
    const response = yield call(RoleAccessAdd_AddPage_Button_Api, id);
    const getState = (state) => state.RoleAccessReducer.AddPageTableDataRedux;
    const tableList = yield select(getState);

    response.Data.forEach(i => {
      const { defaultSelectedValues, dynamicOptions } = defaultSelectOption(i);
      i["defaultSelectedValues"] = defaultSelectedValues;
      i["dynamicOptions"] = dynamicOptions;
    });

    let preArray = [...response.Data, ...tableList]
    
    yield put(setTableData_roleAccss_AddPageSuccess(preArray));
  } catch (error) {

    yield put(RoleAccessApiErrorAction());
  }
}

function* saveRoleAccessAdd_GenFunc({ config }) {
  try {
    const response = yield call(RoleAccessAdd_Save_Api, config);
    yield put(saveRoleAccessAddActionSuccess(response));
  } catch (error) { yield put(RoleAccessApiErrorAction()); }
}

function* getList_RoleAccessList_GenFunc() { // get api 
  const JsonBody = JSON.stringify(loginJsonBody());
  try {
    const response = yield call(RoleAccessAdd_List_Api, JsonBody);
    const newResp = response.Data.map((i, k) => {
      i.id = k+1;
      return i
    })
    yield put(getRoleAccessListPageSuccess(newResp));
  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}


function* Delete_RoleAccessList_GenFunc({ config }) {// delete Api
  try {
    const response = yield call(RoleAccessAdd_Delete_Api, config);
    yield put(DeleteRoleAcessSuccess(response));
  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}


function* saveRoleAccessCopy_GenFun({ config }) {

  try {
    const response = yield call(RoleAccessCopy_Save_Api, config);
    yield put(saveCopyRoleAccessActionSuccess(response));

  } catch (error) {
    yield put(RoleAccessApiErrorAction());
    CommonConsole(error);
  }
}





export default function* RoleAccessSaga() {
  yield takeLatest(DELETE_ROLE_ACCESS_lIST, Delete_RoleAccessList_GenFunc);
  yield takeLatest(PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST, PageDropdownForRoleAccessList_GenFunc);
  yield takeLatest(GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE, GetRoleAccessListForRoleAccessList_GenFunc);
  yield takeLatest(GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, GoButtonHandlerForRoleAccessList_GenFunc);
  yield takeEvery(ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, AddPageHandlerForRoleAccessList_GenFunc);
  yield takeLatest(SAVE_ROLE_ACCESS_ADD_ACTION, saveRoleAccessAdd_GenFunc);
  yield takeLatest(SAVE_COPY_ROLE_ACCESS_ACTION, saveRoleAccessCopy_GenFun);
  yield takeLatest(GET_ROLEACCESS_LIST_PAGE, getList_RoleAccessList_GenFunc);



}



const defaultSelectOption = (item) => {

  const dynamicOptions = [];
  const defaultSelectedValues = []

  Object.keys(item).forEach(key => {

    /************************************************************* */
    if ((key === "PageAccess_IsShowOnMenu")) {

      if (item.PageType === 2) {
        // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
        dynamicOptions.push(
          { value: -2, label: "Add Page ShowOnMenu", id: item[key], icon: <i className="fas fa-plus"></i> },
          { value: -1, label: "List Page ShowOnMenu", id: item[key], icon: <i className="fas fa-list"></i> }
        )

      } else {
        // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
        dynamicOptions.push({ value: -3, label: "Page ShowOnMenu", id: item[key], icon: <i className="fas fa-list"></i> });
      }
    }
    else if ((key.startsWith('PageAccess_') && (item[key] > 0))) {
      const label = key.replace('PageAccess_', ''); // Remove the prefix
      dynamicOptions.push({
        value: item[key],
        label: label,
        icon: <i className={`fas fa-${label.toLowerCase()}`}></i>,
      });
    }

    /************************************************************* */
    if (((key === "RoleAccess_IsShowOnMenuForList") && (item[key] > 0))) {
      // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
      if ((item.PageType === 3)) {
        defaultSelectedValues.push({ value: -3, label: "Page ShowOnMenu", id: item[key], icon: <i className="fas fa-list"></i> });
      } else {
        // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
        defaultSelectedValues.push(
          { value: -1, label: "List Page ShowOnMenu", id: item[key], icon: <i className="fas fa-list"></i> }
        )
      }
    }
    else if (((key === "RoleAccess_IsShowOnMenuForMaster") && (item[key] > 0) && (item.PageType === 2))) {
      // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
      defaultSelectedValues.push(
        { value: -2, label: "Add Page ShowOnMenu", id: item[key], icon: <i className="fas fa-plus"></i> },
      )
    }

    else if (
      key.startsWith('RoleAccess_')
      && (item[key] > 0)
      && !(key === "RoleAccess_IsShowOnMenu")
      && !(key === "RoleAccess_IsShowOnMenuForList")
      && !(key === "RoleAccess_IsShowOnMenuForMaster")
    ) {

      const label = key.replace('RoleAccess_', ''); // Remove the prefix
      defaultSelectedValues.push({
        value: item[key],
        label: label,
      });
    }
    /************************************************************* */
  });
  defaultSelectedValues.sort((a, b) => a.value - b.value);
  dynamicOptions.sort((a, b) => a.value - b.value);

  return { defaultSelectedValues, dynamicOptions }

}
