import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Material_Issue_Delete_API, Material_Issue_Edit_API, Material_Issue_Get_API, Material_Issue_GoButton_Post_API, Material_Issue_Post_API } from "../../../helpers/backend_helper";
import { Data } from "../../../Reports/InvioceReport/DemoData";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteMaterialIssueIdSuccess, editMaterialIssueIdSuccess, getMaterialIssueListPageSuccess, goButtonForMaterialIssue_Master_ActionSuccess, postMaterialIssueSuccess } from "./action";
import { DELETE_MATERIAL_ISSUE_LIST_PAGE, EDIT_MATERIAL_ISSUE_LIST_PAGE, GET_MATERIAL_ISSUE_LIST_PAGE, POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, POST_MATERIAL_ISSUE } from "./actionType";

// GO Botton Post API
function* GoButton_MaterialIssue_masterPage_genfun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Material_Issue_GoButton_Post_API, data);
    response.Data.forEach(i1 => {
      i1.BatchesData.forEach(i2 => {
        i2.Qty = '';
      });
    });

    let convResp = []
    yield convResp = response.Data.map(i1 => {
      let count = Number(i1.Quantity)

      i1.BatchesData = i1.BatchesData.map(i2 => {

        let qty = Number(i2.BaseUnitQuantity)

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

    yield put(SpinnerState(false))
    console.log("gobtn", JSON.stringify(convResp))
    yield put(goButtonForMaterialIssue_Master_ActionSuccess(convResp));

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message Go Button in Work Order ",
    }));
  }
}


function* edit_Metrialissue_listpage_GenFunc({ id, pageMode }) {
  try {
    const response = yield call(Material_Issue_Edit_API, id);

    let obj = response.Data[0]
    response["pageMode"] = pageMode;
    let newArr = [];

    yield obj.MaterialIssueItems.forEach((i1) => {
      const b1 = {
        BatchDate: i1.BatchDate,
        BatchCode: i1.BatchCode,
        SystemBatchDate: i1.SystemBatchDate,
        SystemBatchCode: i1.SystemBatchCode,
        BaseUnitQuantity: 0,
        Qty: i1.IssueQuantity,
      };


      let found = newArr.find((i2) => {
        if (i1.Item === i2.Item) {
          i2.BatchesData.push(b1);
        }
        return (i1.Item === i2.Item)
      })

      if (found === undefined) {
        i1["BatchesData"] = [];
        i1.BatchesData.push(b1)
        // i1.Quantity = i1.WorkOrderQuantity

        newArr.push(i1)
      };

    });
    yield obj.MaterialIssueItems = newArr
    yield response.Data = obj;
    debugger
    yield put(editMaterialIssueIdSuccess(response));
    // console.log("editmaterial", JSON.stringify(response.Data))


  } catch (error) {
    // yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Merssage in Material Issue edit Api "
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
  yield takeEvery(EDIT_MATERIAL_ISSUE_LIST_PAGE, edit_Metrialissue_listpage_GenFunc)


}

export default MaterialIssueSaga;