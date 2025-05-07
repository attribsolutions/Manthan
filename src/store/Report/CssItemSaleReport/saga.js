import { call, put, takeLatest } from "redux-saga/effects";
import { CSS_ITEM_SALE_GO_BUTTON_ACTION, CX_DD_DIFFRENCE_GO_BUTTON_ACTION } from "./actionType";
import { amountCommaSeparateFunc, roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import { Css_Item_Sale_Gobtn_ReportApiErrorAction, Css_Item_Sale_Gobtn_Success, Cx_DD_Diffrence_Gobtn_Success, Cx_DD_Diffrence_ReportApiErrorAction, } from "./action";
import { Css_Item_Sale_Report_GoButton_API, Cx_DD_Diffrence_Report_GoButton_API } from "../../../helpers/backend_helper"

function* Css_Item_sale_Report_GenFunc({ config }) {

    try {
        let response = yield call(Css_Item_Sale_Report_GoButton_API, config);

        response["Type"] = config.btnId

        yield put(Css_Item_Sale_Gobtn_Success(response))
    } catch (error) { yield put(Css_Item_Sale_Gobtn_ReportApiErrorAction()) }
}

function* Css_Item_Sale_ReportSaga() {
    yield takeLatest(CSS_ITEM_SALE_GO_BUTTON_ACTION, Css_Item_sale_Report_GenFunc)
}

export default Css_Item_Sale_ReportSaga;
