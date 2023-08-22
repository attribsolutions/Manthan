import { call, put, takeLatest } from "redux-saga/effects";
import {
  LedgerApiErrorAction,
  SapLedger_Go_Button_API_Success, getExcel_Button_API_Success
} from "./action";
import {
  Get_Product_Margin_Report, PartyLedger_API,
} from "../../../helpers/backend_helper";
import {
  GET_EXCELBUTTON_API, GO_BUTTON_API_SAP_LEDGER,
} from "./actionType";

import * as XLSX from 'xlsx';

function* goBtn_Get_API_GenFun({ filters }) {

  try {

    const response = yield call(PartyLedger_API, filters);
    let TotalDebitAmount = 0
    let TotalCreditAmount = 0
    let NewResponse

    if (response.Data.status_code === 200) {
      const newresponse = yield response.Data.data.map((i, key) => {

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
        Credit_Amount: TotalCreditAmount.toFixed(2),
        Debit_Amount: TotalDebitAmount.toFixed(2)
      })

      NewResponse = {
        Status: true,
        StatusCode: 200,
        count: response.Data.count,
        OpeingBal: response.Data.OpeingBal,
        ClosingBal: response.Data.ClosingBal,
        tableData: newresponse
      };
    }
    else {

      NewResponse = {
        Status: true,
        StatusCode: 204,
        tableData: []
      };
    }

    yield put(SapLedger_Go_Button_API_Success(NewResponse));

  } catch (error) { yield put(LedgerApiErrorAction()) }
}

function* GetExcelButton_saga({ IsSCM_ID, PartyID }) {

  try {

    const response = yield call(Get_Product_Margin_Report, IsSCM_ID, PartyID);

    if (response.StatusCode === 200) {

      let newArray = []

      response.Data.forEach(i => {
        let obj = i
        i.ItemMargins.forEach(ele => {
          const keys = Object.keys(ele);
          keys.forEach(key => {
            obj[key] = ele[key]
          })
        })
        delete obj.ItemMargins
        newArray.push(obj)
      })

      const worksheet = XLSX.utils.json_to_sheet(newArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ProductMargin1");
      XLSX.writeFile(workbook, "Product Margin Report.xlsx");
    }
    yield put(getExcel_Button_API_Success([]));
  } catch (error) {
    yield put(getExcel_Button_API_Success([]));
    LedgerApiErrorAction()
  }
}


function* SapLedgerSaga() {
  yield takeLatest(GO_BUTTON_API_SAP_LEDGER, goBtn_Get_API_GenFun)
  yield takeLatest(GET_EXCELBUTTON_API, GetExcelButton_saga)
}

export default SapLedgerSaga;