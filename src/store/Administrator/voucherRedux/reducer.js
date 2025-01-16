import {

  DELETE_VOUCHER_ID,
  DELETE_VOUCHER_ID_SUCCESS,

  EDIT_VOUCHER_ID,
  EDIT_VOUCHER_ID_SUCCESS,

  GET_VOUCHER_LIST,
  GET_VOUCHER_LIST_SUCCESS,

  SAVE_VOUCHER_MASTER,
  SAVE_VOUCHER_SUCCESS,

  UPDATE_VOUCHER_ID,
  UPDATE_VOUCHER_ID_SUCCESS,
  VALIDE_VOUCHER_ID,
  VALIDE_VOUCHER_ID_SUCCESS,
  VOUCHER_ERROR_ACTION
} from "./actionType"

const INIT_STATE = {
  GroupType: [],
  PostData: { Status: false },
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false,
  VoucherValidityData: { Status: false },
  VoucherLoading: false,
}

const VoucherReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_VOUCHER_LIST:
      return {
        ...state,
        goBtnLoading: true,

      }

    case GET_VOUCHER_LIST_SUCCESS:
      return {
        ...state,
        GroupType: action.payload,
        goBtnLoading: false,

      }

    case SAVE_VOUCHER_MASTER:
      return {
        ...state,
        saveBtnloading: true

      }

    case SAVE_VOUCHER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
        saveBtnloading: false

      }


    case EDIT_VOUCHER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }



    case EDIT_VOUCHER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      }


    case VALIDE_VOUCHER_ID:
      return {
        ...state,
        VoucherLoading: true,
      }



    case VALIDE_VOUCHER_ID_SUCCESS:
      return {
        ...state,
        VoucherLoading: false,
        VoucherValidityData: action.payload,
      }

    case UPDATE_VOUCHER_ID:
      return {
        ...state,
        saveBtnloading: true

      }

    case UPDATE_VOUCHER_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      }

    case DELETE_VOUCHER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case DELETE_VOUCHER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMessage: action.payload,
      }

    case VOUCHER_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        goBtnLoading: false
      };


    default:
      return state
  }
}

export default VoucherReducer