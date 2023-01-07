import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryTypeMaster from "./CategoryTypeMaster";
import {
  deleteCategoryTypeIDSuccess,
  delete_CategoryType_ID,
  editCategoryTypeID,
  getCategoryTypelist,
  PostMethod_ForCategoryTypeMasterAPISuccess,
  updateCategoryTypeIDSuccess
} from "../../../store/actions";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import { MetaTags } from "react-meta-tags";
const CategoryTypeList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.categoryTypeReducer.categoryTypeListData,
      postMsg: state.categoryTypeReducer.PostData,
      editData: state.categoryTypeReducer.editData,
      updateMsg: state.categoryTypeReducer.updateMessage,
      deleteMsg: state.categoryTypeReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getCategoryTypelist,
    editId: editCategoryTypeID,
    deleteId: delete_CategoryType_ID,
    postSucc: PostMethod_ForCategoryTypeMasterAPISuccess,
    updateSucc: updateCategoryTypeIDSuccess,
    deleteSucc: deleteCategoryTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.CATEGORYTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getCategoryTypelist());
  }, []);

  const { pageField, userAccess=[] } = reducers;

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      <BreadcrumbNew userAccess={userAccess} pageId={pageId.CATEGORYTYPE_lIST} />

      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CategoryTypeMaster}
            masterPath={url.CATEGORYTYPE}
            ButtonMsgLable={"Category Type"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CategoryTypeList;
