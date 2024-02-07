import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, CardHeader, Label, Modal, } from "reactstrap";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { channalItemViewDetailActionSuccess } from "../../../store/actions";
import { useState } from "react";


const ChannelViewDetails = () => {

    const dispatch = useDispatch()
    const [modal_view, setModal_view] = useState(false);
    const [tableArray, setTableArray] = useState([]);

    const viewDetail = useSelector((state) => (state.PartyItemsReducer.channeItemViewDetail))
    
    useEffect(() => {
        try {
            if ((viewDetail.Status === true)) {
                setTableArray(viewDetail.Data)// modify Custom Table Data
                setModal_view(true);
            }
        } catch (error) { CommonConsole(error) }
    }, [viewDetail]);

    function modalToggleFunc() {
        setModal_view(false);
        dispatch(channalItemViewDetailActionSuccess({ Status: false }))// modify Custom Api Action call

    }

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "Name",
        },
    ];

    return (
        <Modal
            isOpen={modal_view}
            toggle={modalToggleFunc}
            centered
        >
            <Card>
                <CardHeader className=" text-center">
                    <Label className="font-size-24">Item Assing by this Parties.</Label>
                </CardHeader>
                <CardBody className="c_card_body">
                    <div className="modal-body">
                        <div className="mt-n1 table-responsive">
                            <BootstrapTable
                                keyField={"Item"}
                                data={tableArray}
                                columns={pagesListColumns}
                                bordered={true}
                                striped={false}
                                noDataIndication={<div className="text-danger text-center ">Record Not Available</div>}
                                headerWrapperClasses={"thead-light"}
                            />
                        </div>
                    </div>


                </CardBody>
            </Card>
        </Modal>
    )

}
export default ChannelViewDetails;
