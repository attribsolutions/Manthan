import { Button, Spinner } from "reactstrap";
import * as mode from "../../routes/PageMode"
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { date_dmy_func, loginSystemSetting, loginUserID } from "./CommonFunction"
import '../../assets/searchBox/searchBox.scss'
import { Cancel_Credit_Debit_EInvoiceAction, Cancel_EInvoiceAction, Cancel_EwayBillAction, Uploaded_Credit_Debit_EInvoiceAction, Uploaded_EInvoiceAction, Uploaded_EwayBillAction } from "../../store/actions";
import { url } from "../../routes";

//******************** button class ******************************

const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light"
export const vieBtnCss = "badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light"
const copyBtnCss = "badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light"
const updateBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light"
export const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
export const printBtnCss = "badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light "
const printInvoiceBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light"
export const hideBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light "


//******************** icon class ******************************
const editIconClass = "mdi mdi-pencil font-size-16";
const viewIconClass = "bx bxs-show font-size-16";
const approvalviewIconClass = "mdi mdi-eye-check font-size-16";
const makeBtnIconClass = "fas fa-file-invoice font-size-16";
const printIconClass = "bx bx-printer font-size-16";
const multiInvoiceIconClass = "fas fa-file-download";
const updateIconClass = "mdi mdi-file-table-box-multiple font-size-16";
const deleteIconClass = "mdi mdi-delete font-size-16";
const sendToScmIconClass = "fas fa-share font-size-16";  //Icon Added For Invoice send to SCM Button In Invoice Listf
const copyIconClass = "bx bxs-copy font-size-16";
const orderApprovalIconClass = "bx bx-check-shield font-size-20";
const uploadIconClass = "bx bx-upload font-size-14";
const cancelIconClass = "mdi mdi-cancel font-size-14";
const claimCustomerWisePrintIconClass = "fas fa-file-contract font-size-14";  //Icon Added For Claim Print on Claim list
const claimItemWisePrintIconClass = "fas fa-file-signature";  //Icon Added For Claim Print on Claim list
const claimMasterPrintIconClass = "far fa-file-alt font-size-14";  //Icon Added For Claim Print on Claim list
const makeCreditNoteIconClass = "mdi mdi-file-move font-size-16";
// const makeCreditNoteIconClass = "far fa-file-alt font-size-14";  //Icon Added For Claim Print on Claim list











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
        downClaimBtnFunc,
        viewApprovalBtnFunc,
        otherBtn_1Func,
        makeBtnFunc = () => { },
        pageMode,
        makeBtnName,
        makeBtnShow = false,
        oderAprovalBtnFunc,
        sendToScmBtnFunc,
    } = props;

    const { listBtnLoading } = props.reducers;

    const userCreated = loginUserID();
    const subPageMode = history.location.pathname;

    const makeButtonHandler = ({ rowData, btnId }) => {
        rowData["hasSelect"] = true;
        let arr = [];
        arr.push(rowData);
        makeBtnFunc(arr, btnId);
    };

    const renderButtonOnClick = async ({ rowData, btnmode, btnId, actionFunc, dispatchAction, }) => {

        try {
            const config = {
                editId: rowData.id,
                viewId: rowData.id,
                deleteId: rowData.id,
                rowData,
                btnmode,
                subPageMode,
                btnId
            };
            if (actionFunc) {
                actionFunc({ ...config });
            } else {
                if (btnmode === mode.isdelete) {
                    let alertRepsponse = await customAlert({
                        Type: 8,
                        Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
                    })
                    if (alertRepsponse) {
                        dispatch(dispatchAction({ ...config }));
                    }
                } else {
                    dispatch(dispatchAction({ ...config }));
                }
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not defined",
            });
        }
    };

    const renderButtonWithSpinner = (btnmode, spinnerColor, iconClass) => {
        const style = (btnmode === mode.makeBtn) ? { marginLeft: "5px", marginRight: "6px" } : {};

        return (
            <>
                {listBtnLoading === btnmode ? (
                    <Spinner style={{ height: "16px", width: "16px" }} color={spinnerColor} />
                ) : (
                    <i className={iconClass} style={style}></i>
                )}
            </>
        );
    };

    const renderActionButton = (__cell, rowData, __key, formatExtra) => {


        const { listBtnLoading } = formatExtra;
        const {
            forceEditHide,
            forceDeleteHide,
            forceHideOrderAprovalBtn,
            forceMakeBtnHide,
            IsRecordDeleted
        } = rowData;
        rowData.hasSelect = false;

        //Code For Button Visible only for Login Those Party Type Id match in Comaseprate String of rowData.isSendToScm
        let isPartyTypeIDInSendToScm = ""
        if (rowData.isSendToScm) {
            isPartyTypeIDInSendToScm = rowData.isSendToScm
                .split(',')
                .map(value => parseInt(value))
                .includes(rowData.CustomerPartyType);
        }

        const hasRole = (role) => userAccState[role];
        const canEdit = hasRole("RoleAccess_IsEdit") && !forceEditHide;
        const canEditSelf = hasRole("RoleAccess_IsEditSelf") && !canEdit && rowData.CreatedBy === userCreated && !forceEditHide;
        const canView = hasRole("RoleAccess_IsView") && !canEdit && !canEditSelf && !viewApprovalBtnFunc;
        const canApprovalView = hasRole("RoleAccess_IsView") && !canEdit && !canEditSelf && viewApprovalBtnFunc;
        const canPrint = hasRole("RoleAccess_IsPrint") && !downClaimBtnFunc;
        const canMultiInvoicePrint = hasRole("RoleAccess_IsMultipleInvoicePrint");
        const canDelete = hasRole("RoleAccess_IsDelete") && !forceDeleteHide;
        const canDeleteSelf = hasRole("RoleAccess_IsDeleteSelf") && !canDelete && rowData.CreatedBy === userCreated && !forceDeleteHide;
        const canCopy = hasRole("RoleAccess_IsSave") && hasRole("RoleAccess_IsCopy");
        const canMakeBtn = pageMode === mode.modeSTPList && makeBtnShow && !forceMakeBtnHide;
        const canOrderApproval = oderAprovalBtnFunc && !forceHideOrderAprovalBtn;

        const canCustomerWisePrint = hasRole("RoleAccess_IsPrint") && downClaimBtnFunc;
        const canItemWisePrint = hasRole("RoleAccess_IsPrint") && downClaimBtnFunc;
        const canMasterClaimPrint = hasRole("RoleAccess_IsPrint") && downClaimBtnFunc;
        const canSendToScm = isPartyTypeIDInSendToScm //  Currently Button  is remove From InVoice List of CX parties  further Development After Discussion  So condition is False
        const canMakeCreditNoteBtn = (subPageMode === url.SALES_RETURN_LIST)



        const dummyDisable_OrderApproval = !canOrderApproval && oderAprovalBtnFunc;
        const dummyDisable_Edit = (userAccState.RoleAccess_IsEdit || userAccState.RoleAccess_IsEditSelf) && !canEdit && !canEditSelf && !canView && !viewApprovalBtnFunc;
        const dummyDisable_Delete = (hasRole("RoleAccess_IsDelete") || hasRole("RoleAccess_IsDeleteSelf")) && !canDelete && !canDeleteSelf;
        const dummyDisable_MakeBtn = !canMakeBtn && makeBtnShow;
        const dummyDisable_SendToScm = !isPartyTypeIDInSendToScm && sendToScmBtnFunc;




        const renderButtonIfNeeded = ({ condition, btnmode, iconClass, actionFunc, dispatchAction, title, buttonClasss, isDummyBtn }) => {
            if ((!condition && !isDummyBtn) || IsRecordDeleted) return null;
            if (!isDummyBtn) {

                return (
                    <Button
                        type="button"
                        id={`btn-${btnmode}-${rowData.id}`}
                        className={buttonClasss}
                        title={`${title} ${ButtonMsgLable}`}
                        // disabled={listBtnLoading}
                        onClick={() => {
                            if (!listBtnLoading) {
                                renderButtonOnClick({
                                    rowData: rowData,
                                    btnmode: mode[btnmode],
                                    btnId: `btn-${btnmode}-${rowData.id}`,
                                    actionFunc: actionFunc,
                                    dispatchAction: dispatchAction
                                })
                            }
                        }
                        }
                    >
                        {renderButtonWithSpinner(`btn-${btnmode}-${rowData.id}`, "white", iconClass)}
                    </Button>
                );
            }
            else {
                return (
                    < Button
                        type="button"
                        id={`btn-${btnmode}-${rowData.id}`}
                        className={`${buttonClasss} c_disableBtn`}
                    >
                        <i className={iconClass} ></i>
                    </Button >
                )
            }
        };

        return (
            <span>
                <div id="ActionBtn">
                    {renderButtonIfNeeded({
                        condition: canEdit,
                        btnmode: mode.edit,
                        iconClass: editIconClass,
                        actionFunc: editBodyfunc,
                        dispatchAction: editActionFun,
                        title: "Edit",
                        buttonClasss: editBtnCss,
                        isDummyBtn: dummyDisable_Edit
                    })}
                    {renderButtonIfNeeded({
                        condition: canEditSelf,
                        btnmode: mode.edit,
                        iconClass: editIconClass,
                        actionFunc: editBodyfunc,
                        dispatchAction: editActionFun,
                        title: "EditSelf",
                        buttonClasss: editSelfBtnCss,
                    })}
                    {renderButtonIfNeeded({
                        condition: canView,
                        btnmode: mode.view,
                        iconClass: viewIconClass,
                        dispatchAction: editActionFun,
                        title: "View",
                        buttonClasss: vieBtnCss,
                    })}

                    {renderButtonIfNeeded({
                        condition: canApprovalView,
                        btnmode: mode.viewApproval,
                        iconClass: approvalviewIconClass,
                        actionFunc: viewApprovalBtnFunc,
                        title: "View Items -",
                        buttonClasss: vieBtnCss,
                    })}



                    {renderButtonIfNeeded({
                        condition: canMakeBtn,
                        btnmode: mode.makeBtn,
                        iconClass: makeBtnIconClass,
                        actionFunc: makeButtonHandler,
                        title: makeBtnName,
                        buttonClasss: makeBtnCss,
                        isDummyBtn: dummyDisable_MakeBtn
                    })}

                    {renderButtonIfNeeded({   // Button Added For Make Goods Credit Note In Sales Return
                        condition: canMakeCreditNoteBtn,
                        btnmode: mode.makeBtn,
                        iconClass: makeCreditNoteIconClass,
                        actionFunc: makeButtonHandler,
                        title: makeBtnName,
                        buttonClasss: vieBtnCss,

                    })}

                    {renderButtonIfNeeded({
                        condition: canPrint,
                        btnmode: mode.download,
                        iconClass: printIconClass,
                        actionFunc: downBtnFunc,
                        title: "Print",
                        buttonClasss: printBtnCss,
                    })}
                    {renderButtonIfNeeded({
                        condition: canMultiInvoicePrint,
                        btnmode: mode.MultiInvoice,
                        iconClass: multiInvoiceIconClass,
                        actionFunc: downBtnFunc,
                        title: "MultipleInvoices",
                        buttonClasss: printInvoiceBtnCss,
                    })}
                    {renderButtonIfNeeded({
                        condition: otherBtn_1Func,
                        btnmode: mode.otherBtn_1,
                        iconClass: updateIconClass,
                        actionFunc: otherBtn_1Func,
                        title: "Update",
                        buttonClasss: updateBtnCss,
                    })}
                    {renderButtonIfNeeded({   // Button Added For Customer Wise Claim Summary Print on Claim List page
                        condition: canCustomerWisePrint,
                        btnmode: mode.CustomerWiseSummary,
                        iconClass: claimCustomerWisePrintIconClass,
                        actionFunc: downClaimBtnFunc,
                        title: "Print Customer Wise ",
                        buttonClasss: printBtnCss,
                    })}
                    {renderButtonIfNeeded({ // Button Added For Item Wise Claim Summary Print on Claim List page
                        condition: canItemWisePrint,
                        btnmode: mode.ItemWiseSummary,
                        iconClass: claimItemWisePrintIconClass,
                        actionFunc: downClaimBtnFunc,
                        title: "Print Item Wise",
                        buttonClasss: printBtnCss,
                    })}
                    {renderButtonIfNeeded({ // Button Added For Master Claim Summary Print on Claim List page
                        condition: canMasterClaimPrint,
                        btnmode: mode.MastarClaimSummary,
                        iconClass: claimMasterPrintIconClass,
                        actionFunc: downClaimBtnFunc,
                        title: "Print Master ",
                        buttonClasss: printBtnCss,
                    })}
                    {renderButtonIfNeeded({   //Button Added for Invoice send to SCM  in Invoice List Page
                        condition: canSendToScm,
                        btnmode: mode.isSendToScm,
                        iconClass: sendToScmIconClass,
                        actionFunc: sendToScmBtnFunc,
                        title: "Send To Scm",
                        buttonClasss: makeBtnCss,
                        isDummyBtn: dummyDisable_SendToScm
                    })}



                    {renderButtonIfNeeded({
                        condition: canDelete,
                        btnmode: mode.isdelete,
                        iconClass: deleteIconClass,
                        actionFunc: deleteBodyfunc,
                        dispatchAction: deleteActionFun,
                        title: "Delete",
                        buttonClasss: deltBtnCss,
                        isDummyBtn: dummyDisable_Delete

                    })}
                    {renderButtonIfNeeded({
                        condition: canDeleteSelf,
                        btnmode: mode.isdelete,
                        iconClass: deleteIconClass,
                        actionFunc: deleteBodyfunc,
                        dispatchAction: deleteActionFun,
                        title: "Delete",
                        buttonClasss: deltBtnCss,
                    })}
                    {renderButtonIfNeeded({
                        condition: canCopy,
                        btnmode: mode.copy,
                        iconClass: copyIconClass,
                        actionFunc: copyBodyfunc,
                        title: "Copy",
                        buttonClasss: copyBtnCss,
                    })}
                    {renderButtonIfNeeded({
                        condition: canOrderApproval,
                        btnmode: mode.orderApproval,
                        iconClass: orderApprovalIconClass,
                        actionFunc: oderAprovalBtnFunc,
                        title: "Order Approval",
                        buttonClasss: makeBtnCss,
                        isDummyBtn: dummyDisable_OrderApproval
                    })}


                </div>
            </span>
        );
    };
    const isActionColunmHidden = !(
        userAccState.RoleAccess_IsEdit ||
        userAccState.RoleAccess_IsPrint ||
        userAccState.RoleAccess_IsMultipleInvoicePrint ||
        userAccState.RoleAccess_IsView ||
        userAccState.RoleAccess_IsDelete ||
        userAccState.RoleAccess_IsDeleteSelf ||
        userAccState.RoleAccess_IsEditSelf ||
        makeBtnShow ||
        oderAprovalBtnFunc
    );
    if (isActionColunmHidden) return null;
    return {
        text: "Action",
        dataField: "",
        attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Action", "sticky-col": (colIndex === 0) ? "true" : "false" }),
        formatExtraData: { listBtnLoading },
        formatter: renderActionButton,
    };
};

