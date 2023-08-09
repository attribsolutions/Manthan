import React, { useEffect } from "react";
import {
  getEmployeelist,
  editEmployeeeId,
  deleteEmployeeIDSuccess,
  updateEmployeeIDSuccess,
  delete_Employee_ID,
  PostEmployeeSuccess,
  getEmployeelistSuccess,
} from "../../../store/Administrator/EmployeeRedux/action";
import { useSelector, useDispatch } from "react-redux";
import AddEmployee from "./EmployeeMaster";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";

const Employee_List = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.EmployeesReducer.listBtnLoading,
      goBtnLoading: state.EmployeesReducer.goBtnLoading,
      tableList: state.EmployeesReducer.employeeList,
      editData: state.EmployeesReducer.editData,
      updateMsg: state.EmployeesReducer.updateMessage,
      deleteMsg: state.EmployeesReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.EmployeesReducer.postMessage,
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

    return () => {
      dispatch(getEmployeelistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }
  }, []);

  const { pageField, goBtnLoading } = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={AddEmployee}
          masterPath={url.EMPLOYEE}
          ButtonMsgLable={"Employee"}
          deleteName={"Name"}
        />
      }


    </React.Fragment>
  )
}

export default Employee_List;
