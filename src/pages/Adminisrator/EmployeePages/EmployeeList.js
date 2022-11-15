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
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { EMPLOYEE } from "../../../routes/route_url";

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
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(11))
    dispatch(getEmployeelist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={AddEmployee}
            masterPath={EMPLOYEE}
            ButtonMsgLable={"Employee"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}
  
export default Employee_List;
