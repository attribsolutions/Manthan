import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { MetaTags } from "react-meta-tags";
import { Tbody, Thead } from "react-super-responsive-table";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { postInward, postInwardSuccess } from "../../../store/Inter Branch/InwardRedux/action";
import { mode, url } from "../../../routes/index";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const Inward = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [userPageAccessState, setUserAccState] = useState('');
    const [InwardDate, setInwardDate] = useState(currentDate_ymd);
    const [pageMode] = useState(mode.defaultsave);
    const {
        postMsg,
        userAccess,
        InwardData
    } = useSelector((state) => ({
        InwardData: state.InwardReducer.makeInward,
        postMsg: state.InwardReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const { InvoiceItems = [], PartyName = '', InvoiceNumber = '', id = '' } = InwardData

    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postInwardSuccess({ Status: false }))
            customAlert({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: url.INWARD_LIST,
            })

        } else if (postMsg.Status === true) {
            dispatch(postInwardSuccess({ Status: false }))
           customAlert({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            })
        }
    }, [postMsg])


    function InwardDateOnchange( date) {
        setInwardDate(date)
    };

    const saveHandeller = () => {

        const arr = InvoiceItems.map(i => ({
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
            IBInwardNumber: InwardData.InvoiceNumber,
            FullIBInwardNumber: InwardData.FullInvoiceNumber,
            GrandTotal: InwardData.GrandTotal,
            CreatedBy: _cfunc.loginUserID(),
            UpdatedBy: _cfunc.loginUserID(),
            Customer: InwardData.Customer,
            Supplier: InwardData.Party,
            InterBranchInwardItems: arr,
            InterBranchInwardReferences: [{
                IBChallan: id
            }]
        });

        if (pageMode === mode.edit) {
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
            text: "Batch Code",
            dataField: "",
            formatter: (cellContent, user) => (
                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead>
                            <tr>
                                <th>Batch Code </th>
                                <th>Quantity</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {InvoiceItems.map((index) => {
                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.BatchCode}
                                                </Label>
                                            </div>
                                        </td>
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
        totalSize: InvoiceItems.length,
        custom: true,
    };

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="4" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        style={{ userselect: "all" }}
                                        id="orderdate"
                                        name="orderdate"
                                        value={InwardDate}
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
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4" className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm- p-2"
                                    style={{ width: "83px" }}>Invoice Number</Label>
                                <Col sm="7">
                                    <Input type="text"
                                        defaultValue={InvoiceNumber}
                                        placeholder='Enter Challan No.'
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
                                data={InvoiceItems}
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
                                                        id="table_Arrow"
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered"}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>}
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
                <SaveButtonDraggable>
                    <SaveButton pageMode={pageMode}
                        userAcc={userPageAccessState}
                        module={"Inward"}
                        onClick={saveHandeller}
                    />
                </SaveButtonDraggable>
            </div>
        </React.Fragment>
    )
}

export default Inward;