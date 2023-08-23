import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_GENERIC_SALE_ACTION } from "./actionType";
import { GoButton_For_GenericSale_Success } from "./action";
import { GenericSale_GoBtn_API } from "../../../helpers/backend_helper";
import { CommonConsole, trailingZeros } from "../../../components/Common/CommonFunction";

function* GenericSaleReport_GenFunc({ config }) {

    try {
        const response = yield call(GenericSale_GoBtn_API, config);

        if (response.Data.length > 0) {
            const newResponse = response.Data.GenericSaleDetails.map((i) => {
                // Convert quantity values to floats and format to remove trailing zeros
                i["QtyInNo"] = trailingZeros(i.QtyInNo);
                i["QtyInKg"] = trailingZeros(i.QtyInKg);
                i["QtyInBox"] = trailingZeros(i.QtyInBox);

                return i;
            });
            response.Data["GenericSaleDetails"] = newResponse;
        }

        yield put(GoButton_For_GenericSale_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* GenericSaleReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_GENERIC_SALE_ACTION, GenericSaleReport_GenFunc)
}

export default GenericSaleReportSaga;