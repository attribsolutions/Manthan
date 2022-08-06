import {  POST_PARTYTYPES_SUBMIT_SUCCESS } from "./actionTypes"

const INIT_STATE = {
    PartyType: [],
   
  }
  
  const PartyTypesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_PARTYTYPES_SUBMIT_SUCCESS:
        return {
          ...state,
          PartyType: action.payload,
        }
       
      default:
        return state
    }
  }
  
  export default PartyTypesReducer