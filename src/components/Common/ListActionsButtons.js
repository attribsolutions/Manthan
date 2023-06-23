import { Button, Spinner } from "reactstrap";
import * as mode from "../../routes/PageMode"
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { btnIsDissablefunc, loginUserID } from "./CommonFunction"
import '../../assets/searchBox/searchBox.scss'
import * as url from "../../routes/route_url";
import { Cancel_EInvoiceAction, Cancel_EwayBillAction, Uploaded_EInvoiceAction, Uploaded_EwayBillAction } from "../../store/actions";

const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
export const printBtnCss = "badge badge-soft-primary font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
const updateBtnCss = "badge badge-soft-info font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const dissableBtnCss = "badge badge-soft- font-size-12  waves-effect waves-light w-xxs border border-light"
const printInvoiceBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light"

const dissableStyle = {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: "#adb5bd",
};

export const listPageActionsButtonFunc = (props) => {
    const {
        dispatch,
        history,
        userAccState,
        editActionFun,
        deleteActionFun,
        ButtonMsgLable,
        deleteName,
        downBtnFunc,
        editBodyfunc,
        deleteBodyfunc,
        copyBodyfunc,
        updateBtnFunc,
        makeBtnFunc = () => { },
        pageMode,
        makeBtnName,
        makeBtnShow = false,
        oderAprovalBtnFunc,
    } = props;

    const { listBtnLoading, deleteBtnLoading } = props.reducers;

    const userCreated = loginUserID();
    const subPageMode = history.location.pathname;


    function editHandler(rowData, btnmode, btnId) {
        try {
            let config = { editId: rowData.id, btnmode, subPageMode, btnId }
            btnIsDissablefunc({ btnId, state: true })

            if (editBodyfunc) {
                editBodyfunc({ rowData, btnmode, subPageMode, btnId })
            } else {
                dispatch(editActionFun({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            })
        }
    };

    function copyHandler(rowData, btnmode, btnId) {
        try {
            let config = { editId: rowData.id, btnmode, subPageMode, btnId }
            btnIsDissablefunc({ btnId, state: true })

            if (copyBodyfunc) {
                copyBodyfunc({ rowData, btnmode, subPageMode, btnId })
            } else {
                dispatch(editActionFun({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            })
        }

    };

    function downHandler(rowData, downbtnType, btnId) {
        try {
            downBtnFunc(rowData, downbtnType, btnId);
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            })
        }

    };

    async function deleteHandler(rowData, btnId) {

        try {
            if (deleteBodyfunc) {
                let config = { rowData, subPageMode, btnId }
                deleteBodyfunc({ ...config })
                return
            } else {
                let alertRepsponse = await customAlert({
                    Type: 8,
                    Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
                })
                if (alertRepsponse) {
                    btnIsDissablefunc({ btnId, state: true })
                    let config = { deleteId: rowData.id, subPageMode, btnId }
                    dispatch(deleteActionFun({ ...config }))
                }
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            })
        }

    }

    function makeBtnHandler(rowData, btnId) {
        rowData["hasSelect"] = true;
        let arr = []
        arr.push(rowData)
        makeBtnFunc(arr, btnId)
    }


    return ({
        text: "Action",
        formatExtraData: { listBtnLoading: listBtnLoading, deleteBtnLoading: listBtnLoading },
        hidden:
            (
                !(userAccState.RoleAccess_IsEdit)
                    && !(userAccState.RoleAccess_IsPrint)
                    && !(userAccState.RoleAccess_IsMultipleInvoicePrint)
                    && !(userAccState.RoleAccess_IsView)
                    && !(userAccState.RoleAccess_IsDelete)
                    && !(userAccState.RoleAccess_IsDeleteSelf)
                    && !(userAccState.RoleAccess_IsEditSelf)
                    && !(makeBtnShow)
                    && !(oderAprovalBtnFunc) ? true : false
            ),

        formatter: (__cell, rowData, __key, formatExtra) => {
            let { listBtnLoading } = formatExtra;
            debugger
            let forceEditHide = rowData.forceEditHide;
            let forceDeleteHide = rowData.forceDeleteHide;
            let forceHideOrderAprovalBtn = rowData.forceHideOrderAprovalBtn;
            let forceMakeBtn = rowData.forceMakeBtn;
            rowData["hasSelect"] = false

            return (
                // <div className="d-flex gap-3" style={{ display:'', justifyContent: 'right'}} >
                <div id="ActionBtn" className="center gap-3" >

                    {
                        //** if condition start
                        (userAccState.RoleAccess_IsEdit && !forceEditHide) //condtion:1
                            ?
                            <Button
                                type="button"
                                id={`btn-edit-${rowData.id}`}
                                className={editBtnCss}
                                title={`Edit ${ButtonMsgLable}`}
                                disabled={listBtnLoading}
                                onClick={() => {
                                    const btnId = `btn-edit-${rowData.id}`
                                    editHandler(rowData, mode.edit, btnId)
                                }}
                            >

                                {(listBtnLoading === `btn-edit-${rowData.id}`) ?
                                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                    : <i className="mdi mdi-pencil font-size-16" ></i>
                                }
                            </Button>

                            : // **Else-If Condition start 

                            ((userAccState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated) && !forceEditHide) //**condition :2
                                ?
                                <Button
                                    type="button"
                                    id={`btn-edit-${rowData.id}`}
                                    className={editSelfBtnCss}
                                    disabled={listBtnLoading}
                                    title={`EditSelf ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnId = `btn-edit-${rowData.id}`
                                        editHandler(rowData, mode.edit, btnId)
                                    }}
                                >
                                    {(listBtnLoading === `btn-edit-${rowData.id}`) ?
                                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                        : <i className="mdi mdi-pencil font-size-16" ></i>
                                    }

                                </Button>

                                : // **second else-if condition

                                (userAccState.RoleAccess_IsView)  // ** condition :3
                                    ?
                                    <Button
                                        type="button"
                                        disabled={listBtnLoading}
                                        className={editSelfBtnCss}
                                        id={`btn-edit-${rowData.id}`}
                                        title={`View ${ButtonMsgLable}`}
                                        onClick={() => {
                                            const btnId = `btn-view-${rowData.id}`
                                            editHandler(rowData, mode.view, btnId)
                                        }}
                                    >
                                        {(listBtnLoading === `btn-view-${rowData.id}`) ?
                                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                            : <i className="bx bxs-show font-size-16 "></i>
                                        }

                                    </Button>

                                    :// btn dissable only show body
                                    <Button
                                        type="button"
                                        title={'Access Not Allow'}
                                        className={dissableBtnCss}
                                        disabled={true}
                                        style={dissableStyle}
                                    >
                                        <i className="mdi mdi-pencil font-size-16" ></i>
                                    </Button>  // **else null

                    }

                    {
                        ((pageMode === mode.modeSTPList) && (makeBtnShow) && !(forceMakeBtn)) ?
                            // ((pageMode === mode.modeSTPList) && makeBtnShow && rowData.POType === 3) ?  
                            < Button
                                type="button"
                                id={`btn-makeBtn-${rowData.id}`}
                                className={makeBtnCss}
                                title={makeBtnName}
                                disabled={listBtnLoading}
                                onClick={() => {
                                    const btnId = `btn-makeBtn-${rowData.id}`
                                    makeBtnHandler(rowData, btnId)
                                }}
                            >
                                {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                    : <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                        className=" fas fa-file-invoice" ></span>
                                }


                            </Button>
                            :  // btn dissable only show body           #####//else if  
                            ((pageMode === mode.modeSTPList) && (makeBtnShow))
                                ?
                                <Button
                                    type="button"
                                    title={'Access Not Allow'}
                                    className={dissableBtnCss}
                                    disabled={true}
                                    style={dissableStyle}
                                >
                                    <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                        className=" fas fa-file-invoice" ></span>

                                </Button>
                                : null // **else null
                    }


                    {
                        ((userAccState.RoleAccess_IsPrint)) &&
                        <Button
                            type="button"
                            id={`btn-dounload-${rowData.id}`}
                            className={downBtnCss}
                            disabled={listBtnLoading}
                            title={`Print ${ButtonMsgLable}`}
                            onClick={() => {
                                const btnId = `btn-dounload-${rowData.id}`
                                downHandler(rowData, undefined, btnId)
                            }}
                        >
                            {(listBtnLoading === `btn-dounload-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="bx bx-printer font-size-16"></i>
                            }

                        </Button>
                    }

                    {
                        (userAccState.RoleAccess_IsMultipleInvoicePrint) &&
                        < Button
                            type="button"
                            id={`btn-MultiInvoice-${rowData.id}`}
                            className={printBtnCss}
                            disabled={listBtnLoading}
                            title={`MultipleInvoices`}
                            onClick={() => {
                                const btnId = `btn-MultiInvoice-${rowData.id}`
                                const downbtnType = "IsMultipleInvoicePrint"
                                downHandler(rowData, downbtnType, btnId)
                            }}
                        >
                            {(listBtnLoading === `btn-MultiInvoice-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                    className=" fas fa-file-download" ></span>
                            }
                        </Button>
                    }

                    {
                        (updateBtnFunc) &&
                        <Button style={{ width: "30px" }}
                            type="button"
                            id={`btn-delete-${rowData.id}`}
                            className={makeBtnCss}
                            disabled={listBtnLoading}
                            title={`Update ${ButtonMsgLable}`}
                            onClick={() => {
                                const btnId = `btn-delete-${rowData.id}`
                                updateBtnFunc(rowData, mode.copy, btnId)
                            }}
                        >
                            {(listBtnLoading === `btn-delete-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i class="mdi mdi-file-table-box-multiple font-size-16"></i>
                            }

                        </Button>
                    }

                    {
                        (userAccState.RoleAccess_IsDelete && !forceDeleteHide)
                            ?
                            <Button
                                type="button"
                                className={deltBtnCss}
                                id={`btn-delete-${rowData.id}`}
                                title={`Delete ${ButtonMsgLable}`}
                                disabled={listBtnLoading}
                                onClick={() => {
                                    const btnId = `btn-delete-${rowData.id}`
                                    deleteHandler(rowData, btnId)
                                }}
                            >
                                {(deleteBtnLoading === `btn-delete-${rowData.id}`) ?
                                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                    : <i className="mdi mdi-delete font-size-16"></i>
                                }

                            </Button>
                            /*chnage delete-self functionality  autho by- Rohit date: 22-08-022 
                            line no 88 to 108
                            */
                            :
                            ((userAccState.RoleAccess_IsDeleteSelf) && (rowData.CreatedBy === userCreated) && !forceDeleteHide)
                                ?
                                <Button
                                    type="button"
                                    className={deltBtnCss}
                                    id={`btn-delete-${rowData.id}`}
                                    disabled={listBtnLoading}
                                    title={`Delete ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnId = `btn-delete-${rowData.id}`
                                        deleteHandler(rowData, btnId)
                                    }}
                                >
                                    {(listBtnLoading === `btn-delete-${rowData.id}`) ?
                                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                        : <i className="mdi mdi-delete font-size-16"></i>
                                    }

                                </Button>
                                :// btn dissable only show body
                                <Button
                                    type="button"
                                    title={'Access Not Allow'}
                                    className={dissableBtnCss}
                                    disabled={true}
                                    style={dissableStyle}
                                >
                                    <i className="mdi mdi-delete font-size-16"></i>
                                </Button>  // **else null
                    }
                    {
                        ((userAccState.RoleAccess_IsSave) && (userAccState.RoleAccess_IsCopy)) ?
                            <Button
                                type="button"
                                id={`btn-delete-${rowData.id}`}
                                className={editSelfBtnCss}
                                title={`Copy ${ButtonMsgLable}`}
                                disabled={listBtnLoading}
                                onClick={() => {
                                    const btnId = `btn-delete-${rowData.id}`
                                    copyHandler(rowData, mode.copy, btnId)
                                }}
                            >
                                {(listBtnLoading === `Copy ${ButtonMsgLable}`) ?
                                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                    : <i className="bx bxs-copy font-size-18 "></i>
                                }


                            </Button>
                            : null
                    }
                    {

                        ((oderAprovalBtnFunc && !forceDeleteHide && !forceDeleteHide && !forceHideOrderAprovalBtn)) ?
                            <Button
                                type="button"
                                id={`btn-orderApproval-${rowData.id}`}
                                className={makeBtnCss}
                                disabled={listBtnLoading}
                                title={`Order Approval `}
                                onClick={() => {
                                    const btnId = `btn-orderApproval-${rowData.id}`;
                                    oderAprovalBtnFunc(rowData, mode.orderApproval, btnId)
                                }}
                            >
                                <i className="bx bx-check-shield font-size-20"></i>
                            </Button>
                            : (oderAprovalBtnFunc) ?
                                // btn dissable only show body
                                <Button
                                    type="button"
                                    title={'Access Not Allow'}
                                    className={dissableBtnCss}
                                    disabled={true}
                                    style={dissableStyle}
                                >
                                    {(listBtnLoading === `btn-orderApproval-${rowData.id}`) ?
                                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                        : <i className="bx bx-check-shield font-size-20"></i>
                                    }
                                </Button>  // **else null
                                : null
                    }


                </div >
            )
        }
    });
}



export const E_WayBill_ActionsButtonFunc = (props) => {
    const {
        dispatch,
    } = props;

    function Uploaded_EwayBillHander(e, RowData) {
        try {
            dispatch(Uploaded_EwayBillAction(RowData.id))
        } catch (error) { }
    };

    function Cancel_EwayBillHander(e, RowData) {
        try {
            dispatch(Cancel_EwayBillAction(RowData.id))
        } catch (error) { }
    };

    function Print_EwayBillHander(e, RowData) {
        const { InvoiceUploads } = RowData;
        if (!(InvoiceUploads === undefined) && (InvoiceUploads.length > 0)) {
            const pdfUrl = `https://${InvoiceUploads[0].EwayBillUrl}`;
            window.open(pdfUrl, '_blank');
        }
    };

    return ({
        text: "E-Way Bill",
        formatter: (__cell, rowData) => {

            return (
                <div id="ActionBtn" className="center gap-3 p-0" >

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EwayBillNo === null)) ?
                        <Button
                            type="button"
                            className={editBtnCss}
                            title={`E-WayBill Upload`}
                            onClick={(e,) => Uploaded_EwayBillHander(e, rowData)}
                        >
                            <i className="bx bx-upload font-size-14"></i>
                        </Button> :
                        !(rowData.InvoiceUploads[0].EwayBillNo === null) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-upload font-size-14"></i>
                        </Button>
                    }

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EwayBillIsCancel === false)) ?
                        < Button
                            type="button"
                            className={deltBtnCss}
                            title={`Cancel E-WayBill`
                            }
                            onClick={(e,) => Cancel_EwayBillHander(e, rowData)}
                        >
                            <i className="mdi mdi-cancel font-size-14"></i>
                        </Button > :
                        (rowData.InvoiceUploads[0].EwayBillIsCancel === true) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="mdi mdi-cancel font-size-14"></i>
                        </Button>
                    }

                    {((rowData.InvoiceUploads.length === 0) || !(rowData.InvoiceUploads[0].EwayBillUrl === null)) ?
                        <Button
                            type="button"
                            className={printInvoiceBtnCss}
                            title={`Print E-WayBill`}
                            onClick={(e,) => Print_EwayBillHander(e, rowData)}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button> :
                        (rowData.InvoiceUploads[0].EwayBillUrl === null) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button>
                    }


                </div >
            )
        }
    });
}

