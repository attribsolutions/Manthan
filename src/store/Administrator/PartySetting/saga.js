import { call, put, takeLatest } from "redux-saga/effects";
import { getpartysettingApiErrorAction, getpartysetting_API_Success, postOrderSummary_API_Success, savePartySettingMaster_Success } from "./action";
import { GET_PARTY_SETTING_API, SAVE_PARTY_SETTING_MASTER } from "./actionType";
import { PartySettingApi, save_PartySetting_API } from "../../../helpers/backend_helper";



function* Save_Method_ForPartySetting_GenFun({ config }) {
    try {

        const response = yield call(save_PartySetting_API, config);
        yield put(savePartySettingMaster_Success(response));
    } catch (error) { yield put(getpartysettingApiErrorAction()) }
}

function* PartySetting_GenFunc(config) {

    try {

        const response = yield call(PartySettingApi, config.Party_id, config.Comapny_id);

        const singleObject = {};
        const SystemSetting = {};
        for (const item of response.Data) {

            SystemSetting[item.SystemSetting.replace(/\s/g, '')] = item.Value
            if (item.id === 3) {   /// 3 is setting id of Payment QR Code which will Not change
                SystemSetting["Qr_Image"] = item.Image
            }

            singleObject[item.SystemSetting.replace(/\s/g, '')] = {
                SystemSetting: item.SystemSetting,
                Value: item.Value,
                id: item.id,
                Description: item.Description,
                DefaultValue: item.DefaultValue,
                IsPartyRelatedSetting: item.IsPartyRelatedSetting === 0 ? false : true,
                IsActive: item.IsActive === 0 ? false : true

            };
        }
        response["Data"] = singleObject
        sessionStorage.setItem("SystemSetting", JSON.stringify(SystemSetting))

        response['SystemSetting'] = SystemSetting
        yield put(getpartysetting_API_Success(response))

    } catch (error) { yield put(getpartysettingApiErrorAction()) }
}

function* PartySettingSaga() {
    yield takeLatest(SAVE_PARTY_SETTING_MASTER, Save_Method_ForPartySetting_GenFun)
    yield takeLatest(GET_PARTY_SETTING_API, PartySetting_GenFunc)
}

export default PartySettingSaga;