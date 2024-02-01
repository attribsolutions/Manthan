import React from "react"
import * as path from "./route_url";
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

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
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";
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

import GroupTypeMaster from "../pages/Adminisrator/GroupTypePage/GroupTypeMaster";
import PartySubParty from "../pages/Adminisrator/PartySubPartyPages/PartySubParty";
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
import GRNAdd from "../pages/Inventory/GRN/GRNAdd";
import GRNAdd3 from "../pages/Inventory/GRN/GRNAdd_3";

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
import ChallanList from "../pages/Inventory/Challan/ChallanList";
import Challan from "../pages/Inventory/Challan/Challan";

import RoutesMaster from "../pages/Adminisrator/RoutesPages/RoutesMaster";
import RoutesList from "../pages/Adminisrator/RoutesPages/RoutesList";

import SalesManMaster from "../pages/Adminisrator/SalesManPages/SalesManMaster";
import SalesManList from "../pages/Adminisrator/SalesManPages/SalesManList";
import LoadingSheet from "../pages/Sale/LoadingSheet/LoadingSheet";
import LoadingSheetList from "../pages/Sale/LoadingSheet/LoadingSheetList";

import Report from "../Reports/AllReportPage";
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
import StockReport from "../Reports/StockReport/StockReport";
import PurchaseReturnMode3 from "../pages/Purchase/Return/PurchaseReturnMode3";
import DiscountMaster from "../pages/Adminisrator/Discount/DiscountMaster";
import GenericSaleReport from "../Reports/GenericSaleReport/GenericSaleReport";
import RetailerDataReport from "../Reports/RetailerDataReport/RetailerDataReport";
import DiscountList from "../pages/Adminisrator/Discount/DiscountList";
import PurchaseReturn from "../pages/Purchase/Return/PurchaseReturn";
import StockReport_1 from "../Reports/StockReport/StockReport_1";
import ClaimSummary from "../Reports/ClaimReportSummary/ClaimReport";
import InvoiceDataExport from "../Reports/InvoiceDataExport/InvoiceDataExport.js";
import PurchaseGSTReport from "../Reports/PurchaseGSTReport/PurchaseGSTReport.js";
import DamageStockReport from "../Reports/DamageStockReport";
import DeleteInvoiceDataExport from "../Reports/DeleteInvoiceDataExport";
import GSTR1Report from "../Reports/GSTR1Report/GSTR1Report";
import ReturnReport from "../Reports/ReturnReport/ReturnReport";

import ItemSaleReport from "../Reports/ItemSaleReport";

import ItemRegisterReport from "../Reports/ItemRegisterReport/ItemRegisterReport";
import ClaimSummaryList from "../Reports/ClaimReportSummary/ClaimSummaryList";
import ClaimSummaryMaster from "../Reports/ClaimReportSummary/ClaimSummaryMaster";

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
import CX_DD_DiffrenceReport from "../Reports/CX_DD_DiffrenceReport";
import Bulk_Invoice from "../pages/Sale/Bulk_Invoice/index";
import POSRoleAccess from "../pages/SweetPOS/Adminstration/POSRoleAccess.js";
import SystemSetting from "../pages/Utility/SystemSetting/SystemSetting.js";
import SystemSettingList from "../pages/Utility/SystemSetting/SystemSettingList.js";


