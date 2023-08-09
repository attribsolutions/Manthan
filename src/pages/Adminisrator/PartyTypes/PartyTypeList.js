import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePartyTypeIDSuccess,
  delete_PartyType_ID,
  editPartyTypeId,
  getPartyTypelist,
  getPartyTypelistSuccess,
  SavePartyTypeAPISuccess,
  updatePartyTypeIDSuccess
} from "../../../store/Administrator/PartyTypeRedux/action";
import PartyType from "./PartyType";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {  PageLoadingSpinner } from "../../../components/Common/CommonButton";


const PartyTypeList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.PartyTypeReducer.listBtnLoading,
      goBtnLoading: state.PartyTypeReducer.goBtnLoading,
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
    postSucc: SavePartyTypeAPISuccess,
    updateSucc: updatePartyTypeIDSuccess,
    deleteSucc: deletePartyTypeIDSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.PARTYTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getPartyTypelist());

    return () => {
      dispatch(getPartyTypelistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }

  }, []);

  const { pageField, goBtnLoading } = reducers

  return (
    <React.Fragment>

      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={PartyType}
          masterPath={url.PARTYTYPE}
          ButtonMsgLable={"Party Type"}
          deleteName={"Name"}
        />

      }
    </React.Fragment>
  )
}

export default PartyTypeList;
