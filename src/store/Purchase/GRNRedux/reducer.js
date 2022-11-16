import {  GET_GRN_LIST_PAGE_SUCCESS,  } from "./actionType"

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  GRNList: []


}

const GRNReducer = (state = INIT_STATE, action) => {
  switch (action.type) {



    // case POST_GRN_FROM_GRN_PAGE_SUCCESS:
    //   return {
    //     ...state,
    //     postMsg: action.payload,
    //   }


    // case EDIT_GRN_FOR_GRN_PAGE_SUCCESS:
    //   return {
    //     ...state,
    //     editData: action.payload,
    //   }

    // case UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS:
    //   return {
    //     ...state,
    //     updateMsg: action.payload,
    //   }

    // case DELETE_GRN_FOR_GRN_PAGE_SUCCESS:
    //   return {
    //     ...state,
    //     deleteMsg: action.payload,
    //   }

    // GRN List Page 
    case GET_GRN_LIST_PAGE_SUCCESS:
      return {
        ...state,
        GRNList: action.payload,
      }
    default:
      return state
  }

}

export default GRNReducer