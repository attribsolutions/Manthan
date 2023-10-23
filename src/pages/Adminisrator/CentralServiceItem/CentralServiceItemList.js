import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import CentralServiceItem from "./CentralServiceItemMaster";
import { deleteCentralServiceItemListSuccess, delete_CentralServiceItemList_ID, editCentralServiceItemID, getCentralServiceItemList, getCentralServiceItemSuccess, saveCentralServiceItem_Success, updateCentralServiceItemIDSuccess } from "../../../store/Administrator/CentralServiceItemRedux/action";

const CentralServiceItemList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.CentralServiceItemReducer.listBtnLoading,
      goBtnLoading: state.CentralServiceItemReducer.goBtnLoading,
      tableList: state.CentralServiceItemReducer.groupList,
      editData: state.CentralServiceItemReducer.editData,
      updateMsg: state.CentralServiceItemReducer.updateMsg,
      deleteMsg: state.CentralServiceItemReducer.deleteMsg,
      postMsg: state.CentralServiceItemReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getCentralServiceItemList,
    editId: editCentralServiceItemID,
    deleteId: delete_CentralServiceItemList_ID,
    postSucc: saveCentralServiceItem_Success,
    updateSucc: updateCentralServiceItemIDSuccess,
    deleteSucc: deleteCentralServiceItemListSuccess
  }

  useEffect(() => {
    const page_Id = pageId.CENTRAL_SERVICE_ITEM_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getCentralServiceItemList());

    return () => {
      dispatch(getCentralServiceItemSuccess([]));
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