export const E_Invoice_ActionsButtonFunc = (props) => {
    const {
        dispatch,
    } = props;

    function Uploaded_EInvoiceHandler(e, RowData) {
        try {
            dispatch(Uploaded_EInvoiceAction(RowData.id))
        } catch (error) { }
    };

    function Cancel_EInvoiceHandler(e, RowData) {
        try {
            dispatch(Cancel_EInvoiceAction(RowData.id))
        } catch (error) { }
    };

    function Print_InvoiceHander(e, RowData) {
        const { InvoiceUploads } = RowData;
        if (!(InvoiceUploads === undefined) && (InvoiceUploads.length > 0)) {
            const pdfUrl = InvoiceUploads[0].EInvoicePdf;
            window.open(pdfUrl, '_blank');
        }
    };


    return ({
        text: "E-Invoice",
        formatter: (__cell, rowData) => {

            return (
                <div id="ActionBtn" className="center gap-3 p-0" >

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].Irn === null)) ?
                        <Button
                            type="button"
                            className={editBtnCss}
                            title={`E-Invoice Upload`}
                            onClick={(e,) => Uploaded_EInvoiceHandler(e, rowData)}
                        >
                            <i className="bx bx-upload font-size-14"></i>
                        </Button> :
                        !(rowData.InvoiceUploads[0].Irn === null) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-upload font-size-14"></i>
                        </Button>
                    }

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EInvoiceIsCancel === false)) ?
                        <Button
                            type="button"
                            className={deltBtnCss}
                            title={`Cancel E-Invoice`}
                            onClick={(e,) => Cancel_EInvoiceHandler(e, rowData)}
                        >
                            <i className="mdi mdi-cancel font-size-14"></i>
                        </Button> :
                        (rowData.InvoiceUploads[0].EInvoiceIsCancel === true) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="mdi mdi-cancel font-size-14"></i>
                        </Button>
                    }

                    {((rowData.InvoiceUploads.length === 0) || !(rowData.InvoiceUploads[0].EInvoicePdf === null)) ?
                        <Button
                            type="button"
                            className={printInvoiceBtnCss}
                            title={`Print E-Invoice`}
                            onClick={(e,) => Print_InvoiceHander(e, rowData)}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button> :
                        (rowData.InvoiceUploads[0].EInvoicePdf === null) &&
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button>
                    }

                </div >
            )
        }
    });

}


