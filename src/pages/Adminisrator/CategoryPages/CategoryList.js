import React, { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryMaster from "./CategoryMaster";
import {
  deleteCategoryIDSuccess,
  delete_Category_ID,
  editCategoryID,
  getCategorylist,
  PostMethod_ForCategoryAPISuccess,
  updateCategoryIDSuccess
} from "../../../store/Administrator/CategoryRedux/action";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {  commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { CATEGORY } from "../../../routes/route_url";

const CategoryList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.CategoryReducer.CategoryListData,
      editData: state.CategoryReducer.editData,
      updateMsg: state.CategoryReducer.updateMessage,
      deleteMsg: state.CategoryReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg:state.CategoryReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getCategorylist,
    editId: editCategoryID,
    deleteId: delete_Category_ID,
    postSucc: PostMethod_ForCategoryAPISuccess,
    updateSucc: updateCategoryIDSuccess,
    deleteSucc: deleteCategoryIDSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(19))
    dispatch(getCategorylist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CategoryMaster}
            masterPath={CATEGORY}
            ButtonMsgLable={"Name"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CategoryList;
