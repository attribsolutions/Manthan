import { call, put, takeLatest } from "redux-saga/effects";
import { ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION } from "./actionType";
import { Order_Item_Supplier_Api_ErrorAction, order_Item_Supplier_goBtn_Success, } from "./action";
import { OrderItemSupplier_GoButton_API } from "../../../helpers/backend_helper";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";

function* OrderItemSupplier_GenFunc({ config }) {

    try {
        const response = yield call(OrderItemSupplier_GoButton_API, config);

        const flattenedData = response.Data.flatMap(item => {
            return item.ItemDetails.map((i, index) => ({
                SKUName: i.SKUName,
                QtyInNo: amountCommaSeparateFunc(parseFloat(i.QtyInNo).toFixed(2)),
                QtyInKg: amountCommaSeparateFunc(parseFloat(i.QtyInKg).toFixed(2)),
                QtyInBox: amountCommaSeparateFunc(parseFloat(i.QtyInBox).toFixed(2)),
                SupplierName: index === 0 ? item.SupplierName : ""
            }));
        });

        const dataWithId = flattenedData.map((element, key) => {
            return { ...element, id: key + 1 };
        });

        yield put(order_Item_Supplier_goBtn_Success(dataWithId));

    } catch (error) { yield put(Order_Item_Supplier_Api_ErrorAction()) }
}

function* OrderItemSupplier_Saga() {
    yield takeLatest(ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION, OrderItemSupplier_GenFunc)
}

export default OrderItemSupplier_Saga;
