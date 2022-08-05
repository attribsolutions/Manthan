import { POST_PARTYTYPES_SUBMIT, POST_PARTYTYPES_SUBMIT_SUCCESS } from "./actionTypes";

export const PostPartyTypesSubmit= (data) => ({
    type: POST_PARTYTYPES_SUBMIT,
    data,
  });
  
  export const PostPartyTypesSubmitSuccess = (PartyTypes) => ({
    type: POST_PARTYTYPES_SUBMIT_SUCCESS,
    payload: PartyTypes,
  });