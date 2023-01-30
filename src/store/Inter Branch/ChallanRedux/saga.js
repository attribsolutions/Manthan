import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Challan_List_API, Inward_Button_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getChallanListPageSuccess, InwardButtonIdSuccess } from "./action";
import { GET_CHALLAN_LIST_PAGE, INWARD_BUTTON_ID } from "./actionType";
import { Data } from "./fakedata";

// Inward List API
function* get_ChallanList_GenFunc({ filters }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Challan_List_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.IBChallanDate)
      i.IBChallanDate = (`${date}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(getChallanListPageSuccess(newList))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Challan List",
    }));
  }
}

// Inward Button Api
function* Inward_Button_GenratorFunction({ id, pageMode }) {
  debugger
  try {
    const response = Data
    yield put(InwardButtonIdSuccess(response));
    
    console.log("response in saga", response)
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* ChallanSaga() {
  yield takeEvery(GET_CHALLAN_LIST_PAGE, get_ChallanList_GenFunc)
  yield takeEvery(INWARD_BUTTON_ID, Inward_Button_GenratorFunction)

}

export default ChallanSaga;