import {
    POST_METHOD_FOR_PARTYSUBPARTY_API,
    POST_METHOD_FOR_PARTYSUBPARTY_API_SUCCESS,
  } from "./actionType";

  export const PostMethodForPartySubParty = (data) => ({
    type: POST_METHOD_FOR_PARTYSUBPARTY_API,
    data,
  });
  
  export const PostMethod_ForPartySubPartyAPISuccess = (data) => ({
    type: POST_METHOD_FOR_PARTYSUBPARTY_API_SUCCESS,
    payload: data,
  });

 