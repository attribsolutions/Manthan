import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID,
    deleteModuleIDSuccess,
    editModuleID,
    getModuleList,
    saveModuleMasterSuccess,
    updateModuleIDSuccess
} from "../../../store/actions";
import Modules from "./Modules";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { CustomSppiner, Listloader } from "../../../components/Common/CommonButton";

const ModulesList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.Modules.listBtnLoading,
            GoBtnlistloading: state.Modules.loading,
            tableList: state.Modules.modulesList,
            updateMsg: state.Modules.updateMessage,
            editData: state.Modules.editData,
            deleteMsg: state.Modules.deleteModuleIDSuccess,
            postMsg: state.Modules.modulesSubmitSuccesss,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getModuleList,
        editId: editModuleID,
        deleteId: deleteModuleID,
        updateSucc: updateModuleIDSuccess,
        deleteSucc: deleteModuleIDSuccess,
        postSucc: saveModuleMasterSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.MODULE_lIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getModuleList());
    }, []);

    const { pageField, GoBtnlistloading } = reducers

    return (
        <React.Fragment>
            <CustomSppiner isLoading={(GoBtnlistloading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={Modules}
                    masterPath={url.MODULE}
                    ButtonMsgLable={"Module"}
                    deleteName={"Name"}
                />

            }
        </React.Fragment>
    )
}

export default ModulesList
