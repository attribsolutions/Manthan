import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_GENERIC_SALE_ACTION } from "./actionType";
import { GoButton_For_GenericSale_Success } from "./action";
import { GenericSale_GoBtn_API } from "../../../helpers/backend_helper";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* GenericSaleReport_GenFunc({ config }) {

    try {
        const response = yield call(GenericSale_GoBtn_API, config);

        const newResponse = response.Data.GenericSaleDetails.map((i) => {
            // Convert quantity values to floats and format to remove trailing zeros
            i["QtyInNo"] = parseFloat(i.QtyInNo).toString();
            i["QtyInKg"] = parseFloat(i.QtyInKg).toString();
            i["QtyInBox"] = parseFloat(i.QtyInBox).toString();

            return i;
        });
        response.Data["GenericSaleDetails"] = newResponse;
        yield put(GoButton_For_GenericSale_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* GenericSaleReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_GENERIC_SALE_ACTION, GenericSaleReport_GenFunc)
}

export default GenericSaleReportSaga;