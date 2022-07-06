import{GET_EMPLOYEE, 
    GET_EMPLOYEE_SUCCESS,
    GET_ROLE, 
    GET_ROLE_SUCCESS,
    ADD_USER, 
    ADD_USER_SUCCESS,
    GET_USER,
    GET_USER_SUCCESS,
    DELETE_USER,
    DELETE_SUCCESS,
    EDIT_USER,
    EDIT_SUCCESS,
    UPDATE_USER,
    UPDATE_SUCCESS,
  }from './actionType'

  /// M_Employee
  export const getEmployee = () => ({
    type: GET_EMPLOYEE,
   
  });
  export const getEmployeeSuccess = (data) => ({
    type: GET_EMPLOYEE_SUCCESS,
    payload:data,
  });
  
  /// M_Roles
  export const getRoles = () => ({
    type: GET_ROLE,
   
  });
  export const getRolesSuccess = (data) => ({
    type: GET_ROLE_SUCCESS,
    payload:data,
  });
   
  /// Registration Post api
  export const addUser = (data) => ({
    type: ADD_USER,
    data,
  });
  
  export const addUserSuccess = (data) => ({
    type: ADD_USER_SUCCESS,
    payload: data,
  });
  
  //get Registration api
  export const getUser = () => ({
    type: GET_USER,
  });
  
  export const getUserSuccess = (data) => ({
    type: GET_USER_SUCCESS,
    payload:data,
  });
  
   ////delete api
   export const deleteUser = (id) => ({
    type: DELETE_USER,
    id ,
    
  });
  export const deleteSuccess = (data) => ({
    type: DELETE_SUCCESS,
    payload:data
  });
  
  ///// edit api
  export const editUserId =(id)=>({
    type:EDIT_USER,
  id,
  })
  export const editSuccess =(data)=>({
    type:EDIT_SUCCESS,
   payload:data,
  });
  
   /// update api
  
  export const updateID = (data,id) => ({
    type: UPDATE_USER,
    data,id
  });
  export const updateSuccess = (data) => ({
    type: UPDATE_SUCCESS,
    payload: data,
  });