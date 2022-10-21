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
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {  commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { CATEGORYTYPE } from "../../../routes/route_url";

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
    deleteId:  delete_CategoryType_ID,
    postSucc: PostMethod_ForCategoryTypeMasterAPISuccess,
    updateSucc: updateCategoryTypeIDSuccess,
    deleteSucc: deleteCategoryTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(17))
    dispatch(getCategoryTypelist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CategoryTypeMaster}
            masterPath={CATEGORYTYPE}
            ButtonMsgLable={"CategoryType"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CategoryTypeList;
