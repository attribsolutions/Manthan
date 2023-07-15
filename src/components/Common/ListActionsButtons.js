import { Button, Spinner } from "reactstrap";
import * as mode from "../../routes/PageMode"
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { date_dmy_func, loginSystemSetting, loginUserID } from "./CommonFunction"
import '../../assets/searchBox/searchBox.scss'
import { Cancel_EInvoiceAction, Cancel_EwayBillAction, Uploaded_EInvoiceAction, Uploaded_EwayBillAction } from "../../store/actions";

const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const vieBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const updateBtnCss = "badge badge-soft-info font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"

export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
export const printBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light "

const printInvoiceBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light"


const editIconClass = "mdi mdi-pencil font-size-16";
const viewIconClass = "bx bxs-show font-size-16";
const makeBtnIconClass = "fas fa-file-invoice font-size-16";
const printIconClass = "bx bx-printer font-size-16";
const multiInvoiceIconClass = "fas fa-file-download";
const updateIconClass = "mdi mdi-file-table-box-multiple font-size-16";
const deleteIconClass = "mdi mdi-delete font-size-16";
const copyIconClass = "bx bxs-copy font-size-18";
const orderApprovalIconClass = "bx bx-check-shield font-size-20";


const uploadIconClass = "bx bx-upload font-size-14";
const cancelIconClass = "mdi mdi-cancel font-size-14";

const dissableStyle = {
    opacity: 0.5,
    cursor: 'not-allowed',
    // backgroundColor: "#adb5bd",
};

// export const listPageActionsButtonFunc1 = (props) => {
//     const {
//         dispatch,
//         history,
//         userAccState,
//         editActionFun,
//         deleteActionFun,
//         ButtonMsgLable,
//         deleteName,
//         downBtnFunc,
//         editBodyfunc,
//         deleteBodyfunc,
//         copyBodyfunc,
//         viewBtnFunc,
//         otherBtn_1Func,
//         makeBtnFunc = () => { },
//         pageMode,
//         makeBtnName,
//         makeBtnShow = false,
//         oderAprovalBtnFunc,
//     } = props;

//     const { listBtnLoading } = props.reducers;

//     const userCreated = loginUserID();
//     const subPageMode = history.location.pathname;


//     const renderEditButton = (rowData, btnmode, btnId) => {
//         try {
//             let config = { editId: rowData.id, btnmode, subPageMode, btnId };
//             if (editBodyfunc) {
//                 editBodyfunc({ rowData, btnmode, subPageMode, btnId });
//             } else {
//                 dispatch(editActionFun({ ...config }));
//             }
//         } catch (error) {
//             customAlert({
//                 Type: 3,
//                 Message: "Action Not define",
//             });
//         }
//     };

//     const renderCopyButton = (rowData, btnmode, btnId) => {
//         try {
//             let config = { editId: rowData.id, btnmode, subPageMode, btnId };
//             if (copyBodyfunc) {
//                 copyBodyfunc({ rowData, btnmode, subPageMode, btnId });
//             } else {
//                 dispatch(editActionFun({ ...config }));
//             }
//         } catch (error) {
//             customAlert({
//                 Type: 3,
//                 Message: "Action Not define",
//             });
//         }
//     };

//     const renderDownButton = (rowData, downbtnType, btnId) => {
//         try {
//             downBtnFunc(rowData, downbtnType, btnId);
//         } catch (error) {
//             customAlert({
//                 Type: 3,
//                 Message: "Action Not define",
//             });
//         }
//     };

//     const renderViewButton = (rowData, btnmode, btnId) => {
//         try {
//             let config = { editId: rowData.id, viewId: rowData.id, btnmode, subPageMode, btnId }
//             if (viewBtnFunc) {
//                 viewBtnFunc({ ...config });
//             }
//             else if (editBodyfunc) {
//                 editBodyfunc({ rowData, btnmode, subPageMode, btnId })
//             } else {
//                 dispatch(editActionFun({ ...config }));
//             }
//         } catch (error) {
//             customAlert({
//                 Type: 3,
//                 Message: "Action Not define",
//             });
//         }
//     };

