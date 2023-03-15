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
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";

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
    const page_Id = pageId.EMPLOYEETYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getEmployeeTypelist());
  }, []);

  const { pageField,userAccess=[] } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
        {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.EMPLOYEETYPE_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={EmployeeTypesMaster}
            masterPath={url.EMPLOYEETYPE}
            ButtonMsgLable={"Employee Type"}
            deleteName={"Name"}
          />
          : null
      }
    </React.Fragment>
  )
}

export default EmployeeTypeList;
