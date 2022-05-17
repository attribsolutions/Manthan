import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Administrator
import SpinnerReducer from './Utilites/Spinner/reducer'
import AlertReducer from './Utilites/CostumeAlert/reducer'
import Modules from './Administrator/Modules/reducer'
import Company from './Administrator/Company/reducer'
import SubModules from "./Administrator/SubModules/reducer"
import PageList from "./Administrator/PageMaster/reducer"
import H_Pages from './Administrator/HPages/reducer'
import OrdersReducers from './Purchase/Orders/reducer'

import User_Registration_Reducer from "./Administrator/UserRegistrationRedux/reducer"

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  SpinnerReducer,
  AlertReducer,
  // Administator
  Modules,
  Company,
  SubModules,
  H_Pages,
  PageList,
  User_Registration_Reducer,
  // Purchase
  OrdersReducers
})

export default rootReducer
