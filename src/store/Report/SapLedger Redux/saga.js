import { call, put, takeEvery } from "redux-saga/effects";
import {
  ChangePassword_Succes,SapLedger_Go_Button_API,SapLedger_Go_Button_API_Success,s, getExcel_Button_API_Success
} from "./action";
import {
  ChangePassword_API, GetExcelButton, PartyLedger_API,
} from "../../../helpers/backend_helper";
import {
  CHANGE_PASSWORD, GET_EXCELBUTTON_API, GO_BUTTON_API_SAP_LEDGER,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* goBtn_Get_API_GenFun( { filters } ) {

  try {
    debugger
      const response = yield call(PartyLedger_API, filters);
      debugger
      // response.Data.map((index) => {
      //     index["selectCheck"] = false
      //     return index
      // });

      yield put(SapLedger_Go_Button_API_Success(response.Data  ));
  } catch (error) { CommonConsole(error) }
}

function* GetExcelButton_saga() {
  try {
    const response = yield call(GetExcelButton);
    yield put(getExcel_Button_API_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* SapLedgerSaga() {
  yield takeEvery(GO_BUTTON_API_SAP_LEDGER, goBtn_Get_API_GenFun)
  yield takeEvery(GET_EXCELBUTTON_API, GetExcelButton_saga)
}

export default SapLedgerSaga;