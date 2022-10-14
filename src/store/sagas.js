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
import SubCategorySaga from "./Administrator/SubCategoryRedux/saga"
import VehicleSaga from "./Administrator/VehicleRedux/saga"
import DriverSaga from "./Administrator/DriverRedux/saga"
import CompanyGroupSaga from "./Administrator/CompanyGroupRedux/saga"
import PriceListSaga from "./Administrator/PriceList/saga"
import MRPMasterSaga from "./Administrator/MRPMasterRedux/saga"
import MarginMasterSaga from "./Administrator/MarginMasterRedux/saga"
import TermsAndCondtionsSaga from "./Administrator/TermsAndCondtionsRedux/saga"
import GroupTypeSaga from "./Administrator/GroupTypeRedux/saga"
import GSTSaga from "./Administrator/GSTRedux/saga"
 import PartySubPartysaga from "./Administrator/PartySubPartyRedux/saga"

export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(Spinner_Saga),
    fork(CustomSearch_Saga),
    fork(CommonPageField_Saga),
    fork(Alert_Saga),


    fork(ModulesSaga),
    fork(CompanySaga),
    fork(HPageSaga),
    fork(OrderPageSaga),
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
    fork(SubCategorySaga),
    fork(VehicleSaga),
    fork(DriverSaga),
    fork(CompanyGroupSaga),
    fork(PriceListSaga),
    fork(MRPMasterSaga),
    fork(MarginMasterSaga),
    fork(TermsAndCondtionsSaga),
    fork(GroupTypeSaga),
    fork(GSTSaga),
     fork(PartySubPartysaga),
  ])
}
