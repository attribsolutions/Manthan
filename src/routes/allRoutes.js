import React from "react"
import * as path from "./route_url";
import { Redirect, useParams } from "react-router-dom"


//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

//Import Administrator 
import Modules from "../pages/Adminisrator/ModulesPages/Modules";
import ModulesList from "../pages/Adminisrator/ModulesPages/ModulesList";
import CompanyModule from "../pages/Adminisrator/CompanyPages/CompanyModule";
import CompanyList from "../pages/Adminisrator/CompanyPages/CompanyList";

import PageList from "../pages/Adminisrator/Page-Pages/PageList";
import PageMaster from "../pages/Adminisrator/Page-Pages/PageMaster";

import AddUser from "../pages/Adminisrator/UserRegistrationPages/UserRegistration";
import UserList from "../pages/Adminisrator/UserRegistrationPages/UserList";
import AddEmployee from "../pages/Adminisrator/EmployeePages/EmployeeMaster";
import Employee_List from "../pages/Adminisrator/EmployeePages/EmployeeList";
import RoleMaster from "../pages/Adminisrator/RoleMasterPages/RoleMaster";
import RoleList from "../pages/Adminisrator/RoleMasterPages/RoleList"

import ItemsList from "../pages/Adminisrator/ItemPages/ItemList";
import ItemsMaster from "../pages/Adminisrator/ItemPages/ItemMaster/itemIndex"
import SearchBoxSecond from "../pages/Adminisrator/SearchBox/SearchBoxSecond";
import SerachBox3 from "../pages/Adminisrator/SearchBox/SerachBox3";
import PartyList from "../pages/Adminisrator/PartyMaster/PartyList";
import PartyMaster from "../pages/Adminisrator/PartyMaster/MasterAdd/PartyIndex";

import ResetPassword from "../pages/Authentication/ResetPassword";
import SendOTP from "../pages/Authentication/SendOTP";
import EnterOTP from "../pages/Authentication/EnterOTP";
import RoleAccessListPage from "../pages/Adminisrator/RoleAccessPages/RoleAccessListPage";
import EmployeeTypesMaster from "../pages/Adminisrator/EmployeeTypes/EmployeeTypesMaster";
import RoleAccessAdd from "../pages/Adminisrator/RoleAccessPages/RoleAccessAdd";
import EmployeeTypeList from "../pages/Adminisrator/EmployeeTypes/EmployeeTypeList";
import PartyType from "../pages/Adminisrator/PartyTypes/PartyType";
import PartyTypeList from "../pages/Adminisrator/PartyTypes/PartyTypeList";
import SelectDivisionPage from "../pages/Authentication/SelectDivisionPage";
import RoleAccessCopyFunctionality from "../pages/Adminisrator/RoleAccessPages/RoleAccessCopyFunctionality";
import CategoryTypeMaster from "../pages/Adminisrator/CategoryTypePages/CategoryTypeMaster";
import CategoryTypeList from "../pages/Adminisrator/CategoryTypePages/CategoryTypeList";
import CategoryList from "../pages/Adminisrator/CategoryPages/CategoryList";
import CategoryMaster from "../pages/Adminisrator/CategoryPages/CategoryMaster";
import VehicleMaster from "../pages/Adminisrator/VehiclePages/VehicleMaster";
import VehicleList from "../pages/Adminisrator/VehiclePages/VehicleList";
import DriverMaster from "../pages/Adminisrator/DriverPage/DriverMaster";
import DriverList from "../pages/Adminisrator/DriverPage/DriverList";
import CompanyGroupMaster from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupMaster";
import CompanyGroupList from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupList";

import PriceMaster from "../pages/Adminisrator/PriceList/PriceMaster";
import PriceList from "../pages/Adminisrator/PriceList/PriceList";

import MRPMaster from "../pages/Adminisrator/MRPMaster/MRPMaster";
import MarginMaster from "../pages/Adminisrator/MarginMaster/MarginMaster";

import MRPList from "../pages/Adminisrator/MRPMaster/MRPList";
import MarginList from "../pages/Adminisrator/MarginMaster/MarginList";

import GroupMaster from "../pages/Adminisrator/GroupPage/GroupMaster"
import GroupList from "../pages/Adminisrator/GroupPage/GroupList";
import GroupTypeList from "../pages/Adminisrator/GroupTypePage/GroupTypeList";


import GroupSubGroup from "../pages/Adminisrator/GroupSubGroup/GroupSubGroup";


import GroupTypeMaster from "../pages/Adminisrator/GroupTypePage/GroupTypeMaster";
import PartySubParty from "../pages/Adminisrator/PartySubPartyPages/index.js";
import PartySubPartyList from "../pages/Adminisrator/PartySubPartyPages/partysubPartyList";

import GSTMaster from "../pages/Adminisrator/GSTPages/GSTMaster";
import GSTList from "../pages/Adminisrator/GSTPages/GSTList";

import TermsAndConditionsMaster from "../pages/Adminisrator/TermsAndConditions/TermsAndConditionsMaster";
import TermsAndConditionsList from "../pages/Adminisrator/TermsAndConditions/TermsAndConditionsList";

import Order from "../pages/Purchase/Order/Order"
import OrderList from "../pages/Purchase/Order/OrderList"

import PartyItems from "../pages/Adminisrator/PartyItemPage/PartyItems";

import GeneralMaster from "../pages/Adminisrator/GeneralPage/GeneralMaster";
import GeneralList from "../pages/Adminisrator/GeneralPage/GeneralList";

import GRNList from "../pages/Inventory/GRN/GRNList";
import GRNAdd3 from "../pages/Inventory/GRN/GRN_ADD_3.js";

import SubGroupMaster from "../pages/Adminisrator/SubGroupPages/SubGroupMaster";
import SubGroupList from "../pages/Adminisrator/SubGroupPages/SubGroupList";

import BOMMaster from "../pages/Production/BOM/BOMMaster/BOMIndex";
import BOMList from "../pages/Production/BOM/BOMList/BOMList";

