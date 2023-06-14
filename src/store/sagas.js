import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import ChangePasswordSaga from "./auth/changepassword/saga"


// {/*   *********************** spinner ***********************
import Spinner_Saga from "./Utilites/Spinner/saga"

//    *********************** Alert ***********************
import Alert_Saga from "./Utilites/CustomAlertRedux/saga"
import CustomSearch_Saga from "./Utilites/CustomSearchRedux/saga"
import CommonPageField_Saga from "./Utilites/PageFiled/saga"
import pdfReport_Saga from "./Utilites/PdfReport/saga"

//    *********************** Module ***********************
import ModulesSaga from "./Administrator/ModulesRedux/saga"
import CompanySaga from "./Administrator/CompanyRedux/saga"
import HPageSaga from "./Administrator/HPagesRedux/saga"
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


//    *********************** Purchase ***********************
import OrderPageSaga from "./Purchase/OrderPageRedux/saga"

//    *********************** Inventory ***********************
import GRNSaga from "./Inventory/GRNRedux/saga"
import ChallanSaga from "./Inventory/ChallanRedux/saga"

//    *********************** Prduction ***********************
import BOMSaga from "./Production/BOMRedux/saga"
import WorkOrderSaga from "./Production/WorkOrder/saga"
import MaterialIssueSaga from "./Production/Matrial_Issue/saga"
import ProductionSaga from "./Production/ProductionRedux/saga"
import Production_ReIssueSaga from "./Production/ProductionReissueRedux/saga"

//  *********************** Sale ***********************
import InvoiceSaga from "./Sales/Invoice/saga"
import InwardSaga from "./Inter Branch/InwardRedux/saga"
import CreditLimitSaga from "./Administrator/CreditLimitRedux/saga"
import RouteUpdateSaga from "./Administrator/RouteUpdateRedux/saga"
import LoadingSheetSaga from "./Sales/LoadingSheetRedux/saga"
import ReceiptSaga from "./Accounting/Receipt/saga"
import SalesReturnSaga from "./Sales/SalesReturnRedux/saga"
import CreditDebitSaga from "./Accounting/CreditRedux/saga"
import DashboardSaga from "./Dashboard/Dashboard_1_Redux/saga"
import { sessionAlive_saga } from "./auth/sessionAlive/saga"
import SapLedgerSaga from "./Report/SapLedger Redux/saga"
import OrderSummarySaga from "./Report/OrderSummaryRedux/saga"


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
    fork(Spinner_Saga),
    fork(CustomSearch_Saga),
    fork(CommonPageField_Saga),
    fork(pdfReport_Saga),
    fork(Alert_Saga),
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

  ])
}