// ************************* E-Way Bill Button *****************************************************
export const E_WayBill_ActionsButtonFunc = ({ dispatch, reducers, e_WayBill_ActionsBtnFunc, deleteName }) => {

    const { listBtnLoading } = reducers;

    function Uploaded_EwayBillHandler(btnId, rowData) {
        try {

            let config = { btnId, RowId: rowData.id, UserID: loginUserID() };
            if ((rowData.VehicleNo === null) && !(rowData.VehicleNo === "") && (e_WayBill_ActionsBtnFunc)) {
                e_WayBill_ActionsBtnFunc(rowData)
            }
            else {
                dispatch(Uploaded_EwayBillAction(config));
            }
        } catch (error) { }
    }

    async function Cancel_EwayBillHandler(btnId, rowData) {
        try {
            let alertRepsponse = await customAlert({
                Type: 8,
                Message: `Are you sure you want to Cancel EwayBill : "${rowData[deleteName]}"`,
            })
            if (alertRepsponse) {
                dispatch(Cancel_EwayBillAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
            }

        } catch (error) { }
    }

    function Print_EwayBillHander(btnId, rowData) {
        const { InvoiceUploads } = rowData;
        if (!(InvoiceUploads === undefined) && InvoiceUploads.length > 0) {
            const pdfUrl = `https://${InvoiceUploads[0].EwayBillUrl}`;
            let filename = `EwayBill/${rowData.Customer}/${date_dmy_func(rowData.InvoiceDate)}`;
            window.open(pdfUrl, filename);
        }
    }

    const getButtonClassName = (btnmode) => {
        if (btnmode === "E-WayBill-Upload") {
            return editBtnCss;
        } else if (btnmode === "Cancel-E-WayBill") {
            return deltBtnCss;
        } else if (btnmode === "Print-E-WayBill") {
            return printInvoiceBtnCss;
        } else {
            return "";
        }
    };

    const renderButtonIfNeeded = ({ condition, btnmode, iconClass, actionFunc, title, rowData, isDummyBtn }) => {
        if (!condition && !isDummyBtn) return null;
        if (!isDummyBtn) {
            return (
                <Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={getButtonClassName(btnmode)}
                    title={title}
                    onClick={() => {
                        if (!listBtnLoading) {
                            let btnId = `btn-${btnmode}-${rowData.id}`;
                            actionFunc(btnId, rowData);
                        }
                    }
                    }
                >
                    {listBtnLoading === `btn-${btnmode}-${rowData.id}` ? (
                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    ) : (
                        <i className={iconClass}></i>
                    )}
                </Button>
            );
        }
        else {
            return (
                < Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={`${getButtonClassName(btnmode)} c_disableBtn`}
                >
                    <i className={iconClass} ></i>
                </Button >
            )
        }
    };

    return {
        text: "E-Way Bill",
        formatExtraData: { listBtnLoading },
        formatter: (__cell, rowData,) => {

            const canUpload = ((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0]?.EwayBillNo === null));
            const canCancel = (!canUpload && (rowData.InvoiceUploads[0]?.EwayBillIsCancel === false));
            const canPrint = (!canUpload && (rowData.InvoiceUploads[0]?.EwayBillUrl !== null));

            return (
                <div id="ActionBtn">
                    {renderButtonIfNeeded({
                        condition: canUpload,
                        btnmode: "E-WayBill-Upload",
                        iconClass: uploadIconClass,
                        actionFunc: Uploaded_EwayBillHandler,
                        title: "E-WayBill Upload",
                        rowData: rowData,
                        isDummyBtn: !canUpload
                    })}

                    {renderButtonIfNeeded({
                        condition: canCancel,
                        btnmode: "Cancel-E-WayBill",
                        iconClass: cancelIconClass,
                        actionFunc: Cancel_EwayBillHandler,
                        title: "Cancel E-WayBill",
                        rowData: rowData,
                        isDummyBtn: !canCancel
                    })}

                    {renderButtonIfNeeded({
                        condition: canPrint,
                        btnmode: "Print-E-WayBill",
                        iconClass: printIconClass,
                        actionFunc: Print_EwayBillHander,
                        title: "Print E-WayBill",
                        rowData: rowData,
                        isDummyBtn: !canPrint

                    })}
                </div>
            );
        },
    };
};

