import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";


import React, { useEffect, useState, useRf, useRef } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import {
    editOrderIdSuccess,
    goButton,
    goButtonSuccess,
    postOrder,
    postOrderSuccess,
    updateOrderId,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplier, getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import { AlertState, BreadcrumbFilterSize } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, totalAmount } from "./OrderPageCalulation";
import '../../Order/div.css'

import { ORDER_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/CommonSaveButton";

import { getTermAndCondition } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

import OrderPageTemsTable from "./OrderPageTemsTable";
import Breadcrumb from "../../../components/Common/Breadcrumb3";

let description = ''
let editVal = {}

const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const [podate, setpoDate] = useState("today");
    const [deliverydate, setdeliverydate] = useState("today")
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('')

    const [supplierSelect, setsupplierSelect] = useState('');
    const [orderAmount, setOrderAmount] = useState(0);
    const [termsAndConTable, setTermsAndConTable] = useState([]);


    useEffect(() => {
        dispatch(getSupplier())
        dispatch(getSupplierAddress())
        dispatch(getTermAndCondition())

    }, [])

    const {
        items,
        postMsg,
        supplier,
        userAccess,
        updateMsg,
        supplierAddress,
        termsAndCondtions,
        pageField
    } = useSelector((state) => ({
        items: state.OrderReducer.orderItem,
        supplier: state.SupplierReducer.supplier,
        supplierAddress: state.SupplierReducer.supplierAddress,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList,
        termsAndCondtions: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
    }));


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    useEffect(() => {
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${orderAmount}`))
        dispatch(goButtonSuccess([]))

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

                const jsonBody = JSON.stringify({
                    Supplier: hasEditVal.Supplier,
                    EffectiveDate: hasEditVal.OrderDate
                }
                );
                dispatch(goButton(jsonBody, hasEditVal))
                dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))

                setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
                setpoDate(hasEditVal.OrderDate)
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                description = hasEditVal.Description
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)
                const termsAndCondition = hasEditVal.OrderTermsAndCondition.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition
                }))
                setTermsAndConTable(termsAndCondition)
            }
            dispatch(editOrderIdSuccess({ Status: false }))
        }


    }, [])

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postOrderSuccess({ Status: false }))
            dispatch(goButtonSuccess([]))
            setTermsAndConTable([])
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: ORDER_lIST,
            }))

        } else if (postMsg.Status === true) {
            dispatch(postOrderSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: ORDER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateOrderIdSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);


    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["inpQty"] = val;
        }
        else {
            row["inpRate"] = val
        }
        row["totalAmount"] = totalAmount(row)

        let sum = 0
        items.forEach(ind => {
            sum = sum + parseFloat(ind.totalAmount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${sum.toFixed(2)}`))
    }

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));


    const pagesListColumns = [
        //------------- ItemName column ----------------------------------
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },
        //------------- Quntity column ----------------------------------
        {
            text: "Quntity",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (

                <span >
                    <Input type="text"
                        id={`inpQty${k}`}
                        defaultValue={row.inpQty}
                        disabled={((row.inpRate === 0) || row.GST === '') ? true : false}
                        onChange={(e) => {
                            val_onChange(e.target.value, row, "qty")
                        }}
                        autoComplete="off"
                        onKeyDown={(e) => handleKeyDown(e, items)} />
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },
        //------------- UOM column ----------------------------------
        {
            text: "UOM",
            dataField: "",
            sort: true,
            formatter: (value, row, key) => {
                if (row.UOMLabel === undefined) {
                    row["UOM"] = row.UnitDetails[0].UnitID
                    row["UOMLabel"] = row.UnitDetails[0].UnitName
                    row["inpBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
                }
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.UOM, label: row.UOMLabel }}
                        // value={{value:row.UOM,label:row.UOMLabel}}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.UnitID,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["UOM"] = e.value;
                            row["UOMLabel"] = e.label
                            row["inpBaseUnitQty"] = e.baseUnitQty
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },
        //------------- Rate column ----------------------------------
        {
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row, k) => {
                if (row.inpRate === undefined) { row["inpRate"] = 0 }
                if (row.totalAmount === undefined) { row["totalAmount"] = 0 }
                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`inpRatey${k}`}
                            defaultValue={row.inpRate}
                            disabled={(row.GST === '') ? true : false}
                            onChange={e => {
                                row["inpRate"] = e.target.value;
                                const qty = document.getElementById(`inpQty${k}`)
                                const val = e.target.value
                                if (val > 0) {

                                    val_onChange(val, row, "rate")
                                    qty.disabled = false
                                } else {
                                    qty.value = ''
                                    row["inpQty"] = 0;
                                    val_onChange(0, row, "rate")
                                    qty.disabled = true
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, items)}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },
        //------------- GST column ----------------------------------
        {
            text: "GST %",
            dataField: "GST",
            sort: true,
            formatter: (value, row) => (

                <span >
                    {value}
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "left" };
            }

        },

    ];

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (items.length + 2),
        totalSize: 0,
        custom: true,
    };


    const GoButton_Handler = () => {
        let supplier = supplierSelect.value

        if (!supplier > 0) {
            alert("Please Select Customer")
            return
        }

        if (items.length > 0) {
            if (window.confirm("Refresh Order Item...!")) {
                dispatch(goButtonSuccess([]))
            } else {
                return
            }
        }

        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        const jsonBody = JSON.stringify({
            Supplier: supplier,
            EffectiveDate: podate
        }
        );

        dispatch(goButton(jsonBody))
        console.log("jsonBody", jsonBody)
    };

    const saveHandeller = () => {
        let division = 0
        let orderDate = ''
        let delDate = ''
        const supplier = supplierSelect.value

        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
            orderDate = document.getElementById("orderdate").value
            delDate = document.getElementById("deliverydate").value
        } catch (e) {
            alert(e)
            return
        }

        const itemArr = []
        items.forEach(i => {
            if ((i.inpQty > 0)) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                const arr = {
                    Item: i.id,
                    Quantity: i.inpQty,
                    MRP: i.MRP,
                    Rate: i.inpRate,
                    Unit: i.UOM,
                    BaseUnitQuantity: i.inpBaseUnitQty,
                    Margin: "",
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    GST: i.Gstid,
                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GST / 2),
                    SGSTPercentage: (i.GST / 2),
                    IGSTPercentage: 0,
                    Amount: i.totalAmount,
                }

                itemArr.push(arr)
            };
        })
        const termsAndCondition = termsAndConTable.map(i => ({ TermsAndCondition: i.value }))

        if (itemArr.length === 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Please Enter One Item Quantity",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }
        if (termsAndCondition.length === 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Please Enter One Terms And Condition",
                RedirectPath: false,
                AfterResponseAction: false
            }));

            return
        }
        const jsonBody = JSON.stringify({
            OrderDate: orderDate,
            DeliveryDate: delDate,
            Customer: division,
            Supplier: supplier,
            OrderAmount: orderAmount,
            Description: description,
            BillingAddress: billAddr.value,
            ShippingAddress: shippAddr.value,
            OrderNo: 1,
            FullOrderNumber: "PO0001",
            OrderType: 1,
            POType: 1,
            Division: division,
            CreatedBy: 1,
            UpdatedBy: 1,
            OrderItem: itemArr,
            OrderTermsAndConditions: termsAndCondition
        });

        if (pageMode === "edit") {
            dispatch(updateOrderId(jsonBody, editVal.id))
            console.log("orderEdit", jsonBody)

        } else {

            dispatch(postOrder(jsonBody))
            console.log("ordersave", jsonBody)
        }


    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content">
                    <Breadcrumb
                        pageHeading={userAccState.PageHeading}
                        showCount={true}
                    />
                    <div className="px-2 mb-1 mt-n1" style={{ backgroundColor: "#dddddd" }} >
                        <div className=" mt-1 row">
                            <Col md="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "100px" }}>Order Date</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            id="orderdate"
                                            name="orderdate"
                                            value={podate}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                minDate: pageMode === "edit" ? podate : "today",
                                                // maxDate: pageMode === "edit" ? podate : "",
                                                // defaultDate: pageMode === "edit" ? "" : "today"
                                            }}
                                            onChange={(e, date) => { setpoDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="3">
                                <FormGroup className="mb-2 row mt-3 " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        <Select
                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            isDisabled={pageMode === "edit" ? true : false}
                                            options={supplierOptions}
                                            onChange={(e) => { setsupplierSelect(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col md="1" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={GoButton_Handler}>Go</Button>
                            </Col>
                        </div>
                    </div>

                    <div className="px-2  mb-1" style={{ backgroundColor: "#dddddd" }} >

                        <div className="row">
                            <div className="col col-6">
                                <FormGroup className=" row mt-3 mt-3" >
                                    <Label className="  col col-3 mt-2"
                                        style={{ width: "130px" }}>Description</Label>
                                    <div className=" col ">
                                        <Input type="text"
                                            defaultValue={description}
                                            onChange={e => description = e.target.value}
                                            style={{ backgroundColor: "#dddddd" }} />
                                    </div>

                                </FormGroup>
                            </div >
                            <div className="col col-6">
                                <FormGroup className=" row mt-3 " >
                                    <Label className=" col col-3  p-2"
                                        style={{ width: "130px" }}>Delivery Date</Label>
                                    <div className="col col-6">
                                        <Flatpickr
                                            id="deliverydate"
                                            ref={(e) => { debugger }}
                                            name="deliverydate"
                                            value={deliverydate}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                minDate: pageMode === "edit" ? podate : "today",

                                            }}
                                            onChange={(e, date) => { setdeliverydate(date) }}
                                        />
                                    </div>

                                </FormGroup>
                            </div >
                        </div>
                        <div className="row  ">
                            <div className="col col-6">
                                <FormGroup className="mb-2 row  " >
                                    <Label className=" p-2"
                                        style={{ width: "130px" }}>Billing Address</Label>
                                    <Select
                                        value={billAddr}
                                        classNamePrefix="select2-Customer"
                                        // isDisabled={pageMode === "edit" ? true : false}
                                        options={supplierAddress}
                                        styles={{
                                            control: base => ({
                                                ...base,
                                                border: 'non',
                                                backgroundColor: ""

                                            })
                                        }}
                                        onChange={(e) => { setbillAddr(e) }}
                                    />
                                </FormGroup>
                            </div >
                            <div className="col col-6">
                                <FormGroup className="mb-2 row " >
                                    <Label className=" p-2"
                                        style={{ width: "130px" }}>Shipping Address</Label>
                                    <Select
                                        value={shippAddr}
                                        classNamePrefix="select2-Customer"
                                        // isDisabled={pageMode === "edit" ? true : false}
                                        styles={{
                                            control: base => ({
                                                ...base,
                                                border: 'non',
                                                backgroundColor: ""

                                            })
                                        }}
                                        options={supplierAddress}
                                        onChange={(e) => { setshippAddr(e) }}
                                    />
                                </FormGroup>
                            </div >
                        </div>

                    </div>
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={items}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-Rresponsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered table-hover"}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                    {mySearchProps(toolkitProps.searchProps)}
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

                    {
                        items.length > 0 ?
                            <OrderPageTemsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} />
                            : null
                    }

                    {
                        (items.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"Order"} onClick={saveHandeller}
                            />
                        </div>
                            : <div className="row save1"></div>
                    }
                </div >
                {/* </div> */}

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default Order