//     const renderDeleteButton = async (rowData, btnId) => {
//         try {
//             if (deleteBodyfunc) {
//                 let config = { rowData, subPageMode, btnId };
//                 deleteBodyfunc({ ...config });
//                 return;
//             } else {
//                 let alertRepsponse = await customAlert({
//                     Type: 8,
//                     Message: `Are you sure you want to delete this ${ButtonMsgLable}: "${rowData[deleteName]}"`,
//                 });
//                 if (alertRepsponse) {
//                     let config = { deleteId: rowData.id, subPageMode, btnId };
//                     dispatch(deleteActionFun({ ...config }));
//                 }
//             }
//         } catch (error) {
//             customAlert({
//                 Type: 3,
//                 Message: "Action Not define",
//             });
//         }
//     };

//     const renderMakeButton = (rowData, btnId) => {
//         rowData["hasSelect"] = true;
//         let arr = [];
//         arr.push(rowData);
//         makeBtnFunc(arr, btnId);
//     };

//     const renderOrderApprovalButton = (rowData, btnId) => {
//         oderAprovalBtnFunc(rowData, mode.orderApproval, btnId);
//     };

//     const renderActionButton = (__cell, rowData, __key, formatExtra) => {
//         let { listBtnLoading } = formatExtra;
//         let forceEditHide = rowData.forceEditHide;
//         let forceDeleteHide = rowData.forceDeleteHide;
//         let forceHideOrderAprovalBtn = rowData.forceHideOrderAprovalBtn;
//         let forceMakeBtn = rowData.forceMakeBtn;
//         rowData["hasSelect"] = false;

//         const canEdit = userAccState.RoleAccess_IsEdit && !forceEditHide;

//         const canEditSelf = !canEdit && userAccState.RoleAccess_IsEditSelf &&
//             rowData.CreatedBy === userCreated && !forceEditHide;

//         const canView = !canEdit && !canEditSelf && userAccState.RoleAccess_IsView;

//         const disabelEdit = ((userAccState.RoleAccess_IsEdit || userAccState.RoleAccess_IsEditSelf)
//             && (!canEdit && !canEditSelf && !canView))

//         const canPrint = userAccState.RoleAccess_IsPrint;


//         const canMultiplePrint = userAccState.RoleAccess_IsMultipleInvoicePrint;

//         const canDelete = userAccState.RoleAccess_IsDelete && !forceDeleteHide;

//         const canDeleteSelf = !canDelete && userAccState.RoleAccess_IsDeleteSelf &&
//             rowData.CreatedBy === userCreated && !forceDeleteHide;

//         const canDeleteDisable = ((userAccState.RoleAccess_IsDelete || userAccState.RoleAccess_IsDeleteSelf) && (!canDelete && !canDeleteSelf))

//         const canCopy = userAccState.RoleAccess_IsSave && userAccState.RoleAccess_IsCopy;
//         const canMakeBtn = ((pageMode === mode.modeSTPList) && makeBtnShow && !forceMakeBtn);

//         const canMakeBtnDisable = (!canMakeBtn && (pageMode === mode.modeSTPList) && makeBtnShow);

//         const canOrderApproval = oderAprovalBtnFunc && !forceDeleteHide && !forceDeleteHide && !forceHideOrderAprovalBtn;
//         const canOrderApprovalDisable = !canOrderApproval && oderAprovalBtnFunc;

//         return (
//             <div id="ActionBtn" className="center gap-3">
//                 {canEdit && (
//                     <Button
//                         type="button"
//                         id={`btn-edit-${rowData.id}`}
//                         className={editBtnCss}
//                         title={`Edit ${ButtonMsgLable}`}
//                         disabled={listBtnLoading}
//                         onClick={() => renderEditButton(rowData, mode.edit, `btn-edit-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-edit-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="mdi mdi-pencil font-size-16" ></i>
//                         }
//                     </Button>
//                 )}

