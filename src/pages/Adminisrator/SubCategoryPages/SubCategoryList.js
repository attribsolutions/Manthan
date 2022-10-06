import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSubCategoryIDSuccess,
  delete_SubCategory_ID,
  editSubCategoryID,
  getSubCategorylist,
  PostMethod_ForSubCategoryAPISuccess,
  updateSubCategoryIDSuccess
} from "../../../store/Administrator/SubCategoryRedux/action";
import SubCategoryMaster from "./SubCategoryMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";


const SubCategoryList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.SubCategoryReducer.SubCategoryListData,
      editData: state.SubCategoryReducer.editData,
      updateMsg: state.SubCategoryReducer.updateMessage,
      deleteMsg: state.SubCategoryReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.SubCategoryReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageField
    })
  );

  const action = {
    getList: getSubCategorylist,
    editId: editSubCategoryID,
    deleteId: deleteSubCategoryIDSuccess,
    postSucc: PostMethod_ForSubCategoryAPISuccess,
    updateSucc: updateSubCategoryIDSuccess,
    deleteSucc: delete_SubCategory_ID
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(25))
    dispatch(getSubCategorylist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={SubCategoryMaster}
            masterPath={"/SubCategoryMaster"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default SubCategoryList;
