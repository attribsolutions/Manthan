import React, { useEffect } from "react";
import {
    deleteCompany_ID,
    editCompanyID,
    fetchCompanyList,
    updateCompanyIDSuccess,
    deleteCompanyIDSuccess,
    PostCompanySubmitSuccess,
} from "../../../store/Administrator/CompanyRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import CompanyModule from "./CompanyModule";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldList, commonPageFieldListSuccess, commonPageFieldSuccess } from "../../../store/actions";

const CompanyList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.Company.companyList,
            postMsg: state.Company.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            editData: state.Company.editData,
            updateMsg: state.Company.updateMsg,
            deleteMsg: state.Company.deleteId,
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
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(1))
        dispatch(fetchCompanyList());
    }, []);

    const { pageField } = reducers;

    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={CompanyModule}
                        masterPath={"/CompanyMaster"}
                        ButtonMsgLable={"Company"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default CompanyList;




