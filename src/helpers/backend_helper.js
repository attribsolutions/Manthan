import axios from "axios"
import { del, get, put, post, postWithoutToken, postRefreshToken, getWithotMsg, } from "./api_helper"
import { chitalebandhu_get, sapApi_post } from "./other_domain_api"
import * as url from "./url_helper"

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user")
  if (user) return JSON.parse(user)
  return null
}

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null
}

// Register Method
const postFakeRegister = data => {
  return axios
    .post(url.POST_FAKE_REGISTER, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      let message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

// Login Method
const postFakeLogin = data => post(url.POST_FAKE_LOGIN, data)

// postForgetPwd
const postFakeForgetPwd = data => post(url.POST_FAKE_PASSWORD_FORGET, data)

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data)

const postFakeProfile = jsonBody => post(url.POST_EDIT_PROFILE, jsonBody)


export const getSessionAlive_Api = jsonBody => postRefreshToken(url.TOKEN_REFRESH_API, jsonBody)

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      var message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

export const Python_FoodERP_postJwtLogin = data => postWithoutToken(url.FOOD_ERP_POST_JWT_LOGIN, data)
export const getUserDetails_afterLogin_ApiCall = data => post(url.FOOD_ERP_POST_USER_DETAILS_AFTER_LOGIN, data)
export const divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall = (employeeID) => getWithotMsg(`${url.DIVIDION_DROPDOWN_FOR_LOGIN_CHANGE_DIVSION_PAGE}/${employeeID}`)
export const ChangePassword_API = ({ jsonBody, btnId }) => post(url.CHANGEPASSWORD_API, jsonBody, btnId)// post api


// postForgetPwd
export const Python_FoodERP_postJwtForgetPwd_Verify_OTP = data => postWithoutToken(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_VERIFY_OTP, data)
export const Python_FoodERP_postJwtForgetPwd_SendOTP = data => postWithoutToken(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_SEND_OTP, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

export const RoleAccessApi_url = (party, employee, company) => get(`${url.ROLE_ACCESS}/${party}/${employee}/${company}`)
export const post_SuperAdmin = (data) => post(url.SUPER_ADMIN_API, data) //save And Update

//  common pages get data for page filed and validation
export const commonPageFiled_API = (pageId) => get(`${url.PAGE_FIELD}/${pageId}`)

// Employees  Component All Api 
export const getDesignationID_For_Dropdown = () => get(url.GET_DESIGNATIONID)
export const getState_For_Dropdown = () => get(url.GET_STATE)
export const getCity_For_Dropdown = (DistrictId) => get(`${url.GET_CITY_ON_DISTRICT}/${DistrictId}`)
export const getComapny_For_Dropdown = () => get(url.COMPANY_API_URL)
export const save_Employee_API = ({ jsonBody, btnId }) => post(url.EMPLOYEE_API_URL, jsonBody, btnId) //save And Update
export const get_EmployeelistApi = (filters) => post(url.EMPLOYEE_FILTER_API_URL, filters) // list api using post method
export const detelet_EmployeeID = ({ deleteId, btnId }) => del(`${url.EMPLOYEE_API_URL}/${deleteId}`, btnId) // delete api
export const edit_EmployeeAPI = ({ editId, btnId }) => get(`${url.EMPLOYEE_API_URL}/${editId}`, btnId) // edit api
export const update_EmployeeAPI = ({ updateId, jsonBody, btnId }) => put(`${url.EMPLOYEE_API_URL}/${updateId}`, jsonBody, btnId)// update 
export const Get_CompanyBy_EmployeeType_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_EMPLOYEETYPES_ID}/${id}`)//  GetCompanyByDivisionTypeID DropDown API

//User Registration  All APIs 
export const getEmployee_Dropdown_For_UserRegistration_API = () => get(url.EMPLOYEE_LIST_FOR_DROPDOWN_API_URL)//get api for Dropdown_list data 
export const User_Component_PostMethod_API = ({ jsonBody, btnId }) => post(url.REGISTRATION_API_URL, jsonBody, btnId)//post for (save and update) User_Component
export const User_Component_GetMethod_API = (filters) => post(url.USER_API_URL, filters) //Get User_Component
export const User_Component_Delete_Method_API = ({ deleteId, btnId }) => del(`${url.USER_API_URL}/${deleteId}`, btnId) // delete api
export const User_Component_EditById_API = ({ editId, btnId }) => get(`${url.USER_API_URL}/${editId}`, btnId) // edit api
export const User_Component_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.USER_API_URL}/${updateId}`, jsonBody, btnId) // update api
export const UserPartiesForUserMaster_API = (id) => get(`${url.USER_PARTIES_FOR_USER_MASTER}/${id}`) // delete api

// Role Master
export const Role_Master_Get_API = (Filters) => post(url.ROLE_FILTER_API, Filters)//get api
export const Role_Master_Post_API = ({ jsonBody, btnId }) => post(url.ROLE_MASTER_API, jsonBody, btnId)// post api
export const Role_Master_Delete_API = ({ deleteId, btnId }) => del(`${url.ROLE_MASTER_API}/${deleteId}`, btnId)// delete api
export const Role_Master_Edit_API = ({ editId, btnId }) => get(`${url.ROLE_MASTER_API}/${editId}`, btnId)// edit api
export const Role_Master_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.ROLE_MASTER_API}/${updateId}`, jsonBody, btnId)// update api

//  Module Master API 
export const Module_Get_API = () => get(url.H_MODULES_API_URL,)//module-list get API method
export const Module_Post_API = ({ jsonBody, btnId }) => post(url.H_MODULES_API_URL, jsonBody, btnId)
export const Module_Edit_API = ({ editId, btnId }) => get(`${url.H_MODULES_API_URL}/${editId}`, btnId)// Edit_Modules- by_ID
export const Module_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.H_MODULES_API_URL}/${updateId}`, jsonBody, btnId)// Update_Modules- by_ID
export const Module_Delete_API = ({ deleteId, btnId }) => del(`${url.H_MODULES_API_URL}/${deleteId}`, btnId)// Delete_Modules_By-ID

//Fetch Company LIst
export const fetch_CompanyList = (data) => post(url.COMPANY_FILTER, data)
export const edit_CompanyID = ({ editId, btnId }) => get(`${url.COMPANY_API_URL}/${editId}`, btnId)// Edit_Company- by_ID
export const delete_CompanyID = ({ deleteId, btnId }) => del(`${url.COMPANY_API_URL}/${deleteId}`, btnId)// Delete_Company_By-ID
export const postSubmit_Company = ({ jsonBody, btnId }) => post(url.COMPANY_API_URL, jsonBody, btnId)// Company_Modules submit 
export const updateCompany_ID = ({ jsonBody, updateId, btnId }) => put(`${url.COMPANY_API_URL}/${updateId}`, jsonBody, btnId)// Update_Company- by_ID
export const getCompanyGroup = () => get(url.GET_COMPANYGROUP)// CompanyGroup DropDown API

