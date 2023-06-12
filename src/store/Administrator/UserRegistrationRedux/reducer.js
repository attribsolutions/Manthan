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
} from './actionType'

const INIT_STATE = {
  employeelistForDropdown: [],
  AddUserMessage: { Status: false },
  pages: [],
  deleteSuccessRole: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  userPartiesForUserMaster: [],
  saveBtnloading: false,
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
        AddUserMessage: action.payload,
        saveBtnloading: false,

      };

    //// get Registration api
    case GET_USER_LIST_FOR_USER_SUCCESS:
      return {
        ...state,
        pages: action.payload,
      }

    //// delete api
    case DELETE_USER_ACTION_SUCCESS:
      return {
        ...state,
        deleteSuccessRole: action.payload,
      };

    //// edit api
    case EDIT_USER_ACTION_SUCCESS:
      return {
        ...state,
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
    default:
      return state;
  }
};

export default User_Registration_Reducer;
