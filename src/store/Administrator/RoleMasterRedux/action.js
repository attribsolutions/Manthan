import { UPDATE_H_PAGES_SUCCESS } from "../HPagesRedux/actionType";
import {
    POST_ROLE_MASTER,
    POST_ROLE_MASTER_SUCCESS,
    DELETE_ROLE_LIST_ID,
    EDIT_ROLE_LIST_ID,
    UPDATE_ROLE_LIST_ID,
    GET_ROLE_LIST_API,
    GET_ROLE_LIST_API_SUCCESS,
    UPDATE_ROLE_LIST_ID_SUCCESS,
    DELETE_ROLE_LIST_ID_SUCCESS,
    EDIT_ROLE_LIST_ID_SUCCESS,
} from "./actionTypes"

// get api
export const getRole = () => ({
    type: GET_ROLE_LIST_API,
});

export const getRoleSuccess = (data) => ({
    type: GET_ROLE_LIST_API_SUCCESS,
    payload:data,
});

// post api
export const postRole = (Data,id) => ({
    type: POST_ROLE_MASTER,
    Data,id
  });
  
  export const PostSuccess = (AddUserMessage) => ({
    type: POST_ROLE_MASTER_SUCCESS,
    payload: AddUserMessage,
  });

  // delete api
  export const deleteRole = (id) => ({
    type: DELETE_ROLE_LIST_ID,
    id ,
    
  } );
  export const deleteSuccess = (deleteMessage) => ({
    type: DELETE_ROLE_LIST_ID_SUCCESS,
    payload:deleteMessage
  });
  
  // edit api
  export const editRoleId =(id,pageMode)=>({
    type:EDIT_ROLE_LIST_ID,
    id,pageMode
  })
  export const editSuccess =(editData)=>({
    type:EDIT_ROLE_LIST_ID_SUCCESS,
   payload:editData,
  })

  // update api
  export const updateID=(updateData,ID)=>({
    type:UPDATE_ROLE_LIST_ID,
    updateData,ID,
  })
  export const updateSuccess =(updateMessage)=>({
    type:UPDATE_ROLE_LIST_ID_SUCCESS,
   payload:updateMessage,
  })

  