//                 {canEditSelf && (
//                     <Button
//                         type="button"
//                         id={`btn-edit-${rowData.id}`}
//                         className={editSelfBtnCss}
//                         title={`EditSelf ${ButtonMsgLable}`}
//                         disabled={listBtnLoading}
//                         onClick={() => renderEditButton(rowData, mode.edit, `btn-edit-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-edit-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="mdi mdi-pencil font-size-16" ></i>
//                         }

//                     </Button>
//                 )}

//                 {canView && (
//                     <Button
//                         type="button"
//                         disabled={listBtnLoading}
//                         className={editSelfBtnCss}
//                         id={`btn-view-${rowData.id}`}
//                         title={`View ${ButtonMsgLable}`}
//                         onClick={() => renderViewButton(rowData, mode.view, `btn-view-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-view-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="bx bxs-show font-size-16 "></i>
//                         }
//                     </Button>
//                 )}
//                 {disabelEdit && (
//                     <Button
//                         type="button"
//                         title={'Access Not Allow'}
//                         className={dissableBtnCss}
//                         disabled={true}
//                         style={dissableStyle}
//                     >
//                         <i className="mdi mdi-pencil font-size-16" ></i>
//                     </Button>  // **else null
//                 )}


//                 {canMakeBtn && (
//                     <Button
//                         type="button"
//                         id={`btn-makeBtn-${rowData.id}`}
//                         className={makeBtnCss}
//                         title={makeBtnName}
//                         disabled={listBtnLoading}
//                         onClick={() => renderMakeButton(rowData, `btn-makeBtn-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <span style={{ marginLeft: "6px", marginRight: "6px" }}
//                                 className=" fas fa-file-invoice" ></span>
//                         }
//                     </Button>
//                 )}
//                 {canMakeBtnDisable && (
//                     <Button
//                         type="button"
//                         title={'Access Not Allow'}
//                         className={dissableBtnCss}
//                         disabled={true}
//                         style={dissableStyle}
//                     >
//                         <span style={{ marginLeft: "6px", marginRight: "6px" }}
//                             className=" fas fa-file-invoice" ></span>

//                     </Button>
//                 )}

//                 {canPrint && (
//                     <Button
//                         type="button"
//                         id={`btn-dounload-${rowData.id}`}
//                         className={downBtnCss}
//                         disabled={listBtnLoading}
//                         title={`Print ${ButtonMsgLable}`}
//                         onClick={() => renderDownButton(rowData, "singlePrint", `btn-dounload-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-dounload-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="bx bx-printer font-size-16"></i>
//                         }
//                     </Button>
//                 )}

//                 {canMultiplePrint && (
//                     <Button
//                         type="button"
//                         id={`btn-MultiInvoice-${rowData.id}`}
//                         className={printBtnCss}
//                         disabled={listBtnLoading}
//                         title={`MultipleInvoices`}
//                         onClick={() => renderDownButton(rowData, "IsMultipleInvoicePrint", `btn-MultiInvoice-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-MultiInvoice-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <span style={{ marginLeft: "6px", marginRight: "6px" }}
//                                 className=" fas fa-file-download" ></span>
//                         }
//                     </Button>
//                 )}

//                 {otherBtn_1Func && (
//                     <Button
//                         style={{ width: "30px" }}
//                         type="button"
//                         id={`btn-otherBtn_1-${rowData.id}`}
//                         className={makeBtnCss}
//                         disabled={listBtnLoading}
//                         title={`Update ${ButtonMsgLable}`}
//                         onClick={() => otherBtn_1Func(rowData, mode.copy, `btn-otherBtn_1-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-otherBtn_1-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i class="mdi mdi-file-table-box-multiple font-size-16"></i>
//                         }
//                     </Button>
//                 )}

