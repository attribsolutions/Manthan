import {
  DELETE_EMPLOYEE_TYPE_ID,
  DELETE_EMPLOYEE_TYPE_ID_SUCCESS,
  EDIT_EMPLOYEE_TYPE_ID,
  EDIT_EMPLOYEE_TYPE_ID_SUCCESS,
  EMPLOYEE_TYPE_API_ERROR_ACTION,
  GET_EMPLOYEE_TYPE_LIST,
  GET_EMPLOYEE_TYPE_LIST_SUCCESS,
  POST_EMPLOYEETYPE_SUBMIT,
  POST_EMPLOYEETYPE_SUBMIT_SUCCESS,
  UPDATE_EMPLOYEE_TYPE_ID,
  UPDATE_EMPLOYEE_TYPE_ID_SUCCESS
} from "./actionTypes";


export const getEmployeeTypelist = () => ({  // get List Action
  type: GET_EMPLOYEE_TYPE_LIST,
});

export const getEmployeeTypelistSuccess = (pages) => ({ // get List success
  type: GET_EMPLOYEE_TYPE_LIST_SUCCESS,
  payload: pages,
});

export const PostEmployeeTypeSubmit = (config = {}) => ({  // save Action
  type: POST_EMPLOYEETYPE_SUBMIT,
  config,
});

export const PostEmployeeTypeSubmitSuccess = (resp) => ({  // Save  success
  type: POST_EMPLOYEETYPE_SUBMIT_SUCCESS,
  payload: resp,
});

export const editEmployeeTypeId = (config = {}) => ({   // Edit Action 
  type: EDIT_EMPLOYEE_TYPE_ID,
  config,
})

export const editEmployeeTypeSuccess = (editData) => ({ // Edit  Success
  type: EDIT_EMPLOYEE_TYPE_ID_SUCCESS,
  payload: editData,
})

export const updateEmployeeTypeID = (config = {}) => ({ // update  Action
  type: UPDATE_EMPLOYEE_TYPE_ID,
  config,
})

export const updateEmployeeTypeIDSuccess = (updateMessage) => ({ //Update Success
  type: UPDATE_EMPLOYEE_TYPE_ID_SUCCESS,
  payload: updateMessage,
})

export const delete_EmployeeType_ID = (config = {}) => ({  // Delete  Action
  type: DELETE_EMPLOYEE_TYPE_ID,
  config,

});

export const deleteEmployeeTypeIDSuccess = (resp) => ({   // Delete Success
  type: DELETE_EMPLOYEE_TYPE_ID_SUCCESS,
  payload: resp
});

export const EmployeeTypeApiErrorAction = () => ({
  type: EMPLOYEE_TYPE_API_ERROR_ACTION,
})