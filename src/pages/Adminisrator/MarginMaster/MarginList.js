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
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

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
      pageField: state.CommonPageFieldReducer.pageField
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
    dispatch(getMarginListPage());
    dispatch(commonPageField(97))
    dispatch(commonPageFieldSuccess([]))
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={MarginMaster}
            masterPath={"/MarginMaster"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default MarginList;