import WorkOrder from "../pages/Production/WorkOrder/WorkOrder";
import WorkOrderList from "../pages/Production/WorkOrder/WorkOrderList";

import MaterialIssueMaster from "../pages/Production/Material_Issue/Material_IssueMaster";
import MaterialIssueList from "../pages/Production/Material_Issue/Material_Issue_List";

import ProductionMaster from "../pages/Production/Production/ProductionMaster";
import ProductionList from "../pages/Production/Production/ProductionList";

import ProductionReIssueAdd from "../pages/Production/ProductionRe-Issue/PrductionReIssueAdd";
import ProductionReIssueList from "../pages/Production/ProductionRe-Issue/ProductionReIssueList";

import Invoice from "../pages/Sale/Invoice/Invoice";
import InvoiceList from "../pages/Sale/Invoice/InvoiceList";

import Inward from "../pages/Inter Branch/Inward/Inward";
import InwardList from "../pages/Inter Branch/Inward/InwardList";

import RoutesMaster from "../pages/Adminisrator/RoutesPages/RoutesMaster";
import RoutesList from "../pages/Adminisrator/RoutesPages/RoutesList";

import SalesManMaster from "../pages/Adminisrator/SalesManPages/SalesManMaster";
import SalesManList from "../pages/Adminisrator/SalesManPages/SalesManList";
import LoadingSheet from "../pages/Sale/LoadingSheet/LoadingSheet";
import LoadingSheetList from "../pages/Sale/LoadingSheet/LoadingSheetList";

import RouteUpdate from "../pages/Adminisrator/RouteUpdate/RouteUpdate";
import PartyMasterBulkUpdate from "../pages/Adminisrator/PartyMasterBulkPages/PartyMasterBulkUpdate";
import ManagementEmpParties from "../pages/Adminisrator/ManagementParties/ManagementEmpParties";
import Receipts from "../pages/Accounting/Receipt/Receipts";
import ReceiptList from "../pages/Accounting/Receipt/ReceiptList";
import BankMaster from "../pages/Accounting/Bank/BankMaster";
import BankList from "../pages/Accounting/Bank/BankList";
import PaymentEntry from "../pages/Accounting/Payment/PaymentEntry";
import PaymentEntryList from "../pages/Accounting/Payment/PaymentEntryList";
import BulkRecipt from "../pages/Accounting/Receipt/BulkReceipt";
import BankAssign from "../pages/Accounting/BankAssign/BankAssign";
import LoadingSheetUpdate from "../pages/Sale/LoadingSheet/LoadingSheetUpdate";
import SalesReturn from "../pages/Sale/SalesReturn/SalesReturn";

import GoodsCredit_GoodsDebitAdd from "../pages/Accounting/CreditDebit/GoodsCreditAndGoodsDebitAdd";
import DebitNoteAdd from "../pages/Accounting/CreditDebit/DebitNoteAdd";
import CreditListAll from "../pages/Accounting/CreditDebit/CreditListAll";
import CreditNoteAdd from "../pages/Accounting/CreditDebit/CreditNoteAdd";

import ImportFieldAdd from "../pages/Adminisrator/ImportMaster/FieldAdd/ImportFieldAdd";
import ImportFieldAddList from "../pages/Adminisrator/ImportMaster/FieldAdd/ImportFieldAddList";
import ImportExcelFieldMap from "../pages/Adminisrator/ImportMaster/ImportExcelFieldMap/Index";
import InvoiceExcelUpload from "../pages/Adminisrator/ImportMaster/InvoiceExcelUpload/Index";
import RetailerExcelUpload from "../pages/Adminisrator/ImportMaster/RetailerExcelUpload/Index";

import SalesReturnList from "../pages/Sale/SalesReturn/SalesReturnList";
import ImportExcelPartyMap from "../pages/Adminisrator/ImportMaster/ImportExcelPartyMap/Index";

import Dashboard_1 from "../pages/Dashboard/Dashboard_1/Dashboard_1"
import SapLedger from "../Reports/SapLedgerReport/SapLedger";
import ProductMarginReport from "../Reports/ProductMarginReport/ProductMarginReport";
import CityMaster from "../pages/Adminisrator/CityPages/CityMaster";
import CityList from "../pages/Adminisrator/CityPages/CityList";
import OrderSummary from "../Reports/OrderSummaryReport/OrderSummary";
import InvoiceConfiguration from "../pages/Adminisrator/InvoiceConfiguration/InvoiceConfiguration";
import StockEntry from "../pages/Inventory/StockEntry/StockEntry";
import PartyLedger from "../Reports/PratyLedger/Partyledger";
import PurchaseReturnMode3 from "../pages/Purchase/Return/PurchaseReturnMode3";
import DiscountMaster from "../pages/Adminisrator/Discount/DiscountMaster";
import GenericSaleReport from "../Reports/GenericSaleReport/GenericSaleReport";
import RetailerDataReport from "../Reports/RetailerDataReport/RetailerDataReport";
import DiscountList from "../pages/Adminisrator/Discount/DiscountList";
import PurchaseReturn from "../pages/Purchase/Return/PurchaseReturn";
import InvoiceDataExport from "../Reports/InvoiceDataExport/InvoiceDataExport.js";
import PurchaseGSTReport from "../Reports/PurchaseGSTReport/PurchaseGSTReport.js";
import DamageStockReport from "../Reports/DamageStockReport";
import DeleteInvoiceDataExport from "../Reports/DeleteInvoiceDataExport";
import GSTR1Report from "../Reports/GSTR1Report/GSTR1Report";
import ReturnReport from "../Reports/ReturnReport/ReturnReport";

import ItemSaleReport from "../Reports/ItemSaleReport";

import ItemRegisterReport from "../Reports/ItemRegisterReport/ItemRegisterReport";
import ClaimSummaryList from "../Reports/ClaimSummary/ClaimSummaryList.js";
import ClaimSummaryMaster from "../Reports/ClaimSummary/ClaimSummaryMaster.js";

