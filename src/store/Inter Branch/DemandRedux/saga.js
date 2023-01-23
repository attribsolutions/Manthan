import { call, delay, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc, GoBtnDissable, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    DemandList_get_Filter_API,
    DemandPage_Delete_API,
    DemandPage_Edit_API,
    DemandPage_GoButton_API,
    DemandPage_Post_API,
    DemandPage_Update_API,
    Division,
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    postGoButtonForDemandSuccess,
    postDemandSuccess,
    postDivisionSuccess,
    editDemandIdSuccess,
    deleteDemandIdSuccess,
    updateDemandIdSuccess,
    postDemandListPageSuccess,

} from "./action";
import {
    POST_GO_BUTTON_FOR_DEMAND,
    POST_DEMAND,
    POST_DEMAND_LIST_PAGE,
    UPDATE_DEMAND_ID_FROM_DEMAND_PAGE,
    EDIT_DEMAND_FOR_DEMAND_PAGE,
    DELETE_DEMAND_FOR_DEMAND_PAGE,
    POST_DIVISION,
} from "./actionType";


// GO Botton Post API
function* GoButton_Demand_genfun({ data }) {

  yield GoBtnDissable(true)
  yield delay(400)
  try {
    const response = yield call(DemandPage_GoButton_API, data);
    yield response.Data.DemandItems.forEach((ele, k) => {
      ele["id"] = k + 1
    });
    yield put(postGoButtonForDemandSuccess(response.Data));
    yield GoBtnDissable(false)
  } catch (error) {
    yield GoBtnDissable(false)
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Go Button-Demand Page",
    }));
  }
};

//post api
function* Post_Demand_Genfun({ data }) {
  
    yield put(SpinnerState(true))
    try {
      debugger
        const response = yield call(DemandPage_Post_API,data);
        yield put(SpinnerState(false))
        yield put(postDemandSuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

//division  api
function* post_Division_Genfun({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(Division, data);
        yield put(SpinnerState(false))
      yield put(postDivisionSuccess(response.Data));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}


function* editDemandGenFunc({ jsonBody, pageMode }) {

    yield put(SpinnerState(true))
    try {
      const response = yield call(DemandPage_Edit_API, jsonBody);
      response.pageMode = pageMode
      yield put(SpinnerState(false))
      yield put(editDemandIdSuccess(response));
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Edit Order",
      }));
    }
  }
  
  function* DeleteDemand_GenFunc({ id }) {
    yield put(SpinnerState(true))
    try {
      const response = yield call(DemandPage_Delete_API, id);
      yield put(SpinnerState(false))
      yield put(deleteDemandIdSuccess(response));
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error DeleteOrder",
      }));
    }
  }
  
  function* UpdateDemand_ID_GenFunc({ data, id }) {
  
    try {
      yield saveDissable(true)
      const response = yield call(DemandPage_Update_API, data, id);
      yield put(updateDemandIdSuccess(response))
      yield saveDissable(false)
    }
    catch (error) {
      yield saveDissable(false)
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error UpdateOrder",
      }));
    }
  }
  
  // List Page API
  function* Post_OrderList_GenFunc({ filters }) {
    yield GoBtnDissable(true)
    // yield delay(400)
    try {
      const response = yield call(DemandList_get_Filter_API, filters);
      const newList = yield response.Data.map((i) => {
        var date = convertDatefunc(i.OrderDate)
        var time = convertTimefunc(i.CreatedOn)
        var DeliveryDate = convertDatefunc(i.DeliveryDate);
        i["preOrderDate"] = i.OrderDate
        i.OrderDate = (`${date} ${time}`)
        i.DeliveryDate = (`${DeliveryDate}`)
        i.Inward === 0 ? i.Inward = "Open" : i.Inward = "Close";
        return i
      })
      yield put(postDemandListPageSuccess(newList))
      yield GoBtnDissable(false)
  
    } catch (error) {
      yield GoBtnDissable(false)
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error  Get DemandList",
      }));
    }
  }

function* DemandSaga() {
    yield takeEvery(POST_GO_BUTTON_FOR_DEMAND, GoButton_Demand_genfun)
    yield takeEvery(POST_DEMAND, Post_Demand_Genfun)
    yield takeEvery(POST_DIVISION, post_Division_Genfun)
    yield takeEvery(EDIT_DEMAND_FOR_DEMAND_PAGE, editDemandGenFunc)
    yield takeEvery(DELETE_DEMAND_FOR_DEMAND_PAGE, DeleteDemand_GenFunc)
    yield takeEvery(POST_DEMAND_LIST_PAGE, Post_OrderList_GenFunc)
    yield takeEvery(UPDATE_DEMAND_ID_FROM_DEMAND_PAGE, UpdateDemand_ID_GenFunc)
}

export default DemandSaga;