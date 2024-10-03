import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import CountryMaster from "./CountryMaster";
import { deleteCountry_ID_Action, deleteCountry_ID_Success, editCountry_ID_Action, getCountryList_Action, getCountryList_Success, saveCountryMaster_Success, updateCountry_ID_Success } from "../../../store/Administrator/CountryRedux/action";

const CountryList = () => {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      tableList: state.CountryReducer.CountryList,
      editData: state.CountryReducer.editData,
      updateMsg: state.CountryReducer.updateMessage,
      deleteMsg: state.CountryReducer.deleteMsg,
      postMsg: state.CountryReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList,
      listBtnLoading: state.CountryReducer.listBtnLoading,
      GoBtnlistloading: state.CountryReducer.loading
    })
  );

  const { pageField, GoBtnlistloading } = reducers

  const action = {
    getList: getCountryList_Action,
    editId: editCountry_ID_Action,
    deleteId: deleteCountry_ID_Action,
    postSucc: saveCountryMaster_Success,
    updateSucc: updateCountry_ID_Success,
    deleteSucc: deleteCountry_ID_Success
  }

  useEffect(() => {
    const page_Id = pageId.COUNTRY_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getCountryList_Action());

    return () => {
      dispatch(getCountryList_Success([]));
    }
  }, []);


  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
      <div className="page-content">
        {
          (pageField) &&
          <div className="mt-n1">
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={CountryMaster}
              masterPath={url.COUNTRY_MASTER}
              newBtnPath={url.COUNTRY_MASTER}
              ButtonMsgLable={"Country"}
              deleteName={"Country"}
            />
          </div>

        }
      </div>
    </React.Fragment>
  )
}

export default CountryList;
