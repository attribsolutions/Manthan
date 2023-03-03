import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
import SpinnerReducer from './Utilites/Spinner/reducer'

//  *********************** Administrator ***********************
import AlertReducer from './Utilites/CustomAlertRedux/reducer'
import CommonError from './Utilites/CommonError/reducer'
import CustomSearchReducer from './Utilites/CustomSearchRedux/reducer'
import BreadcrumbReducer from './Utilites/Breadcrumb/reducer'
import CommonPageFieldReducer from './Utilites/PageFiled/reducer'
import PdfReportReducers from './Utilites/PdfReport/reducer'

import Modules from './Administrator/ModulesRedux/reducer'
import Company from './Administrator/CompanyRedux/reducer'
import H_Pages from './Administrator/HPagesRedux/reducer'

import SupplierReducer from "./CommonAPI/SupplierRedux/reducer"
import User_Registration_Reducer from "./Administrator/UserRegistrationRedux/reducer"
import M_EmployeesReducer from "./Administrator/M_EmployeeRedux/reducer"
import RoleMaster_Reducer from "./Administrator/RoleMasterRedux/reducer"
import ItemMastersReducer from "./Administrator/ItemsRedux/reducer"
import PartyMasterReducer from "./Administrator/PartyRedux/reducer"
import RoleAccessReducer from "./Administrator/RoleAccessRedux/reducer"
import EmployeeTypeReducer from "./Administrator/EmployeeTypeRedux/reducer"
import PartyTypeReducer from "./Administrator/PartyTypeRedux/reducer"
import categoryTypeReducer from "./Administrator/CategoryTypeRedux/reducer"
import CategoryReducer from "./Administrator/CategoryRedux/reducer"
import VehicleReducer from "./Administrator/VehicleRedux/reducer"
import DriverReducer from "./Administrator/DriverRedux/reducer"
import CompanyGroupReducer from "./Administrator/CompanyGroupRedux/reducer"
import PriceListReducer from "./Administrator/PriceList/reducer"
import MRPMasterReducer from "./Administrator/MRPMasterRedux/reducer"
import MarginMasterReducer from "./Administrator/MarginMasterRedux/reducer"
import TermsAndConditionsReducer from "./Administrator/TermsAndConditionsRedux/reducer"
import GroupTypeReducer from "./Administrator/GroupTypeRedux/reducer"
import GroupReducer from "./Administrator/GroupRedux/reducer"
import SubGroupReducer from "./Administrator/SubGroupsRedux/reducer"
import GeneralReducer from "./Administrator/GeneralRedux/reducer"
import GSTReducer from "./Administrator/GSTRedux/reducer"
import PartySubPartyReducer from "./Administrator/PartySubPartyRedux/reducer"
import PartyItemsReducer from "./Administrator/PartyItemsRedux/reducer"
import RoutesReducer from "./Administrator/RoutesRedux/reducer"
//  *********************** Purchase ***********************
import OrderReducer from "./Purchase/OrderPageRedux/reducer"

//  *********************** Production ***********************
import BOMReducer from "./Production/BOMRedux/reducer"
import WorkOrderReducer from "./Production/WorkOrder/reducer"
import MaterialIssueReducer from "./Production/Matrial_Issue/reducer"
import ProductionReducer from "./Production/ProductionRedux/reducer"
import ProductionReIssueReducer from "./Production/ProductionReissueRedux/reducer"

//  *********************** Inventory ***********************
import GRNReducer from "./Inventory/GRNRedux/reducer"
import ChallanReducer from "./Inventory/ChallanRedux/reducer"

//  *********************** Sale ***********************
import InvoiceReducer from "./Sales/Invoice/reducer"

//  *********************** InterBranch ***********************
import InwardReducer from "./Inter Branch/InwardRedux/reducer"


const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  SpinnerReducer,
  AlertReducer,
  CommonError,
  CustomSearchReducer,
  BreadcrumbReducer,
  CommonPageFieldReducer,
  PdfReportReducers,
  // Administator
  Modules,
  Company,
  // SubModules,
  H_Pages,
  // PageList,
  User_Registration_Reducer,
  // suppiler
  SupplierReducer,
  M_EmployeesReducer,
  // order
  OrderReducer,
  GRNReducer,
  // Master
  RoleMaster_Reducer,
  ItemMastersReducer,
  PartyMasterReducer,
  RoleAccessReducer,
  EmployeeTypeReducer,
  PartyTypeReducer,
  categoryTypeReducer,
  CategoryReducer,
  VehicleReducer,
  DriverReducer,
  CompanyGroupReducer,
  PriceListReducer,
  MRPMasterReducer,
  MarginMasterReducer,
  TermsAndConditionsReducer,
  GroupTypeReducer,
  GroupReducer,
  SubGroupReducer,
  GeneralReducer,
  GSTReducer,
  PartySubPartyReducer,
  VehicleReducer,
  DriverReducer,
  CompanyGroupReducer,
  PriceListReducer,
  MRPMasterReducer,
  MarginMasterReducer,
  TermsAndConditionsReducer,
  RoutesReducer,
  GroupTypeReducer,
  GSTReducer,
  PartyItemsReducer,
  BOMReducer,
  WorkOrderReducer,
  MaterialIssueReducer,
  ProductionReducer,
  ProductionReIssueReducer,
  // IBOrderReducer,
  InvoiceReducer,
  InwardReducer,
  // IBInvoiceReducer,
  ChallanReducer
})
export default rootReducer
