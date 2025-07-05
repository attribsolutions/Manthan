import axios from "axios"
import { del, get, put, post, postWithoutToken, postRefreshToken, getWithotMsg, postMethodExcel, delwithPostBody, postForFormData, putForFormData, postWithBasicAuth, } from "./api_helper"
import * as url from "./url_helper"
import CssItemSaleReport from "../Reports/CssItemSaleReport"

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
export const ChangePassword_API = ({ jsonBody }) => post(url.CHANGEPASSWORD_API, jsonBody)// post api

export const StockEntry_Delete_API = ({ jsonBody }) => post(url.DELETE_STOCK_ENTRY_API, jsonBody)//post api
// postForgetPwd
export const Python_FoodERP_postJwtForgetPwd_Verify_OTP = data => postWithoutToken(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_VERIFY_OTP, data)
export const Python_FoodERP_postJwtForgetPwd_SendOTP = data => postWithoutToken(url.FOOD_ERP_POST_JWT_PASSWORD_FORGET_SEND_OTP, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

export const RoleAccessApi_url = (party, employee, company) => get(`${url.ROLE_ACCESS}/${party}/${employee}/${company}`)
export const post_SuperAdmin = (data) => post(url.SUPER_ADMIN_API, data) //save And Update

// common pages get data for page filed and validation
export const commonPageFiled_API = (pageId) => get(`${url.PAGE_FIELD}/${pageId}`)
export const commonPartyDropdown_API = (employeeID) => get(`${url.COMMON_PARTY_DROPDOWN_API}/${employeeID}`)

// Employees Component All Api 
export const getDesignationID_For_Dropdown = () => get(url.GET_DESIGNATIONID)
export const getState_For_Dropdown = () => get(url.GET_STATE)
export const getCity_For_Dropdown = (DistrictId) => get(`${url.GET_CITY_ON_DISTRICT}/${DistrictId}`)
export const getComapny_For_Dropdown = () => get(url.COMPANY_API_URL)
export const save_Employee_API = ({ jsonBody }) => post(url.EMPLOYEE_API_URL, jsonBody) //save And Update
export const get_EmployeelistApi = (filters) => post(url.EMPLOYEE_FILTER_API_URL, filters) // list api using post method
export const detelet_EmployeeID = ({ deleteId }) => del(`${url.EMPLOYEE_API_URL}/${deleteId}`) // delete api
export const edit_EmployeeAPI = ({ editId }) => get(`${url.EMPLOYEE_API_URL}/${editId}`) // edit api
export const update_EmployeeAPI = ({ updateId, jsonBody }) => put(`${url.EMPLOYEE_API_URL}/${updateId}`, jsonBody)// update 
export const Get_CompanyBy_EmployeeType_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_EMPLOYEETYPES_ID}/${id}`)// GetCompanyByDivisionTypeID DropDown API

//User Registration All APIs 
export const getEmployee_Dropdown_For_UserRegistration_API = () => get(url.EMPLOYEE_LIST_FOR_DROPDOWN_API_URL)//get api for Dropdown_list data 
export const User_Component_PostMethod_API = ({ jsonBody }) => post(url.REGISTRATION_API_URL, jsonBody)//post for (save and update) User_Component
export const User_Component_GetMethod_API = (filters) => post(url.USER_API_URL, filters) //Get User_Component
export const User_Component_Delete_Method_API = ({ deleteId }) => del(`${url.USER_API_URL}/${deleteId}`) // delete api
export const User_Component_EditById_API = ({ editId }) => get(`${url.USER_API_URL}/${editId}`) // edit api
export const User_Component_Update_API = ({ jsonBody, updateId }) => put(`${url.USER_API_URL}/${updateId}`, jsonBody) // update api
export const UserPartiesForUserMaster_API = (id) => get(`${url.USER_PARTIES_FOR_USER_MASTER}/${id}`) // delete api

// Role Master
export const Role_Master_Get_API = (Filters) => post(url.ROLE_FILTER_API, Filters)//get api
export const Role_Master_Post_API = ({ jsonBody }) => post(url.ROLE_MASTER_API, jsonBody)// post api
export const Role_Master_Delete_API = ({ deleteId }) => del(`${url.ROLE_MASTER_API}/${deleteId}`)// delete api
export const Role_Master_Edit_API = ({ editId }) => get(`${url.ROLE_MASTER_API}/${editId}`)// edit api
export const Role_Master_Update_API = ({ jsonBody, updateId }) => put(`${url.ROLE_MASTER_API}/${updateId}`, jsonBody)// update api

// Module Master API 
export const Module_Get_API = () => get(url.H_MODULES_API_URL,)//module-list get API method
export const Module_Post_API = ({ jsonBody }) => post(url.H_MODULES_API_URL, jsonBody)
export const Module_Edit_API = ({ editId }) => get(`${url.H_MODULES_API_URL}/${editId}`)// Edit_Modules- by_ID
export const Module_Update_API = ({ jsonBody, updateId }) => put(`${url.H_MODULES_API_URL}/${updateId}`, jsonBody)// Update_Modules- by_ID
export const Module_Delete_API = ({ deleteId }) => del(`${url.H_MODULES_API_URL}/${deleteId}`)// Delete_Modules_By-ID

//Fetch Company LIst
export const fetch_CompanyList = (data) => post(url.COMPANY_FILTER, data)
export const edit_CompanyID = ({ editId }) => get(`${url.COMPANY_API_URL}/${editId}`)// Edit_Company- by_ID
export const delete_CompanyID = ({ deleteId }) => del(`${url.COMPANY_API_URL}/${deleteId}`)// Delete_Company_By-ID
export const postSubmit_Company = ({ jsonBody }) => post(url.COMPANY_API_URL, jsonBody)// Company_Modules submit 
export const updateCompany_ID = ({ jsonBody, updateId }) => put(`${url.COMPANY_API_URL}/${updateId}`, jsonBody)// Update_Company- by_ID
export const getCompanyGroup = () => get(url.GET_COMPANYGROUP)// CompanyGroup DropDown API

//PageList And PageMaster
export const showPagesListOnPageType_DropDown_List = () => get(url.SHOW_PAGESLIST_ON_PAGE_TYPE_FOR_DROPDOWN)
export const showPagesListOnPageAccess_DropDown_List = (id) => get(url.SHOW_PAGESLIST_ON_PAGEACCESS_FOR_DROPDOWN)
export const get_PageType_HPages = () => get(url.GET_PAGETYPE)
export const ControlTypes_DropDown_Api = () => get(url.GET_CONTROLTYPES_DROPDOWN_API)

//H_pages
export const PageMaster_Get_API = () => get(url.H_PAGES_API_URL)//get H_Pages List 
export const PageMaster_Edit_API = ({ editId }) => get(`${url.H_PAGES_API_URL}/${editId}`)// get edit H_Pages ID Data 
export const PageMaster_Delete_API = ({ deleteId }) => del(`${url.H_PAGES_API_URL}/${deleteId}`)
export const PageMaster_Update_API = ({ updateId, jsonBody }) => put(`${url.H_PAGES_API_URL}/${updateId}`, jsonBody) // Upadate H_Page api
export const PageMaster_Post_API = ({ jsonBody }) => post(url.H_PAGES_API_URL, jsonBody)
export const GetFieldValidationOnControlType_DropDown_API = (id) => get(`${url.GET_FIELD_VALIDATIONS_DROPDOWN_API}/${id}`)// GetFieldValidationOnControlType DropDown API

// M_Items
export const Items_Group_Get_API = () => get(url.ITEMS_GROUP_API)//get api
export const Items_Filter_API = (filters) => post(url.Items_FILTER_API, filters) // list api using post method
export const Items_Master_Post_API = ({ jsonBody }) => post(url.Items_MASTER_API, jsonBody)// save api
export const Items_Master_Delete_API = ({ deleteId }) => del(`${url.Items_MASTER_API}/${deleteId}`)// delete api
export const Items_Master_Edit_API = ({ editId }) => get(`${url.Items_MASTER_API}/${editId}`)// edit api
export const Items_Master_Update_API = ({ updateId, jsonBody }) => put(`${url.Items_MASTER_API}/${updateId}`, jsonBody)// update api

export const BaseUnit_Get_DropDown_API = () => get(url.BASEUNIT_DROPDOWN_API)// BaseUnit DropDown api
export const CategoryType_Get_DropDown_API = () => get(url.CATEGORY_TYPES_API)// CategoryType DropDown api
export const ImageType_Get_DropDown_API = () => get(url.IMAGETYPE_DROPDOWN_API)// ImageType DropDown api
export const MRPType_Get_DropDown_API = () => get(url.MRP_TYPE_DROPDOWN_API)// MRP Type DropDown api
export const Division_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const Party_Get_DropDown_API = (id) => get(`${url.DIVISION_DROPDOWN_API}/${id}`)// Division DropDown api
export const Category_By_CategoryTypes_DropDown_API = (id) => get(`${url.CATEGORY_DROPDOWN_API}/${id}`)// GetCategoryByCategoryTypeID DropDown API
export const Group_By_GroupTypes_DropDown_API = (id) => get(`${url.GET_GROUP_BY_GROUPTYPES_ID}/${id}`)// GetGroupByGroupTypeID DropDown API
export const SubGroup_By_Group_DropDown_API = (id) => get(`${url.GET_SUBGROUP_BY_GROUP_ID}/${id}`)// GetSubGroupByGroupID DropDown API
export const Get_Item_Tag = () => get(url.GET_ITEM_TAG)// Get Item Tag Api
export const Get_Brand_Tag = () => get(url.GET_BRAND_TAG)// Get Item Tag Api
export const GeneralMasterSubType_API = (data) => post(url.GENERAL_MASTER_BRAND_NAME, data)// post api

export const ItemImageUpload = ({ formData }) => postForFormData(url.ITEM_IMAGE_UPLOAD, formData)// postapi

export const GetItemImageUpload = ({ ItemId }) => get(`${url.ITEM_IMAGE_UPLOAD}/${ItemId}`)// Get Item Tag Api


// Party Master
export const Party_Master_Get_API = (jsonbody) => post(url.PARTY_MASTER_FILTER_API, jsonbody)//get api
export const Party_Master_Optimize_Get_API = (jsonbody) => post(url.PARTY_MASTER_OPTIMIZE_FILTER_API, jsonbody)//get api

export const Party_Master_Post_API = ({ formData }) => postForFormData(url.PARTY_MASTER_API, formData)// post api

// export const Party_Master_Post_API = ({ jsonBody }) => post(url.PARTY_MASTER_API, jsonBody)// post api

export const Party_Master_Delete_API = ({ deleteId }) => del(`${url.PARTY_MASTER_API}/${deleteId}`)// delete api
export const Party_Master_Edit_API = ({ editId }) => get(`${url.PARTY_MASTER_API}/${editId}`)// edit api
export const Party_Master_Update_API = ({ formData, updateId }) => putForFormData(`${url.PARTY_MASTER_API}/${updateId}`, formData)// update api
export const GetDistrictOnState_For_Dropdown = (id) => get(`${url.GetDistrictOnState}/${id}`)// GetDistrictOnState DropDown API
export const GetAddressTypes_For_Dropdown = () => get(url.ADDRESSTYPES)// get addresstypes
export const GetPartyTypes_For_Dropdown = () => get(url.PARTYTYPES)// get partytypes
export const GetPartyTypeByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_PARTYTYPE_BY_DIVISIONTYPES_ID}/${id}`)// GetDistrictOnState DropDown API
export const GetCompanyByDivisionTypeID_For_Dropdown = (id) => get(`${url.GET_COMPANY_BY_DIVISIONTYPES_ID}/${id}`)// GetCompanyByDivisionTypeID DropDown API
export const Party_Address_Delete_API = ({ deleteId }) => del(`${url.PARTY_ADDRESS_DELETE_API}/${deleteId}`)// delete api
export const RetailerListForApproval = (jsonbody) => post(url.PARTY_LIST_FOR_APPROVAL_API, jsonbody)//get api
export const RetailerListForApproval_ID = ({ transactionId }) => get(`${url.PARTY_LIST_FOR_APPROVAL_API}/${transactionId}`)// GetCompanyByDivisionTypeID DropDown API

