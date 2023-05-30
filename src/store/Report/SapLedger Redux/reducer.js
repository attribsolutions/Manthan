import { 
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,

  } from "./actionType";

const INIT_STATE = {
 
  goBtnSapLedger: [],

}

const SapLedgerReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case GO_BUTTON_API_SAP_LEDGER_SUCCESS:
      return {
          ...state,
          goBtnSapLedger: action.payload,
      }

    default:
      return state
  }
}

export default SapLedgerReducer;