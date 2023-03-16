
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    postPartyDataSuccess,
    updatePartyIDSuccess
} from '../../../store/Administrator/PartyRedux/action';
import PartyMaster from './PartyMaster';
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { MetaTags } from 'react-meta-tags';
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { loginCompanyID, loginRoleID, loginUserID } from '../../../components/Common/CommonFunction';

const PartyList = () => {
    const dispatch = useDispatch();
    const reducers = useSelector(

        (state) => ({
            tableList: state.PartyMasterReducer.partyList,
            editData: state.PartyMasterReducer.editData,
            updateMsg: state.PartyMasterReducer.updateMessage,
            deleteMsg: state.PartyMasterReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.PartyMasterReducer.PartySaveSuccess,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
        getList: getPartyListAPI,
        editId: editPartyID,
        deleteId: deletePartyID,
        updateSucc: updatePartyIDSuccess,
        deleteSucc: deletePartyIDSuccess,
        postSucc: postPartyDataSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId.PARTY_lIST))
        dispatch(getPartyListAPI());
    }, []);

    const { pageField, userAccess = [] } = reducers

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={PartyMaster}
                        masterPath={url.PARTY}
                        ButtonMsgLable={"Party"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default PartyList;