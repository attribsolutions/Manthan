import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  delete_MarginList,
  delete_MarginListSuccess,
  editMarginList,
  getMarginListPage,
  postMarginMasterDataSuccess,
  updateMarginListSuccess
} from "../../../store/Administrator/MarginMasterRedux/action";
import MarginMaster from "./MarginMaster"
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {  commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { MARGIN } from "../../../routes/route_url";

const MarginList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.MarginMasterReducer.MarginList,
      editData: state.MarginMasterReducer.editData,
      updateMsg: state.MarginMasterReducer.updateMessage,
      deleteMsg: state.MarginMasterReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.MarginMasterReducer.PostData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
    );
    const action = {
      getList: getMarginListPage,
      editId: editMarginList,
      deleteId: delete_MarginListSuccess,
      postSucc: postMarginMasterDataSuccess,
      updateSucc: updateMarginListSuccess,
      deleteSucc: delete_MarginList
    }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(97))
    dispatch(getMarginListPage());
    
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
         (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={MarginMaster}
            masterPath={MARGIN}
            ButtonMsgLable={"Margin"}
            deleteName={"EffectiveDate"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default MarginList;
