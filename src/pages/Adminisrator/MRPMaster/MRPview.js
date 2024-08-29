import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal, } from "reactstrap";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import {  postViewMrpSuccess } from "../../../store/actions";
import { useState } from "react";

const MRPView = () => {
    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux } = useSelector((state) => ({
        viewData_redux: state.MRPMasterReducer.MRPView // modify Redux State
    }))

    useEffect(() => {
        try {

            if ((viewData_redux.Status === true)) {
                setTableArray(viewData_redux.Data)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(postViewMrpSuccess({ Status: false }))// modify Custom Api Action call

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "Effective Date",
            dataField: "EffectiveDate",
        },
        {
            text: "MRP",
            dataField: "MRP",
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
                        <h2 className="text-center">MRP Details</h2>
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
export default MRPView;
