import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SubClusterMaster from "./SubClusterMaster";
import { deleteSub_ClusterIDSuccess, delete_Sub_Cluster_ID, editSub_ClusterID, getSub_Clusterlist, getSub_ClusterlistSuccess, saveSub_ClusterMaster_Success, updateSub_ClusterIDSuccess } from "../../../store/Administrator/SubClusterRedux/action";

const SubClusterList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SubClusterReducer.listBtnLoading,
      goBtnLoading: state.SubClusterReducer.goBtnLoading,
      tableList: state.SubClusterReducer.subClusterListData,
      editData: state.SubClusterReducer.editData,
      updateMsg: state.SubClusterReducer.updateMessage,
      deleteMsg: state.SubClusterReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.SubClusterReducer.postMsg,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getSub_Clusterlist,
    editId: editSub_ClusterID,
    deleteId: delete_Sub_Cluster_ID,
    postSucc: saveSub_ClusterMaster_Success,
    updateSucc: updateSub_ClusterIDSuccess,
    deleteSucc: deleteSub_ClusterIDSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.SUB_CLUSTER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getSub_Clusterlist());

    return () => {
      dispatch(getSub_ClusterlistSuccess([]));
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
          MasterModal={SubClusterMaster}
          masterPath={url.SUB_CLUSTER_MASTER }
          ButtonMsgLable={"SubCluster"}
          deleteName={"Name"}
        />
      }

    </React.Fragment>
  )
}

export default SubClusterList;
