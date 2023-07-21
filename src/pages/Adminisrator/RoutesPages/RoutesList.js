import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RoutesMaster from "./RoutesMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
  deleteRoutesID_Success,
  deleteRoutesID,
  editRoutesID,
  SaveRoutesMasterSuccess,
  GetRoutesList,
  updateRoutesIDSuccess
} from "../../../store/Administrator/RoutesRedux/actions";
import { loginCompanyID, loginPartyID, loginUserAdminRole } from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { Listloader, PageLoadingSpinner } from "../../../components/Common/CommonButton";

const RoutesList = (props) => {

  const dispatch = useDispatch();
  const userAdminRole = loginUserAdminRole();

  const [party, setParty] = useState({ value: loginPartyID(), label: "Select..." });

  const reducers = useSelector(
    (state) => ({
      loading: state.RoutesReducer.loading,
      listBtnLoading: state.RoutesReducer.listBtnLoading,
      tableList: state.RoutesReducer.RoutesList,
      postMsg: state.RoutesReducer.PostData,
      editData: state.RoutesReducer.editData,
      updateMsg: state.RoutesReducer.updateMessage,
      deleteMsg: state.RoutesReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { pageField, } = reducers;

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
    if (!userAdminRole) { goButtonHandler() }
  }, []);

  const goButtonHandler = () => {

    const jsonBody = JSON.stringify({
      CompanyID: loginCompanyID(),
      PartyID: party.value,
    });
    dispatch(GetRoutesList(jsonBody));
  };

  const partyOnChngeHandler = (e) => {
    setParty(e)
  };

  return (

    <React.Fragment>
      <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
      <div className="page-content">
        {
          (pageField) &&
          <>
            {userAdminRole &&
              <div className="mb-2">
                <PartyDropdown_Common
                  partySelect={party}
                  setPartyFunc={partyOnChngeHandler}
                  goButtonHandler={goButtonHandler}
                />
              </div>
            }
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
          </>
        }
      </div>

    </React.Fragment>
  )
}

export default RoutesList;
