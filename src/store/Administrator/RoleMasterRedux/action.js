import {
    GET_Role_API,
    GET_Role_API_SUCCESS,
    POST_ROLE,
    POST_SUCCESS,
    DELETE_ROLE,
    DELETE_SUCCESS,
    EDIT_ROLE,
    EDIT_SUCCESS,
    UPDATE_SUCCESS,
    UPDATE_ROLE,
} from "./actionTypes"

// get api
export const getRole = () => ({
    type: GET_Role_API,
});

export const getRoleSuccess = (pages) => ({
    type: GET_Role_API_SUCCESS,
    payload:pages,
});

// post api
export const postRole = (Data,id) => ({
    type: POST_ROLE,
    Data,id
  });
  
  export const PostSuccess = (AddUserMessage) => ({
    type: POST_SUCCESS,
    payload: AddUserMessage,
  });

  // delete api
  export const deleteRole = (id) => ({
    type: DELETE_ROLE,
    id ,
    
  } );
  export const deleteSuccess = (deleteMessage) => ({
    type: DELETE_SUCCESS,
    payload:deleteMessage
  });
  
  // edit api
  export const editRoleId =(id)=>({
    type:EDIT_ROLE,
    id,
  })
  export const editSuccess =(editData)=>({
    type:EDIT_SUCCESS,
   payload:editData,
  })

  // update api
  export const updateID=(updateData,ID)=>({
    type:UPDATE_ROLE,
    updateData,ID,
  })
  export const updateSuccess =(updateMessage)=>({
    type:UPDATE_SUCCESS,
   payload:updateMessage,
  })

  