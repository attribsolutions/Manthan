import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, FormGroup, Input, Modal, Row, Spinner, } from "reactstrap";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole, date_dmy_func, loginUserID } from "../../../components/Common/CommonFunction";
import { confirm_SalesReturn_Id_Succcess, orderSinglegetSuccess, returnApprove } from "../../../store/actions";
import { useState } from "react";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, onlyNumberRegx, onlyTextRegx } from "../../../CustomValidateForm";
import { url } from "../../../routes";


const ViewDetails_Modal = () => {

    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux = [], updateMsg } = useSelector((state) => ({
        viewData_redux: state.SalesReturnReducer.confirmBtnData, // modify Redux State
        updateMsg: state.SalesReturnReducer.updateMsg // modify Redux State


    }))

    useEffect(() => {
        try {
            if ((viewData_redux.Status === true)) {
                setTableArray(viewData_redux.Data[0])// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);


    useEffect(() => {
        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200)) {
            customAlert({
                Type: 1,
                Message: updateMsg.Message,
            })
        }
    }, [updateMsg])

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))// modify Custom Api Action call
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            const tableItemArray = []
            let inValideUnits = []

            tableArray.ReturnItems.forEach(index => {
                debugger
                const Quantity = index.ApproveQuantity ? index.ApproveQuantity : index.Quantity
                if (index.ApproveQuantity === "") {
                    inValideUnits.push({ [`${index.ItemName}`]: `Please Enter Approve Quantity` })
                } else if (Number(Quantity) > 0) {
                    const ReturnItems = {
                        Item: index.Item,
                        Unit: index.Unit,
                        ApprovedQuantity: Quantity,
                        Approvedby: loginUserID()
                    }
                    tableItemArray.push(ReturnItems)
                }

            })
            debugger
            const jsonBody = JSON.stringify({
                ReturnID: viewData_redux.Data[0].ReturnID,
                ReturnItem: tableItemArray
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
            formatter: (value, row, k) => {
                if (tableArray.viewMode === url.PURCHASE_RETURN_LIST) {
                    return <div style={{ width: "120px" }}>{`${row.Quantity}`}</div>
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


    ];

    if (tableArray.viewMode === url.SALES_RETURN_LIST) {
        const Comment = {
            text: "Comment",
            dataField: "",
            formatter: (value, row, k) => {
                return (
                    <div>

                        <CInput
                            key={`Comment-${k}`}
                            id={`Comment-${k}`}
                            cpattern={onlyTextRegx}
                            defaultValue={row.Comment}
                            autoComplete="off"
                            placeholder="Enter Comment"
                            onChange={(e) => {
                                row["Comment"] = e.target.value
                            }}
                        />
                    </div>
                )
            },

        }
        pagesListColumns.push(Comment)


    }

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

                                        {/* <button

                                    title={`Save`}
                                    className="btn btn-primary w-md"
                                    autoFocus={false}
                                >  Saving.. &nbsp;
                                    <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                </button>
                                : */}
                                        <button
                                            type="submit"
                                            autoFocus={false}
                                            title={`Save `}
                                            className="btn btn-primary w-md"
                                            onClick={SaveHandler}
                                        > <i className="fas fa-save me-2"></i> Save
                                        </button>
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
