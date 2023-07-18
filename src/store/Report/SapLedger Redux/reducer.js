import {
  GET_EXCELBUTTON_API,
  GET_EXCELBUTTON_API_SUCCESS,
  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_ERROR,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,

} from "./actionType";

const INIT_STATE = {
  goBtnLoading: false,
  goBtnSapLedger: [],
  ProductMargin: [],
  dounloadProductMargin: false,


}

const SapLedgerReducer = (state = INIT_STATE, action) => {

  switch (action.type) {
    case GO_BUTTON_API_SAP_LEDGER:
      return {
        ...state,
        goBtnLoading: true
      }
    // post
    case GO_BUTTON_API_SAP_LEDGER_SUCCESS:
      return {
        ...state,
        goBtnSapLedger: action.payload,
        goBtnLoading: false
      }

    case GET_EXCELBUTTON_API:
      return {
        ...state,
        dounloadProductMargin: true,
      }

    case GET_EXCELBUTTON_API_SUCCESS:
      return {
        ...state,
        dounloadProductMargin: false,
        ProductMargin: action.payload,
      }

    case GO_BUTTON_API_SAP_LEDGER_ERROR:
      return {
        ...state,
        goBtnLoading: false,
        dounloadProductMargin: false
      };

    default:
      return state
  }
}

export default SapLedgerReducer;