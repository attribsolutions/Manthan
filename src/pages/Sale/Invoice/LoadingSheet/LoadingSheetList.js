import React, { useEffect,  } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import {

    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import LoadingSheet from "./LoadingSheet";
import { getLoadingSheetList } from "../../../../store/Sales/LoadingSheetRedux/action";
import CommonListPage from "../../../../components/Common/CommonMasterListPage";
import { LoadingSheet_API } from "../../../../helpers/backend_helper";
import * as report from '../../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../../store/Utilites/PdfReport/actions";


const LoadingSheetList = () => {

    const dispatch = useDispatch();
    
    const reducers = useSelector(
        (state) => ({
            tableList: state.LoadingSheetReducer.LoadingSheetList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            bomlistFilters: state.BOMReducer.bomlistFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, pageField } = reducers;

    const page_Id = pageId.LOADING_SHEET_LIST

    const action = {
        getList: getLoadingSheetList,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        dispatch(getLoadingSheetList())
    }, []);

    function downBtnFunc(row) {
        var ReportType = report.VanLoadingPartyWiseInvoice;
        dispatch(getpdfReportdata(LoadingSheet_API, ReportType, row.id))
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={LoadingSheet}
                        downBtnFunc={downBtnFunc}
                        masterPath={url.LOADING_SHEET}
                        ButtonMsgLable={"LoadingSheet"}
                        deleteName={"No"}
                    />
                    : null
            }
        </React.Fragment>
    )
}

export default LoadingSheetList;