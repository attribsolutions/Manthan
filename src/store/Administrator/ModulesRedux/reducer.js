import {
  DELETE_MODULE_ID_ERROR,
  DELETE_MODULE_ID_SUCCESS,
  EDIT_MODULE_ID_SUCCESS,
  FETCH_MODULES_LIST_ERROR,
  FETCH_MODULES_LIST_SUCCESS,
  POST_MODULES_SUBMIT_ERROR,
  SAVE_MODULE_MASTER_SUCCESS,
  UPDATE_MODULE_ID_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  modulesSubmitSuccesss: { Status: false },
  modulesSubmitError: {},
  modulesList: [],
  modulesListError: {},
  deleteModuleIDSuccess: { Status:false },
  deleteModuleIDError: {},
  editData: { Status: false },
  updateMessage: { Status: false }
}

const Modules = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_MODULE_MASTER_SUCCESS:
      return {
        ...state,
        modulesSubmitSuccesss: action.payload,
      }
    case POST_MODULES_SUBMIT_ERROR:
      return {
        ...state,
        modulesSubmitError: action.payload,
      }
    case FETCH_MODULES_LIST_SUCCESS:
      return {
        ...state,
        modulesList: action.payload,
      }
    case FETCH_MODULES_LIST_ERROR:
      return {
        ...state,
        modulesListError: action.payload,
      }
    case DELETE_MODULE_ID_SUCCESS:
      return {
        ...state,
        deleteModuleIDSuccess: action.payload,
      }
    case DELETE_MODULE_ID_ERROR:
      return {
        ...state,
        deleteModuleIDError: action.payload,
      }
    case EDIT_MODULE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case UPDATE_MODULE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }




    default:
      return state
  }

}

export default Modules