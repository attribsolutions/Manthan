import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteEmployeeTypeIDSuccess,
  delete_EmployeeType_ID,
  editEmployeeTypeId,
  getEmployeeTypelist,
  PostEmployeeTypeSubmitSuccess,
  updateEmployeeTypeIDSuccess
} from "../../../store/Administrator/EmployeeTypeRedux/action";
import EmployeeTypesMaster from "./EmployeeTypesMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {  commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { EMPLOYEETYPE } from "../../../routes/route_url";


const EmployeeTypeList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.EmployeeTypeReducer.EmployeeTypeList,
      editData: state.EmployeeTypeReducer.editData,
      updateMsg: state.EmployeeTypeReducer.updateMessage,
      deleteMsg: state.EmployeeTypeReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.EmployeeTypeReducer.PostEmployeeType,
      pageField: state.CommonPageFieldReducer.pageFieldList

    })
  );

  const action = {
    getList: getEmployeeTypelist,
    editId: editEmployeeTypeId,
    deleteId: delete_EmployeeType_ID,
    postSucc: PostEmployeeTypeSubmitSuccess,
    updateSucc: updateEmployeeTypeIDSuccess,
    deleteSucc: deleteEmployeeTypeIDSuccess
  }


  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(116))
    dispatch(getEmployeeTypelist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={EmployeeTypesMaster}
            masterPath={EMPLOYEETYPE}
            ButtonMsgLable={"EmployeeType"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default EmployeeTypeList;
