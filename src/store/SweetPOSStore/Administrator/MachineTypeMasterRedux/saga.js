import { call, put, takeLatest } from "redux-saga/effects";
import {
    SPos_MachineTypeApiErrorAction,
    SPos_MachineTypeList_Success,
    SPos_MachineTypeSave_Success,
} from "./action";
import { S_Pos_MachineType_List_Api, S_Pos_MachineType_Save_API } from "../../../../helpers/backend_helper";
import { S_POS_MACHINE_TYPE_LIST_ACTION, S_POS_MACHINE_TYPE_SAVE_ACTION } from "./actionType";
import { date_dmy_func } from "../../../../components/Common/CommonFunction";

function* S_Pos_MachineType_List_GenFun({ config }) {

    try {
        const response = yield call(S_Pos_MachineType_List_Api, config);
        const newArray = response.Data.map((i) => {
            return {
                ...i,
                ValidityDate: i.Validity ? date_dmy_func(i.Validity) : null,
                MachineTypeNames: i.MachineTypeDetails.map(i => i.MachineTypeName).join(','),
                // IsAutoUpdate: i.IsAutoUpdate ? "TRUE" : "",
                // IsGiveUpdate: i.IsGiveUpdate ? "TRUE" : "",
                // IsServer: i.IsServer ? "TRUE" : "",
                // IsService: i.IsService ? "TRUE" : "",
            };
        });
        yield put(SPos_MachineTypeList_Success(newArray));
    } catch (error) { yield put(SPos_MachineTypeApiErrorAction()) }
}

function* S_Pos_MachineType_Save_GenFun({ config }) {

    try {
        const response = yield call(S_Pos_MachineType_Save_API, config);
        yield put(SPos_MachineTypeSave_Success(response));
    } catch (error) { yield put(SPos_MachineTypeApiErrorAction()) }
}

function* S_Pos_MachineType_Saga() {
    yield takeLatest(S_POS_MACHINE_TYPE_LIST_ACTION, S_Pos_MachineType_List_GenFun)
    yield takeLatest(S_POS_MACHINE_TYPE_SAVE_ACTION, S_Pos_MachineType_Save_GenFun)

}

export default S_Pos_MachineType_Saga;