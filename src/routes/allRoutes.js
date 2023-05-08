import React from "react"
import * as path from "./route_url";
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//Import  Administrator : Modules and ModulesListItem
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
import PartyItemsList from "../pages/Adminisrator/PartyItemPage/PartyItemList";

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
import LoadingSheet from "../pages/Sale/Invoice/LoadingSheet/LoadingSheet";
import LoadingSheetList from "../pages/Sale/Invoice/LoadingSheet/LoadingSheetList";
import CreditLimitMaster from "../pages/Adminisrator/CreditPages/CreditLimitMaster";
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
import LoadingSheetUpdate from "../pages/Sale/Invoice/LoadingSheet/LoadingSheetUpdate";
import SalesReturn from "../pages/Sale/Invoice/SalesReturn/SalesReturn";
import Credit from "../pages/Accounting/CreditDebitNote/Credit";
import CreditList from "../pages/Accounting/CreditDebitNote/CreditList";

import ImportFieldAdd from "../pages/Adminisrator/ImportMaster/FieldAdd/ImportFieldAdd";
import ImportFieldAddList from "../pages/Adminisrator/ImportMaster/FieldAdd/ImportFieldAddList";
import ImportExcelFieldMap from "../pages/Adminisrator/ImportMaster/ImportExcelFieldMap/ImportExcelFieldMap";
import UploadExcel from "../pages/Adminisrator/ImportMaster/ExcelUpload/UploadExcel";

import SalesReturnList from "../pages/Sale/Invoice/SalesReturn/SalesReturnList";
import ImportMasterMap from "../pages/Adminisrator/ImportMaster/ImportMasterMap/ImportMasterMap";
import Debit from "../pages/Accounting/Debit/Debit";
import Dashboard_1 from "../pages/Dashboard/Dashboard_1/Dashboard_1"


