import { combineReducers } from "redux"
import DashboardReducer from "./Dashboard/Dashboard_1_Redux/reducer"
// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
import SpinnerReducer from './Utilites/Spinner/reducer'
import ChangePasswordReducer from "./auth/changepassword/reducer"


//  *********************** Administrator ***********************
// import AlertReducer from './Utilites/CustomAlertRedux/reducer'
// import CommonError from './Utilites/CommonError/reducer'

import BreadcrumbReducer from './Utilites/Breadcrumb/reducer'
import CommonPageFieldReducer from './Utilites/PageFiled/reducer'
import PdfReportReducers from './Utilites/PdfReport/reducer'

import Modules from './Administrator/ModulesRedux/reducer'
import Company from './Administrator/CompanyRedux/reducer'
import H_Pages from './Administrator/PageMasterRedux/reducer'

import CommonAPI_Reducer from "./CommonAPI/SupplierRedux/reducer"
import User_Registration_Reducer from "./Administrator/UserRegistrationRedux/reducer"
import EmployeesReducer from "./Administrator/EmployeeRedux/reducer"
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
import SalesManReducer from "./Administrator/SalesManRedux/reducer"
import CreditLimitReducer from "./Administrator/CreditLimitRedux/reducer"
import PartyMasterBulkUpdateReducer from "./Administrator/PartyMasterBulkUpdateRedux/reducer"
import ManagementPartiesReducer from "./Administrator/ManagementPartiesRedux/reducer"
import BankReducer from "./Accounting/BankRedux/reducer"
import BankAssignReducer from "./Accounting/BankAssignRedux/reducer"
import ImportExportFieldMap_Reducer from "./Administrator/ImportExportFieldMapRedux/reducer"
import ImportFieldAdd_Reducer from "./Administrator/ImportFieldAddRedux/reducer"
import ImportExcelPartyMap_Reducer from "./Administrator/ImportExcelPartyMapRedux/reducer"
import CityReducer from "./Administrator/CityRedux/reducer"
import PartySettingReducer from "./Administrator/PartySetting/reducer"
import DiscountReducer from "./Administrator/DiscountRedux/reducer"

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
import StockEntryReducer from "./Inventory/StockEntryRedux/reducer"

//  *********************** Sale ***********************
import InvoiceReducer from "./Sales/Invoice/reducer"
import LoadingSheetReducer from "./Sales/LoadingSheetRedux/reducer"
import SalesReturnReducer from "./Sales/SalesReturnRedux/reducer"

//  *********************** InterBranch ***********************
import InwardReducer from "./Inter Branch/InwardRedux/reducer"
import RouteUpdateReducer from "./Administrator/RouteUpdateRedux/reducer"
import CredietDebitReducer from "./Accounting/CreditRedux/reducer"
import SapLedgerReducer from "./Report/SapLedger Redux/reducer"

//***************************Accounting ************************** */
import ReceiptReducer from "./Accounting/Receipt/reducer"

//***************************Reports ************************** */
import OrderSummaryReducer from "./Report/OrderSummaryRedux/reducer"
import StockReportReducer from "./Report/StockReport/reducer"

import RetailerDataReducer from "./Report/RetailerDataRedux/reducer"

import  GenericSaleReportReducer from "./Report/GenericSaleRedux/reducer"


const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  SpinnerReducer,
  // AlertReducer,
  // CommonError,
  BreadcrumbReducer,
  CommonPageFieldReducer,
  PdfReportReducers,
  ImportExportFieldMap_Reducer,
  ImportFieldAdd_Reducer,
  ImportExcelPartyMap_Reducer,
  Modules,
  Company,
  H_Pages,
  User_Registration_Reducer,
  CommonAPI_Reducer,
  EmployeesReducer,
  OrderReducer,
  GRNReducer,
  RoleMaster_Reducer,
  ItemMastersReducer,
  PartyMasterReducer,
  RoleAccessReducer,
  EmployeeTypeReducer,
  PartyTypeReducer,
  categoryTypeReducer,
  CategoryReducer,
  VehicleReducer,
  GroupReducer,
  SubGroupReducer,
  GeneralReducer,
  PartySubPartyReducer,
  DriverReducer,
  CompanyGroupReducer,
  PriceListReducer,
  MRPMasterReducer,
  MarginMasterReducer,
  TermsAndConditionsReducer,
  RoutesReducer,
  DiscountReducer,
  CreditLimitReducer,
  PartyMasterBulkUpdateReducer,
  SalesManReducer,
  GroupTypeReducer,
  GSTReducer,
  PartyItemsReducer,
  BOMReducer,
  WorkOrderReducer,
  MaterialIssueReducer,
  ProductionReducer,
  BankReducer,
  BankAssignReducer,
  ProductionReIssueReducer,
  InvoiceReducer,
  InwardReducer,
  ChallanReducer,
  RouteUpdateReducer,
  LoadingSheetReducer,
  ManagementPartiesReducer,
  ReceiptReducer,
  SalesReturnReducer,
  CredietDebitReducer,
  DashboardReducer,
  ChangePasswordReducer,
  SapLedgerReducer,
  CityReducer,
  OrderSummaryReducer,
  PartySettingReducer,
  StockEntryReducer,
  StockReportReducer,
  RetailerDataReducer,
  GenericSaleReportReducer,

})
export default rootReducer
