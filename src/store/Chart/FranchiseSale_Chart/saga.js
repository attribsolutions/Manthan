import { call, put, takeEvery } from "redux-saga/effects";
import { GetFranchiseSellDataSuccess } from "./actions";
import { GET_FRANCHISE_SALE_DATA} from "./actionType";
import {
   FranchiseSale_Chart_ApiCall,

} from "../../../helpers/backend_helper";



function* FranchiseSale_Chart_GneratorFunction({data}) {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(FranchiseSale_Chart_ApiCall(data)); 
    console.log("FranchiseSale_Chart_GneratorFunction",response)
   
// yield put(SpinnerState(false))
    // yield put(GetFranchiseSellDataSuccess(response.data));
  } catch (error) {
    console.log("FranchiseSale_Chart_GneratorFunction ERROR",error)
    // yield put(SpinnerState(false))
    // yield put(AlertState({ Type: 3, Status: true, Message: "Network error Message", RedirectPath: false, AfterResponseAction: false }));
  }
}
function* FranchiseSale_ChartSaga() {
  yield takeEvery(GET_FRANCHISE_SALE_DATA, FranchiseSale_Chart_GneratorFunction)
 
}

export default FranchiseSale_ChartSaga;
