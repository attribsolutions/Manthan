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
import { basicAmount, GstAmount, handleKeyDown, totalAmount } from "../Order/OrderPageCalulation";
import '../../Order/div.css'

import { ORDER_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/CommonSaveButton";

import { getTermAndCondition } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { getGRN_itemMode2_Success } from "../../../store/Purchase/GRNRedux/actions";

let description = ''
let editVal = {}

const GRNAdd = (props) => {

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
    const [grnItemData, setgrnItemData] = useState({});
    const { OrderItem = [] } = grnItemData

    useEffect(() => {
        // dispatch(getSupplier())
        dispatch(getSupplierAddress())

    }, [])

    const {
        items,
        // table,
        postMsg,
        supplier,
        userAccess,
        updateMsg,
        supplierAddress,
        pageField
    } = useSelector((state) => ({
        supplier: state.SupplierReducer.supplier,
        supplierAddress: state.SupplierReducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        table: state.GRNReducer.GRNitem3,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
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
        if ((items.Status === true) && (items.StatusCode === 200)) {
            // dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${orderAmount}`))

            const hasEditVal = items.Data
            hasEditVal.OrderItem.forEach(ele => {
                ele["Name"] = ele.ItemName
                ele["inpRate"] = ele.Rate
                ele["inpQty"] = ele.Quantity
                ele["totalAmount"] = ele.Amount
                ele["UOM"] = ele.Unit
                ele["UOMLabel"] = ele.UnitName
                ele["inpBaseUnitQty"] = ele.BaseUnitQuantity
            });

            setgrnItemData(hasEditVal)
            dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))

            // setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
            // setpoDate(hasEditVal.OrderDate)
            setOrderAmount(hasEditVal.OrderAmount)

            items.Status = false
            items.Data = []
            dispatch(getGRN_itemMode2_Success(items))
        }

    }, [items])


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
        const amount = totalAmount(row)
        row["totalAmount"] = amount
        try {
            document.getElementById(`abc${row.id}`).value = amount
        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        OrderItem.forEach(ind => {
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
            formatter: (value, row) => (
                <div className=" mt-2">
                    <span>{value}</span>
                </div>
            ),
        },
        //  ------------Quntity column -----------------------------------  
        {
            text: "Quntity",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (

                <span >
                    <Input type="text"
                        id={`inpQty${k}`}
                        className="text-end "
                        defaultValue={row.inpQty}
                        disabled={((row.inpRate === 0) || row.GST === '') ? true : false}
                        onChange={(e) => {
                            val_onChange(e.target.value, row, "qty")
                        }}
                        autoComplete="off"
                        onKeyDown={(e) => handleKeyDown(e, OrderItem)} />
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },
        //  ------------UOM column -----------------------------------
        {
            text: "UOM",
            dataField: "UOMLabel",
            sort: true,
            formatter: (value, row) => (
                <div className="text-center mt-2">
                    <span>{value}</span>
                </div>


            ),
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },
        //-------------Rate column ----------------------------------
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
                            className=" text-end "
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
        //------------- GST column ------------------------------------
        {
            text: "GST %",
            dataField: "GST",
            sort: true,
            formatter: (value, row) => (
                <div className="text-center mt-2">
                    <span>{value}</span>
                </div>


            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "left" };
            }

        },
        //------------- ItemName column ----------------------------------
        {
            text: "Item Amount",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1">
                    <div className="col ">
                        <Input type='text'
                            id={`abc${row.id}`}
                            className="  border-0  "
                            value={row.totalAmount} />
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
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
        sizePerPage: (OrderItem.length + 2),
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

        const itemArr = []
        OrderItem.forEach(i => {
            if ((i.inpQty > 0)) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                const arr = {
                    Item: i.Item,
                    Quantity: i.inpQty,
                    MRP: i.MRP,
                    ReferenceRate: i.Rate,
                    Rate: i.inpRate,
                    Unit: i.UOM,
                    BaseUnitQuantity: i.inpBaseUnitQty,
                    GSTPercentage: i.GSTPercentage,
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    Amount: i.totalAmount,

                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GST / 2),
                    SGSTPercentage: (i.GST / 2),
                    IGSTPercentage: 0,

                    BatchDate: "2022-11-19",
                    BatchCode: 1,
                    DiscountType: "0",
                    Discount: "0.00",
                    DiscountAmount: "0.00",
                    TaxType: "GST",

                }

                itemArr.push(arr)
            };
        })


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

        const jsonBody = JSON.stringify({
            GRNDate: grnItemData.OrderDate,

            Customer: grnItemData.Customer,
            GRNNumber: 1,
            GrandTotal: orderAmount,
            Party: grnItemData.Supplier,
            CreatedBy: 1,
            UpdatedBy: 1,
            GRNItems: itemArr,
            GRNReferences: [
                {
                    Invoice: null,
                    Order: 1
                }
            ],

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
                                        style={{ width: "100px" }}>GRN Date</Label>
                                    <Col md="7">
                                        {/* <Flatpickr
                                            id="grndate"
                                            name="grndate"
                                            value={podate}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                // minDate: pageMode === "edit" ? podate : "today",
                                                // maxDate: pageMode === "edit" ? podate : "",
                                                // defaultDate: pageMode === "edit" ? "" : "today"
                                            }}
                                            onChange={(e, date) => { setpoDate(date) }}
                                        /> */}
                                        <Input type="text" value={grnItemData.OrderDate} disabled={true} />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="3">
                                <FormGroup className="mb-2 row mt-3 " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        {/* <Select
                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            isDisabled={pageMode === "edit" ? true : false}
                                            options={supplierOptions}
                                            onChange={(e) => { setsupplierSelect(e) }}
                                        /> */}
                                        < Input type="text" value={grnItemData.SupplierName} disabled={true} />
                                    </Col>
                                </FormGroup>
                            </Col >
                            <Col md="3">
                                <FormGroup className="mb-2 row mt-3 " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Challan No</Label>
                                    <Col md="7">
                                        <Input type="text"
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col >


                            {/* <Col md="1" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={GoButton_Handler}>Go</Button>
                            </Col> */}
                        </div>
                    </div>


                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                // defaultSorted={defaultSorted}
                                data={OrderItem}
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
                        (OrderItem.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"GRN"} onClick={saveHandeller}
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
export default GRNAdd

