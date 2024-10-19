import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteDriverID_Success,
    updateDriverID_Success,
    getDriverList,
    editDriverID,
    deleteDriverID,
    saveDriverMasterSuccess,
    getDriverListSuccess,
} from "../../../../store/Administrator/DriverRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../../store/actions";
import * as pageId from "../../../../routes/allPageID"
import * as url from "../../../../routes/route_url";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList";
import { PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import MachineTypeMaster from "./MachineTypeMaster";
import { SPos_MachineTypeList_Action, SPos_MachineTypeList_Success } from "../../../../store/SweetPOSStore/Administrator/MachineTypeMasterRedux/action";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { mode } from "../../../../routes";

const MachineTypeList = () => {

    const dispatch = useDispatch();
    const history = useHistory()

    const reducers = useSelector(
        (state) => ({
            tableList: state.SPos_MachineType_Reducer.SPosMachineTypeListData,
            GoBtnlistloading: state.SPos_MachineType_Reducer.listBtnLoading,
            editData: state.DriverReducer.editData,
            updateMsg: state.DriverReducer.updateMessage,
            deleteMsg: state.DriverReducer.deleteMsg,
            postMsg: state.DriverReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

        })
    );

    const { pageField, GoBtnlistloading } = reducers

    const action = {
        editId: editDriverID,
        deleteId: deleteDriverID,
        postSucc: saveDriverMasterSuccess,
        updateSucc: updateDriverID_Success,
        deleteSucc: deleteDriverID_Success
    }

    useEffect(() => {
        const page_Id = pageId.SWEET_POS_MACHINE_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(SPos_MachineTypeList_Action({ "Party": _cfunc.loginPartyID() }))
        return () => {
            dispatch(SPos_MachineTypeList_Success([]));
        }
    }, []);

    function editBodyfunc(index) {

        history.push({
            pathname: url.SWEET_POS_MACHINE_MASTER,
            rowData: index.rowData,
            pageMode: mode.edit
        })
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
            <div className="page-content">
                {
                    (pageField) &&
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={MachineTypeMaster}
                            masterPath={url.SWEET_POS_MACHINE_MASTER}
                            newBtnPath={url.SWEET_POS_MACHINE_MASTER}
                            ButtonMsgLable={"Machine Type"}
                            deleteName={"MacID"}
                            editBodyfunc={editBodyfunc}
                            forceNewBtnView={false}
                        />
                    </div>

                }
            </div>
        </React.Fragment>
    )
}

export default MachineTypeList;
