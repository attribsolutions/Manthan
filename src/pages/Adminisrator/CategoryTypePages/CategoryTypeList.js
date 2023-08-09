import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryTypeMaster from "./CategoryTypeMaster";
import {
  deleteCategoryTypeIDSuccess,
  delete_CategoryType_ID,
  editCategoryTypeID,
  getCategoryTypelist,
  getCategoryTypelistSuccess,
  saveCategoryTypeMaster_Success,
  updateCategoryTypeIDSuccess
} from "../../../store/actions";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";

const CategoryTypeList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.categoryTypeReducer.listBtnLoading,
      goBtnLoading: state.categoryTypeReducer.goBtnLoading,
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
    postSucc: saveCategoryTypeMaster_Success,
    updateSucc: updateCategoryTypeIDSuccess,
    deleteSucc: deleteCategoryTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.CATEGORYTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getCategoryTypelist());

    return () => {
      dispatch(getCategoryTypelistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }
  }, []);

  const { pageField, goBtnLoading } = reducers;

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={CategoryTypeMaster}
          masterPath={url.CATEGORYTYPE}
          ButtonMsgLable={"Category Type"}
          deleteName={"Name"}
        />

      }

    </React.Fragment>
  )
}

export default CategoryTypeList;
