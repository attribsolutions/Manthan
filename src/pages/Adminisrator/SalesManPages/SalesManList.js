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
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

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

    const { pageField, goBtnLoading } = reducers;

    const action = {
        getList: getSalesManlist,
        editId: editSalesManID,
        deleteId: deleteSalesManID,
        postSucc: saveSalesManMasterSuccess,
        updateSucc: updateSalesManIDSuccess,
        deleteSucc: deleteSalesManID_Success,
    }

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.SALESMAN_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))

        return () => {
            dispatch(getSalesManlistSuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const goButtonHandler = () => {
        try {
            const loginParty = commonPartyDropSelect.value;
            if (loginParty === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            dispatch(getSalesManlist({
                ...loginJsonBody(),
                PartyID: commonPartyDropSelect.value
            }));
        } catch (error) { }
        return
    };

    function partySelectButtonHandler() {
        goButtonHandler();
    }
    const partySelectOnChangeHandler = (e) => {
        dispatch(getSalesManlistSuccess([]));
    }

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            <div className="page-content">
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