//RoleAccess

export const RoleAccessAdd_PageDropdown_Api = (id1, id2) => get(`${url.PAGE_DROPDOWN_FOR_ROLE_ACCESS_ADD_PAGE}/${id1}/${id2}`)//get api Pages
export const RoleAccessAdd_RoleDropdown_Api = (id1, id2) => get(`${url.GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}`) //get api role List 
export const RoleAccessAdd_GO_Button_Api = (id1, id2, id3) => get(`${url.GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}/${id2}/${id3}`) //get api role List 
export const RoleAccessAdd_AddPage_Button_Api = (id1) => get(`${url.ADD_PAGE_BUTTON_HANDLER_FOR_ROLE_ACCESS_PAGE}/${id1}`) //get api role List 
export const RoleAccessAdd_Save_Api = ({ jsonBody }) => post(url.ROLE_ACCESS, jsonBody) //save api RoleAccessAdd 
export const RoleAccessAdd_List_Api = (jsonbody) => post(url.GET_ROLEACCESS_LIST_PAGE_API, jsonbody)// RoleAccess List Page API
export const RoleAccessCopy_Save_Api = ({ jsonBody }) => post(url.POST_COPY_ROLE_ACCESS_API, jsonBody)//save api RoleAccessCopy 
export const RoleAccessAdd_Delete_Api = ({ role, division, company }) => del(`${url.DELETE_ROLE_ACCESS_API}/${role}/${division}/${company}`)//POST COPY RoleAccess API

// Employee Type API
export const Employee_Type_API = ({ jsonBody }) => post(url.EMPLOYEE_TYPE_API, jsonBody)// post api
export const get_EmployeeType_List_Api = (filters) => post(url.EMPLOYEE_TYPE_FILTER_API, filters) // get api
export const detelet_EmployeeType_List_Api = ({ deleteId }) => del(`${url.EMPLOYEE_TYPE_API}/${deleteId}`) // delete api
export const edit_EmployeeType_List_Api = ({ editId }) => get(`${url.EMPLOYEE_TYPE_API}/${editId}`) // edit api
export const update_EmployeeType_List_Api = ({ jsonBody, updateId }) => put(`${url.EMPLOYEE_TYPE_API}/${updateId}`, jsonBody)// update 

// Party Type API
export const Save_Party_Type_API = ({ jsonBody }) => post(url.PARTYTYPES_API, jsonBody)// post api
export const get_PartyType_List_Api = (filters) => post(url.PARTYTYPES_FILTER_API, filters) // get api
export const detelet_PartyType_List_Api = ({ deleteId }) => del(`${url.PARTYTYPES_API}/${deleteId}`) // delete api
export const edit_PartyType_List_Api = ({ jsonBody }) => post(url.PARTYTYPES_FILTER_API, jsonBody) // edit api (post method)
export const update_PartyType_List_Api = ({ updateId, jsonBody }) => put(`${url.PARTYTYPES_API}/${updateId}`, jsonBody)// update 

// Division Types API
export const Post_Division_Type_API = (data) => post(url.DIVISION_TYPES_API, data)// post api
export const get_DivisionType_List_Api = () => get(url.DIVISION_TYPES_API) // get api
export const detelet_DivisionType_List_Api = (id) => del(`${url.DIVISION_TYPES_API}/${id}`) // delete api
export const edit_DivisionType_List_Api = (id) => get(`${url.DIVISION_TYPES_API}/${id}`) // edit api
export const update_DivisionType_List_Api = (data, id) => put(`${url.DIVISION_TYPES_API}/${id}`, data)// update 

// Cateogory Types API
export const Post_Category_Type_Master_API = ({ jsonBody }) => post(url.CATEGORY_TYPES_API, jsonBody)// post api
export const get_CategoryType_List_Api = () => get(url.CATEGORY_TYPES_API) // get api
export const detelet_CategoryType_List_Api = ({ deleteId }) => del(`${url.CATEGORY_TYPES_API}/${deleteId}`) // delete api
export const edit_CategoryType_List_Api = ({ editId }) => get(`${url.CATEGORY_TYPES_API}/${editId}`) // edit api
export const update_CategoryType_List_Api = ({ jsonBody, updateId }) => put(`${url.CATEGORY_TYPES_API}/${updateId}`, jsonBody)// update

//Category API
export const Post_Category_API = ({ jsonBody }) => post(url.CATEGORY_API, jsonBody)// post api
export const get_Category_List_Api = () => get(url.CATEGORY_API) // get api
export const detelet_Category_List_Api = ({ deleteId }) => del(`${url.CATEGORY_API}/${deleteId}`) // delete api
export const edit_Category_List_Api = ({ editId }) => get(`${url.CATEGORY_API}/${editId}`) // edit api
export const update_Category_List_Api = ({ jsonBody, updateId }) => put(`${url.CATEGORY_API}/${updateId}`, jsonBody)// update

//Vehicle API
export const Vehicle_Get_API = (filters) => post(url.VEHICLE_FILTER_API, filters)// get Api Using Post Method
export const Vehicle_Post_API = ({ jsonBody }) => post(url.VEHICLE_API, jsonBody)// post api
export const Vehicle_Edit_API = ({ editId }) => get(`${url.VEHICLE_API}/${editId}`) // edit api
export const Vehicle_Update_API = ({ jsonBody, updateId }) => put(`${url.VEHICLE_API}/${updateId}`, jsonBody)// update API
export const Vehicle_Delete_API = ({ deleteId }) => del(`${url.VEHICLE_API}/${deleteId}`) // delete api
export const VehicleTypes_Get_API_for_Dropdown = (filters) => post(url.VEHICLETYPES_DROPDOWN, filters)// Vehicle Type dropDown API

//CompanyGroup API
export const CompanyGroup_Post_API = ({ jsonBody }) => post(url.COMPANYGROUP_API, jsonBody)// post api
export const CompanyGroup_Get_API = () => get(url.COMPANYGROUP_API)// get Api 
export const CompanyGroup_edit_API = ({ editId }) => get(`${url.COMPANYGROUP_API}/${editId}`) // edit api
export const CompanyGroup_update_API = ({ jsonBody, updateId }) => put(`${url.COMPANYGROUP_API}/${updateId}`, jsonBody)// update
export const CompanyGroup_Delete_API = ({ deleteId }) => del(`${url.COMPANYGROUP_API}/${deleteId}`) // delete api

//Driver api
export const get_DriverList_API = (jsonBody) => post(url.DRIVER_FILTER_API, jsonBody)// get Api 
export const Post_Driver_API = ({ jsonBody }) => post(url.DRIVER_API, jsonBody)// post api
export const edit_DriverType_List_Api = ({ editId }) => get(`${url.DRIVER_API}/${editId}`) // edit api
export const update_DriverType_List_Api = ({ jsonBody, updateId }) => put(`${url.DRIVER_API}/${updateId}`, jsonBody)// update
export const detelet_DriverType_List_Api = ({ deleteId }) => del(`${url.DRIVER_API}/${deleteId}`) // delete api

//PriceList api
export const Save_PriceList_API = ({ jsonBody }) => post(url.PRICE_LIST, jsonBody)// post api
export const get_PriceListByPartyType_API = (partyType) => get(`${url.PRICE_LIST}/${partyType}`)// post api
export const get_PriceListByCompay_API = (compayId) => get(`${url.PRICE_LIST_BY_COMPANY}/${compayId}`)// post api

export const delete_PriceList_API = ({ deleteId }) => del(`${url.PRICE_LIST}/${deleteId}`)// delete api
export const edit_PriceList = ({ editId }) => get(`${url.PRICE_LIST}/${editId}`) // edit api
export const update_PriceList = ({ updateId, jsonBody }) => put(`${url.PRICE_LIST}/${updateId}`, jsonBody)// update

// MRP Master 
export const MRPMaster_Get_API = ({ jsonBody }) => post(url.MRP_MASTER_LIST_FILTER, jsonBody)// getapi
export const MRPMaster_Post_API = ({ jsonBody }) => post(url.MRP_MASTER_LIST, jsonBody)// post api
export const MRPMaster_Delete_API_For_List = ({ deleteId }) => del(`${url.DELETE_API_FOR_MRP_LIST_PAGE}/${deleteId}`)// delete api
export const MRPMaster_goButton_API = (data) => post(url.GO_BUTTON_POST_API_FOR_MRP_MASTER, data)// go button postapi
export const MRPMaster_Delete_API_For_Master = (id) => del(`${url.MRP_MASTER_LIST}/${id}`)// delete api MRP Master Page

export const View_MRP_Details_API = ({ jsonBody }) => post(url.VIEW_MRP_DETAILS_API, jsonBody)// go button postapi





// Margin Master
export const GetMarginList_For_Listpage = ({ jsonBody }) => post(url.MARGIN_MASTER_LIST_FILTER, jsonBody)// get List
export const Post_MarginMaster_API = ({ jsonBody }) => post(url.MARGIN_MASTER_LIST, jsonBody)// post api
export const delete_MarginList_API = ({ deleteId }) => del(`${url.DELETE_API_FOR_LIST_MARGIN_PAGE}/${deleteId}`)// post api
export const GoButton_Post_API_For_MarginMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_MARGIN_MASTER, data)// go button postapi
export const Margin_MasterPage_delete_API = (id) => del(`${url.MARGIN_MASTER_LIST}/${id}`)// delete api Margin Master Page
export const View_Margin_Details_API = ({ jsonBody }) => post(url.VIEW_MARGIN_DETAILS_API, jsonBody)// go button postapi

