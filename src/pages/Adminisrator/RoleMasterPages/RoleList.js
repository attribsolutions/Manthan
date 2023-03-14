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
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";

const RoleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
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

  const { pageField ,userAccess=[]} = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={RoleMaster}
            masterPath={url.ROLE}
            ButtonMsgLable={"Role"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default RoleList;
