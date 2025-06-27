import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import ChangePasswordSaga from "./auth/changepassword/saga"


import CommonPageField_Saga from "./Utilites/PageFiled/saga"
import pdfReport_Saga from "./Utilites/PdfReport/saga"

// *********************** Module ***********************
import ModulesSaga from "./Administrator/ModulesRedux/saga"
import CompanySaga from "./Administrator/CompanyRedux/saga"
import HPageSaga from "./Administrator/PageMasterRedux/saga"
import UserRegistrationSaga from "./Administrator/UserRegistrationRedux/saga"
import M_EmployeeSaga from "./Administrator/EmployeeRedux/saga"
import RoleMaster_Saga from "./Administrator/RoleMasterRedux/saga"
import ItemsMastersSaga from "./Administrator/ItemsRedux/saga"
import PartyMasterSaga from "./Administrator/PartyRedux/saga"
import RoleAccessSaga from "./Administrator/RoleAccessRedux/saga"
import EmployeeTypeSaga from "./Administrator/EmployeeTypeRedux/saga"
import PartyTypeSaga from "./Administrator/PartyTypeRedux/saga"
import CategoryTypeSaga from "./Administrator/CategoryTypeRedux/saga"
import CategorySaga from "./Administrator/CategoryRedux/saga"
import VehicleSaga from "./Administrator/VehicleRedux/saga"
import DriverSaga from "./Administrator/DriverRedux/saga"
import CompanyGroupSaga from "./Administrator/CompanyGroupRedux/saga"
import PriceListSaga from "./Administrator/PriceList/saga"
import MRPMasterSaga from "./Administrator/MRPMasterRedux/saga"
import MarginMasterSaga from "./Administrator/MarginMasterRedux/saga"
import TermsAndConditionsSaga from "./Administrator/TermsAndConditionsRedux/saga"
import GroupTypeSaga from "./Administrator/GroupTypeRedux/saga"
import GSTSaga from "./Administrator/GSTRedux/saga"
import GroupSaga from "./Administrator/GroupRedux/saga"
import SubGroupSaga from "./Administrator/SubGroupsRedux/saga"
import GeneralSaga from "./Administrator/GeneralRedux/saga"
import PartySubPartysaga from "./Administrator/PartySubPartyRedux/saga"
import PartyItemssaga from "./Administrator/PartyItemsRedux/saga"
import SupplierSaga from "./CommonAPI/SupplierRedux/saga"
import RoutesSaga from "./Administrator/RoutesRedux/saga"
import SalesManSaga from "./Administrator/SalesManRedux/saga"
import PartyMasterBulkUpdateSaga from "./Administrator/PartyMasterBulkUpdateRedux/saga"
import ManagementPartiesSaga from "./Administrator/ManagementPartiesRedux/saga"
import BankSaga from "./Accounting/BankRedux/saga"
import BankAssignSaga from "./Accounting/BankAssignRedux/saga"
import ImportExcelFieldMap_Saga from "./Administrator/ImportExportFieldMapRedux/saga"
import ImportFieldAdd_Saga from "./Administrator/ImportFieldAddRedux/saga"
import ImportExcelPartyMap_Saga from "./Administrator/ImportExcelPartyMapRedux/saga"
import CitySaga from "./Administrator/CityRedux/saga"
import DiscountSaga from "./Administrator/DiscountRedux/saga"

import TargetUploadSagaSaga from "./Administrator/TargetUploadRedux/saga"

import PartyEmployeeDetailsSaga from "./Administrator/PartyEmployeeDetailsRedux/saga"

// *********************** Purchase ***********************
import OrderPageSaga from "./Purchase/OrderPageRedux/saga"

// *********************** Inventory ***********************
import GRNSaga from "./Inventory/GRNRedux/saga"
import ChallanSaga from "./Inventory/ChallanRedux/saga"

// *********************** Prduction ***********************
import BOMSaga from "./Production/BOMRedux/saga"
import WorkOrderSaga from "./Production/WorkOrder/saga"
import MaterialIssueSaga from "./Production/Matrial_Issue/saga"
import ProductionSaga from "./Production/ProductionRedux/saga"
import Production_ReIssueSaga from "./Production/ProductionReissueRedux/saga"
import PartySettingSaga from "./Administrator/PartySetting/saga"
import StockEntrySaga from "./Inventory/StockEntryRedux/saga"
import CommonPartyDrodown_Saga from "./Utilites/PartyDrodown/saga"

// *********************** Sale ***********************
import InvoiceSaga from "./Sales/Invoice/saga"
import BulkInvoiceSaga from "./Sales/bulkInvoice/saga"
import InwardSaga from "./Inter Branch/InwardRedux/saga"
import CreditLimitSaga from "./Administrator/CreditLimitRedux/saga"
import RouteUpdateSaga from "./Administrator/RouteUpdateRedux/saga"
import LoadingSheetSaga from "./Sales/LoadingSheetRedux/saga"
import ReceiptSaga from "./Accounting/Receipt/saga"
import SalesReturnSaga from "./Sales/SalesReturnRedux/saga"
import CreditDebitSaga from "./Accounting/CreditRedux/saga"
import DashboardSaga from "./Dashboard/Dashboard_1_Redux/saga"
import { sessionAlive_saga } from "./auth/sessionAlive/saga"

