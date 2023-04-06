import { RECEIPT_GO_BUTTON_MASTER_SUCCESS, RECEIPT_MODE_API_SUCCESS } from "./actionType"

  
  const INIT_STATE = {
    ReceiptGoButton: [],
    ReceiptMode:[]
  }
  
  const ReceiptReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
        return {
          ...state,
          ReceiptGoButton: action.payload,
        }
        case RECEIPT_MODE_API_SUCCESS:
          return {
            ...state,
            ReceiptMode: action.payload,
          }
      
      default:
        return state
    }
  }
  
  export default ReceiptReducer