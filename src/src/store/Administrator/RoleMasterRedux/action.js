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

export const getRole = () => ({  // get List Action
    type: GET_ROLE_LIST_API,
});

export const getRoleSuccess = (data) => ({// get List success
    type: GET_ROLE_LIST_API_SUCCESS,
    payload:data,
});

export const postRole = (config={}) => ({ // save Action   id reqired
    type: POST_ROLE_MASTER,
    config
  });
  
  export const PostSuccess = (resp) => ({// Save  success
    type: POST_ROLE_MASTER_SUCCESS,
    payload: resp,
  });

  export const editRoleId =(config = {})=>({// Edit Action  page mode/id required
    type:EDIT_ROLE_LIST_ID,
    config ,
  })

  export const editSuccess =(editData)=>({// Edit  Success
    type:EDIT_ROLE_LIST_ID_SUCCESS,
   payload:editData,
  })

  export const updateID=(config = {})=>({// update  Action updated data/id
    type:UPDATE_ROLE_LIST_ID,
    config,
  })
  export const updateSuccess =(resp)=>({//Update Success
    type:UPDATE_ROLE_LIST_ID_SUCCESS,
   payload:resp,
  })

  export const deleteRole = (config={}) => ({// Delete  Action id required
    type: DELETE_ROLE_LIST_ID,
    config ,
    
  } );

  export const deleteSuccess = (resp) => ({// Delete Success
    type: DELETE_ROLE_LIST_ID_SUCCESS,
    payload:resp
  });

  