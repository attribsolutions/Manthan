import {  CUSTOM_SEARCH_INPUT } from "./actionType"
 const INIT_STATE={
  CustomSearchInput:"",
 }
const CustomSearchReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case CUSTOM_SEARCH_INPUT:
      return {
        ...state,
        CustomSearchInput: action.payload,
      }
    
    default:
      return state
  }
}

export default CustomSearchReducer;