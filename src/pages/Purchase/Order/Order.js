import {
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
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
    goButtonForOrderAdd,
    goButtonForOrderAddSuccess,
    postOrder,
    postOrderSuccess,
    updateOrderId,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getOrderType, getSupplier, getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { AlertState, BreadcrumbShowCountlabel, CommonBreadcrumbDetails } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "./OrderPageCalulation";
import '../../Order/div.css'
import { ORDER_lIST } from "../../../routes/route_url";
import { SaveButton, Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { getTermAndCondition } from "../../../store/Administrator/TermsAndConditionsRedux/actions";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { createdBy, currentDate, saveDissable, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import OrderPageTermsTable from "./OrderPageTermsTable";
import { initialFiledFunc } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";

import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import { initialstate } from "../../../components/VerticalLayout/Header1";
let description = ''
let editVal = {}

const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        id: "",
        Name: "",
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    // const [podate, setpoDate] = useState(currentDate);
    const [deliverydate, setdeliverydate] = useState(currentDate)
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate);
    const [poToDate, setpoToDate] = useState(currentDate);
    const [orderdate, setorderdate] = useState(currentDate);
    const [supplierSelect, setsupplierSelect] = useState('');

    const [orderAmount, setOrderAmount] = useState(0);
    const [termsAndConTable, setTermsAndConTable] = useState([]);
    const [orderTypeSelect, setorderTypeSelect] = useState('');
    const [isOpen_TermsModal, setisOpen_TermsModal] = useState(false)
    const [orderItemTable, setorderItemTable] = useState([])



    const {
        goBtnOrderdata,
        postMsg,
        supplier,
        userAccess,
        orderType,
        updateMsg,
        supplierAddress = [],

    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        supplier: state.SupplierReducer.supplier,
        supplierAddress: state.SupplierReducer.supplierAddress,
        orderType: state.SupplierReducer.orderType,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList,
        // orderAddFilter: state.OrderReducer.orderAddFilter,
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
            var a = { ...initialstate }
            a.pageHeading = userAcc.PageHeading;
            a.showCount = true;
            a.breadShow = true;
            dispatch(CommonBreadcrumbDetails(a))
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


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
                dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${hasEditVal.OrderAmount}`))

                setorderdate(hasEditVal.OrderDate)
                setsupplierSelect({
                    label: hasEditVal.SupplierName,
                    value: hasEditVal.Supplier
                })
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                description = hasEditVal.Description
                editVal = {}
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)
                setorderTypeSelect({ value: hasEditVal.POType, label: hasEditVal.POTypeName })

                setpoToDate(hasEditVal.POToDate)
                setpoFromDate(hasEditVal.POFromDate)

                const termsAndCondition = hasEditVal.TermsAndConditions.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition,
                    IsDeleted: 0
                }))

                const orderItems = hasEditVal.OrderItems.map((ele, k) => {
                    ele["id"] = k + 1

                    return ele
                });
                setorderItemTable(orderItems)
                setTermsAndConTable(termsAndCondition)
            }
            dispatch(editOrderIdSuccess({ Status: false }))
        } else {
            dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :0`))
            // dispatch(orderAddfilters({
            //     orderdate: currentDate,
            //     supplierSelect: ''
            // }));
        }
    }, [])

    useEffect(() => {
        if (goBtnOrderdata) {
            let { OrderItems = [], TermsAndConditions = [] } = goBtnOrderdata
            setorderItemTable(OrderItems)
            setTermsAndConTable(TermsAndConditions)
            dispatch(goButtonForOrderAddSuccess(''))
        }
    }, [goBtnOrderdata]);

    useEffect(() => {
        dispatch(goButtonForOrderAddSuccess(null))
        dispatch(getSupplier())
        dispatch(getSupplierAddress())
        dispatch(getTermAndCondition())
        dispatch(getOrderType())
        description = ''
    }, [])

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress])

    useEffect(() => {
        if ((orderType.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setorderTypeSelect({
                value: orderType[0].id,
                label: orderType[0].Name,
            });
        }
    }, [orderType])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postOrderSuccess({ Status: false }))
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
            setTermsAndConTable([])
            dispatch(goButtonForOrderAddSuccess([]))
            description = ''
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: ORDER_lIST,
            }))

        } else if (postMsg.Status === true) {
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
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
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++Update Button Is enable function
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
            description = ''
            history.push({
                pathname: ORDER_lIST,
                // renderMode: true
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++Update Button Is enable function
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
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }

        row["Amount"] = Amount(row)

        let sum = 0
        orderItemTable.forEach(ind => {
            if (ind.Amount === null) {
                ind.Amount = 0
            }
            var amt = parseFloat(ind.Amount)
            sum = sum + amt
        });
        setOrderAmount(sum.toFixed(2))
        // dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
        // dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
    };

    function assignItem_onClick() {
        setisOpen_TermsModal(true)
    };

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const orderTypeOptions = orderType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------

            dataField: "ItemName",
            headerFormatter: (value, row, k) => {
                return (
                    <div className="d-flex justify-content-between">
                        <div>
                            Item Name
                        </div>

                        <div>
                            <samp style={{ display: supplierSelect.value > 0 ? "block" : "none" }} className="text-primary fst-italic text-decoration-underline"
                                onClick={assignItem_onClick}>
                                Assign-Items</samp>
                        </div>
                    </div>
                )
            },
        },

        {//------------- Stock Quantity column ----------------------------------
            text: "Stock Qty",
            dataField: "StockQuantity",
            // sort: true,
            formatter: (value, row, k) => {

                return (
                    <div className="text-end">
                        <span>{row.StockQuantity}</span>
                    </div>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },

        { //------------- Quantity column ----------------------------------
            text: "Quantity",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${k}`}
                            defaultValue={row.Quantity}
                            key={row.Quantity}
                            className="text-end"
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`Quantity${k}`).value = row.Quantity
                                }
                                handleKeyDown(e, orderItemTable)
                            }}
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, orderItemTable)}
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
            // sort: true,
            formatter: (value, row, key) => {

                if (!row.UnitName) {
                    row["Unit_id"] = row.UnitDetails[0].UnitID
                    row["UnitName"] = row.UnitDetails[0].UnitName
                    row["BaseUnitQuantity"] = row.UnitDetails[0].BaseUnitQuantity
                    row["poBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
                }

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                        // value={{value:row.Unit,label:row.UnitName}}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.UnitID,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["Unit_id"] = e.value;
                            row["UnitName"] = e.label
                            row["BaseUnitQuantity"] = e.baseUnitQty
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
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {

                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`Ratey${k}`}
                            defaultValue={row.Rate}
                            autoComplete="off"
                            className="text-end"
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "rate")
                                } else {
                                    document.getElementById(`Ratey${k}`).value = row.Rate
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, orderItemTable)}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Comment${k}`}
                            defaultValue={row.Comment}
                            autoComplete="off"
                            onChange={(e) => { row["Comment"] = e.target.value }}
                        />
                    </span>

                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
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
        sizePerPage: (orderItemTable.length + 2),
        totalSize: 0,
        custom: true,
    };

    function Open_TermsModal_func() {
        setisOpen_TermsModal(false)
        goButtonHandler()
    }

    const goButtonHandler = () => {
        if (!supplierSelect > 0) {
            dispatch(
                AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Please select supplier",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :0:00`))

        const jsonBody = JSON.stringify({
            Party: supplierSelect.value,
            Customer: userParty(),
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.save) ? 0 : editVal.id
        })

        dispatch(goButtonForOrderAdd(jsonBody))
    };

    function orderdateOnchange(e, date) {
        setorderdate(date)
    };

    function permissionfunc(istrue) {
        if (istrue) {
            setsupplierSelect(istrue)// **istrue is == event value
            setorderItemTable([])
        }
    }

    function supplierOnchange(e) {
        var isfind = orderItemTable.find(i => (i.Quantity > 0))
        if (isfind) {
            dispatch(
                AlertState({
                    Type: 7,
                    Status: true,
                    Message: "If you are change Supplier Name then All Item Data is Clear",
                    RedirectPath: false,
                    PermissionFunction: permissionfunc,
                    permissionValueReturn: e

                })
            );
            return;
        } else {
            setsupplierSelect(e)
            setorderItemTable([])
            setTermsAndConTable([])
        }

        // let newObj = { ...orderAddFilter }
        // newObj.supplierSelect = e
        // dispatch(orderAddfilters(newObj))
    };

    const saveHandeller = () => {
        const division = userParty();
        const supplier = supplierSelect.value;

        const validMsg = []
        const itemArr = []

        function isChanged({ i, isedit, isdel }) {

            const basicAmt = parseFloat(basicAmount(i))
            const cgstAmt = (GstAmount(i))
            const arr = {
                id: i.editrowId,
                Item: i.Item_id,
                Quantity: isdel ? 0 : i.Quantity,
                MRP: i.MRP,
                Rate: i.Rate,
                Unit: i.Unit_id,
                BaseUnitQuantity: i.BaseUnitQuantity,
                Margin: "",
                BasicAmount: basicAmt.toFixed(2),
                GSTAmount: cgstAmt.toFixed(2),
                GST: i.GST_id,
                CGST: (cgstAmt / 2).toFixed(2),
                SGST: (cgstAmt / 2).toFixed(2),
                IGST: 0,
                CGSTPercentage: (i.GSTPercentage / 2),
                SGSTPercentage: (i.GSTPercentage / 2),
                IGSTPercentage: 0,
                Amount: i.Amount,
                IsDeleted: isedit,
                Comment: i.Comment
            }
            itemArr.push(arr)
        };

        function orderItem({ i, isedit }) {

            if ((i.Quantity > 0) && (i.Rate > 0)) {
                var isdel = false;

                isChanged({ i, isedit, isdel })
            }
            else if ((i.Quantity < 1) && (i.editrowId)) {
                var isdel = true;
                isChanged({ i, isedit, isdel })
            };
        }

        orderItemTable.forEach(i => {

            if ((i.Quantity > 0) && !(i.Rate > 0)) {
                validMsg.push(`${i.ItemName}:  This Item Rate Is Require...`);
            }
            //  else if (!(i.Quantity > 0) && (i.Rate > 0)) {
            //     validMsg.push(`${i.ItemName}:  This Item Quantity Is Require...`);
            // }

            else if (pageMode === "edit") {
                var ischange = (!(i.poQty === i.Quantity) ||
                    !(i.poRate === i.Rate) || !(i.poBaseUnitQty === i.BaseUnitQuantity))
                if (ischange && (i.poQty === 0)) {
                    var isedit = 0;
                    orderItem({ i, isedit })
                }
                else if (ischange) {
                    var isedit = 1;
                    orderItem({ i, isedit })
                } else {
                    var isedit = 0;
                    orderItem({ i, isedit })
                }
            }
            else {
                var isedit = 0;
                orderItem({ i, isedit })
            };
        })
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
            OrderDate: orderdate,
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
            POType: orderTypeSelect.value,
            POFromDate: orderTypeSelect.value === 1 ? currentDate : poFromDate,
            POToDate: orderTypeSelect.value === 1 ? currentDate : poToDate,
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            OrderItem: itemArr,
            OrderTermsAndConditions: termsAndCondition,


        });

        saveDissable({ id: userAccState.ActualPagePath, state: true });//+++++++++save Button Is dissable function

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

                    {/* <Breadcrumb
                        pageHeading={userAccState.PageHeading}
                        showCount={true}
                    /> */}
                    <div className="px-2 mb-1 mt-n1 c_card_filter header text-black" >
                        <div className=" mt-1 row ">
                            <Col sm="6">
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "115px" }}>Order Date</Label>
                                    <Col sm="6">
                                        <Flatpickr
                                            style={{ userselect: "all" }}
                                            id="orderdate"
                                            name="orderdate"
                                            value={orderdate}
                                            disabled={pageMode === "edit" ? true : false}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={orderdateOnchange}
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
                                            onChange={supplierOnchange}
                                        />
                                    </Col>
                                    <Col sm="1" className="mx-4 ">
                                        {pageMode === "save" ?
                                            <Go_Button onClick={(e) => goButtonHandler()} />
                                            : null}
                                    </Col>
                                </FormGroup>
                            </Col >

                        </div>
                    </div>

                    <div className="px-2  mb-1 c_card_body text-black" >

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
                                                // minDate: pageMode === "edit" ? orderdate : "today",

                                            }}
                                            onChange={(e, date) => { setdeliverydate(date) }}
                                        />
                                    </div>

                                </FormGroup>
                            </div >
                        </div>
                        <div className="row  ">
                            <div className="col col-6">
                                <FormGroup className="row  " >
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
                                <FormGroup className=" row " >
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

                        <div className="row" >
                            <div className="col col-6" >
                                <FormGroup className=" row  " >
                                    <Label className=" p-2"
                                        style={{ width: "115px" }}>Order Type</Label>
                                    <div className="col col-6 ">
                                        <Select
                                            value={orderTypeSelect}
                                            classNamePrefix="select2-Customer"
                                            options={orderTypeOptions}
                                            onChange={(e) => { setorderTypeSelect(e) }}
                                        />
                                    </div>
                                </FormGroup>
                            </div >
                        </div>

                        {orderTypeSelect.label === 'Open PO' ? <div className="row" >
                            <div className="col col-6" >
                                <FormGroup className=" row  " >
                                    <Label className=" p-2"
                                        style={{ width: "115px" }}>PO From Date</Label>
                                    <div className="col col-6 ">
                                        <Flatpickr
                                            id="pofromdate"
                                            name="pofromdate"
                                            value={poFromDate}
                                            // disabled={pageMode === "edit" ? true : false}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={(e, date) => { setpoFromDate(date) }}
                                        />
                                    </div>
                                </FormGroup>
                            </div >

                            <div className="col col-6" >
                                <FormGroup className=" row  " >
                                    <Label className=" p-2"
                                        style={{ width: "130px" }}>PO To Date</Label>
                                    <div className="col col-6 ">
                                        <Flatpickr
                                            id="potodate"
                                            name="potodate"
                                            value={poToDate}
                                            // disabled={pageMode === "edit" ? true : false}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={(e, date) => { setpoToDate(date) }}
                                        />
                                    </div>
                                </FormGroup>
                            </div >
                        </div> : <></>}

                    </div>

                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={orderItemTable}
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
                        orderItemTable.length > 0 ?
                            <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.OrderTermsAndCondition} />
                            : null
                    }

                    {
                        ((orderItemTable.length > 0) && (!isOpen_TermsModal)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"Order"} onClick={saveHandeller}
                            />
                        </div>
                            : <div className="row save1"></div>
                    }
                </div >

                <Modal
                    isOpen={isOpen_TermsModal}
                    toggle={() => {
                        setisOpen_TermsModal(false)
                    }}
                    size="xl"
                >

                    <PartyItems
                        dropMode={mode.dropdownAdd}
                        editValue={{ SupplierName: supplierSelect }}
                        masterPath={url.PARTYITEM}
                        redirectPath={url.ORDER}
                        isOpenModal={Open_TermsModal_func} />

                </Modal>

            </React.Fragment >
        )
    } else {
        return null
    }

}


export default Order

