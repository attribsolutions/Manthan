import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal } from "reactstrap";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React from "react";

const OrderView = ({ orderData }) => {
    const { Data = {} } = orderData
    const { OrderItem = [] } = Data

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

    return <Card>
        <CardBody className="c_card_body">
            <div className="modal-body">

                <div className="mt-n1">
                    <ToolkitProvider
                        keyField="id"
                        data={OrderItem}
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
}
export default OrderView;
