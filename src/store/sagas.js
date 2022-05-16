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
import Alert_Saga from "./Utilites/CostumeAlert/saga"
// import  Module saga
import ModulesSaga from "./Administrator/Modules/saga"
import CompanySaga from "./Administrator/Company/saga"
import SubModuleSaga from "./Administrator/SubModules/saga"
import PageListSaga from "./Administrator/PageMaster/saga"
import HPageSaga from "./Administrator/HPages/saga"
import OrdersSaga from "./Purchase/Orders/saga"


export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(Spinner_Saga),
    fork(Alert_Saga),
    fork(ModulesSaga),
    fork(CompanySaga),
    fork(SubModuleSaga),
    fork(PageListSaga),
    fork(HPageSaga),
    fork(OrdersSaga),

  ])
}
