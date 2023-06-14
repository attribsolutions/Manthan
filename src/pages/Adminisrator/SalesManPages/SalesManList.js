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
    updateSalesManIDSuccess
} from "../../../store/Administrator/SalesManRedux/actions";
import { loginCompanyID, loginPartyID, loginUserAdminRole } from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { Listloader } from "../../../components/Common/CommonButton";

const SalesManList = (props) => {

    const dispatch = useDispatch();
    const userAdminRole = loginUserAdminRole();

    const [party, setParty] = useState({ value: loginPartyID(), label: "Select..." });

    const reducers = useSelector(
        (state) => ({
            listLoading: state.SalesManReducer.listLoading,
            tableList: state.SalesManReducer.SalesManList,
            postMsg: state.SalesManReducer.PostData,
            editData: state.SalesManReducer.editData,
            updateMsg: state.SalesManReducer.updateMessage,
            deleteMsg: state.SalesManReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, } = reducers;

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
        if (!userAdminRole) { goButtonHandler() }
    }, []);

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            CompanyID: loginCompanyID(),
            PartyID: party.value,
        });
        dispatch(getSalesManlist(jsonBody));
    }

    const partyOnChngeHandler = (e) => {
        setParty(e)
    }

    return (

        <React.Fragment>
            <div className="page-content">

                {userAdminRole &&
                    <div className="mb-2">
                        <PartyDropdown_Common
                            partySelect={party}
                            setPartyFunc={partyOnChngeHandler}
                            goButtonHandler={goButtonHandler}
                        />
                    </div>
                }
                {
                    reducers.listLoading ?
                        <Listloader />
                        :
                        (pageField) &&
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
                }
            </div>
        </React.Fragment>
    )
}

export default SalesManList;
