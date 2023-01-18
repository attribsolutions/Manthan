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
    debugger
    const response = yield call(Material_Issue_GoButton_Post_API, data);
    response.Data.forEach(i1 => {
      i1.BatchesData.forEach(i2 => {
        i2.Qty = '';
      });
    })

      var a = response.Data.map(i1 => {
      let count = Number(i1.Quantity)
      debugger
      i1.BatchesData = i1.BatchesData.map(i2 => {
        let qty = Number(i2.BaseUnitQuantity)
        debugger
        if ((count > qty) && !(count === 0)) {
          count = count - qty
          i2.Qty = qty.toFixed(3)
        } else if ((count <= qty) && (count > 0)) {
          i2.Qty = count.toFixed(3)
          count = 0
        }
        else {
          i2.Qty = 0;
        }
        return i2
      });
      count = 0
      return i1
    })

    debugger
    yield put(SpinnerState(false))
    yield put(postGoButtonForMaterialIssue_MasterSuccess(a));

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