// GroupTypes API
export const GroupTypes_API = () => get(url.GROUP_TYPE_API)
export const GroupTypes_Post_API = ({ jsonBody }) => post(url.GROUP_TYPE_API, jsonBody)// post api
export const GroupTypes_Delete_API = ({ deleteId }) => del(`${url.GROUP_TYPE_API}/${deleteId}`)// delete api
export const GroupTypes_Edit_API = ({ editId }) => get(`${url.GROUP_TYPE_API}/${editId}`)// edit api
export const GroupTypes_Update_API = ({ jsonBody, updateId }) => put(`${url.GROUP_TYPE_API}/${updateId}`, jsonBody)// update api



export const Voucher_API = ({ jsonBody }) => post(url.VOUCHER_LIST_API, jsonBody)
export const Voucher__Post_API = ({ jsonBody }) => post(url.VOUCHER_API, jsonBody)// post api
export const Voucher__Delete_API = ({ deleteId }) => del(`${url.VOUCHER_API}/${deleteId}`)// delete api
export const Voucher_Edit_API = ({ editId }) => get(`${url.VOUCHER_API}/${editId}`)// edit api
export const Voucher__Update_API = ({ jsonBody, updateId }) => put(`${url.VOUCHER_API}/${updateId}`, jsonBody)// update api
export const Voucher_Validity_Check_API = ({ Voucher_Code }) => get(`${url.VOUCHER_API}/${Voucher_Code}`)// delete api

//SCHEME API



export const get_Scheme_Type_API = () => get(url.SCHEME_TYPE)
export const Scheme_Type_Post_API = ({ jsonBody }) => post(url.SCHEME_TYPE, jsonBody)// post api
export const Scheme_Type__Delete_API = ({ deleteId }) => del(`${url.SCHEME_TYPE}/${deleteId}`)// delete api
export const Scheme_Type_Edit_API = ({ editId }) => get(`${url.SCHEME_TYPE_SINGLE_GET_API}/${editId}`)// edit api
export const Scheme_Type_Update_API = ({ jsonBody, updateId }) => put(`${url.SCHEME_TYPE}/${updateId}`, jsonBody)// update api





// GroupMaster

export const get_Group_List_Api = () => get(url.GROUP_API)// get api
export const save_Group_API = ({ jsonBody }) => post(url.GROUP_API, jsonBody)// post api
export const del_Group_List_API = ({ deleteId }) => del(`${url.GROUP_API}/${deleteId}`)// delete api
export const edit_Group_List_Api = ({ editId }) => get(`${url.GROUP_API}/${editId}`)// edit api
export const update_Group_List_Api = ({ jsonBody, updateId }) => put(`${url.GROUP_API}/${updateId}`, jsonBody)// update api

// TermsAndCondtions API
export const Post_TermsAndCondtions_Master_API = ({ jsonBody }) => post(url.TERMSANDCONDITIONS_API, jsonBody)// post api
export const get_TermsAndCondtionsList_API = () => get(url.TERMSANDCONDITIONS_API)// get api
export const del_TermsAndCondtions_Master_API = ({ deleteId }) => del(`${url.TERMSANDCONDITIONS_API}/${deleteId}`)// delete api
export const edit_TermsAndCondtions_Master_API = ({ editId }) => get(`${url.TERMSANDCONDITIONS_API}/${editId}`)// edit api
export const update_TermsAndCondtions_Master_API = ({ jsonBody, updateId }) => put(`${url.TERMSANDCONDITIONS_API}/${updateId}`, jsonBody)// update api

// GST API
export const Post_GSTMaster_API = (data) => post(url.GST_LIST_API, data)// post api
export const GetGSTList_For_Listpage = ({ jsonBody }) => post(url.GST_LIST_FILTER_API, jsonBody)// get List
export const delete_GSTList_API = ({ deleteId }) => del(`${url.DELETE_API_FOR_LIST_GST_PAGE}/${deleteId}`)// Delete api
export const GoButton_Post_API_For_GSTMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_GST_MASTER, data)// go button postapi
export const GST_MasterPage_delete_API = (id) => del(`${url.GST_LIST_API}/${id}`)// delete api

export const View_GST_Details_API = ({ jsonBody }) => post(url.VIEW_GST_DETAILS_API, jsonBody)// go button postapi



// PartySubParty API
export const PartySubParty_Get_API = () => get(`${url.PARTY_SUB_PARTY_LIST}`)// get list api
export const PartySubParty_Post_API = ({ jsonBody }) => post(url.PARTY_SUB_PARTY, jsonBody)// post api
export const PartySubParty_Delete_API = ({ deleteId }) => del(`${url.PARTY_SUB_PARTY}/${deleteId}`)// delete api
export const PartySubParty_Edit_API = ({ editId }) => get(`${url.PARTY_SUB_PARTY}/${editId}`)// edit api
export const PartySubParty_Update_API = ({ jsonBody, updateId }) => put(`${url.PARTY_SUB_PARTY}/${updateId}`, jsonBody)// update api
export const PartySubParty_Dropdown_Get_API = (id) => get(`${url.PARTY_SUB_PARTY}/${id}`)// PartySubParty dropdown Api

export const ChannelItemGoBtnAdd_API = (jsonBody) => post(url.CHANNEL_ITEM_ADD_GO_BTN, jsonBody) // get api
export const ChannelItem_Save_API = ({ jsonBody }) => post(url.CHANNEL_ITEM_SAVE_URL, jsonBody)// post api
export const ChannelItem_View_API = ({ jsonBody }) => post(url.CHANNEL_ITEM_ADD_VIEW_BTN, jsonBody)// post api


export const PartyItemGoBtnAdd_API = (jsonBody) => post(url.PARTY_ITEM_FILTER, jsonBody) // get api
export const PartyItem_Save_API = ({ jsonBody }) => post(url.PARTYITEM_FOR_MASTER, jsonBody)// post api


//Post api VendorSupplierCustomer 
export const VendorSupplierCustomer = (jsonBody) => post(url.GET_SUPPLIER_VENDOR_CUSTOMER, jsonBody)//Post api
export const SSDD_List_under_Company_API = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)//Post api
export const Retailer_List_under_Company_PartyAPI = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)//Post api
export const Party_Dropdown_Get_API = (id) => get(`${url.MANAGEMENT_PARTIES}/${id}`)// Party dropdown Api
export const SubEmployee_Dropdown_Get_API = (id) => get(`${url.SUBEMPLOYEE}/${id}`)// Party dropdown Api
export const PartyOnClusterSbcluster_Dropdown_Get_API = ({ jsonBody }) => post(url.PARTY_ON_CLUSTER_SUBCLUSTER, jsonBody)// Party dropdown Api




// ImportField_Add
export const ImportField_Add_GoButton_API = ({ jsonBody }) => post(url.IMPORT_FIELD_MAP_FILTER, jsonBody)//get api
export const ImportField_Add_Save_API = ({ jsonBody }) => post(url.IMPORT_FIELD_MAP_SAVE, jsonBody)// post api

// City API
export const Post_City_Master_API = ({ jsonBody }) => post(url.CITY, jsonBody)// post api
export const get_City_List_Api = () => get(url.CITY_LIST_API)// get api

// Discount API
export const Discount_Go_Button_Api = ({ jsonBody }) => post(url.DISCOUNT_MASTER_GO_BUTTON_API, jsonBody)//get api
export const Discount_Save_Api = ({ jsonBody }) => post(url.DISCOUNT_MASTER_SAVE_API, jsonBody)//get api
export const Discount_Delete_Api = ({ deleteId }) => del(`${url.DISCOUNT_MASTER_DELETE_API}/${deleteId}`)// delete api
export const Discount_List_Api = (filterBody) => post(url.DISCOUNT_MASTER_LIST_API, filterBody)//get api
export const Discount_Edit_Api = ({ jsonBody }) => post(url.IMPORT_MASTER_MAP_ITEM, jsonBody)// post api
export const Discount_Update_Api = ({ jsonBody }) => post(url.IMPORT_MASTER_MAP_UNIT, jsonBody)// post api
export const DiscountPartyType_Dropdown_API = ({ PartyID }) => get(`${url.DISCOUNT_PARTY_TYPE_API}/${PartyID}`) // Party Type Drodown API
export const DiscountCustomer_Dropdown_API = ({ PartyID, PartyTypeID, PricelistID }) => get(`${url.DISCOUNT_CUSTOMER_API}/${PartyID}/${PartyTypeID}/${PricelistID}`) // Party Type Drodown API

// ImportMaster_Map API
export const ImportMaster_Map_Customer_GoButton_API = ({ partyId }) => get(`${url.IMPORT_MASTER_MAP_CUSTOMER}/${partyId}`)//get api
export const ImportMaster_Map_Customer_Save_API = ({ jsonBody }) => post(url.IMPORT_MASTER_MAP_CUSTOMER, jsonBody)// post api
export const ImportMaster_Map_Item_GoButton_API = ({ partyId }) => get(`${url.IMPORT_MASTER_MAP_ITEM}/${partyId}`)//get api
export const ImportMaster_Map_Item_Save_API = ({ jsonBody }) => post(url.IMPORT_MASTER_MAP_ITEM, jsonBody)// post api
export const ImportMaster_Map_Unit_GoButton_API = ({ partyId }) => get(`${url.IMPORT_MASTER_MAP_UNIT}/${partyId}`)//get api
export const ImportMaster_Map_Unit_Save_API = ({ jsonBody }) => post(url.IMPORT_MASTER_MAP_UNIT, jsonBody)// post api

export const ExcelUpload_Invoice_Save_API = ({ jsonBody }) => post(url.BULK_INVOICES, jsonBody)// post api
export const CreditNote_ExcelUpload_Save_API = ({ jsonBody }) => post(url.BULK_CREDIT_NOTE_UPLOAD, jsonBody)// post api
export const ExcelUpload_Retailer_Save_API = ({ jsonBody }) => post(url.IMPORT_BULK_RETAIER, jsonBody)// post api

export const ImportFieldAdd_Save_API = ({ jsonBody }) => post(url.IMPORT_FIELD_ADD_SAVE, jsonBody)// post api
export const ImportFieldAdd_Post_API = (jsonBody) => post(url.IMPORT_FIELD_ADD_FILTER, jsonBody)
export const ImportFieldAdd_Delete_API = ({ deleteId }) => del(`${url.IMPORT_FIELD_ADD_SAVE}/${deleteId}`)// delete api
export const ImportFieldAdd_Edit_API = ({ editId }) => get(`${url.IMPORT_FIELD_ADD_SAVE}/${editId}`)// edit api
export const ImportFieldAdd_Update_API = ({ jsonBody, updateId }) => put(`${url.IMPORT_FIELD_ADD_SAVE}/${updateId}`, jsonBody)// update api

