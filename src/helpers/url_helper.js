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
export const FOOD_ERP_POST_USER_DETAILS_AFTER_LOGIN = "/GerUserDetials"
export const DIVIDION_DROPDOWN_FOR_LOGIN_CHANGE_DIVSION_PAGE = "/PartyDropdownforloginpage"
export const FOOD_ERP_POST_JWT_PASSWORD_FORGET_VERIFY_OTP = "/VerifyOTP"
export const FOOD_ERP_POST_JWT_PASSWORD_FORGET_SEND_OTP = "/SendMail"
export const SUPER_ADMIN_API = '/SuperAdmin'

export const PAGE_FIELD = '/PageMaster'

//PAGE Master
export const GET_DEFAULT_MODULE = "/HModules"
export const POST_MODULE_ID = "/HModules"
export const SHOW_PAGESLIST_ON_PAGE_TYPE_FOR_DROPDOWN = "/showPagesListOnPageType"
export const SHOW_PAGESLIST_ON_PAGEACCESS_FOR_DROPDOWN = "/PageAccess"
export const GET_CONTROLTYPES_DROPDOWN_API = "/ControlTypes"
export const GET_FIELD_VALIDATIONS_DROPDOWN_API = "/GetFieldValidationOnControlType"

// Moduls Submit  Method URL
export const H_MODULES_API_URL = "/Modules"

//Company List URL
export const COMPANY_API_URL = "/Company"

// Company Group drop down api
export const GET_COMPANYGROUP = "/CompanyGroups"
export const GET_PAGE_ACCESS = "/HPageAccessNames"
export const H_PAGES_API_URL = "/PageMaster"/// post api
export const ROLE_API_URL = "/Roles"///get api

// User Registration
export const USER_API_URL = "/UserList"
export const REGISTRATION_API_URL = "/Registration"
export const USER_PARTIES_FOR_USER_MASTER = "/UserPartiesForUserMaster"
export const EMPLOYEE_LIST_FOR_DROPDOWN_API_URL = "/GetEmployeeForUserCreation"

// M_Employees api
export const GET_DESIGNATIONID = "/Designations"
export const GET_EMPLOYEE_TYPE = "/EmployeeTypes"
export const GET_STATE = "/States"
// export const GET_REGION="/Region"
export const EMPLOYEE_API_URL = "/Employees"
export const GET_COMPANY_BY_EMPLOYEETYPES_ID = "/GetCompanyByEmployeeType" //CompanyByEmployeeType
// Role Master
export const ROLE_MASTER_API = "/Roles" // role get api

// M_Items Api
export const Items_MASTER_API = "/Items"
export const GET_GROUP_BY_GROUPTYPES_ID = "/GetGroupByGroupTypeID"
export const GET_SUBGROUP_BY_GROUP_ID= "/GetSubGroupByGroupID"

// M_Items_group Api
export const ITEMS_GROUP_API = "/ItemGroups"

// Party Master 
export const PARTY_MASTER_API = "/Parties"
export const GetDistrictOnState = "/GetDistrictOnState"
export const PRICELIST = "/PriceList"
export const ADDRESSTYPES ="/AddressTypes"
export const PARTYTYPES ="/PartyTypes"
export const COMPANY ="/Company"
export const GET_PARTYTYPE_BY_DIVISIONTYPES_ID = "/GetPartyTypeByDivisionTypeID"
export const GET_COMPANY_BY_DIVISIONTYPES_ID = "/GetCompanyByDivisionTypeID"

//Role Access
export const PAGE_DROPDOWN_FOR_ROLE_ACCESS_ADD_PAGE = "/RoleAccessGetPages"
export const GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_PAGE = '/RoleAccessNewUpdated'
export const POST_COPY_ROLE_ACCESS_API = '/CopyRoleAccessabc'

export const GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE = '/RoleAccessNewUpdated'
export const ADD_PAGE_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE = '/RoleAccessAddPage'

// RoleAccess list page API
export const GET_ROLEACCESS_LIST_PAGE_API = '/RoleAccessList'
//role Aceess url
export const ROLE_ACCESS = "/RoleAccess"

// EmployeeType API
export const EMPLOYEE_TYPE_API = '/EmployeeTypes'

// PartyType API
export const PARTYTYPES_API = '/PartyTypes'

// Division Type API
export const DIVISION_TYPES_API = '/DivisionTypes'

//Category API
export const CATEGORY_TYPES_API = '/CategoryTypes'
export const CATEGORY_API = '/Category'
export const SUB_CATEGORY_API = '/SubCategory'

//Vehicle api
export const VEHICLE_API = '/Vehicle'
export const VEHICLETYPES_DROPDOWN = '/VehicleTypes'
export const DRIVERLIST_DROPDOWN = '/Driver'
export const BASEUNIT_DROPDOWN_API = '/UnitList'

//CompanyGroup api
export const COMPANYGROUP_API = '/CompanyGroups'

//Driver api
export const DRIVER_API = '/Driver'

//Category Types API
export const CATEGORY_DROPDOWN_API = '/GetCategoryByCategoryTypeID'
export const SUBCATEGORY_DROPDOWN_API = '/GetSubCategoryByCategoryID'
export const IMAGETYPE_DROPDOWN_API = '/ImageTypes'
export const MRP_TYPE_DROPDOWN_API = '/MRPTypes'
export const DIVISION_DROPDOWN_API = '/Divisions'
export const PRICE_LIST = '/PriceList'

// MRP Master Api
export const MRP_MASTER_LIST = '/Mrps'
export const GO_BUTTON_POST_API_FOR_MRP_MASTER = '/GetMRP'
export const DELETE_API_FOR_MRP_LIST_PAGE='/DeleteMrpOnList'

// Margin Master
export const MARGIN_MASTER_LIST = '/Margins'
export const GO_BUTTON_POST_API_FOR_MARGIN_MASTER = '/GetMargin'
export const DELETE_API_FOR_LIST_MARGIN_PAGE='/DeleteMarginOnList'

//TermsAndCondtions API
export const TERMSANDCONDITIONS_API = '/TermsAndCondtions'

// GroupType API
export const GROUP_TYPE_API = '/GroupTypes'

// Group Api
export const GROUP_API = '/Group'

// GST API
export const GST_LIST_API = '/GstHsnCode' // for list page
export const GO_BUTTON_POST_API_FOR_GST_MASTER = '/GetGstHsncode' // for go button
export const DELETE_API_FOR_LIST_GST_PAGE = '/DeleteGstHsnCodeOnList' // for delete 
