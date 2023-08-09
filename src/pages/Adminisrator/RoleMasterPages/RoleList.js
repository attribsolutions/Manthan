import React, { useEffect } from "react";
import {
  getRole,
  deleteRole,
  editRoleId,
  userUpdateActionSuccess,
  userDeleteActionSuccess,
  PostSuccess,
} from "../../../store/Administrator/RoleMasterRedux/action";
import { useSelector, useDispatch } from "react-redux";
import RoleMaster from "./RoleMaster";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {PageLoadingSpinner } from "../../../components/Common/CommonButton";

const RoleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.RoleMaster_Reducer.listBtnLoading,
      loading: state.RoleMaster_Reducer.loading,
      tableList: state.RoleMaster_Reducer.roleList,
      editData: state.RoleMaster_Reducer.editData,
      updateMsg: state.RoleMaster_Reducer.updateMsg,
      deleteMsg: state.RoleMaster_Reducer.deleteMsg,
      postMsg: state.RoleMaster_Reducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getRole,
    editId: editRoleId,
    deleteId: deleteRole,
    postSucc: PostSuccess,
    updateSucc: userUpdateActionSuccess,
    deleteSucc: userDeleteActionSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.ROLE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getRole());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={RoleMaster}
          masterPath={url.ROLE}
          ButtonMsgLable={"Role"}
          deleteName={"Name"}
        />
      }

    </React.Fragment>
  )
}

export default RoleList;
