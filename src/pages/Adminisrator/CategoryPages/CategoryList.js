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
import {  commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";

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
    const page_Id = pageId.CATEGORY_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
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
            masterPath={url.CATEGORY}
            ButtonMsgLable={"Category"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CategoryList;
