import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal, } from "reactstrap";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { orderSinglegetSuccess } from "../../../store/actions";
import { useState } from "react";


const ViewDetails_Modal = () => {

    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux } = useSelector((state) => ({
        viewData_redux: state.OrderReducer.orderData // modify Redux State
    }))

    useEffect(() => {
        try {
            if ((viewData_redux.Status === true)) {
                setTableArray(viewData_redux.Data.OrderItem)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(orderSinglegetSuccess({ Status: false }))// modify Custom Api Action call

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "Quantity",
            dataField: "Quantity",
            formatter: (cellContent, index) => (
                <span>{`${index.Quantity} ${index.PrimaryUnitName} ${index.UnitName}`}</span>
            )
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
                                data={tableArray}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table">
                                            <BootstrapTable
                                                keyField={"id"}
                                                bordered={true}
                                                striped={false}
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
                        </div>

                    </div>


                </CardBody>
            </Card>
        </Modal>
    )

}
export default ViewDetails_Modal;
