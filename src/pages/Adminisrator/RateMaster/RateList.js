import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import RateMaster from "./RateMaster";
import { deleteRateListId, deleteRateListId_Success, getRateList, saveRateMasterSuccess } from "../../../store/Administrator/RateMasterRedux/action";
import { editEmployeeeId } from "../../../store/Administrator/EmployeeRedux/action";

const RateList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.RateMasterReducer.listBtnLoading,
            GoBtnlistloading: state.RateMasterReducer.GoBtnlistloading,
            tableList: state.RateMasterReducer.RateListData,
            updateMsg: state.EmployeesReducer.updateMessage,
            editData: state.EmployeesReducer.editData,
            deleteMsg: state.RateMasterReducer.deleteMsg,
            postMsg: state.RateMasterReducer.postMsg,

            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getRateList,
        editId: editEmployeeeId,
        deleteId: deleteRateListId,
        deleteSucc: deleteRateListId_Success,
        postSucc: saveRateMasterSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.RATE_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getRateList());
    }, []);

    const { pageField, GoBtnlistloading } = reducers

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={RateMaster}
                    masterPath={url.RATE_MASTER}
                    ButtonMsgLable={"Rate"}
                    deleteName={"EffectiveDate"}
                />

            }
        </React.Fragment>
    )
}

export default RateList
