import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, loginPartyID } from "../../../components/Common/CommonFunction";
import { GrnApiErrorAction, InvoiceApiErrorAction, getGRNListPageSuccess, invoiceListGoBtnfilterSucccess } from "../../actions";
import { INVOICE_LIST_GO_BUTTON_FILTER } from "../../Sales/Invoice/actionType";
import { GET_GRN_LIST_PAGE } from "../../Inventory/GRNRedux/actionType";


function* Dashboard_Get_API_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.Dashboard_Get_API, config);
        yield put(action.getDashbordDetails_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* Dashboard_Order_Data_Get_API_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.OrderList_get_Filter_API, config);
        yield put(action.Get_Dashboard_Order_Data_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* InvoiceListGenFunc({ config }) {
    
    try {
        const response = yield call(apiCall.Invoice_1_Get_Filter_API, config);
        yield put(action.Get_Dashboard_Invoice_Data_Success(response.Data));
    } catch (error) {
        yield put(CommonConsole(error))
    }
}

function* GRNListfilterGerFunc({ config }) {          // Grn_List filter  genrator function
    try {
        const response = yield call(apiCall.GRN_get_API, config);
        yield put(action.Get_Dashboard_Grn_Data_Success(response.Data))
    } catch (error) { CommonConsole(error) }
}

function* DashboardSaga() {
    yield takeLatest(actionType.GET_DASHBOARD_GRN_DATA_DETAILS, GRNListfilterGerFunc);
    yield takeLatest(actionType.GET_DASHBOARD_INVOICE_DATA_DETAILS, InvoiceListGenFunc);
    yield takeLatest(actionType.GET_DASHBOARD_DETAILS, Dashboard_Get_API_GenFunc)
    yield takeLatest(actionType.GET_DASHBOARD_ORDER_DATA_DETAILS, Dashboard_Order_Data_Get_API_GenFunc)

}
export default DashboardSaga;  