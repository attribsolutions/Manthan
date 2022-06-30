import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Master_Delete_API, Party_Master_Edit_API, Party_Master_Get_API, Party_Master_Post_API, Party_Master_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deletePartyIDSuccess, editPartyIDSuccess, getPartyListAPISuccess, postPartyDataSuccess, updatePartyIDSuccess } from "./action";
import { DELETE_PARTY_ID, EDIT_PARTY_ID, GET_PARTY_LIST_API, POST_PARTY_DATA, UPDATE_PARTY_ID } from "./actionTypes";

function* Get_Party_GenratorFunction() {
    yield put(SpinnerState(true))
    try {
      const response = yield call(Party_Master_Get_API);
      yield put(getPartyListAPISuccess(response.Data));
      yield put(SpinnerState(false))
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
  function* Submit_Party_GenratorFunction({ Data }) {
    yield put(SpinnerState(true))
    try {
      const response = yield call(Party_Master_Post_API, Data);
      console.log("response",response)
      yield put(SpinnerState(false))
      yield put(postPartyDataSuccess(response));
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
    function* Delete_Party_GenratorFunction({ id }) {
      try {
        yield put(SpinnerState(true))
        const response = yield call(Party_Master_Delete_API, id);
        yield put(SpinnerState(false))
        yield put(deletePartyIDSuccess(response))
      } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({ Type: 4, 
          Status: true, Message: "500 Error Message",
        }));
      }
    }
  
  function* Edit_Party_GenratorFunction({ ID }) {
    try {
      const response = yield call(Party_Master_Edit_API, ID);
      yield put(editPartyIDSuccess(response));
    } catch (error) {
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
  
  function* Update_Party_GenratorFunction({ updateData, ID }) {
    try {
      yield put(SpinnerState(true))
      const response = yield call(Party_Master_Update_API, updateData, ID);
      console.log("saga file response", response)
      yield put(SpinnerState(false))
      yield put(updatePartyIDSuccess(response))
    }
    catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
    function* PartyMasterSaga() {
      yield takeEvery(GET_PARTY_LIST_API, Get_Party_GenratorFunction);
      yield takeEvery(POST_PARTY_DATA,Submit_Party_GenratorFunction );
      yield takeEvery(EDIT_PARTY_ID, Edit_Party_GenratorFunction);
      yield takeEvery(DELETE_PARTY_ID, Delete_Party_GenratorFunction);
      yield takeEvery(UPDATE_PARTY_ID, Update_Party_GenratorFunction);
    }
    
    export default PartyMasterSaga;
    