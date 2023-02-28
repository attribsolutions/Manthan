import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Inward_Delete_API, Inward_List_API, Inward_Post_API, Make_Inward_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { deleteInwardIdSuccess, getInwardListPageSuccess, makeInwardSuccess, postInwardSuccess } from "./action";
import { DELETE_INWARD_LIST_PAGE, GET_INWARD_LIST_PAGE, MAKE_INWARD, POST_INWARD } from "./actionType";

//post api
function* Post_Inward_GenratorFunction({ data }) {
  try {
    const response = yield call(Inward_Post_API, data);
    yield put(postInwardSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// Inward List API
function* get_InwardList_GenFunc({ filters }) {
   try {
    const response = yield call(Inward_List_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.IBInwardDate)
      var time = convertTimefunc(i.CreatedOn)
      i.IBInwardDate = (`${date} ${time}`)
      return i
    })
    yield put(getInwardListPageSuccess(newList))
  } catch (error) { CommonConsole(error) }
}

function* DeleteInward_GenFunc({ id }) {
  try {
    const response = yield call(Inward_Delete_API, id);
    if (response.StatusCode === 200) yield put(deleteInwardIdSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) { CommonConsole(error) }
}

// //post api
// function* Make_Inward_GenratorFunction({ data }) {
//   debugger
//   try {
//     const response = yield call(Make_Inward_Post_API, data);
//     yield put(makeInwardSuccess(response));
//   } catch (error) { CommonConsole(error) }
// }

// Make Inward Button API
function* Make_Inward_GenratorFunction({ id }) {
  try {
   const response = yield call(Make_Inward_Post_API, id);
  
   yield put(makeInwardSuccess(response.Data))
 } catch (error) { CommonConsole(error) }
}

function* InwardSaga() {
  yield takeEvery(POST_INWARD, Post_Inward_GenratorFunction)
  yield takeEvery(GET_INWARD_LIST_PAGE, get_InwardList_GenFunc)
  yield takeEvery(DELETE_INWARD_LIST_PAGE, DeleteInward_GenFunc)
  yield takeEvery(MAKE_INWARD, Make_Inward_GenratorFunction)

}

export default InwardSaga;