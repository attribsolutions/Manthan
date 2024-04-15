import { ADD_POS_USER, ADD_POS_USER_SUCCESS, DELETE_POS_USER_ACTION, DELETE_POS_USER_ACTION_SUCCESS, EDIT_POS_USER_ACTION, EDIT_POS_USER_ACTION_SUCCESS, GET_POS_ROLE_SUCCESS, GET_POS_USER_LIST, GET_POS_USER_LIST_SUCCESS, POS_USER_API_ERROR_ACTION, UPDATE_POS_USER_ACTION, UPDATE_POS_USER_ACTION_SUCCESS } from './actionType'

const INIT_STATE = {
  POSRole: [],
  postMsg: { Status: false },
  List: [],
  deleteSuccessRole: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  userPartiesForUserMaster: [],
  saveBtnloading: false,
  listBtnLoading: false,
  loading:false
};

const POS_User_Registration_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_POS_ROLE_SUCCESS:
      return {
        ...state,
        POSRole: action.payload,
      };

    case ADD_POS_USER:
      return {
        ...state,
        saveBtnloading: true,

      };

    case ADD_POS_USER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      };

    //// get Registration api

    case GET_POS_USER_LIST:
      return {
        ...state,
        loading: true,
      }

    case GET_POS_USER_LIST_SUCCESS:
      return {
        ...state,
        List: action.payload,
        loading: false,
      }

    //// delete api

    case DELETE_POS_USER_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_POS_USER_ACTION_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteSuccessRole: action.payload,
      };

    //// edit api

    case EDIT_POS_USER_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_POS_USER_ACTION_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    //// update api
    case UPDATE_POS_USER_ACTION:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_POS_USER_ACTION_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,

      };

    case POS_USER_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        loading:false
      };
    default:
      return state;
  }
};

export default POS_User_Registration_Reducer;
