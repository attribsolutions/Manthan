import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { useHistory } from "react-router-dom";
import * as pageId from "../../../routes/allPageID"
import { MetaTags } from "react-meta-tags";
import { Tbody, Thead } from "react-super-responsive-table";
import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";


const Inward = () => {

    const data = {
        IBChallanDate: "2023-01-06",
        IBChallanNumber: 1,
        FullIBChallanNumber: "IBC1",
        CustomerGSTTin: "2023-01-06",
        GrandTotal: "6615.00",
        RoundOffAmount: "1.00",
        CreatedBy: 1,
        UpdatedBy: 1,
        Customer: {
            id: 4,
            Name: "Shade No-44"
        },
        Party: {
            id: 5,
            Name: "Shade.No-25"
        },
        IBChallanItems: [
            {
                id: 1,
                LiveBatch: {
                    id: 1,
                    BatchDate: "2023-01-10",
                    BatchCode: "hgf",
                    SystemBatchDate: "2023-01-10",
                    SystemBatchCode: "jygyj",
                    MRP: "1.00",
                    Rate: "11.00",
                    ItemExpiryDate: "2023-01-10",
                    OriginalBatchBaseUnitQuantity: "1.000",
                    GST: 5454
                },
                Item: {
                    id: 44,
                    Name: "Khawa"
                },
                Unit: {
                    id: 302,
                    UnitID: "Kg"
                },
                Quantity: "10.000",
                BaseUnitQuantity: "1.000",
                MRP: null,
                Rate: "100.00",
                BasicAmount: "1000.00",
                TaxType: "GST",
                GSTPercentage: "5.00",
                GSTAmount: "50.00",
                Amount: "1050.00",
                DiscountType: "",
                Discount: "0.00",
                DiscountAmount: "0.00",
                CGST: "25.00",
                SGST: "25.00",
                IGST: "0.00",
                CGSTPercentage: "2.50",
                SGSTPercentage: "2.50",
                IGSTPercentage: "0.00",
                BatchDate: "2023-01-01",
                BatchCode: "A001",
                CreatedOn: "2023-01-20T17:45:30.468709",
                id: 1
            }
        ]
    }

    const { IBChallanItems = [] } = data

    const dispatch = useDispatch();
    const history = useHistory();
    const [userAccState, setUserAccState] = useState('');
    const [InwardDate, setInwardDate] = useState(currentDate);

    const {
        userAccess,
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId.INWARD)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    function InwardDateOnchange(e, date) {
        setInwardDate(date)
    };

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Item.Name",
        },
        {
            text: "Batch Code",
            dataField: "",
            formatter: (cellContent, user) => (

                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead>
                            <tr>
                                <th>Batch Code </th>
                                <th>SystemBatchCode</th>
                                <th>Quantity</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {IBChallanItems.map((index) => {
                               debugger
                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.LiveBatch.BatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.LiveBatch.SystemBatchCode}
                                                </Label>
                                            </div>
                                        </td>

                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                <Label >
                                                    {index.Quantity}
                                                </Label>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </>
            ),
        },

        {
            text: "Quantity",
            dataField: "Quantity",
        },
        {
            text: "UnitName",
            dataField: "Unit.UnitID",
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: IBChallanItems.length,
        custom: true,
    };
    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="4" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        style={{ userselect: "all" }}
                                        id="orderdate"
                                        name="orderdate"
                                        value={InwardDate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={InwardDateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>Division</Label>
                                <Col sm="7">
                                    <Input type="text"
                                        defaultValue={data.Party.Name}
                                        placeholder='Enter Division'
                                    // onChange={e => description = e.target.value}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm- p-2"
                                    style={{ width: "83px" }}>Challan No.</Label>
                                <Col sm="7">
                                    <Input type="text"
                                        defaultValue={data.IBChallanNumber}
                                        placeholder='Enter Challan No.'
                                    // onChange={e => description = e.target.value}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>

                <div className="mt-1">
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField={"id"}
                                data={IBChallanItems}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered"}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                    {/* {countlabelFunc(toolkitProps, paginationProps, dispatch, "WorkOrder")} */}
                                                    {/* {mySearchProps(toolkitProps.searchProps, pageField.id)} */}

                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-md-center mt-30">
                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                <PaginationListStandalone {...paginationProps} />
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        )}

                    </PaginationProvider>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Inward;