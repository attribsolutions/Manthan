import {
  SAVE_POS_ROLEACCESS,
  SAVE_POS_ROLEACCESS_SUCCESS,
  GET_POS_ROLEACCESS_SUCCESS,
  GET_POS_ROLEACCESS,
  POS_ROLEACCESS_ERROR
} from "./actionTypes";

const INIT_STATE = {
  postMsg: { Status: false },
  PosRoleAccessListData: [],
  listBtnLoading: false,
  saveBtnloading: false
}

const PosRoleAccessReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_POS_ROLEACCESS:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_POS_ROLEACCESS_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    // get api
    case GET_POS_ROLEACCESS:
      return {
        ...state,
        listBtnLoading: true,
      }

    case GET_POS_ROLEACCESS_SUCCESS:
      return {
        ...state,
        PosRoleAccessListData: action.payload,
        listBtnLoading: false,
      }

    case POS_ROLEACCESS_ERROR:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default PosRoleAccessReducer;





