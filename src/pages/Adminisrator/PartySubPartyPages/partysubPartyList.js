import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import {
  deletePartySubParty,
  deletePartySubPartySuccess,
  editPartySubParty,
  getPartySubPartylist,
  postPartySubPartySuccess,
  updatePartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import { PARTY_SUB_PARTY } from "../../../helpers/url_helper";
import PartySubParty from "./PartySubParty";

const Employee_List = () => {
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
debugger
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
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(122))
    dispatch(getPartySubPartylist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartySubParty}
            masterPath={PARTY_SUB_PARTY}
            ButtonMsgLable={"PartySubParty"}
            deleteName={"PartySubParty"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default Employee_List;
