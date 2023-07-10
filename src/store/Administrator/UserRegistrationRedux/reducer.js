import {
  ADD_USER_SUCCESS,
  GET_USER_LIST_FOR_USER_SUCCESS,
  UPDATE_USER_ACTION_SUCCESS,
  EDIT_USER_ACTION_SUCCESS,
  DELETE_USER_ACTION_SUCCESS,
  GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
  GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
  ADD_USER,
  UPDATE_USER_ACTION,
  GET_USER_LIST_FOR_USER,
  USER_API_ERROR_ACTION,
  DELETE_USER_ACTION,
  EDIT_USER_ACTION,
} from './actionType'

const INIT_STATE = {
  employeelistForDropdown: [],
  postMsg: { Status: false },
  pages: [],
  deleteSuccessRole: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  userPartiesForUserMaster: [],
  saveBtnloading: false,
  listBtnLoading: false,
  loading:false
};

const User_Registration_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS:
      return {
        ...state,
        employeelistForDropdown: action.payload,
      };

    case ADD_USER:
      return {
        ...state,
        saveBtnloading: true,

      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      };

    //// get Registration api

    case GET_USER_LIST_FOR_USER:
      return {
        ...state,
        loading: true,
      }

    case GET_USER_LIST_FOR_USER_SUCCESS:
      return {
        ...state,
        pages: action.payload,
        loading: false,
      }

    //// delete api

    case DELETE_USER_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_USER_ACTION_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteSuccessRole: action.payload,
      };

    //// edit api

    case EDIT_USER_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_USER_ACTION_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    //// update api
    case UPDATE_USER_ACTION:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_USER_ACTION_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,

      };

    case GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS:
      return {
        ...state,
        userPartiesForUserMaster: action.payload,
      };

    case USER_API_ERROR_ACTION:
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

export default User_Registration_Reducer;