export const ImportExcelType_API = () => get(url.IMPORT_EXCEL_TYPE)// update api


//Target Upload API

export const save_TargetUpload_API = ({ jsonBody }) => post(url.TARGET_UPLOAD, jsonBody)// post api
export const Get_Target_Upload = ({ jsonBody }) => post(url.GET_TARGET_UPLOAD, jsonBody)// update api
export const Delete_Target_Upload = ({ jsonBody }) => delwithPostBody(url.DEL_TARGET_UPLOAD, jsonBody)//Bulk delete api
export const view_Target_List_Api = ({ SheetNo, PartyID }) => get(`${url.EDIT_TARGET_UPLOAD}/${SheetNo}/${PartyID}`)// edit api


// SubGroup API
export const get_SubGroup_List_Api = () => get(url.SUBGROUP_API)// get api
export const Post_SubGroupList_API = ({ jsonBody }) => post(url.SUBGROUP_API, jsonBody)// post api
export const del_SubGroup_List_API = ({ deleteId }) => del(`${url.SUBGROUP_API}/${deleteId}`)// delete api
export const edit_SubGroup_List_Api = ({ editId }) => get(`${url.SUBGROUP_API}/${editId}`)// edit api
export const update_SubGroup_List_Api = ({ jsonBody, updateId }) => put(`${url.SUBGROUP_API}/${updateId}`, jsonBody)// update api

// export const get_SubGroup_Group = () => get(url.GROUP_SUBGROUP_API)// get api
export const get_SubGroup_Group = ({ jsonBody }) => post(`${url.GROUP_SUBGROUP_API}`, jsonBody)// edit api



export const Udate_Group_Subgroup = ({ jsonBody }) => post(url.UPDATE_GROUP_SUBGROUP_API, jsonBody)// post api





// General API
export const Post_General_List_Api = (data) => post(url.GENERAL_MASTER_LIST, data)// get api
export const Post_General_API = ({ jsonBody }) => post(url.GENERAL_MASTER_API, jsonBody)// post api
export const delete_General_List_Api = ({ deleteId }) => del(`${url.GENERAL_MASTER_API}/${deleteId}`)// delete api
export const edit_General_List_Api = ({ editId }) => get(`${url.GENERAL_MASTER_API}/${editId}`)// edit api
export const update_General_List_Api = ({ jsonBody, updateId }) => put(`${url.GENERAL_MASTER_API}/${updateId}`, jsonBody)// update api
export const genaraMasterBy_Type_API = (jsonBody) => post(url.GENERAL_MASTER_TYPE_API, jsonBody)// Type DropDown API

//Routes API
export const Routes_Get_API = (filters) => post(url.ROUTES_FILTER, filters)// post api
export const Routes_Post_API = ({ jsonBody }) => post(url.ROUTES_FOR_MASTER, jsonBody) // post api
export const Routes_Edit_API = ({ editId }) => get(`${url.ROUTES_FOR_MASTER}/${editId}`) // edit api
export const Routes_Update_API = ({ jsonBody, updateId }) => put(`${url.ROUTES_FOR_MASTER}/${updateId}`, jsonBody)// update
export const Routes_Delete_API = ({ deleteId }) => del(`${url.ROUTES_FOR_MASTER}/${deleteId}`) // delete api

//salesMan API
export const SalesMan_Get_API = (filters) => post(url.SALESMAN_FOR_LIST, filters) // post api
export const SalesMan_Post_API = ({ jsonBody }) => post(url.SALESMAN_FOR_MASTER, jsonBody)// post api
export const SalesMan_Edit_API = ({ editId }) => get(`${url.SALESMAN_FOR_MASTER}/${editId}`) // edit api
export const SalesMan_Update_API = ({ jsonBody, updateId }) => put(`${url.SALESMAN_FOR_MASTER}/${updateId}`, jsonBody)// update
export const SalesMan_Delete_API = ({ deleteId }) => del(`${url.SALESMAN_FOR_MASTER}/${deleteId}`) // delete api

//Bank Api
export const get_Bank_List_Api = () => get(url.BANK_LIST_FILTER)
export const Post_Bank_Master_API = ({ jsonBody }) => post(url.BANK, jsonBody)// post api
export const edit_Bank_List_Api = ({ editId }) => get(`${url.BANK}/${editId}`) // edit api
export const update_Bank_List_Api = ({ jsonBody, updateId }) => put(`${url.BANK}/${updateId}`, jsonBody)// update
export const detelet_Bank_List_Api = ({ deleteId }) => del(`${url.BANK}/${deleteId}`) // delete api

//Bank Assign Api
export const PartyBankfilter_API = (filters) => post(url.PARTY_BANK_FILTER, filters)
export const Post_Bank_Assign_API = ({ jsonBody }) => post(url.BANK_ASSIGN, jsonBody)// post api
export const edit_Bank_Assign_Api = ({ editId }) => get(`${url.BANK_ASSIGN}/${editId}`) // edit api
export const update_Bank_Assign_Api = ({ jsonBody, updateId }) => put(`${url.BANK_ASSIGN}/${updateId}`, jsonBody)// update

//Credit Limit
export const Post_CreditLimit_Master_API = ({ jsonBody }) => post(url.CREDIT_LIMIT, jsonBody)// post api
export const CreditLimit_GoButton_Post_API = (jsonBody) => post(url.GO_BUTTON_POST_API_FOR_CREDIT_LIMIT, jsonBody)// Go Button post api

// Route Update
export const Route_Update_List_API = (data) => post(url.ROUTE_UPDATE_LIST, data)// Route Update List API For get Party List
export const Post_Route_Update_API = ({ jsonBody }) => post(url.ROUTE_UPDATE, jsonBody)// Route Update Post API

// Loading Sheet
export const Loading_Sheet_Go_Button_API = (data) => post(url.LOADING_SHEET_GO_BUTTON_API, data)//Loading Sheet go button API For Master Page
export const Loading_Sheet_Post_API = ({ jsonBody }) => post(url.LOADING_SHEET, jsonBody)// Loading Sheet Post API For Master Page
export const Loading_Sheet_get_API = (filters) => post(url.LOADING_SHEET_LIST, filters)// Post API For Loading Sheet List
export const Loading_Sheet_Del_API = ({ deleteId }) => del(`${url.LOADING_SHEET}/${deleteId}`)// Loading Sheet Post API For Master Page
export const Loading_Sheet_Update_API = ({ RowId }) => get(`${url.LOADING_SHEET}/${RowId}`)// Loading Sheet Post API For Master Page

// PartyMasterBulkUpdate
export const Post_PartyMasterBulkUpdateAPI = ({ jsonBody }) => post(url.PARTY_MASTER_BULK_UPDATE, jsonBody)// post api
export const PartyMasterBulkUpdate_GoButton_Post_API = (jsonBody) => post(url.GO_BUTTON_POST_API_FOR_PARTY_MASTER_BULK_UPDATE, jsonBody)// Go Button post api
export const post_PartyAPI = (jsonBody) => post(url.RETAILER_SSDD_LIST, jsonBody)// post api
export const GenralMasterSubType = (jsonBody) => post(url.GENERAL_MASTER_SUB_TYPE, jsonBody)// post api
export const Update_Party_Bulk = ({ jsonBody, updateId }) => put(`${url.PARTY_MASTER_BULK_UPDATE}/${updateId}`, jsonBody)// update api

// Order Page api 
export const OrderPage_GoButton_API = ({ jsonBody }) => post(url.ORDER_Edit_API, jsonBody)//get api
export const OrderList_get_Filter_API = ({ filtersBody }) => post(url.ORDER_LiST_BY_FILTERS, filtersBody)
export const OrderPage_Save_API_ForPO = ({ jsonBody }) => post(url.ORDER_PAGE_API, jsonBody)//get api
export const OrderPage_Edit_Post_API = ({ jsonBody }) => post(url.ORDER_Edit_API, jsonBody)//Edit Order
export const OrderPage_Edit_Get_API = ({ orderId }) => get(`${url.ORDER_PAGE_API}/${orderId}`)//Order edit single get api
export const OrderPage_Edit_ForDownload_API = ({ editId }) => get(`${url.ORDER_PAGE_API}/${editId}`)//Edit Order
export const OrderPage_Delete_API = ({ deleteId }) => del(`${url.ORDER_PAGE_API}/${deleteId}`)//Delete Order
export const OrderPage_Update_API = ({ jsonBody, updateId }) => put(`${url.ORDER_PAGE_API}/${updateId}`, jsonBody)// update api
export const getOrderList_For_Listpage = () => get(url.ORDER_PAGE_API)// Get subModule For H_pages
export const orderApproval_Save_API = ({ jsonBody }) => post(url.ORDER_APPROVAL_API, jsonBody)// Order approval

export const InterBranch_Order_Delete_API = ({ deleteId }) => del(`${url.IB_ORDER_GET_API}/${deleteId}`)//Delete Order

export const IB_Order_Get_Api = ({ editId }) => get(`${url.IB_ORDER_GET_API}/${editId}`)//Delete Order



export const IB_Order_Update_API = ({ jsonBody, updateId }) => put(`${url.IB_ORDER_GET_API}/${updateId}`, jsonBody)// update api


export const order_Single_and_Multiple_Print_API = ({ jsonBody }) => post(url.ORDER_PRINT_ALL_API, jsonBody)// Order approval





// OrderType Dropdown API
export const get_OrderType_Api = () => get(url.ORDER_TYPE_API) // get api
export const OrderConfirm_post_API = ({ jsonBody }) => post(url.ORDER_CONFIRM_API, jsonBody)// update api

//GRN PAGE grn 
export const GRN_STP_for_orderList_goBtn = ({ filtersBody }) => post(url.GRN_STP_FOR_ORDER_lIST_goBtn, filtersBody)// Get subModule For H_pages
export const GRN_get_API = ({ filtersBody }) => post(url.GRN_LiST_BY_FILTERS, filtersBody)
export const GRN_Edit_API = ({ editId }) => get(`${url.GRN}/${editId}`)// edit api
export const GRN_Post_API = ({ jsonBody }) => post(url.GRN, jsonBody)//get api
export const GRN_update_API = ({ jsonBody, updateId }) => put(`${url.GRN}/${updateId}`, jsonBody)// update api

export const Accounting_GRN_update_API = ({ jsonBody, updateId }) => put(`${url.ACCOUNTING_GRN_UPDATE}/${updateId}`, jsonBody)// update api




export const GRN_delete_API = ({ deleteId }) => del(`${url.GRN}/${deleteId}`)//Delete Order


