import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import GroupMaster from "./GroupMaster";
import {
  deleteGrouplistSuccess,
  delete_GroupList_ID,
  editGroupID,
  getGroupList,
  saveGroupMaster_Success,
  updateGroupIDSuccess
} from "../../../store/Administrator/GroupRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";

const GroupList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.GroupReducer.groupList,
      editData: state.GroupReducer.editData,
      updateMsg: state.GroupReducer.updateMsg,
      deleteMsg: state.GroupReducer.deleteMsg,
      postMsg: state.GroupReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getGroupList,
    editId: editGroupID,
    deleteId: delete_GroupList_ID,
    postSucc: saveGroupMaster_Success,
    updateSucc: updateGroupIDSuccess,
    deleteSucc: deleteGrouplistSuccess
  }

  useEffect(() => {
    const page_Id = pageId.GROUP_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getGroupList());
  }, []);

  const { pageField,userAccess=[] } = reducers
  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={GroupMaster}
            masterPath={url.GROUP}
            ButtonMsgLable={"Group"}
            deleteName={"Name"}
          />
          : null
      }
    </React.Fragment>
  )
}

export default GroupList;
