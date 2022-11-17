import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  getItemList,
  PostItemDataSuccess,
  updateItemSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster/itemIndex";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { ITEM } from "../../../routes/route_url";


const ItemsList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMsg: state.ItemMastersReducer.updateMessage,
      deleteMsg: state.ItemMastersReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.ItemMastersReducer.postMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getItemList,
    editId: editItemId,
    deleteId: deleteItemID,
    postSucc: PostItemDataSuccess,
    updateSucc: updateItemSuccess,
    deleteSucc: deleteItemIdSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(26))
    dispatch(getItemList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={ItemsMaster}
            masterPath={ITEM}
            ButtonMsgLable={"Item"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default ItemsList;
