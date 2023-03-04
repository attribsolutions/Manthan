import React, { useEffect } from "react";
import {
    deleteCompany_ID,
    editCompanyID,
    updateCompanyIDSuccess,
    deleteCompanyIDSuccess,
    PostCompanySubmitSuccess,
    fetchCompanyList,
} from "../../../store/Administrator/CompanyRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import CompanyModule from "./CompanyModule";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";

const CompanyList = () => {
    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.Company.companyList,
            postMsg: state.Company.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            editData: state.Company.editData,
            updateMsg: state.Company.updateMessage,
            deleteMsg: state.Company.deleteCompanyID,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: fetchCompanyList,
        editId: editCompanyID,
        deleteId: deleteCompany_ID,
        postSucc: PostCompanySubmitSuccess,
        updateSucc: updateCompanyIDSuccess,
        deleteSucc: deleteCompanyIDSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.COMPANY_lIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(fetchCompanyList());
    }, []);

    const { pageField,userAccess=[] } = reducers;

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={CompanyModule}
                        masterPath={url.COMPANY}
                        ButtonMsgLable={"Company"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default CompanyList;





