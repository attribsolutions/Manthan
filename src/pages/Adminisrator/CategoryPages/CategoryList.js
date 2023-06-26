import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryMaster from "./CategoryMaster";
import {
  deleteCategoryIDSuccess,
  delete_Category_ID,
  editCategoryID,
  getCategorylist,
  saveCategoryMaster_Success,
  updateCategoryIDSuccess
} from "../../../store/Administrator/CategoryRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Listloader } from "../../../components/Common/CommonButton";

const CategoryList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.CategoryReducer.listBtnLoading,
      tableList: state.CategoryReducer.CategoryListData,
      editData: state.CategoryReducer.editData,
      updateMsg: state.CategoryReducer.updateMessage,
      deleteMsg: state.CategoryReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.CategoryReducer.postMsg,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getCategorylist,
    editId: editCategoryID,
    deleteId: delete_Category_ID,
    postSucc: saveCategoryMaster_Success,
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

  const { pageField, } = reducers

  return (
    <React.Fragment>
      {
        reducers.listBtnLoading ?
          <Listloader />
          :
          (pageField) ?
            <CommonListPage
              action={action}
              reducers={reducers}
              MasterModal={CategoryMaster}
              masterPath={url.CATEGORY}
              ButtonMsgLable={"Category"}
              deleteName={"Name"}
            />
            : <><Listloader /></>
      }

    </React.Fragment>
  )
}

export default CategoryList;
