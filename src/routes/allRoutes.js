import React from "react"
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//Import  Administrator : Modules and ModulesList
import Modules from "../pages/Adminisrator/ModulesPages/Modules";
import ModulesList from "../pages/Adminisrator/ModulesPages/ModulesList";
import CompanyModule from "../pages/Adminisrator/CompanyPages/CompanyModule";
import CompanyList from "../pages/Adminisrator/CompanyPages/CompanyList";
import SubModules from "../pages/Adminisrator/SubModulePages/SubModules";
import SubModulesList from "../pages/Adminisrator/SubModulePages/SubModulesList";
import HPageList from "../pages/Adminisrator/HPagesPages/HPageList";
import HPageMaster from "../pages/Adminisrator/HPagesPages/HPageMaster";
import OrderPage from "../pages/Purchase/Orders/OrderPage";
import OrderList from "../pages/Purchase/Orders/OrderList"
import AddUser from "../pages/Adminisrator/UserRegistrationPages/AddUser";
import UserList from "../pages/Adminisrator/UserRegistrationPages/UserList";
import AddEmployee from "../pages/Adminisrator/EmployeePages/AddEmployee";
import Employee_List from "../pages/Adminisrator/EmployeePages/Employee_List";
import RoleMaster from "../pages/Adminisrator/RoleMasterPages/RoleMaster";
import RoleList from "../pages/Adminisrator/RoleMasterPages/RoleList"
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

const userRoutes = [

  //dashboard
  { path: "/dashboard", component: Dashboard },

  // Administrator : Modules Path and List
  { path: "/modulemaster", component: Modules },
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

  { path: "/AddUser", component: AddUser },
  { path: "/UserList", component: UserList },

  { path: "/AddEmployee", component: AddEmployee },
  { path: "/Employee_List", component: Employee_List },

  { path: "/RoleMaster", component: RoleMaster },
  { path: "/RoleList", component: RoleList },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

]

const authRoutes = [
  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },


  { path: "/pages-404", component: Error404 },
  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
