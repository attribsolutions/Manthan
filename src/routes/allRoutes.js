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

import PriceMaster from "../pages/Adminisrator/PriceList/PriceMaster";
import PriceList from "../pages/Adminisrator/PriceList/PriceList";

import MRPMaster from "../pages/Adminisrator/MRPMaster/MRPMaster";
import MarginMaster from "../pages/Adminisrator/MarginMaster/MarginMaster";

import MRPList from "../pages/Adminisrator/MRPMaster/MRPList";
import MarginList from "../pages/Adminisrator/MarginMaster/MarginList";
import TermsAndCondtionsMaster from "../pages/Adminisrator/TermsAndCondtions/TermsAndCondtionsMaster";

import GroupMaster from "../pages/Adminisrator/GroupPage/GroupMaster"
import GroupList from "../pages/Adminisrator/GroupPage/GroupList";
import GroupTypeList from "../pages/Adminisrator/GroupTypePage/GroupTypeList";

import GroupTypeMaster from "../pages/Adminisrator/GroupTypePage/GroupTypeMaster";
import PartySubParty from "../pages/Adminisrator/PartySubPartyPages/PartySubParty";
import PartySubPartyList from "../pages/Adminisrator/PartySubPartyPages/partysubPartyList";

import GSTMaster from "../pages/Adminisrator/GSTPages/GSTMaster";
import GSTList from "../pages/Adminisrator/GSTPages/GSTList";

import TermsAndCondtionsList from "../pages/Adminisrator/TermsAndCondtions/TermsAndCondtionsList";

import Order from "../pages/Purchase/Order/Order"
import OrderList from "../pages/Purchase/Order/OrderList"

import PartyItems from "../pages/Adminisrator/PartyItemPage/PartyItems";


import * as path from "./route_url";

const userRoutes = [

  { path: "/dashboard", component: Dashboard },

  { path: path.MODULE, component: Modules },
  { path: path.MODULE_lIST, component: ModulesList },

  { path: path.COMPANY, component: CompanyModule },
  { path: path.COMPANY_lIST, component: CompanyList },

  { path: path.PAGE_lIST, component: PageList },
  { path: path.PAGE, component: PageMaster },

  { path: path.ORDER, component: Order },
  { path: path.ORDER_lIST, component: OrderList },

  { path: path.USER, component: AddUser },
  { path: path.USER_lIST, component: UserList },

  { path: path.EMPLOYEE, component: AddEmployee },
  { path: path.EMPLOYEE_lIST, component: Employee_List },

  { path: path.ROLE, component: RoleMaster },
  { path: path.ROLE_lIST, component: RoleList },

  { path: path.ITEM, component: ItemsMaster },
  { path: path.ITEM_lIST, component: ItemsList },

  { path: path.PARTY_lIST, component: PartyList },
  { path: path.PARTY, component: PartyMaster },

  { path: path.ROLEACCESS, component: RoleAccessAdd },
  { path: path.ROLEACCESS_lIST, component: RoleAccessListPage },
  { path: `/CopyRoleAccess`, component: RoleAccessCopyFunctionality },

  { path: path.EMPLOYEETYPE, component: EmployeeTypesMaster },
  { path: path.EMPLOYEETYPE_lIST, component: EmployeeTypeList },

  { path: path.PARTYTYPE, component: PartyType },
  { path: path.PARTYTYPE_lIST, component: PartyTypeList },

  { path: path.CATEGORYTYPE, component: CategoryTypeMaster },
  { path: path.CATEGORYTYPE_lIST, component: CategoryTypeList },

  { path: path.CATEGORY, component: CategoryMaster },
  { path: path.CATEGORY_lIST, component: CategoryList },

  { path: "/SubCategoryMaster", component: SubCategoryMaster },
  { path: "/SubCategoryList", component: SubCategoryList },

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

  { path: '/TermsAndCondtionsMaster', component: TermsAndCondtionsMaster },
  { path: '/TermsAndCondtionsList', component: TermsAndCondtionsList },

  { path: path.PRICE_lIST, component: PriceList },
  { path: path.PRICE, component: PriceMaster },

  { path: path.MRP, component: MRPMaster },
  { path: path.MRP_lIST, component: MRPList },

  { path: path.MARGIN, component: MarginMaster },
  { path: path.MARGIN_lIST, component: MarginList },


  { path: path.GROUP, component: GroupMaster },
  { path: path.GROUP_lIST, component: GroupList },

  { path: '/GSTMaster', component: GSTMaster },
  { path: '/GSTList', component: GSTList },

  { path: path.PARTY_SUB_PARTY, component: PartySubParty },
  { path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },

  { path: '/PartyItems', component: PartyItems },


  { path: "/SearchBox2", component: SearchBoxSecond },
  { path: "/SearchBox3", component: SerachBox3 },

  { path: "/", exact: true, component: () => <Redirect to="/Dashboard" /> },
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

  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
