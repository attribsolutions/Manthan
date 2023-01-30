import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import {
  deletePartySubParty,
  deletePartySubPartySuccess,
  editPartySubParty,
  getPartySubPartylist,
  postPartySubPartySuccess,
  updatePartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import PartySubParty from "./PartySubParty";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import { MetaTags } from "react-meta-tags";

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
    postSucc: postPartySubPartySuccess,
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

  const { pageField ,userAccess=[]} = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.PARTY_SUB_PARTY_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartySubParty}
            masterPath={url.PARTY_SUB_PARTY}
            ButtonMsgLable={"PartySubParty"}
            deleteName={"PartySubParty"}
          />
          : null
      }
    </React.Fragment>
  )
}

export default PartySubPartyList;
