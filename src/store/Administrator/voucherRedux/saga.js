import { call, put, takeLatest } from "redux-saga/effects";

import { ValideVoucherIDSuccess, VoucherErrorAction, deleteVoucherIDSuccess, editVoucherIDSuccess, getVoucherlistSuccess, saveVoucherSuccess, updateVoucherIDSuccess } from "./action";
import { DELETE_VOUCHER_ID, EDIT_VOUCHER_ID, GET_VOUCHER_LIST, SAVE_VOUCHER_MASTER, UPDATE_VOUCHER_ID, VALIDE_VOUCHER_ID } from "./actionType";
import { Voucher__Delete_API, Voucher__Post_API, Voucher__Update_API, Voucher_API, Voucher_Edit_API, Voucher_Validity_Check_API } from "../../../helpers/backend_helper";

function* save_Voucher_GenFun({ config }) {                      // Save API
    try {
        const response = yield call(Voucher__Post_API, config);
        yield put(saveVoucherSuccess(response));
    } catch (error) { yield put(VoucherErrorAction()) }
}

function* Get_Voucher_List_GenrFun() {                            // getList API
    try {
        const response = yield call(Voucher_API);
        yield put(getVoucherlistSuccess(response.Data));
    } catch (error) { yield put(VoucherErrorAction()) }
}

function* Edit_Voucher_ID_GenFun({ config }) {                     // edit API
    const { btnmode } = config;
    try {
        const response = yield call(Voucher_Edit_API, config);
        response.pageMode = btnmode;
        yield put(editVoucherIDSuccess(response));
    } catch (error) { yield put(VoucherErrorAction()) }
}


function* Valid_Voucher_ID_GenFun({ config }) {                     // edit API

    try {
        const response = yield call(Voucher_Validity_Check_API, config);

        yield put(ValideVoucherIDSuccess(response));
    } catch (error) { yield put(VoucherErrorAction()) }
}

function* Update_Voucher_ID_GenFun({ config }) {
    // update API
    try {
        const response = yield call(Voucher__Update_API, config);
        yield put(updateVoucherIDSuccess(response))
    } catch (error) { yield put(VoucherErrorAction()) }
}

function* Delete_Voucher_ID_GenFun({ config }) {                     // delete API
    try {
        const response = yield call(Voucher__Delete_API, config);
        yield put(deleteVoucherIDSuccess(response))
    } catch (error) { yield put(VoucherErrorAction()) }
}

function* VoucherSaga() {
    yield takeLatest(VALIDE_VOUCHER_ID, Valid_Voucher_ID_GenFun)
    yield takeLatest(SAVE_VOUCHER_MASTER, save_Voucher_GenFun)
    yield takeLatest(GET_VOUCHER_LIST, Get_Voucher_List_GenrFun)
    yield takeLatest(EDIT_VOUCHER_ID, Edit_Voucher_ID_GenFun)
    yield takeLatest(UPDATE_VOUCHER_ID, Update_Voucher_ID_GenFun)
    yield takeLatest(DELETE_VOUCHER_ID, Delete_Voucher_ID_GenFun)

}

export default VoucherSaga;