import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole, date_dmy_func, convertTimefunc } from "../../../components/Common/CommonFunction";
import { Material_Issue_Delete_API, Material_Issue_Edit_API, Material_Issue_Get_API, Material_Issue_GoButton_Post_API, Material_Issue_Post_API } from "../../../helpers/backend_helper";
import { deleteMaterialIssueIdSuccess, editMaterialIssueIdSuccess, getMaterialIssueListPageSuccess, goButtonForMaterialIssue_Master_ActionSuccess, SaveMaterialIssueSuccess } from "./action";
import { DELETE_MATERIAL_ISSUE_LIST_PAGE, EDIT_MATERIAL_ISSUE_LIST_PAGE, GET_MATERIAL_ISSUE_LIST_PAGE, POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, POST_MATERIAL_ISSUE } from "./actionType";


function* GoButton_MaterialIssue_masterPage_genfun({ data }) {                      // GO Botton Post API
  try {
    const { jsonBody } = data;
    const response = yield call(Material_Issue_GoButton_Post_API, jsonBody);
    response.Data.forEach(i1 => {
      i1.BatchesData.forEach(i2 => {
        i2.Qty = '';
      });
    });
    let convResp = []
    const resp1 = { ...response, ...convResp, ...data }
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
    yield put(goButtonForMaterialIssue_Master_ActionSuccess(resp1));
  } catch (error) { CommonConsole(error) }
}


function* edit_Metrialissue_listpage_GenFunc({ config }) {                              //Edit Material Issue API
  const { btnmode } = config;
  try {
    const response = yield call(Material_Issue_Edit_API, config);
    let obj = response.Data[0]
    response.pageMode = btnmode;
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
    yield put(editMaterialIssueIdSuccess(response));
    // console.log("editmaterial", JSON.stringify(response.Data))
  } catch (error) { CommonConsole(error) }
}

function* save_Material_Issue_Genfun({ config }) {                                            //Save Button API
  try {
    const response = yield call(Material_Issue_Post_API, config);
    yield put(SaveMaterialIssueSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* GoButton_MaterialIssue_listpage_GenFunc({ filters }) {                           // get Work Order List API Using post method
  try {
    const response = yield call(Material_Issue_Get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = date_dmy_func(i.MaterialIssueDate)
      var time = convertTimefunc(i.CreatedOn)
      i.MaterialIssueDate = (`${date} ${time}`)
      return i
    })
    yield put(getMaterialIssueListPageSuccess(newList));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Metrialissue_listpage_GenFunc({ config }) {                                   //Delete Material issue 
  try {
    const response = yield call(Material_Issue_Delete_API, config);
    yield put(deleteMaterialIssueIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* MaterialIssueSaga() {
  yield takeLatest(POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, GoButton_MaterialIssue_masterPage_genfun)
  yield takeLatest(POST_MATERIAL_ISSUE, save_Material_Issue_Genfun)
  yield takeLatest(GET_MATERIAL_ISSUE_LIST_PAGE, GoButton_MaterialIssue_listpage_GenFunc)
  yield takeLatest(DELETE_MATERIAL_ISSUE_LIST_PAGE, Delete_Metrialissue_listpage_GenFunc)
  yield takeLatest(EDIT_MATERIAL_ISSUE_LIST_PAGE, edit_Metrialissue_listpage_GenFunc)
}

export default MaterialIssueSaga;