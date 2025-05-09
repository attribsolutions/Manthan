import { call, put, takeLatest } from "redux-saga/effects";
import { CSS_ITEM_SALE_GO_BUTTON_ACTION, CX_DD_DIFFRENCE_GO_BUTTON_ACTION } from "./actionType";
import { amountCommaSeparateFunc, roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import { Css_Item_Sale_Gobtn_ReportApiErrorAction, Css_Item_Sale_Gobtn_Success, Cx_DD_Diffrence_Gobtn_Success, Cx_DD_Diffrence_ReportApiErrorAction, } from "./action";
import { Css_Item_Sale_Report_GoButton_API, Cx_DD_Diffrence_Report_GoButton_API } from "../../../helpers/backend_helper"

function* Css_Item_sale_Report_GenFunc({ config }) {

    try {
        let response = yield call(Css_Item_Sale_Report_GoButton_API, config);
        const groupedData = [];

        response.Data.forEach(item => {
            const itemid = item.ItemName;
            const existing = groupedData.find(g => g.ItemName === itemid);

            // Convert to number and round to 2 decimal places
            const toNumber = val => Number(parseFloat(val || 0).toFixed(2));

            if (existing) {
                existing.Amount = toNumber(existing.Amount + toNumber(item.Amount));
                existing.BaseItemUnitQuantity = toNumber(existing.BaseItemUnitQuantity + toNumber(item.BaseItemUnitQuantity));
                existing.BasicAmount = toNumber(existing.BasicAmount + toNumber(item.BasicAmount));
                existing.DiscountAmount = toNumber(existing.DiscountAmount + toNumber(item.DiscountAmount));
                existing.GSTAmount = toNumber(existing.GSTAmount + toNumber(item.GSTAmount));
                existing.GrandTotal = toNumber(existing.GrandTotal + toNumber(item.GrandTotal));
            } else {
                groupedData.push({
                    ...item,
                    Amount: toNumber(item.Amount),
                    BaseItemUnitQuantity: toNumber(item.BaseItemUnitQuantity),
                    BasicAmount: toNumber(item.BasicAmount),
                    DiscountAmount: toNumber(item.DiscountAmount),
                    GSTAmount: toNumber(item.GSTAmount),
                    GrandTotal: toNumber(item.GrandTotal),
                });
            }
        });

        response["Type"] = config.btnId;
        response["Data"] = groupedData;


        yield put(Css_Item_Sale_Gobtn_Success(response))
    } catch (error) { yield put(Css_Item_Sale_Gobtn_ReportApiErrorAction()) }
}

function* Css_Item_Sale_ReportSaga() {
    yield takeLatest(CSS_ITEM_SALE_GO_BUTTON_ACTION, Css_Item_sale_Report_GenFunc)
}

export default Css_Item_Sale_ReportSaga;
