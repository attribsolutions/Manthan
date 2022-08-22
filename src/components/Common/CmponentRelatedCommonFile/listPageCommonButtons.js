import { Button } from "reactstrap";
import { editModuleID } from "../../../store/actions";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

export const listPageCommonButtonFunction = (props) => {

    const dispatch = props.dispatchHook;
    const userPageAccessState = props.userPageAccessState;
    const editActionFun = props.editActionFun;
    const deleteActionFun = props.deleteActionFun;
    const deletemsglable = props.deletemsgLable;
    const userCreated = parseInt(localStorage.getItem("userId"))
    return ({
        text: "Action",
        hidden:
            (
                !(userPageAccessState.RoleAccess_IsEdit)
                && !(userPageAccessState.RoleAccess_IsView)
                && !(userPageAccessState.RoleAccess_IsDelete)
                && !(userPageAccessState.RoleAccess_IsEditSelf)) ? true : false,

        formatter: (cellContent, rowData) => (<div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

            {
                //** if condition start

                (userPageAccessState.RoleAccess_IsEdit) //condtion:1
                    ?
                    (<Button
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Edit ${deletemsglable}`}
                        onClick={() => { dispatch(editActionFun(rowData.id)); }}
                        className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </Button>)

                    : // **Else-If Condition start 

                    ((userPageAccessState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated)) //**condition :2
                        ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`EditSelf ${deletemsglable}`}
                            onClick={() => { dispatch(editActionFun(rowData.id)); }}
                            className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </Button>

                        : // **second else-if condition

                        (userPageAccessState.RoleAccess_IsView)  // ** condition :3
                            ?
                            <Button
                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title={`View ${deletemsglable}`}
                                onClick={() => { dispatch(editActionFun(rowData.id)); }}
                                className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                            >
                                <i className="bx bxs-show font-size-18 "></i>
                            </Button>

                            : null  // **else null

            }


            {(userPageAccessState.RoleAccess_IsDelete)
                ?
                <Button
                    type="button"
                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Delete ${deletemsglable}`}
                    onClick={() => {
                        dispatch(AlertState({
                            Type: 5, Status: true,
                            Message: `Are you sure you want to delete this ${deletemsglable} : "${rowData.Name}"`,
                            RedirectPath: false,
                            PermissionAction: deleteActionFun,
                            ID: rowData.id
                        }));
                    }}
                >
                    <i className="mdi mdi-delete font-size-18"></i>
                </Button>
                //chnage delete self functionality  autho by
                :
                // ((userPageAccessState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated))
                null
            }

        </div>
        )
    }
    )

}

export const commonDefaultSorted = (name) => {
    return (
        [{
            dataField: name,
            order: 'asc'
        }]
    )
}

export const commonPageOptions = (TableList) => {
    return {
        sizePerPage: 10,
        totalSize: TableList.length, // replace later with size(customers),
        custom: true,
    }
}

export const commonListPageDelete_UpdateMsgFunction = (props) => {

    const dispatch = props.dispatch
    const response = props.response
    const resetAction = props.resetAction
    const afterResponseAction = props.afterResponseAction

    if ((response.Status === true) && (response.StatusCode === 200)) {
        dispatch(resetAction({ Status: false }))
        dispatch(AlertState({
            Type: 1, Status: true,
            Message: response.Message,
            AfterResponseAction: afterResponseAction,
        }))
    } else if (response.Status === true) {
        dispatch(resetAction({ Status: false }))
        dispatch(AlertState({
            Type: 3,
            Status: true,
            Message: response.Message,
        }));
    }
}