import { combineReducers } from "redux"
import DashboardReducer from "./Dashboard/Dashboard_1_Redux/reducer"
// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
import ChangePasswordReducer from "./auth/changepassword/reducer"


// *********************** Administrator ***********************


import BreadcrumbReducer from './Utilites/Breadcrumb/reducer'
import CommonPageFieldReducer from './Utilites/PageFiled/reducer'
import PdfReportReducers from './Utilites/PdfReport/reducer'
import CommonPartyDropdownReducer from './Utilites/PartyDrodown/reducer'

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
import PartyEmployeeDetailsReducer from "./Administrator/PartyEmployeeDetailsRedux/reducer"

// *********************** Purchase ***********************
import OrderReducer from "./Purchase/OrderPageRedux/reducer"

// *********************** Production ***********************
import BOMReducer from "./Production/BOMRedux/reducer"
import WorkOrderReducer from "./Production/WorkOrder/reducer"
import MaterialIssueReducer from "./Production/Matrial_Issue/reducer"
import ProductionReducer from "./Production/ProductionRedux/reducer"
import ProductionReIssueReducer from "./Production/ProductionReissueRedux/reducer"

// *********************** Inventory ***********************
import GRNReducer from "./Inventory/GRNRedux/reducer"
import ChallanReducer from "./Inventory/ChallanRedux/reducer"
import StockEntryReducer from "./Inventory/StockEntryRedux/reducer"

// *********************** Sale ***********************
import InvoiceReducer from "./Sales/Invoice/reducer"
import LoadingSheetReducer from "./Sales/LoadingSheetRedux/reducer"
import SalesReturnReducer from "./Sales/SalesReturnRedux/reducer"
import BulkInvoiceReducer from "./Sales/bulkInvoice/reducer";

// *********************** InterBranch ***********************
import InwardReducer from "./Inter Branch/InwardRedux/reducer"
import RouteUpdateReducer from "./Administrator/RouteUpdateRedux/reducer"
import CredietDebitReducer from "./Accounting/CreditRedux/reducer"
import SapLedgerReducer from "./Report/SapLedger Redux/reducer"

//***************************Accounting ************************** */
import ReceiptReducer from "./Accounting/Receipt/reducer"

//***************************Reports ************************** */
import OrderSummaryReducer from "./Report/OrderSummaryRedux/reducer"
import ClaimSummaryReducer from "./Report/ClaimSummary/reducer"

import StockReportReducer from "./Report/StockReport/reducer"

import RetailerDataReducer from "./Report/RetailerDataRedux/reducer"

import GenericSaleReportReducer from "./Report/GenericSaleRedux/reducer"
import InvoiceDataExportReducer from "./Report/InvoiceDataExportRedux/reducer"
import PurchaseGSTReportReducer from "./Report/PurchaseGSTRedux/reducer"
import DamageStockReportReducer from "./Report/DamageStockReportRedux/reducer"
import GSTR1ReportReducer from "./Report/GSTR1ReportRedux/reducer"
import ReturnReportReducer from "./Report/ReturnReportRedux/reducer"
import ItemSaleReportReducer from "./Report/ItemSaleReport/reducer"
import StockAdjustmentReducer from "./Inventory/StockAdjustmentRedux/reducer"
import ClaimTrackingEntry_Reducer from "./Accounting/ClaimTrackingEntryRedux/reducer"
import CreditDebitDataExportReducer from "./Report/CreditDebitDataExportRedux/reducer"
import ManPowerReportReducer from "./Report/ManPowerRedux/reducer"
import PartyOutStanding_Reducer from "./Report/PartyOutstandingRedux/reducer"
import ClusterReducer from "./Administrator/ClusterRedux/reducer"
import SubClusterReducer from "./Administrator/SubClusterRedux/reducer"
import CentralServiceItemReducer from "./Administrator/CentralServiceItemRedux/reducer"
import ServiceItemAssignReducer from "./Administrator/ServiceItemAssignRedux/reducer"
import PartyDetailsReducer from "./Administrator/PartyDetailsRedux/reducer"
import ItemWiseUpdateReducer from "./Administrator/ItemWiseUpdateRedux/reducer"
import TCSAmountReportReducer from "./Report/TCS_AmountRedux/reducer"
import Cx_DD_Diffrence_Reducer from "./Report/CX_DD_Diffrence_Report/reducer"
import SystemSettingReducer from "./Utilites/SystemSettingRedux/reducer"
import PosRoleAccessReducer from "./SweetPOSStore/Administrator/POSRoleAccessRedux/reducer"
import TargetUploadReducer from "./Administrator/TargetUploadRedux/reducer"
import TargetVsAchievementReducer from "./Report/TargetVSAchievementRedux/reducer"
import RateMasterReducer from "./Administrator/RateMasterRedux/reducer"
import POS_User_Registration_Reducer from "./SweetPOSStore/Administrator/UserMasterRedux/reducer"
import CashierSummaryReportReducer from "./SweetPOSStore/Report/CashierSummaryRedux/reducer"
import FrenchiesItemSaleReportReducer from "./SweetPOSStore/Report/FrenchiesSaleRedux/reducer"
import PosRateMasterReducer from "./SweetPOSStore/Administrator/SweetPOSRateMasterRedux/reducer"
import OrderItemSupplier_Reducer from "./Report/OrderItemSupplierRedux/reducer"
import SPos_MachineType_Reducer from "./SweetPOSStore/Administrator/MachineTypeMasterRedux/reducer"
import StockOutReportReducer from "./SweetPOSStore/Report/StockOutReportRedux/reducer"
import CountryReducer from "./Administrator/CountryRedux/reducer"
import BillBookingReportReducer from "./Report/BillBookingRedux/reducer"
import DemandVsSupplyReportReducer from "./Report/DemandVsSupply/reducer"
import VoucherReducer from "./Administrator/voucherRedux/reducer"
import grnpendingReducer from "./Report/GRNPendingReport/reducer"
import ExportToSapReducer from "./Administrator/ExportToSAPRedux/reducer"
import GRNDiscrepancyReportReducer from "./Report/GRNDiscrepancyRedux/reducer"
import CodeRedemptionReportReducer from "./Report/CodeRedemptionRedux/reducer"
import VoucherRedemptionClaimReducer from "./Report/VoucherRedemptionClaimRedux/reducer"
import PeriodicGrnReportReducer from "./Report/PeriodicGRNRedux/reducer"
import Css_Item_sale_Reducer from "./Report/CssItemSaleReport/reducer"

