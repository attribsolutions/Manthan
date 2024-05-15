import { call, put, takeLatest } from "redux-saga/effects";
import { Target_Vs_AchievementGroupWise_Gobtn_API, Target_Vs_Achievement_Gobtn_API } from "../../../helpers/backend_helper";
import { Target_VS_AchievementGroupWise_Go_Button_API_Success, Target_VS_Achievement_Api_ErrorAction, Target_VS_Achievement_Go_Button_API_Success } from "./action";
import { TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API } from "./actionType";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";

function* Target_VS_Achievement_GenFun(jsonBody) {

    try {


        const response = yield call(Target_Vs_Achievement_Gobtn_API, jsonBody);
        const newList = yield response.Data.map((i, key) => {
        
            i.key = key + 1
            i.TargetQuantityInKG = (i.TargetQuantityInKG)
            i.TargetAmountWithGST = parseInt(i.TargetAmountWithGST)
            i.AchQuantityInKG = Number(i.AchQuantityInKG).toFixed(2)
            i.AchAmountWithGST = parseInt(i.AchAmountWithGST)
            i.AchAmountWithGST = parseInt(i.AchAmountWithGST)
            i.AchAmountWithGST = parseInt(i.AchAmountWithGST)
            i.SAPItemCode =parseInt(i.SAPItemCode)
            i.SAPPartyCode =parseInt(i.SAPPartyCode)

            return i
        })

        yield put(Target_VS_Achievement_Go_Button_API_Success(newList))
    } catch (error) { yield put(Target_VS_Achievement_Api_ErrorAction()) }
}


function* Target_VS_AchievementGroupWise_GenFun(jsonBody) {

    try {

        let TotalAchAmountWithGST = 0
        let TotalCreditNoteAmountWithGST = 0
        let TotalGTAchAmountWithGST = 0
        let TotalTargetAmountWithGST = 0
        let TotalCXAmountWithGST = 0

        let TotalAchQuantityInKG = 0
        let TotalCXQuantityInKG = 0
        let TotalTargetQuantityInKG = 0
        let TotalGTAchQuantityInKG = 0
        let TotalAchQty = 0
        let TotalContriQty = 0
        let TotalAchAmount = 0
        let TotalContriAmount = 0
        let TotalCreditNoteQuantityInKG = 0




        const response = yield call(Target_Vs_AchievementGroupWise_Gobtn_API, jsonBody);

        const newList = yield response.Data.map((i, key) => {

            i.AchAmountWithGST = parseInt(Number(i.AchAmountWithGST))
            i.CreditNoteAmountWithGST = parseInt(Number(i.CreditNoteAmountWithGST))
            i.GTAchAmountWithGST = parseInt(Number(i.GTAchAmountWithGST))
            i.TargetAmountWithGST = parseInt(Number(i.TargetAmountWithGST))
            i.CXAmountWithGST = (Number(i.CXAmountWithGST))
            i.CXQuantityInKG = (Number(i.CXQuantityInKG).toFixed(2))
            i.TargetQuantityInKG = (Number(i.TargetQuantityInKG).toFixed(2))
            i.GTAchQuantityInKG = (Number(i.GTAchQuantityInKG).toFixed(2))
            i.CreditNoteQuantityInKG = (Number(i.CreditNoteQuantityInKG).toFixed(2))
            i.AchQuantityInKG = (Number(i.AchQuantityInKG).toFixed(2))


            i.key = key + 1
            TotalAchAmountWithGST = Number(TotalAchAmountWithGST) + Number(i.AchAmountWithGST)
            TotalCreditNoteAmountWithGST = Number(TotalCreditNoteAmountWithGST) + Number(i.CreditNoteAmountWithGST)
            TotalGTAchAmountWithGST = Number(TotalGTAchAmountWithGST) + Number(i.GTAchAmountWithGST)
            TotalTargetAmountWithGST = Number(TotalTargetAmountWithGST) + Number(i.TargetAmountWithGST)
            TotalCXAmountWithGST = Number(TotalCXAmountWithGST) + Number(i.CXAmountWithGST)

            TotalAchQuantityInKG = Number(TotalAchQuantityInKG) + Number(i.AchQuantityInKG)

            TotalCXQuantityInKG = Number(TotalCXQuantityInKG) + Number(i.CXQuantityInKG)

            TotalTargetQuantityInKG = Number(TotalTargetQuantityInKG) + Number(i.TargetQuantityInKG)
            TotalGTAchQuantityInKG = Number(TotalGTAchQuantityInKG) + Number(i.GTAchQuantityInKG)

            TotalAchQty = Number(TotalAchQty) + Number(i["AchQty%"])

            TotalContriQty = Number(TotalContriQty) + Number(i["ContriQty%"])

            TotalAchAmount = Number(TotalAchAmount) + Number(i["AchAmount%"])

            TotalContriAmount = Number(TotalContriAmount) + Number(i["ContriAmount%"])
            TotalCreditNoteQuantityInKG = Number(TotalCreditNoteQuantityInKG) + Number(i.CreditNoteQuantityInKG)


            return i
        })

        const AchQty_Percentage = (TotalGTAchQuantityInKG / TotalTargetQuantityInKG) * 100
        const ContriQty_Percentage = (TotalGTAchQuantityInKG / TotalGTAchQuantityInKG) * 100
        const AchAmount_Percentage = (TotalGTAchAmountWithGST / TotalTargetAmountWithGST) * 100
        const ContriAmount_Percentage = (TotalGTAchAmountWithGST / TotalGTAchAmountWithGST) * 100

        newList.push({
            key: newList.length + 1,
            ItemGroup: "Total",
            AchAmountWithGST: parseInt(TotalAchAmountWithGST),
            CreditNoteAmountWithGST: parseInt(TotalCreditNoteAmountWithGST),
            GTAchAmountWithGST: parseInt(TotalGTAchAmountWithGST),
            TargetAmountWithGST: parseInt(TotalTargetAmountWithGST),
            CXAmountWithGST: parseInt(TotalCXAmountWithGST),
            AchQuantityInKG: parseFloat(TotalAchQuantityInKG.toFixed(2)),
            CXQuantityInKG: parseFloat(TotalCXQuantityInKG.toFixed(2)),
            TargetQuantityInKG: parseFloat(TotalTargetQuantityInKG.toFixed(2)),
            GTAchQuantityInKG: parseFloat(TotalGTAchQuantityInKG.toFixed(2)),
            "AchQty%": parseFloat(AchQty_Percentage.toFixed(2)),
            "ContriQty%": parseFloat(ContriQty_Percentage.toFixed(2)),
            "AchAmount%": parseFloat(AchAmount_Percentage.toFixed(2)),
            "ContriAmount%": parseFloat(ContriAmount_Percentage.toFixed(2)),
            CreditNoteQuantityInKG: parseFloat(TotalCreditNoteQuantityInKG.toFixed(2)),



        })



        yield put(Target_VS_AchievementGroupWise_Go_Button_API_Success(newList))
    } catch (error) { yield put(Target_VS_Achievement_Api_ErrorAction()) }
}

function* TargetVsAchievementSaga() {
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, Target_VS_Achievement_GenFun)
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API, Target_VS_AchievementGroupWise_GenFun)

}

export default TargetVsAchievementSaga;