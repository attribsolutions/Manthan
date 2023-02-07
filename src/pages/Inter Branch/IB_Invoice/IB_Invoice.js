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
import { createdBy, currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { postInward, postInwardSuccess } from "../../../store/Inter Branch/InwardRedux/action";
import * as url from "../../../routes/route_url";
import { AlertState } from "../../../store/actions";
import { Go_Button, SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as  mode from "../../../routes/PageMode";
import Select from "react-select";
import { postDivision } from "../../../store/Inter Branch/IBOrderRedux/action";

const IB_Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [userAccState, setUserAccState] = useState('');
    const [InwardDate, setInwardDate] = useState(currentDate);
    const [divisionSelect, setDivisionSelect] = useState([]);
    const [pageMode, setPageMode] = useState(mode.defaultsave);

    const {
        postMsg,
        Division,
        userAccess,
        MakeIBInvoice
    } = useSelector((state) => ({
        postMsg: state.InwardReducer.postMsg,
        Division: state.IBOrderReducer.Supplier,
        MakeIBInvoice: state.IBInvoiceReducer.MakeIBInvoice,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const { IBOrderIDs = [], IBOrderItemDetails = [], StockDetails = [], division = {} } = MakeIBInvoice

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
    const hasShowModal = props.hasOwnProperty("editValue")

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

    useEffect(() => {

        const jsonBody = JSON.stringify({
            Company: userCompany(),
            Party: userParty()
        });
        dispatch(postDivision(jsonBody));
    }, []);

    const DivisionDropdown_Options = Division.map((i) => ({ label: i.Name, value: i.id }))

    function InwardDateOnchange(e, date) {
        setInwardDate(date)
    };

    const saveHandeller = (e, values) => {

        const arr = IBOrderItemDetails.map(i => ({
            Item: i.Item.id,
            Quantity: i.Quantity,
            MRP: i.MRP,
            ReferenceRate: i.Rate,
            Rate: i.Rate,
            Unit: i.Unit.id,
            BaseUnitQuantity: i.BaseUnitQuantity,
            GST: i.LiveBatch.GST,
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
            // IBInwardDate: InwardDate,
            // IBInwardNumber: data.IBChallanNumber,
            // FullIBInwardNumber: data.FullIBInwardNumber,
            // GrandTotal: data.GrandTotal,
            // CreatedBy: createdBy(),
            // UpdatedBy: createdBy(),
            // Customer: data.Customer.id,
            // Supplier: data.Party.id,
            InterBranchInwardItems: arr,
            InterBranchInwardReferences: [{
                IBChallan: 1
            }]
        });

        // saveDissable(true);//save Button Is dissable function

        if (pageMode === "edit") {
        } else {

            dispatch(postInward(jsonBody))
        }
    }

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
            text: "Unit",
            dataField: "",
            formatter: (value, row, key) => {

                if (!row.UnitName) {
                    row["Unit_id"] = row.UnitDetails[0].Unit
                    row["UnitName"] = row.UnitDetails[0].UnitName
                }

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        key={`ddlUnit${row.id}`}
                        defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.UnitID,

                            }))
                        }
                        onChange={e => {
                            row["Unit_id"] = e.value;
                            row["UnitName"] = e.label
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '200px', textAlign: 'center' };
            }
        },
        {
            text: "StockDetails",
            dataField: "StockDetails",
            // formatter: (cellContent, user) => (

            //     <>
            //         <Table className="table table-bordered table-responsive mb-1">
            //             <Thead>
            //                 <tr>

            //                     <th>  Item Name </th>
            //                     <th> Quantity</th>
            //                     <th>  Unit</th>
            //                     <th>   Stock Details</th>
            //                     <th>  Rate</th>
            //                 </tr>
            //             </Thead>
            //             <Tbody>
            //                 {/* {IBOrderItemDetails.map((index) => {

            //                     return (
            //                         < tr >
            //                             <td>
            //                                 <div style={{ width: "150px" }}>
            //                                     <Label>
            //                                         {index.LiveBatch.BatchCode}
            //                                     </Label>
            //                                 </div>
            //                             </td>
            //                             <td>
            //                                 <div style={{ width: "150px" }}>
            //                                     <Label>
            //                                         {index.LiveBatch.SystemBatchCode}
            //                                     </Label>
            //                                 </div>
            //                             </td>

            //                             <td>
            //                                 <div style={{ width: "120px", textAlign: "right" }}>
            //                                     <Label >
            //                                         {index.Quantity}
            //                                     </Label>
            //                                 </div>
            //                             </td>

            //                         </tr>
            //                     )
            //                 })} */}
            //             </Tbody>
            //         </Table>
            //     </>
            // ),
        },

        {
            text: "Rate",
            dataField: "Rate",
        },

    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: IBOrderItemDetails.length,
        custom: true,
    };

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="5" className="">
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

                        <Col sm="5" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>Division</Label>
                                <Col sm="7">
                                    <Select
                                        isDisabled={location.pageMode === "mode2save" ? true : false}
                                        name="division"
                                        value={location.pageMode === "mode2save" ? division : divisionSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={DivisionDropdown_Options}
                                        onChange={(e) => { setDivisionSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        {/* <Col sm="1" className="mx-2 mt-3">
                            {pageMode === mode.defaultsave ?
                                <Go_Button onClick={(e) => goButtonHandler()} />
                                : null}
                        </Col> */}

                        {/* <Col sm="4" className="">
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
                        </Col> */}
                    </div>
                </div>

                <div className="mt-1">
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField={"id"}
                                data={IBOrderItemDetails}
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
                        module={"IB_Invoice"} onClick={saveHandeller}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default IB_Invoice;