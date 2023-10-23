import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import GroupMaster from "./CentralServiceItemMaster";
import {
  deleteGrouplistSuccess,
  delete_GroupList_ID,
  editGroupID,
  getGroupList,
  getGroupListSuccess,
  saveGroupMaster_Success,
  updateGroupIDSuccess
} from "../../../store/Administrator/GroupRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import CentralServiceItem from "./CentralServiceItemMaster";

const CentralServiceItemList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.GroupReducer.listBtnLoading,
      goBtnLoading: state.GroupReducer.goBtnLoading,
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
    const page_Id = pageId.CENTRAL_SERVICE_ITEM_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getGroupList());

    return () => {
      dispatch(getGroupListSuccess([]));
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
          MasterModal={CentralServiceItem}
          masterPath={url.CENTRAL_SERVICE_ITEM_MASTER}
          ButtonMsgLable={"Central Service Item"}
          deleteName={"Name"}
        />

      }
    </React.Fragment>
  )
}

export default CentralServiceItemList;
