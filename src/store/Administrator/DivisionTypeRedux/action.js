import { POST_EMPLOYEETYPE_SUBMIT, POST_EMPLOYEETYPE_SUBMIT_SUCCESS } from "./actionTypes";

export const PostDivision= (data) => ({
    type: POST_EMPLOYEETYPE_SUBMIT,
    data,
  });
  
  export const PostEmployeeTypeSubmitSuccess = (EmployeeType) => ({
    type: POST_EMPLOYEETYPE_SUBMIT_SUCCESS,
    payload: EmployeeType,
  });