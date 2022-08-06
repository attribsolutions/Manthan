import { DELETE_DIVISION_TYPE_ID, DELETE_DIVISION_TYPE_ID_SUCCESS, EDIT_DIVISION_TYPE_ID, EDIT_DIVISION_TYPE_ID_SUCCESS, GET_DIVISION_TYPE_LIST, GET_DIVISION_TYPE_LIST_SUCCESS, POST_DIVISION_TYPE_API, POST_DIVISION_TYPE_API_SUCCESS, UPDATE_DIVISION_TYPE_ID, UPDATE_DIVISION_TYPE_ID_SUCCESS } from "./actionType";

export const PostDivisionTypeAPI= (data) => ({
    type: POST_DIVISION_TYPE_API,
    data,
  });
  
  export const PostDivisionTypeSuccess = (data) => ({
    type: POST_DIVISION_TYPE_API_SUCCESS,
    payload: data,
  });
  /// get Empoyee list 
 export const getDivisionTypelist = () => ({
  type: GET_DIVISION_TYPE_LIST,
});

export const getDivisionTypelistSuccess = (pages) => ({
  type: GET_DIVISION_TYPE_LIST_SUCCESS,
  payload:pages,
});

////delete api
export const delete_DivisionType_ID = (id) => ({
  type: DELETE_DIVISION_TYPE_ID,
  id ,
  
} );
export const deleteDivisionTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_DIVISION_TYPE_ID_SUCCESS,
  payload:deleteMessage
});

// edit api
export const editDivisionTypeId =(id)=>({
  type:EDIT_DIVISION_TYPE_ID,
id,
})
export const editDivisionTypeSuccess =(editData)=>({
  type:EDIT_DIVISION_TYPE_ID_SUCCESS,
 payload:editData,
})

// update api
export const updateDivisionTypeID=(updateData,ID)=>({
  type:UPDATE_DIVISION_TYPE_ID,
  updateData,ID,
})
export const updateDivisionTypeIDSuccess =(updateMessage)=>({
  type:UPDATE_DIVISION_TYPE_ID_SUCCESS,
 payload:updateMessage,
})