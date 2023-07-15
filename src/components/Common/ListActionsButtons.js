import { Button, Spinner } from "reactstrap";
import * as mode from "../../routes/PageMode"
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { btnIsDissablefunc, date_dmy_func, loginSystemSetting, loginUserID } from "./CommonFunction"
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
        viewBtnFunc,
        otherBtn_1Func,
        makeBtnFunc = () => { },
        pageMode,
        makeBtnName,
        makeBtnShow = false,
        oderAprovalBtnFunc,
    } = props;

    const { listBtnLoading } = props.reducers;

    const userCreated = loginUserID();
    const subPageMode = history.location.pathname;

    const createButton = (
        id,
        className,
        title,
        disabled,
        loadingKey,
        onClick,
        children
    ) => {
        return (
            <Button
                type="button"
                id={id}
                className={className}
                title={title}
                disabled={disabled}
                onClick={onClick}
            >
                {listBtnLoading === loadingKey ? (
                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                ) : (
                    children
                )}
            </Button>
        );
    };

    const renderEditButton = (rowData, btnmode, btnId) => {
        try {
            let config = { editId: rowData.id, btnmode, subPageMode, btnId };
            if (editBodyfunc) {
                editBodyfunc({ rowData, btnmode, subPageMode, btnId });
            } else {
                dispatch(editActionFun({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            });
        }
    };

    const renderCopyButton = (rowData, btnmode, btnId) => {
        try {
            let config = { editId: rowData.id, btnmode, subPageMode, btnId };
            if (copyBodyfunc) {
                copyBodyfunc({ rowData, btnmode, subPageMode, btnId });
            } else {
                dispatch(editActionFun({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            });
        }
    };

    const renderDownButton = (rowData, downbtnType, btnId) => {
        try {
            downBtnFunc(rowData, downbtnType, btnId);
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            });
        }
    };

    const renderViewButton = (rowData, btnmode, btnId) => {
        try {
            let config = { editId: rowData.id, viewId: rowData.id, btnmode, subPageMode, btnId }
            if (viewBtnFunc) {
                viewBtnFunc({ ...config });
            }
            else if (editBodyfunc) {
                editBodyfunc({ rowData, btnmode, subPageMode, btnId })
            } else {
                dispatch(editActionFun({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            });
        }
    };

    const renderDeleteButton = async (rowData, btnId) => {
        try {
            if (deleteBodyfunc) {
                let config = { rowData, subPageMode, btnId };
                deleteBodyfunc({ ...config });
                return;
            } else {
                let alertRepsponse = await customAlert({
                    Type: 8,
                    Message: `Are you sure you want to delete this ${ButtonMsgLable}: "${rowData[deleteName]}"`,
                });
                if (alertRepsponse) {
                    let config = { deleteId: rowData.id, subPageMode, btnId };
                    dispatch(deleteActionFun({ ...config }));
                }
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not define",
            });
        }
    };

    const renderMakeButton = (rowData, btnId) => {
        rowData["hasSelect"] = true;
        let arr = [];
        arr.push(rowData);
        makeBtnFunc(arr, btnId);
    };

    const renderOrderApprovalButton = (rowData, btnId) => {
        oderAprovalBtnFunc(rowData, mode.orderApproval, btnId);
    };

    const renderActionButton = (__cell, rowData, __key, formatExtra) => {
        let { listBtnLoading } = formatExtra;
        let forceEditHide = rowData.forceEditHide;
        let forceDeleteHide = rowData.forceDeleteHide;
        let forceHideOrderAprovalBtn = rowData.forceHideOrderAprovalBtn;
        let forceMakeBtn = rowData.forceMakeBtn;
        rowData["hasSelect"] = false;
        debugger
        const canEdit = userAccState.RoleAccess_IsEdit && !forceEditHide;

        const canEditSelf = !canEdit && userAccState.RoleAccess_IsEditSelf &&
            rowData.CreatedBy === userCreated && !forceEditHide;

        const canView = !canEdit && !canEditSelf && userAccState.RoleAccess_IsView;

        const disabelEdit = ((userAccState.RoleAccess_IsEdit || userAccState.RoleAccess_IsEditSelf)
            && (!canEdit && !canEditSelf && !canView))

        const canPrint = userAccState.RoleAccess_IsPrint;


        const canMultiplePrint = userAccState.RoleAccess_IsMultipleInvoicePrint;

        const canDelete = userAccState.RoleAccess_IsDelete && !forceDeleteHide;

        const canDeleteSelf = !canDelete && userAccState.RoleAccess_IsDeleteSelf &&
            rowData.CreatedBy === userCreated && !forceDeleteHide;

        const canDeleteDisable = ((userAccState.RoleAccess_IsDelete || userAccState.RoleAccess_IsDeleteSelf) && (!canDelete && !canDeleteSelf))

        const canCopy = userAccState.RoleAccess_IsSave && userAccState.RoleAccess_IsCopy;
        const canMakeBtn = ((pageMode === mode.modeSTPList) && makeBtnShow && !forceMakeBtn);

        const canMakeBtnDisable = (!canMakeBtn && (pageMode === mode.modeSTPList) && makeBtnShow);

        const canOrderApproval = oderAprovalBtnFunc && !forceDeleteHide && !forceDeleteHide && !forceHideOrderAprovalBtn;
        const canOrderApprovalDisable = !canOrderApproval && oderAprovalBtnFunc;

        return (
            <div id="ActionBtn" className="center gap-3">
                {canEdit && (
                    <Button
                        type="button"
                        id={`btn-edit-${rowData.id}`}
                        className={editBtnCss}
                        title={`Edit ${ButtonMsgLable}`}
                        disabled={listBtnLoading}
                        onClick={() => renderEditButton(rowData, mode.edit, `btn-edit-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-edit-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="mdi mdi-pencil font-size-16" ></i>
                        }
                    </Button>
                )}

                {canEditSelf && (
                    <Button
                        type="button"
                        id={`btn-edit-${rowData.id}`}
                        className={editSelfBtnCss}
                        title={`EditSelf ${ButtonMsgLable}`}
                        disabled={listBtnLoading}
                        onClick={() => renderEditButton(rowData, mode.edit, `btn-edit-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-edit-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="mdi mdi-pencil font-size-16" ></i>
                        }

                    </Button>
                )}

                {canView && (
                    <Button
                        type="button"
                        disabled={listBtnLoading}
                        className={editSelfBtnCss}
                        id={`btn-view-${rowData.id}`}
                        title={`View ${ButtonMsgLable}`}
                        onClick={() => renderViewButton(rowData, mode.view, `btn-view-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-view-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="bx bxs-show font-size-16 "></i>
                        }
                    </Button>
                )}
                {disabelEdit && (
                    <Button
                        type="button"
                        title={'Access Not Allow'}
                        className={dissableBtnCss}
                        disabled={true}
                        style={dissableStyle}
                    >
                        <i className="mdi mdi-pencil font-size-16" ></i>
                    </Button>  // **else null
                )}


                {canMakeBtn && (
                    <Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className={makeBtnCss}
                        title={makeBtnName}
                        disabled={listBtnLoading}
                        onClick={() => renderMakeButton(rowData, `btn-makeBtn-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                className=" fas fa-file-invoice" ></span>
                        }
                    </Button>
                )}
                {canMakeBtnDisable && (
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
                )}

                {canPrint && (
                    <Button
                        type="button"
                        id={`btn-dounload-${rowData.id}`}
                        className={downBtnCss}
                        disabled={listBtnLoading}
                        title={`Print ${ButtonMsgLable}`}
                        onClick={() => renderDownButton(rowData, "singlePrint", `btn-dounload-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-dounload-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="bx bx-printer font-size-16"></i>
                        }
                    </Button>
                )}

                {canMultiplePrint && (
                    <Button
                        type="button"
                        id={`btn-MultiInvoice-${rowData.id}`}
                        className={printBtnCss}
                        disabled={listBtnLoading}
                        title={`MultipleInvoices`}
                        onClick={() => renderDownButton(rowData, "IsMultipleInvoicePrint", `btn-MultiInvoice-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-MultiInvoice-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                className=" fas fa-file-download" ></span>
                        }
                    </Button>
                )}

                {otherBtn_1Func && (
                    <Button
                        style={{ width: "30px" }}
                        type="button"
                        id={`btn-otherBtn_1-${rowData.id}`}
                        className={makeBtnCss}
                        disabled={listBtnLoading}
                        title={`Update ${ButtonMsgLable}`}
                        onClick={() => otherBtn_1Func(rowData, mode.copy, `btn-otherBtn_1-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-otherBtn_1-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i class="mdi mdi-file-table-box-multiple font-size-16"></i>
                        }
                    </Button>
                )}

                {canDelete && (
                    <Button
                        type="button"
                        className={deltBtnCss}
                        id={`btn-delete-${rowData.id}`}
                        title={`Delete ${ButtonMsgLable}`}
                        disabled={listBtnLoading}
                        onClick={() => renderDeleteButton(rowData, `btn-delete-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-delete-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="mdi mdi-delete font-size-16"></i>
                        }
                    </Button>
                )}

                {canDeleteSelf && (
                    <Button
                        type="button"
                        className={deltBtnCss}
                        id={`btn-delete-${rowData.id}`}
                        disabled={listBtnLoading}
                        title={`Delete ${ButtonMsgLable}`}
                        onClick={() => renderDeleteButton(rowData, `btn-delete-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-delete-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="mdi mdi-delete font-size-16"></i>
                        }
                    </Button>
                )}
                {canDeleteDisable && (
                    <Button
                        type="button"
                        title={'Access Not Allow'}
                        className={dissableBtnCss}
                        disabled={true}
                        style={dissableStyle}
                    >
                        <i className="mdi mdi-delete font-size-16"></i>
                    </Button>  // **else null
                )}

                {canCopy && (
                    <Button
                        type="button"
                        id={`btn-IsCopy-${rowData.id}`}
                        className={editSelfBtnCss}
                        title={`Copy ${ButtonMsgLable}`}
                        disabled={listBtnLoading}
                        onClick={() => renderCopyButton(rowData, mode.copy, `btn-IsCopy-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-IsCopy-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="bx bxs-copy font-size-18 "></i>
                        }

                    </Button>
                )}

                {canOrderApproval && (
                    <Button
                        type="button"
                        id={`btn-orderApproval-${rowData.id}`}
                        className={makeBtnCss}
                        disabled={listBtnLoading}
                        title={`Order Approval`}
                        onClick={() => renderOrderApprovalButton(rowData, `btn-orderApproval-${rowData.id}`)}
                    >
                        {(listBtnLoading === `btn-orderApproval-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <i className="bx bx-check-shield font-size-20"></i>
                        }
                    </Button>
                )}
                {canOrderApprovalDisable && (
                    <Button
                        type="button"
                        title={'Access Not Allow'}
                        className={dissableBtnCss}
                        disabled={true}
                        style={dissableStyle}
                    >
                        <i className="bx bx-check-shield font-size-20"></i>
                    </Button>
                )}

            </div>
        );
    };


    return {
        text: "Action",
        formatExtraData: { listBtnLoading },
        hidden:
            !(
                userAccState.RoleAccess_IsEdit ||
                userAccState.RoleAccess_IsPrint ||
                userAccState.RoleAccess_IsMultipleInvoicePrint ||
                userAccState.RoleAccess_IsView ||
                userAccState.RoleAccess_IsDelete ||
                userAccState.RoleAccess_IsDeleteSelf ||
                userAccState.RoleAccess_IsEditSelf ||
                makeBtnShow ||
                oderAprovalBtnFunc
            ),
        formatter: renderActionButton,
    };
};































export const E_WayBill_ActionsButtonFunc = ({ dispatch, reducers }) => {

    const { listBtnLoading, } = reducers;

    function Uploaded_EwayBillHandler(btnId, rowData) {
        try {
            let config = { btnId, RowId: rowData.id, UserID: loginUserID() }
            dispatch(Uploaded_EwayBillAction(config))
        } catch (error) { }
    };

    function Cancel_EwayBillHandler(btnId, rowData) {
        try {
            dispatch(Cancel_EwayBillAction({ btnId, RowId: rowData.id, UserID: loginUserID() }))
        } catch (error) { }
    };

    function Print_EwayBillHander(rowData) {
        const { InvoiceUploads } = rowData;
        if (!(InvoiceUploads === undefined) && (InvoiceUploads.length > 0)) {
            const pdfUrl = `https://${InvoiceUploads[0].EwayBillUrl}`;
            let filename = `EwayBill/${rowData.Customer}/${date_dmy_func(rowData.InvoiceDate)}`
            window.open(pdfUrl, filename);
        }
    };

    return ({
        text: "E-Way Bill",
        formatExtraData: { listBtnLoading: listBtnLoading, },
        formatter: (__cell, rowData, __key, formatExtra) => {
            let { listBtnLoading } = formatExtra;
            return (
                <div id="ActionBtn" className="center gap-3 p-0" >

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EwayBillNo === null)) ?
                        <Button
                            type="button"
                            className={editBtnCss}
                            id={`btn-E-WayBill-Upload-${rowData.id}`}
                            title={`E-WayBill Upload`}
                            disabled={listBtnLoading}
                            onClick={() => {
                                let btnId = `btn-E-WayBill-Upload-${rowData.id}`
                                Uploaded_EwayBillHandler(btnId, rowData)
                            }}
                        >
                            {(listBtnLoading === `btn-E-WayBill-Upload-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="bx bx-upload font-size-14"></i>
                            }

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
                            id={`btn-Cancel-E-WayBill-${rowData.id}`}
                            className={deltBtnCss}
                            disabled={listBtnLoading}
                            title={`Cancel E-WayBill`
                            }
                            onClick={() => {
                                let btnId = `btn-Cancel-E-WayBill-${rowData.id}`
                                Cancel_EwayBillHandler(btnId, rowData)
                            }}
                        >
                            {(listBtnLoading === `btn-Cancel-E-WayBill-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="mdi mdi-cancel font-size-14"></i>
                            }

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

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EwayBillUrl === null)) ?
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button> :
                        !(rowData.InvoiceUploads[0].EwayBillUrl === null) &&
                        <Button
                            type="button"
                            id={`btn-Print-E-WayBill-${rowData.id}`}
                            className={printInvoiceBtnCss}
                            disabled={listBtnLoading}
                            title={`Print E-WayBill`}
                            onClick={() => Print_EwayBillHander(rowData)}
                        >
                            {(listBtnLoading === `btn-Print-E-WayBill-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="bx bx-printer font-size-14"></i>
                            }

                        </Button>
                    }

                </div >
            )
        }
    });
}

export const E_Invoice_ActionsButtonFunc = ({ dispatch, reducers }) => {

    const systemSetting = loginSystemSetting();

    if (!(systemSetting.EInvoiceApplicable === "1")) {
        return null; // Return null if the column should be hidden
    }

    const { listBtnLoading, } = reducers;

    function Uploaded_EInvoiceHandler(btnId, rowData) {
        try {
            dispatch(Uploaded_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }))
        } catch (error) { }
    };

    function Cancel_EInvoiceHandler(btnId, rowData) {
        try {
            dispatch(Cancel_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }))
        } catch (error) { }
    };

    function Print_InvoiceHander(rowData) {
        const { InvoiceUploads } = rowData;
        if (!(InvoiceUploads === undefined) && (InvoiceUploads.length > 0)) {
            const pdfUrl = InvoiceUploads[0].EInvoicePdf;
            window.open(pdfUrl, '_blank');
        }
    };

    return ({
        text: "E-Invoice",
        formatExtraData: { listBtnLoading: listBtnLoading },
        formatter: (__cell, rowData, __key, formatExtra) => {
            let { listBtnLoading } = formatExtra;
            return (
                <div id="ActionBtn" className="center gap-3 p-0" >

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].Irn === null)) ?
                        <Button
                            type="button"
                            className={editBtnCss}
                            id={`btn-E-Invoice-Upload-${rowData.id}`}
                            title={`E-Invoice Upload`}
                            disabled={listBtnLoading}
                            onClick={() => {
                                let btnId = `btn-E-Invoice-Upload-${rowData.id}`
                                Uploaded_EInvoiceHandler(btnId, rowData)
                            }}
                        >
                            {(listBtnLoading === `btn-E-Invoice-Upload-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="bx bx-upload font-size-14"></i>
                            }

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
                            id={`btn-Cancel-E-Invoice-${rowData.id}`}
                            className={deltBtnCss}
                            title={`Cancel E-Invoice`}
                            disabled={listBtnLoading}
                            onClick={() => {
                                let btnId = `btn-Cancel-E-Invoice-${rowData.id}`
                                Cancel_EInvoiceHandler(btnId, rowData)
                            }}
                        >
                            {(listBtnLoading === `btn-Cancel-E-Invoice-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="mdi mdi-cancel font-size-14"></i>
                            }

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

                    {((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0].EInvoicePdf === null)) ?
                        <Button
                            type="button"
                            title={'Access Not Allow'}
                            className={dissableBtnCss}
                            disabled={true}
                            style={dissableStyle}
                        >
                            <i className="bx bx-printer font-size-14"></i>
                        </Button> :
                        !(rowData.InvoiceUploads[0].EInvoicePdf === null) &&
                        <Button
                            type="button"
                            id={`btn-Print-E-Invoice-${rowData.id}`}
                            className={printInvoiceBtnCss}
                            disabled={listBtnLoading}
                            title={`Print E-Invoice`}
                            onClick={() => Print_InvoiceHander(rowData)}
                        >
                            {(listBtnLoading === `btn-Print-E-Invoice-${rowData.id}`) ?
                                <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                                : <i className="bx bx-printer font-size-14"></i>
                            }

                        </Button>
                    }

                </div >
            )
        }
    });

}


