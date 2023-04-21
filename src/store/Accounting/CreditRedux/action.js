import {
  CREDITDEBIT_TYPE,
  CREDITDEBIT_TYPE_SUCCESS,
  DELETE_GROUP_LIST_ID,
  DELETE_GROUP_LIST_ID_SUCCESS,
  EDIT_GROUPMASTER_ID,
  EDIT_GROUPMASTER_ID_SUCCESS,
  GET_CREDIT_LIST,
  GET_CREDIT_LIST_SUCCESS,
  GET_GROUP_LIST,
  GET_GROUP_LIST_SUCCESS,
  SAVE_CREDIT,
  SAVE_CREDIT_SUCCESS,
  SAVE_GROUP_MASTER,
  SAVE_GROUP_MASTER_SUCCESS,
  UPDATE_GROUPMASTER_ID,
  UPDATE_GROUPMASTER_ID_SUCCESS
} from "./actionType";


export const GetCreditList = (data) => ({// get List Action
  type: GET_CREDIT_LIST,
  data
});

export const GetCreditListSuccess = (resp) => ({// get List success
  type: GET_CREDIT_LIST_SUCCESS,
  payload: resp,
});

export const saveCredit = (config={}) => ({// save Action
  type: SAVE_CREDIT,
  config,
});

export const saveCredit_Success = (resp) => ({// Save  success
  type: SAVE_CREDIT_SUCCESS,
  payload: resp,
});

export const CredietDebitType = (data) => ({ // Edit Action 
  type: CREDITDEBIT_TYPE,
  data,
});

export const CredietDebitTypeSuccess = (resp) => ({// Edit  Success
  type: CREDITDEBIT_TYPE_SUCCESS,
  payload: resp,
});

// export const updateGroupID = (config = {}) => ({// update  Action
//   type: UPDATE_GROUPMASTER_ID,
//   config,
// });

// export const updateGroupIDSuccess = (resp) => ({ //Update Success
//   type: UPDATE_GROUPMASTER_ID_SUCCESS,
//   payload: resp,
// })

// export const delete_GroupList_ID = (config={}) => ({// Delete  Action
//   type: DELETE_GROUP_LIST_ID,
//   config,
// });

// export const deleteGrouplistSuccess = (resp) => ({// Delete Success
//   type: DELETE_GROUP_LIST_ID_SUCCESS,
//   payload: resp
// });




