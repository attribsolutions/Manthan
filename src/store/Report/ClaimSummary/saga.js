import { call, put, takeLatest } from "redux-saga/effects";
import {
    CLAIM_LIST_API,
    DELETE_CLAIM_ID,
    POST_CLAIM_CREATE_SUMMARY_API,
    POST_ORDER_SUMMARY_API,
} from "./actionType";
import { MasterClaimCreatApiErrorAction, OrderSummaryApiErrorAction, claimList_API_Success, deleteClaimSuccess, postMasterClaimCreat_API_Success, postOrderSummary_API_Success } from "./action";
import { ClaimList_API, MasterClaimCreate_API, OderSummary_GoBtn_API, delete_Claim_API } from "../../../helpers/backend_helper";
import { listpageConcatDateAndTime, loginPartyID } from "../../../components/Common/CommonFunction";

function* MasterClaimCreat_GenFunc({ config }) {

    try {
        const response = yield call(MasterClaimCreate_API, config);
        yield put(postMasterClaimCreat_API_Success(response))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* ClaimList_GenFunc({ config }) {
    const Party_ID = loginPartyID()
    try {
        const response = yield call(ClaimList_API, config);
        let NewResponse = []
        if (config.Type === "List") {

            for (const item of response.Data) {
                if (item.id !== null) {
                    let isDeleteDisable = false

                    if (item.PartyID === Party_ID) {
                        isDeleteDisable = true
                    }

                    const newItem = {
                        ...item,
                        MonthStartDate: config.MonthStartDate,
                        MonthEndDate: config.MonthEndDate,
                        forceDeleteHide: isDeleteDisable,
                        ClaimDate: listpageConcatDateAndTime(item.ClaimDate, item.CreatedOn)

                    };
                    NewResponse.push(newItem);
                }
            }
        } else {

            for (const item of response.Data) {
                if (item.id === null) {
                    let isCreatDisable = false

                    if (item.PartyID === Party_ID) {
                        isCreatDisable = true
                    }
                    const newItem = {
                        ...item,
                        forceCreateHide: isCreatDisable,
                    };
                    NewResponse.push(newItem);
                }
            }

        }

        yield put(claimList_API_Success(NewResponse))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* Delete_Claim_ID_GenFunc({ config }) {                    // delete API

    try {
        const response = yield call(delete_Claim_API, config);
        yield put(deleteClaimSuccess(response))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* MasterClaimCreatSaga() {

    yield takeLatest(CLAIM_LIST_API, ClaimList_GenFunc)
    yield takeLatest(POST_CLAIM_CREATE_SUMMARY_API, MasterClaimCreat_GenFunc)
    yield takeLatest(DELETE_CLAIM_ID, Delete_Claim_ID_GenFunc)

}

export default MasterClaimCreatSaga;