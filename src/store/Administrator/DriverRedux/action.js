import {
    POST_METHOD_FOR_DRIVER_MASTER,
    POST_METHOD_FOR_DRIVER_MASTER_SUCCESS,
    GET_METHOD_FOR_DRIVER_LIST,
    GET_METHOD_FOR_DRIVER_LIST_SUCCESS,
    DELETE_DRIVER_TYPE_ID,
   DELETE_DRIVER_TYPE_ID_SUCCESS,
  EDIT_DRIVER_TYPE_ID,
  EDIT_DRIVER_TYPE_ID_SUCCESS,
  UPDATE_DRIVER_TYPE_ID,
  UPDATE_DRIVER_TYPE_ID_SUCCESS

} from "./actionType";

export const PostMethodForDriverMaster= (data) => ({
   type: POST_METHOD_FOR_DRIVER_MASTER,
   data,
 });

 export const PostMethod_ForDriverMasterSuccess = (data) => ({
   type: POST_METHOD_FOR_DRIVER_MASTER_SUCCESS,
   payload: data,
 });
 
 // get method DriverList
 export const getMethodForDriverList = (data) => ({
   type: GET_METHOD_FOR_DRIVER_LIST,
   data,
 });
 
 export const getMethod_ForDriverListSuccess = (data) => ({
   type: GET_METHOD_FOR_DRIVER_LIST_SUCCESS,
   payload: data,
 });
   

 ////delete api
export const delete_DriverType_ID = (id) => ({
 type: DELETE_DRIVER_TYPE_ID,
 id,

});
export const deleteDriverTypeIDSuccess = (deleteMessage) => ({
 type: DELETE_DRIVER_TYPE_ID_SUCCESS,
 payload: deleteMessage
});

// edit api
export const editDriverTypeId = (id,pageMode) => ({
 type: EDIT_DRIVER_TYPE_ID,
 id,pageMode
})
export const editDriverTypeSuccess = (editData) => ({
 type: EDIT_DRIVER_TYPE_ID_SUCCESS,
 
 payload: editData,
})

// update api
export const updateDriverTypeID = (updateData, ID) => ({
 type: UPDATE_DRIVER_TYPE_ID,
 updateData, ID,
})
export const updateDriverTypeIDSuccess = (updateMessage) => ({
 type: UPDATE_DRIVER_TYPE_ID_SUCCESS,
 payload: updateMessage,
})

export const reset = () => ({
  type: "RESET_ALL",
 })