import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import ClusterMaster from "./ClusterMaster";
import { deleteClusterIDSuccess, delete_Cluster_ID, editClusterID, getClusterlist, getClusterlistSuccess, updateClusterIDSuccess } from "../../../store/Administrator/ClusterRedux/action";

const ClusterList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.ClusterReducer.listBtnLoading,
      goBtnLoading: state.ClusterReducer.goBtnLoading,
      tableList: state.ClusterReducer.ClusterListData,
      postMsg: state.ClusterReducer.postMsg,
      editData: state.ClusterReducer.editData,
      updateMsg: state.ClusterReducer.updateMessage,
      deleteMsg: state.ClusterReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getClusterlist,
    editId: editClusterID,
    deleteId: delete_Cluster_ID,
    postSucc: deleteClusterIDSuccess,
    updateSucc: updateClusterIDSuccess,
    deleteSucc: deleteClusterIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.CLUSTER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getClusterlist());

    return () => {
      dispatch(getClusterlistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }
  }, []);

  const { pageField, goBtnLoading } = reducers;

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={ClusterMaster}
          masterPath={url.CLUSTER_MASTER}
          ButtonMsgLable={"Cluster"}
          deleteName={"Name"}
        />

      }

    </React.Fragment>
  )
}

export default ClusterList;
