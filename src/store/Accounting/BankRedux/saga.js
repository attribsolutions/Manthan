import { call, put, takeEvery } from "redux-saga/effects";
import {
    saveBankMaster_Success,
    deleteBankIDSuccess,
    editBankIDSuccess,
    getBanklistSuccess,
    updateBankIDSuccess
} from "./action";
import {
    detelet_Bank_List_Api,
    edit_Bank_List_Api,
    get_Bank_List_Api,
    Post_Bank_Master_API,
    update_Bank_List_Api
} from "../../../helpers/backend_helper";
import {
    DELETE_BANK_ID,
    EDIT_BANK_ID,
    GET_BANK_LIST,
    SAVE_BANK_MASTER,
    UPDATE_BANK_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* Save_Method_ForBankMaster_GenFun({ config }) {             // Save API
    try {
        const response = yield call(Post_Bank_Master_API, config);
        yield put(saveBankMaster_Success(response));
    } catch (error) { CommonConsole(error) }
}

function* get_Bank_List_GenratorFunction() {  
    try {
        
        const response = yield call(get_Bank_List_Api);
        yield put(getBanklistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* Delete_Bank_ID_GenratorFunction({ config }) {   // delete API

    try {
        const response = yield call(detelet_Bank_List_Api, config);
        yield put(deleteBankIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* Edit_Bank_ID_GenratorFunction({ config }) {                 // edit API 
    const { btnmode } = config;
    try {
        const response = yield call(edit_Bank_List_Api, config);
        response.pageMode = btnmode;
        yield put(editBankIDSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Update_Bank_ID_GenratorFunction({ config }) {             // update API
    try {
        const response = yield call(update_Bank_List_Api, config);
        yield put(updateBankIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* BankSaga() {
    yield takeEvery(SAVE_BANK_MASTER, Save_Method_ForBankMaster_GenFun)
    yield takeEvery(GET_BANK_LIST, get_Bank_List_GenratorFunction)
    yield takeEvery(DELETE_BANK_ID, Delete_Bank_ID_GenratorFunction)
    yield takeEvery(EDIT_BANK_ID, Edit_Bank_ID_GenratorFunction)
    yield takeEvery(UPDATE_BANK_ID, Update_Bank_ID_GenratorFunction)
}

export default BankSaga;