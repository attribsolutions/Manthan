import {
  GO_BUTTON_IMPORT_MASTER_MAP_ADD_SUCCESS,
  SAVE_IMPORT_MASTER_MAP_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton:[],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const ImportMasterMap_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_IMPORT_MASTER_MAP_ADD_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
      }

    // post
    case SAVE_IMPORT_MASTER_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    

    default:
      return state
  }
}

export default ImportMasterMap_Reducer