//                 {canDelete && (
//                     <Button
//                         type="button"
//                         className={deltBtnCss}
//                         id={`btn-delete-${rowData.id}`}
//                         title={`Delete ${ButtonMsgLable}`}
//                         disabled={listBtnLoading}
//                         onClick={() => renderDeleteButton(rowData, `btn-delete-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-delete-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="mdi mdi-delete font-size-16"></i>
//                         }
//                     </Button>
//                 )}

//                 {canDeleteSelf && (
//                     <Button
//                         type="button"
//                         className={deltBtnCss}
//                         id={`btn-delete-${rowData.id}`}
//                         disabled={listBtnLoading}
//                         title={`Delete ${ButtonMsgLable}`}
//                         onClick={() => renderDeleteButton(rowData, `btn-delete-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-delete-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="mdi mdi-delete font-size-16"></i>
//                         }
//                     </Button>
//                 )}
//                 {canDeleteDisable && (
//                     <Button
//                         type="button"
//                         title={'Access Not Allow'}
//                         className={dissableBtnCss}
//                         disabled={true}
//                         style={dissableStyle}
//                     >
//                         <i className="mdi mdi-delete font-size-16"></i>
//                     </Button>  // **else null
//                 )}

//                 {canCopy && (
//                     <Button
//                         type="button"
//                         id={`btn-IsCopy-${rowData.id}`}
//                         className={editSelfBtnCss}
//                         title={`Copy ${ButtonMsgLable}`}
//                         disabled={listBtnLoading}
//                         onClick={() => renderCopyButton(rowData, mode.copy, `btn-IsCopy-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-IsCopy-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="bx bxs-copy font-size-18 "></i>
//                         }

//                     </Button>
//                 )}

//                 {canOrderApproval && (
//                     <Button
//                         type="button"
//                         id={`btn-orderApproval-${rowData.id}`}
//                         className={makeBtnCss}
//                         disabled={listBtnLoading}
//                         title={`Order Approval`}
//                         onClick={() => renderOrderApprovalButton(rowData, `btn-orderApproval-${rowData.id}`)}
//                     >
//                         {(listBtnLoading === `btn-orderApproval-${rowData.id}`) ?
//                             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                             : <i className="bx bx-check-shield font-size-20"></i>
//                         }
//                     </Button>
//                 )}
//                 {canOrderApprovalDisable && (
//                     <Button
//                         type="button"
//                         title={'Access Not Allow'}
//                         className={dissableBtnCss}
//                         disabled={true}
//                         style={dissableStyle}
//                     >
//                         <i className="bx bx-check-shield font-size-20"></i>
//                     </Button>
//                 )}

//             </div>
//         );
//     };


