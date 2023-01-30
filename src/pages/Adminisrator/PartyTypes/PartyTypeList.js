import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePartyTypeIDSuccess,
  delete_PartyType_ID,
  editPartyTypeId,
  getPartyTypelist,
  PostPartyTypeAPISuccess,
  updatePartyTypeIDSuccess
} from "../../../store/Administrator/PartyTypeRedux/action";
import PartyType from "./PartyType";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";

const PartyTypeList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PartyTypeReducer.ListData,
      editData: state.PartyTypeReducer.editData,
      updateMsg: state.PartyTypeReducer.updateMessage,
      deleteMsg: state.PartyTypeReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.PartyTypeReducer.PostData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getPartyTypelist,
    editId: editPartyTypeId,
    deleteId: delete_PartyType_ID,
    postSucc: PostPartyTypeAPISuccess,
    updateSucc: updatePartyTypeIDSuccess,
    deleteSucc: deletePartyTypeIDSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.PARTYTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getPartyTypelist());
  }, []);

  const { pageField,userAccess=[] } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.PARTYTYPE_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartyType}
            masterPath={url.PARTYTYPE}
            ButtonMsgLable={"Party Type"}
            deleteName={"Name"}
          />
          : null
      }
    </React.Fragment>
  )
}

export default PartyTypeList;
