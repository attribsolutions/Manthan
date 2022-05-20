import React from "react"
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//Import  Administrator : Modules and ModulesList
import Modules from "../pages/Adminisrator/Modules/Modules";
import ModulesList from "../pages/Adminisrator/Modules/ModulesList";
import CompanyModule from "../pages/Adminisrator/Company/CompanyModule";
import CompanyList from "../pages/Adminisrator/Company/CompanyList";
import SubModules from "../pages/Adminisrator/SubModule/SubModules";
import SubModulesList from "../pages/Adminisrator/SubModule/SubModulesList";
import HPageList from "../pages/Adminisrator/HPages/HPageList";
import HPageMaster from "../pages/Adminisrator/HPages/HPageMaster";
import OrderPage from "../pages/Purchase/Orders/OrderPage";
import OrderList from "../pages/Purchase/Orders/OrderList"
import HorizontalChart from "../pages/ChartJs/HorizontalChart";
import AddUser from "../pages/Adminisrator/UserRegistration/AddUser";
import UserList from "../pages/Adminisrator/UserRegistration/UserList";
import AddEmployee from "../pages/Adminisrator/Employee/AddEmployee";
import Employee_List from "../pages/Adminisrator/Employee/Employee_List";
import AddRole from "../pages/RoleMaster/AddRole";
// import RoleListPage from "../pages/RoleMaster/RoleListPage"
const userRoutes = [

  //dashboard
  { path: "/dashboard", component: Dashboard },

  // Administrator : Modules Path and List
  { path: "/Modules", component: Modules },
  { path: "/modulesList", component: ModulesList },

  { path: "/subModules", component: SubModules },
  { path: "/subModulesList", component: SubModulesList },

  // Administrator : Company Path and List
  { path: "/company", component: CompanyModule },
  { path: "/companyList", component: CompanyList },

  { path: "/HpageList", component: HPageList },
  { path: "/Hpage", component: HPageMaster },
  { path: "/orders", component: OrderPage },
  { path: "/ordersList", component: OrderList },
  { path: "/Hchart", component: HorizontalChart },
  { path: "/AddUser", component: AddUser },
  { path: "/UserList", component: UserList },
  { path: "/AddEmployee", component: AddEmployee },
  { path: "/Employee_List", component: Employee_List },
  { path: "/AddRole", component: AddRole },
  // { path: "/RoleListPage", component: RoleListPage },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

]

const authRoutes = [
  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
]

export { userRoutes, authRoutes }
