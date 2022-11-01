import { Button } from "reactstrap";
import { AlertState } from "../../../store/actions";

export const listPageCommonButtonFunction = (props) => {

    const dispatch = props.dispatchHook;
    const userPageAccessState = props.userPageAccessState;
    const editActionFun = props.editActionFun;
    const deleteActionFun = props.deleteActionFun;
    const ButtonMsgLable = props.ButtonMsgLable;
    const userCreated = parseInt(localStorage.getItem("userId"))
    const deleteName = props.deleteName;
    /***
     * deletemsgLable change to=> ButtonMsgLable line no:11 
     *    autho by => Rohit  date :22-08-022 */
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
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Edit ${ButtonMsgLable}`}
                        onClick={() => { dispatch(editActionFun(rowData.id, 'edit')); }}
                        className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </Button>)

                    : // **Else-If Condition start 

                    ((userPageAccessState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated)) //**condition :2
                        ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`EditSelf ${ButtonMsgLable}`}
                            onClick={() => { dispatch(editActionFun(rowData.id, 'edit')); }}
                            className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </Button>

                        : // **second else-if condition

                        (userPageAccessState.RoleAccess_IsView)  // ** condition :3
                            ?
                            <Button
                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title={`View ${ButtonMsgLable}`}
                                onClick={() => { dispatch(editActionFun(rowData.id, 'edit')); }}
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
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Delete ${ButtonMsgLable}`}
                    onClick={() => {
                        dispatch(AlertState({
                            Type: 5, Status: true,
                            Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
                            RedirectPath: false,
                            PermissionAction: deleteActionFun,
                            ID: rowData.id
                        }));
                    }}
                >
                    <i className="mdi mdi-delete font-size-18"></i>
                </Button>
                /*chnage delete-self functionality  autho by- Rohit date: 22-08-022 
                line no 88 to 108
                */
                :
                ((userPageAccessState.RoleAccess_IsDeleteSelf) && (rowData.CreatedBy === userCreated))
                    ?
                    <Button
                        type="button"
                        className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Delete ${ButtonMsgLable}`}
                        onClick={() => {
                            dispatch(AlertState({
                                Type: 5, Status: true,
                                Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData.Name}"`,
                                RedirectPath: false,
                                PermissionAction: deleteActionFun,
                                ID: rowData.id
                            }));
                        }}
                    >
                        <i className="mdi mdi-delete font-size-18"></i>
                    </Button>
                    : null
            }
            {(userPageAccessState.RoleAccess_IsSave) ?
                <Button
                    type="button"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Copy ${ButtonMsgLable}`}
                    onClick={() => { dispatch(editActionFun((rowData.id), "copy")); }}
                    className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                >
                    <i className="bx bxs-copy font-size-18 "></i>
                </Button>
                : null
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