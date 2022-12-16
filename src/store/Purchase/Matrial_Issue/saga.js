import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Material_Issue_GoButton_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { postGoButtonForMaterialIssue_MasterSuccess } from "./action";
import { POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER } from "./actionType";

// GO Botton Post API
function* MaterialIssueGoButton_gunfun({ data }) {

    yield put(SpinnerState(true))
    try {
        debugger
        const response = yield call(Material_Issue_GoButton_Post_API, data);
        // const newList = yield response.Data.map((i) => {
        //     debugger
        //     i.BatchesData((index)=>{
        //         var date = convertDatefunc(index.BatchDate)
        //         index.BatchDate = (`${date}`)
        //         return index
        //     })
            
        // })
        yield put(SpinnerState(false))
        yield put(postGoButtonForMaterialIssue_MasterSuccess(response.Data));

    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message Go Button in Work Order ",
        }));
    }
}

function* MaterialIssueSaga() {
    yield takeEvery(POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, MaterialIssueGoButton_gunfun)
}

export default MaterialIssueSaga;