// *********************** Report ***********************

import SapLedgerSaga from "./Report/SapLedger Redux/saga"
import OrderSummarySaga from "./Report/OrderSummaryRedux/saga"
import StockReportSaga from "./Report/StockReport/saga"
import RetailerDataSaga from "./Report/RetailerDataRedux/saga"
import GenericSaleReportSaga from "./Report/GenericSaleRedux/saga"
import MasterClaimCreatSaga from "./Report/ClaimSummary/saga"
import InvoiceDataExportSaga from "./Report/InvoiceDataExportRedux/saga"
import PurchaseGSTReportSaga from "./Report/PurchaseGSTRedux/saga"
import DamageStockReportSaga from "./Report/DamageStockReportRedux/saga"
import GstR1ReportSaga from "./Report/GSTR1ReportRedux/saga"
import ReturnReportSaga from "./Report/ReturnReportRedux/saga"
import ItemSaleReportSaga from "./Report/ItemSaleReport/saga"
import StockAdjustmentSaga from "./Inventory/StockAdjustmentRedux/saga"
import ClaimTrackingEntrySaga from "./Accounting/ClaimTrackingEntryRedux/saga"
import CreditDebitDataExportSaga from "./Report/CreditDebitDataExportRedux/saga"
import ManPowerReportSaga from "./Report/ManPowerRedux/saga"
import PartyOutstanding_Saga from "./Report/PartyOutstandingRedux/saga"
import ClusterSaga from "./Administrator/ClusterRedux/saga"
import CentralServiceItemSaga from "./Administrator/CentralServiceItemRedux/saga"
import SubSubClusterSaga from "./Administrator/SubClusterRedux/saga"
import ServiceItemAssignSaga from "./Administrator/ServiceItemAssignRedux/saga"
import PartyDetailsSaga from "./Administrator/PartyDetailsRedux/saga"
import ItemWiseUpdateSaga from "./Administrator/ItemWiseUpdateRedux/saga"
import TCSAmountReportSaga from "./Report/TCS_AmountRedux/saga"
import Cx_DD_DiffrenceReportSaga from "./Report/CX_DD_Diffrence_Report/saga"
import SystemSettingSaga from "./Utilites/SystemSettingRedux/saga"
import PosRoleAccessSaga from "./SweetPOSStore/Administrator/POSRoleAccessRedux/saga"
import TargetVsAchievementSaga from "./Report/TargetVSAchievementRedux/saga"
import RateMasterSaga from "./Administrator/RateMasterRedux/saga"
import POSUserRegistrationSaga from "./SweetPOSStore/Administrator/UserMasterRedux/saga"
import CashierSummaryReportSaga from "./SweetPOSStore/Report/CashierSummaryRedux/saga"
import FrenchiesItemSaleReportSaga from "./SweetPOSStore/Report/FrenchiesSaleRedux/saga"
import Pos_RateMaster_Saga from "./SweetPOSStore/Administrator/SweetPOSRateMasterRedux/saga"
import OrderItemSupplier_Saga from "./Report/OrderItemSupplierRedux/saga"
import S_Pos_MachineType_Saga from "./SweetPOSStore/Administrator/MachineTypeMasterRedux/saga"
import StockOutReportSaga from "./SweetPOSStore/Report/StockOutReportRedux/saga"
import CountrySaga from "./Administrator/CountryRedux/saga"
import BillBookingReportSaga from "./Report/BillBookingRedux/saga"
import DemandVsSupplyReportSaga from "./Report/DemandVsSupply/saga"
import VoucherSaga from "./Administrator/voucherRedux/saga"
import GRN_Pending_Saga from "./Report/GRNPendingReport/saga"
import GRNDiscrepancyReportSaga from "./Report/GRNDiscrepancyRedux/saga"
import DataExportToSapSaga from "./Administrator/ExportToSAPRedux/saga"
import CodeRedemptionReportSaga from "./Report/CodeRedemptionRedux/saga"

import VoucherRedemptionClaimSaga from "./Report/VoucherRedemptionClaimRedux/saga"
import PeriodicGRNReportSaga from "./Report/PeriodicGRNRedux/saga"
import Css_Item_Sale_ReportSaga from "./Report/CssItemSaleReport/saga"
import ManagerSummaryReportSaga from "./SweetPOSStore/Report/ManagerSummaryRedux/saga"
import BillDeleteSummaryReportSaga from "./SweetPOSStore/Report/BillDeleteSummaryRedux/saga"
import SchemeTypeSaga from "./Administrator/SchemeRedux/saga"
import SchemeSaga from "./Administrator/SchemeMasterRedux/saga"
import ItemConsumptionReportSaga from "./Report/ItemConsumptionReportRedux/saga"
import PosServiceSettingSaga from "./Utilites/PosServiesSettingRedux/saga"
import PhonePaySettingSaga from "./Utilites/PhonePaySettingRedux/saga"
import Stock_Adjustment_ReportSaga from "./Report/StockAdjustMentRedux/saga"