// export const AccountingGRN_delete_API = ({ deleteId }) => put(`${url.ACCOUNTING_GRN_DELETE_API}/${deleteId}`)//Delete Order

export const AccountingGRN_delete_API = (jsonBody) => post(url.ACCOUNTING_GRN_DELETE_API, jsonBody)//get api





export const Get_ledger = () => get(url.LEDGER) // get api




export const update_Scheme_List_Api = ({ jsonBody, updateId }) => put(`${url.SCHEME}/${updateId}`, jsonBody)// update api

export const save_Scheme_API = ({ jsonBody }) => post(url.SCHEME, jsonBody)// Loading Sheet Post API For Master Page
export const Get_Scheme_List = () => get(url.SCHEME_LIST) // get api
export const del_Scheme_List_API = ({ deleteId }) => del(`${url.SCHEME}/${deleteId}`)// Loading Sheet Post API For Master Page
export const edit_Scheme_List_Api = ({ editId }) => get(`${url.SCHEME}/${editId}`)// Loading Sheet Post API For Master Page



export const del_Voucher_By_Scheme_API = ({ deleteId }) => del(`${url.VOUCHER_DELETE_API}/${deleteId}`)// Loading Sheet Post API For Master Page
export const Voucher_Upload_API = ({ jsonBody }) => post(url.VOUCHER_UPLOAD, jsonBody)// Loading Sheet Post API For Master Page

export const Scheme_List_Per_Month_API = ({ jsonBody }) => post(url.SCHEME_LIST_PER_MONTH, jsonBody)// Loading Sheet Post API For Master Page

export const GRN_Make_API = ({ jsonBody }) => post(url.GRN_MAKE_API, jsonBody)
// export const Hide_Invoice_For_GRN_API = ({ InvoiceId, IsHide }) => del(`${url.HIDE_INVOICE_FOR_GRN}/${InvoiceId}/${IsHide}`)


export const Hide_Invoice_For_GRN_API = ({ jsonBody }) => post(url.HIDE_INVOICE_FOR_GRN, jsonBody)



export const Invoice_No_Message = ({ jsonBody }) => post(url.INVOICE_NO_MESSAGE, jsonBody)

//Challan API
export const Challan_get_API = (filter) => post(url.CHALLAN_LIST_BY_FILTERS, filter)
export const Challan_delete_API = ({ deleteId }) => del(`${url.CHALLAN_SAVE_GRN_LIST}/${deleteId}`)//Delete challan
export const Challan_Save_API = (data) => post(url.CHALLAN_SAVE_GRN_LIST, data)//Make challan
export const Challan_Make_API = ({ makeBody }) => post(url.CHALLAN_SAVE_GRN_LIST, makeBody)//Make challan
export const Challan_items_API = (data) => post(url.CHALLAN_ITEMS, data)//Make challan
export const Challan_items_Stock_API = (data) => post(url.CHALLAN_ITEMS_STOCK, data)//Make challan
export const get_Demand_Details_Post_API = ({ jsonBody }) => post(url.GET_DEMAND_DETAILS, jsonBody)

export const VDC_Item_Details_API = ({ filter }) => post(url.VDC_ITEM_DETAILS, filter)
export const VDC_Item_API = ({ jsonBody }) => post(url.VDC_ITEMS, jsonBody)// get api




// BOM API
export const BOM_ListPage_API = (filters) => post(url.BOM_LiST, filters)// get list api
export const BOM_Post_API = ({ jsonBody }) => post(url.BOM, jsonBody)// post api
export const BOM_Edit_API = ({ editId }) => get(`${url.BOM}/${editId}`) //Single get api BOMList 
export const BOM_Update_API = ({ jsonBody, updateId }) => put(`${url.BOM}/${updateId}`, jsonBody)// update api
export const BOM_Delete_API = ({ deleteId }) => del(`${url.BOM}/${deleteId}`)// delete api
export const GetItemUnits_For_Dropdown = (data) => post(url.GET_ITEM_UNITS, data)// post api

// Work Order API


export const WorkOrder_GoButton_Post_API = (data) => post(url.GO_BUTTON_POST_API_FOR_WORKORDER, data)// go button postapi
export const Post_WorkOrder_Master_API = ({ jsonBody }) => post(url.POST_WORK_ORDER_API, jsonBody)// post api
export const WorkOrder_Get_API = (filters) => post(url.WORK_ORDER_LIST, filters)// get list api
export const WorkOrder_edit_Api = ({ editId }) => get(`${url.WORK_ORDER_LIST_API}/${editId}`) //Single get api BOMList 
export const WorkOrder_Update_Api = ({ jsonBody, updateId }) => put(`${url.WORK_ORDER_LIST_API}/${updateId}`, jsonBody)// update api
export const WorkOrder_Delete_Api = ({ deleteId }) => del(`${url.WORK_ORDER_LIST_API}/${deleteId}`)// delete api

export const BatchTraceabilityReport_API = ({ jsonBody }) => post(url.BATCH_TRACEABILITY_REPORT_API, jsonBody)// post api
export const Post_Bulk_BOM_For_WorkOrder_API = ({ jsonBody }) => post(url.BULK_BOM_FOR_WORKORDER, jsonBody)// post api


// Material Issue
export const Material_Issue_GoButton_Post_API = ({ jsonBody }) => post(url.GO_BUTTON_POST_API_FOR_MATERIAL_ISSUE, jsonBody)// go button postapi
export const Material_Issue_Post_API = ({ jsonBody }) => post(url.POST_API_FOR_MATERIAL_ISSUE, jsonBody)// postapi
export const Material_Issue_Get_API = (filters) => post(url.POST_API_FOR_MATERIAL_ISSUE_LIST, filters)// get list api
export const Material_Issue_Edit_API = ({ editId }) => get(`${url.POST_API_FOR_MATERIAL_ISSUE}/${editId}`)// delete api
export const Material_Issue_Delete_API = ({ deleteId }) => del(`${url.POST_API_FOR_MATERIAL_ISSUE}/${deleteId}`)// delete api

// Production 
export const Production_Post_API = ({ jsonBody }) => post(url.PRODUCTION_POST_API, jsonBody)// Production save API
export const production_get_API = (filters) => post(url.PRODUCTION_LIST_FILTER, filters)// go button postapi
export const production_Edit_API = ({ editId }) => get(`${url.PRODUCTION_POST_API}/${editId}`)// make production to material Issue postapi
export const production_Make_API = (data) => post(url.PRODUCTION_MAKE_API, data)// make production to material Issue postapi
export const production_UnitDropdown_API = (data) => post(url.PRODUCTION_UNIT_DROPDOWN_API, data)
export const Production_Delete_API = ({ deleteId }) => del(`${url.PRODUCTION_POST_API}/${deleteId}`)// delete api

// Production Re_Issue

export const Production_ReIssue_save_API = (data) => post(url.PRODUCTION_REIISUE_SAVE, data)// go button postapi
export const Production_ReIssue_get_API = (filters) => post(url.PRODUCTION_REIISUE_LIST_FILTER, filters)// go button postapi
export const Production_ReIssue_Edit_API = (id) => get(`${url.PRODUCTION_POST_API}/${id}`)// make production to material Issue postapi
export const Production_ReIssueproduction_Make_API = (data) => post(url.PRODUCTION_MAKE_API, data)// make production to material Issue postapi
export const Production_ReIssue_Delete_API = (id) => del(`${url.PRODUCTION_REIISUE_SAVE}/${id}`)// delete api
export const Production_ReIssueItemDropdown_API = (data) => post(url.PRODUCTION_REIISUE_ITEM, data)// delete api
export const Production_ReIssue_AddPageGOBtn_API = (data) => post(url.PRODUCTION_REIISUE_ITEM, data)// delete api

// Invoice
export const Invoice_1_GoButton_API = ({ jsonBody }) => post(url.INVOICE_1_ADD_PAGE_GO_BTN, jsonBody)// go button postapi
export const Invoice_1_Save_API = ({ jsonBody }) => post(url.INVOICE_1_SAVE, jsonBody)// postapi
export const Invoice_1_Get_Filter_API = ({ filtersBody }) => post(url.INVOICE_1_lIST_FILTER, filtersBody)// postapi
export const Invoice_1_Delete_API = ({ deleteId }) => del(`${url.INVOICE_1_SAVE}/${deleteId}`)// delete api

export const Invoice_1_Edit_API = ({ editId }) => get(`${url.INVOICE_1_Edit}/${editId}`)// delete api
export const Invoice_1_Update_API = ({ updateId, jsonBody }) => put(`${url.INVOICE_1_Edit}/${updateId}`, jsonBody)// delete api

export const Invoice_Singel_Get_for_Report_Api = ({ editId }) => get(`${url.INVOICE_1_SAVE}/${editId}/P`)// delete api

export const Update_Vehicle_Invoice_API = ({ Invoiceid, vehicleid }) => get(`${url.UPDATE_VEHICLE_INVOICE}/${Invoiceid}/${vehicleid}`)// Cancel_EwayBill
export const Invoice_Send_To_Scm = ({ jsonBody }) => post(url.INVOICE_SEND_TO_SCM, jsonBody)

export const Invoice_Send_To_SAP = ({ jsonBody }) => post(url.INVOICE_SEND_TO_SAP, jsonBody)

export const Invoice_1_Bulk_Delete_API = ({ jsonBody }) => delwithPostBody(url.INVOICE_1_BULK_DELETE_API, jsonBody)//Bulk delete api


export const Update_Vehicle_Customer_Invoice_API = ({ jsonBody }) => post(url.UPDATE_VEHICLE_CUSTOMER_INVOICE, jsonBody)// Cancel_EwayBill


export const Get_Invoice_Batch_Details = ({ jsonBody }) => post(url.INVOICE_BATCH_DETAILS, jsonBody)// Cancel_EwayBill




export const IB_Invoice_Singel_Get_for_Report_Api = ({ editId }) => get(`${url.IB_INVOICE_SINGEL_GET}/${editId}`)// delete api

/// Franchies Invoice
export const Franchies_Invoice_Singel_Get_for_Report_Api = ({ editId }) => get(`${url.POS_INVOICE_PRINT}/${editId}/P`)// delete api
export const Franchies_Invoice_Delete_API = ({ deleteId }) => del(`${url.FRANCHAISE_INVOICE_DELETE_API}/${deleteId}`)// delete api
export const Franchies_Invoice_Edit_API = ({ editId }) => get(`${url.SWEET_POS_INVOICE_Edit}/${editId}`)// delete api

//**************************** E-Invoice (upload ,cancel,print) ***************************************/

