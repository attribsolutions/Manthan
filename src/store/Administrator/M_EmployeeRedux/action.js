import {
    GET_DESIGNATIONID , GET_DESIGNATIONID_SUCCESS,
    GET_EMPLOYEETYPE, GET_EMPLOYEETYPE_SUCCESS,
    GET_STATE, GET_STATE_SUCCESS,
    POST_EMPLOYEE_SUCCESS, POST_EMPLOYEE,
    GET_EMPLOYEE_LIST,GET_EMPLOYEE_LIST_SUCCESS,
    DELETE_EMPLOYEE_ID, DELETE_EMPLOYEE_ID_SUCCESS,
    EDIT_EMPLOYEE_ID, EDIT_EMPLOYEE_ID_SUCCESS,
    UPDATE_EMPLOYEE_ID, UPDATE_EMPLOYEE_ID_SUCCESS,GET_COMPANYNAME_BY_EMPLOYEETYPES_ID, GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS, GET_PARTYNAME_BY_DIVISIONTYPES_ID, GET_PARTYNAME_BY_DIVISIONTYPES_ID_SUCCESS
} from "./actionTypes"


///DesignationID  dropdown
export const getDesignationID = () => ({
    type: GET_DESIGNATIONID,
   
  });
  export const getDesignationIDSuccess = (DesignationID) => ({
    type: GET_DESIGNATIONID_SUCCESS,
    payload:DesignationID,
  });

  ///EmployeeType  dropdown
export const getEmployeeType = () => ({
    type: GET_EMPLOYEETYPE,
   
  });
  export const getEmployeeTypeESuccess = (EmployeeType) => ({
    type: GET_EMPLOYEETYPE_SUCCESS,
    payload:EmployeeType,
  });

   ///State  dropdown
export const getState = () => ({
    type: GET_STATE,
   
  });
  export const getStateESuccess = (State) => ({
    type: GET_STATE_SUCCESS,
    payload:State,
  });


  ///post api
  export const postEmployee = (Data,id) => ({
    type: POST_EMPLOYEE,
    Data,id
  });
  
  export const PostEmployeeSuccess = (AddUserMessage) => ({
    type: POST_EMPLOYEE_SUCCESS,
    payload: AddUserMessage,
  });
  
/// get Empoyee list 
  export const getEmployeelist = () => ({
    type: GET_EMPLOYEE_LIST,
});

export const getEmployeelistSuccess = (pages) => ({
    type: GET_EMPLOYEE_LIST_SUCCESS,
    payload:pages,
});

////delete api
export const delete_Employee_ID = (id) => ({
    type: DELETE_EMPLOYEE_ID,
    id ,
    
  } );
  export const deleteEmployeeIDSuccess = (deleteMessage) => ({
    type: DELETE_EMPLOYEE_ID_SUCCESS,
    payload:deleteMessage
  });
  
  // edit api
  export const editEmployeeeId =(id)=>({
    type:EDIT_EMPLOYEE_ID,
  id,
  })
  export const editEmployeeSuccess =(editData)=>({
    type:EDIT_EMPLOYEE_ID_SUCCESS,
   payload:editData,
  })

  // update api
  export const updateEmployeeID=(updateData,ID)=>({
    type:UPDATE_EMPLOYEE_ID,
    updateData,ID,
  })
  export const updateEmployeeIDSuccess =(updateMessage)=>({
    type:UPDATE_EMPLOYEE_ID_SUCCESS,
   payload:updateMessage,
  })


// Company Name API dependent on Employee Types api
export const Get_CompanyName_By_EmployeeTypeID = (id) => ({
  type: GET_COMPANYNAME_BY_EMPLOYEETYPES_ID,
  id,
 
});
export const Get_CompanyName_By_EmployeeTypeID_Success = (data) => ({
  type: GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS,
  payload:data,
});

 