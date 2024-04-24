import { call, put, takeLatest } from "redux-saga/effects";
import { Target_Vs_AchievementGroupWise_Gobtn_API, Target_Vs_Achievement_Gobtn_API } from "../../../helpers/backend_helper";
import { Target_VS_AchievementGroupWise_Go_Button_API_Success, Target_VS_Achievement_Api_ErrorAction, Target_VS_Achievement_Go_Button_API_Success } from "./action";
import { TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API } from "./actionType";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";

function* Target_VS_Achievement_GenFun(jsonBody) {

    try {
        let TotalAchAmountWithGST = 0
        let TotalCXAmountWithGST = 0
        let TotalCreditNoteAmountWithGST = 0
        let TotalTargetAmountWithGST = 0
        let TotalAchQuantityInKG = 0
        let TotalTargetQuantityInKGT = 0



        const response = yield call(Target_Vs_Achievement_Gobtn_API, jsonBody);
        const newList = yield response.Data.map((i, key) => {
            debugger
            TotalAchAmountWithGST = Number(TotalAchAmountWithGST) + Number(i.AchAmountWithGST)
            TotalCreditNoteAmountWithGST = Number(TotalCreditNoteAmountWithGST) + Number(i.CreditNoteAmountWithGST)
            TotalTargetAmountWithGST = Number(TotalTargetAmountWithGST) + Number(i.TargetAmountWithGST)
            TotalCXAmountWithGST = Number(TotalCXAmountWithGST) + Number(i.CXAmountWithGST)
            TotalAchQuantityInKG = Number(TotalAchQuantityInKG) + Number(i.AchQuantityInKG)
            TotalTargetQuantityInKGT = Number(TotalTargetQuantityInKGT) + Number(i.TargetQuantityInKG)

            i.key = key + 1
            i.TargetQuantityInKG = amountCommaSeparateFunc(parseFloat(i.TargetQuantityInKG).toFixed(3))
            i.TargetAmountWithGST = amountCommaSeparateFunc(parseFloat(i.TargetAmountWithGST).toFixed(2))
            i.AchQuantityInKG = amountCommaSeparateFunc(parseFloat(i.AchQuantityInKG).toFixed(3))
            i.AchAmountWithGST = amountCommaSeparateFunc(parseFloat(i.AchAmountWithGST).toFixed(2))

            return i
        })

        newList.push({
            key: newList.length + 1,
            Year: "Total",
            AchAmountWithGST: amountCommaSeparateFunc(parseFloat(TotalAchAmountWithGST.toFixed(2))),
            CreditNoteAmountWithGST: amountCommaSeparateFunc(parseFloat(TotalCreditNoteAmountWithGST.toFixed(2))),
            TargetAmountWithGST: amountCommaSeparateFunc(parseFloat(TotalTargetAmountWithGST.toFixed(2))),
            CXAmountWithGST: amountCommaSeparateFunc(parseFloat(TotalCXAmountWithGST.toFixed(2))),
            TargetQuantityInKG: amountCommaSeparateFunc(parseFloat(TotalTargetQuantityInKGT.toFixed(2))),
            AchQuantityInKG: amountCommaSeparateFunc(parseFloat(TotalAchQuantityInKG.toFixed(2))),
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


        newList.push({
            key: newList.length + 1,
            ItemGroup: "Total",
            AchAmountWithGST: TotalAchAmountWithGST.toFixed(2),
            CreditNoteAmountWithGST: TotalCreditNoteAmountWithGST.toFixed(2),
            GTAchAmountWithGST: TotalGTAchAmountWithGST.toFixed(2),
            TargetAmountWithGST: TotalTargetAmountWithGST.toFixed(2),
            CXAmountWithGST: TotalCXAmountWithGST.toFixed(2),
            AchQuantityInKG: TotalAchQuantityInKG.toFixed(2),
            CXQuantityInKG: TotalCXQuantityInKG.toFixed(2),
            TargetQuantityInKG: TotalTargetQuantityInKG.toFixed(2),
            GTAchQuantityInKG: TotalGTAchQuantityInKG.toFixed(2),
            "AchQty%": `${TotalAchQty.toFixed(2)}%`,
            "ContriQty%": `${TotalContriQty.toFixed(2)}%`,
            "AchAmount%": `${TotalAchAmount.toFixed(2)}%`,
            "ContriAmount%": `${TotalContriAmount.toFixed(2)}%`,
            CreditNoteQuantityInKG: TotalCreditNoteQuantityInKG.toFixed(2),



        })






        yield put(Target_VS_AchievementGroupWise_Go_Button_API_Success(newList))
    } catch (error) { yield put(Target_VS_Achievement_Api_ErrorAction()) }
}

function* TargetVsAchievementSaga() {
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, Target_VS_Achievement_GenFun)
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API, Target_VS_AchievementGroupWise_GenFun)

}

export default TargetVsAchievementSaga;