export const EInvoice_Uploade_Get_API = ({ RowId, UserID, Invoice_Identifier_ID }) => get(`${url.UPLOADED_E_INVOICE}/${RowId}/${UserID}/${Invoice_Identifier_ID}`)// Uploade_EInvoice
export const EInvoice_Cancel_Get_API = ({ RowId, UserID, Invoice_Identifier_ID }) => get(`${url.CANCEL_E_INVOICE}/${RowId}/${UserID}/${Invoice_Identifier_ID}`)// Cancel_EInvoice

//**************************** E-WayBill (upload ,cancel,print) actions ***************************************/

export const EwayBill_Uploade_Get_API = ({ RowId, UserID, Invoice_Identifier_ID }) => get(`${url.UPLOADED_E_WAY_BILL}/${RowId}/${UserID}/${Invoice_Identifier_ID}`)// Uploade_EwayBill
export const EwayBill_Cancel_Get_API = ({ RowId, UserID, Invoice_Identifier_ID }) => get(`${url.CANCEL_E_WAY_BILL}/${RowId}/${UserID}/${Invoice_Identifier_ID}`)// Cancel_EwayBill

//IB Invoice 2 
export const IB_Invoice_GoButton_API = ({ jsonBody }) => post(url.IB_INVOICE_ADD_PAGE_GO_BTN, jsonBody)// go button postapi
export const IB_Invoice_Save_API = ({ jsonBody }) => post(url.IB_INVOICE_SAVE, jsonBody)// postapi
export const IB_Invoice_Get_Filter_API = ({ filtersBody }) => post(url.IB_INVOICE_lIST_FILTER, filtersBody)// postapi
export const IB_Invoice_Delete_API = ({ deleteId }) => del(`${url.IB_INVOICE_SAVE}/${deleteId}`)// delete api
export const IB_Invoice_Edit_API_Singel_Get = ({ editId }) => get(`${url.IB_INVOICE_SAVE}/${editId}`)// delete api

//************************************Inter Branch ************************************/

// IBOrder
export const IBOrderPage_GoButton_API = ({ jsonBody }) => post(url.GO_BUTTON_POST_API_FOR_IBORDER, jsonBody)//go button api
export const IBOrderPage_Save_API = ({ jsonBody }) => post(url.SAVE_API_FOR_IBORDER, jsonBody)//post api
export const IBOrderList_get_Filter_API = ({ filtersBody }) => post(url.IBORDER_LiST_BY_FILTERS, filtersBody)//list page

export const IB_Division_DROP_API = (data) => post(url.IB_DIVISION_DROPDOWN, data)//dropdown api
export const IBOrderPage_Edit_API = (data) => post(url.GO_BUTTON_POST_API_FOR_IBORDER, data)//edit
export const IBOrderPage_Delete_API = (id) => del(`${url.SAVE_API_FOR_IBORDER}/${id}`)//delete
export const IBOrderPage_Update_API = (data, id) => put(`${url.SAVE_API_FOR_IBORDER}/${id}`, data)//update

// Inward
export const Inward_Post_API = (data) => post(url.POST_API_FOR_INWARD, data)// Inward post api
export const Inward_List_API = (filters) => post(url.INWARD_LIST_API, filters)// List Api
export const Inward_Delete_API = (id) => del(`${url.POST_API_FOR_INWARD}/${id}`)// delete api
export const Make_Inward_Post_API = ({ makeInwardId }) => get(`${url.MAKE_INWARD_BUTTON_API}/${makeInwardId}`)// Inward post api

//Report API
export const MultipleInvoice_API = ({ editId }) => get(`${url.MULTIPLEINVOICE_API}/${editId}`)//dropdown api
export const LoadingSheet_API = ({ editId }) => get(`${url.LOADINGSHEET_PARTY_WISE_INVOICE}/${editId}`)//dropdown api


// Management Parties API
export const Management_Parties_Post_API = ({ jsonBody }) => post(url.MANAGEMENT_PARTIES, jsonBody)// postapi
export const Go_Button_Post_API = (jsonBody) => post(url.GO_BUTTON_API_MANAGEMENT_PARTIES, jsonBody)// postapi
export const Employee_drodown_Post_API = (jsonBody) => post(url.EMPLOYEE_DROPDOWN_API, jsonBody)// postapi

//*********************************Accounting Module ************************************ */
// Receipt and Payment Entry
export const Receipt_Print = ({ editId }) => get(`${url.RECEIPT_POST_API}/${editId}`)//dropdown api
export const Receipt_Go_Button_API = ({ jsonBody }) => post(url.RECEIPT_GO_BUTTON_API, jsonBody)// postapi
export const Opening_balance_API = (jsonBody) => post(url.OPENING_BALANCE, jsonBody)// postapi
export const Depositor_Bank_Filter_API = (jsonBody) => post(url.DEPOSITOR_BANK_FILTER, jsonBody)// postapi
export const Receipt_Post_API = ({ jsonBody }) => post(url.RECEIPT_POST_API, jsonBody)// postapi
export const Receipt_Filter_API = (jsonBody) => post(url.RECEIPT_FILTERS, jsonBody)// Get subModule For H_pages
export const Receipt_Delete_API = ({ deleteId }) => del(`${url.RECEIPT_POST_API}/${deleteId}`)// delete api
export const Bank_List_API = (jsonBody) => post(url.BANK_LIST_API, jsonBody)// postapi
export const Make_Receipt_to_Payment_API = (jsonBody) => post(url.MAKE_RECEIPT_TO_PAYMENT, jsonBody)// Get subModule For H_pages

// Sales Return
export const Invoice_No_list_API = (jsonBody) => post(url.INVOICE_NUMBER_LIST, jsonBody)//Invoice No. dropdown api postapi
export const SalesReturn_add_button_api_For_Item = (jsonBody) => post(url.ADD_BUTTON_API_FOR_ITEM, jsonBody)//add button get api for item
export const SalesReturn_add_button_api_For_Invoice = (InvoiceID) => get(`${url.ADD_BUTTON_API_FOR_INVOICE}/${InvoiceID}`)//add button get api for invoice
export const SalesReturn_post_API = ({ formData }) => postForFormData(url.SALES_RETURN, formData)// postapi
export const SalesReturn_list_API = (filters) => post(url.SALES_RETURN_LIST_API, filters)//Sales Return list api using post method
export const SalesReturn_Delete_API = ({ deleteId }) => del(`${url.SALES_RETURN}/${deleteId}`)// Sales Return Delete API
export const SalesReturn_SingleGet_API = ({ editId }) => get(`${url.SALES_RETURN_ITEM}/${editId}`)// Sales Return Delete API
export const Send_To_Superstockiest_button_post_API = ({ jsonBody }) => post(url.SEND_TO_SUPERSTOCKIEST_POST_API, jsonBody)// update api
export const Return_Approve_API = ({ jsonBody }) => post(url.RETURN_ITEM_APPROVE_AIP, jsonBody)// update api
export const ReturnPrint_API = ({ editId }) => get(`${url.PURCHASE_RETURN_PRINT}/${editId}`)//dropdown api
export const SalesReturn_add_button_api_For_CreditNote1 = (jsonBody) => post(url.ADD_BUTTON_API_FOR_ITEM_CREDIT_NOTE_1, jsonBody)//add button get api for item

export const Upload_Return_Api = ({ formData, updateId }) => putForFormData(`${url.RETURN_UPLOAD}/${updateId}`, formData)// update




// Credit and Debit 
export const Go_Button_Credit_Debit_Post_API = (jsonBody) => post(url.CREDIT_DEBIT_FILTER, jsonBody)// postapi
export const Credit_Debit_Save_API = ({ jsonBody }) => post(url.CREDIT_DEBIT, jsonBody)//post api
export const del_Credit_List_API = ({ deleteId }) => del(`${url.CREDIT_DEBIT}/${deleteId}`)// delete api
export const BulkCreditNote_delete_API = ({ jsonBody }) => delwithPostBody(url.BULK_CREDIT_NOTE_DELETE, jsonBody)
export const Edit_Credit_List_API = ({ editId }) => get(`${url.CREDIT_DEBIT}/${editId}`)// Edit api
export const InvoiceReturn_API = (id) => get(`${url.INVOICE_RETURN}/${id}`)// Invoice Return api
export const Receipt_Number_API = (jsonBody) => post(url.RECEIPT_NUMBER_LIST, jsonBody)// postapi

export const PartyLedger_API = (FromDate, ToDate, SAPCode) => post(url.PARTY_LEDGER_API, FromDate, ToDate, SAPCode)// postapi
export const Get_Product_Margin_Report = ({ jsonBody }) => post(url.PRODUCT_MARGIN_REPORT_API, jsonBody)

//**************************** E-Invoice Credit Debit Note (upload ,cancel,print) ***************************************/

export const EInvoice_Credit_Debit_Uploade_Get_API = ({ RowId, UserID }) => get(`${url.UPLOADED_CREDIT_DEBIT_E_INVOICE}/${RowId}/${UserID}`)// Uploade_EInvoice
export const EInvoice_Credit_Debit_Cancel_Get_API = ({ RowId, UserID }) => get(`${url.CANCEL_CREDIT_DEBIT_E_INVOICE}/${RowId}/${UserID}`)// Cancel_EInvoice

// Order Summary
export const OderSummary_GoBtn_API = ({ jsonBody }) => post(url.ORDER_SUMMARY, jsonBody)//post api
export const PartySettingApi = (Party_id, Comapny_id) => get(`${url.PARTY_SETTING}/${Party_id}/${Comapny_id}`)// Party Setting api
export const save_PartySetting_API = ({ formData }) => postForFormData(url.PARTY_SETTING, formData)// postapi
export const PartyLedgerReport_API = ({ jsonBody }) => post(url.PARTY_LEDGER, jsonBody)// postapi
export const ClaimSummary_API = ({ jsonBody }) => post(url.CLAIM_SUMMARY, jsonBody)// postapi
export const MasterClaimSummary_API = ({ jsonBody }) => post(url.MASTER_CLAIM_SUMMARY, jsonBody)// postapi
export const MasterClaimCreate_API = ({ jsonBody }) => post(url.MASTER_CLAIM_CREATE, jsonBody)// postapi
export const ClaimList_API = ({ jsonBody }) => post(url.CLAIM_LIST, jsonBody)// postapi
export const ItemRegister_API = ({ jsonBody }) => post(url.ITEM_REGISTER, jsonBody)// postapi
export const delete_Claim_API = ({ jsonBody }) => delwithPostBody(url.MASTER_CLAIM_CREATE, jsonBody)// postapi
export const Dashboard_Get_API = ({ loginPartyID }) => get(`${url.DASHBOARD}/${loginPartyID}`)// Dashboard grt api

