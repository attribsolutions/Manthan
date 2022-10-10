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
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldList, commonPageFieldListSuccess, commonPageFieldSuccess } from "../../../store/actions";

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
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const action = {
        getList: getPartyListAPI,
        editId: editPartyID,
        deleteId: deletePartyID,
        updateSucc: updatePartyIDSuccess,
        deleteSucc: deletePartyIDSuccess,
        postSucc:postPartyDataSuccess
    }



    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(11))
        dispatch(getPartyListAPI());
    }, []);

    const { pageField } = reducers

    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={PartyMaster}
                        masterPath={"/PartyMaster"}
                        ButtonMsgLable={"Party"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}


export default PartyList;