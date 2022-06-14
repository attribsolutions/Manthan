import axios from "axios"
import { del, get, put, post, } from "./api_helper"
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

const Python_postJwtLogin = data => post(url.POST_JWT_LOGIN, data)

// postForgetPwd
const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)
   
export const RoleAccessApi_url=()=>get(url.ROLE_ACCESS)
/// Employees  Component All Apis 
export const getDesignationID_For_Dropdown = () => get(url.GET_DESIGNATIONID)
export const getEmployeeType_For_Dropdown = () => get(url.GET_EMPLOYEE_TYPE)
export const getState_For_Dropdown = () => get(url.GET_STATE)
export const getRegion_For_Dropdown = () => get(url.GET_REGION)
export const getComapny_For_Dropdown = () => get(url.COMPANY_API_URL)
export const post_EmployeeData = (data) => post(url.EMPLOYEE_API_URL, data) //save And Update
export const get_EmployeelistApi = () => get(url.EMPLOYEE_API_URL) // get api
export const detelet_EmployeeID = (id) => del(`${url.EMPLOYEE_API_URL}/${id}`) // delete api
export const edit_EmployeeAPI = (id) => get(`${url.EMPLOYEE_API_URL}/${id}`) // edit api
export const update_EmployeeAPI = (data, id) => put(`${url.EMPLOYEE_API_URL}/${id}`, data)// update 

//User Registration  All APIs 
export const getEmployee_Dropdown_For_UserRegistration_API = () => get(url.EMPLOYEE_API_URL)//get api for Dropdown_list data 
export const RolesListDropdown_For_UserRegistration_API = () => get(url.ROLE_API_URL)
export const User_Component_PostMethod_API = (data) => post(url.REGISTRATION_API_URL, data)//post for (save and update) User_Component
export const User_Component_GetMethod_API = () => get(url.USER_API_URL) //Get User_Component
export const User_Component_Delete_Method_API = (id) => del(`${url.USER_API_URL}/${id}`) // delete api
export const User_Component_EditById_API = (id) => get(`${url.USER_API_URL}/${id}`) // edit api
export const User_Component_Update_API = (data, id) => put(`${url.USER_API_URL}/${id}`, data) // update api

// Role Master
export const Role_Master_Get_API=()=> get(url.ROLE_MASTER_API)//get api
export const Role_Master_Post_API = (data) => post(url.ROLE_MASTER_API,data )// post api
export const Role_Master_Delete_API=(id)=> del(`${url.ROLE_MASTER_API}/${id}` )// delete api
export const Role_Master_Edit_API=(id)=> get(`${url.ROLE_MASTER_API}/${id}` )// edit api
export const Role_Master_Update_API = (data,id) => put(`${url.ROLE_MASTER_API}/${id}`,data )// update api

//Purchase  Order Page api  
// export const getOrderItems_forOrderPage_ApiCall = () => get(url.GET_ORDER_ITEM)//get api
export const submitOrder_From_OrderPage_apiCall = (data) => post(url.ORDER_PAGE_API, data)// post api
export const editOrderID_forOrderPage_ApiCall = (id) => get(`${url.ORDER_PAGE_API}/${id}`)//Edit Order
export const UpdateOrder_ID_ApiCall = (data,id) => put(`${url.ORDER_PAGE_API}/${id}`, data)// update api
export const getOrderList_forOrderPage_ApiCall = (data) => get(url.ORDER_PAGE_API)
export const getDivisionOrders = () => get(`${url.ORDER_PAGE_API}?FromDate=2022-01-25&ToDate=2022-01-25&CustomerID=0&DivisionID=3`)

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
export const getDefaultModule = () => get(url.GET_DEFAULT_MODULE)
export const postDefaultMogeuleId = (id) => get(url.POST_MODULE_ID, id)
export const postSubModule = (id) => get(`${url.H_SUB_MODULES_API_URL}/${id}`)
export const postAddPage = (data) => post(url.H_SUB_MODULES_API_URL, data)
export const getPageAcess = () => get(url.GET_PAGE_ACCESS)
export const showPagesListOnPageType_DropDown_List = () => get(url.showPagesListOnPageType_DropDown)
export const showPagesListOnPageAccess_DropDown_List = () => get(url.showPagesListOnPageAccess_DropDown)

// H_subModule Api
export const saveH_SubModules = (data) => post(url.H_SUB_MODULES_API_URL, data)
export const get_SubModulesListData_ApiCall = () => get(url.H_SUB_MODULES_API_URL)
export const deleteSubModulesUsingID_ApiCall = (id) => del(`${url.H_SUB_MODULES_API_URL}/${id}`)// delete api
export const getSubModulesEditDataUsingID_ApiCall = (id) => get(`${url.H_SUB_MODULES_API_URL}/${id}`)// edit api
export const putUpdateSubModule = (Data, id) => put(`${url.H_SUB_MODULES_API_URL}/${id}`, Data)/// update api

//H_pages
export const get_Module_HPages = (id) => get(`${url.H_MODULES_API_URL}/${id}`)// Get subModule For H_pages
export const Fetch_HPagesListApi = () => get(url.H_PAGES_API_URL)//get H_Pages List 
export const edit_HPageID = (id) => get(`${url.H_PAGES_API_URL}/${id}`)// get edit H_Pages ID Data 
export const updateHPages = (Data, id) => put(`${url.H_PAGES_API_URL}/${id}`, Data) // Upadate H_Page api
export const saveHPagesAPI = (Data) => post(url.H_PAGES_API_URL, Data)
export const deletHPagesUsingID_API = (id) => del(`${url.H_PAGES_API_URL}/${id}`)

// M_Items
export const Items_Master_Get_API=()=> get(url.Items_MASTER_API)//get api
export const Items_Master_Post_API = (data) => post(url.Items_MASTER_API,data )// post api
export const Items_Master_Delete_API=(id)=> del(`${url.Items_MASTER_API}/${id}` )// delete api
export const Items_Master_Edit_API=(id)=> get(`${url.Items_MASTER_API}/${id}` )// edit api
export const Items_Master_Update_API = (data,id) => put(`${url.Items_MASTER_API}/${id}`,data )// update api

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  Python_postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
}
