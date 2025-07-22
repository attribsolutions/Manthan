import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal, } from "reactstrap";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { GetStockEntryView_Success } from "../../../store/actions";
import { useState } from "react";

const StockEntryView = () => {
    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);


    const { viewData_redux } = useSelector((state) => ({
        viewData_redux: state.StockEntryReducer.StockEntryItemViewList // modify Redux State
    }))

    useEffect(() => {
        try {

            if ((viewData_redux.Status === true)) {
                debugger
                // setTableArray(viewData_redux.Data)// modify Custom Table Data

                setTableArray(viewData_redux.Data.sort((a, b) => {
                    return parseFloat(b.Quantity) - parseFloat(a.Quantity);
                }))



                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(GetStockEntryView_Success({ Status: false })) // modify Custom Api Action call

    }

    // debugger
    const pagesListColumns = [

        {
            text: "Name",
            dataField: "Name",
        },
        {
            text: "Quantity",
            dataField: "Quantity",
        },
        {
            text: "MRP",
            dataField: "MRPValue",
        },
        {
            text: "Unit",
            dataField: "Unit",
        },
    ];
    const nameCount = viewData_redux?.Data?.length || 0;
    return (
        <Modal
            isOpen={modal_view}
            toggle={modalToggleFunc}
            size="xl"
        >
            <Card>
                <CardBody className="c_card_body">
                    <div className="modal-body">
                        <div className="d-flex justify-content-end">
                            <div style={{marginRight:300}}><h2 className="text-center">Stock Entry Items</h2></div>
                            <div className="mt-2 me-2" > <span className="  ms-5 " > <b> Item Count:{nameCount} </b></span></div>

                        </div>
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
                                            {globalTableSearchProps(toolkitProps.searchProps)}
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
export default StockEntryView;