//     return {
//         text: "Action",
//         formatExtraData: { listBtnLoading },
//         hidden:
//             !(
//                 userAccState.RoleAccess_IsEdit ||
//                 userAccState.RoleAccess_IsPrint ||
//                 userAccState.RoleAccess_IsMultipleInvoicePrint ||
//                 userAccState.RoleAccess_IsView ||
//                 userAccState.RoleAccess_IsDelete ||
//                 userAccState.RoleAccess_IsDeleteSelf ||
//                 userAccState.RoleAccess_IsEditSelf ||
//                 makeBtnShow ||
//                 oderAprovalBtnFunc
//             ),
//         formatter: renderActionButton,
//     };
// };

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

    const makeButtonHandler = ({ rowData, btnId }) => {
        rowData["hasSelect"] = true;
        let arr = [];
        arr.push(rowData);
        makeBtnFunc(arr, btnId);
    };

    const renderButton = async ({ rowData, btnmode, btnId, actionFunc, dispatchAction }) => {

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
                await dispatch(dispatchAction({ ...config }));
            }
        } catch (error) {
            customAlert({
                Type: 3,
                Message: "Action Not defined",
            });
        }
    };

    const renderButtonWithSpinner = (btnId, spinnerColor, iconClass) => {
        const style = btnId === "makeBtn" ? { marginLeft: "6px", marginRight: "6px" } : {};
        return (
            <>
                {listBtnLoading === btnId ? (
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
            forceMakeBtn,
        } = rowData;

        rowData.hasSelect = false;

        const hasRole = (role) => userAccState[role];

        const canEdit = hasRole("RoleAccess_IsEdit") && !forceEditHide;
        const canEditSelf = hasRole("RoleAccess_IsEditSelf") && !canEdit && rowData.CreatedBy === userCreated && !forceEditHide;
        const canView = hasRole("RoleAccess_IsView") && !canEdit && !canEditSelf;
        const canPrint = hasRole("RoleAccess_IsPrint");
        const canMultiInvoicePrint = hasRole("RoleAccess_IsMultipleInvoicePrint");
        const canDelete = hasRole("RoleAccess_IsDelete") && !forceDeleteHide;
        const canDeleteSelf = hasRole("RoleAccess_IsDeleteSelf") && !canDelete && rowData.CreatedBy === userCreated && !forceDeleteHide;
        const canCopy = hasRole("RoleAccess_IsSave") && hasRole("RoleAccess_IsCopy");
        const canMakeBtn = pageMode === mode.modeSTPList && makeBtnShow && !forceMakeBtn;
        const canOrderApproval = oderAprovalBtnFunc && !forceHideOrderAprovalBtn;
        const dummyDisable_OrderApproval = oderAprovalBtnFunc;
        const dummyDisable_Edit = (userAccState.RoleAccess_IsEdit || userAccState.RoleAccess_IsEditSelf) && !canEdit && !canEditSelf && !canView;
        const dummyDisable_Delete = (hasRole("RoleAccess_IsDelete") || hasRole("RoleAccess_IsDeleteSelf")) && !canDelete && !canDeleteSelf;
        const dummyDisable_MakeBtn = !canMakeBtn && makeBtnShow;


        const renderButtonIfNeeded = ({ condition, btnmode, iconClass, actionFunc, dispatchAction, title, buttonClasss, isDummyBtn }) => {
            if (!condition && !isDummyBtn) return null;
            if (!isDummyBtn) {
                return (
                    <Button
                        type="button"
                        id={`btn-${btnmode}-${rowData.id}`}
                        className={buttonClasss}
                        title={`${title} ${ButtonMsgLable}`}
                        disabled={listBtnLoading}
                        onClick={() =>
                            renderButton({
                                rowData: rowData,
                                btnmode: mode[btnmode],
                                btnId: `btn-${btnmode}-${rowData.id}`,
                                actionFunc: actionFunc,
                                dispatchAction: dispatchAction
                            })
                        }
                    >
                        {renderButtonWithSpinner(`btn-${btnmode}-${rowData.id}`, "white", iconClass)}
                    </Button>
                );
            } else {
                return (
                    < Button
                        type="button"
                        id={`btn-${btnmode}-${rowData.id}`}
                        className={buttonClasss}
                        style={dissableStyle}
                    >
                        <i className={iconClass} ></i>
                    </Button >
                )
            }
        };


        return (
            <div id="ActionBtn" className="center gap-3">
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
                    actionFunc: viewBtnFunc,
                    dispatchAction: editActionFun,
                    title: "View",
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
                {renderButtonIfNeeded({
                    condition: canDelete,
                    btnmode: mode.isdelete,
                    iconClass: deleteIconClass,
                    actionFunc: deleteBodyfunc,
                    dispatchAction: deleteActionFun,
                    title: deleteName,
                    buttonClasss: deltBtnCss,
                    isDummyBtn: dummyDisable_Delete

                })}
                {renderButtonIfNeeded({
                    condition: canDeleteSelf,
                    btnmode: mode.isdelete,
                    iconClass: deleteIconClass,
                    actionFunc: deleteBodyfunc,
                    dispatchAction: deleteActionFun,
                    title: deleteName,
                    buttonClasss: deltBtnCss,
                })}
                {renderButtonIfNeeded({
                    condition: canCopy,
                    btnmode: mode.copy,
                    iconClass: copyIconClass,
                    actionFunc: copyBodyfunc,
                    title: "Copy",
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
    const { listBtnLoading } = reducers;

    function Uploaded_EwayBillHandler(btnId, rowData) {
        try {
            let config = { btnId, RowId: rowData.id, UserID: loginUserID() };
            dispatch(Uploaded_EwayBillAction(config));
        } catch (error) { }
    }

    function Cancel_EwayBillHandler(btnId, rowData) {
        try {
            dispatch(Cancel_EwayBillAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
        } catch (error) { }
    }

    function Print_EwayBillHander(rowData) {
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
                    disabled={listBtnLoading}
                    title={title}
                    onClick={() => {
                        let btnId = `btn-${btnmode}-${rowData.id}`;
                        actionFunc(btnId, rowData);
                    }}
                >
                    {listBtnLoading === `btn-${btnmode}-${rowData.id}` ? (
                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    ) : (
                        <i className={iconClass}></i>
                    )}
                </Button>
            );
        } else {
            return (
                < Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={getButtonClassName(btnmode)}
                    style={dissableStyle}
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
            const canCancel = ((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0]?.EwayBillIsCancel === false));
            const canPrint = ((rowData.InvoiceUploads.length > 0) && (rowData.InvoiceUploads[0]?.EwayBillUrl !== null));

            return (
                <div id="ActionBtn" className="center gap-3 p-0">
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


export const E_Invoice_ActionsButtonFunc = ({ dispatch, reducers }) => {
    const systemSetting = loginSystemSetting();

    if (!(systemSetting.EInvoiceApplicable === "1")) {
        return null; // Return null if the column should be hidden
    }

    const { listBtnLoading } = reducers;

    function Uploaded_EInvoiceHandler(btnId, rowData) {
        try {
            dispatch(Uploaded_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
        } catch (error) { }
    }

    function Cancel_EInvoiceHandler(btnId, rowData) {
        try {
            dispatch(Cancel_EInvoiceAction({ btnId, RowId: rowData.id, UserID: loginUserID() }));
        } catch (error) { }
    }

    function Print_InvoiceHander(rowData) {
        const { InvoiceUploads } = rowData;
        if (!(InvoiceUploads === undefined) && InvoiceUploads.length > 0) {
            const pdfUrl = InvoiceUploads[0].EInvoicePdf;
            window.open(pdfUrl, "_blank");
        }
    }

    const uploadIconClass = "bx bx-upload font-size-14";
    const cancelIconClass = "mdi mdi-cancel font-size-14";
    const printIconClass = "bx bx-printer font-size-14";

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
                    disabled={listBtnLoading}
                    title={title}
                    onClick={() => {
                        let btnId = `btn-${btnmode}-${rowData.id}`;
                        actionFunc(btnId, rowData);
                    }}
                >
                    {listBtnLoading === `btn-${btnmode}-${rowData.id}` ? (
                        <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    ) : (
                        <i className={iconClass}></i>
                    )}
                </Button>
            );
        } else {
            return (
                < Button
                    type="button"
                    id={`btn-${btnmode}-${rowData.id}`}
                    className={getButtonClassName(btnmode)}
                    style={dissableStyle}
                >
                    <i className={iconClass} ></i>
                </Button >
            )
        }
    };

    return {
        text: "E-Invoice",
        formatExtraData: { listBtnLoading },
        formatter: (__cell, rowData) => {

            const canUpload = ((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0]?.Irn === null));
            const canCancel = ((rowData.InvoiceUploads.length === 0) || (rowData.InvoiceUploads[0]?.EInvoiceIsCancel === false));
            const canPrint = ((rowData.InvoiceUploads.length > 0) && (rowData.InvoiceUploads[0]?.EInvoicePdf !== null));

            return (
                <div id="ActionBtn" className="center gap-3 p-0">
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

