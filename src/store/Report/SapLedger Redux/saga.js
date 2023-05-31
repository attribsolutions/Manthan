
import { call, put, takeEvery } from "redux-saga/effects";
import {
  SapLedger_Go_Button_API_Success, getExcel_Button_API_Success
} from "./action";
import {
 GetExcelButton, PartyLedger_API,
} from "../../../helpers/backend_helper";
import {
 GET_EXCELBUTTON_API, GO_BUTTON_API_SAP_LEDGER,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* goBtn_Get_API_GenFun({ filters }) {

  try {

    const response = yield call(PartyLedger_API, filters);

    let TotalDebitAmount = 0
    let TotalCreditAmount = 0

    const newresponse = yield response.data.map((i, key) => {
      i.id = key + 1
      if (i.DebitCredit === "S") {
        i.Debit_Amount = i.Amount
        TotalDebitAmount = Number(TotalDebitAmount) + Number(i.Debit_Amount)
      }
      if (i.DebitCredit === "H") {
        i.Credit_Amount = i.Amount
        TotalCreditAmount = Number(TotalCreditAmount) + Number(i.Credit_Amount)
      }

      return i

    })
    newresponse.push({
      id: response.length - 1,
      PostingDate: "Total",
      Credit_Amount: TotalCreditAmount,
      Debit_Amount: TotalDebitAmount
    })
    response.data = newresponse

    yield put(SapLedger_Go_Button_API_Success(response));

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