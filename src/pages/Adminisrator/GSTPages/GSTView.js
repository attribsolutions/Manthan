import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal, } from "reactstrap";
import { globalTableSearchProps, } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { postViewGst_Success } from "../../../store/actions";
import { useState } from "react";
import { DetailsSection, ModalCount } from "../../../components/Common/ModalCount";

const GSTView = (Props) => {

    const dispatch = useDispatch()
    const { tableRowData = {} } = Props

    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux } = useSelector((state) => ({
        viewData_redux: state.GSTReducer.GSTView // modify Redux State
    }))

    const { ItemCount, GSTHSNList = [] } = viewData_redux
    const { PartyTypeName = '' } = tableRowData

    useEffect(() => {
        try {
            if ((GSTHSNList.length > 0)) {

                setTableArray(GSTHSNList)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [GSTHSNList]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(postViewGst_Success({ Status: false }))// modify Custom Api Action call
    }

    const pagesListColumns = [
        {
            text: "Effective Date",
            dataField: "EffectiveDate",
        },
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "GST Percentage",
            dataField: "GSTPercentage",
        },
        {
            text: "HSN Code",
            dataField: "HSNCode",
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

                        <DetailsSection
                            title="GST Details"
                            firstLabel="PartyType"
                            firstValue={PartyTypeName}
                            thirdLabel="Count"
                            thirdValue={ItemCount}
                        />
                        {/* <h2 className="text-center">GST Details</h2>
                        <ModalCount Count={ItemCount} /> */}

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
export default GSTView;
