import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import TermsAndCondtionsMaster from "./TermsAndCondtionsMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { GetTermsAndCondtionsList } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

const TermsAndCondtionsList = (props) => {
  

  const dispatch = useDispatch();
  //useSelector is used to access the redux store in function component
  debugger
  const reducers = useSelector(
    (state) => ({
      tableList: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
      editData: state.DriverReducer.editData,
      updateMsg: state.DriverReducer.updateMessage,
      deleteMsg: state.DriverReducer.deleteMessage,
      postMsg: state.DriverReducer.PostDataMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField
    })
  );


  const action = {
    getList: GetTermsAndCondtionsList,
    // editId: editDriverTypeId,
    // deleteId: delete_DriverType_ID,
    // postSucc: PostMethod_ForDriverMasterSuccess,
    // updateSucc: updateDriverTypeIDSuccess,
    // deleteSucc: deleteDriverTypeIDSuccess

  }
  
  //useEffect : used for fetching data
  useEffect(() => {
    
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(102))
    dispatch(GetTermsAndCondtionsList())

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={TermsAndCondtionsMaster}
            masterPath={"/TermsAndCondtionsMaster"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default TermsAndCondtionsList;
