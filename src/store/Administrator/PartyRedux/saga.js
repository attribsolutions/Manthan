import { call, put, takeEvery } from "redux-saga/effects";
import { DivisionTypes_For_Dropdown, GetDistrictOnState_For_Dropdown, GetPartyTypeByDivisionTypeID_For_Dropdown, Party_Master_Delete_API, Party_Master_Edit_API, Party_Master_Get_API, Party_Master_Post_API, Party_Master_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deletePartyIDSuccess, editPartyIDSuccess, getDistrictOnStateSuccess, getDivisionTypesSuccess, getPartyListAPISuccess, GetPartyTypeByDivisionTypeIDSuccess, postPartyDataSuccess, updatePartyIDSuccess } from "./action";
import { DELETE_PARTY_ID, EDIT_PARTY_ID, GET_DISTRICT_ON_STATE, GET_DIVISION_TYPES_ID, GET_PARTTYPE_BY_DIVISIONTYPES_ID, GET_PARTY_LIST_API, POST_PARTY_DATA, UPDATE_PARTY_ID } from "./actionTypes";

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
  
  function* Edit_Party_GenratorFunction({ id }) {
    try {
      const response = yield call(Party_Master_Edit_API, id);
      yield put(editPartyIDSuccess(response));
 
    } catch (error) {
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
  function* Update_Party_GenratorFunction({ updateData, id }) {
   
    try {
      yield put(SpinnerState(true))
      const response = yield call(Party_Master_Update_API, updateData, id);
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

// GetDistrictOnState API
function* GetDistrictOnState_saga({id}) {
  try {
    const response = yield call(GetDistrictOnState_For_Dropdown,id);
    yield put(getDistrictOnStateSuccess(response.Data));
  } catch (error) {
    console.log("GetDistrictOnState_saga page error", error);
  }
}

///  DivisionTypes dropdown list
function* DivisionTypes_GenratorFunction() {
  try {
    const response = yield call(DivisionTypes_For_Dropdown);
    yield put(getDivisionTypesSuccess(response.Data));
  } catch (error) {
    console.log("DivisionTypes saga page error", error);
  }
}

  // GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
function* GetPartyTypeByDivisionTypeID_GenratorFunction({id}) {
  try {
    const response = yield call(GetPartyTypeByDivisionTypeID_For_Dropdown,id);
    yield put(GetPartyTypeByDivisionTypeIDSuccess(response.Data));
  } catch (error) {
    console.log("PartyTypeByDivisionTypeID page error", error);
  }
}
  
    function* PartyMasterSaga() {
      yield takeEvery(GET_PARTY_LIST_API, Get_Party_GenratorFunction);
      yield takeEvery(POST_PARTY_DATA,Submit_Party_GenratorFunction );
      yield takeEvery(EDIT_PARTY_ID, Edit_Party_GenratorFunction);
      yield takeEvery(DELETE_PARTY_ID, Delete_Party_GenratorFunction);
      yield takeEvery(UPDATE_PARTY_ID, Update_Party_GenratorFunction);
      yield takeEvery(GET_DISTRICT_ON_STATE, GetDistrictOnState_saga);
      yield takeEvery(GET_DIVISION_TYPES_ID, DivisionTypes_GenratorFunction);
      yield takeEvery(GET_PARTTYPE_BY_DIVISIONTYPES_ID, GetPartyTypeByDivisionTypeID_GenratorFunction);

    }
    
    export default PartyMasterSaga;
    