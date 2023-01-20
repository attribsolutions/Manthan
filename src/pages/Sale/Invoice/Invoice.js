import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    postBOMSuccess,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import { convertDatefunc, createdBy, currentDate, mainSppinerOnOff, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { postGoButtonForMaterialIssue_Master, postGoButtonForMaterialIssue_MasterSuccess, postMaterialIssue, postMaterialIssueSuccess } from "../../../store/Purchase/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import { GoButton_post_For_Invoice, GoButton_post_For_Invoice_Success, postInvoiceMasterSuccess } from "../../../store/Sales/Invoice/action";
import { GetCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postInvoiceMaster } from "../../../store/Sales/Invoice/action";
import { Amount, basicAmount, GstAmount } from "../../Purchase/Order/OrderPageCalulation";

const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const goBtnId = `ADDGoBtn${pageId.INVOICE}`
    const saveBtnid = `saveBtn${pageId.INVOICE}`

    const fileds = {
        // id: "",
        InvoiceDate: currentDate,
        Customer: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.save);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [Itemselect, setItemselect] = useState([])


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        customer,
        GoButton = ''
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.SupplierReducer.customer,
        GoButton: state.InvoiceReducer.GoButton
    }));
    const { OrderItemDetails = [], OrderIDs = [] } = GoButton

    useEffect(() => {
        const page_Id = pageId.INVOICE
        dispatch(GetCustomer())
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GoButton_post_For_Invoice_Success([]))

    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {

                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                setItemselect(hasEditVal)
                const { id, Item, Customer, WorkDate, EstimatedOutputQty, NumberOfLot } = hasEditVal
                setState((i) => {
                    i.values.InvoiceDate = currentDate
                    i.values.Customer = { value: id, label: Customer, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.Customer.valid = true;
                    i.hasValid.InvoiceDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })

                // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++
                const jsonBody = JSON.stringify({
                    WorkOrder: id,
                    Item: Item,
                    Company: userCompany(),
                    Party: userParty(),
                    Quantity: parseInt(EstimatedOutputQty)
                });

                dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postInvoiceMasterSuccess({ Status: false }))
            dispatch(GoButton_post_For_Invoice_Success([]))
            // dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
            // dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function

            // dispatch(AlertState({
            //     Type: 1,
            //     Status: true,
            //     Message: "Item is out of stock",
            //     RedirectPath: url.MATERIAL_ISSUE_LIST,
            // }))
            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.INVOICE,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(postInvoiceMasterSuccess({ Status: false }))
            dispatch(GoButton_post_For_Invoice_Success([]))

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

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//Update Button Is enable function
            dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const CustomerDropdown_Options = customer.map((index) => ({
        value: index.id,
        label: index.Name,

    }));


    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            style: (cellContent, user) => {

                // let Stock = user.StockDetails.map((index) => {
                //     return index.BaseUnitQuantity
                // })
                // var TotalStock = 0;
                // Stock.forEach(x => {
                //     TotalStock += parseFloat(x);
                // });

                // var OrderQty = parseFloat(user.Quantity)
                var t1 = Number(user.StockTotal);
                var t2 = Number(user.Quantity) * user.ConversionUnit;
                if (t1 < t2) {
                    user.StockValid = false
                    return {
                        color: "red",

                    };
                }
            },
        },


        {
            text: "Quantity",
            dataField: "",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ width: "150px" }}>
                        <Input type="text"
                            style={{ textAlign: "right" }}
                            key={user.id}
                            defaultValue={user.Quantity}
                            onChange={(event) => orderQtyOnChange(event, user)}
                        ></Input>
                        <samp className="mt-1">Order Qty:{user.OrderQty} {user.UnitName}</samp>
                    </div>
                </>
            )
        },
        {
            text: "Unit",
            dataField: "",
            formatter: (value, row, key) => {

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={row.UnitDrop}
                        // value={{value:row.Unit,label:row.UnitName}}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.Unit,
                                ConversionUnit: i.ConversionUnit,
                                Unitlabel: i.Unitlabel
                            }))
                        }
                        onChange={(event) => orderQtyUnit_SelectOnchange(event, row)}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }
        },
        {
            text: "Batch Code",
            dataField: "StockDetails",

            formatter: (cellContent, row) => (
                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead  >
                            <tr className="">
                                <th className="">Batch Code </th>
                                <th className="" >Supplier BatchCode</th>
                                <th className="" >Batch Date</th>
                                <th className="">
                                    <div>
                                        <samp >Stock Quantity</samp>
                                    </div>
                                    <samp >{`(${row.StockTotal} ${row.StockUnit})`} </samp></th>
                                <th className="" >
                                    <div>
                                        <samp >Quantity</samp>
                                    </div>
                                    <samp id={`stocktotal${row.id}`}>{`Total:${row.InpStockQtyTotal} ${row.StockUnit}`} </samp>
                                </th>
                            </tr>
                        </Thead>
                        <Tbody  >
                            {cellContent.map((index) => {
                                return (
                                    < tr key={row.id} >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index.SystemBatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index.BatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "100px" }}>
                                                {convertDatefunc(index.BatchDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                {`${index.BaseUnitQuantity} ${row.StockUnit}`}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Input type="text"
                                                    style={{ textAlign: "right" }}
                                                    key={`batchQty${index.id}`}
                                                    id={`batchQty${index.id}`}
                                                    defaultValue={index.Qty}
                                                    onChange={(event) => handleChange(event, index)}
                                                ></Input>
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

    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: OrderItemDetails.length,
        custom: true,
    };

    function CustomerOnchange(hasSelect, evn) {
        setState((i) => {
            const v1 = { ...i }
            v1.values.Customer = hasSelect
            v1.hasValid.Customer.valid = true
            return v1
        })
        dispatch(GoButton_post_For_Invoice_Success([]))
    }

    const handleChange = (event, index) => {
        index.Qty = event.target.value
    };

    function stockDistributeFunc(index) {
        const v1 = index.Quantity;
        let count = Number(v1) * Number(index.ConversionUnit);

        index.StockDetails = index.StockDetails.map(i2 => {

            let qty = Number(i2.BaseUnitQuantity);

            if ((count > qty) && !(count === 0)) {
                count = count - qty
                i2.Qty = qty.toFixed(3)
            } else if ((count <= qty) && (count > 0)) {
                i2.Qty = count.toFixed(3)
                count = 0
            }
            else {
                i2.Qty = 0;
            }
            try {
                document.getElementById(`batchQty${i2.id}`).value = i2.Qty
            } catch (e) { }
            return i2
        });

        const t1 = (v1 * index.ConversionUnit);
        const t2 = index.StockUnit;

        try {
            document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        } catch (e) { }

    }
    function orderQtyOnChange(event, index) {
        index.Quantity = event.target.value
        stockDistributeFunc(index)
    }
    function orderQtyUnit_SelectOnchange(event, index) {
        debugger
        index.UnitDrop = event;
        index.ConversionUnit = event.ConversionUnit;
        // var n1 = Number(index.Quantity);
        // var n2 = Number(e.ConversionUnit);
        // const t1 = (n1 * n2).toFixed(2);
        // const t2 = index.StockUnit

        // try {
        //     document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        // } catch (e) { }
        stockDistributeFunc(index)
    };
    function goButtonHandler(event) {
        // event.preventDefault();
        // if (formValid(state, setState)) {
        // debugger
        const jsonBody = JSON.stringify({
            FromDate: values.InvoiceDate,
            Customer: values.Customer.value,
            Party: userParty(),
            OrderIDs: ""
        });
        mainSppinerOnOff({ id: goBtnId, state: true })
        dispatch(GoButton_post_For_Invoice(jsonBody, goBtnId));
        // }
    };

    const SaveHandler = (event) => {
        event.preventDefault();

        const validMsg = []
        // var a = {
        //     BatchCode: "A001",
        //     Quantity: "10.00",
        //     BaseUnitQuantity: "1.000",
        //     MRP: null,
        //     Rate: "100.00",
        //     BasicAmount: "1000.00",
        //     TaxType: "GST",
        //     GSTPercentage: "5.00",
        //     GSTAmount: "50.00",
        //     Amount: "1050.00",
        //     DiscountType: "",
        //     Discount: "0",
        //     DiscountAmount: "0",
        //     CGST: "25.00",
        //     SGST: "25.00",
        //     IGST: "0.00",
        //     CGSTPercentage: "2.50",
        //     SGSTPercentage: "2.50",
        //     IGSTPercentage: "0.00",
        //     CreatedOn: "",
        //     Item: 44,
        //     Unit: 302,
        //     BatchDate: "2023-01-01",
        //     BatchID: 59
        // }
        const InvoiceItems = []
        debugger
        const InvoicesReferences = OrderIDs.map(i => ({ Order: i }))
        let grandtotal = 0
        OrderItemDetails.map((index) => {

            // let Stock = index.StockDetails.map((i) => {
            //     return i.BaseUnitQuantity
            // })
            // var TotalStock = 0;
            // Stock.forEach(x => {
            //     TotalStock += parseFloat(x);
            // });
            // var OrderQty = parseFloat(index.Quantity)
            // if (OrderQty > TotalStock) {
            //     {
            //         validMsg.push(`${index.ItemName}:Item is Out Of Stock`);
            //     };
            // }
            // if (index["invalid"]) {
            //     validMsg.push(`${index.ItemName}:${index["invalidMsg"]}`);
            // };

            index.StockDetails.forEach((ele) => {

                if (ele.Qty > 0) {
                    var demo = {
                        Rate: index.Rate,
                        GSTPercentage: index.GSTPercentage,
                        Quantity: ele.Qty
                    }
                    const basicAmt = parseFloat(basicAmount(demo))
                    const cgstAmt = (GstAmount(demo))
                    const amount = Amount(demo)
                    grandtotal = grandtotal + Number(amount)
                    InvoiceItems.push({
                        Item: index.Item,
                        Unit: index.UnitDrop.value,
                        BatchCode: ele.BatchCode,
                        Quantity: ele.Qty,
                        BatchDate: ele.BatchDate,
                        BatchID: ele.id,
                        BaseUnitQuantity: ele.BaseUnitQuantity,
                        LiveBatch: ele.LiveBatche,
                        MRP: null,
                        Rate: index.Rate,
                        BasicAmount: basicAmt.toFixed(2),
                        GSTAmount: cgstAmt.toFixed(2),
                        GST: index.GST,
                        CGST: (cgstAmt / 2).toFixed(2),
                        SGST: (cgstAmt / 2).toFixed(2),
                        IGST: 0,
                        GSTPercentage: index.GSTPercentage,
                        CGSTPercentage: (index.GSTPercentage / 2),
                        SGSTPercentage: (index.GSTPercentage / 2),
                        IGSTPercentage: 0,
                        Amount: amount,
                        TaxType: 'GST',
                        DiscountType: "",
                        Discount: "0",
                        DiscountAmount: "0",
                    })
                }
            })
        })


        // if (formValid(state, setState)) {

        const jsonBody = JSON.stringify({
            InvoiceDate: values.InvoiceDate,
            CustomerGSTTin: '41',
            GrandTotal: Math.round(grandtotal),
            RoundOffAmount: (grandtotal - Math.trunc(grandtotal)).toFixed(2),
            Customer: values.Customer.value,
            Party: userParty(),
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            InvoiceItems: InvoiceItems,
            InvoicesReferences: InvoicesReferences
        }
        );

        if (pageMode === mode.edit) {
        }

        else {

            mainSppinerOnOff({ id: saveBtnid, state: true })
            dispatch(postInvoiceMaster(jsonBody, saveBtnid));
        }
        // };
        debugger
    }
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.INVOICE} /> */}

                <div className="page-content" >

                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.InvoiceDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="InvoiceDate"
                                                    value={values.InvoiceDate}
                                                    className="form-control d-block bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.InvoiceDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.Customer} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    // isDisabled={values.Customer ? true : null}
                                                    name="Customer"
                                                    value={values.Customer}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CustomerDropdown_Options}
                                                    onChange={CustomerOnchange}
                                                />
                                                {isError.Customer.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                </Col>
                                <Col sm={1} className="mt-2">
                                    <Button
                                        color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                        onClick={(e) => goButtonHandler(e)}
                                    >Go</Button>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={OrderItemDetails}
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
                                                            noDataIndication={
                                                                <div className="text-danger text-center ">
                                                                    Items Not available
                                                                </div>
                                                            }
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

                        {OrderItemDetails.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    //   onClick={onsave}
                                    id={saveBtnid}
                                    userAcc={userPageAccessState}
                                    module={"Material Issue"}
                                />
                            </Col>
                        </FormGroup > : null}
                    </form>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Invoice
