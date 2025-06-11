import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    getPartyListAPISuccess,
    postPartyDataSuccess,
    updatePartyIDSuccess
} from '../../../store/Administrator/PartyRedux/action';
import PartyMaster from './MasterAdd/PartyIndex';
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { mode, url, pageId } from "../../../routes/index";
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageLoadingSpinner } from '../../../components/Common/CommonButton';
import CommonPurchaseList from '../../../components/Common/CommonPurchaseList';
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mobileApp_RetailerDelete_Api } from '../../../helpers/backend_helper';
import { showToastAlert } from '../../../helpers/axios_Config';
import { changeCommonPartyDropDetailsAction } from '../../../store/Utilites/PartyDrodown/action';

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
            goBtnLoading: state.PartyMasterReducer.goBtnLoading,
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
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const { pageField, goBtnLoading } = reducers

    const action = {
        editId: editPartyID,
        deleteId: deletePartyID,
        updateSucc: updatePartyIDSuccess,
        deleteSucc: deletePartyIDSuccess,
        postSucc: postPartyDataSuccess
    }
    // Common Party Dropdown useEffect
    useEffect(() => {
        if (subPageMode === url.PARTY_lIST) {
            goButtonHandler()
        }
        else if ((commonPartyDropSelect.value > 0 &&
            (subPageMode === url.RETAILER_LIST ||
                subPageMode === url.NON_RETAILER_PARTY_lIST ||
                subPageMode === url.FRANCHISE_CUSTOMER_LIST) ||
            subPageMode === url.RETAILER_MASTER_LIST_1
        )) {
            goButtonHandler()
        }
        return () => {
            dispatch(updatePartyIDSuccess([])); //for clear privious order list 
            dispatch(getPartyListAPISuccess([]));
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore state
        }
    }, [commonPartyDropSelect]);

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
        } else if (subPageMode === url.RETAILER_MASTER_LIST_1) {
            page_Id = pageId.RETAILER_MASTER_LIST_1
            masterPath = url.RETAILER_MASTER_1;
            newBtnPath = url.RETAILER_MASTER_1;
        }
        else if (subPageMode === url.RETAILER_LIST) {
            page_Id = pageId.RETAILER_LIST
            masterPath = url.RETAILER_MASTER;
            newBtnPath = url.RETAILER_MASTER;
        }
        else if (subPageMode === url.FRANCHISE_CUSTOMER_LIST) {
            page_Id = pageId.FRANCHISE_CUSTOMER_LIST
            masterPath = url.FRANCHISE_CUSTOMER_MASTER;
            newBtnPath = url.FRANCHISE_CUSTOMER_MASTER;
        }
        else if (subPageMode === url.NON_RETAILER_PARTY_lIST) {
            page_Id = pageId.NON_RETAILER_PARTY_lIST
            masterPath = url.NON_RETAILER_PARTY;
            newBtnPath = url.NON_RETAILER_PARTY;
        }
        setOtherState({ masterPath, newBtnPath, })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
    }, []);

    function goButtonHandler() {

        try {
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID() === 0 ? _cfunc.loginPartyID() : _cfunc.loginSelectedPartyID(),
                IsRetailer: (subPageMode === url.RETAILER_LIST) || (subPageMode === url.RETAILER_MASTER_LIST_1) ? 1 : 0,
                EmployeeID: _cfunc.loginEmployeeID()
            }
            dispatch(getPartyListAPI(jsonBody, subPageMode));
        }
        catch (error) { }
        return
    };

    const mobaileDeleteApiFinc = async (deleteMsg) => {
        //***************mobail app api*********************** */
        const mobilApiResp = await mobileApp_RetailerDelete_Api(deleteMsg.TransactionID)
        if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message, "success") }
        //************************************** */
        return // *note  return required 
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />

                {
                    (pageField) &&
                    <CommonPurchaseList
                        action={action}
                        reducers={reducers}
                        showBreadcrumb={false}
                        MasterModal={PartyMaster}
                        goButnFunc={goButtonHandler}
                        masterPath={otherState.masterPath}
                        newBtnPath={otherState.newBtnPath}
                        mobaileDeleteApiFinc={mobaileDeleteApiFinc}
                        pageMode={pageMode}
                        ButtonMsgLable={"Party"}
                        deleteName={"Name"}
                    />
                }
            </div>
        </React.Fragment>
    )
}

export default PartyList;