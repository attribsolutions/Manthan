import {
  PRODUCTMARGIN_GO_BTN_ACTION,
  PRODUCTMARGIN_GO_BTN_SUCCESS,
  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_ERROR,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,

} from "./actionType";

const INIT_STATE = {
  goBtnLoading: false,
  goBtnSapLedger: [],
  ProductMargin: [],
  downloadProductMargin: false,
}

const SapLedgerReducer = (state = INIT_STATE, action) => {

  switch (action.type) {
    
    case GO_BUTTON_API_SAP_LEDGER:
      return {
        ...state,
        goBtnLoading: true
      }
  
    case GO_BUTTON_API_SAP_LEDGER_SUCCESS:
      return {
        ...state,
        goBtnSapLedger: action.payload,
        goBtnLoading: false
      }

    case PRODUCTMARGIN_GO_BTN_ACTION:
      return {
        ...state,
        downloadProductMargin: true,
      }

    case PRODUCTMARGIN_GO_BTN_SUCCESS:
      return {
        ...state,
        ProductMargin: action.payload,
        downloadProductMargin: false,
      }

    case GO_BUTTON_API_SAP_LEDGER_ERROR:
      return {
        ...state,
        goBtnLoading: false,
        downloadProductMargin: false
      };

    default:
      return state
  }
}

export default SapLedgerReducer;