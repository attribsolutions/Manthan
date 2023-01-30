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
import { MetaTags } from "react-meta-tags";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";

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

  const { pageField ,userAccess=[]} = reducers

  return (
    <React.Fragment>
       <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.PARTYITEM_LIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartyItems}
            masterPath={url.PARTYITEM_LIST}
            ButtonMsgLable={"Party Items"}
            deleteName={"Name"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default PartyItemsList;
