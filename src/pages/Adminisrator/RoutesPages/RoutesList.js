import React, { useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import RoutesMaster from "./RoutesMaster";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {
  deleteRoutesID_Success,
  deleteRoutesID,
  editRoutesID,
  SaveRoutesMasterSuccess,
  GetRoutesList,
  updateRoutesIDSuccess,
  GetRoutesListSuccess
} from "../../../store/Administrator/RoutesRedux/actions";
import { loginCompanyID } from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const RoutesList = (props) => {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      goBtnLoading: state.RoutesReducer.goBtnLoading,
      listBtnLoading: state.RoutesReducer.listBtnLoading,
      tableList: state.RoutesReducer.RoutesList,
      postMsg: state.RoutesReducer.PostData,
      editData: state.RoutesReducer.editData,
      updateMsg: state.RoutesReducer.updateMessage,
      deleteMsg: state.RoutesReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList,
    })
  );
  const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

  const { pageField, goBtnLoading } = reducers;

  // Common Party select Dropdown useEffect
  useEffect(() => {
    if (commonPartyDropSelect.value > 0) {
      partySelectButtonHandler();
    } else {
      partySelectOnChangeHandler();
    }
  }, [commonPartyDropSelect]);

  const action = {
    getList: GetRoutesList,
    editId: editRoutesID,
    deleteId: deleteRoutesID,
    postSucc: SaveRoutesMasterSuccess,
    updateSucc: updateRoutesIDSuccess,
    deleteSucc: deleteRoutesID_Success,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.ROUTES_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    // dispatch(BreadcrumbShowCountlabel(`Count :${0}`))
    return () => {
      dispatch(GetRoutesListSuccess([]));
    }
  }, []);

  const goButtonHandler = () => {

    try {
      if (commonPartyDropSelect.value === 0) {
        customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
        return;
      };
      const jsonBody = JSON.stringify({
        CompanyID: loginCompanyID(),
        PartyID: commonPartyDropSelect.value,
      });

      dispatch(GetRoutesList(jsonBody));
    } catch (error) { }
    return
  };

  function partySelectButtonHandler() {
    goButtonHandler()
  }
  function partySelectOnChangeHandler() {
    dispatch(GetRoutesListSuccess([]));
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      <div className="page-content">

        {
          (pageField) &&
          <div className="mt-n1">
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={RoutesMaster}
              masterPath={url.ROUTES}
              newBtnPath={url.ROUTES}
              ButtonMsgLable={"Routes"}
              deleteName={"Name"}
              goButnFunc={goButtonHandler}
            />
          </div>

        }
      </div>

    </React.Fragment>
  )
}

export default RoutesList;
