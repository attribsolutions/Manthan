import React, { useEffect } from "react";
import {
    deleteCompany_ID,
    editCompanyID,
    updateCompanyIDSuccess,
    deleteCompanyIDSuccess,
    saveCompany_Success,
    getcompanyList,
    getCompanyListSuccess,
} from "../../../store/Administrator/CompanyRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import CompanyModule from "./CompanyModule";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";


const CompanyList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.Company.listBtnLoading,
            goBtnLoading: state.Company.goBtnLoading,
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
        getList: getcompanyList,
        editId: editCompanyID,
        deleteId: deleteCompany_ID,
        postSucc: saveCompany_Success,
        updateSucc: updateCompanyIDSuccess,
        deleteSucc: deleteCompanyIDSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.COMPANY_lIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getcompanyList());

        return () => {
            dispatch(getCompanyListSuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const { pageField, goBtnLoading } = reducers;

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={CompanyModule}
                    masterPath={url.COMPANY}
                    ButtonMsgLable={"Company"}
                    deleteName={"Name"}
                />
            }
        </React.Fragment>
    )
}

export default CompanyList;