const userRoutes = [
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

	{ path: path.PARTY_lIST, component: PartyList },//not party wise
	{ path: path.PARTY, component: PartyMaster },//not party wise

	{ path: path.RETAILER_LIST, component: PartyList, isPartyWisePage: true },
	{ path: path.RETAILER_MASTER, component: PartyMaster, isPartyWisePage: true },

	{ path: path.NON_RETAILER_PARTY_lIST, component: PartyList, isPartyWisePage: true },
	{ path: path.NON_RETAILER_PARTY, component: PartyMaster, isPartyWisePage: true },

	{ path: path.PARTY_SELF_EDIT, component: PartyMaster },//not party wise

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

	{ path: path.MARGIN, component: MarginMaster },//not party wise
	{ path: path.MARGIN_lIST, component: MarginList },//not party wise

	{ path: path.GROUP, component: GroupMaster },//not party wise
	{ path: path.GROUP_lIST, component: GroupList },//not party wise

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
	{ path: path.ROUTE_UPDATE, component: RouteUpdate },//not party wise

	{ path: path.SALESMAN, component: SalesManMaster, isPartyWisePage: true },
	{ path: path.SALESMAN_LIST, component: SalesManList, isPartyWisePage: true },

	{ path: path.CITY, component: CityMaster },//not party wise
	{ path: path.CITY_LIST, component: CityList },//not party wise

	{ path: path.INVOICE_EXCEL_UPLOAD, component: InvoiceExcelUpload, isPartyWisePage: true },
	{ path: path.RETAILER_EXCEL_UPLOAD, component: RetailerExcelUpload, isPartyWisePage: true },

	{ path: path.IMPORT_EXCEL_FIELD_MAP, component: ImportExcelFieldMap, isPartyWisePage: true },
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

	{ path: path.RETAILER_APPROVAL, component: RetailerApprovalList },

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

	{ path: path.ITEM_IMAGE_UPLOAD, component: ItemImageUpload },//not party wise



	//******************************* Inventory Module ************************************//
	{ path: path.CHALLAN_LIST, component: ChallanList },
	{ path: path.CHALLAN, component: Challan },

	{ path: path.GRN_LIST_1, component: GRNList, isPartyWisePage: true },
	{ path: path.GRN_ADD_1, component: GRNAdd, isPartyWisePage: true },
	{ path: path.GRN_STP_1, component: OrderList, isPartyWisePage: true },

	{ path: path.GRN_LIST_3, component: GRNList, isPartyWisePage: true },
	{ path: path.GRN_ADD_3, component: GRNAdd3, isPartyWisePage: true },
	{ path: path.GRN_STP_3, component: OrderList, isPartyWisePage: true },

	{ path: path.STOCK_ENTRY, component: StockEntry, isPartyWisePage: true },

	{ path: path.STOCK_ADJUSTMENT, component: StockAdjustment, isPartyWisePage: true },

	{ path: path.STOCK_ADJUSTMENT_MODE_2, component: StockAdjustment, isPartyWisePage: true },

	//******************************* Purchase Module ************************************//

	{ path: path.ORDER_1, component: Order, isPartyWisePage: true },
	{ path: path.ORDER_LIST_1, component: OrderList, isPartyWisePage: true },

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

	{ path: path.LOADING_SHEET, component: LoadingSheet, isPartyWisePage: true },
	{ path: path.LOADING_SHEET_LIST, component: LoadingSheetList, isPartyWisePage: true },
	{ path: path.LOADING_SHEET_LIST_UPDATE, component: LoadingSheetUpdate, isPartyWisePage: true },

	{ path: path.SALES_RETURN, component: SalesReturn, isPartyWisePage: true },
	{ path: path.SALES_RETURN_LIST, component: SalesReturnList, isPartyWisePage: true },

	{ path: path.BULK_INVOICE, component: Bulk_Invoice, isPartyWisePage: true },


	//************************************** Inter Branch ********************************//
	{ path: path.IB_ORDER, component: Order },
	{ path: path.IB_ORDER_PO_LIST, component: OrderList },
	{ path: path.IB_ORDER_SO_LIST, component: OrderList },

	{ path: path.INWARD, component: Inward },
	{ path: path.INWARD_LIST, component: InwardList },
	{ path: path.IB_INWARD_STP, component: InvoiceList },

	{ path: path.IB_INVOICE_LIST, component: InvoiceList },
	{ path: path.IB_GRN_LIST, component: InvoiceList },
	{ path: path.IB_INVOICE, component: Invoice },
	{ path: path.IB_INVOICE_STP, component: OrderList },



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


	//**************************** Reports ***********************************//

	{ path: path.SAP_LEDGER, component: SapLedger, isPartyWisePage: true },
	{ path: path.PARTY_LEDGER, component: PartyLedger, isPartyWisePage: true },
	{ path: path.SELF_LEDGER, component: PartyLedger, isPartyWisePage: true },

	// stock report is current report 
	{ path: path.STOCK_REPORT, component: StockReport },// use self party drop-down
	// stock StockReport_1 is SNSstock report 
	{ path: path.STOCK_REPORT_1, component: StockReport_1 },// use self party drop-down

	{ path: path.GENERIC_SALE_REPORT, component: GenericSaleReport },// use self party drop-down

	{ path: path.RETAILER_DATA_REPORT, component: RetailerDataReport },// use self party drop-down

	{ path: path.ORDER_SUMMARY_REPORT, component: OrderSummary },// use self party drop-down

	{ path: path.CLAIM_SUMMARY_REPORT, component: ClaimSummary, isPartyWisePage: true },

	{ path: path.PURCHASE_GST_REPORT, component: PurchaseGSTReport },// use self party drop-down

	{ path: path.INVOICE_DATA_EXPORT, component: InvoiceDataExport },// use self party drop-down

	{ path: path.PURCHASE_DATA_EXPORT, component: InvoiceDataExport },// use self party drop-down

	{ path: path.DELETE_INVOICE_DATA_EXPORT, component: DeleteInvoiceDataExport },// use self party drop-down

	{ path: path.REPORT, component: Report },//current not use in production

	{ path: path.PRODUCT_MARGIN_REPORT, component: ProductMarginReport },//not party wise

	{ path: path.DAMAGE_STOCK_REPORT, component: DamageStockReport },//current not use in production

	{ path: path.GST_R1_REPORT, component: GSTR1Report, isPartyWisePage: true },

	{ path: path.RETURN_REPORT, component: ReturnReport },// use self party drop-down

	{ path: path.CLAIM_SUMMARY_MASTER, component: ClaimSummaryMaster, isPartyWisePage: true },
	{ path: path.CLAIM_SUMMARY_lIST, component: ClaimSummaryList, isPartyWisePage: true },

	{ path: path.ITEM_SALE_REPORT, component: ItemSaleReport, isPartyWisePage: true },

	{ path: path.ITEM_REGISTER_REPORT, component: ItemRegisterReport },// use self party drop-down

	{ path: path.CREDIT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.DEBIT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.RECEIPT_DATA_EXPORT, component: CreditDebitDataExport },// use self party drop-down

	{ path: path.PARTY_OUTSTANDING_REPORT, component: PartyOutstandingReport },// use self party drop-down

	{ path: path.MAN_POWER_REPORT, component: ManPowerReport },//not party wise

	{ path: path.CLAIM_TRACKING_REPORT, component: ClaimTrackingReport },// use self party drop-down

	{ path: path.TCS_AMOUNT_REPORT, component: TCSAmountReport },// use self party drop-down

	{ path: path.CX_DD_DIFFERENCE_REPORT, component: CX_DD_DiffrenceReport },// use self party drop-down



	//******************************* Sweet Pos ************************************//

	{ path: path.POS_ROLE_ACCESS, component: POSRoleAccess },//not party wise

	// ************************************ Utility **************************************//

	{ path: path.SYSTEM_SETTING, component: SystemSetting },//not party wise

	{ path: path.SYSTEM_SETTING_LIST, component: SystemSettingList },//not party wise







	{ path: path.SEARCH_BOX2, component: SearchBoxSecond },
	{ path: path.SEARCH_BOX3, component: SerachBox3 },
	{ path: path.TRANSACTION_LOG, component: TransactionLog },

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
	// { component:() => <Redirect to="/login" /> },
	{ path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