// ************************* E-Invoice Button *****************************************************

export const E_Invoice_ActionsButtonFunc = ({ dispatch, reducers, deleteName }) => {
    const { listBtnLoading } = reducers;

    function Uploaded_EInvoiceHandler(btnId, rowData) {

        try {
            if (rowData.PageMode === "CreditDebitList") {
                dispatch(Uploaded_Credit_Debit_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
            } else {
                dispatch(Uploaded_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
            }
        } catch (error) { }
    }

    async function Cancel_EInvoiceHandler(btnId, rowData) {

        try {
            let alertRepsponse = await customAlert({
                Type: 8,
                Message: `Are you sure you want to Cancel EInvoice : "${rowData[deleteName]}"`,
            })
            if (alertRepsponse) {
                if (rowData.PageMode === "CreditDebitList") {
                    dispatch(Cancel_Credit_Debit_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
                } else {
                    dispatch(Cancel_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));

                }
            }

        } catch (error) { }
    }

    function Print_InvoiceHander(btnId, rowData) {
        const { InvoiceUploads } = rowData;
        if (!(InvoiceUploads === undefined) && InvoiceUploads.length > 0) {
            const pdfUrl = InvoiceUploads[0].EInvoicePdf;
            window.open(pdfUrl, "_blank");
        }
    }

    const getButtonClassName = (btnmode) => {
        if (btnmode === "E-Invoice-Upload") {
            return editBtnCss;
        } else if (btnmode === "Cancel-E-Invoice") {
            return deltBtnCss;
        } else if (btnmode === "Print-E-Invoice") {
            return printInvoiceBtnCss;
        }
        return "";
    };

    const renderButtonIfNeeded = ({ condition, btnmode, iconClass, actionFunc, title, rowData, isDummyBtn }) => {
        if (!condition && !isDummyBtn) return null;
        if (!isDummyBtn) {
            return (
                <Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={getButtonClassName(btnmode)}
                    title={title}
                    onClick={() => {
                        if (!listBtnLoading) {
                            let btnId = `btn-${btnmode}-${rowData.id}`;
                            actionFunc(btnId, rowData);
                        }
                    }
                    }
                >
                    {listBtnLoading === `btn-${btnmode}-${rowData.id}` ? (
                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    ) : (
                        <i className={iconClass}></i>
                    )}
                </Button>
            );
        }
        else {
            return (
                < Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={`${getButtonClassName(btnmode)} c_disableBtn`}
                >
                    <i className={iconClass} ></i>
                </Button >
            )
        }
    };

    if (!(loginSystemSetting().EInvoiceApplicable === "1")) {
        return null; // Return null if the column should be hidden
    }
    return {
        text: "E-Invoice",
        formatExtraData: { listBtnLoading },
        formatter: (__cell, rowData) => {

            const canUpload = ((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0]?.Irn === null));
            const canCancel = ((!canUpload) && (rowData.InvoiceUploads[0]?.EInvoiceIsCancel === false));
            const canPrint = ((!canUpload) && (rowData.InvoiceUploads[0]?.EInvoicePdf !== null));

            return (
                <div id="ActionBtn" >
                    {renderButtonIfNeeded({
                        condition: canUpload,
                        btnmode: "E-Invoice-Upload",
                        iconClass: uploadIconClass,
                        actionFunc: Uploaded_EInvoiceHandler,
                        title: "E-Invoice Upload",
                        rowData: rowData,
                        isDummyBtn: !canUpload,
                    })}

                    {renderButtonIfNeeded({
                        condition: canCancel,
                        btnmode: "Cancel-E-Invoice",
                        iconClass: cancelIconClass,
                        actionFunc: Cancel_EInvoiceHandler,
                        title: "Cancel E-Invoice",
                        rowData: rowData,
                        isDummyBtn: !canCancel,
                    })}

                    {renderButtonIfNeeded({
                        condition: canPrint,
                        btnmode: "Print-E-Invoice",
                        iconClass: printIconClass,
                        actionFunc: Print_InvoiceHander,
                        title: "Print E-Invoice",
                        rowData: rowData,
                        isDummyBtn: !canPrint,
                    })}
                </div>
            );
        },
    };
};

