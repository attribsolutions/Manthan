import { DELETE_EMPLOYEE_TYPE_ID, DELETE_EMPLOYEE_TYPE_ID_SUCCESS, EDIT_EMPLOYEE_TYPE_ID, EDIT_EMPLOYEE_TYPE_ID_SUCCESS, GET_EMPLOYEE_TYPE_LIST, GET_EMPLOYEE_TYPE_LIST_SUCCESS, POST_EMPLOYEETYPE_SUBMIT, POST_EMPLOYEETYPE_SUBMIT_SUCCESS, UPDATE_EMPLOYEE_TYPE_ID, UPDATE_EMPLOYEE_TYPE_ID_SUCCESS } from "./actionTypes";

export const PostEmployeeTypeSubmit= (data) => ({
    type: POST_EMPLOYEETYPE_SUBMIT,
    data,
  });
  
  export const PostEmployeeTypeSubmitSuccess = (data) => ({
    type: POST_EMPLOYEETYPE_SUBMIT_SUCCESS,
    payload: data,
  });

 /// get Empoyee list 
 export const getEmployeeTypelist = () => ({
  type: GET_EMPLOYEE_TYPE_LIST,
});

export const getEmployeeTypelistSuccess = (pages) => ({
  type: GET_EMPLOYEE_TYPE_LIST_SUCCESS,
  payload:pages,
});

////delete api
export const delete_EmployeeType_ID = (id) => ({
  type: DELETE_EMPLOYEE_TYPE_ID,
  id ,
  
} );
export const deleteEmployeeTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_EMPLOYEE_TYPE_ID_SUCCESS,
  payload:deleteMessage
});

// edit api
export const editEmployeeTypeId =(id)=>({
  type:EDIT_EMPLOYEE_TYPE_ID,
id,
})
export const editEmployeeTypeSuccess =(editData)=>({
  type:EDIT_EMPLOYEE_TYPE_ID_SUCCESS,
 payload:editData,
})

// update api
export const updateEmployeeTypeID=(updateData,ID)=>({
  type:UPDATE_EMPLOYEE_TYPE_ID,
  updateData,ID,
})
export const updateEmployeeTypeIDSuccess =(updateMessage)=>({
  type:UPDATE_EMPLOYEE_TYPE_ID_SUCCESS,
 payload:updateMessage,
})