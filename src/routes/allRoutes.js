import React from "react"
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
// import SubModules from "../pages/Adminisrator/SubModulePages/SubModules";
// import SubModulesList from "../pages/Adminisrator/SubModulePages/SubModulesList";
import PageList from "../pages/Adminisrator/Page-Pages/PageList";
import PageMaster from "../pages/Adminisrator/Page-Pages/PageMaster";
import OrderPage from "../pages/Order/OrderPage";
import OrderList from "../pages/Order/OrderList"
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
import PartyList from "../pages/Adminisrator/PartyPages/PartyList";
import PartyMaster from "../pages/Adminisrator/PartyPages/PartyMaster";

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
import SubCategoryMaster from "../pages/Adminisrator/SubCategoryPages/SubCategoryMaster";
import SubCategoryList from "../pages/Adminisrator/SubCategoryPages/SubCategoryList";
import VehicleMaster from "../pages/Adminisrator/VehiclePages/VehicleMaster";
import VehicleList from "../pages/Adminisrator/VehiclePages/VehicleList";
import DriverMaster from "../pages/Adminisrator/DriverPage/DriverMaster";
import DriverList from "../pages/Adminisrator/DriverPage/DriverList";
import CompanyGroupMaster from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupMaster";
import CompanyGroupList from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupList";
import PageMasterTab from "../pages/Adminisrator/Page-Pages/PageMasterTab";

// import PartyMasterTab from "../pages/Adminisrator/PartyTab/PartyMasterTab";

import PriceMaster from "../pages/Adminisrator/PriceList/PriceMaster";
import PriceList from "../pages/Adminisrator/PriceList/PriceList";

import MRPMaster from "../pages/Adminisrator/MRPMaster/MRPMaster";
import MarginMaster from "../pages/Adminisrator/MarginMaster/MarginMaster";

import MRPList from "../pages/Adminisrator/MRPMaster/MRPList";
import MarginList from "../pages/Adminisrator/MarginMaster/MarginList";
import TermsAndCondtionsMaster from "../pages/Adminisrator/TermsAndCondtions/TermsAndCondtionsMaster";

import GroupList from "../pages/Adminisrator/GroupPage/GroupList";
import GroupTypeList from "../pages/Adminisrator/GroupTypePage/GroupTypeList";
import GroupTypeMaster from "../pages/Adminisrator/GroupTypePage/GroupTypeMaster";

import EditTabaleTable from "../pages/Adminisrator/DriverPage/editabale table";
import {
  COMPANY, COMPANY_lIST,
  COMPANYGROUP, COMPANYGROUP_lIST,
  DRIVER, DRIVER_lIST,
  MODULE, MODULE_lIST,
  USER, USER_lIST,
  EMPLOYEE_lIST, EMPLOYEE,
  ROLE_lIST, ROLE,
  ITEM_lIST, ITEM,
  PARTY_lIST, PARTY,
  ROLEACCESS_lIST, ROLEACCESS,
  EMPLOYEETYPE_lIST, EMPLOYEETYPE,
  CATEGORYTYPE_lIST, CATEGORYTYPE,
  PARTYTYPE_lIST, PARTYTYPE,
  CATEGORY_lIST, CATEGORY,
  VEHICLE, VEHICLE_lIST,
  GROUPTYPE_lIST, GROUPTYPE,
  PRICE_lIST, PRICE,
  MRP_lIST, MRP,
  MARGIN_lIST, MARGIN,
  PAGE_lIST, PAGE,
  GROUP_lIST,
  ORDER_lIST,ORDER,



} from "./route_url";


// import Index from "../pages/Adminisrator/customValidation/index";



// import AddItemMaster from "../pages/Adminisrator/MasterPages/AddItemMaster";

