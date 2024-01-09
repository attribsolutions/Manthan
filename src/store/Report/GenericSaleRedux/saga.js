import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_GENERIC_SALE_ACTION } from "./actionType";
import { GoButton_For_GenericSale_Success } from "./action";
import { GenericSale_GoBtn_API } from "../../../helpers/backend_helper";
import { CommonConsole, date_dmy_func, trailingZeros } from "../../../components/Common/CommonFunction";

function* GenericSaleReport_GenFunc({ config }) {

    try {
        const response = yield call(GenericSale_GoBtn_API, config);

        const newResponse = response.Data.map((i) => {
            i["InvoiceDate"]=date_dmy_func(i.InvoiceDate);
            // Convert quantity values to floats and format to remove trailing zeros
            i["QtyInNo"] = trailingZeros(i.QtyInNo);
            i["QtyInKg"] = trailingZeros(i.QtyInKg);
            i["QtyInBox"] = trailingZeros(i.QtyInBox);
            // [{ value: 1, label: "Rs" }, { value: 2, label: "%" }]
            i.DiscountType = i.DiscountType === 1 ? "Rs" : "%"
            return i;
        });
        response.Data = newResponse;

        yield put(GoButton_For_GenericSale_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* GenericSaleReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_GENERIC_SALE_ACTION, GenericSaleReport_GenFunc)
}

export default GenericSaleReportSaga;