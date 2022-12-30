import axios from "axios"
import { del, get, put, post, postForget, } from "./api_helper"
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

const postFakeProfile = data => post(url.POST_EDIT_PROFILE, data)

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

export const Python_FoodERP_postJwtLogin = data => post(url.FOOD_ERP_POST_JWT_LOGIN, data)
export const getUserDetails_afterLogin_ApiCall = data => post(url.FOOD_ERP_POST_USER_DETAILS_AFTER_LOGIN, data)
export const divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall = (id1) => get(`${url.DIVIDION_DROPDOWN_FOR_LOGIN_CHANGE_DIVSION_PAGE}/${id1}`)

// postForgetPwd
export const Python_FoodERP_postJwtForgetPwd_Verify_OTP = data => postForget(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_VERIFY_OTP, data)
export const Python_FoodERP_postJwtForgetPwd_SendOTP = data => postForget(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_SEND_OTP, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

export const RoleAccessApi_url = (id1, id2,) => get(`${url.ROLE_ACCESS}/${id1}/${id2}`)
export const post_SuperAdmin = (data) => post(url.SUPER_ADMIN_API, data) //save And Update

//  common pages get data for page filed and validation
export const commonPageFiled_API = (pageId) => get(`${url.PAGE_FIELD}/${pageId}`)


// Employees  Component All Api 

export const getDesignationID_For_Dropdown = () => get(url.GET_DESIGNATIONID)
export const getEmployeeType_For_Dropdown = () => get(url.GET_EMPLOYEE_TYPE)
export const getState_For_Dropdown = () => get(url.GET_STATE)
export const getComapny_For_Dropdown = () => get(url.COMPANY_API_URL)
export const post_EmployeeData = (data) => post(url.EMPLOYEE_API_URL, data) //save And Update
export const get_EmployeelistApi = () => get(url.EMPLOYEE_API_URL) // get api
export const detelet_EmployeeID = (id) => del(`${url.EMPLOYEE_API_URL}/${id}`) // delete api
export const edit_EmployeeAPI = (id) => get(`${url.EMPLOYEE_API_URL}/${id}`) // edit api
export const update_EmployeeAPI = (data, id) => put(`${url.EMPLOYEE_API_URL}/${id}`, data)// update 
export const Get_CompanyBy_EmployeeType_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_EMPLOYEETYPES_ID}/${id}`)//  GetCompanyByDivisionTypeID DropDown API

//User Registration  All APIs 
export const getEmployee_Dropdown_For_UserRegistration_API = () => get(url.EMPLOYEE_LIST_FOR_DROPDOWN_API_URL)//get api for Dropdown_list data 
export const RolesListDropdown_For_UserRegistration_API = () => get(url.ROLE_API_URL)
export const User_Component_PostMethod_API = (data) => post(url.REGISTRATION_API_URL, data)//post for (save and update) User_Component
export const User_Component_GetMethod_API = () => get(url.USER_API_URL) //Get User_Component
export const User_Component_Delete_Method_API = (id) => del(`${url.USER_API_URL}/${id}`) // delete api
export const User_Component_EditById_API = (id) => get(`${url.USER_API_URL}/${id}`) // edit api
export const User_Component_Update_API = (data, id) => put(`${url.USER_API_URL}/${id}`, data) // update api
export const UserPartiesForUserMaster_API = (id) => get(`${url.USER_PARTIES_FOR_USER_MASTER}/${id}`) // delete api



// Role Master
export const Role_Master_Get_API = () => get(url.ROLE_MASTER_API)//get api
export const Role_Master_Post_API = (data) => post(url.ROLE_MASTER_API, data)// post api
export const Role_Master_Delete_API = (id) => del(`${url.ROLE_MASTER_API}/${id}`)// delete api
export const Role_Master_Edit_API = (id) => get(`${url.ROLE_MASTER_API}/${id}`)// edit api
export const Role_Master_Update_API = (data, id) => put(`${url.ROLE_MASTER_API}/${id}`, data)// update api


//Administrator   Modules submit  
export const postSubmitModules = (data) => post(url.H_MODULES_API_URL, data)
export const Fetch_ModulesList = () => get(url.H_MODULES_API_URL,)//module-list get API method
export const delete_ModuleID = (id) => del(`${url.H_MODULES_API_URL}/${id}`)// Delete_Modules_By-ID
export const edit_ModuleID = (id) => get(`${url.H_MODULES_API_URL}/${id}`)// Edit_Modules- by_ID
export const updateModule_ID = (data, id) => put(`${url.H_MODULES_API_URL}/${id}`, data)// Update_Modules- by_ID

//Fetch Company LIst
export const fetch_CompanyList = () => get(url.COMPANY_API_URL,)
export const edit_CompanyID = (id) => get(`${url.COMPANY_API_URL}/${id}`)// Edit_Company- by_ID
export const delete_CompanyID = (id) => del(`${url.COMPANY_API_URL}/${id}`)// Delete_Company_By-ID
export const postSubmit_Company = (data) => post(url.COMPANY_API_URL, data)// Company_Modules submit 
export const updateCompany_ID = (data, id) => put(`${url.COMPANY_API_URL}/${id}`, data)// Update_Company- by_ID
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
export const edit_HPageID = (id) => get(`${url.H_PAGES_API_URL}/${id}`)// get edit H_Pages ID Data 
export const updateHPages = (Data, id) => put(`${url.H_PAGES_API_URL}/${id}`, Data) // Upadate H_Page api
export const saveHPagesAPI = (Data) => post(url.H_PAGES_API_URL, Data)
export const deletHPagesUsingID_API = (id) => del(`${url.H_PAGES_API_URL}/${id}`)

// M_Items
export const Items_Group_Get_API = () => get(url.ITEMS_GROUP_API)//get api
export const Items_Master_Get_API = () => get(url.Items_MASTER_API)//get api
export const Items_Master_Post_API = (data) => post(url.Items_MASTER_API, data)// post api
export const Items_Master_Delete_API = (id) => del(`${url.Items_MASTER_API}/${id}`)// delete api
export const Items_Master_Edit_API = (id) => get(`${url.Items_MASTER_API}/${id}`)// edit api
export const Items_Master_Update_API = (data, id) => put(`${url.Items_MASTER_API}/${id}`, data)// update api

export const BaseUnit_Get_DropDown_API = () => get(url.BASEUNIT_DROPDOWN_API)// BaseUnit DropDown api
export const CategoryType_Get_DropDown_API = () => get(url.CATEGORY_TYPES_API)// CategoryType DropDown api
export const ImageType_Get_DropDown_API = () => get(url.IMAGETYPE_DROPDOWN_API)// ImageType DropDown api
export const MRPType_Get_DropDown_API = () => get(url.MRP_TYPE_DROPDOWN_API)// MRP Type DropDown api
export const Division_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const Party_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const PriceList_Get_DropDown_API = () => get(url.PRICE_LIST)// PriceList DropDown api
export const Category_By_CategoryTypes_DropDown_API = (id) => get(`${url.CATEGORY_DROPDOWN_API}/${id}`)//  GetCategoryByCategoryTypeID DropDown API
export const SubCategory_By_CategoryTypes_DropDown_API = (id) => get(`${url.SUBCATEGORY_DROPDOWN_API}/${id}`)//  GetSubCategoryByCategoryID DropDown API
export const Group_By_GroupTypes_DropDown_API = (id) => get(`${url.GET_GROUP_BY_GROUPTYPES_ID}/${id}`)//  GetGroupByGroupTypeID DropDown API
export const SubGroup_By_Group_DropDown_API = (id) => get(`${url.GET_SUBGROUP_BY_GROUP_ID}/${id}`)// GetSubGroupByGroupID DropDown API
export const Get_Item_Tag = () => get(url.GET_ITEM_TAG)// Get Item Tag Api
export const Get_Brand_Tag = () => get(url.GET_BRAND_TAG)// Get Item Tag Api




// Party Master
export const Party_Master_Get_API = () => get(url.PARTY_MASTER_API)//get api
export const Party_Master_Post_API = (data) => post(url.PARTY_MASTER_API, data)// post api
export const Party_Master_Delete_API = (id) => del(`${url.PARTY_MASTER_API}/${id}`)// delete api
export const Party_Master_Edit_API = (id) => get(`${url.PARTY_MASTER_API}/${id}`)// edit api
export const Party_Master_Update_API = (data, id) => put(`${url.PARTY_MASTER_API}/${id}`, data)// update api
export const GetDistrictOnState_For_Dropdown = (id) => get(`${url.GetDistrictOnState}/${id}`)//  GetDistrictOnState DropDown API
export const GetPriceList_For_Dropdown = () => get(url.PRICELIST)//  get priceList
export const GetAddressTypes_For_Dropdown = () => get(url.ADDRESSTYPES)//  get addresstypes
export const GetPartyTypes_For_Dropdown = () => get(url.PARTYTYPES)//  get partytypes
export const GetCompany_For_Dropdown = () => get(url.COMPANY)//  get company
export const GetPartyTypeByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_PARTYTYPE_BY_DIVISIONTYPES_ID}/${id}`)//  GetDistrictOnState DropDown API
export const GetCompanyByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_DIVISIONTYPES_ID}/${id}`)//  GetCompanyByDivisionTypeID DropDown API

//RoleAccess

export const PageDropdownForRoleAccessList_Api = (id1, id2) => get(`${url.PAGE_DROPDOWN_FOR_ROLE_ACCESS_ADD_PAGE}/${id1}/${id2}`)//get api Pages
export const GetRoleListForRoleAccessList_Page_Api = (id1, id2) => get(`${url.GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}`) //get api role List 
export const GO_Button_HandlerForRoleAccessList_Api = (id1, id2) => get(`${url.GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}`) //get api role List 
export const AddPageHandlerForRoleAccessList_Api = (id1) => get(`${url.ADD_PAGE_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}`) //get api role List 
export const PostMethod_HandlerForRoleAccessList_Api = (data) => post(url.ROLE_ACCESS, data) //post api role Access List 
export const Get_RoleAccess_List_Page_Api = () => get(url.GET_ROLEACCESS_LIST_PAGE_API)//get RoleAccess List Page API
export const Post_CopyRoleAccess_for_RoleAccess_Api = (data) => post(url.POST_COPY_ROLE_ACCESS_API, data)//POST COPY  RoleAccess API

// Employee Type API
export const Employee_Type_API = (data) => post(url.EMPLOYEE_TYPE_API, data)// post api
export const get_EmployeeType_List_Api = () => get(url.EMPLOYEE_TYPE_API) // get api
export const detelet_EmployeeType_List_Api = (id) => del(`${url.EMPLOYEE_TYPE_API}/${id}`) // delete api
export const edit_EmployeeType_List_Api = (id) => get(`${url.EMPLOYEE_TYPE_API}/${id}`) // edit api
export const update_EmployeeType_List_Api = (data, id) => put(`${url.EMPLOYEE_TYPE_API}/${id}`, data)// update 

// Party Type API
export const Post_Party_Type_API = (data) => post(url.PARTYTYPES_API, data)// post api
export const get_PartyType_List_Api = () => get(url.PARTYTYPES_API) // get api
export const detelet_PartyType_List_Api = (id) => del(`${url.PARTYTYPES_API}/${id}`) // delete api
export const edit_PartyType_List_Api = (id) => get(`${url.PARTYTYPES_API}/${id}`) // edit api
export const update_PartyType_List_Api = (data, id) => put(`${url.PARTYTYPES_API}/${id}`, data)// update 

// Division Types API
export const Post_Division_Type_API = (data) => post(url.DIVISION_TYPES_API, data)// post api
export const get_DivisionType_List_Api = () => get(url.DIVISION_TYPES_API) // get api
export const detelet_DivisionType_List_Api = (id) => del(`${url.DIVISION_TYPES_API}/${id}`) // delete api
export const edit_DivisionType_List_Api = (id) => get(`${url.DIVISION_TYPES_API}/${id}`) // edit api
export const update_DivisionType_List_Api = (data, id) => put(`${url.DIVISION_TYPES_API}/${id}`, data)// update 

// Cateogory Types API
export const Post_Category_Type_Master_API = (data) => post(url.CATEGORY_TYPES_API, data)// post api
export const get_CategoryType_List_Api = () => get(url.CATEGORY_TYPES_API) // get api
export const detelet_CategoryType_List_Api = (id) => del(`${url.CATEGORY_TYPES_API}/${id}`) // delete api
export const edit_CategoryType_List_Api = (id) => get(`${url.CATEGORY_TYPES_API}/${id}`) // edit api
export const update_CategoryType_List_Api = (data, id) => put(`${url.CATEGORY_TYPES_API}/${id}`, data)// update

//Category API
export const Post_Category_API = (data) => post(url.CATEGORY_API, data)// post api
// export const get_Category_Master_API = () => get(url. CATEGORY_TYPES_API)// Product Category DropDown Api api
export const get_Category_List_Api = () => get(url.CATEGORY_API) // get api
export const detelet_Category_List_Api = (id) => del(`${url.CATEGORY_API}/${id}`) // delete api
export const edit_Category_List_Api = (id) => get(`${url.CATEGORY_API}/${id}`) // edit api
export const update_Category_List_Api = (data, id) => put(`${url.CATEGORY_API}/${id}`, data)// update

//Vehicle API
export const Post_Vehicle_API = (data) => post(url.VEHICLE_API, data)// post api
export const get_Vehicle_API = () => get(url.VEHICLE_API)//  get Api 
export const get_VehicleTypes_API = () => get(url.VEHICLETYPES_DROPDOWN)//dropDown
export const get_DriverListAPI = () => get(url.DRIVERLIST_DROPDOWN)//dropDown
export const detelet_VehicleType_List_Api = (id) => del(`${url.VEHICLE_API}/${id}`) // delete api
export const edit_VehicleType_List_Api = (id) => get(`${url.VEHICLE_API}/${id}`) // edit api
export const update_VehicleType_List_Api = (data, id) => put(`${url.VEHICLE_API}/${id}`, data)// update

//CompanyGroup API
export const Post_CompanyGroup_API = (data) => post(url.COMPANYGROUP_API, data)// post api
export const get_CompanyGroupList_API = () => get(url.COMPANYGROUP_API)//  get Api 
export const detelet_CompanyGroupType_List_Api = (id) => del(`${url.COMPANYGROUP_API}/${id}`) // delete api
export const edit_CompanyGroupType_List_Api = (id) => get(`${url.COMPANYGROUP_API}/${id}`) // edit api
export const update_CompanyGroupType_List_Api = (data, id) => put(`${url.COMPANYGROUP_API}/${id}`, data)// update

//Driver api
export const Post_Driver_API = (data) => post(url.DRIVER_API, data)// post api
export const get_DriverList_API = () => get(url.DRIVER_API)//  get Api 
export const detelet_DriverType_List_Api = (id) => del(`${url.DRIVER_API}/${id}`) // delete api
export const edit_DriverType_List_Api = (id) => get(`${url.DRIVER_API}/${id}`) // edit api
export const update_DriverType_List_Api = (data, id) => put(`${url.DRIVER_API}/${id}`, data)// update

//PriceList api
export const Post_PriceList_API = (data) => post(url.PRICE_LIST, data)// post api
export const get_PriceListByPartyType_API = (partyType) => get(`${url.PRICE_LIST}/${partyType}`)// post api
export const GetPriceList_For_Listpage = () => get(url.PRICELIST)//  get priceList
export const delete_PriceList_API = (id) => del(`${url.PRICE_LIST}/${id}`)// delete api
export const edit_PriceList = (id) => get(`${url.PRICE_LIST}/${id}`) // edit api
export const update_PriceList = (data, id) => put(`${url.PRICE_LIST}/${id}`, data)// update

// MRP Master 
export const Post_MRPMaster_API = (data) => post(url.MRP_MASTER_LIST, data)// post api
export const GetMRPList_For_Listpage = () => get(url.MRP_MASTER_LIST)// getapi
export const update_MRPList = (data, id) => put(`${url.MRP_MASTER_LIST}/${id}`, data)// update_MRPList
export const edit_MRPList = (id) => get(`${url.MRP_MASTER_LIST}/${id}`)// edit api
export const delete_MRPList_API = (CommonID) => del(`${url.DELETE_API_FOR_MRP_LIST_PAGE}/${CommonID}`)// delete api
export const GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_MRP_MASTER, data)// go button postapi
export const MRP_MasterPage_delete_API = (id) => del(`${url.MRP_MASTER_LIST}/${id}`)// delete api MRP Master Page

// Margin Master
export const Post_MarginMaster_API = (data) => post(url.MARGIN_MASTER_LIST, data)// post api
export const GetMarginList_For_Listpage = () => get(url.MARGIN_MASTER_LIST)//  get List
export const delete_MarginList_API = (CommonID) => del(`${url.DELETE_API_FOR_LIST_MARGIN_PAGE}/${CommonID}`)// post api
export const edit_MarginList = (id) => get(`${url.MARGIN_MASTER_LIST}/${id}`) // edit api
export const update_MarginList = (data, id) => put(`${url.MARGIN_MASTER_LIST}/${id}`, data)// update
export const GoButton_Post_API_For_MarginMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_MARGIN_MASTER, data)// go button postapi
export const Margin_MasterPage_delete_API = (id) => del(`${url.MARGIN_MASTER_LIST}/${id}`)// delete api Margin Master Page

// GroupTypes API
export const GroupTypes_API = () => get(url.GROUP_TYPE_API)
export const GroupTypes_Post_API = (data) => post(url.GROUP_TYPE_API, data)// post api
export const GroupTypes_Delete_API = (id) => del(`${url.GROUP_TYPE_API}/${id}`)// delete api
export const GroupTypes_Edit_API = (id) => get(`${url.GROUP_TYPE_API}/${id}`)// edit api
export const GroupTypes_Update_API = (data, id) => put(`${url.GROUP_TYPE_API}/${id}`, data)// update api

// GroupMaster

export const get_Group_List_Api = () => get(url.GROUP_API)// get api
export const Post_GroupList_API = (data) => post(url.GROUP_API, data)// post api
export const del_Group_List_API = (id) => del(`${url.GROUP_API}/${id}`)// delete api
export const edit_Group_List_Api = (id) => get(`${url.GROUP_API}/${id}`)// edit api
export const update_Group_List_Api = (data, id) => put(`${url.GROUP_API}/${id}`, data)// update api

// TermsAndCondtions API
export const Post_TermsAndCondtions_Master_API = (data) => post(url.TERMSANDCONDITIONS_API, data)// post api
export const get_TermsAndCondtionsList_API = () => get(url.TERMSANDCONDITIONS_API)// get api
export const del_TermsAndCondtions_Master_API = (id) => del(`${url.TERMSANDCONDITIONS_API}/${id}`)// delete api
export const edit_TermsAndCondtions_Master_API = (id) => get(`${url.TERMSANDCONDITIONS_API}/${id}`)// edit api
export const update_TermsAndCondtions_Master_API = (data, id) => put(`${url.TERMSANDCONDITIONS_API}/${id}`, data)// update api

// GST API
export const Post_GSTMaster_API = (data) => post(url.GST_LIST_API, data)// post api
export const GetGSTList_For_Listpage = () => get(url.GST_LIST_API)//  get List
export const delete_GSTList_API = (CommonID) => del(`${url.DELETE_API_FOR_LIST_GST_PAGE}/${CommonID}`)// Delete api
export const GoButton_Post_API_For_GSTMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_GST_MASTER, data)// go button postapi
export const GST_MasterPage_delete_API = (id) => del(`${url.GST_LIST_API}/${id}`)// delete api

// PartySubParty API
export const PartySubParty_Get_API = () => get(`${url.PARTY_SUB_PARTY}`)// get list api
export const PartySubParty_Post_API = (data) => post(url.PARTY_SUB_PARTY, data)// post api
export const PartySubParty_Delete_API = (id) => del(`${url.PARTY_SUB_PARTY}/${id}`)// delete api
export const PartySubParty_Edit_API = (id) => get(`${url.PARTY_SUB_PARTY}/${id}`)// edit api
export const PartySubParty_Update_API = (data, id) => put(`${url.PARTY_SUB_PARTY}/${id}`, data)// update api

//PartyItems API

export const GoButton_API = (data) => post(url.PARTYITEMS, data)//get api
export const Party_Items = (data) => post(url.PARTYITEMS, data)// post api
export const get_Party_Item_List = (party_id) => get(`${url.PARTYITEMS}/${party_id}`)//get api
export const GetPartyList_API = () => get(url.PARTYITEMS)// get api

//suppiler 
export const GetSupplier_API = (party_id) => get(`${url.SUPPLIER}/${party_id}`)//get api

// SubGroup API
export const get_SubGroup_List_Api = () => get(url.SUBGROUP_API)// get api
export const Post_SubGroupList_API = (data) => post(url.SUBGROUP_API, data)// post api
export const del_SubGroup_List_API = (id) => del(`${url.SUBGROUP_API}/${id}`)// delete api
export const edit_SubGroup_List_Api = (id) => get(`${url.SUBGROUP_API}/${id}`)// edit api
export const update_SubGroup_List_Api = (data, id) => put(`${url.SUBGROUP_API}/${id}`, data)// update api


// Order Page api  

export const OrderPage_GoButton_API = (data) => post(url.ORDER_Edit_API, data)//get api
export const OrderList_get_Filter_API = (filters) => post(url.ORDER_LiST_BY_FILTERS, filters)
export const OrderPage_Post_API = (data) => post(url.ORDER_PAGE_API, data)//get api
export const OrderPage_Edit_API = (data) => post(url.ORDER_Edit_API, data)//Edit Order
export const OrderPage_Edit_ForDownload_API = (id) => get(`${url.ORDER_PAGE_API}/${id}`)//Edit Order

export const OrderPage_Delete_API = (id) => del(`${url.ORDER_PAGE_API}/${id}`)//Delete Order
export const OrderPage_Update_API = (data, id) => put(`${url.ORDER_PAGE_API}/${id}`, data)// update api
export const getOrderList_For_Listpage = () => get(url.ORDER_PAGE_API)// Get subModule For H_pages

// OrderType Dropdown API
export const get_OrderType_Api = () => get(url.ORDER_TYPE_API) // get api

//GRN PAGE grn 
export const GRN_get_API = (filter) => post(url.GRN_LiST_BY_FILTERS, filter)
export const GRN_Edit_API = (id) => get(`${url.GRN}/${id}`)// edit api
export const GRN_Post_API = (data) => post(url.GRN, data)//get api
export const GRN_update_API = (id, data) => put(`${url.GRN}/${id}`, data)// update api
export const GRN_delete_API = (id) => del(`${url.GRN}/${id}`)//Delete Order
export const GRN_Make_API = (data) => post(url.GRN_MAKE_API, data)


// BOM API
export const GetItemUnits_For_Dropdown = (data) => post(url.GET_ITEM_UNITS, data)// post api
export const BOM_ListPage_API = (filters) => post(url.BOM_LiST, filters)// get list api
export const BOM_Post_API = (data) => post(url.BOM, data)// post api
export const edit_BOMListID = (id1) => get(`${url.BOM}/${id1}`) //Single get api BOMList 
export const BOM_Update_API = (data, id) => put(`${url.BOM}/${id}`, data)// update api
export const BOM_Delete_API = (id) => del(`${url.BOM}/${id}`)// delete api

// Work Order API
export const BOMList_Get_API = (filters) => post(url.BOM_LiST, filters)// get Items dropdown api
export const WorkOrder_GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_WORKORDER, data)// go button postapi
export const Post_WorkOrder_Master_API = (data) => post(url.POST_WORK_ORDER_API, data)// post api
export const WorkOrder_Get_API = (filters) => post(url.WORK_ORDER_LIST, filters)// get list api
export const WorkOrder_edit_Api = (id1) => get(`${url.WORK_ORDER_LIST_API}/${id1}`) //Single get api BOMList 
export const WorkOrder_Update_Api = (data, id) => put(`${url.WORK_ORDER_LIST_API}/${id}`, data)// update api
export const WorkOrder_Delete_Api = (id) => del(`${url.WORK_ORDER_LIST_API}/${id}`)// delete api

// Material Issue
export const Material_Issue_GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_MATERIAL_ISSUE, data)// go button postapi
export const Material_Issue_Post_API = (data) => post(url.POST_API_FOR_MATERIAL_ISSUE, data)// go button postapi
export const Material_Issue_Get_API = (filters) => post(url.POST_API_FOR_MATERIAL_ISSUE_LIST, filters)// get list api

// Production 
export const Production_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_PRODUCTION, data)// go button postapi
export const production_get_API = (filters) => post(url.POST_API_FOR_PRODUCTION_LIST, filters)// go button postapi
export const production_Make_API = (data) => post(url.PRODUCTION_MAKE_API, data)// make production to material Issue postapi
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










