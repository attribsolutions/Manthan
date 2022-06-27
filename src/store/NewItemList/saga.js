import { call, put, takeEvery } from "redux-saga/effects";
import { GetPosStockReportDataActionSuccess } from "./actions";
import {  GET_POS_STOCK_REPORT_DATA_ACTION} from "./actionType";
import {
  PosStockRepor_ApiCall,

} from "../../helpers/backend_helper";



function* PosStockReport_GneratorFunction({data}) {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(PosStockRepor_ApiCall(data)); 
    console.log("PosStockReport_GneratorFunction response",response)
   
// yield put(SpinnerState(false))
    // yield put(GetPosStockReportDataActionSuccess(response.data));
  } catch (error) {
    console.log("PosStockReport_GneratorFunction ERROR",error)
    // yield put(SpinnerState(false))
    // yield put(AlertState({ Type: 3, Status: true, Message: "Network error Message", RedirectPath: false, AfterResponseAction: false }));
  }
}
function* Pos_Stock_Report_Reducer_Saga1() {
  yield takeEvery(GET_POS_STOCK_REPORT_DATA_ACTION, PosStockReport_GneratorFunction)
 
}

export default Pos_Stock_Report_Reducer_Saga1;
