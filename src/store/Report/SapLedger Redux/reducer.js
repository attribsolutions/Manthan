import {
  GET_EXCELBUTTON_API,
  GET_EXCELBUTTON_API_SUCCESS,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,

} from "./actionType";

const INIT_STATE = {

  goBtnSapLedger: [],
  ProductMargin: [],
  dounloadProductMargin: false,


}

const SapLedgerReducer = (state = INIT_STATE, action) => {
  
  switch (action.type) {
    // post
    case GO_BUTTON_API_SAP_LEDGER_SUCCESS:
      return {
        ...state,
       
        goBtnSapLedger: action.payload,
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

    default:
      return state
  }
}

export default SapLedgerReducer;