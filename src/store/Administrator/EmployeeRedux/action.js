import {
  GET_DESIGNATIONID, GET_DESIGNATIONID_SUCCESS,
  GET_STATE, GET_STATE_SUCCESS,
  SAVE_EMPLOYEE_MASTER_SUCCESS, SAVE_EMPLOYEE_MASTER,
  GET_EMPLOYEE_LIST, GET_EMPLOYEE_LIST_SUCCESS,
  DELETE_EMPLOYEE_ID, DELETE_EMPLOYEE_ID_SUCCESS,
  EDIT_EMPLOYEE_ID, EDIT_EMPLOYEE_ID_SUCCESS,
  UPDATE_EMPLOYEE_ID, UPDATE_EMPLOYEE_ID_SUCCESS,
  GET_COMPANYNAME_BY_EMPLOYEETYPES_ID,
  GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS,
  GET_CITY_ON_DISTRICT,
  GET_CITY_ON_DISTRICT_SUCCESS

} from "./actionTypes"


///DesignationID  dropdown
export const getDesignationID = () => ({
  type: GET_DESIGNATIONID,
});

export const getDesignationIDSuccess = (DesignationID) => ({
  type: GET_DESIGNATIONID_SUCCESS,
  payload: DesignationID,
});

///State  dropdown
export const getState = () => ({
  type: GET_STATE,
});

export const getStateESuccess = (State) => ({
  type: GET_STATE_SUCCESS,
  payload: State,
});

// GetCityOnDistrict API dependent on state api
export const getCityOnDistrict = (id) => ({
  type: GET_CITY_ON_DISTRICT,
  id,

});

export const getCityOnDistrictSuccess = (DistrictId) => ({
  type: GET_CITY_ON_DISTRICT_SUCCESS,
  payload: DistrictId,
});


///post api
export const saveEmployeeAction = (config) => ({
  type: SAVE_EMPLOYEE_MASTER,
  config,
});

export const PostEmployeeSuccess = (resp) => ({
  type: SAVE_EMPLOYEE_MASTER_SUCCESS,
  payload: resp,
});

/// get Empoyee list 
export const getEmployeelist = (jsonbody) => ({
  type: GET_EMPLOYEE_LIST,
  jsonbody,
});

export const getEmployeelistSuccess = (pages) => ({
  type: GET_EMPLOYEE_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_Employee_ID = (config) => ({
  type: DELETE_EMPLOYEE_ID,
  config,

});
export const deleteEmployeeIDSuccess = (resp) => ({
  type: DELETE_EMPLOYEE_ID_SUCCESS,
  payload: resp
});

// edit api
export const editEmployeeeId = (config) => ({
  type: EDIT_EMPLOYEE_ID,
  config,
})
export const editEmployeeSuccess = (editData) => ({
  type: EDIT_EMPLOYEE_ID_SUCCESS,
  payload: editData,
})

// update api
export const updateEmployeeAction = (config) => ({
  type: UPDATE_EMPLOYEE_ID,
  config,
})
export const updateEmployeeIDSuccess = (resp) => ({
  type: UPDATE_EMPLOYEE_ID_SUCCESS,
  payload: resp,
})


// Company Name API dependent on Employee Types api
export const Get_CompanyName_By_EmployeeTypeID = (id) => ({
  type: GET_COMPANYNAME_BY_EMPLOYEETYPES_ID,
  id,

});
export const Get_CompanyName_By_EmployeeTypeID_Success = (data) => ({
  type: GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS,
  payload: data,
});