//PageList And PageMaster
export const showPagesListOnPageType_DropDown_List = () => get(url.SHOW_PAGESLIST_ON_PAGE_TYPE_FOR_DROPDOWN)
export const showPagesListOnPageAccess_DropDown_List = (id) => get(url.SHOW_PAGESLIST_ON_PAGEACCESS_FOR_DROPDOWN)
export const get_PageType_HPages = (id) => get(url.GET_PAGETYPE)
export const ControlTypes_DropDown_Api = () => get(url.GET_CONTROLTYPES_DROPDOWN_API)

//H_pages
export const get_Module_HPages = () => get(url.H_MODULES_API_URL)// Get subModule For H_pages
export const Fetch_HPagesListApi = () => get(url.H_PAGES_API_URL)//get H_Pages List 
export const GetFieldValidationOnControlType_DropDown_API = (id) => get(`${url.GET_FIELD_VALIDATIONS_DROPDOWN_API}/${id}`)//  GetFieldValidationOnControlType DropDown API
export const edit_HPageID = ({ editId, btnId }) => get(`${url.H_PAGES_API_URL}/${editId}`, btnId)// get edit H_Pages ID Data 
export const updateHPages = (Data, id) => put(`${url.H_PAGES_API_URL}/${id}`, Data) // Upadate H_Page api
export const saveHPagesAPI = (Data) => post(url.H_PAGES_API_URL, Data)
export const deletHPagesUsingID_API = ({ deleteId, btnId }) => del(`${url.H_PAGES_API_URL}/${deleteId}`, btnId)

// M_Items
export const Items_Group_Get_API = () => get(url.ITEMS_GROUP_API)//get api
export const Items_Filter_API = (filters) => post(url.Items_FILTER_API, filters) // list api using post method
export const Items_Master_Post_API = ({ jsonBody, btnId }) => post(url.Items_MASTER_API, jsonBody, btnId)// save api
export const Items_Master_Delete_API = ({ deleteId, btnId }) => del(`${url.Items_MASTER_API}/${deleteId}`, btnId)// delete api
export const Items_Master_Edit_API = ({ editId, btnId }) => get(`${url.Items_MASTER_API}/${editId}`, btnId)// edit api
export const Items_Master_Update_API = ({ updateId, jsonBody, btnId }) => put(`${url.Items_MASTER_API}/${updateId}`, jsonBody, btnId)// update api

export const BaseUnit_Get_DropDown_API = () => get(url.BASEUNIT_DROPDOWN_API)// BaseUnit DropDown api
export const CategoryType_Get_DropDown_API = () => get(url.CATEGORY_TYPES_API)// CategoryType DropDown api
export const ImageType_Get_DropDown_API = () => get(url.IMAGETYPE_DROPDOWN_API)// ImageType DropDown api
export const MRPType_Get_DropDown_API = () => get(url.MRP_TYPE_DROPDOWN_API)// MRP Type DropDown api
export const Division_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const Party_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const Category_By_CategoryTypes_DropDown_API = (id) => get(`${url.CATEGORY_DROPDOWN_API}/${id}`)//  GetCategoryByCategoryTypeID DropDown API
export const Group_By_GroupTypes_DropDown_API = (id) => get(`${url.GET_GROUP_BY_GROUPTYPES_ID}/${id}`)//  GetGroupByGroupTypeID DropDown API
export const SubGroup_By_Group_DropDown_API = (id) => get(`${url.GET_SUBGROUP_BY_GROUP_ID}/${id}`)// GetSubGroupByGroupID DropDown API
export const Get_Item_Tag = () => get(url.GET_ITEM_TAG)// Get Item Tag Api
export const Get_Brand_Tag = () => get(url.GET_BRAND_TAG)// Get Item Tag Api
export const GeneralMasterSubType_API = (data) => post(url.GENERAL_MASTER_BRAND_NAME, data)// post api

// Party Master
export const Party_Master_Get_API = (jsonbody) => post(url.PARTY_MASTER_FILTER_API, jsonbody)//get api
export const Party_Master_Post_API = ({ jsonBody, btnId }) => post(url.PARTY_MASTER_API, jsonBody, btnId)// post api
export const Party_Master_Delete_API = ({ deleteId, btnId }) => del(`${url.PARTY_MASTER_API}/${deleteId}`, btnId)// delete api
export const Party_Master_Edit_API = ({ editId, btnId }) => get(`${url.PARTY_MASTER_API}/${editId}`, btnId)// edit api
export const Party_Master_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.PARTY_MASTER_API}/${updateId}`, jsonBody, btnId)// update api
export const GetDistrictOnState_For_Dropdown = (id) => get(`${url.GetDistrictOnState}/${id}`)//  GetDistrictOnState DropDown API
export const GetAddressTypes_For_Dropdown = () => get(url.ADDRESSTYPES)//  get addresstypes
export const GetPartyTypes_For_Dropdown = () => get(url.PARTYTYPES)//  get partytypes
export const GetPartyTypeByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_PARTYTYPE_BY_DIVISIONTYPES_ID}/${id}`)//  GetDistrictOnState DropDown API
export const GetCompanyByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_DIVISIONTYPES_ID}/${id}`)//  GetCompanyByDivisionTypeID DropDown API
export const Party_Address_Delete_API = ({ deleteId, btnId }) => del(`${url.PARTY_ADDRESS_DELETE_API}/${deleteId}`, btnId)// delete api
//RoleAccess

export const RoleAccessAdd_PageDropdown_Api = (id1, id2) => get(`${url.PAGE_DROPDOWN_FOR_ROLE_ACCESS_ADD_PAGE}/${id1}/${id2}`)//get api Pages
export const RoleAccessAdd_RoleDropdown_Api = (id1, id2) => get(`${url.GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}`) //get api role List 
export const RoleAccessAdd_GO_Button_Api = (id1, id2, id3) => get(`${url.GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}/${id3}`) //get api role List 
export const RoleAccessAdd_AddPage_Button_Api = (id1) => get(`${url.ADD_PAGE_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}`) //get api role List 
export const RoleAccessAdd_Save_Api = ({ jsonBody, btnId }) => post(url.ROLE_ACCESS, jsonBody, btnId) //save api RoleAccessAdd 
export const RoleAccessAdd_List_Api = (jsonbody) => post(url.GET_ROLEACCESS_LIST_PAGE_API, jsonbody)// RoleAccess List Page API
export const RoleAccessCopy_Save_Api = ({ jsonBody, btnId }) => post(url.POST_COPY_ROLE_ACCESS_API, jsonBody, btnId)//save api RoleAccessCopy 
export const RoleAccessAdd_Delete_Api = ({ role, division, company, btnId }) => del(`${url.DELETE_ROLE_ACCESS_API}/${role}/${division}/${company}`, btnId)//POST COPY  RoleAccess API

// Employee Type API
export const Employee_Type_API = ({ jsonBody, btnId }) => post(url.EMPLOYEE_TYPE_API, jsonBody, btnId)// post api
export const get_EmployeeType_List_Api = (filters) => post(url.EMPLOYEE_TYPE_FILTER_API, filters) // get api
export const detelet_EmployeeType_List_Api = ({ deleteId, btnId }) => del(`${url.EMPLOYEE_TYPE_API}/${deleteId}`, btnId) // delete api
export const edit_EmployeeType_List_Api = ({ editId, btnId }) => get(`${url.EMPLOYEE_TYPE_API}/${editId}`, btnId) // edit api
export const update_EmployeeType_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.EMPLOYEE_TYPE_API}/${updateId}`, jsonBody, btnId)// update 

