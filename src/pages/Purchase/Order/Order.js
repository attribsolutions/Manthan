import {
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


import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
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
import { AlertState, BreadcrumbFilterSize } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, totalAmount } from "./OrderPageCalulation";
import '../../Order/div.css'

import { ORDER_lIST } from "../../../routes/route_url";
import { SaveButton, Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";

import { getTermAndCondition } from "../../../store/Administrator/TermsAndConditionsRedux/actions";

import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { createdBy, currentDate, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import OrderPageTermsTable from "./OrderPageTermsTable";

let description = ''
let editVal = {}

const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const [podate, setpoDate] = useState(() => currentDate());
    const [deliverydate, setdeliverydate] = useState(() => currentDate())
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
        supplierAddress = [],
    } = useSelector((state) => ({
        items: state.OrderReducer.orderItem,
        supplier: state.SupplierReducer.supplier,
        supplierAddress: state.SupplierReducer.supplierAddress,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList,
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

                goButtonHandler(hasEditVal)//=======Go Button API Call
                dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))
                setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
                setpoDate(hasEditVal.OrderDate)
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                description = hasEditVal.Description
                editVal = {}
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)
                const termsAndCondition = hasEditVal.OrderTermsAndCondition.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition,
                    IsDeleted: 0
                }))
                setTermsAndConTable(termsAndCondition)
            }
            dispatch(editOrderIdSuccess({ Status: false }))
        } else {
            dispatch(BreadcrumbFilterSize(`${"Order Amount"} :0`))

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
            setTermsAndConTable([])
            dispatch(goButtonSuccess([]))
            description = ''
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
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            description = ''
            history.push({
                pathname: ORDER_lIST,
                // renderMode: true
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
            var amt = parseFloat(ind.totalAmount)
            debugger
            sum = sum + amt
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${sum.toFixed(2)}`))
    }

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));


    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },

        { //------------- Quantity column ----------------------------------
            text: "Quantity",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => {
                // if (row.inpRate === undefined) { row["inpRate"] = '' }
                // if (row.inpQty === undefined) { row["inpQty"] = '' }
                // if (row.totalAmount === undefined) { row["totalAmount"] = 0 }
                return (

                    <span >
                        <Input type="text"
                            id={`inpQty${k}`}
                            defaultValue={row.inpQty}
                            key={row.inpQty}
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`inpQty${k}`).value = row.inpQty
                                }
                            }}
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, items)}
                        />
                    </span>

                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            sort: true,
            formatter: (value, row, key) => {
                if (row.UOMLabel === undefined) {
                    row["UOM"] = row.UnitDetails[0].UnitID
                    row["UOMLabel"] = row.UnitDetails[0].UnitName
                    row["inpBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
                    row["poBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
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

        {//------------- Rate column ----------------------------------
            text: "Rate/Unit",
            dataField: "Rate",
            sort: true,
            formatter: (value, row, k) => {

                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`inpRatey${k}`}
                            defaultValue={row.inpRate}
                            autoComplete="off"
                            // disabled={(row.GST === '') ? true : false}
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "rate")
                                } else {
                                    document.getElementById(`inpRatey${k}`).value = row.inpRate
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

        { //------------- GST column ----------------------------------
            text: "GST %",
            dataField: "GSTPercentage",
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

    const goButtonHandler = (hasEditVal = false) => {
        if (hasEditVal) {
            const jsonBody = JSON.stringify({
                Party: hasEditVal.Supplier,
                EffectiveDate: hasEditVal.OrderDate
            });
            dispatch(goButton(jsonBody, hasEditVal))
            return
        }

        let supplier = supplierSelect.value
        if (!supplier > 0) {
            alert("Please Select Customer")
            return
        }

        if (items.length > 0) {
            if (window.confirm("Refresh Order Item...!")) {
                dispatch(goButtonSuccess([]))
            } else { return }
        }

        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :0:00`))
        const jsonBody = JSON.stringify({
            Party: supplier,
            EffectiveDate: podate
        });
        dispatch(goButton(jsonBody))

    };

    const saveHandeller = () => {
        const division = userParty();
        const supplier = supplierSelect.value;

        const validMsg = []
        const itemArr = []
        // let termsAndCondition = []

        function isChanged({ i, isedit, isdel }) {

            const basicAmt = parseFloat(basicAmount(i))
            const cgstAmt = (GstAmount(i))
            const arr = {
                id: i.editrowId,
                Item: i.id,
                Quantity: isdel ? 0 : i.inpQty,
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
                CGSTPercentage: (i.GSTPercentage / 2),
                SGSTPercentage: (i.GSTPercentage / 2),
                IGSTPercentage: 0,
                Amount: i.totalAmount,
                IsDeleted: isedit ? 1 : 0
            }
            itemArr.push(arr)
        };

        function orderItem({ i, isedit }) {

            if ((i.inpQty > 0) && (i.inpRate > 0)) {
                var isdel = false;

                isChanged({ i, isedit, isdel })
            }
            else if ((i.inpQty < 1) && (i.editrowId)) {
                var isdel = true;
                isChanged({ i, isedit, isdel })
            };
        }

        items.forEach(i => {

            if ((i.inpQty > 0) && !(i.inpRate > 0)) {
                validMsg.push(`${i.Name}:  This Item Rate Is Require...`);
            };

            if (pageMode === "edit") {
                var ischange = (!(i.poQty === i.inpQty) ||
                    !(i.poRate === i.inpRate) || !(i.poBaseUnitQty === i.inpBaseUnitQty))
                if (ischange) {
                    var isedit = true;
                    orderItem({ i, isedit })
                } else {
                    var isedit = false;
                    orderItem({ i, isedit })
                }
            }
            else {
                var isedit = false;
                orderItem({ i, isedit })
            }
        })
        // debugger
        // if (pageMode === "edit11") {
        //     termsAndConTable.forEach(i => {
        //         var found = editVal.OrderTermsAndCondition.find(ele => (i.value === ele.id))
        //         if (found === undefined) {
        //             termsAndCondition.push({
        //                 TermsAndCondition: i.value,
        //                 IsDeleted: 0
        //             })

        //         }
        //         else {
        //             termsAndCondition.push({
        //                 TermsAndCondition: i.value,
        //                 IsDeleted: 0
        //             })

        //         }
        //     })
        // } else {

        const termsAndCondition = termsAndConTable.map(i => ({
            TermsAndCondition: i.value,
            IsDeleted: i.IsDeleted
        }))
        // }

        if (validMsg.length > 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(validMsg),
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }
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
            OrderDate: podate,
            DeliveryDate: deliverydate,
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
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            OrderItem: itemArr,
            OrderTermsAndConditions: termsAndCondition
        });

        if (pageMode === "edit") {
            dispatch(updateOrderId(jsonBody, editVal.id))

        } else {

            dispatch(postOrder(jsonBody))
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
                    <div className="px-2 mb-1 mt-n3 c_card_filter header" >
                        <div className=" mt-1 row ">
                            <Col sm="6" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "115px" }}>Order Date</Label>
                                    <Col sm="6">
                                        <Flatpickr
                                            style={{ userselect: "all" }}
                                            id="orderdate"
                                            name="orderdate"
                                            value={podate}
                                            disabled={pageMode === "edit" ? true : false}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={(e, date) => { setpoDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>


                            <Col sm="6">
                                <FormGroup className="mb-1 row mt-3 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>Supplier Name</Label>
                                    <Col sm="6">
                                        <Select


                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            isDisabled={pageMode === "edit" ? true : false}
                                            options={supplierOptions}
                                            onChange={(e) => { setsupplierSelect(e) }}
                                        />
                                    </Col>
                                    <Col sm="1" className="mx-4 ">
                                        {pageMode === "save" ?
                                            //  <Button
                                            //     id={""}
                                            //      type="button" color="btn btn-outline-success border-2 font-size-12"
                                            //         onClick={(e) => goButtonHandler()}>Go</Button> */}
                                            <Go_Button onClick={(e) => goButtonHandler()} />
                                            : null}
                                    </Col>
                                </FormGroup>
                            </Col >



                        </div>
                    </div>

                    <div className="px-2  mb-1 c_card_body" >

                        <div className="row">
                            <div className="col col-6">
                                <FormGroup className=" row  mt-3" >
                                    <Label className="   p-2"
                                        style={{ width: "115px" }}>Description</Label>
                                    <div className="col-6">
                                        <Input type="text"
                                            defaultValue={description}
                                            placeholder='Enter Order Description'
                                            onChange={e => description = e.target.value}
                                        />

                                    </div>

                                </FormGroup>
                            </div >
                            <div className="col col-6" >
                                <FormGroup className=" row mt-3 " >
                                    <Label className=" p-2"
                                        style={{ width: "130px" }}>Delivery Date</Label>
                                    <div className="col col-6 sm-1">
                                        <Flatpickr
                                            id="deliverydate"
                                            name="deliverydate"
                                            value={deliverydate}
                                            disabled={pageMode === "edit" ? true : false}
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
                                        style={{ width: "115px" }}>Billing Address</Label>

                                    <div className="col col-6">

                                        <Select
                                            value={billAddr}
                                            classNamePrefix="select2-Customer"

                                            options={supplierAddress}
                                            styles={{
                                                control: base => ({
                                                    ...base,
                                                    border: 'non',
                                                    // backgroundColor: ""
                                                })
                                            }}
                                            onChange={(e) => { setbillAddr(e) }}
                                        />

                                    </div>
                                </FormGroup>
                            </div >
                            <div className="col col-6">
                                <FormGroup className="mb-2 row " >
                                    <Label className=" p-2"
                                        style={{ width: "130px" }}>Shipping Address</Label>


                                    <div className="col col-6">

                                        <Select
                                            value={shippAddr}
                                            classNamePrefix="select2-Customer"
                                            // isDisabled={pageMode === "edit" ? true : false}
                                            styles={{
                                                control: base => ({
                                                    ...base,
                                                    border: 'non',
                                                    // backgroundColor: ""

                                                })
                                            }}
                                            options={supplierAddress}
                                            onChange={(e) => { setshippAddr(e) }}
                                        />

                                    </div>
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
                                                <div className="table table-Rresponsive ">
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
                            <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} />
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

