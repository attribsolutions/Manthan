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
import { createdBy, currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { postInward, postInwardSuccess } from "../../../store/Inter Branch/InwardRedux/action";
import * as url from "../../../routes/route_url";
import { AlertState } from "../../../store/actions";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as mode from "../../../routes/PageMode";

const Inward = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [userAccState, setUserAccState] = useState('');
    const [InwardDate, setInwardDate] = useState(currentDate);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const {
        postMsg,
        userAccess,
        InwardData
    } = useSelector((state) => ({
        InwardData: state.IBInvoiceReducer.InwardData,
        postMsg: state.InwardReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const { IBChallanItems = [], PartyName = '', IBChallanNumber = '' } = InwardData

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postInwardSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: url.INWARD_LIST,
            }))

        } else if (postMsg.Status === true) {
            // saveDissable(false);//save Button Is enable function
            dispatch(postInwardSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    function InwardDateOnchange(e, date) {
        setInwardDate(date)
    };

    const saveHandeller = (e, values) => {
        debugger
        const arr = IBChallanItems.map(i => ({
            Item: i.Item,
            Quantity: i.Quantity,
            MRP: i.MRP,
            ReferenceRate: i.Rate,
            Rate: i.Rate,
            Unit: i.Unit,
            BaseUnitQuantity: i.BaseUnitQuantity,
            GST: i.GSTPercentage,
            BasicAmount: i.BasicAmount,
            GSTAmount: parseFloat(i.GSTAmount).toFixed(2),
            Amount: i.Amount,
            CGST: i.CGST,
            SGST: i.SGST,
            IGST: i.IGST,
            CGSTPercentage: i.CGSTPercentage,
            SGSTPercentage: i.SGSTPercentage,
            IGSTPercentage: i.IGSTPercentage,
            BatchDate: i.BatchDate,
            BatchCode: i.BatchCode,
            DiscountType: i.DiscountType,
            Discount: i.Discount,
            DiscountAmount: i.DiscountAmount,
            TaxType: i.TaxType
        }))

        const jsonBody = JSON.stringify({
            IBInwardDate: InwardDate,
            IBInwardNumber: InwardData.IBChallanNumber,
            FullIBInwardNumber: InwardData.FullIBInwardNumber,
            GrandTotal: InwardData.GrandTotal,
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            Customer: InwardData.Customer,
            Supplier: InwardData.Party,
            InterBranchInwardItems: arr,
            InterBranchInwardReferences: [{
                IBChallan: 1
            }]
        });

        // saveDissable(true);//save Button Is dissable function

        if (pageMode === mode.edit) {
        } else {

            dispatch(postInward(jsonBody))
            console.log("jsonBody", jsonBody)
        }
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
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
                                {/* <th>System Batch Code</th> */}
                                <th>Quantity</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {IBChallanItems.map((index) => {

                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.BatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        {/* <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.LiveBatch.SystemBatchCode}
                                                </Label>
                                            </div>
                                        </td> */}

                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                <Label >
                                                    {index.BaseUnitQuantity}
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
            dataField: "BaseUnitQuantity",
        },
        {
            text: "Unit",
            dataField: "UnitName",
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
                                        defaultValue={PartyName}
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
                                        defaultValue={IBChallanNumber}
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
                <div className="row save1" style={{ paddingBottom: 'center', marginTop: "-30px" }}>
                    <SaveButton pageMode={pageMode}
                        userAcc={userAccState}
                        module={"Inward"} onClick={saveHandeller}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Inward;