// Party Type API
export const Save_Party_Type_API = ({ jsonBody, btnId }) => post(url.PARTYTYPES_API, jsonBody, btnId)// post api
export const get_PartyType_List_Api = (filters) => post(url.PARTYTYPES_FILTER_API, filters) // get api
export const detelet_PartyType_List_Api = ({ deleteId, btnId }) => del(`${url.PARTYTYPES_API}/${deleteId}`, btnId) // delete api
export const edit_PartyType_List_Api = ({ jsonBody, btnId }) => post(url.PARTYTYPES_FILTER_API, jsonBody, btnId) // edit api (post method)
export const update_PartyType_List_Api = ({ updateId, jsonBody, btnId }) => put(`${url.PARTYTYPES_API}/${updateId}`, jsonBody, btnId)// update 

// Division Types API
export const Post_Division_Type_API = (data) => post(url.DIVISION_TYPES_API, data)// post api
export const get_DivisionType_List_Api = () => get(url.DIVISION_TYPES_API) // get api
export const detelet_DivisionType_List_Api = (id) => del(`${url.DIVISION_TYPES_API}/${id}`) // delete api
export const edit_DivisionType_List_Api = (id) => get(`${url.DIVISION_TYPES_API}/${id}`) // edit api
export const update_DivisionType_List_Api = (data, id) => put(`${url.DIVISION_TYPES_API}/${id}`, data)// update 

// Cateogory Types API
export const Post_Category_Type_Master_API = ({ jsonBody, btnId }) => post(url.CATEGORY_TYPES_API, jsonBody, btnId)// post api
export const get_CategoryType_List_Api = () => get(url.CATEGORY_TYPES_API) // get api
export const detelet_CategoryType_List_Api = ({ deleteId, btnId }) => del(`${url.CATEGORY_TYPES_API}/${deleteId}`, btnId) // delete api
export const edit_CategoryType_List_Api = ({ editId, btnId }) => get(`${url.CATEGORY_TYPES_API}/${editId}`, btnId) // edit api
export const update_CategoryType_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.CATEGORY_TYPES_API}/${updateId}`, jsonBody, btnId)// update

//Category API
export const Post_Category_API = ({ jsonBody, btnId }) => post(url.CATEGORY_API, jsonBody, btnId)// post api
export const get_Category_List_Api = () => get(url.CATEGORY_API) // get api
export const detelet_Category_List_Api = ({ deleteId, btnId }) => del(`${url.CATEGORY_API}/${deleteId}`, btnId) // delete api
export const edit_Category_List_Api = ({ editId, btnId }) => get(`${url.CATEGORY_API}/${editId}`, btnId) // edit api
export const update_Category_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.CATEGORY_API}/${updateId}`, jsonBody, btnId)// update

//Vehicle API
export const Vehicle_Get_API = (filters) => post(url.VEHICLE_FILTER_API, filters)//  get Api Using Post Method
export const Vehicle_Post_API = ({ jsonBody, btnId }) => post(url.VEHICLE_API, jsonBody, btnId)// post api
export const Vehicle_Edit_API = ({ editId, btnId }) => get(`${url.VEHICLE_API}/${editId}`, btnId) // edit api
export const Vehicle_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.VEHICLE_API}/${updateId}`, jsonBody, btnId)// update API
export const Vehicle_Delete_API = ({ deleteId, btnId }) => del(`${url.VEHICLE_API}/${deleteId}`, btnId) // delete api
export const VehicleTypes_Get_API_for_Dropdown = (filters) => post(url.VEHICLETYPES_DROPDOWN, filters)// Vehicle Type dropDown API

//CompanyGroup API
export const CompanyGroup_Post_API = ({ jsonBody, btnId }) => post(url.COMPANYGROUP_API, jsonBody, btnId)// post api
export const CompanyGroup_Get_API = () => get(url.COMPANYGROUP_API)//  get Api 
export const CompanyGroup_edit_API = ({ editId, btnId }) => get(`${url.COMPANYGROUP_API}/${editId}`, btnId) // edit api
export const CompanyGroup_update_API = ({ jsonBody, updateId, btnId }) => put(`${url.COMPANYGROUP_API}/${updateId}`, jsonBody, btnId)// update
export const CompanyGroup_Delete_API = ({ deleteId, btnId }) => del(`${url.COMPANYGROUP_API}/${deleteId}`, btnId) // delete api

//Driver api
export const get_DriverList_API = (jsonBody) => post(url.DRIVER_FILTER_API, jsonBody)//  get Api 
export const Post_Driver_API = ({ jsonBody, btnId }) => post(url.DRIVER_API, jsonBody, btnId)// post api
export const edit_DriverType_List_Api = ({ editId, btnId }) => get(`${url.DRIVER_API}/${editId}`, btnId) // edit api
export const update_DriverType_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.DRIVER_API}/${updateId}`, jsonBody, btnId)// update
export const detelet_DriverType_List_Api = ({ deleteId, btnId }) => del(`${url.DRIVER_API}/${deleteId}`, btnId) // delete api

//PriceList api
export const Save_PriceList_API = ({ jsonBody, btnId }) => post(url.PRICE_LIST, jsonBody, btnId)// post api
export const get_PriceListByPartyType_API = (partyType) => get(`${url.PRICE_LIST}/${partyType}`)// post api
export const get_PriceListByCompay_API = (compayId) => get(`${url.PRICE_LIST_BY_COMPANY}/${compayId}`)// post api

export const GetPriceList_For_Listpage = () => get(url.PRICELIST)//  get priceList
export const delete_PriceList_API = ({ deleteId, btnId }) => del(`${url.PRICE_LIST}/${deleteId}`, btnId)// delete api
export const edit_PriceList = ({ editId, btnId }) => get(`${url.PRICE_LIST}/${editId}`, btnId) // edit api
export const update_PriceList = ({ updateId, jsonBody, btnId }) => put(`${url.PRICE_LIST}/${updateId}`, jsonBody, btnId)// update

