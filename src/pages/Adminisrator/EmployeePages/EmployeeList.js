import React, { useEffect } from "react";
import {
  getEmployeelist,
  editEmployeeeId,
  deleteEmployeeIDSuccess,
  updateEmployeeIDSuccess,
  delete_Employee_ID,
  PostEmployeeSuccess,
} from "../../../store/Administrator/M_EmployeeRedux/action";
import { useSelector, useDispatch } from "react-redux";
import AddEmployee from "./EmployeeMaster";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import { MetaTags } from "react-meta-tags";

const Employee_List = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.M_EmployeesReducer.employeeList,
      editData: state.M_EmployeesReducer.editData,
      updateMsg: state.M_EmployeesReducer.updateMessage,
      deleteMsg: state.M_EmployeesReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.M_EmployeesReducer.postMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getEmployeelist,
    editId: editEmployeeeId,
    deleteId: delete_Employee_ID,
    postSucc: PostEmployeeSuccess,
    updateSucc: updateEmployeeIDSuccess,
    deleteSucc: deleteEmployeeIDSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.EMPLOYEE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getEmployeelist());
  }, []);

  const { pageField, userAccess = [] } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      <BreadcrumbNew userAccess={userAccess} pageId={pageId.EMPLOYEE_lIST} />
      
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={AddEmployee}
            masterPath={url.EMPLOYEE}
            ButtonMsgLable={"Employee"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default Employee_List;
