import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Material_Issue_Delete_API, Material_Issue_Get_API, Material_Issue_GoButton_Post_API, Material_Issue_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteMaterialIssueIdSuccess, getMaterialIssueListPageSuccess, postGoButtonForMaterialIssue_MasterSuccess, postMaterialIssueSuccess } from "./action";
import { DELETE_MATERIAL_ISSUE_LIST_PAGE, GET_MATERIAL_ISSUE_LIST_PAGE, POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, POST_MATERIAL_ISSUE } from "./actionType";

// GO Botton Post API
function* GoButton_MaterialIssue_masterPage_genfun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Material_Issue_GoButton_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postGoButtonForMaterialIssue_MasterSuccess(response.Data));

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message Go Button in Work Order ",
    }));
  }
}

//post api
function* save_Material_Issue_Genfun({ data }) {

  yield put(SpinnerState(true))
  try {

    const response = yield call(Material_Issue_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postMaterialIssueSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get Work Order List API Using post method
function* GoButton_MaterialIssue_listpage_GenFunc({ filters }) {

  yield put(SpinnerState(true))
  try {

    const response = yield call(Material_Issue_Get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.MaterialIssueDate)
      var time = convertTimefunc(i.CreatedOn)
      i.MaterialIssueDate = (`${date} ${time}`)
      return i
    })
    yield put(getMaterialIssueListPageSuccess(newList));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in Work Order List ",
    }));
  }
}


function* Delete_Metrialissue_listpage_GenFunc({ id }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(Material_Issue_Delete_API, id);
    yield put(SpinnerState(false))
    yield put(deleteMaterialIssueIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Merssage in Material issue delete Api "
    }));
  }
}

function* MaterialIssueSaga() {
  yield takeEvery(POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, GoButton_MaterialIssue_masterPage_genfun)
  yield takeEvery(POST_MATERIAL_ISSUE, save_Material_Issue_Genfun)
  yield takeEvery(GET_MATERIAL_ISSUE_LIST_PAGE, GoButton_MaterialIssue_listpage_GenFunc)
  yield takeEvery(DELETE_MATERIAL_ISSUE_LIST_PAGE, Delete_Metrialissue_listpage_GenFunc)


}

export default MaterialIssueSaga;