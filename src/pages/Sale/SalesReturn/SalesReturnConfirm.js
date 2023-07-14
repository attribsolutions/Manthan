import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, FormGroup, Input, Modal, Row, Spinner, } from "reactstrap";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole, date_dmy_func, loginUserID } from "../../../components/Common/CommonFunction";
import { orderSinglegetSuccess, returnApprove } from "../../../store/actions";
import { useState } from "react";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import { SaveButton } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";


const ViewDetails_Modal = () => {
    
    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux = [] } = useSelector((state) => ({
        viewData_redux: state.SalesReturnReducer.confirmBtnData // modify Redux State
    }))

    useEffect(() => {
        try {
            if ((viewData_redux.Status === true)) {
                setTableArray(viewData_redux.Data[0].ReturnItems)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(orderSinglegetSuccess({ Status: false }))// modify Custom Api Action call

    }


    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            const tableItemArray = []
            let inValideUnits = []

            tableArray.forEach(index => {
                
                if (Number(index.Quantity) === (0)) {
                    inValideUnits.push({ [`${index.ItemName}`]: "This Item Quantity Is Required." })
                }
                const ReturnItems = {
                    Item: index.Item,
                    Unit: index.Unit,
                    ApprovedQuantity: index.Quantity,
                    Approvedby: loginUserID()
                }
                tableItemArray.push(ReturnItems)

            })

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
                    <div>{`${index.BatchCode}`}</div>
                    <div>{`${date_dmy_func(index.BatchDate)}`}</div>
                </>
            )
        },
        {
            text: "NOC",
            dataField: "ItemReason",
        },
        {
            text: "Comment",
            dataField: "ItemComment",
        },
        {
            text: "Approve Qty",
            dataField: "Quantity",
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${k}`}
                            key={`Quantity${row.id}`}
                            defaultValue={row.Quantity}
                            autoComplete="off"
                            onChange={(e) => { row["Quantity"] = e.target.value }}
                        />
                    </span>
                )
            },
        },
        {
            text: "Select Approve Items",
            dataField: "",
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input
                            type="checkbox"
                            className="p-1"
                            name="SelectApproveItems"
                            defaultChecked={row.selectCheck}
                            onChange={(e) => { e.target.value = row.selectCheck }}
                        >
                        </Input>
                    </span>
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
                        <div className="mt-n1">
                            <ToolkitProvider
                                keyField="id"
                                key="JHJHJHJHJHJH"
                                data={tableArray}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table">
                                            <BootstrapTable
                                                keyField={"id"}
                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                classes={"table align-middle table-nowrap table-hover"}
                                                headerWrapperClasses={"thead-light"}

                                                {...toolkitProps.baseProps}

                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>
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
                            </FormGroup >

                        </div>


                    </div>


                </CardBody>
            </Card>
        </Modal>
    )

}
export default ViewDetails_Modal;
