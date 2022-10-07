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
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

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
      pageField: state.CommonPageFieldReducer.pageField
    })
  );

  const action = {
    getList: getCategoryTypelist,
    editId: editCategoryTypeID,
    deleteId: deleteCategoryTypeIDSuccess,
    postSucc: PostMethod_ForCategoryTypeMasterAPISuccess,
    updateSucc: updateCategoryTypeIDSuccess,
    deleteSucc: delete_CategoryType_ID
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(17))
    dispatch(getCategoryTypelist());
  }, []);

  const { pageField } = reducers
debugger
  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CategoryTypeMaster}
            masterPath={"/CategoryTypeMaster"}
            ButtonMsgLable={"CategoryType"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CategoryTypeList;
