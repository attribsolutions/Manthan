import { RECEIPT_GO_BUTTON_MASTER_SUCCESS, SAVE_RECEIPT_MASTER_SUCCESS, } from "./actionType"


const INIT_STATE = {
  ReceiptGoButton: [],
  postMsg: { Status: false },
}

const ReceiptReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
      return {
        ...state,
        ReceiptGoButton: action.payload,
      }
    case SAVE_RECEIPT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    default:
      return state
  }
}

export default ReceiptReducer