const userRoutes = [

  //dashboard
  { path: "/dashboard", component: Dashboard },

  // Administrator : Modules Path and List
  // { path: `/${btoa("ModuleMaster")}`, component: Modules },
  // { path: `/${btoa("ModuleList")}`, component: ModulesList },

  // { path: "/subModuleMaster", component: SubModules },
  // { path: "/subModuleList", component: SubModulesList },

  // // Administrator : Company Path and List
  // { path: `/${btoa("CompanyMaster")}`, component: CompanyModule },
  // { path: `/${btoa("CompanyList")}`, component: CompanyList },

  // { path: `/${btoa("PageList")}`, component: HPageList },
  // { path: `/${btoa("PageMaster")}`, component: HPageMaster },

  // { path: `/${btoa("Order")}`, component: OrderPage },
  // { path:`/${btoa("Orders")}`, component: OrderList },

  // { path: `/${btoa("UserMaster")}`, component: AddUser },
  // { path: `/${btoa("UserList")}`, component: UserList },

  // { path: `/${btoa("EmployeeMaster")}`, component: AddEmployee },
  // { path: `/${btoa("EmployeeList")}`, component: Employee_List },

  // { path: `/${btoa("RoleMaster")}`, component: RoleMaster },
  // { path: `/${btoa("RoleList")}`, component: RoleList },

  // { path: `/${btoa("ItemMaster")}`, component: ItemsMaster },
  // { path: `/${btoa("ItemList")}`, component: ItemsList },

  // { path: `/${btoa("PartyList")}`, component: PartyList },
  // { path: `/${btoa("PartyMaster")}`, component: PartyMaster },

  // { path: `/${btoa("RoleAccess")}`, component: RoleAccessList },
  // { path: "/RoleAccess", component: RoleAccessList },




  { path: MODULE, component: Modules },
  { path: MODULE_lIST, component: ModulesList },

  // { path: "/subModuleMaster", component: SubModules },
  // { path: "/subModuleList", component: SubModulesList },

  // Administrator : Company Path and List
  { path: COMPANY, component: CompanyModule },
  { path: COMPANY_lIST, component: CompanyList },

  { path: PAGE_lIST, component: PageList },
  { path: PAGE, component: PageMaster },
  { path: '/PageMasterTab', component: PageMasterTab },

  { path: ORDER, component: OrderPage },
  { path: ORDER_lIST,component: OrderList },

  { path: USER, component: AddUser },
  { path: USER_lIST, component: UserList },

  { path: EMPLOYEE, component: AddEmployee },
  { path: EMPLOYEE_lIST, component: Employee_List },

  { path: ROLE, component: RoleMaster },
  { path: ROLE_lIST, component: RoleList },

  { path: ITEM, component: ItemsMaster },
  { path: ITEM_lIST, component: ItemsList },

  { path: PARTY_lIST, component: PartyList },
  { path: PARTY, component: PartyMaster },

  { path: ROLEACCESS, component: RoleAccessAdd },
  { path: ROLEACCESS_lIST, component: RoleAccessListPage },
  { path: `/CopyRoleAccess`, component: RoleAccessCopyFunctionality },

  { path: EMPLOYEETYPE, component: EmployeeTypesMaster },
  { path: EMPLOYEETYPE_lIST, component: EmployeeTypeList },

  { path: PARTYTYPE, component: PartyType },
  { path: PARTYTYPE_lIST, component: PartyTypeList },

  { path: CATEGORYTYPE, component: CategoryTypeMaster },
  { path: CATEGORYTYPE_lIST, component: CategoryTypeList },

  { path: CATEGORY, component: CategoryMaster },
  { path: CATEGORY_lIST, component: CategoryList },

  { path: "/SubCategoryMaster", component: SubCategoryMaster },
  { path: "/SubCategoryList", component: SubCategoryList },

  { path: VEHICLE, component: VehicleMaster },
  { path: VEHICLE_lIST, component: VehicleList },

  { path: DRIVER, component: DriverMaster },
  { path: DRIVER_lIST, component: DriverList },
  { path: "/editTable", component: EditTabaleTable },

  { path: COMPANYGROUP, component: CompanyGroupMaster },
  { path: COMPANYGROUP_lIST, component: CompanyGroupList },

  { path: GROUPTYPE, component: GroupTypeMaster },
  { path: GROUPTYPE_lIST, component: GroupTypeList },

  { path: '/TermsAndCondtionsMaster', component: TermsAndCondtionsMaster },


  // { path: "/PartyMasterTab", component: PartyMasterTab },

  { path: PRICE_lIST, component: PriceList },
  // { path: "/PriceList", component: PartyMasterTab },
  { path: PRICE, component: PriceMaster },
  { path: MRP, component: MRPMaster },
  { path: MRP_lIST, component: MRPList },
  { path: MARGIN, component: MarginMaster },
  { path: MARGIN_lIST, component: MarginList },
  { path: GROUP_lIST, component: GroupList },


  // { path: "/AddItemMaster", component: AddItemMaster },
  { path: "/SearchBox2", component: SearchBoxSecond },
  { path: "/SearchBox3", component: SerachBox3 },
  // { path: "/valid", component: Index },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/Dashboard" /> },

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
  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
