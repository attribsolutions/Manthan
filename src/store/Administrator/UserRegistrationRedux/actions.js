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
  export const getRolesSuccess = (Roles) => ({
    type: GET_ROLE_SUCCESS,
    payload:Roles,
  });
   
  /// Registration Post api
  export const addUser = (Data) => ({
    type: ADD_USER,
    Data,
  });
  
  export const addUserSuccess = (AddUserMessage) => ({
    type: ADD_USER_SUCCESS,
    payload: AddUserMessage,
  });
  
  //get Registration api
  export const getUser = () => ({
    type: GET_USER,
  });
  
  export const getUserSuccess = (pages) => ({
    type: GET_USER_SUCCESS,
    payload:pages,
  });
  
   ////delete api
   export const deleteUser = (id) => ({
    type: DELETE_USER,
    id ,
    
  });
  export const deleteSuccess = (deleteMessage) => ({
    type: DELETE_SUCCESS,
    payload:deleteMessage
  });
  
  ///// edit api
  export const editUserId =(id)=>({
    type:EDIT_USER,
  id,
  })
  export const editSuccess =(editData)=>({
    type:EDIT_SUCCESS,
   payload:editData,
  });
  
   /// update api
  
  export const updateID = (data,id) => ({
    type: UPDATE_USER,
    data,id
  });
  export const updateSuccess = (updateMessage) => ({
    type: UPDATE_SUCCESS,
    payload: updateMessage,
  });