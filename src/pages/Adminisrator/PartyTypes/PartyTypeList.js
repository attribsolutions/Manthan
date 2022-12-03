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
import {  commonPageFieldList, commonPageFieldListSuccess} from "../../../store/actions";
import { PARTYTYPE } from "../../../routes/route_url";

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
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(32))
    dispatch(getPartyTypelist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PartyType}
            masterPath={PARTYTYPE}
            ButtonMsgLable={"PartyType"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default PartyTypeList;
