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
export const GET_ORDER_ITEM = "Items"
export const ORDER_PAGE_API = "Orders"


//Python Logic 
export const FOOD_ERP_POST_JWT_LOGIN = "/Login"
export const FOOD_ERP_POST_USER_DETAILS_AFTER_LOGIN="/GerUserDetials"

export const FOOD_ERP_POST_JWT_PASSWORD_FORGET_VERIFY_OTP= "/VerifyOTP"

export const FOOD_ERP_POST_JWT_PASSWORD_FORGET_SEND_OTP = "/SendMail"

//PAGE Master
export const GET_DEFAULT_MODULE="/HModules"
export const POST_MODULE_ID="/HModules"
export const SHOW_PAGESLIST_ON_PAGE_TYPE_FOR_DROPDOWN="/showPagesListOnPageType"
export const SHOW_PAGESLIST_ON_PAGEACCESS_FOR_DROPDOWN="/PageAccess"

// Moduls Submit  Method URL
export const H_MODULES_API_URL ="/Modules"

//Company List URL
export const COMPANY_API_URL ="/Company"

// Company Group drop down api
export const GET_COMPANYGROUP="/CompanyGroups"

export const GET_PAGE_ACCESS="/HPageAccessNames"

export const H_SUB_MODULES_API_URL="/H_SubModules"/// post api

export const H_SUB_MODULES_FROM_HPAGES="/GetSubModuleFromModuleID"/// post api

export const H_PAGES_API_URL="/PageMaster"/// post api

export const ROLE_API_URL="/Roles"///get api

/// User Registration

export const USER_API_URL="/UserList"
export const REGISTRATION_API_URL="/Registration"
export const USER_PARTIES_FOR_USER_MASTER="/UserPartiesForUserMaster"
export const EMPLOYEE_LIST_FOR_DROPDOWN_API_URL="/GetEmployeeForUserCreation"



// M_Employees api
export const GET_DESIGNATIONID="/Designations"
export const GET_EMPLOYEE_TYPE="/EmployeeTypes"
export const GET_STATE="/States"
// export const GET_REGION="/Region"
export const EMPLOYEE_API_URL="/Employees"   
export const GET_COMPANY_BY_EMPLOYEETYPES_ID="/GetCompanyByEmployeeType" //CompanyByEmployeeType
// Role Master
export const ROLE_MASTER_API="/Roles" // role get api

// M_Items Api
export const Items_MASTER_API="/M_Items"

// M_Items_group Api
export const ITEMS_GROUP_API="/ItemGroups"

// Party Master 
export const PARTY_MASTER_API="/M_Parties"
export const GetDistrictOnState="/GetDistrictOnState"
export const GET_DIVISION_TYPES_ID="/DivisionTypes"
export const GET_PARTYTYPE_BY_DIVISIONTYPES_ID="/GetPartyTypeByDivisionTypeID"
export const GET_COMPANY_BY_DIVISIONTYPES_ID="/GetCompanyByDivisionTypeID"

//Role Access
export const PAGE_DROPDOWN_FOR_ROLE_ACCESS_ADD_PAGE="/RoleAccessGetPages"
export const GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_PAGE ='/RoleAccessNewUpdated'
export const POST_COPY_ROLE_ACCESS_API ='/CopyRoleAccessabc'

export const GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE ='/RoleAccessNewUpdated'
export const ADD_PAGE_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE ='/RoleAccessAddPage'

// RoleAccess list page API
export const GET_ROLEACCESS_LIST_PAGE_API ='/RoleAccessList'
//role Aceess url
export const ROLE_ACCESS="/RoleAccess"

// EmployeeType API
export const EMPLOYEE_TYPE_API ='/EmployeeTypes'
 
// PartyType API
export const PARTYTYPES_API  ='/PartyTypes'

// Division Type API
export const DIVISION_TYPES_API  ='/DivisionTypes'


//Product Cateogory Type Master API
export const  CATEGORY_TYPE_MASTER_API = '/ProductCategoryTypes'


//Product Types API
export const  PRODUCT_TYPES_API ='/ProductCategory'

export const  BASEUNIT_DROPDOWN_API ='/UnitList'

export const  CATEGORYTYPE_DROPDOWN_API ='/CategoryTypes'

export const  CATEGORY_DROPDOWN_API ='/Category'

export const  SUBCATEGORY_DROPDOWN_API ='/SubCategory'