//StockEntry
export const StockEntry_GO_button_api_For_Item = (ItemId) => get(`${url.STOCK_ENTRY_GO_BUTTON}/${ItemId}`)//add button get api for item
export const StockEntry_Post_API = ({ jsonBody }) => post(url.PARTY_STOCK_ENTRY, jsonBody)//post api
export const Franchise_StockEntry_Post_API = ({ jsonBody }) => post(url.FRANCHISE_STOCK_ENTRY, jsonBody)//post api

export const BatchAdjustment_API = ({ jsonBody }) => post(url.BATCH_DETAILS_ADJUSTMENT, jsonBody)//post api



export const StockCount_Post_API = ({ jsonBody }) => post(url.STOCK_COUNT, jsonBody)//post api

export const CheckStockEntryForFirstTransaction = ({ jsonBody }) => post(url.STOCK_ENTERY_FOR_FIRST_YEAR_TRANSACTION, jsonBody)//post api
export const CheckStockEntryforBackDatedTransaction = ({ jsonBody }) => post(url.STOCK_ENTERY_FOR_BACKDATED_TRANSACTION, jsonBody)//post api


export const Item_DropDown_Api = ({ jsonBody }) => post(url.ITEM_DROPDOWN_API, jsonBody)//post api

export const StockEntryList_API = ({ jsonBody }) => post(url.STOCK_ENTRY_LIST_API, jsonBody)//post api

export const StockEntryItemList_API = ({ jsonBody }) => post(url.STOCK_ENTRY_ITEM_LIST_API, jsonBody)//post api


//Stock Report
export const StockReport_GoBtn_API = (jsonBody) => post(url.STOCK_REPORT, jsonBody)//Go button api

export const Pos_StockReport_GoBtn_API = ({ jsonBody }) => post(url.POS_STOCK_REPORT, jsonBody)//Go button api



export const StockProcessing_API = ({ jsonBody }) => post(url.STOCK_PROCESSING, jsonBody)//Go button api

export const Pos_StockProcessing_API = ({ jsonBody }) => post(url.POS_STOCK_PROCESSING, jsonBody)//Go button api

export const GRNpending_Api = () => get(url.GRN_PENDING_REPORT) // get api

export const ManagerSummary_API = ({ jsonBody }) => post(url.MANAGER_SUMMARY_REPORT, jsonBody)//Go button api






export const StockReport_1_GoBtn_API = ({ jsonBody }) => post(url.STOCK_REPORT_1, jsonBody)//Go button api
// Damage Stock Report 
export const DamageStockReport_GoBtn_API = ({ jsonBody, btnId }) => post(url.DAMAGE_STOCK_REPORT_GO_BUTTON, jsonBody)//Go button api

//Generic Sale Report
export const GenericSale_GoBtn_API = ({ jsonBody }) => post(url.GENERIC_SALE_REPORT, jsonBody)//Go button api

//Retailer data Report
export const RetailerData_GoBtn_API = ({ jsonBody }) => post(url.RETAILER_DATA_REPORT, jsonBody)//Go button api
export const InvoiceDataExport_GoBtn_API = ({ jsonBody }) => post(url.INVOICE_DATA_EXPORT, jsonBody)//Go button api
export const PurchaseGSTReportSaga_GoBtn_API = ({ jsonBody }) => post(url.PURCHASE_GST_REPORT, jsonBody)//Go button api


export const ItemConsumption_API = ({ jsonBody }) => post(url.ITEM_CONSUMPTION_REPORT, jsonBody)//Go button api





export const Gst_R1_Report_API = ({ jsonBody }) => post(url.GST_R1_REPORT, jsonBody)//Go button api
export const Gst_R3B_Report_API = ({ jsonBody }) => post(url.GST_R3B_REPORT, jsonBody)//Go button api



export const DeleteInvoiceDataExport_GoBtn_API = ({ jsonBody }) => post(url.DELETE_INVOICE_DATA_EXPORT, jsonBody)//Go button api
export const ReturnReport_API = ({ jsonBody }) => post(url.RETURN_REPORT, jsonBody)//Go button api


// Item Sale Report Go button API
export const ItemSaleReport_GoBtn_API = ({ jsonBody }) => post(url.ITEM_SALE_REPORT_GO_BUTTON, jsonBody)//Go button api
export const SupplierDropdownApi = (employeeID, channelFromID) => get(`${url.SUPPLIER_API}/${employeeID}/${channelFromID}`)// Party Setting api
export const ItemsList_On_Group_And_Subgroup_API = (jsonBody) => post(url.ITEM_LIST_API, jsonBody)

//StockAdjustment
export const getBatchCode_By_ItemID_api = ({ itemId, partyId }) => get(`${url.GET_BATCH_CODE_BY_ITEM_ID}/${itemId}/${partyId}`)//add button get api for item
export const getBatchCode_By_ItemID_SweetPOSapi = ({ itemId, partyId }) => get(`${url.GET_BATCH_CODE_BY_ITEM_ID_SWEET_POS}/${itemId}/${partyId}`)//add button get api for item


//TransactionLog
export const TransactionLog_transactionType_Api = () => get(url.TRANSACTION_LOG_TRANCTION_TYPE);
export const TransactionLog_Get_User_Api = () => get(url.TRANSACTION_LOG_All_USER);
export const TransactionLog_Go_Btn_Api = ({ jsonBody }) => post(url.TRANSACTION_LOG_GO_BTN, jsonBody);
export const TransactionLog_getjson_for_Transation_Id = ({ TransctionID }) => get(`${url.TRANSACTION_JSON}/${TransctionID}`) // edit api

export const TransactionLog_Get_OnDashBoard_Api = () => get(url.TRANSACTION_ON_DASHBOARD);

// POS Log
export const POSLog_Go_Btn_Api = ({ jsonBody }) => post(url.POS_LOG_GO_BTN, jsonBody);

export const POSExEVersion_Api = ({ jsonBody }) => post(url.POS_VERSION, jsonBody);

export const VoucherRedemption_Aip = ({ jsonBody }) => post(url.VOUCHER_REDEMPTION_CLAIM, jsonBody);





// Claim Tracking Entry
export const ClaimListfortracking = (jsonBody) => post(url.CLAIM_LIST_FOR_TRACKING, jsonBody)// post api
export const ClaimList_Post_API = ({ formData }) => postForFormData(url.CLAIM_TRACKING, formData)// post api
export const ClaimList_Get_Api = (jsonBody) => post(url.CLAIM_TRACKING_LIST, jsonBody) // get api
export const edit_ClaimTrackingEntry_List_Api = ({ editId }) => get(`${url.CLAIM_TRACKING}/${editId}`) // edit api
export const update_ClaimTrackingEntry_List_Api = ({ formData, updateId }) => putForFormData(`${url.CLAIM_TRACKING}/${updateId}`, formData)// update
export const detelet_ClaimTrackingEntry_List_Api = ({ deleteId }) => del(`${url.CLAIM_TRACKING}/${deleteId}`) // delete api
export const PriceList_Dropdown_API = () => get(url.PRICE_LIST)// get priceList

//CreditDebitDataExport
export const CreditDebitDataExport_GoBtn_API = ({ jsonBody }) => post(url.CREDIT_DEBIT_DATA_EXPORT, jsonBody)//Go button api

//mobail Api
export const mobileApp_ProductAdd_Api = (transactionId) => post(`${url.MOBILE_APP_PRODUCT_ADD}/${transactionId}`)
export const mobileApp_ProductDelete_Api = (transactionId) => del(`${url.MOBILE_APP_PRODUCT_DELETE}/${transactionId}`)
export const mobileApp_ProductUpdate_Api = ({ jsonBody }) => put(`${url.MOBILE_APP_PRODUCT_UPDATE}`, jsonBody)


export const mobileApp_Send_Retailer_Api = ({ jsonBody }) => post(url.MOBILE_APP_RETAILER_ADD, jsonBody)
export const mobileApp_RetailerDelete_Api = (transactionId) => del(`${url.MOBILE_APP_RETAILER_DELETE}/${transactionId}`)
export const mobileApp_RetailerUpdate_Api = ({ jsonBody }) => put(`${url.MOBILE_APP_RETAILER_UPDATE}`, jsonBody)


//ReceiptDataExport
export const ReceiptDataExport_GoBtn_API = ({ jsonBody }) => post(url.RECEIPT_DEBIT_DATA_EXPORT, jsonBody)//Go button api

//OutStandingBalance
export const OutStandingBalance_GoBtn_API = ({ jsonBody, btnId }) => post(url.OUTSTANDING_BALANCE_REPORT_GO_BUTTON, jsonBody)//Go button api

// ManPower Report
export const ManPower_Get_Api = ({ EmployeeID }) => get(`${url.MAN_POWER_GET_API}/${EmployeeID}`) // edit api

//Cluster API
export const Cluster_Post_API = ({ jsonBody }) => post(url.CLUSTER, jsonBody)// post api
export const Cluster_get_API = () => get(url.CLUSTER) // get api
export const Cluster_delete_API = ({ deleteId }) => del(`${url.CLUSTER}/${deleteId}`) // delete api
export const Cluster_edit_API = ({ editId }) => get(`${url.CLUSTER}/${editId}`) // edit api
export const Cluster_update_API = ({ jsonBody, updateId }) => put(`${url.CLUSTER}/${updateId}`, jsonBody)// update


//Sub Cluster API
export const Sub_Cluster_Post_API = ({ jsonBody }) => post(url.SUB_CLUSTER, jsonBody)// post api
export const Sub_Cluster_get_API = () => get(url.SUB_CLUSTER) // get api
export const Sub_Cluster_delete_API = ({ deleteId }) => del(`${url.SUB_CLUSTER}/${deleteId}`) // delete api
export const Sub_Cluster_edit_API = ({ editId }) => get(`${url.SUB_CLUSTER}/${editId}`) // edit api
export const Sub_Cluster_update_API = ({ jsonBody, updateId }) => put(`${url.SUB_CLUSTER}/${updateId}`, jsonBody)// update

export const Get_Subcluster_On_cluster_API = (clusterID) => get(`${url.GET_SUB_CLUSTER_ON_CLUSTER}/${clusterID}`)

// CentralServiceItem 
export const CentralServiceItem_Post = ({ jsonBody }) => post(url.CENTRAL_SERVICE_ITEM, jsonBody)// post api
export const CentralServiceItem_Get = () => get(url.CENTRAL_SERVICE_ITEM) // get api
export const CentralServiceItem_Delete = ({ deleteId }) => del(`${url.CENTRAL_SERVICE_ITEM}/${deleteId}`) // delete api 
export const CentralServiceItem_Edit = ({ editId }) => get(`${url.CENTRAL_SERVICE_ITEM}/${editId}`) // delete api 
export const CentralServiceItem_Update = ({ jsonBody, updateId }) => put(`${url.CENTRAL_SERVICE_ITEM}/${updateId}`, jsonBody) // delete api 

