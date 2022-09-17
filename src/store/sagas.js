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

// import  Module saga
import ModulesSaga from "./Administrator/ModulesRedux/saga"
import CompanySaga from "./Administrator/CompanyRedux/saga"
import SubModuleSaga from "./Administrator/SubModulesRedux/saga"
import PageListSaga from "./Administrator/PageMasterRedux/saga"
import HPageSaga from "./Administrator/HPagesRedux/saga"
import OrderPageSaga from "./Purchase/OrderPageRedux/saga"
import UserRegistrationSaga from "./Administrator/UserRegistrationRedux/saga"
import M_EmployeeSaga from "./Administrator/M_EmployeeRedux/saga"
import RoleMaster_Saga from "./Administrator/RoleMasterRedux/saga"
import ItemsMastersSaga from "./Administrator/ItemsRedux/saga"
import PartyMasterSaga from "./Administrator/PartyRedux/saga"
import RoleAccessSaga from "./Administrator/RoleAccessRedux/saga"
import EmployeeTypeSaga from "./Administrator/EmployeeTypeRedux/saga"
import DivisionTypeSaga from "./Administrator/DivisionTypeRedux/saga"
import PartyTypeSaga from "./Administrator/PartyTypeRedux/saga"
import CategoryTypeMasterSaga from "./Administrator/CategoryTypeRedux/saga"
import CategoryMasterSaga from "./Administrator/CategoryRedux/saga"
import SubCategorySaga from "./Administrator/SubCategoryRedux/saga"
import VehicleSaga from "./Administrator/VehicleRedux/saga"
import DriverSaga from "./Administrator/DriverRedux/saga"
import CompanyGroupSaga from "./Administrator/CompanyGroupRedux/saga"

export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(Spinner_Saga),
    fork(CustomSearch_Saga),
    fork(Alert_Saga),
    fork(ModulesSaga),
    fork(CompanySaga),
    fork(SubModuleSaga),
    fork(PageListSaga),
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
    fork(DivisionTypeSaga),
    fork(CategoryTypeMasterSaga),
   fork(CategoryMasterSaga),
   fork(SubCategorySaga),
   fork(VehicleSaga),
   fork(DriverSaga),
   fork(CompanyGroupSaga),

  ])
}