const userRoutes = [
  // *************************** DashBord *******************************//

  { path: path.DASHBORD, component: Dashboard },

  { path: path.DASHBORD_1, component: Dashboard_1 },
  // *************************** Administration *******************************//
  { path: path.MODULE, component: Modules },
  { path: path.MODULE_lIST, component: ModulesList },

  { path: path.COMPANY, component: CompanyModule },
  { path: path.COMPANY_lIST, component: CompanyList },

  { path: path.PAGE_lIST, component: PageList },
  { path: path.PAGE, component: PageMaster },

  { path: path.USER, component: AddUser },
  { path: path.USER_lIST, component: UserList },

  { path: path.ROLEACCESS, component: RoleAccessAdd },
  { path: path.ROLEACCESS_lIST, component: RoleAccessListPage },
  { path: path.COPY_ROLEACCESS, component: RoleAccessCopyFunctionality },

  { path: path.ROLE, component: RoleMaster },
  { path: path.ROLE_lIST, component: RoleList },

  // ******************************* Master Module ******************************//

  { path: path.EMPLOYEE, component: AddEmployee },
  { path: path.EMPLOYEE_lIST, component: Employee_List },

  { path: path.ITEM, component: ItemsMaster },
  { path: path.ITEM_lIST, component: ItemsList },

  { path: path.PARTY_lIST, component: PartyList },
  { path: path.PARTY, component: PartyMaster },

  { path: path.EMPLOYEETYPE, component: EmployeeTypesMaster },
  { path: path.EMPLOYEETYPE_lIST, component: EmployeeTypeList },

  { path: path.PARTYTYPE, component: PartyType },
  { path: path.PARTYTYPE_lIST, component: PartyTypeList },

  { path: path.CATEGORYTYPE, component: CategoryTypeMaster },
  { path: path.CATEGORYTYPE_lIST, component: CategoryTypeList },

  { path: path.CATEGORY, component: CategoryMaster },
  { path: path.CATEGORY_lIST, component: CategoryList },

  { path: path.VEHICLE, component: VehicleMaster },
  { path: path.VEHICLE_lIST, component: VehicleList },

  { path: path.DRIVER, component: DriverMaster },
  { path: path.DRIVER_lIST, component: DriverList },

  { path: path.COMPANYGROUP, component: CompanyGroupMaster },
  { path: path.COMPANYGROUP_lIST, component: CompanyGroupList },

  { path: path.GROUPTYPE, component: GroupTypeMaster },
  { path: path.GROUPTYPE_lIST, component: GroupTypeList },

  { path: path.PARTY_SUB_PARTY, component: PartySubParty },
  { path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },

  { path: path.TERMS_AND_CONDITION, component: TermsAndConditionsMaster },
  { path: path.TERMS_AND_CONDITION_LIST, component: TermsAndConditionsList },

  { path: path.PRICE_lIST, component: PriceList },
  { path: path.PRICE, component: PriceMaster },

  { path: path.MRP, component: MRPMaster },
  { path: path.MRP_lIST, component: MRPList },

  { path: path.MARGIN, component: MarginMaster },
  { path: path.MARGIN_lIST, component: MarginList },

  { path: path.GROUP, component: GroupMaster },
  { path: path.GROUP_lIST, component: GroupList },

  { path: path.GST, component: GSTMaster },
  { path: path.GST_LIST, component: GSTList },

  { path: path.PARTY_SUB_PARTY, component: PartySubParty },
  { path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },


  { path: path.PARTYITEM, component: PartyItems },
  { path: path.PARTYITEM_LIST, component: PartyItemsList },

  { path: path.SUBGROUP, component: SubGroupMaster },
  { path: path.SUBGROUP_LIST, component: SubGroupList },

  { path: path.GENERAL, component: GeneralMaster },
  { path: path.GENERAL_LIST, component: GeneralList },

  { path: path.ROUTES, component: RoutesMaster },
  { path: path.ROUTES_LIST, component: RoutesList },

  { path: path.SALESMAN, component: SalesManMaster },
  { path: path.SALESMAN_LIST, component: SalesManList },

  { path: path.CREDITLIMIT, component: CreditLimitMaster },
  // { path: path.CREDITLIMIT_LIST, component: CreditLimitList },

  { path: path.UPLOAD_EXCEL, component: UploadExcel },

  { path: path.IMPORT_EXCEL_FIELD_MAP_add, component: ImportExcelFieldMap },
  { path: path.IMPORT_FIELD_ADD, component: ImportFieldAdd },
  { path: path.IMPORT_FIELD_ADD_LIST, component: ImportFieldAddList },

  { path: path.IMPORT_FIELD_MASTER, component: ImportMasterMap },

  { path: path.ROUTE_UPDATE, component: RouteUpdate },
  { path: path.PARTY_MASTER_BULK_UPDATE, component: PartyMasterBulkUpdate },

  { path: path.MANAGEMENT_PARTIES, component: ManagementEmpParties },

  { path: path.BANK, component: BankMaster },
  { path: path.BANK_LIST, component: BankList },



  //******************************* Inventory Module ************************************//
  { path: path.CHALLAN_LIST, component: ChallanList },
  { path: path.CHALLAN, component: Challan },

  { path: path.GRN_LIST_1, component: GRNList },
  { path: path.GRN_ADD_1, component: GRNAdd },
  { path: path.GRN_STP_1, component: OrderList },

  { path: path.GRN_LIST_3, component: GRNList },
  { path: path.GRN_ADD_3, component: GRNAdd3 },
  { path: path.GRN_STP_3, component: OrderList },

  // { path: path.GRN_ADD_PAGE_3, component: GRNAdd_3 },


  //******************************* Purchase Module ************************************//

  { path: path.ORDER_1, component: Order },
  { path: path.ORDER_LIST_1, component: OrderList },

  { path: path.ORDER_2, component: Order },
  { path: path.ORDER_LIST_2, component: OrderList },

  { path: path.ORDER_4, component: Order },
  { path: path.ORDER_LIST_4, component: OrderList },

  //******************************* All Report ************************************//
  { path: path.REPORT, component: Report },

  //******************************* PRODUCTION  Module ************************************//
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

  //******************************* Sale  Module ************************************//

  { path: path.INVOICE_1, component: Invoice },
  { path: path.INVOICE_LIST_1, component: InvoiceList },

  { path: path.LOADING_SHEET, component: LoadingSheet },
  { path: path.LOADING_SHEET_LIST, component: LoadingSheetList },
  { path: path.LOADING_SHEET_LIST_UPDATE, component: LoadingSheetUpdate },

  { path: path.SALES_RETURN, component: SalesReturn },
  { path: path.SALES_RETURN_LIST, component: SalesReturnList },
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
  { path: path.RECEIPTS, component: Receipts },
  { path: path.RECEIPTS_LIST, component: ReceiptList },

  { path: path.RECEIPTS_LIST_2, component: PaymentEntryList },

  { path: path.BULK_RECIPT, component: BulkRecipt },

  { path: path.BANK_ASSIGN, component: BankAssign },

  { path: path.PAYMENT_ENTRY, component: PaymentEntry },
  { path: path.PAYMENT_ENTRY_LIST, component: PaymentEntryList },

  { path: path.CREDIT_LIST, component: CreditList },
  { path: path.DEBIT_LIST, component: CreditList },

  { path: path.CREDIT, component: Credit },
  { path: path.DEBIT, component: Debit },

  // ************************************ Utility **************************************//
  { path: path.SEARCH_BOX2, component: SearchBoxSecond },
  { path: path.SEARCH_BOX3, component: SerachBox3 },

  { path: "/dashboard", component: Dashboard },

  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
  // { component:() => <Redirect to="/login" /> },
  { path: "/auth-404", component: Error404 },
  { path: "/auth-500", component: Error500 },

]

const authRoutes = [
  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/ResetPassword", component: ResetPassword },
  { path: "/SendOTP", component: SendOTP },
  { path: "/EnterOTP", component: EnterOTP },
  { path: "/division", component: SelectDivisionPage },
  { path: "/pages-404", component: Error404 },
  // { component:() => <Redirect to="/login" /> },
  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