import ManagerSummaryReportReducer from "./SweetPOSStore/Report/ManagerSummaryRedux/reducer"
import BillDeleteSummaryReportReducer from "./SweetPOSStore/Report/BillDeleteSummaryRedux/reducer"

import SchemeTypeReducer from "./Administrator/SchemeRedux/reducer"
import SchemeReducer from "./Administrator/SchemeMasterRedux/reducer"
import ItemConsumptionReportReducer from "./Report/ItemConsumptionReportRedux/reducer"
import PosServiceSettingReducer from "./Utilites/PosServiesSettingRedux/reducer"
import PhonePaySettingReducer from "./Utilites/PhonePaySettingRedux/reducer"
import Stock_Adjustment_Report_Reducer from "./Report/StockAdjustMentRedux/reducer"

const rootReducer = combineReducers({
	Layout,
	Login,
	Account,
	ForgetPassword,
	Profile,
	// SpinnerReducer,
	// AlertReducer,
	// CommonError,
	BreadcrumbReducer,
	CommonPageFieldReducer,
	CommonPartyDropdownReducer,
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
	BulkInvoiceReducer,
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
	ClaimSummaryReducer,
	InvoiceDataExportReducer,
	PurchaseGSTReportReducer,
	DamageStockReportReducer,
	GSTR1ReportReducer,
	ReturnReportReducer,
	ItemSaleReportReducer,
	StockAdjustmentReducer,
	ClaimTrackingEntry_Reducer,
	CreditDebitDataExportReducer,
	ManPowerReportReducer,
	PartyOutStanding_Reducer,
	ClusterReducer,
	SubClusterReducer,
	CentralServiceItemReducer,
	ServiceItemAssignReducer,
	PartyDetailsReducer,
	ItemWiseUpdateReducer,
	TCSAmountReportReducer,
	Cx_DD_Diffrence_Reducer,
	SystemSettingReducer,
	PosRoleAccessReducer,
	TargetUploadReducer,
	TargetVsAchievementReducer,
	PartyEmployeeDetailsReducer,
	POS_User_Registration_Reducer,
	RateMasterReducer,
	CashierSummaryReportReducer,
	FrenchiesItemSaleReportReducer,
	PosRateMasterReducer,
	OrderItemSupplier_Reducer,
	SPos_MachineType_Reducer,
	StockOutReportReducer,
	CountryReducer,
	BillBookingReportReducer,
	DemandVsSupplyReportReducer,
	VoucherReducer,
	grnpendingReducer,
	ExportToSapReducer,
	GRNDiscrepancyReportReducer,
	CodeRedemptionReportReducer,
	VoucherRedemptionClaimReducer,
	PeriodicGrnReportReducer,
	Css_Item_sale_Reducer,
	ManagerSummaryReportReducer,
	BillDeleteSummaryReportReducer,
	SchemeTypeReducer,
	SchemeReducer,
	ItemConsumptionReportReducer,
	PosServiceSettingReducer,
	PhonePaySettingReducer,
	Stock_Adjustment_Report_Reducer

})
export default rootReducer
