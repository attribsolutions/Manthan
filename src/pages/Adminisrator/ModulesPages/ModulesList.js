import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID,
    deleteModuleIDSuccess,
    editModuleID,
    fetchModelsList,
    PostModelsSubmitSuccess,
    updateModuleIDSuccess
} from "../../../store/actions";
import Modules from "./Modules";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { MODULE } from "../../../routes/route_url";
const ModulesList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
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
        getList: fetchModelsList,
        editId: editModuleID,
        deleteId: deleteModuleID,
        updateSucc: updateModuleIDSuccess,
        deleteSucc: deleteModuleIDSuccess,
        postSucc: PostModelsSubmitSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(15))
        dispatch(fetchModelsList());
    }, []);

    const { pageField } = reducers

    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={Modules}
                        masterPath={MODULE}
                        ButtonMsgLable={"Name"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default ModulesList