// MRP Master 
export const MRPMaster_Get_API = () => get(url.MRP_MASTER_LIST)// getapi
export const MRPMaster_Post_API = ({ jsonBody, btnId }) => post(url.MRP_MASTER_LIST, jsonBody, btnId)// post api
export const MRPMaster_Delete_API_For_List = ({ deleteId, btnId }) => del(`${url.DELETE_API_FOR_MRP_LIST_PAGE}/${deleteId}`, btnId)// delete api
export const MRPMaster_goButton_API = (data) => post(url.GO_BUTTON_POST_API_FOR_MRP_MASTER, data)// go button postapi
export const MRPMaster_Delete_API_For_Master = (id) => del(`${url.MRP_MASTER_LIST}/${id}`)// delete api MRP Master Page

// Margin Master
export const GetMarginList_For_Listpage = () => get(url.MARGIN_MASTER_LIST)//  get List
export const Post_MarginMaster_API = ({ jsonBody, btnId }) => post(url.MARGIN_MASTER_LIST, jsonBody, btnId)// post api
export const delete_MarginList_API = ({ deleteId, btnId }) => del(`${url.DELETE_API_FOR_LIST_MARGIN_PAGE}/${deleteId}`, btnId)// post api
export const GoButton_Post_API_For_MarginMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_MARGIN_MASTER, data)// go button postapi
export const Margin_MasterPage_delete_API = (id) => del(`${url.MARGIN_MASTER_LIST}/${id}`)// delete api Margin Master Page

// GroupTypes API
export const GroupTypes_API = () => get(url.GROUP_TYPE_API)
export const GroupTypes_Post_API = ({ jsonBody, btnId }) => post(url.GROUP_TYPE_API, jsonBody, btnId)// post api
export const GroupTypes_Delete_API = ({ deleteId, btnId }) => del(`${url.GROUP_TYPE_API}/${deleteId}`, btnId)// delete api
export const GroupTypes_Edit_API = ({ editId, btnId }) => get(`${url.GROUP_TYPE_API}/${editId}`, btnId)// edit api
export const GroupTypes_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.GROUP_TYPE_API}/${updateId}`, jsonBody, btnId)// update api

// GroupMaster

export const get_Group_List_Api = () => get(url.GROUP_API)// get api
export const save_Group_API = ({ jsonBody, btnId }) => post(url.GROUP_API, jsonBody, btnId)// post api
export const del_Group_List_API = ({ deleteId, btnId }) => del(`${url.GROUP_API}/${deleteId}`, btnId)// delete api
export const edit_Group_List_Api = ({ editId, btnId }) => get(`${url.GROUP_API}/${editId}`, btnId)// edit api
export const update_Group_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.GROUP_API}/${updateId}`, jsonBody, btnId)// update api

// TermsAndCondtions API
export const Post_TermsAndCondtions_Master_API = ({ jsonBody, btnId }) => post(url.TERMSANDCONDITIONS_API, jsonBody, btnId)// post api
export const get_TermsAndCondtionsList_API = () => get(url.TERMSANDCONDITIONS_API)// get api
export const del_TermsAndCondtions_Master_API = ({ deleteId, btnId }) => del(`${url.TERMSANDCONDITIONS_API}/${deleteId}`, btnId)// delete api
export const edit_TermsAndCondtions_Master_API = ({ editId, btnId }) => get(`${url.TERMSANDCONDITIONS_API}/${editId}`, btnId)// edit api
export const update_TermsAndCondtions_Master_API = ({ jsonBody, updateId, btnId }) => put(`${url.TERMSANDCONDITIONS_API}/${updateId}`, jsonBody, btnId)// update api

// GST API
export const Post_GSTMaster_API = (data) => post(url.GST_LIST_API, data)// post api
export const GetGSTList_For_Listpage = () => get(url.GST_LIST_API)//  get List
export const delete_GSTList_API = ({ deleteId, btnId }) => del(`${url.DELETE_API_FOR_LIST_GST_PAGE}/${deleteId}`, btnId)// Delete api
export const GoButton_Post_API_For_GSTMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_GST_MASTER, data)// go button postapi
export const GST_MasterPage_delete_API = (id) => del(`${url.GST_LIST_API}/${id}`)// delete api

// PartySubParty API
export const PartySubParty_Get_API = () => get(`${url.PARTY_SUB_PARTY_LIST}`)// get list api
export const PartySubParty_Post_API = ({ jsonBody, btnId }) => post(url.PARTY_SUB_PARTY, jsonBody, btnId)// post api
export const PartySubParty_Delete_API = ({ deleteId, btnId }) => del(`${url.PARTY_SUB_PARTY}/${deleteId}`, btnId)// delete api
export const PartySubParty_Edit_API = ({ editId, btnId }) => get(`${url.PARTY_SUB_PARTY}/${editId}`, btnId)// edit api
export const PartySubParty_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.PARTY_SUB_PARTY}/${updateId}`, jsonBody, btnId)// update api
export const PartySubParty_Dropdown_Get_API = (id) => get(`${url.PARTY_SUB_PARTY}/${id}`)// PartySubParty dropdown Api

//PartyItems API

// export const GoButton_API = (data) => post(url.PARTYITEM_FOR_LIST, data)//get api
export const Save_Party_Items = ({ jsonBody, btnId }) => post(url.PARTYITEM_FOR_MASTER, jsonBody, btnId)// post api
// export const get_Party_Item_List = (SupplierID) => get(`${url.PARTY_ITEM_FILTER}/${SupplierID}`)//get api
export const get_Party_Item_List = (jsonBody) => post(url.PARTY_ITEM_FILTER, jsonBody) // get api

export const GetPartyList_API = () => get(url.PARTYITEM_FOR_LIST)// get api
// export const edit_PartyItem_List_Api = ({ editId, btnId }) => get(`${url.PARTYITEM_FOR_MASTER}/${editId}`, btnId)// edit api
export const edit_PartyItem_List_Api = (jsonBody) => post(url.PARTY_ITEM_FILTER, jsonBody) // get api

//Post api VendorSupplierCustomer 
export const VendorSupplierCustomer = (post_PartyId) => post(url.GET_SUPPLIER_VENDOR_CUSTOMER, post_PartyId)//Post api
export const SSDD_List_under_Company_API = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)//Post api
export const Retailer_List_under_Company_PartyAPI = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)//Post api
export const Party_Dropdown_Get_API = (id) => get(`${url.MANAGEMENT_PARTIES}/${id}`)// Party dropdown Api


// ImportField_Add
export const ImportField_Add_GoButton_API = ({ jsonBody, btnId }) => post(url.IMPORT_FIELD_MAP_FILTER, jsonBody, btnId)//get api
export const ImportField_Add_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_FIELD_MAP_SAVE, jsonBody, btnId)// post api

// City API
export const Post_City_Master_API = ({ jsonBody, btnId }) => post(url.CITY, jsonBody, btnId)// post api
export const get_City_List_Api = () => get(url.CITY_LIST_API)// get api







// ImportMaster_Map API
export const ImportMaster_Map_Customer_GoButton_API = ({ partyId, btnId }) => get(`${url.IMPORT_MASTER_MAP_CUSTOMER}/${partyId}`, btnId)//get api
export const ImportMaster_Map_Customer_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_MASTER_MAP_CUSTOMER, jsonBody, btnId)// post api
export const ImportMaster_Map_Item_GoButton_API = ({ partyId, btnId }) => get(`${url.IMPORT_MASTER_MAP_ITEM}/${partyId}`, btnId)//get api
export const ImportMaster_Map_Item_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_MASTER_MAP_ITEM, jsonBody, btnId)// post api
export const ImportMaster_Map_Unit_GoButton_API = ({ partyId, btnId }) => get(`${url.IMPORT_MASTER_MAP_UNIT}/${partyId}`, btnId)//get api
export const ImportMaster_Map_Unit_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_MASTER_MAP_UNIT, jsonBody, btnId)// post api

export const ExcelUpload_Invoice_Save_API = ({ jsonBody, btnId }) => post(url.BULK_INVOICES, jsonBody, btnId)// post api
export const ExcelUpload_Retailer_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_BULK_RETAIER, jsonBody, btnId)// post api


export const ImportFieldAdd_Save_API = ({ jsonBody, btnId }) => post(url.IMPORT_FIELD_ADD_SAVE, jsonBody, btnId)// post api
export const ImportFieldAdd_Post_API = (jsonBody) => post(url.IMPORT_FIELD_ADD_FILTER, jsonBody)
export const ImportFieldAdd_Delete_API = ({ deleteId, btnId }) => del(`${url.IMPORT_FIELD_ADD_SAVE}/${deleteId}`, btnId)// delete api
export const ImportFieldAdd_Edit_API = ({ editId, btnId }) => get(`${url.IMPORT_FIELD_ADD_SAVE}/${editId}`, btnId)// edit api
export const ImportFieldAdd_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.IMPORT_FIELD_ADD_SAVE}/${updateId}`, jsonBody, btnId)// update api

