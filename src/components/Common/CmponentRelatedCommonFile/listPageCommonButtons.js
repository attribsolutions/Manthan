import { Button } from "reactstrap";
import { AlertState } from "../../../store/actions";

export const listPageCommonButtonFunction = (props) => {

    const dispatch = props.dispatchHook;
    const userAccState = props.userAccState;
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
                !(userAccState.RoleAccess_IsEdit)
                && !(userAccState.RoleAccess_IsView)
                && !(userAccState.RoleAccess_IsDelete)
                && !(userAccState.RoleAccess_IsEditSelf)) ? true : false,

        formatter: (cellContent, rowData) => (<div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

            {
                //** if condition start

                (userAccState.RoleAccess_IsEdit) //condtion:1
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

                    ((userAccState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated)) //**condition :2
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

                        (userAccState.RoleAccess_IsView)  // ** condition :3
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


            {(userAccState.RoleAccess_IsDelete)
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
                ((userAccState.RoleAccess_IsDeleteSelf) && (rowData.CreatedBy === userCreated))
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
            {((userAccState.RoleAccess_IsSave) && (userAccState.RoleAccess_IsCopy)) ?
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

export const excelDownCommonFunc = (props) => {
    const { tableList = [], PageFieldMaster = [] } = props
    let downList = [];
    let listObj = {};

    tableList.forEach((index1) => {

        PageFieldMaster.forEach((index2) => {
            if (index2.ShowInDownload) {
                listObj[`$defSelect${index2.ControlID}`] = index2.ShownloadDefaultSelect
                listObj[index2.ControlID] = index1[index2.ControlID]
            }
        })
        downList.push(listObj)
        listObj = {}
    })
    return downList
}

export const currentDate = (props) => {
    const current = new Date();
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` :
        `${month}`}-${current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`}`;
    return currentDate
}