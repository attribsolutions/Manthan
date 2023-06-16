import { call, put, takeEvery } from "redux-saga/effects";
import {
    saveBankAssign_Success,
    PartyBankfilterSuccess,
    editBankAssignIDSuccess,
    updateBankAssignIDSuccess,
    BankAssignApiErrorAction
} from "./action";
import {
    Post_Bank_Assign_API,
    PartyBankfilter_API,
    edit_Bank_Assign_Api,
    update_Bank_Assign_Api
} from "../../../helpers/backend_helper";
import {
    PARTY_BANK_FILTER,
    SAVE_BANK_ASSIGN,
    EDIT_BANK_ASSIGN_ID,
    UPDATE_BANK_ASSIGN_ID
} from "./actionType";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";

function* Save_Method_ForBankAssign_GenFun({ config }) {   // Save API
    try {
        const response = yield call(Post_Bank_Assign_API, config);
        yield put(saveBankAssign_Success(response));
    } catch (error) { yield put(BankAssignApiErrorAction()) }
}

function* PartyBank_Assign_GenFunc() {
    const filters = loginJsonBody();// required only PartyID and CompanyID
    try {
        const response = yield call(PartyBankfilter_API, filters);
        yield put(PartyBankfilterSuccess(response.Data));
    } catch (error) { yield put(BankAssignApiErrorAction()) }
}

function* Edit_Bank_Assign_GenratorFunction({ config }) {                 // edit API 
    const { btnmode } = config;
    try {
        const response = yield call(edit_Bank_Assign_Api, config);
        response.pageMode = btnmode;
        yield put(editBankAssignIDSuccess(response));
    } catch (error) { yield put(BankAssignApiErrorAction()) }
}

function* Update_Bank_Assign_GenratorFunction({ config }) {             // update API
    try {
        const response = yield call(update_Bank_Assign_Api, config);
        yield put(updateBankAssignIDSuccess(response))
    } catch (error) { yield put(BankAssignApiErrorAction()) }
}

function* BankSaga() {
    yield takeEvery(SAVE_BANK_ASSIGN, Save_Method_ForBankAssign_GenFun)
    yield takeEvery(PARTY_BANK_FILTER, PartyBank_Assign_GenFunc)
    yield takeEvery(EDIT_BANK_ASSIGN_ID, Edit_Bank_Assign_GenratorFunction)
    yield takeEvery(UPDATE_BANK_ASSIGN_ID, Update_Bank_Assign_GenratorFunction)
}

export default BankSaga;