import { call, put, takeEvery } from "redux-saga/effects";
import {
    saveBankAssign_Success,
    PartyBankfilterSuccess
} from "./action";
import {
    Post_Bank_Assign_API,
    PartyBankfilter_API
} from "../../../helpers/backend_helper";
import {
    PARTY_BANK_FILTER,
    SAVE_BANK_ASSIGN
} from "./actionType";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";


function* Save_Method_ForBankAssign_GenFun({ config }) {             // Save API
    try {
        const response = yield call(Post_Bank_Assign_API, config);
        yield put(saveBankAssign_Success(response));
    } catch (error) { CommonConsole(error) }
}


function* PartyBank_Assign_GenFunc() {
    const filters = loginJsonBody();// required only PartyID and CompanyID
    try {
        const response = yield call(PartyBankfilter_API, filters);
        yield put(PartyBankfilterSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* BankSaga() {
    yield takeEvery(SAVE_BANK_ASSIGN, Save_Method_ForBankAssign_GenFun)
    yield takeEvery(PARTY_BANK_FILTER, PartyBank_Assign_GenFunc)
}

export default BankSaga;