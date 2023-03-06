import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import RoutesMaster from "./RoutesMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { loginCompanyID, loginPartyID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    deleteRoutesIDSuccess,
    delete_Routes_ID,
    editRoutesID,
    PostMethod_ForRoutesMasterAPISuccess,
    PostRouteslist,
    updateRoutesIDSuccess
} from "../../../store/Administrator/RoutesRedux/actions";

const RoutesList = (props) => {

    const dispatch = useDispatch();
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

    const action = {
        getList: PostRouteslist,
        editId: editRoutesID,
        deleteId: delete_Routes_ID,
        postSucc: PostMethod_ForRoutesMasterAPISuccess,
        updateSucc: updateRoutesIDSuccess,
        deleteSucc: deleteRoutesIDSuccess,
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.ROUTES_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(PostRouteslist());
    }, []);
    const { pageField, userAccess = [] } = reducers;

    // useEffect(() => {
    //     const jsonBody = JSON.stringify({
    //         Party: loginPartyID(),
    //         Company: loginCompanyID()
    //     });
    //     dispatch(PostRouteslist(jsonBody));
    // }, []);

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={RoutesMaster}
                        masterPath={url.ROUTES}
                        ButtonMsgLable={"Routes"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default RoutesList;
