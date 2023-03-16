import { Button } from "reactstrap";
import * as mode from "../../routes/PageMode"
import { CustomAlert } from "../../CustomAlert/ConfirmDialog";
import { btnIsDissablefunc } from "./CommonFunction"

const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "


export const listPageActionsButtonFunc = (props) => {

    const dispatch = props.dispatchHook;
    const userCreated = parseInt(localStorage.getItem("userId"))
    const {
        subPageMode = '',
        userAccState,
        editActionFun,
        deleteActionFun,
        ButtonMsgLable,
        deleteName,
        downBtnFunc,
        editBodyfunc,
        deleteBodyfunc,
        copyBodyfunc,
        makeBtnFunc = () => { },
        pageMode,
        makeBtnName,
        makeBtnShow = false
    } = props;

    function editHandler(rowData, btnmode, btnId) {

        const config = { editId: rowData.id, btnmode, subPageMode, btnId }
        btnIsDissablefunc({ btnId, state: true })

        if (editBodyfunc) {
            editBodyfunc({ rowData, btnmode, subPageMode, btnId })
        } else {
            dispatch(editActionFun({ ...config }));
        }
    };

    function copyHandler(rowData, btnmode,btnId) {
        const config = { editId: rowData.id, btnmode, subPageMode, btnId }
        btnIsDissablefunc({ btnId, state: true })

        if (copyBodyfunc) {
            copyBodyfunc({ rowData, btnmode, subPageMode, btnId })
        } else {
            dispatch(editActionFun({ ...config }));
        }
    };

    function downHandler(rowData) {
        downBtnFunc(rowData);
    };

    async function deleteHandler(rowData, btnId) {
        if (deleteBodyfunc) {
            const config = { rowData, subPageMode, btnId }
            deleteBodyfunc({ ...config })
            return
        } else {
            const rep = await CustomAlert({
                Type: 8,
                Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
            })
            if (rep) {
                btnIsDissablefunc({ btnId, state: true })
                const config = { deleteId: rowData.id, subPageMode, btnId }
                dispatch(deleteActionFun({ ...config }))
            }
        }
    }

    function makeBtnHandler(rowData) {
        rowData["hasSelect"] = true;
        let arr = []
        arr.push(rowData)
        makeBtnFunc(arr)
    }

    return ({
        text: "Action",
        hidden:
            (
                !(userAccState.RoleAccess_IsEdit)
                && !(userAccState.RoleAccess_IsView)
                && !(userAccState.RoleAccess_IsDelete)
                && !(userAccState.RoleAccess_IsEditSelf)) ? true : false,

        formatter: (cellContent, rowData) => {
            const forceEdit = rowData.forceEdit;
            rowData["hasSelect"] = false
            return (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >


                    {
                        ((pageMode === mode.modeSTPList) && makeBtnShow && rowData.POType === 3) ?
                            < Button
                                type="button"
                                id={`btn-makeBtn-${rowData.id}`}
                                className={makeBtnCss}
                                title={makeBtnName}
                                onClick={() => {
                                    const btnId = `btn-makeBtn-${rowData.id}`
                                    makeBtnHandler(rowData, btnId)
                                }}
                            >
                                <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                    className=" fas fa-file-invoice" ></span> </Button>
                            : <div></div>
                    }
                    {
                        //** if condition start

                        (userAccState.RoleAccess_IsEdit && !forceEdit) //condtion:1
                            ?
                            (<Button
                                type="button"
                                id={`btn-edit-${rowData.id}`}
                                className={editBtnCss}
                                title={`Edit ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnId = `btn-edit-${rowData.id}`
                                    editHandler(rowData, mode.edit, btnId)
                                }}
                            >
                                <i className="mdi mdi-pencil font-size-18" ></i>
                            </Button>)

                            : // **Else-If Condition start 

                            ((userAccState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated) && !forceEdit) //**condition :2
                                ?
                                <Button
                                    type="button"
                                    id={`btn-edit-${rowData.id}`}
                                    className={editSelfBtnCss}
                                    title={`EditSelf ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnId = `btn-edit-${rowData.id}`
                                        editHandler(rowData, mode.edit, btnId)
                                    }}
                                >
                                    <i className="mdi mdi-pencil font-size-18" ></i>
                                </Button>

                                : // **second else-if condition

                                (userAccState.RoleAccess_IsView)  // ** condition :3
                                    ?
                                    <Button
                                        type="button"
                                        className={editSelfBtnCss}
                                        id={`btn-edit-${rowData.id}`}
                                        title={`View ${ButtonMsgLable}`}
                                        onClick={() => {
                                            const btnId = `btn-view-${rowData.id}`
                                            editHandler(rowData, mode.view, btnId)
                                        }}
                                    >
                                        <i className="bx bxs-show font-size-18 "></i>
                                    </Button>

                                    : null  // **else null

                    }


                    {
                        (userAccState.RoleAccess_IsDelete)
                            ?
                            <Button
                                type="button"
                                className={deltBtnCss}
                                id={`btn-delete-${rowData.id}`}
                                title={`Delete ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnId = `btn-delete-${rowData.id}`
                                    deleteHandler(rowData, btnId)
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
                                    className={deltBtnCss}
                                    id={`btn-delete-${rowData.id}`}
                                    title={`Delete ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnId = `btn-delete-${rowData.id}`
                                        deleteHandler(rowData, btnId)
                                    }}
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                                : null
                    }
                    {
                        ((userAccState.RoleAccess_IsSave) && (userAccState.RoleAccess_IsCopy)) ?
                            <Button
                                type="button"
                                id={`btn-delete-${rowData.id}`}
                                className={editSelfBtnCss}
                                title={`Copy ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnId = `btn-delete-${rowData.id}`
                                    copyHandler(rowData, mode.copy, btnId)
                                }}
                            >
                                <i className="bx bxs-copy font-size-18 "></i>
                            </Button>
                            : null
                    }
                    {
                        ((userAccState.RoleAccess_IsPrint)) ?
                            <Button
                                type="button"
                                id={`btn-dounload-${rowData.id}`}
                                className={downBtnCss}
                                title={`Download ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnId = `btn-dounload-${rowData.id}`
                                    downHandler(rowData, btnId)
                                }}
                            >
                                <i className="bx bx-printer font-size-18"></i>
                            </Button>
                            : null
                    }

                </div >
            )
        }
    });

}