export default function* rootSaga() {
	yield all([
		fork(AccountSaga),
		fork(ImportExcelFieldMap_Saga),
		fork(ImportFieldAdd_Saga),
		fork(ImportExcelPartyMap_Saga),

		fork(sessionAlive_saga),
		fork(AuthSaga),
		fork(ForgetSaga),
		fork(ProfileSaga),
		fork(LayoutSaga),

		fork(CommonPageField_Saga),


		fork(SupplierSaga),
		fork(ModulesSaga),
		fork(CompanySaga),
		fork(HPageSaga),
		fork(OrderPageSaga),
		fork(GRNSaga),
		fork(UserRegistrationSaga),
		fork(M_EmployeeSaga),
		fork(RoleMaster_Saga),
		fork(ItemsMastersSaga),
		fork(PartyMasterSaga),
		fork(RoleAccessSaga),
		fork(EmployeeTypeSaga),
		fork(PartyTypeSaga),
		fork(CategoryTypeSaga),
		fork(CategorySaga),
		fork(VehicleSaga),
		fork(DriverSaga),
		fork(CompanyGroupSaga),
		fork(PriceListSaga),
		fork(MRPMasterSaga),
		fork(MarginMasterSaga),
		fork(TermsAndConditionsSaga),
		fork(RoutesSaga),
		fork(DiscountSaga),

		fork(SalesManSaga),
		fork(CreditLimitSaga),
		fork(GroupTypeSaga),
		fork(GroupSaga),
		fork(BankSaga),
		fork(BankAssignSaga),
		fork(SubGroupSaga),
		fork(GeneralSaga),
		fork(GSTSaga),
		fork(PartySubPartysaga),
		fork(PartyItemssaga),
		fork(BOMSaga),
		fork(WorkOrderSaga),
		fork(MaterialIssueSaga),
		fork(ProductionSaga),
		fork(InvoiceSaga),
		fork(BulkInvoiceSaga),
		fork(InwardSaga),
		fork(ChallanSaga),
		fork(Production_ReIssueSaga),
		fork(RouteUpdateSaga),
		fork(LoadingSheetSaga),
		fork(PartyMasterBulkUpdateSaga),
		fork(ManagementPartiesSaga),
		fork(ReceiptSaga),
		fork(SalesReturnSaga),
		fork(CreditDebitSaga),
		fork(DashboardSaga),
		fork(ChangePasswordSaga),
		fork(SapLedgerSaga),
		fork(CitySaga),
		fork(OrderSummarySaga),
		fork(PartySettingSaga),
		fork(StockEntrySaga),

		fork(RetailerDataSaga),
		fork(CommonPartyDrodown_Saga),
		fork(MasterClaimCreatSaga),

		fork(pdfReport_Saga),
		fork(StockReportSaga),
		fork(DamageStockReportSaga),
		fork(GenericSaleReportSaga),
		fork(PurchaseGSTReportSaga),
		fork(InvoiceDataExportSaga),
		fork(GstR1ReportSaga),
		fork(ReturnReportSaga),
		fork(ItemSaleReportSaga),
		fork(StockAdjustmentSaga),
		fork(ClaimTrackingEntrySaga),
		fork(CreditDebitDataExportSaga),
		fork(ManPowerReportSaga),
		fork(PartyOutstanding_Saga),
		fork(ClusterSaga),
		fork(CentralServiceItemSaga),
		fork(SubSubClusterSaga),
		fork(ServiceItemAssignSaga),
		fork(PartyDetailsSaga),
		fork(ItemWiseUpdateSaga),
		fork(TCSAmountReportSaga),
		fork(Cx_DD_DiffrenceReportSaga),
		fork(SystemSettingSaga),
		fork(PosRoleAccessSaga),
		fork(TargetUploadSagaSaga),
		fork(TargetVsAchievementSaga),
		fork(PartyEmployeeDetailsSaga),
		fork(POSUserRegistrationSaga),
		fork(RateMasterSaga),
		fork(CashierSummaryReportSaga),
		fork(FrenchiesItemSaleReportSaga),
		fork(Pos_RateMaster_Saga),
		fork(OrderItemSupplier_Saga),
		fork(S_Pos_MachineType_Saga),
		fork(StockOutReportSaga),
		fork(CountrySaga),
		fork(BillBookingReportSaga),
		fork(DemandVsSupplyReportSaga),
		fork(VoucherSaga),
		fork(GRN_Pending_Saga),
		fork(DataExportToSapSaga),
		fork(GRNDiscrepancyReportSaga),
		fork(CodeRedemptionReportSaga),
		fork(VoucherRedemptionClaimSaga),
		fork(PeriodicGRNReportSaga),
		fork(Css_Item_Sale_ReportSaga),
		fork(ManagerSummaryReportSaga),
		fork(BillDeleteSummaryReportSaga),
		fork(SchemeTypeSaga),
		fork(SchemeSaga),
		fork(ItemConsumptionReportSaga),
		fork(PosServiceSettingSaga),
		fork(PhonePaySettingSaga),
		fork(Stock_Adjustment_ReportSaga)
	])
}
