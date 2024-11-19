import { call, put, takeLatest } from "redux-saga/effects";
import { getPartyEmployeeDetailsApiErrorAction, getPartyEmployeeDetails_API_Success, } from "./action";
import { GET_PARTY_EMPLOYEE_DETAILS, } from "./actionType"
import { PartyEmployeeDetails } from "../../../helpers/backend_helper";




function* GetPartyEmployee_GenFunc({ config }) {

    try {
        const response = yield call(PartyEmployeeDetails, config);
        let counter = 1; // Initialize a counter
        const Data = response.Data.map(item => {
            return {
                id: counter++, // Increment counter and use it as ID
                Status: item.IsPartyActive === true ? "Active" : "Deactive",
                ...item,
            };
        });
        yield put(getPartyEmployeeDetails_API_Success(Data))

    } catch (error) { yield put(getPartyEmployeeDetailsApiErrorAction()) }
}

function* PartyEmployeeDetailsSaga() {

    yield takeLatest(GET_PARTY_EMPLOYEE_DETAILS, GetPartyEmployee_GenFunc)
}

export default PartyEmployeeDetailsSaga;