export const ImportExcelType_API = () => get(url.IMPORT_EXCEL_TYPE)// update api

// SubGroup API
export const get_SubGroup_List_Api = () => get(url.SUBGROUP_API)// get api
export const Post_SubGroupList_API = ({ jsonBody, btnId }) => post(url.SUBGROUP_API, jsonBody, btnId)// post api
export const del_SubGroup_List_API = ({ deleteId, btnId }) => del(`${url.SUBGROUP_API}/${deleteId}`, btnId)// delete api
export const edit_SubGroup_List_Api = ({ editId, btnId }) => get(`${url.SUBGROUP_API}/${editId}`, btnId)// edit api
export const update_SubGroup_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.SUBGROUP_API}/${updateId}`, jsonBody, btnId)// update api

// General API
export const Post_General_List_Api = (data) => post(url.GENERAL_MASTER_LIST, data)// get api
export const Post_General_API = ({ jsonBody, btnId }) => post(url.GENERAL_API, jsonBody, btnId)// post api
export const delete_General_List_Api = ({ deleteId, btnId }) => del(`${url.GENERAL_API}/${deleteId}`, btnId)// delete api
export const edit_General_List_Api = ({ editId, btnId }) => get(`${url.GENERAL_API}/${editId}`, btnId)// edit api
export const update_General_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.GENERAL_API}/${updateId}`, jsonBody, btnId)// update api
export const post_Type_API = (data) => post(url.TYPE_API, data)// Type DropDown API

//Routes API
export const Routes_Get_API = (filters) => post(url.ROUTES_FILTER, filters)// post api
export const Routes_Post_API = ({ jsonBody, btnId }) => post(url.ROUTES_FOR_MASTER, jsonBody, btnId) // post api
export const Routes_Edit_API = ({ editId, btnId }) => get(`${url.ROUTES_FOR_MASTER}/${editId}`, btnId) // edit api
export const Routes_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.ROUTES_FOR_MASTER}/${updateId}`, jsonBody, btnId)// update
export const Routes_Delete_API = ({ deleteId, btnId }) => del(`${url.ROUTES_FOR_MASTER}/${deleteId}`, btnId) // delete api

//salesMan API
export const SalesMan_Get_API = (filters) => post(url.SALESMAN_FOR_LIST, filters) // post api
export const SalesMan_Post_API = ({ jsonBody, btnId }) => post(url.SALESMAN_FOR_MASTER, jsonBody, btnId)// post api
export const SalesMan_Edit_API = ({ editId, btnId }) => get(`${url.SALESMAN_FOR_MASTER}/${editId}`, btnId) // edit api
export const SalesMan_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.SALESMAN_FOR_MASTER}/${updateId}`, jsonBody, btnId)// update
export const SalesMan_Delete_API = ({ deleteId, btnId }) => del(`${url.SALESMAN_FOR_MASTER}/${deleteId}`, btnId) // delete api

//Bank Api
export const get_Bank_List_Api = () => get(url.BANK_LIST_FILTER)
export const Post_Bank_Master_API = ({ jsonBody, btnId }) => post(url.BANK, jsonBody, btnId)// post api
export const edit_Bank_List_Api = ({ editId, btnId }) => get(`${url.BANK}/${editId}`, btnId) // edit api
export const update_Bank_List_Api = ({ jsonBody, updateId, btnId }) => put(`${url.BANK}/${updateId}`, jsonBody, btnId)// update
export const detelet_Bank_List_Api = ({ deleteId, btnId }) => del(`${url.BANK}/${deleteId}`, btnId) // delete api

//Bank Assign Api
export const PartyBankfilter_API = (filters) => post(url.PARTY_BANK_FILTER, filters)
export const Post_Bank_Assign_API = ({ jsonBody, btnId }) => post(url.BANK_ASSIGN, jsonBody, btnId)// post api
export const edit_Bank_Assign_Api = ({ editId, btnId }) => get(`${url.BANK_ASSIGN}/${editId}`, btnId) // edit api
export const update_Bank_Assign_Api = ({ jsonBody, updateId, btnId }) => put(`${url.BANK_ASSIGN}/${updateId}`, jsonBody, btnId)// update


//Credit Limit
export const Post_CreditLimit_Master_API = ({ jsonBody, btnId }) => post(url.CREDIT_LIMIT, jsonBody, btnId)// post api
export const CreditLimit_GoButton_Post_API = (jsonBody) => post(url.GO_BUTTON_POST_API_FOR_CREDIT_LIMIT, jsonBody)// Go Button post api

