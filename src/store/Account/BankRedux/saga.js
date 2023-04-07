import { call, put, takeEvery } from "redux-saga/effects";
import {
    saveBankMaster_Success,
    deleteBankIDSuccess,
    editBankIDSuccess,
    postBanklistSuccess,
    updateBankIDSuccess
} from "./action";
import {
    detelet_Bank_List_Api,
    edit_Bank_List_Api,
    post_Bank_List_Api,
    Post_Bank_Master_API,
    update_Bank_List_Api
} from "../../../helpers/backend_helper";
import {
    DELETE_BANK_ID,
    EDIT_BANK_ID,
    POST_BANK_LIST,
    SAVE_BANK_MASTER,
    UPDATE_BANK_ID
} from "./actionType";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";


function* Save_Method_ForBankMaster_GenFun({ config }) {             // Save API
    try {
        const response = yield call(Post_Bank_Master_API, config);
        yield put(saveBankMaster_Success(response));
    } catch (error) { CommonConsole(error) }
}

function* post_Bank_List_GenratorFunction({ jsonBody }) {  
    debugger                      // postList API
    const filters = loginJsonBody();// required only PartyID and CompanyID
    try {
        debugger
        const response = yield call(post_Bank_List_Api, filters);
        yield put(postBanklistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* Delete_Bank_ID_GenratorFunction({ config }) {              // delete API
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
    yield takeEvery(POST_BANK_LIST, post_Bank_List_GenratorFunction)
    yield takeEvery(DELETE_BANK_ID, Delete_Bank_ID_GenratorFunction)
    yield takeEvery(EDIT_BANK_ID, Edit_Bank_ID_GenratorFunction)
    yield takeEvery(UPDATE_BANK_ID, Update_Bank_ID_GenratorFunction)
}

export default BankSaga;