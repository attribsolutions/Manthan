import {
    GET_DESIGNATIONID , GET_DESIGNATIONID_SUCCESS,
    GET_EMPLOYEETYPE, GET_EMPLOYEETYPE_SUCCESS,
    GET_STATE, GET_STATE_SUCCESS,
    GET_REGION, GET_REGION_SUCCESS,
    POST_EMPLOYEE_SUCCESS, POST_EMPLOYEE,
    GET_COMPANY, GET_COMPANY_SUCCESS,
    GET_EMPLOYEE_LIST,GET_EMPLOYEE_LIST_SUCCESS,
    DELETE_EMPLOYEE_ID, DELETE_EMPLOYEE_ID_SUCCESS,
    EDIT_EMPLOYEE_ID, EDIT_EMPLOYEE_ID_SUCCESS,
    UPDATE_EMPLOYEE_ID, UPDATE_EMPLOYEE_ID_SUCCESS
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

   ///Region  dropdown
export const getRegion = () => ({
    type: GET_REGION,
   
  });
  export const getRegionSuccess = (Region) => ({
    type: GET_REGION_SUCCESS,
    payload:Region,
  });

  export const getCompany = () => ({
    type: GET_COMPANY
   
  });
  export const getCompanySuccess = (Company) => ({
    type: GET_COMPANY_SUCCESS,
    payload:Company,
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
  
  ///// edit api
  export const editEmployeeeId =(id)=>({
    type:EDIT_EMPLOYEE_ID,
  id,
  })
  export const editEmployeeSuccess =(editData)=>({
    type:EDIT_EMPLOYEE_ID_SUCCESS,
   payload:editData,
  })

  /// update api
  export const updateEmployeeID=(data,id)=>({
    type:UPDATE_EMPLOYEE_ID,
    data,id,
  })
  export const updateEmployeeIDSuccess =(updateMessage)=>({
    type:UPDATE_EMPLOYEE_ID_SUCCESS,
   payload:updateMessage,
  })
