import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, FormGroup, Input, Modal, Row, Spinner, } from "reactstrap";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole, date_dmy_func, loginUserID } from "../../../components/Common/CommonFunction";
import { confirm_SalesReturn_Id_Succcess, orderSinglegetSuccess, returnApprove, returnApprove_Success, salesReturnListAPI } from "../../../store/actions";
import { useState } from "react";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, onlyNumberRegx, onlyTextRegx } from "../../../CustomValidateForm";
import { url } from "../../../routes";

const ViewDetails_Modal = () => {

    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

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

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))// modify Custom Api Action call
    }

    const SaveHandler = async (event) => {

        const btnId = event.target.id
        try {
            const tableItemArray = []
            let inValideUnits = []
            tableArray.ReturnItems.forEach(index => {

                const Quantity = index.ApproveQuantity ? index.ApproveQuantity : index.Quantity
                const Comment = index.ApproveComment ? index.ApproveComment : null


                if (index.ApproveQuantity === "") {
                    inValideUnits.push({ [`${index.ItemName}`]: `Please Enter Approve Quantity` })
                } else if (Number(Quantity) > 0) {
                    const ReturnItems = {
                        // id: index.id,
                        // Item: index.Item,
                        // Unit: index.Unit,
                        // ApprovedQuantity: Quantity,
                        // ApproveComment: Comment,
                        // Approvedby: loginUserID()

                        "id": index.id,
                        "Item": index.Item,
                        "Unit": 1,
                        "ApprovedQuantity": Quantity,
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
                        "ItemReasonID": index.ItemReasonID,
                        "ItemReason": index.ItemReason,
                        "Comment": index.Comment,

                    }
                    tableItemArray.push(ReturnItems)
                }
            })

            const jsonBody = JSON.stringify({
                "ReturnID": viewData_redux.Data[0].ReturnID,
                "UserID": loginUserID(),
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

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "Quantity",
            dataField: "Quantity",
            formatter: (value, row, k) => {
                return <div style={{ width: "120px" }}>{`${row.Quantity}${row.UnitName}`}</div>
            }
        },
        {
            text: "Basic Rate",
            dataField: "Rate",
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
            formatter: (value, row, k) => {
                if (tableArray.viewMode === url.PURCHASE_RETURN_LIST) {
                    return <div style={{ width: "120px" }}>{`${row.Quantity}${row.UnitName}`}</div>
                } else {
                    return (
                        <div>
                            <CInput
                                key={`Quantity-${k}`}
                                id={`Quantity-${k}`}
                                cpattern={onlyNumberRegx}
                                defaultValue={row.Quantity}
                                autoComplete="off"
                                className=" text-end"
                                onChange={(e) => {

                                    if (Number(e.target.value) > Number(value)) {
                                        e.target.value = value
                                        row["ApproveQuantity"] = e.target.value
                                    } else {
                                        row["ApproveQuantity"] = e.target.value
                                    }
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

                        <CInput
                            key={`ApproveComment-${k}`}
                            id={`ApproveComment-${k}`}
                            cpattern={onlyTextRegx}
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
    ];

    return (
        <Modal
            isOpen={modal_view}
            toggle={modalToggleFunc}
            size="xl"
        >
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
                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                classes={"table align-middle table-hover"}
                                                headerWrapperClasses={"thead-light"}

                                                {...toolkitProps.baseProps}

                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>
                            {tableArray.viewMode === url.PURCHASE_RETURN_LIST ? null :
                                <FormGroup>
                                    {/* <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}> */}
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
                                                disabled={tableArray.IsApproved ? true : false}
                                                title={`Save `}
                                                className="btn btn-primary w-md"
                                                onClick={SaveHandler}
                                            > <i className="fas fa-save me-2"></i> Save
                                            </button>}
                                    </div>
                                    {/* </Col> */}
                                </FormGroup >}

                        </div>
                    </div>
                </CardBody>
            </Card>
        </Modal>
    )

}
export default ViewDetails_Modal;
