import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import {
  deletePartySubParty,
  deletePartySubPartySuccess,
  editPartySubParty,
  getPartySubParty_For_party_dropdown,
  getPartySubPartylist,
  savePartySubPartySuccess,
  updatePartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import PartySubParty from "./index";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartySubPartyListView from "./PartyListView";

const PartySubPartyList = () => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PartySubPartyReducer.listData,
      postMsg: state.PartySubPartyReducer.postMsg,
      editData: state.PartySubPartyReducer.editData,
      updateMsg: state.PartySubPartyReducer.updateMsg,
      deleteMsg: state.PartySubPartyReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getPartySubPartylist,
    editId: editPartySubParty,
    deleteId: deletePartySubParty,
    postSucc: savePartySubPartySuccess,
    updateSucc: updatePartySubPartySuccess,
    deleteSucc: deletePartySubPartySuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.PARTY_SUB_PARTY_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getPartySubPartylist());
  }, []);

  const { pageField } = reducers

  function viewApprovalBtnFunc(config) {
    const PartyID = config.rowData.Party_id
    dispatch(getPartySubParty_For_party_dropdown(PartyID));
  }

  return (
    <React.Fragment>
      {
        (pageField) &&

        <CommonPurchaseList
          action={action}
          reducers={reducers}
          MasterModal={PartySubParty}
          masterPath={url.PARTY_SUB_PARTY}
          newBtnPath={url.PARTY_SUB_PARTY}
          ButtonMsgLable={"PartySubParty"}
          deleteName={"PartySubParty"}
          viewApprovalBtnFunc={viewApprovalBtnFunc}
        />
      }
      <PartySubPartyListView />
    </React.Fragment>
  )
}

export default PartySubPartyList;
