import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
  deleteGrouplistSuccess,
  delete_GroupList_ID,
  editGroupID,
  postGroupSuccess,
  updategroupIDSuccess,
} from "../../../store/actions";
import PartyItems from "./PartyItems";
import { GetPartyList } from "../../../store/Administrator/PartyItemsRedux/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
const PartyItemsList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PartyItemsReducer.partyList,
      editData: state.PartyItemsReducer.editData,
      updateMsg: state.PartyItemsReducer.updateMsg,
      deleteMsg: state.PartyItemsReducer.deleteMsg,
      postMsg: state.PartyItemsReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: GetPartyList,
    editId: editGroupID,
    deleteId: delete_GroupList_ID,
    postSucc: postGroupSuccess,
    updateSucc: updategroupIDSuccess,
    deleteSucc: deleteGrouplistSuccess

  }
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(pageId.PARTYITEM_LIST))
    dispatch(GetPartyList());



  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartyItems}
            masterPath={url.PARTYITEM_LIST}
            ButtonMsgLable={"Group"}
            deleteName={"Name"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default PartyItemsList;
