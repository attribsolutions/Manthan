import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
  deleteGrouplistSuccess,
  delete_GroupList_ID,
  saveGroupMaster_Success,
} from "../../../store/actions";
import PartyItems from "./PartyItems";
import { editPartyItemID, GetPartyList, } from "../../../store/Administrator/PartyItemsRedux/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { loginJsonBody, } from "../../../components/Common/CommonFunction";

const PartyItemsList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PartyItemsReducer.partyList,
      editData: state.PartyItemsReducer.editData,
      updateMsg: state.PartyItemsReducer.postMsg,
      deleteMsg: state.PartyItemsReducer.deleteMsg,
      postMsg: state.PartyItemsReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: GetPartyList,
    editId: editPartyItemID,
    deleteId: delete_GroupList_ID,
    postSucc: saveGroupMaster_Success,
    // updateSucc: SavePartyItemsSuccess,
    deleteSucc: deleteGrouplistSuccess

  }
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(pageId.PARTYITEM_LIST))
    dispatch(GetPartyList());
  }, []);

  function editBodyfunc(row) {

    const config = { ...row }
    config.PartyName = row.rowData.Name
    config.Party = row.rowData.id;
    config.editId = row.rowData.id

    const jsonBody = JSON.stringify({ ...loginJsonBody(), ...{ PartyID: config.editId } });

    dispatch(editPartyItemID({ jsonBody, config }))
  }

  const { pageField, userAccess = [] } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartyItems}
            masterPath={url.PARTYITEM}
            ButtonMsgLable={"Party Items"}
            deleteName={"Name"}
            editBodyfunc={editBodyfunc}

          />
          : null
      }

    </React.Fragment>
  )
}

export default PartyItemsList;