// Service Item Assign
export const ServiceItemAssign_Save_API = ({ jsonBody }) => post(url.SERVICE_ITEM_ASSIGN_SAVE, jsonBody)// post api
export const ServiceItemAssign_GoButton_API = ({ jsonBody }) => post(url.SERVICE_ITEM_ASSIGN_GO_BUTTON, jsonBody) // get api

// Party Details
// export const Get_PartyDetails_List = ({ employeeID, groupID }) => get(`${url.GET_PARTY_DETAILS_LIST}/${employeeID}/${groupID}`)
export const Get_PartyDetails_List = ({ jsonBody }) => post(url.GET_PARTY_DETAILS_LIST, jsonBody)// post api



export const post_PartyDetails = ({ jsonBody }) => post(url.POST_PARTY_DETAILS, jsonBody)// post api

//ItemWiseUpdate
export const ItemWiseUpdate_GoButton_API = (jsonBody) => post(url.ITEM_WISE_UPDATE_API, jsonBody)// GO BUTTON API
export const ItemWiseUpdate_Post_API = ({ jsonBody }) => post(url.ITEM_WISE_UPDATE_POST_API, jsonBody)// POST API
export const ItemSupplier_Post_API = ({ jsonBody }) => post(url.ITEM_SUPPLIER_LIST_GET_API, jsonBody)// POST API
export const ItemSupplierList_Get_API = () => get(url.ITEM_SUPPLIER_LIST_GET_API)

// TCS Amount Report
export const TCS_Amount_Report_GoButton_API = (jsonBody) => post(url.TCS_AMOUNT_REPORT_GO_BUTTON_API, jsonBody)

// Cx-DD Diffrence Report
export const Cx_DD_Diffrence_Report_GoButton_API = (jsonBody) => post(url.CX_DD_DIFFRENCE_REPORT, jsonBody)
export const Cx_DD_Diffrence_Report_Party_Dropdown_API = () => get(url.CX_DD_DIFFRENCE_PARTY_API) // get api

//CssItemSaleReport



export const Css_Item_Sale_Report_GoButton_API = ({ jsonBody }) => post(url.CSS_ITEM_SALE_REPORT_GO_BUTTON, jsonBody)//Go button api



//Setting api

export const save_SystemSetting_API = ({ jsonBody }) => post(url.SYSTEM_SETTING_API, jsonBody)// post api

export const Frenchies_Item_sale_Report_API = ({ jsonBody }) => post(url.FRENCHIESE_ITEM_SALE_REPORT, jsonBody)// post api


export const save_PosServiceSetting_API = ({ jsonBody }) => post(url.POS_SERVICE_SETTING, jsonBody)// post api
export const del_PosServiceSetting_List_API = ({ deleteId }) => del(`${url.POS_SERVICE_SETTING}/${deleteId}`)// delete api
export const edit_PosServiceSetting_List_Api = ({ editId }) => get(`${url.POS_SERVICE_SETTING}/${editId}`)// edit api
export const update_PosServiceSetting_List_Api = ({ jsonBody, updateId }) => put(`${url.POS_SERVICE_SETTING}/${updateId}`, jsonBody)// update api
export const get_PosServiceSetting_List_Api = () => get(url.POS_SERVICE_SETTING); // remove jsonBody



//phone Pay setting
export const save_PhonePaySetting_API = ({ jsonBody }) => post(url.PHONE_PAY_SETTING, jsonBody)// post api
export const del_PhonePaySetting_List_API = ({ deleteId }) => del(`${url.PHONE_PAY_SETTING}/${deleteId}`)// delete api
export const edit_PhonePaySetting_List_Api = ({ editId }) => get(`${url.PHONE_PAY_SETTING}/${editId}`)// edit api
export const update_PhonePaySetting_List_Api = ({ jsonBody, updateId }) => put(`${url.PHONE_PAY_SETTING}/${updateId}`, jsonBody)// update api
export const get_PhonePaySetting_List_Api = ({ jsonBody }) => get(url.PHONE_PAY_SETTING, jsonBody)// get api



export const del_SystemSetting_List_API = ({ deleteId }) => del(`${url.SYSTEM_SETTING}/${deleteId}`)// delete api
export const edit_SystemSetting_List_Api = ({ editId }) => get(`${url.SYSTEM_SETTING}/${editId}`)// edit api
export const update_SystemSetting_List_Api = ({ jsonBody, updateId }) => put(`${url.SYSTEM_SETTING}/${updateId}`, jsonBody)// update api

//Sweet POS Role Access

export const get_POSRoleAccess_List_Api = () => get(url.SWEET_POS_API) // get api
export const Post_POSRoleAccess_API = ({ jsonBody }) => post(url.SWEET_POS_API, jsonBody)// post api

export const Pos_Invoice_Singel_Get_for_Report_Api = ({ editId }) => get(`${url.POS_INVOICE_PRINT}/${editId}/P`)// delete api

//Sweet POS Rate master
export const POS_RateList_Get_Api = ({ jsonBody }) => post(url.SWEET_POS_RATE_LIST_API, jsonBody) // get api
export const POS_RateMaster_Post_Api = ({ jsonBody }) => post(url.SWEET_POS_RATE_SAVE_API, jsonBody)// post api

///POS USER REGESTRATION
// export const POS_USER_Master_Get_API = () => get(url.POS_USER_REGESTRATION)//get api
export const POS_USER_Master_Get_API = ({ division_Id }) => get(`${url.GET_POS_USER_REGESTRATION}/${division_Id}`)// edit api

export const POS_USER_Master_Post_API = ({ jsonBody }) => post(url.POS_USER_REGESTRATION, jsonBody)// post api
export const POS_USER_Master_Delete_API = ({ deleteId }) => del(`${url.SINGLE_GET_POS_USER_REGESTRATION}/${deleteId}`)// delete api
export const POS_USER_Master_Edit_API = ({ editId }) => get(`${url.SINGLE_GET_POS_USER_REGESTRATION}/${editId}`)// edit api
export const POS_USER_Master_Update_API = ({ jsonBody, updateId }) => put(`${url.SINGLE_GET_POS_USER_REGESTRATION}/${updateId}`, jsonBody)// update api
export const POS_USER_Get_Roles = () => get(`${url.POS_USER_RLOE}`)// edit api


export const CashierSummary_API = ({ jsonBody }) => post(url.CASHIER_SUMMARY_REPORT, jsonBody)// post api

export const BillDelete_API = ({ jsonBody }) => post(url.BILL_DELETE_SUMMARY_REPORT, jsonBody) // post api
// TargetVSAchievement 
export const Target_Vs_Achievement_Gobtn_API = ({ jsonBody }) => post(url.TARGET_VS_ACHIEVEMENT_API, jsonBody)// post api
export const Target_Vs_AchievementGroupWise_Gobtn_API = ({ jsonBody }) => post(url.TARGET_VS_ACHIEVEMENT_GROUP_API, jsonBody)// post api


export const PartyEmployeeDetails = ({ EmployeeId }) => get(`${url.GET_PARTY_EMPLOYEE_DETAILS}/${EmployeeId}`)// edit api

//Log Api

export const Notification_Log = ({ jsonBody }) => post(url.NOTIFICATION_LOG, jsonBody)// post api


// Rate Master API
export const GoButton_Post_API_For_RateMaster = (data) => post(url.GO_BUTTON_POST_API_FOR_RATE_MASTER, data)// go button postapi
export const Rate_MasterPage_delete_API = (id) => del(`${url.DELETE_API_FOR_RATE_MASTER_PAGE}/${id}`)// delete api
export const RateMaster_Post_API = (data) => post(url.RATES, data)// post api
export const GetRateList_For_Listpage = () => get(url.RATES)// get List
export const delete_RateList_API = ({ deleteId }) => del(`${url.DELETE_API_FOR_RATE_LIST_PAGE}/${deleteId}`)// Delete api

// Order Item Supplier Report
export const OrderItemSupplier_GoButton_API = ({ jsonBody }) => post(url.ORDER_ITEM_SUPPLIER_REPORT, jsonBody)// post api

// SweetPos Machine Type
export const S_Pos_MachineType_List_Api = (jsonBody) => post(url.S_POS_MACHINE_TYPE_LIST_API, jsonBody) // get api
export const S_Pos_MachineType_Save_API = ({ jsonBody }) => put(url.S_POS_MACHINE_TYPE_SAVE_API, jsonBody)// post api

export const StockOutReport_API = ({ jsonBody }) => post(url.SWEET_POS_STOCK_OUT_REPORT, jsonBody)//Go button api

//Country api



export const Country_Post_API = ({ jsonBody }) => post(url.COUNTRY_SAVE_API, jsonBody)// post api
export const Country_get_API = () => get(url.COUNTRY_GET_API) // get api
export const Country_delete_API = ({ deleteId }) => del(`${url.COUNTRY_UPDATE_DELETE_API}/${deleteId}`) // delete api
export const Country_edit_API = ({ editId }) => get(`${url.COUNTRY_UPDATE_DELETE_API}/${editId}`) // edit api
export const Country_update_API = ({ jsonBody, updateId }) => put(`${url.COUNTRY_UPDATE_DELETE_API}/${updateId}`, jsonBody)// update


//Franchise Sale With Bill Count Report 
export const Franchise_Sale_With_Bill_Count_API = ({ jsonBody }) => post(url.FRANCHAISE_SALE_WITH_BILL_COUNT_API, jsonBody)//Go button api


export const Bill_booking_Report_Api = ({ jsonBody }) => post(url.BILL_BOOKING_REPORT_API, jsonBody)//Go button api

export const DemandVsSupplyReport_API = ({ jsonBody }) => post(url.DEMAND_VS_SUPPLY_API, jsonBody)//Go button api


export const CashierName_Api = ({ jsonBody }) => post(url.CHASHIER_API, jsonBody)//Go button api

export const GRNDiscrepancyReport_API = ({ jsonBody }) => post(url.GRN_DISCREPANCY_REPORT, jsonBody)//Go button api

export const CodeRedemptionReport_API = ({ jsonBody }) => post(url.CODE_REDEMPTION_REPORT, jsonBody)//Go button api

export const DataExportToSAP_API = ({ jsonBody }) => post(url.DATA_EXPORT_TO_SAP, jsonBody)//Go button api

export const DataExportToSAP_Get_API = () => get(url.GET_DATA_EXPORT_TO_SAP)//Go button api

export const Periodic_Grn_Report_Api = ({ jsonBody }) => post(url.PERIODIC_GRN_REPORT, jsonBody)//Go button api

export const Stock_Adjustment_Report_GoButton_API = ({ jsonBody }) => post(url.STOCK_ADJUSTMENT_REPORT, jsonBody)//Go button api


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