// Route Update
export const Route_Update_List_API = (data) => post(url.ROUTE_UPDATE_LIST, data)// Route Update List API For get Party List
export const Post_Route_Update_API = ({ jsonBody, btnId }) => post(url.ROUTE_UPDATE, jsonBody, btnId)// Route Update Post API

// Loading Sheet
export const Loading_Sheet_Go_Button_API = (data) => post(url.LOADING_SHEET_GO_BUTTON_API, data)//Loading Sheet go button API For Master Page
export const Loading_Sheet_Post_API = ({ jsonBody, btnId }) => post(url.LOADING_SHEET, jsonBody, btnId)// Loading Sheet Post API For Master Page
export const Loading_Sheet_get_API = (filters) => post(url.LOADING_SHEET_LIST, filters)// Post API For Loading Sheet List
export const Loading_Sheet_Del_API = ({ deleteId, btnId }) => del(`${url.LOADING_SHEET}/${deleteId}`, btnId)// Loading Sheet Post API For Master Page
export const Loading_Sheet_Update_API = ({ RowId, btnId }) => get(`${url.LOADING_SHEET}/${RowId}`, btnId)// Loading Sheet Post API For Master Page

// PartyMasterBulkUpdate
export const Post_PartyMasterBulkUpdateAPI = ({ jsonBody, btnId }) => post(url.PARTY_MASTER_BULK_UPDATE, jsonBody, btnId)// post api
export const PartyMasterBulkUpdate_GoButton_Post_API = (jsonBody) => post(url.GO_BUTTON_POST_API_FOR_PARTY_MASTER_BULK_UPDATE, jsonBody)// Go Button post api
export const post_PartyAPI = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)// post api
export const post_SelectFieldAPI = (jsonBody) => post(url.GENERAL_MASTER_SUB_TYPE, jsonBody)// post api
export const Update_Party_Bulk = ({ jsonBody, updateId, btnId }) => put(`${url.PARTY_MASTER_BULK_UPDATE}/${updateId}`, jsonBody, btnId)// update api

