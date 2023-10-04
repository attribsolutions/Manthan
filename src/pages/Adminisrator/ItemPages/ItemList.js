import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  getItemList,
  getItemListSuccess,
  SaveItemMasterActionSuccess,
  updateItemMasterActionSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster/itemIndex";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { ITEM } from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { PageLoadingSpinner, Listloader } from "../../../components/Common/CommonButton";
import { mobileApp_ProductDelete_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";

const ItemsList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.ItemMastersReducer.listBtnLoading,
      GoBtnlistloading: state.ItemMastersReducer.loading,
      tableList: state.ItemMastersReducer.ItemList,
      editData: state.ItemMastersReducer.editData,
      updateMsg: state.ItemMastersReducer.updateMsg,
      deleteMsg: state.ItemMastersReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.ItemMastersReducer.postMsg,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getItemList,
    editId: editItemId,
    deleteId: deleteItemID,
    postSucc: SaveItemMasterActionSuccess,
    updateSucc: updateItemMasterActionSuccess,
    deleteSucc: deleteItemIdSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(pageId.ITEM_lIST))
    dispatch(getItemList());
    return () => {
      dispatch(getItemListSuccess([]));
    }
  }, []);


  const mobaileDeleteApiFinc = async (deleteMsg) => {
    //***************mobail app api*********************** */
    const mobilApiResp = await mobileApp_ProductDelete_Api(deleteMsg.TransactionID)
    if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message,"success") }
    //************************************** */

    return // *note  return required 
  }

  const { pageField, GoBtnlistloading } = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={ItemsMaster}
          masterPath={ITEM}
          mobaileDeleteApiFinc={mobaileDeleteApiFinc}
          ButtonMsgLable={"Item"}
          deleteName={"Name"}
        />

      }

    </React.Fragment>
  )
}

export default ItemsList;
