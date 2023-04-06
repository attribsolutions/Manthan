import { RECEIPT_GO_BUTTON_MASTER_SUCCESS } from "./actionType"

  
  const INIT_STATE = {
    ReceiptGoButton: [],
  }
  
  const ReceiptReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
        return {
          ...state,
          ReceiptGoButton: action.payload,
        }
    
      default:
        return state
    }
  }
  
  export default ReceiptReducer