import { call, put, takeLatest } from "redux-saga/effects";
import {
	LedgerApiErrorAction,
	SapLedger_Go_Button_API_Success, ProductMargin_Go_Btn_Success
} from "./action";
import { Get_Product_Margin_Report, PartyLedger_API, } from "../../../helpers/backend_helper";
import { PRODUCTMARGIN_GO_BTN_ACTION, GO_BUTTON_API_SAP_LEDGER, } from "./actionType";
import SERVER_HOST_PATH from "../../../helpers/_serverPath";

function* SapLedger_GoBtn_GenFuc({ filters }) {

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

function* ProductMarginGoBtn_GenFuc({ config }) {

	try {
		const response = yield call(Get_Product_Margin_Report, config);

		let newArray = []
		if (response.StatusCode === 200) {

			response.Data.forEach(i => {
				let obj = i;

				// Merge ItemMargins and ItemImage properties into the main object
				["ItemMargins", "ItemImage"].forEach(prop => {

					i[prop].forEach(ele => {
						const keys = Object.keys(ele);
						keys.forEach(key => {

							let imageColumns = ["Side2View", "TopView", "Side1View", "BackView", "BarCode", "Poster", "FrontView", "Nutrition"];
							let isImageColumn = imageColumns.includes(key);
							if (isImageColumn) {

								obj[key] = `${ele[key] === " " || ele[key] === "" ? "" : `${SERVER_HOST_PATH}/media/${ele[key]}`}`;
							} else {
								obj[key] = ele[key];
							}
						});
					});
					// Remove the property from the object
					delete obj[prop];
				});

				// Remove specified keys from the object
				["ProductID", "SubProductID"].forEach(key => {
					delete obj[key];
				});

				// Delete PriceListID and keys matching the pattern "BaseUnitRateWithOutGST"
				delete obj.PriceListID;
				Object.keys(obj).forEach(key => {
					if (key.match(/BaseUnitRateWithOutGST/i)) {
						delete obj[key];
					}
				});

				// Add the modified object to newArray
				newArray.push(obj);
			});
		}

		yield put(ProductMargin_Go_Btn_Success(newArray));

	} catch (error) {
		yield put(ProductMargin_Go_Btn_Success([]));
		LedgerApiErrorAction()
	}
}

function* SapLedgerSaga() {
	yield takeLatest(GO_BUTTON_API_SAP_LEDGER, SapLedger_GoBtn_GenFuc)
	yield takeLatest(PRODUCTMARGIN_GO_BTN_ACTION, ProductMarginGoBtn_GenFuc)
}

export default SapLedgerSaga;
