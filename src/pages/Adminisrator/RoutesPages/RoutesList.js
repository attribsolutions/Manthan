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
import { loginCompanyID, loginPartyID, loginRoleID } from "../../../components/Common/CommonFunction";
import PartyDropdownList from "../../../components/Common/PartyDropdownComp/PartyDropdownList";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";

const RoutesList = (props) => {

    const dispatch = useDispatch();
    const RoleID = loginRoleID()

  const [party, setParty] = useState({ value: loginPartyID(), label: "Select..." });

    const reducers = useSelector(
        (state) => ({
            tableList: state.RoutesReducer.RoutesList,
            postMsg: state.RoutesReducer.PostData,
            editData: state.RoutesReducer.editData,
            updateMsg: state.RoutesReducer.updateMessage,
            deleteMsg: state.RoutesReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, userAccess = [] } = reducers;

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
        goButtonHandler(true)
    }, []);

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
          CompanyID: loginCompanyID(),
          PartyID: party.value,
        });
        dispatch(GetRoutesList(jsonBody));
      }
    
      return (
      
        <React.Fragment>
        <div className="page-content">
  
          {RoleID === 2 ?
            <PartyDropdownList
              state={party}
              setState={setParty}
              action={goButtonHandler}
            />
            : null}
          {
            (pageField) ?
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
              : null
          }
        </div>
      </React.Fragment>
    )
}

export default RoutesList;
