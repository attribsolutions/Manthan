import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import GeneralMaster from "./GeneralMaster";
import {
    deleteGeneralIDSuccess,
    delete_General_ID,
    editGeneralID,
    PostGenerallist,
    PostMethodForGeneralSuccess,
    updateGeneralIDSuccess
} from "../../../store/Administrator/GeneralRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew"
import { loginCompanyID } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";


const GeneralList = (props) => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.GeneralReducer.GeneralList,
            editData: state.GeneralReducer.editData,
            updateMsg: state.GeneralReducer.updateMessage,
            deleteMsg: state.GeneralReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.GeneralReducer.postMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        postList: PostGenerallist,
        editId: editGeneralID,
        deleteId: delete_General_ID,
        postSucc: PostMethodForGeneralSuccess,
        updateSucc: updateGeneralIDSuccess,
        deleteSucc: deleteGeneralIDSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.GENERAL_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
    }, []);

    const { pageField, userAccess = [] } = reducers

    useEffect(() => {
     
        const jsonBody = JSON.stringify({
            TypeID: 2,
            Company: loginCompanyID(),
        });
        dispatch(PostGenerallist(jsonBody));
    }, []);

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.GENERAL_LIST} /> */}

            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={GeneralMaster}
                        masterPath={url.GENERAL}
                        ButtonMsgLable={"General"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default GeneralList;
