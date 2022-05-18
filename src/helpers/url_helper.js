//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//ORDERS
export const GET_ORDER = "/Order/GetItemListByDivisionID?DivisionID=3"
export const SUBMIT_ORDER_PAGE = "/Order/AddOrder"
export const GET_ORDER_LIST = "/Order/GetOrderlistByDivisionID"
export const EDIT_ORDER_ID ="/Order/GetItemListByDivisionID?DivisionID=3"

//Python Logic 
export const POST_JWT_LOGIN = "/Login"

//ADMINISTRATOR   **** Modules
// Moduls Submit  Method URL
export const SUBMIT_H_MODULES ="/H_Modules"
// Fetch Module List
export const FETCH_MODULES_LIST ="/H_Modules"

//ADMINISTRATOR *** Company 
// Company List URL
export const COMPANY_lIST ="/C_Companies"

//PAGE Master
export const GET_DEFAULT_MODULE="/HModules"
export const POST_MODULE_ID="/HModules"

export const POST_SUB_MODULE="/HSubModules"
export const POST_ADD_PAGE="/HPages"
export const GET_PAGE_ACCESS="/HPageAccessNames"

export const H_SUB_MODULES="/H_SubModules"/// post api

export const H_SUB_MODULES_FROM_HPAGES="/GetSubModuleFromModuleID"/// post api
export const HPAGES_LIST="/H_Pages"/// post api

export const GET_EMPLOYEE="/M_Employees"   //// get M_Employees api
export const GET_ROLE="/M_Roles"///get api

/// User Registration
export const GET_EMPLOYEE_API="/M_Employees"   //// get M_Employees api
export const GET_ROLE_API="/M_Roles"///get api
export const POST_ADD_USER="/UserList"
export const USER_GET_API="/UserList"
export const DELETE_USER="/UserList"
export const EDIT_USER="/UserList"
export const UPDATE_SUCCESS_DATA="/UserList"


/// M_Employees api
export const GET_DESIGNATIONID="/Designation"
export const GET_EMPLOYEETYPE="/EmployeeTypeByID"
export const GET_STATE="/State"
export const GET_REGION="/Region"
export const POST_EMPLOYEEDATA="/M_Employees"
export const GET_COMAPNY_API="/ C_Companies"
export const GET_EMPLOYEE_LIST_API="/M_Employees"
export const Delete_EmployeeID="/M_Employees"
export const edit_EmployeeID="/M_Employees"
export const Update_Employee_ID="/M_Employees"