import TransactionLog from "../pages/ActivityLog/TransactionLog";

import StockAdjustment from "../pages/Inventory/StockAdjustment";
import ClaimTrackingEntry from "../pages/Accounting/Claim Tracking Entry/ClaimTrackingEntry";
import ClaimTrackingEntryList from "../pages/Accounting/Claim Tracking Entry/ClaimTrackingEntryList";
import CreditDebitDataExport from "../Reports/CreditDebitDataExport.js";
import PartyOutstandingReport from "../Reports/PartyOutstandingReport";
import RetailerApprovalList from "../pages/Adminisrator/RetailerApproval";
import MobailRetailersSend from "../pages/Adminisrator/mobileRetailerSend/Index";

import ClusterMaster from "../pages/Adminisrator/Cluster_SubCluster/ClusterMaster";
import ClusterList from "../pages/Adminisrator/Cluster_SubCluster/ClusterList";

import SubClusterMaster from "../pages/Adminisrator/Cluster_SubCluster/SubClusterMaster";
import SubClusterList from "../pages/Adminisrator/Cluster_SubCluster/SubClusterList";

import CentralServiceItem from "../pages/Adminisrator/CentralServiceItem/CentralServiceItemMaster";
import CentralServiceItemList from "../pages/Adminisrator/CentralServiceItem/CentralServiceItemList";
import ServiceItemAssign from "../pages/Adminisrator/ServiceItemAssign";
import ClaimTrackingReport from "../Reports/ClaimTrackingReport";
import PartyDetails from "../pages/Adminisrator/PartyDetails";
import Dashboard_Admin from "../pages/Dashboard/Dashboard_2/Dashboard_Admin.js"
import ItemMasterBulkUpdate from "../pages/Adminisrator/ItemMasterBulkUpdate";
import ItemImageUpload from "../pages/Adminisrator/ItemPages/ItemImageUpload/ItemImageUpload.js";
import CreditNote_1 from "../pages/Accounting/CreditDebit/CreditNote1";
import ManPowerReport from "../Reports/ManPowerReport";
import TCSAmountReport from "../Reports/TCSAmountReport";
import CssItemSaleReport from "../Reports/CssItemSaleReport"                      // Add 
import CX_DD_DiffrenceReport from "../Reports/CX_DD_DiffrenceReport";
import Bulk_Invoice from "../pages/Sale/Bulk_Invoice/index";
import POSRoleAccess from "../pages/SweetPOS/Adminstration/RoleAccess/POSRoleAccess.js";
import SystemSetting from "../pages/Utility/SystemSetting/SystemSetting.js";
import SystemSettingList from "../pages/Utility/SystemSetting/SystemSettingList.js";
import SNSReport from "../Reports/StockReport/SNSReport.js";
import CurrentStockReport from "../Reports/StockReport/CurrentStockReport.js";
import TargetUpload from "../pages/Adminisrator/TragetUpload/TargetUploadMaster.js";
import TargetUploadList from "../pages/Adminisrator/TragetUpload/TargetUploadList.js";
import TargetVSAchievement from "../Reports/TargetVSAchievement";
import PartyEmployeeDetails from "../pages/Adminisrator/PartyEmployeeDetails/PartyEmployeeDetail.js";
import CreditNoteExcelUpload from "../pages/Adminisrator/ImportMaster/CreditNoteExcelUpload";
import POSUSER from "../pages/SweetPOS/Adminstration/UserMaster/POSUserMaster.js";
import POSUserList from "../pages/SweetPOS/Adminstration/UserMaster/POSUserList.js";
import RateMaster from "../pages/Adminisrator/RateMaster/RateMaster";
import RateList from "../pages/Adminisrator/RateMaster/RateList";
import BulkWorkOrder from "../pages/Production/WorkOrder/BulkWorkOrder/BulkWorkOrder.js";
import IBInvoice from "../pages/Inter Branch/IBInvoice/IBInvoice.js";
import IBInvoiceList from "../pages/Inter Branch/IBInvoice/IBInvoiceList.js";
import GRN_ADD_1 from "../pages/Inventory/GRN/GRN_ADD_1.js";
import CashierSummary from "../pages/SweetPOS/Reports/CashierSummaryReport/CashierSummary.js";
import BulkWorkOrderList from "../pages/Production/WorkOrder/BulkWorkOrder/BulkWorkOrderList.js";
import FrenchiesSaleReport from "../pages/SweetPOS/Reports/FrenchiesSaleReport/FrenchiesSaleReport.js";
import DailyItemSaleView from "../pages/Dashboard/FrenchiesesDashboard/DailyItemSaleView.js";
import ItemSupplierAssign from "../pages/Adminisrator/ItemMasterBulkUpdate/ItemSupplierAssign.js";
import StockEntryList from "../pages/Inventory/StockEntry/StockEntryList.js";
import SweetPOSRateMaster from "../pages/SweetPOS/Adminstration/RateMaster/SweetPOSRateMaster.js";
import OrderItemSupplierReport from "../Reports/OrderItemSupplier/index.js";
import MachineTypeMaster from "../pages/SweetPOS/Adminstration/MachineType/MachineTypeMaster.js";
import StockOutReport from "../pages/SweetPOS/Reports/StockOutReport/index.js";

import CustomerMobileView from "../pages/Dashboard/FrenchiesesDashboard/CustomerMobileView/CustomerMobileView.js";

