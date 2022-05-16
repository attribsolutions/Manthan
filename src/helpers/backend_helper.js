import axios from "axios"
import { del, get, put,  post,  } from "./api_helper"
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

// USER REGISTRATION

export const getEmployee = () => get(url.GET_EMPLOYEE)

export const getRoles = () => get(url.GET_ROLE)
// export const getModule = () => get(url.GET_MODULE)
// Login Method
const postJwtLogin = data => post(url.POST_JWT_LOGIN, data)

// postForgetPwd
const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

//order Page
export const getOrderPage = () => get(url.GET_ORDER)
export const submitOrderPage = (data) => post(url.SUBMIT_ORDER_PAGE, data)
//Edit Order
export const editOrderID = (id) => get(url.EDIT_ORDER_ID)
//Order List
export const getOrderList = (data) => get(`${url.GET_ORDER_LIST}?FromDate=${data['FromDate']}&ToDate=${data['ToDate']}&CustomerID=${data['CustomerID']}&DivisionID=${data['DivisionID']}`)
export const getDivisionOrders = () => get(`${url.GET_ORDER_LIST}?FromDate=2022-01-25&ToDate=2022-01-25&CustomerID=0&DivisionID=3`)


//Administrator   Modules submit  
export const postSubmitModules = (data) => post(url.SUBMIT_H_MODULES, data)
//module-list get API method
export const Fetch_ModulesList =() => get(url.FETCH_MODULES_LIST, )
// Delete_Modules_By-ID
export const delete_ModuleID =(id) => del(`${url.FETCH_MODULES_LIST}/${id}` )
// Edit_Modules- by_ID
export const edit_ModuleID =(id) => get(`${url.FETCH_MODULES_LIST}/${id}` )
// Update_Modules- by_ID
export const updateModule_ID =(data,id) => put(`${url.FETCH_MODULES_LIST}/${id}`,data )

//Administrator Company
//Fetch Company LIst
export const fetch_CompanyList =() => get(url.COMPANY_lIST, )
// Edit_Company- by_ID
export const edit_CompanyID =(id) => get(`${url.COMPANY_lIST}/${id}` )
// Delete_Company_By-ID
export const delete_CompanyID =(id) => del(`${url.COMPANY_lIST}/${id}` )
// Company_Modules submit  
export const postSubmit_Company = (data) => post(url.COMPANY_lIST, data)
// Update_Company- by_ID
export const updateCompany_ID =(data,id) => put(`${url.COMPANY_lIST}/${id}`,data )
  
//PageList And PageMaster
export const getDefaultModule = () => get(url.GET_DEFAULT_MODULE)
export const postDefaultMogeuleId=(id)=> get(url.POST_MODULE_ID,id)

export const postSubModule=(id)=> get(`${url.POST_SUB_MODULE}/${id}`)
export const postAddPage = (data) => post(url.POST_ADD_PAGE,data )

export const getPageAcess=()=> get(url.GET_PAGE_ACCESS)


//// H_subModule Api
export const saveH_SubModules = (data) => post(url.H_SUB_MODULES,data )
export const get_SubModulesListData_ApiCall = () => get(url.H_SUB_MODULES)

export const deleteSubModulesUsingID_ApiCall=(id)=> del(`${url.H_SUB_MODULES}/${id}` )/////// delete api
export const getSubModulesEditDataUsingID_ApiCall=(id)=> get(`${url.H_SUB_MODULES}/${id}` )/////// edit api
export const putUpdateSubModule = (Data,id) => put(`${url.H_SUB_MODULES}/${id}`,Data )///// update api

//H_pages
export const get_H_SubModule_HPages=(id)=> get(`${url.H_SUB_MODULES_FROM_HPAGES}/${id}` )/////// Get subModule For H_pages
export const Fetch_HPagesListApi=()=> get(url.HPAGES_LIST )/////// get H_Pages List 
export const edit_HPageID=(id)=> get(`${url.HPAGES_LIST}/${id}` )///////  get edit H_Pages ID Data 
export const updateHPages=(Data,id)=>put(`${url.HPAGES_LIST}/${id}`,Data ) /////// Upadate H_Page api
export const saveHPagesAPI=(Data)=> post(url.HPAGES_LIST, Data)
export const deletHPagesUsingID_API=(id)=>del(`${url.HPAGES_LIST}/${id}` )

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
}
