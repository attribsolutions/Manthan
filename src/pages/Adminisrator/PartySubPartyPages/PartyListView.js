import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Modal, } from "reactstrap";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { useState } from "react";
import { ModalCount } from "../../../components/Common/ModalCount";
import { getPartySubParty_For_party_dropdownSuccess } from "../../../store/Administrator/PartySubPartyRedux/action";

const PartySubPartyListView = () => {
    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const { viewData_redux } = useSelector((state) => ({
        viewData_redux: state.PartySubPartyReducer.PartySubParty,
    }))
  
    useEffect(() => {
        try {
            if ((viewData_redux.length > 0)) {
                
                setTableArray(viewData_redux)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewData_redux]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(getPartySubParty_For_party_dropdownSuccess([]));

    }

    const pagesListColumns = [
        {
            text: "Sub Party",
            dataField: "SubPartyName",
        },
        {
            text: "Party Type",
            dataField: "PartyTypeName",
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
                        <h2 className="text-center">{viewData_redux[0]?.PartyName}</h2>
                        <ModalCount Count={viewData_redux.length} />

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
export default PartySubPartyListView;