import POS_Log from "../pages/ActivityLog/POSLog.js";
import CountryMaster from "../pages/Adminisrator/Country/CountryMaster.js";
import CountryList from "../pages/Adminisrator/Country/CountryList.js";
import MachineTypeList from "../pages/SweetPOS/Adminstration/MachineType/MachineTypeList.js";
import FranchiseSaleWithBillCount from "../pages/SweetPOS/Reports/FranchiseSaleWithBillCount.js/index.js";
import Franchies_Invoice_Master from "../pages/Sale/Franchies_Invoice/Franchies_Invoice_Master.js";
import SweetPosInvoiceList from "../pages/SweetPOS/Sales/Invoice/SPOS_InvoiceList.js";
import BillBookingReport from "../Reports/BillBookingReport/index.js";
import DemandVSSupply from "../Reports/DemandVsSupply/index.js";
import Voucher from "../pages/Adminisrator/voucherPages/Voucher.js";
import VoucherList from "../pages/Adminisrator/voucherPages/VoucherList.js";
import GRNPendingReport from "../Reports/GRN Pending Reort/GRNPendingReport.js";
import DataExportToSAP from "../pages/Adminisrator/DataExportToSAP/DataExportToSAP.js";
import GRNDiscrepancyReport from "../Reports/GRNDiscrepancyReport/GRNDiscrepancyReport.js";
import CodeRedemtionReport from "../Reports/CodeRedemtionReport/CodeRedemtionReport.js";
import VoucherRedemptionClaim from "../Reports/VoucherRedemptionClaim/VoucherRedemptionClaim.js";
import PeriodicGRNReport from "../Reports/PeriodicGRNReport/PeriodicGRNReport.js";
import DailyDispatchReport from "../Reports/DailyDispatchReport/index.js";
import PosSummarySale from "../pages/SweetPOS/Reports/PosSummarySaleReport/PosSummarySale.js";
import ManagerSummary from "../pages/SweetPOS/Reports/ManagerSummaryReport/ManagerSummary.js";
import BillDeleteSummaryReport from "../Reports/BillSummaryDeleteReport/index.js";
import SchemeType from "../pages/Adminisrator/SchemeType/SchemeType.js";
import SchemeTypeList from "../pages/Adminisrator/SchemeType/ScemeTypeList.js";
import SchemeMaster from "../pages/Adminisrator/SchemeMaster/SchemeMaster.js";
import SchemeMasterList from "../pages/Adminisrator/SchemeMaster/SchemeMasterList.js";
import ItemConsumption from "../Reports/ItemConsumptionReport/ItemConsumption.js";
import FranchisePartyMaster from "../pages/Adminisrator/PartyMaster/FranchisePartyMaster.js";
import PosServiceSettingList from "../pages/Utility/PosSystemsetting/PosServiceSettingList.js";
import PosServiceSetting from "../pages/Utility/PosSystemsetting/PosServiceSetting.js";

import PhonePaySettingList from "../pages/Utility/PhonePaySetting/PhonePaySettingList.js";
import PhonePaySetting from "../pages/Utility/PhonePaySetting/PhonePaySetting.js";
import StockadjustmentReport from "../Reports/StockadjustmentReport/index.js";



