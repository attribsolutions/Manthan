import { call, put, takeLatest } from "redux-saga/effects";
import { ItemSaleGoButton_API_Success, ItemSaleReportApiErrorAction, Items_On_Group_And_Subgroup_API_Success, SupplierOnPartyType_API_Success } from "./action";
import { ITEMS_ON_GROUP_AND_SUBGROUP_API, ITEM_SALE_GO_BUTTON_API, SUPPLIER_ON_PARTYTYPE_API } from "./actionType";
import { ItemSaleReport_GoBtn_API, ItemsList_On_Group_And_Subgroup_API, SupplierDropdownApi } from "../../../helpers/backend_helper";

function* ItemSaleReport_GenFunc({ config }) {

    try {
        const response = yield call(ItemSaleReport_GoBtn_API, config);
        yield put(ItemSaleGoButton_API_Success(response.Data))
    } catch (error) { yield put(ItemSaleReportApiErrorAction()) }
}

// Supplier API depends on Channel From(Party Type)
function* SupplierOnPartyType_GenFunc({ config }) {

    const { employeeID, channelFromID } = config
    try {
        const response = yield call(SupplierDropdownApi, employeeID, channelFromID);
        yield put(SupplierOnPartyType_API_Success(response.Data))
    } catch (error) { yield put(ItemSaleReportApiErrorAction()) }
}

// Item dropdown API depends on Group and Sub-Group
function* Items_On_Group_And_Subgroup_GenFunc({ config }) {

    try {
        const response = yield call(ItemsList_On_Group_And_Subgroup_API, config);
        yield put(Items_On_Group_And_Subgroup_API_Success(response.Data))
    } catch (error) { yield put(ItemSaleReportApiErrorAction()) }
}

function* ItemSaleReportSaga() {
    yield takeLatest(ITEM_SALE_GO_BUTTON_API, ItemSaleReport_GenFunc)
    yield takeLatest(SUPPLIER_ON_PARTYTYPE_API, SupplierOnPartyType_GenFunc)
    yield takeLatest(ITEMS_ON_GROUP_AND_SUBGROUP_API, Items_On_Group_And_Subgroup_GenFunc)
}

export default ItemSaleReportSaga;