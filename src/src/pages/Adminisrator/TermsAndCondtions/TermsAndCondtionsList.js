import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import TermsAndCondtionsMaster from "./TermsAndCondtionsMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldList, commonPageFieldListSuccess, commonPageFieldSuccess } from "../../../store/actions";
import { PostMethod_ForTermsAndCondtionsMaster_Success,GetTermsAndCondtionsList,EditTermsAndCondtions,DeleteTermsAndCondtions,DeleteTermsAndCondtions_Success ,UpdateTermsAndCondtions_Success} from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

const TermsAndCondtionsList = (props) => {
  

  const dispatch = useDispatch();
  //useSelector is used to access the redux store in function component
  const reducers = useSelector(
    (state) => ({
      tableList: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
      postMsg: state.TermsAndCondtionsReducer.PostData,
      editData: state.TermsAndCondtionsReducer.TermsAndCondtionseditData,
      updateMsg: state.TermsAndCondtionsReducer.TermsAndCondtionsupdateMessage,
      deleteMsg: state.TermsAndCondtionsReducer.TermsAndCondtionsdeleteMessage,
      
      
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );


  const action = {
    getList: GetTermsAndCondtionsList,
    editId: EditTermsAndCondtions,
    deleteId: DeleteTermsAndCondtions,
    postSucc: PostMethod_ForTermsAndCondtionsMaster_Success,
    updateSucc: UpdateTermsAndCondtions_Success,
    deleteSucc: DeleteTermsAndCondtions_Success

  }
  
  //useEffect : used for fetching data
  useEffect(() => {
    
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(102))
    dispatch(GetTermsAndCondtionsList())

  }, []);

  const { pageField } = reducers
debugger
  return (
    <React.Fragment>
      {
        (pageField) ?
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
