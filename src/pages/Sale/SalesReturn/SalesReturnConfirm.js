import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, FormGroup, Input, Modal, Spinner, } from "reactstrap";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole, date_dmy_func, date_ymd_func, loginRoleID, loginSystemSetting, loginUserID, tableInputArrowUpDounFunc } from "../../../components/Common/CommonFunction";
import { confirm_SalesReturn_Id_Succcess, returnApprove, returnApprove_Success } from "../../../store/actions";
import { useState } from "react";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { mode, url } from "../../../routes";
import { table_ArrowUseEffect } from "../../../components/Common/CommonUseEffect";
import { CInput, onlyNumberRegx } from "../../../CustomValidateForm";
import { C_Button } from "../../../components/Common/CommonButton";
import Slidewithcaption from "../../../components/Common/CommonImageComponent";

const ViewDetails_Modal = () => {

    const dispatch = useDispatch();
    const { ReturnFinalApprovalRole = '' } = loginSystemSetting()

    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState({});
    const [imageTable, setImageTable] = useState([]);  // Selected Image Array
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not



    const { viewData_redux = [], ApprovrMsg, saveBtnloading } = useSelector((state) => ({
        viewData_redux: state.SalesReturnReducer.confirmBtnData, // modify Redux State
        ApprovrMsg: state.SalesReturnReducer.ApprovrMsg,// modify Redux State
        saveBtnloading: state.SalesReturnReducer.saveBtnloading // modify Redux State
    }))

    useEffect(() => {

        try {
            if ((viewData_redux.Status === true)) {
                if (viewData_redux.Data.length > 0) {
                    setTableArray(viewData_redux.Data[0])// modify Custom Table Data
                    setModal_view(true);
                }

            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    useEffect(() => {

        if ((ApprovrMsg.Status === true) && (ApprovrMsg.StatusCode === 200)) {
            dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))
            dispatch(returnApprove_Success({ Status: false }))
            customAlert({
                Type: 1,
                Message: ApprovrMsg.Message,
            })
            setModal_view(false);

        }
    }, [ApprovrMsg])
    if (Object.keys(tableArray).length > 0) {
        tableArray.ReturnItems.sort((a, b) => {   //Sort With Same Item Name  
            if (a.ItemName === b.ItemName) {
                return 0;
            }
            return b.ItemName.localeCompare(a.ItemName);
        });
    }

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))// modify Custom Api Action call
    }

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [viewData_redux]);

    function QuantityHandler(event, row,) {
        let input = event.target.value
        let v1 = Number(row.Quantity);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.ApprovedQuantity = event.target.value;
    }

    const imageShowHandler = async (row) => { // image Show handler

        // customAlert({ Type: 3, Message: "Payment QR not uploaded" });

        setImageTable(row.ReturnItemImages)
        setmodal_backdrop(true)

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            formatter: (value, row, k) => (
                <>
                    <div >{`${(row.ItemName)}`}</div>
                </>
            )


        },

        {
            text: "Dist Name (Retailer Name)",
            dataField: "primarySource",
            style: { width: "200px" },
            formatter: (value, row, k) => (

                <>
                    <div > {`${row.primarySource}`}</div>
                </>
            )


        },


        {
            text: "Quantity",
            dataField: "Quantity",
            formatter: (value, row, k) => (
                <>
                    <div>{`${Number(row.Quantity).toFixed(0)} ${row.UnitName}`}</div>
                </>
            )
        },
        {
            text: "Basic Rate",
            dataField: "Rate",
        },

        {
            text: "MRP",
            dataField: "MRPValue",
        },
        {
            text: "Batch",
            dataField: "ItemName",
            formatter: (cellContent, index) => (
                <>
                    <div style={{ width: "120px" }}>{`${index.BatchCode}`}</div>
                    <div style={{ width: "120px" }}>{`${date_dmy_func(index.BatchDate)}`}</div>
                </>
            )
        },
        {
            text: "NOC",
            dataField: "ItemReason",
        },

        {
            text: "Approve Quantity",
            dataField: "Quantity",
            hidden: tableArray.viewMode === url.PURCHASE_RETURN_LIST ? true : false,
            formatter: (value, row, k,) => {
                if (tableArray.viewMode === url.PURCHASE_RETURN_LIST) {

                    return <div style={{ width: "120px" }}>{`${Number(row.Quantity).toFixed(0)} ${row.UnitName}`}</div>
                } else {

                    let defaultQuantity = tableArray.IsApproved ? row.ApprovedQuantity : row.Quantity;
                    return (
                        <div>
                            <CInput
                                defaultValue={Number(defaultQuantity)}
                                autoComplete="off"
                                type="text"
                                disabled={tableArray.IsApproved}
                                cpattern={onlyNumberRegx}
                                className="col col-sm text-end"
                                onChange={(event) => {
                                    QuantityHandler(event, row)
                                }}
                            />
                        </div>
                    )
                }
            },
        },
        {
            text: "Comment",
            dataField: "",
            hidden: tableArray.viewMode === url.PURCHASE_RETURN_LIST ? true : false,
            formatter: (value, row, k) => {
                return (
                    <div>
                        <Input
                            key={`ApproveComment-${k}`}
                            id={`ApproveComment-${k}`}
                            defaultValue={row.ApproveComment}
                            autoComplete="off"
                            placeholder="Enter Comment"
                            onChange={(e) => {
                                row["ApproveComment"] = e.target.value
                            }}
                        />
                    </div>
                )
            },
        },
        {
            text: "Image",
            dataField: "",
            formatter: (value, row, k) => {
                return (
                    <div>
                        <C_Button
                            type="button"
                            spinnerColor="white"
                            className="btn btn-success   "
                            onClick={(event) => {

                                if ((row.ReturnItemImages) && (row.ReturnItemImages.length === 0)) {
                                    customAlert({ Type: 3, Message: ` Images not uploaded` });
                                    return setmodal_backdrop(false)
                                } else if ((row.ReturnItemImages) && (row.ReturnItemImages.length > 0)) {
                                    imageShowHandler(row)
                                }
                            }}
                        >
                            Show
                        </C_Button>
                    </div>
                )
            },
        },
    ];

    const SaveHandler = async (event) => {

        const btnId = event.target.id
        try {
            const tableItemArray = []
            let inValideUnits = []


            tableArray.ReturnItems.forEach(index => {

                const approvedQty = index.ApprovedQuantity ? index.ApprovedQuantity : index.Quantity
                const Comment = index.ApproveComment ? index.ApproveComment : null

                if (index.ApprovedQuantity === "") {
                    inValideUnits.push({ [`${index.ItemName}`]: `Please Enter Approve Quantity` })

                } else if (Number(approvedQty) >= 0) {
                    const ReturnItems = {
                        "id": index.id,
                        "Item": index.Item,
                        "Unit": 1,
                        "ApprovedQuantity": approvedQty,
                        "ApproveComment": Comment,
                        "Approvedby": loginUserID(),
                        "ItemComment": index.ItemComment,
                        "Quantity": index.Quantity,
                        "BaseUnitQuantity": index.BaseUnitQuantity,
                        "MRPValue": index.MRPValue,
                        "Rate": index.Rate,
                        "BasicAmount": index.BasicAmount,
                        "TaxType": index.TaxType,
                        "GSTPercentage": index.GSTPercentage,
                        "GSTAmount": index.GSTAmount,
                        "Amount": index.Amount,
                        "CGST": index.CGST,
                        "SGST": index.SGST,
                        "IGST": index.IGST,
                        "CGSTPercentage": index.CGSTPercentage,
                        "SGSTPercentage": index.SGSTPercentage,
                        "IGSTPercentage": index.IGSTPercentage,
                        "BatchDate": index.BatchDate,
                        "BatchCode": index.BatchCode,
                        "CreatedOn": index.CreatedOn,
                        "GST": index.GST,
                        "ItemName": index.ItemName,
                        "MRP": index.MRP,
                        "PurchaseReturn": index.PurchaseReturn,
                        "UnitName": index.UnitName,
                        "ItemReason": index.ItemReasonID,
                        "Comment": index.Comment,
                        "primarySourceID": index.primarySourceID,
                        "ApprovedByCompany": null,
                        "FinalApprovalDate": null
                    }

                    const allowedRoles = ReturnFinalApprovalRole.split(",").map(role => parseInt(role.trim()));

                    if (allowedRoles.includes(loginRoleID())) {
                        ReturnItems.ApprovedByCompany = Number(approvedQty).toFixed(2);
                        ReturnItems.FinalApprovalDate = date_ymd_func();
                    }
                    tableItemArray.push(ReturnItems)
                }
            })
            const allZeroQuantity = tableItemArray.every(item => item.ApprovedQuantity === "0");
            const jsonBody = JSON.stringify({
                "ReturnID": viewData_redux.Data[0].ReturnID,
                "UserID": loginUserID(),
                "IsApproved": allZeroQuantity ? 2 : 1,
                "ReturnItem": tableItemArray
            });

            if (inValideUnits.length > 0) {
                customAlert({
                    Type: 3,
                    Message: inValideUnits
                })

            } else {
                dispatch(returnApprove({ jsonBody, btnId }));
            }

        } catch (e) { }
    };

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    return (


        <Modal
            isOpen={modal_view}
            toggle={modalToggleFunc}
            size="xl"
        >

            <Modal
                isOpen={modal_backdrop}
                toggle={() => {
                    tog_backdrop()
                }}

                style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                className="modal-dialog-centered "

            >
                {(imageTable.length > 0) && <Slidewithcaption Images={imageTable} />}
            </Modal>

            <Card>
                <CardBody className="c_card_body">
                    <div className="modal-body">
                        {tableArray.viewMode === url.PURCHASE_RETURN_LIST ?
                            <h2 className="text-center">Purchase Return Items</h2> :
                            <h2 className="text-center">Sales Return Items</h2>}
                        <div className="mt-n1">
                            <ToolkitProvider
                                keyField="id"
                                key="RetrunItem"
                                data={tableArray.ReturnItems}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table">
                                            <BootstrapTable
                                                keyField={"id"}
                                                id="table_Arrow"
                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                classes={"table  table-bordered table-hover"}
                                                headerWrapperClasses={"thead-light"}
                                                onDataSizeChange={(e) => {
                                                    tableInputArrowUpDounFunc("#table_Arrow")
                                                }}
                                                {...toolkitProps.baseProps}

                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>
                            {(!(tableArray.viewMode === url.PURCHASE_RETURN_LIST) && !tableArray.IsApproved) &&
                                <FormGroup>
                                    <div>

                                        {saveBtnloading ? <button
                                            title={`Save`}
                                            className="btn btn-primary w-md"
                                            autoFocus={false}
                                        >  Saving.. &nbsp;
                                            <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                        </button>
                                            :
                                            <button
                                                type="submit"
                                                autoFocus={false}
                                                title={`Save `}
                                                className="btn btn-primary w-md"
                                                onClick={SaveHandler}
                                            > <i className="fas fa-save me-2"></i> Save
                                            </button>}
                                    </div>
                                </FormGroup >}

                        </div>
                    </div>
                </CardBody>
            </Card>
        </Modal>
    )

}
export default ViewDetails_Modal;





















