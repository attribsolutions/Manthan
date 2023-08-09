import {
  DISCOUNT_API_ERROR_ACTION,
  DELETE_DISCOUNT_ID,
  DELETE_DISCOUNT_ID_SUCCESS,
  EDIT_DISCOUNT_ID,
  EDIT_DISCOUNT_ID_SUCCESS,
  SAVE_DISCOUNT_SUBMIT,
  SAVE_DISCOUNT_SUBMIT_SUCCESS,
  UPDATE_DISCOUNT_ID,
  UPDATE_DISCOUNT_ID_SUCCESS,
  GO_BUTTON_DISCOUNT_ACTION_SUCCESS,
  GO_BUTTON_DISCOUNT_ACTION,
  GET_DISCOUNT_LIST,
  GET_DISCOUNT_LIST_SUCCESS,
  DISCOUNT_PARTY_TYPE_DROPDOWN_SUCCESS,
  DISCOUNT_PARTY_TYPE_DROPDOWN_ACTION,
  DISCOUNT_CUSTOMER_DROPDOWN_ACTION,
  DISCOUNT_CUSTOMER_DROPDOWN_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  gobtnDiscount_redux: [],
  discountList: [],
  editData: { Status: false },
  deleteMsg: { Status: false },
  postMsg: { Status: false },
  updateMessage: { Status: false },
  partyType: [],
  customer: [],

  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false,
  partyTypeDropDownLoading: false,
  customerDropDownLoading: false,
}

const DiscountReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_DISCOUNT_ACTION:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GO_BUTTON_DISCOUNT_ACTION_SUCCESS:
      return {
        ...state,
        gobtnDiscount_redux: action.payload,
        goBtnLoading: false,
      }

    case GET_DISCOUNT_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }
    case GET_DISCOUNT_LIST_SUCCESS:
      return {
        ...state,
        discountList: action.payload,
        goBtnLoading: false,
      }

    case SAVE_DISCOUNT_SUBMIT:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_DISCOUNT_SUBMIT_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    case DELETE_DISCOUNT_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case DELETE_DISCOUNT_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      }

    case EDIT_DISCOUNT_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case EDIT_DISCOUNT_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      }

    case UPDATE_DISCOUNT_ID:
      return {
        ...state,
        saveBtnloading: true
      }

    case UPDATE_DISCOUNT_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false
      }

    case DISCOUNT_PARTY_TYPE_DROPDOWN_ACTION:
      return {
        ...state,
        partyTypeDropDownLoading: true
      }

    case DISCOUNT_PARTY_TYPE_DROPDOWN_SUCCESS:
      return {
        ...state,
        partyType: action.payload,
        partyTypeDropDownLoading: false
      }

    case DISCOUNT_CUSTOMER_DROPDOWN_ACTION:
      return {
        ...state,
        customerDropDownLoading: true
      }

    case DISCOUNT_CUSTOMER_DROPDOWN_SUCCESS:
      return {
        ...state,
        customer: action.payload,
        customerDropDownLoading: false
      }

    case DISCOUNT_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        goBtnLoading: false,
        partyTypeDropDownLoading: false,
        customerDropDownLoading: false
      };


    default:
      return state
  }

}

export default DiscountReducer