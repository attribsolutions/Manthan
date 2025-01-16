import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import {
  deleteGroupTypeID,
  deleteGroupTypeIDSuccess,
  editGroupTypeID,
  saveGroupTypeMasterSuccess,
  updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { getVoucherlist, getVoucherlistSuccess } from "../../../store/Administrator/voucherRedux/action";
import Voucher from "./Voucher";

const VoucherList = (props) => {
  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.VoucherReducer.listBtnLoading,
      goBtnLoading: state.VoucherReducer.goBtnLoading,
      tableList: state.VoucherReducer.GroupType,
      editData: state.VoucherReducer.editData,
      updateMsg: state.VoucherReducer.updateMessage,
      deleteMsg: state.VoucherReducer.deleteMessage,
      postMsg: state.VoucherReducer.PostData,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getVoucherlist,
    editId: editGroupTypeID,
    deleteId: deleteGroupTypeID,
    postSucc: saveGroupTypeMasterSuccess,
    updateSucc: updateGroupTypeIDSuccess,
    deleteSucc: deleteGroupTypeIDSuccess
  }
  useEffect(() => {
    const page_Id = pageId.VOUCHER_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getVoucherlist())

    return () => {
      dispatch(getVoucherlistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }

  }, []);

  const { pageField, goBtnLoading } = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={Voucher}
          masterPath={url.VOUCHER}
          ButtonMsgLable={"Voucher"}
          deleteName={"Name"}
        />

      }
    </React.Fragment>
  )
}

export default VoucherList;