const userRoutes = [

	{ path: path.POS_ORDER_IN_POS, component: Order },
	{ path: path.POS_INVOICE_LIST_IN_POS, component: SweetPosInvoiceList },

	{ path: path.POS_ORDER_LIST_IN_POS, component: OrderList },



	// *************************** DashBord *******************************//

	{ path: path.DASHBORD_1, component: Dashboard_1, isPartyWisePage: true },
	{ path: path.DASHBORD_2, component: Dashboard_Admin, isPartyWisePage: true },

	// *************************** Administration *******************************//
	{ path: path.MODULE, component: Modules },//not party wise
	{ path: path.MODULE_lIST, component: ModulesList },//not party wise

	{ path: path.COMPANY, component: CompanyModule },//not party wise
	{ path: path.COMPANY_lIST, component: CompanyList },//not party wise

	{ path: path.PAGE_lIST, component: PageList },//not party wise
	{ path: path.PAGE, component: PageMaster },//not party wise

	{ path: path.USER, component: AddUser },//not party wise
	{ path: path.USER_lIST, component: UserList },//not party wise

	{ path: path.ROLEACCESS, component: RoleAccessAdd },//not party wise
	{ path: path.ROLEACCESS_lIST, component: RoleAccessListPage },//not party wise
	{ path: path.COPY_ROLEACCESS, component: RoleAccessCopyFunctionality },//not party wise

	{ path: path.ROLE, component: RoleMaster },//not party wise
	{ path: path.ROLE_lIST, component: RoleList },//not party wise

	{ path: path.COMPANYGROUP, component: CompanyGroupMaster },//not party wise
	{ path: path.COMPANYGROUP_lIST, component: CompanyGroupList },//not party wise

	// ******************************* Master Module ******************************//

	{ path: path.EMPLOYEE, component: AddEmployee, },//not party wise
	{ path: path.EMPLOYEE_lIST, component: Employee_List },//not party wise

	{ path: path.ITEM, component: ItemsMaster },//not party wise
	{ path: path.ITEM_lIST, component: ItemsList },//not party wise

	{ path: path.PARTY_lIST, component: PartyList, isPartyWisePage: true },//not party wise
	{ path: path.PARTY, component: PartyMaster, isPartyWisePage: true },//not party wise

	{ path: path.RETAILER_LIST, component: PartyList, isPartyWisePage: true },
	{ path: path.RETAILER_MASTER, component: PartyMaster, isPartyWisePage: true },

	{ path: path.RETAILER_MASTER_1, component: PartyMaster, isPartyWisePage: true },
	{ path: path.RETAILER_MASTER_LIST_1, component: PartyList, isPartyWisePage: true },



	{ path: path.FRANCHISE_CUSTOMER_LIST, component: PartyList, isPartyWisePage: true },
	{ path: path.FRANCHISE_CUSTOMER_MASTER, component: PartyMaster, isPartyWisePage: true },

	{ path: path.NON_RETAILER_PARTY_lIST, component: PartyList, isPartyWisePage: true },
	{ path: path.NON_RETAILER_PARTY, component: PartyMaster, isPartyWisePage: true },

	{ path: path.PARTY_SELF_EDIT, component: PartyMaster, isPartyWisePage: true },//not party wise

	{ path: path.EMPLOYEETYPE, component: EmployeeTypesMaster },//not party wise
	{ path: path.EMPLOYEETYPE_lIST, component: EmployeeTypeList },//not party wise

	{ path: path.PARTYTYPE, component: PartyType },//not party wise
	{ path: path.PARTYTYPE_lIST, component: PartyTypeList },//not party wise

	{ path: path.CATEGORYTYPE, component: CategoryTypeMaster },//not party wise
	{ path: path.CATEGORYTYPE_lIST, component: CategoryTypeList },//not party wise

	{ path: path.CATEGORY, component: CategoryMaster },//not party wise
	{ path: path.CATEGORY_lIST, component: CategoryList },//not party wise

	{ path: path.VEHICLE, component: VehicleMaster, isPartyWisePage: true },
	{ path: path.VEHICLE_lIST, component: VehicleList, isPartyWisePage: true },

	{ path: path.DRIVER, component: DriverMaster, isPartyWisePage: true },
	{ path: path.DRIVER_lIST, component: DriverList, isPartyWisePage: true },

	{ path: path.GROUPTYPE, component: GroupTypeMaster },//not party wise
	{ path: path.GROUPTYPE_lIST, component: GroupTypeList },//not party wise

	{ path: path.TERMS_AND_CONDITION, component: TermsAndConditionsMaster },//not party wise
	{ path: path.TERMS_AND_CONDITION_LIST, component: TermsAndConditionsList },//not party wise

	{ path: path.PRICE_lIST, component: PriceList },//not party wise
	{ path: path.PRICE, component: PriceMaster },//not party wise

	{ path: path.MRP, component: MRPMaster },//not party wise
	{ path: path.MRP_lIST, component: MRPList },//not party wise

	{ path: path.RATE_MASTER, component: RateMaster },//not party wise
	{ path: path.RATE_LIST, component: RateList },//not party wise

	{ path: path.MARGIN, component: MarginMaster },//not party wise
	{ path: path.MARGIN_lIST, component: MarginList },//not party wise

	{ path: path.GROUP, component: GroupMaster },//not party wise
	{ path: path.GROUP_lIST, component: GroupList },//not party wise

	{ path: path.GROUP_SUBGROUP, component: GroupSubGroup },//not party wise

	{ path: path.SCHEME_MASTER, component: SchemeMaster },//not party wise
	{ path: path.SCHEME_MASTER_LIST, component: SchemeMasterList },//not party wise


	{ path: path.GST, component: GSTMaster },//not party wise
	{ path: path.GST_LIST, component: GSTList },//not party wise

	{ path: path.PARTY_SUB_PARTY, component: PartySubParty },// use self party drop-down
	{ path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },//not party wise

	{ path: path.PARTYITEM, component: PartyItems, isPartyWisePage: true },
	{ path: path.CHANNEL_ITEM, component: PartyItems },//not party wise

	{ path: path.SUBGROUP, component: SubGroupMaster },//not party wise
	{ path: path.SUBGROUP_LIST, component: SubGroupList },//not party wise

	{ path: path.GENERAL, component: GeneralMaster },//not party wise
	{ path: path.GENERAL_LIST, component: GeneralList },//not party wise

	{ path: path.ROUTES, component: RoutesMaster, isPartyWisePage: true },
	{ path: path.ROUTES_LIST, component: RoutesList, isPartyWisePage: true },
	{ path: path.ROUTE_UPDATE, component: RouteUpdate, isPartyWisePage: true },

	{ path: path.SALESMAN, component: SalesManMaster, isPartyWisePage: true },
	{ path: path.SALESMAN_LIST, component: SalesManList, isPartyWisePage: true },

	{ path: path.CITY, component: CityMaster },//not party wise
	{ path: path.CITY_LIST, component: CityList },//not party wise

	{ path: path.TARGET_UPLOAD, component: TargetUpload },
	{ path: path.TARGET_UPLOAD_LIST, component: TargetUploadList },

	{ path: path.CREDIT_NOTE_UPLOAD, component: CreditNoteExcelUpload, isPartyWisePage: true },

	{ path: path.INVOICE_EXCEL_UPLOAD, component: InvoiceExcelUpload, isPartyWisePage: true },


	{ path: path.RETAILER_EXCEL_UPLOAD, component: RetailerExcelUpload, isPartyWisePage: true },

	{ path: path.IMPORT_EXCEL_FIELD_MAP, component: ImportExcelFieldMap, isPartyWisePage: true },
	{ path: path.IMPORT_CREDIT_NOTE_EXCEL_FIELD_MAP, component: ImportExcelFieldMap, isPartyWisePage: true },

	{ path: path.IMPORT_FIELD_ADD, component: ImportFieldAdd, isPartyWisePage: true },

	{ path: path.IMPORT_FIELD_ADD_LIST, component: ImportFieldAddList, isPartyWisePage: true },

	{ path: path.IMPORT_EXCEL_PARTY_MAP, component: ImportExcelPartyMap, isPartyWisePage: true },

	{ path: path.PARTY_MASTER_BULK_UPDATE, component: PartyMasterBulkUpdate, isPartyWisePage: true },

	{ path: path.MANAGEMENT_PARTIES, component: ManagementEmpParties },//not party wise

	{ path: path.BANK, component: BankMaster },//not party wise
	{ path: path.BANK_LIST, component: BankList },//not party wise

	{ path: path.INVOICE_CONFIGURATION, component: InvoiceConfiguration, isPartyWisePage: true },

	{ path: path.DISCOUNT_MASTER, component: DiscountMaster, isPartyWisePage: true },
	{ path: path.DISCOUNT_LIST, component: DiscountList, isPartyWisePage: true },

	{ path: path.RETAILER_APPROVAL, component: RetailerApprovalList, isPartyWisePage: true },

	{ path: path.MOBILE_RETAILER_SEND, component: MobailRetailersSend },// use self party drop-down

	{ path: path.CLUSTER_MASTER, component: ClusterMaster },//not party wise
	{ path: path.CLUSTER_lIST, component: ClusterList },//not party wise

	{ path: path.SUB_CLUSTER_MASTER, component: SubClusterMaster },//not party wise
	{ path: path.SUB_CLUSTER_lIST, component: SubClusterList },//not party wise

	{ path: path.CENTRAL_SERVICE_ITEM_MASTER, component: CentralServiceItem },//not party wise
	{ path: path.CENTRAL_SERVICE_ITEM_lIST, component: CentralServiceItemList },//not party wise

	{ path: path.SERVICE_ITEM_ASSIGN, component: ServiceItemAssign },//not party wise

	{ path: path.PARTY_DETAILS, component: PartyDetails },//not party wise

	{ path: path.ITEM_MASTER_BULK_UPDATE, component: ItemMasterBulkUpdate },//not party wise

	{ path: path.ITEM_SUPPLIER_ASSIGN, component: ItemSupplierAssign },//not party wise

	{ path: path.ITEM_IMAGE_UPLOAD, component: ItemImageUpload },//not party wise

	{ path: path.PARTY_EMPLOYEE_DETAILS, component: PartyEmployeeDetails, isPartyWisePage: true },

	{ path: path.COUNTRY_MASTER, component: CountryMaster },//not party wise
	{ path: path.COUNTRY_LIST, component: CountryList },//not party wise


	{ path: path.VOUCHER, component: Voucher },//not party wise
	{ path: path.VOUCHER_LIST, component: VoucherList },//not party wise

	{ path: path.SCHEME_TYPE, component: SchemeType },
	{ path: path.SCHEME_TYPE_LIST, component: SchemeTypeList },

	{ path: path.FRANCHISE_PARTY_MASTER, component: FranchisePartyMaster },
	//******************************* Inventory Module ************************************//
	{ path: path.IB_INVOICE_LIST, component: IBInvoiceList },
	{ path: path.IB_INVOICE, component: IBInvoice },

	{ path: path.GRN_LIST_1, component: GRNList, isPartyWisePage: true },
	{ path: path.GRN_ADD_1, component: GRN_ADD_1, isPartyWisePage: true },

	{ path: path.IB_GRN, component: GRN_ADD_1, isPartyWisePage: true },


	{ path: path.GRN_FOR_ACCOUNTING_GRN, component: GRNList, isPartyWisePage: true },


	{ path: path.ACCOUNTING_GRN_LIST, component: GRNList, isPartyWisePage: true },
	{ path: path.ACCOUNTING_GRN, component: GRN_ADD_1, isPartyWisePage: true },



	{ path: path.GRN_STP_1, component: OrderList, isPartyWisePage: true },

	{ path: path.GRN_LIST_3, component: GRNList, isPartyWisePage: true },
	{ path: path.GRN_ADD_3, component: GRNAdd3, isPartyWisePage: true },
	{ path: path.GRN_STP_3, component: OrderList, isPartyWisePage: true },

	{ path: path.STOCK_ENTRY, component: StockEntry, isPartyWisePage: true },

	{ path: path.STOCK_ENTRY_LIST, component: StockEntryList, isPartyWisePage: true },

	{ path: path.STOCK_ADJUSTMENT, component: StockAdjustment, isPartyWisePage: true },

	{ path: path.STOCK_ADJUSTMENT_MODE_2, component: StockAdjustment, isPartyWisePage: true },

	//******************************* Purchase Module ************************************//

	{ path: path.ORDER_1, component: Order, isPartyWisePage: true },
	{ path: path.ORDER_LIST_1, component: OrderList, isPartyWisePage: true },

	{ path: path.ORDER_QUATATION, component: Order, isPartyWisePage: true },
	{ path: path.ORDER_QUATATION_LIST, component: OrderList, isPartyWisePage: true },

	{ path: path.ORDER_2, component: Order, isPartyWisePage: true },
	{ path: path.ORDER_LIST_2, component: OrderList, isPartyWisePage: true },

	{ path: path.ORDER_4, component: Order, isPartyWisePage: true },
	{ path: path.ORDER_LIST_4, component: OrderList, isPartyWisePage: true },

	{ path: path.APP_ORDER_LIST, component: OrderList, isPartyWisePage: true },

	{ path: path.PURCHASE_RETURN, component: PurchaseReturn, isPartyWisePage: true },
	{ path: path.PURCHASE_RETURN_LIST, component: SalesReturnList, isPartyWisePage: true },
	{ path: path.PURCHASE_RETURN_MODE_3, component: PurchaseReturnMode3, isPartyWisePage: true },


	//******************************* PRODUCTION Module ************************************//
	{ path: path.BIllOf_MATERIALS, component: BOMMaster },
	{ path: path.BIllOf_MATERIALS_LIST, component: BOMList },

	{ path: path.WORK_ORDER, component: WorkOrder },
	{ path: path.WORK_ORDER_LIST, component: WorkOrderList },

	{ path: path.BULK_WORK_ORDER, component: BulkWorkOrder },

	{ path: path.BULK_WORK_ORDER_LIST, component: BulkWorkOrderList },


	{ path: path.MATERIAL_ISSUE, component: MaterialIssueMaster },
	{ path: path.MATERIAL_ISSUE_LIST, component: MaterialIssueList },
	{ path: path.MATERIAL_ISSUE_STP, component: WorkOrderList },

	{ path: path.PRODUCTION_MASTER, component: ProductionMaster },
	{ path: path.PRODUCTION_LIST, component: ProductionList },
	{ path: path.PRODUCTION_STP, component: MaterialIssueList },

	{ path: path.PRODUCTION_REISSUE, component: ProductionReIssueAdd },
	{ path: path.PRODUCTION_REISSUE_LIST, component: ProductionReIssueList },
	{ path: path.PRODUCTION_REISSUE_STP, component: ProductionList },


	//******************************* Sale Module ************************************//
	{ path: path.INVOICE_1, component: Invoice, isPartyWisePage: true },
	{ path: path.INVOICE_LIST_1, component: InvoiceList, isPartyWisePage: true },

	{ path: path.FRANCHAISE_INVOICE, component: Franchies_Invoice_Master, isPartyWisePage: true },

	{ path: path.LOADING_SHEET, component: LoadingSheet, isPartyWisePage: true },
	{ path: path.LOADING_SHEET_LIST, component: LoadingSheetList, isPartyWisePage: true },
	{ path: path.LOADING_SHEET_LIST_UPDATE, component: LoadingSheetUpdate, isPartyWisePage: true },

	{ path: path.SALES_RETURN, component: SalesReturn, isPartyWisePage: true },
	{ path: path.SALES_RETURN_LIST, component: SalesReturnList, isPartyWisePage: true },

	{ path: path.BULK_INVOICE, component: Bulk_Invoice, isPartyWisePage: true },


	//************************************** Inter Branch ********************************//
	{ path: path.IB_ORDER, component: Order },
	{ path: path.IB_ORDER_PO_LIST, component: OrderList },

	{ path: path.IB_SALES_ORDER, component: Order },
	{ path: path.IB_ORDER_SO_LIST, component: OrderList },

	{ path: path.INWARD, component: Inward },
	{ path: path.INWARD_LIST, component: InwardList },
	{ path: path.IB_INWARD_STP, component: InvoiceList },

	// { path: path.IB_INVOICE_LIST, component: InvoiceList },
	{ path: path.IB_GRN_LIST, component: GRNList },
	{ path: path.IB_INVOICE_FOR_GRN, component: IBInvoiceList },


	{ path: path.PERIODIC_GRN_REPORT, component: PeriodicGRNReport },




	// { path: path.IB_INVOICE, component: Invoice },
	{ path: path.IB_INVOICE_STP, component: OrderList },

	{ path: path.VDC_INVOICE_LIST, component: IBInvoiceList },
	{ path: path.VDC_INVOICE, component: IBInvoice },


	//********************************Accounting ***********************************//
	{ path: path.RECEIPTS, component: Receipts, isPartyWisePage: true },
	{ path: path.RECEIPTS_LIST, component: ReceiptList, isPartyWisePage: true },

	{ path: path.RECEIPTS_LIST_2, component: PaymentEntryList, isPartyWisePage: true },

	{ path: path.BULK_RECIPT, component: BulkRecipt, isPartyWisePage: true },

	{ path: path.BANK_ASSIGN, component: BankAssign, },//not party wise

	{ path: path.PAYMENT_ENTRY, component: PaymentEntry, isPartyWisePage: true },
	{ path: path.PAYMENT_ENTRY_LIST, component: PaymentEntryList, isPartyWisePage: true },

	// |||||||||||||||||||||||||||||||||||||||||||||||||||

	{ path: path.CREDIT_LIST, component: CreditListAll, isPartyWisePage: true },
	{ path: path.CREDIT_NOTE, component: CreditNoteAdd, isPartyWisePage: true },

	{ path: path.DEBIT_LIST, component: CreditListAll, isPartyWisePage: true },
	{ path: path.DEBIT_NOTE, component: DebitNoteAdd, isPartyWisePage: true },

	{ path: path.GOODS_CREDIT_LIST, component: CreditListAll, isPartyWisePage: true },
	{ path: path.GOODS_CREDIT_NOTE, component: GoodsCredit_GoodsDebitAdd, isPartyWisePage: true },

	{ path: path.GOODS_DEBIT_LIST, component: CreditListAll, isPartyWisePage: true },
	{ path: path.GOODS_DEBIT_NOTE, component: GoodsCredit_GoodsDebitAdd, isPartyWisePage: true },

	{ path: path.CREDIT_NOTE_LIST_1, component: CreditListAll, isPartyWisePage: true },
	{ path: path.CREDIT_NOTE_1, component: CreditNote_1, isPartyWisePage: true },

	{ path: path.CLAIM_TRACKING_ENTRY, component: ClaimTrackingEntry, isPartyWisePage: true },
	{ path: path.CLAIM_TRACKING_ENTRY_LIST, component: ClaimTrackingEntryList, isPartyWisePage: true },

	{ path: path.DAILY_DISPATCH_REPORT, component: DailyDispatchReport, isPartyWisePage: false },




	//**************************** Reports ***********************************//

	{ path: path.SAP_LEDGER, component: SapLedger, isPartyWisePage: true },
	{ path: path.PARTY_LEDGER, component: PartyLedger, isPartyWisePage: true },
	{ path: path.SELF_LEDGER, component: PartyLedger, isPartyWisePage: true },

	// stock report is current report 
	{ path: path.CURRENT_STOCK_REPORT, component: CurrentStockReport },// use self party drop-down

	{ path: path.SNS_REPORT, component: SNSReport },// use self party drop-down

	{ path: path.GENERIC_SALE_REPORT, component: GenericSaleReport },// use self party drop-down

	{ path: path.RETAILER_DATA_REPORT, component: RetailerDataReport },// use self party drop-down

	{ path: path.ORDER_SUMMARY_REPORT, component: OrderSummary },// use self party drop-down

	{ path: path.PURCHASE_GST_REPORT, component: PurchaseGSTReport },// use self party drop-down

	{ path: path.INVOICE_DATA_EXPORT, component: InvoiceDataExport },// use self party drop-down

	{ path: path.PURCHASE_DATA_EXPORT, component: InvoiceDataExport },// use self party drop-down

	{ path: path.DELETE_INVOICE_DATA_EXPORT, component: DeleteInvoiceDataExport },// use self party drop-down

	{ path: path.PRODUCT_MARGIN_REPORT, component: ProductMarginReport },//not party wise

	{ path: path.DAMAGE_STOCK_REPORT, component: DamageStockReport },//current not use in production

	{ path: path.GST_R1_REPORT, component: GSTR1Report, isPartyWisePage: true },

	{ path: path.RETURN_REPORT, component: ReturnReport },// use self party drop-down

	{ path: path.CLAIM_SUMMARY_MASTER, component: ClaimSummaryMaster, isPartyWisePage: true },
	{ path: path.CLAIM_SUMMARY_lIST, component: ClaimSummaryList, isPartyWisePage: true },

	{ path: path.ITEM_SALE_REPORT, component: ItemSaleReport, isPartyWisePage: true },

	{ path: path.MATERIAL_REGISTER_REPORT, component: ItemRegisterReport, isPartyWisePage: true },// use self party drop-down

	{ path: path.CREDIT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.DEBIT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.RECEIPT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.PARTY_OUTSTANDING_REPORT, component: PartyOutstandingReport },// use self party drop-down

	{ path: path.MAN_POWER_REPORT, component: ManPowerReport },//not party wise

	{ path: path.CLAIM_TRACKING_REPORT, component: ClaimTrackingReport },// use self party drop-down

	{ path: path.TCS_AMOUNT_REPORT, component: TCSAmountReport },// use self party drop-down

	{ path: path.CX_DD_DIFFERENCE_REPORT, component: CX_DD_DiffrenceReport },// use self party drop-down

	{ path: path.Css_Item_Sale_Report, component: CssItemSaleReport },

	{ path: path.MANAGER_SUMMARY_REPORT, component: ManagerSummary },



	{ path: path.TARGET_VS_ACHIEVEMENT, component: TargetVSAchievement, isPartyWisePage: false },

	{ path: path.ORDER_ITEM_SUPPLIER_REPORT, component: OrderItemSupplierReport },

	{ path: path.VOUCHER_REDEMPTION_CLAIM_, component: VoucherRedemptionClaim },

	{ path: path.RATE_ADJUSTMENT, component: StockAdjustment, isPartyWisePage: true },


	//******************************* Sweet Pos ************************************//

	{ path: path.POS_ROLE_ACCESS, component: POSRoleAccess },//not party wise

	{ path: path.CASHIER_SUMMARY_REPORT, component: CashierSummary },//not party wise

	{ path: path.ITEM_CONSUMPTION_REPORT, component: ItemConsumption },//not party wise






	{ path: path.SWEET_POS_RATE_MASTER, component: SweetPOSRateMaster },//not party wise


	//******************************* Sweet Pos USER REGESTRATION ************************************//

	{ path: path.POS_USER, component: POSUSER },//not party wise
	{ path: path.POS_USER_lIST, component: POSUserList },//not party wise

	{ path: path.SWEET_POS_MACHINE_MASTER, component: MachineTypeMaster, isPartyWisePage: true },//not party wise

	{ path: path.SWEET_POS_MACHINE_LIST, component: MachineTypeList, isPartyWisePage: true },//not party wise

	{ path: path.STOCK_OUT_REPORT, component: StockOutReport },//not party wise
	// ************************************ Pos_Invoice **************************************//


	{ path: path.POS_INVOICE_LIST, component: SweetPosInvoiceList, isPartyWisePage: true },//not party wise


	// ************************************ Frenchies  **************************************//


	{ path: path.FRENCHIESE_SALE_REPORT, component: FrenchiesSaleReport },//not party wise

	{ path: path.FRANCHAISE_SALE_WITH_BILL_COUNT, component: FranchiseSaleWithBillCount },//not party wise


	{ path: path.DEMAND_VS_SUPPLY_REPORT, component: DemandVSSupply },//not party wise


	{ path: path.GRN_PENDING_REPORT, component: GRNPendingReport },//not party wise


	{ path: path.Bill_Delete_Summary_Report, component: BillDeleteSummaryReport },

	{ path: path.DATA_EXPORT_TO_SAP, component: DataExportToSAP },//not party wise

	{ path: path.GRN_DISCREPANCY_REPORT, component: GRNDiscrepancyReport },//not party wise

	{ path: path.CODE_REDEMPTION_REPORT, component: CodeRedemtionReport },//not party wise


	// ************************************ Sweet And Snacks Report  **************************************//

	{ path: path.BILL_BOOKING_REPORT, component: BillBookingReport },//not party wise

	{ path: path.POS_SALE_SUMMARY_REPORT, component: PosSummarySale },//not party wise


	{ path: path.STOCK_ADJUSTMENT_REPORT, component: StockadjustmentReport },//not party wise



	// ************************************ Utility **************************************//
	{ path: path.PHONE_PAY_SETTING_LIST, component: PhonePaySettingList },
	{ path: path.PHONE_PAY_SETTING, component: PhonePaySetting },


	{ path: path.POS_SERVICE_SETTING_LIST, component: PosServiceSettingList },//not party wise
	{ path: path.POS_SERVICE_SETTING, component: PosServiceSetting },//not party wise



	{ path: path.SYSTEM_SETTING, component: SystemSetting },//not party wise

	{ path: path.SYSTEM_SETTING_LIST, component: SystemSettingList },//not party wise


	{ path: path.SEARCH_BOX2, component: SearchBoxSecond },
	{ path: path.SEARCH_BOX3, component: SerachBox3 },
	{ path: path.TRANSACTION_LOG, component: TransactionLog },
	{ path: path.POS_LOG, component: POS_Log },

	{ path: "/dashboard", component: Dashboard, isPartyWisePage: true },

	{ path: "/", exact: true, component: () => <Redirect to="/login" /> },
	// { component:() => <Redirect to="/login" /> },
	{ path: "/auth-404", component: Error404 },
	{ path: "/auth-500", component: Error500 },



]

const authRoutes = [
	//authencation page

	{ path: "/division", component: SelectDivisionPage },
	{ path: "/logout", component: Logout },
	{ path: "/login", component: Login },
	{ path: "/forgot-password", component: ForgetPwd },
	{ path: "/ResetPassword", component: ResetPassword },
	{ path: "/SendOTP", component: SendOTP },
	{ path: "/EnterOTP", component: EnterOTP },
	{ path: "/pages-404", component: Error404 },


	{ path: '/Daily_Sale_Report/:Party_Id', exact: '/Daily_Sale_Report', component: DailyItemSaleView },
	{ path: '/Customer_Mobile_View/:Mac_ID', exact: '/Customer_Mobile_View/:Mac_ID', component: CustomerMobileView },

	// { component:() => <Redirect to="/login" /> },
	{ path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
