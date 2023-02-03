import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
//Import spinner
import Spinner_Saga from "./Utilites/Spinner/saga"
//import AlertSagas 
import Alert_Saga from "./Utilites/CustomAlertRedux/saga"
import CustomSearch_Saga from "./Utilites/CustomSearchRedux/saga"
import CommonPageField_Saga from "./Utilites/PageFiled/saga"
import pdfReport_Saga from "./Utilites/PdfReport/saga"

// import  Module saga
import ModulesSaga from "./Administrator/ModulesRedux/saga"
import CompanySaga from "./Administrator/CompanyRedux/saga"
import HPageSaga from "./Administrator/HPagesRedux/saga"
import OrderPageSaga from "./Purchase/OrderPageRedux/saga"
import UserRegistrationSaga from "./Administrator/UserRegistrationRedux/saga"
import M_EmployeeSaga from "./Administrator/M_EmployeeRedux/saga"
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
import GRNSaga from "./Purchase/GRNRedux/saga"
import BOMSaga from "./Purchase/BOMRedux/saga"
import WorkOrderSaga from "./Purchase/WorkOrder/saga"
import MaterialIssueSaga from "./Purchase/Matrial_Issue/saga"
import ProductionSaga from "./Purchase/ProductionRedux/saga"
import Breadcrumb_Saga from "./Utilites/Breadcrumb/saga"
import InvoiceSaga from "./Sales/Invoice/saga"
import DemandSaga from "./Inter Branch/DemandRedux/saga"
import InwardSaga from "./Inter Branch/InwardRedux/saga"
import ChallanSaga from "./Inter Branch/IB_Invoice_Redux/saga"

export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(Spinner_Saga),
    fork(CustomSearch_Saga),
    fork(Breadcrumb_Saga),
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
    fork(GroupTypeSaga),
    fork(GroupSaga),
    fork(SubGroupSaga),
    fork(GeneralSaga),
    fork(GSTSaga),
    fork(PartySubPartysaga),
    fork(PartyItemssaga),
    fork(BOMSaga),
    fork(WorkOrderSaga),
    fork(MaterialIssueSaga),
    fork(ProductionSaga),
    fork(DemandSaga),
    fork(InvoiceSaga),
    fork(InwardSaga),
    fork(ChallanSaga)
  ])
}
