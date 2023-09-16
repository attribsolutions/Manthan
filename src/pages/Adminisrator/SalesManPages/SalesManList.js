import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SalesManMaster from "./SalesManMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {
    deleteSalesManID_Success,
    deleteSalesManID,
    editSalesManID,
    saveSalesManMasterSuccess,
    getSalesManlist,
    updateSalesManIDSuccess,
    getSalesManlistSuccess
} from "../../../store/Administrator/SalesManRedux/actions";
import { loginJsonBody, loginSelectedPartyID } from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const SalesManList = (props) => {

    const dispatch = useDispatch();

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.SalesManReducer.goBtnLoading,
            listBtnLoading: state.SalesManReducer.listBtnLoading,
            tableList: state.SalesManReducer.SalesManList,
            postMsg: state.SalesManReducer.PostData,
            editData: state.SalesManReducer.editData,
            updateMsg: state.SalesManReducer.updateMessage,
            deleteMsg: state.SalesManReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, goBtnLoading, tableList } = reducers;

    const action = {
        getList: getSalesManlist,
        editId: editSalesManID,
        deleteId: deleteSalesManID,
        postSucc: saveSalesManMasterSuccess,
        updateSucc: updateSalesManIDSuccess,
        deleteSucc: deleteSalesManID_Success,
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.SALESMAN_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        if (!(loginSelectedPartyID() === 0)) {
            goButtonHandler()
        }
        return () => {
            dispatch(getSalesManlistSuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const goButtonHandler = () => {
        try {
            const loginParty = loginSelectedPartyID();
            if (loginParty === 0) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            dispatch(getSalesManlist({
                ...loginJsonBody(),
                PartyID: loginSelectedPartyID()
            }));
        } catch (error) { }
        return
    };

    const partyOnChngeButtonHandler = (e) => {
        dispatch(getSalesManlistSuccess([]));
    }

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            <div className="page-content">
                <PartyDropdown_Common 
                    goBtnLoading={goBtnLoading}
                    goButtonHandler={goButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler}
                />
                {
                    (pageField) &&
                    <>
                        <div className="mt-n1">
                            <CommonPurchaseList
                                action={action}
                                reducers={reducers}
                                showBreadcrumb={false}
                                MasterModal={SalesManMaster}
                                masterPath={url.SALESMAN}
                                newBtnPath={url.SALESMAN}
                                ButtonMsgLable={"SalesMan"}
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

export default SalesManList;
