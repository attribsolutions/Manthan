import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SalesManMaster from "./SalesManMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteSalesManID_Success,
    deleteSalesManID,
    editSalesManID,
    saveSalesManMasterSuccess,
    getSalesManlist,
    updateSalesManIDSuccess
} from "../../../store/Administrator/SalesManRedux/actions";
import { loginCompanyID, loginPartyID, loginRoleID } from "../../../components/Common/CommonFunction";
import PartyDropdownList from "../../../components/Common/PartyDropdownComp/PartyDropdownList";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";

const SalesManList = (props) => {

    const dispatch = useDispatch();
    const RoleID = loginRoleID()

    const [party, setParty] = useState({ value: loginPartyID(), label: "Select..." });

    const reducers = useSelector(
        (state) => ({
            tableList: state.SalesManReducer.SalesManList,
            postMsg: state.SalesManReducer.PostData,
            editData: state.SalesManReducer.editData,
            updateMsg: state.SalesManReducer.updateMessage,
            deleteMsg: state.SalesManReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, userAccess = [] } = reducers;

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
        goButtonHandler(true)
    }, []);

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            CompanyID: loginCompanyID(),
            PartyID: party.value,
        });
        dispatch(getSalesManlist(jsonBody));
    }

    return (
        // <React.Fragment>
        //     <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

        //     {
        //         (pageField) ?
        //             <CommonListPage
        //                 action={action}
        //                 reducers={reducers}
        //                 MasterModal={SalesManMaster}
        //                 masterPath={url.SALESMAN}
        //                 ButtonMsgLable={"SalesMan"}
        //                 deleteName={"Name"}
        //             />
        //             : null
        //     }

        // </React.Fragment>

        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
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
                            MasterModal={SalesManMaster}
                            masterPath={url.SALESMAN}
                            newBtnPath={url.SALESMAN}
                            ButtonMsgLable={"SalesMan"}
                            deleteName={"Name"}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default SalesManList;