// Order Page api  
export const OrderPage_GoButton_API = ({ jsonBody, btnId }) => post(url.ORDER_Edit_API, jsonBody, btnId)//get api
export const OrderList_get_Filter_API = ({ filtersBody, btnId }) => post(url.ORDER_LiST_BY_FILTERS, filtersBody, btnId)
export const OrderPage_Save_API_ForPO = ({ jsonBody, btnId }) => post(url.ORDER_PAGE_API, jsonBody, btnId)//get api
export const OrderPage_Edit_Post_API = ({ jsonBody, btnId }) => post(url.ORDER_Edit_API, jsonBody, btnId)//Edit Order
export const OrderPage_Edit_Get_API = ({ orderId }) => get(`${url.ORDER_PAGE_API}/${orderId}`)//Order edit single get api
export const OrderPage_Edit_ForDownload_API = (id) => get(`${url.ORDER_PAGE_API}/${id}`)//Edit Order
export const OrderPage_Delete_API = ({ deleteId, btnId }) => del(`${url.ORDER_PAGE_API}/${deleteId}`, btnId)//Delete Order
export const OrderPage_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.ORDER_PAGE_API}/${updateId}`, jsonBody, btnId)// update api
export const getOrderList_For_Listpage = () => get(url.ORDER_PAGE_API)// Get subModule For H_pages
// export const orderApproval_Save_API = ({ jsonBody, btnId }) => orderApporval(jsonBody, btnId)//order approval
export const orderApproval_Save_API = ({ jsonBody, btnId }) => post(url.ORDER_APPROVAL_API, jsonBody, btnId)// Order approval
// OrderType Dropdown API
export const get_OrderType_Api = () => get(url.ORDER_TYPE_API) // get api

export const OrderConfirm_post_API = ({ jsonBody, btnId }) => post(url.ORDER_CONFIRM_API, jsonBody, btnId)// update api

//GRN PAGE grn 
export const GRN_STP_for_orderList_goBtn = ({ filtersBody, btnId }) => post(url.GRN_STP_FOR_ORDER_lIST_goBtn, filtersBody, btnId)// Get subModule For H_pages
export const GRN_get_API = ({ filtersBody, btnId }) => post(url.GRN_LiST_BY_FILTERS, filtersBody, btnId)
export const GRN_Edit_API = ({ editId, btnId }) => get(`${url.GRN}/${editId}`, btnId)// edit api
export const GRN_Post_API = ({ jsonBody, btnId }) => post(url.GRN, jsonBody, btnId)//get api
export const GRN_update_API = ({ jsonBody, updateId, btnId }) => put(`${url.GRN}/${updateId}`, jsonBody, btnId)// update api
export const GRN_delete_API = ({ deleteId, btnId }) => del(`${url.GRN}/${deleteId}`, btnId)//Delete Order
export const GRN_Make_API = ({ jsonBody, btnId }) => post(url.GRN_MAKE_API, jsonBody, btnId)

//Challan API
export const Challan_get_API = (filter) => post(url.CHALLAN_LIST_BY_FILTERS, filter)
export const Challan_delete_API = (id) => del(`${url.CHALLAN_SAVE_GRN_LIST}/${id}`)//Delete challan
export const Challan_Save_API = (data) => post(url.CHALLAN_SAVE_GRN_LIST, data)//Make challan
export const Challan_Make_API = ({ makeBody, btnId }) => post(url.CHALLAN_SAVE_GRN_LIST, makeBody, btnId)//Make challan
export const Challan_items_API = (data) => post(url.CHALLAN_ITEMS, data)//Make challan
export const Challan_items_Stock_API = (data) => post(url.CHALLAN_ITEMS_STOCK, data)//Make challan

// BOM API
export const BOM_ListPage_API = (filters) => post(url.BOM_LiST, filters)// get list api
export const BOM_Post_API = ({ jsonBody, btnId }) => post(url.BOM, jsonBody, btnId)// post api
export const BOM_Edit_API = ({ editId, btnId }) => get(`${url.BOM}/${editId}`, btnId) //Single get api BOMList 
export const BOM_Update_API = ({ jsonBody, updateId, btnId }) => put(`${url.BOM}/${updateId}`, jsonBody, btnId)// update api
export const BOM_Delete_API = ({ deleteId, btnId }) => del(`${url.BOM}/${deleteId}`, btnId)// delete api
export const GetItemUnits_For_Dropdown = (data) => post(url.GET_ITEM_UNITS, data)// post api

// Work Order API
export const BOMList_Get_API = (filters) => post(url.BOM_LiST, filters)// get Items dropdown api
export const WorkOrder_GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_WORKORDER, data)// go button postapi
export const Post_WorkOrder_Master_API = ({ jsonBody, btnId }) => post(url.POST_WORK_ORDER_API, jsonBody, btnId)// post api
export const WorkOrder_Get_API = (filters) => post(url.WORK_ORDER_LIST, filters)// get list api
export const WorkOrder_edit_Api = ({ editId, btnId }) => get(`${url.WORK_ORDER_LIST_API}/${editId}`, btnId) //Single get api BOMList 
export const WorkOrder_Update_Api = ({ jsonBody, updateId, btnId }) => put(`${url.WORK_ORDER_LIST_API}/${updateId}`, jsonBody, btnId)// update api
export const WorkOrder_Delete_Api = ({ deleteId, btnId }) => del(`${url.WORK_ORDER_LIST_API}/${deleteId}`, btnId)// delete api

// Material Issue
export const Material_Issue_GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_MATERIAL_ISSUE, data)// go button postapi
export const Material_Issue_Post_API = ({ jsonBody, btnId }) => post(url.POST_API_FOR_MATERIAL_ISSUE, jsonBody, btnId)//  postapi
export const Material_Issue_Get_API = (filters) => post(url.POST_API_FOR_MATERIAL_ISSUE_LIST, filters)// get list api
export const Material_Issue_Edit_API = ({ editId, btnId }) => get(`${url.POST_API_FOR_MATERIAL_ISSUE}/${editId}`, btnId)// delete api
export const Material_Issue_Delete_API = ({ deleteId, btnId }) => del(`${url.POST_API_FOR_MATERIAL_ISSUE}/${deleteId}`, btnId)// delete api

// Production 
export const Production_Post_API = ({ jsonBody, btnId }) => post(url.PRODUCTION_POST_API, jsonBody, btnId)// Production save API
export const production_get_API = (filters) => post(url.PRODUCTION_LIST_FILTER, filters)// go button postapi
export const production_Edit_API = ({ editId, btnId }) => get(`${url.PRODUCTION_POST_API}/${editId}`, btnId)// make production to material Issue postapi
export const production_Make_API = (data) => post(url.PRODUCTION_MAKE_API, data)// make production to material Issue postapi
export const production_UnitDropdown_API = (data) => post(url.PRODUCTION_UNIT_DROPDOWN_API, data)
export const Production_Delete_API = ({ deleteId, btnId }) => del(`${url.PRODUCTION_POST_API}/${deleteId}`, btnId)// delete api

// Production Re_Issue

export const Production_ReIssue_save_API = (data) => post(url.PRODUCTION_REIISUE_SAVE, data)// go button postapi
export const Production_ReIssue_get_API = (filters) => post(url.PRODUCTION_REIISUE_LIST_FILTER, filters)// go button postapi
export const Production_ReIssue_Edit_API = (id) => get(`${url.PRODUCTION_POST_API}/${id}`)// make production to material Issue postapi
export const Production_ReIssueproduction_Make_API = (data) => post(url.PRODUCTION_MAKE_API, data)// make production to material Issue postapi
export const Production_ReIssue_Delete_API = (id) => del(`${url.PRODUCTION_REIISUE_SAVE}/${id}`)// delete api
export const Production_ReIssueItemDropdown_API = (data) => post(url.PRODUCTION_REIISUE_ITEM, data)// delete api
export const Production_ReIssue_AddPageGOBtn_API = (data) => post(url.PRODUCTION_REIISUE_ITEM, data)// delete api

// Invoice
export const Invoice_1_GoButton_API = ({ jsonBody, btnId }) => post(url.INVOICE_1_ADD_PAGE_GO_BTN, jsonBody, btnId)// go button postapi
export const Invoice_1_Save_API = ({ jsonBody, btnId }) => post(url.INVOICE_1_SAVE, jsonBody, btnId)//  postapi
export const Invoice_1_Get_Filter_API = ({ filtersBody, btnId }) => post(url.INVOICE_1_lIST_FILTER, filtersBody, btnId)//  postapi
export const Invoice_1_Delete_API = ({ deleteId, btnId }) => del(`${url.INVOICE_1_SAVE}/${deleteId}`, btnId)// delete api
export const Invoice_1_Edit_API_Singel_Get = ({editId}) => get(`${url.INVOICE_1_SAVE}/${editId}`)// delete api

//**************************** E-Invoice (upload ,cancel,print) ***************************************/

export const EInvoice_Uploade_Get_API = ({ RowId, UserID }) => get(`${url.UPLOADED_E_INVOICE}/${RowId}/${UserID}`)// Uploade_EInvoice
export const EInvoice_Cancel_Get_API = ({ RowId, UserID }) => get(`${url.CANCEL_E_INVOICE}/${RowId}/${UserID}`)// Cancel_EInvoice

//**************************** E-WayBill (upload ,cancel,print) actions ***************************************/

export const EwayBill_Uploade_Get_API = ({ RowId, UserID }) => get(`${url.UPLOADED_E_WAY_BILL}/${RowId}/${UserID}`)// Uploade_EwayBill
export const EwayBill_Cancel_Get_API = ({ RowId, UserID }) => get(`${url.CANCEL_E_WAY_BILL}/${RowId}/${UserID}`)// Cancel_EwayBill

//IB Invoice 2 
export const IB_Invoice_GoButton_API = ({ jsonBody, btnId }) => post(url.IB_INVOICE_ADD_PAGE_GO_BTN, jsonBody, btnId)// go button postapi
export const IB_Invoice_Save_API = ({ jsonBody, btnId }) => post(url.IB_INVOICE_SAVE, jsonBody, btnId)//  postapi
export const IB_Invoice_Get_Filter_API = ({ filtersBody, btnId }) => post(url.IB_INVOICE_lIST_FILTER, filtersBody, btnId)//  postapi
export const IB_Invoice_Delete_API = ({ deleteId, btnId }) => del(`${url.IB_INVOICE_SAVE}/${deleteId}`, btnId)// delete api
export const IB_Invoice_Edit_API_Singel_Get = ({ editId, btnId }) => get(`${url.IB_INVOICE_SAVE}/${editId}`, btnId)// delete api




//************************************Inter Branch ************************************/

// IBOrder
export const IBOrderPage_GoButton_API = (jsonBody, btnId) => post(url.GO_BUTTON_POST_API_FOR_IBORDER, jsonBody, btnId)//go button api
export const IBOrderPage_Save_API = (data) => post(url.SAVE_API_FOR_IBORDER, data)//post api
export const IBOrderList_get_Filter_API = ({ filtersBody, btnId }) => post(url.IBORDER_LiST_BY_FILTERS, filtersBody, btnId)//list page

export const IB_Division_DROP_API = (data) => post(url.IB_DIVISION_DROPDOWN, data)//dropdown api
export const IBOrderPage_Edit_API = (data) => post(url.GO_BUTTON_POST_API_FOR_IBORDER, data)//edit
export const IBOrderPage_Delete_API = (id) => del(`${url.SAVE_API_FOR_IBORDER}/${id}`)//delete
export const IBOrderPage_Update_API = (data, id) => put(`${url.SAVE_API_FOR_IBORDER}/${id}`, data)//update

// Inward
export const Inward_Post_API = (data) => post(url.POST_API_FOR_INWARD, data)// Inward post api
export const Inward_List_API = (filters) => post(url.INWARD_LIST_API, filters)// List Api
export const Inward_Delete_API = (id) => del(`${url.POST_API_FOR_INWARD}/${id}`)// delete api
export const Make_Inward_Post_API = ({ makeInwardId, btnId }) => get(`${url.MAKE_INWARD_BUTTON_API}/${makeInwardId}`, btnId)// Inward post api

//Report API
export const MultipleInvoice_API = (id) => get(`${url.MULTIPLEINVOICE_API}/${id}`)//dropdown api
export const LoadingSheet_API = (id) => get(`${url.LOADINGSHEET_PARTY_WISE_INVOICE}/${id}`)//dropdown api


// Management Parties API
export const Management_Parties_Post_API = ({ jsonBody, btnId }) => post(url.MANAGEMENT_PARTIES, jsonBody, btnId)//  postapi
export const Go_Button_Post_API = (jsonBody) => post(url.GO_BUTTON_API_MANAGEMENT_PARTIES, jsonBody)//  postapi
export const Employee_drodown_Post_API = (jsonBody) => post(url.EMPLOYEE_DROPDOWN_API, jsonBody)//  postapi

//*********************************Accounting Module ************************************ */
// Receipt and Payment Entry
export const Receipt_Print = (id) => get(`${url.RECEIPT_POST_API}/${id}`)//dropdown api
export const Receipt_Go_Button_API = ({ jsonBody, btnId }) => post(url.RECEIPT_GO_BUTTON_API, jsonBody, btnId)//  postapi
export const Opening_balance_API = (jsonBody) => post(url.OPENING_BALANCE, jsonBody)//  postapi
export const Depositor_Bank_Filter_API = (jsonBody) => post(url.DEPOSITOR_BANK_FILTER, jsonBody)//  postapi
export const Receipt_Post_API = ({ jsonBody, btnId }) => post(url.RECEIPT_POST_API, jsonBody, btnId)//  postapi
export const Receipt_Filter_API = (jsonBody) => post(url.RECEIPT_FILTERS, jsonBody)// Get subModule For H_pages
export const Receipt_Type_API = (jsonBody) => post(url.GENERAL_MASTER_SUB_TYPE, jsonBody)//  postapi
export const Receipt_Delete_API = ({ deleteId, btnId }) => del(`${url.RECEIPT_POST_API}/${deleteId}`, btnId)// delete api
export const Bank_List_API = (jsonBody) => post(url.BANK_LIST_API, jsonBody)//  postapi
export const Make_Receipt_to_Payment_API = (jsonBody) => post(url.MAKE_RECEIPT_TO_PAYMENT, jsonBody)// Get subModule For H_pages

// Sales Return
export const Invoice_No_list_API = (jsonBody) => post(url.INVOICE_NUMBER_LIST, jsonBody)//Invoice No. dropdown api postapi
export const SalesReturn_add_button_api_For_Item = (jsonBody) => post(url.ADD_BUTTON_API_FOR_ITEM, jsonBody)//add button get api for item
export const SalesReturn_add_button_api_For_Invoice = (InvoiceID) => get(`${url.ADD_BUTTON_API_FOR_INVOICE}/${InvoiceID}`)//add button get api for invoice
export const SalesReturn_post_API = ({ jsonBody, btnId }) => post(url.SALES_RETURN, jsonBody, btnId)//  postapi
export const SalesReturn_list_API = (filters) => post(url.SALES_RETURN_LIST_API, filters)//Sales Return list api using post method
export const SalesReturn_Delete_API = ({ deleteId, btnId }) => del(`${url.SALES_RETURN}/${deleteId}`, btnId)// Sales Return Delete API

// Credit Debit 
export const Credit_Debit_Type = (jsonBody) => post(url.GENERAL_MASTER_SUB_TYPE, jsonBody)//  postapi
export const Go_Button_Credit_Debit_Post_API = (jsonBody) => post(url.CREDIT_DEBIT_FILTER, jsonBody)//  postapi
export const Credit_Debit_Save_API = ({ jsonBody, btnId }) => post(url.CREDIT_DEBIT, jsonBody, btnId)//post api
export const del_Credit_List_API = ({ deleteId, btnId }) => del(`${url.CREDIT_DEBIT}/${deleteId}`, btnId)// delete api
export const Edit_Credit_List_API = ({ editId, btnId }) => get(`${url.CREDIT_DEBIT}/${editId}`, btnId)// Edit api
export const InvoiceReturn_API = (id) => get(`${url.INVOICE_RETURN}/${id}`)// Invoice Return api
export const Receipt_Number_API = (jsonBody) => post(url.RECEIPT_NUMBER_LIST, jsonBody)//  postapi

export const PartyLedger_API = (FromDate, ToDate, SAPCode) => post(url.PARTY_LEDGER_API, FromDate, ToDate, SAPCode)//  postapi
export const Get_Product_Margin_Report = (IsSCM_ID, PartyID) => get(`${url.PRODUCT_MARGIN_REPORT_API}/${IsSCM_ID}/${PartyID}`)

// Order Summary
export const OderSummary_GoBtn_API = ({ jsonBody, btnId }) => post(url.ORDER_SUMMARY, jsonBody, btnId)//post api
export const PartySettingApi = (Party_id, Comapny_id) => get(`${url.PARTY_SETTING}/${Party_id}/${Comapny_id}`)// Party Setting api
export const save_PartySetting_API = ({ jsonBody, btnId }) => post(url.PARTY_SETTING, jsonBody, btnId)//  postapi
export const PartyLedgerReport_API = (jsonBody) => post(url.PARTY_LEDGER, jsonBody)//  postapi


// export const PartyLedger_API = (FromDate,ToDate,SAPCode) => get(`http://web.chitalebandhu.in:8080/FoodERPWebAPIPOS/api/SAPDataSendToSCM/GetSAPCustomerLedgerList?FromDate=${FromDate}&ToDate=${ToDate}&SAPCode=${SAPCode}`)//  postapi
// Dashboard 

export const Dashboard_Get_API = (id) => get(`${url.DASHBOARD}/${id}`)// Dashboard grt api

//StockEntry

export const StockEntry_GO_button_api_For_Item = (ItemId) => get(`${url.STOCK_ENTRY_GO_BUTTON}/${ItemId}`)//add button get api for item

export const StockEntry_Post_API = ({ jsonBody, btnId }) => post(url.STOCK_ENTRY, jsonBody, btnId)//post api

//Stock Report
export const StockReport_GoBtn_API = ({ jsonBody, btnId }) => post(url.STOCK_REPORT, jsonBody, btnId)//Go button api


export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtProfile,

}










