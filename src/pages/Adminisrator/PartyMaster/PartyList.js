
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    partyResetReduxAction,
    postPartyDataSuccess,
    updatePartyIDSuccess
} from '../../../store/Administrator/PartyRedux/action';
import PartyMaster from './MasterAdd/PartyIndex';
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { mode, url, pageId } from "../../../routes/index";
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Listloader } from '../../../components/Common/CommonButton';

const PartyList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [subPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
    });

    const reducers = useSelector(

        (state) => ({
            loading: state.PartyMasterReducer.loading,
            listBtnLoading: state.PartyMasterReducer.listBtnLoading,
            tableList: state.PartyMasterReducer.partyList,
            editData: state.PartyMasterReducer.editData,
            updateMsg: state.PartyMasterReducer.updateMsg,
            deleteMsg: state.PartyMasterReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.PartyMasterReducer.postMsg,
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
    useLayoutEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = '';
        if (subPageMode === url.PARTY_lIST) {
            page_Id = pageId.PARTY_lIST;
            masterPath = url.PARTY;
            newBtnPath = url.PARTY;
        }
        else if (subPageMode === url.RETAILER_LIST) {
            page_Id = pageId.RETAILER_LIST
            masterPath = url.RETAILER_MASTER;
            newBtnPath = url.RETAILER_MASTER;
        }


        setOtherState({ masterPath, newBtnPath, })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getPartyListAPI(subPageMode));
        return () => {
            dispatch(commonPageFieldListSuccess(null))
            dispatch(updatePartyIDSuccess([]))//for clear privious order list   
        }
    }, []);

    const { pageField, userAccess = [] } = reducers

    return (
        <React.Fragment>
            {
                reducers.loading ?
                    <Listloader />
                    :
                    (pageField) ?
                        <CommonListPage
                            action={action}
                            reducers={reducers}
                            MasterModal={PartyMaster}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            pageMode={pageMode}
                            ButtonMsgLable={"Party"}
                            deleteName={"Name"}
                        />
                        : <><Listloader /></>
            }
        </React.Fragment>
    )
}

export default PartyList;