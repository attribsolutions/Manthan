import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import { GROUP, PARTY_ITEM } from "../../../routes/route_url";
import PartyItems from "./PartyItems";
import { } from "../../../store/Administrator/GroupRedux/action";
import { getpartyItemList } from "../../../store/Administrator/PartyItemsRedux/action";

const PartyItemList = (props) => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
     partyItem: state.PartyItemsReducer.partyItem,
    //   editData: state.PartyItemsReducer.editData,
    //   updateMsg: state.PartyItemsReducer.updateMsg,
    //   deleteMsg: state.PartyItemsReducer.deleteMsg,
      postMsg: state.PartyItemsReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList:getpartyItemList,
    // editId: editGroupID,
    // deleteId: delete_GroupList_ID,
    // postSucc: postGroupSuccess,
    // updateSucc: updategroupIDSuccess,
    // deleteSucc: deleteGrouplistSuccess

  }
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(133))
    dispatch(getpartyItemList());
    
    

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
            masterPath={PARTY_ITEM}
            ButtonMsgLable={"PartyItem"}
            deleteName={"Name"}
          
          />
          : null
      }

    </React.Fragment>
  )
}

export default PartyItemList;
