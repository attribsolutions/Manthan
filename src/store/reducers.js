import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Administrator
import SpinnerReducer from './Utilites/Spinner/reducer'
import AlertReducer from './Utilites/CustomAlertRedux/reducer'
import CustomSearchReducer from './Utilites/CustomSearchRedux/reducer'
import BreadcrumbReducer from './Utilites/Breadcrumb/reducer'

import Modules from './Administrator/ModulesRedux/reducer'
import Company from './Administrator/CompanyRedux/reducer'
import SubModules from "./Administrator/SubModulesRedux/reducer"
import PageList from "./Administrator/PageMasterRedux/reducer"
import H_Pages from './Administrator/HPagesRedux/reducer'
import OrderPageReducer from "./Purchase/OrderPageRedux/reducer"

import User_Registration_Reducer from "./Administrator/UserRegistrationRedux/reducer"
import M_EmployeesReducer from "./Administrator/M_EmployeeRedux/reducer"
import RoleMaster_Reducer from "./Administrator/RoleMasterRedux/reducer"
import ItemMastersReducer from "./Administrator/ItemsRedux/reducer"
import PartyMasterReducer from "./Administrator/PartyRedux/reducer"
import RoleAccessReducer from "./Administrator/RoleAccessRedux/reducer"
import EmployeeTypeReducer from "./Administrator/EmployeeTypeRedux/reducer"
import PartyTypeReducer    from "./Administrator/PartyTypeRedux/reducer"
import DivisionTypeReducer from "./Administrator/DivisionTypeRedux/reducer"
import categoryTypeMasterReducer from "./Administrator/CategoryTypeRedux/reducer"
import CategoryMasterReducer from "./Administrator/CategoryRedux/reducer"
import SubCategoryReducer from "./Administrator/SubCategoryRedux/reducer"
import VehicleReducer from "./Administrator/VehicleRedux/reducer"
import DriverReducer from "./Administrator/DriverRedux/reducer"
import CompanyGroupReducer from "./Administrator/CompanyGroupRedux/reducer"

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  SpinnerReducer,
  AlertReducer,
  CustomSearchReducer,
  BreadcrumbReducer,
  // Administator
  Modules,
  Company,
  SubModules,
  H_Pages,
  PageList,
  User_Registration_Reducer,
  M_EmployeesReducer,
  // Purchase
  OrderPageReducer,
  // Master
  RoleMaster_Reducer,
  ItemMastersReducer,
  PartyMasterReducer,
  RoleAccessReducer,
  EmployeeTypeReducer,
  PartyTypeReducer,
  DivisionTypeReducer,
  categoryTypeMasterReducer,
   CategoryMasterReducer,
   SubCategoryReducer,
   VehicleReducer,
   DriverReducer,
   CompanyGroupReducer,

})

export default rootReducer
