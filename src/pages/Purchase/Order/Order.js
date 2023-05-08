import {
    Col,
    CustomInput,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import Flatpickr from "react-flatpickr";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import {
    editOrderIdSuccess,
    GoButton_For_Order_Add,
    GoButton_For_Order_AddSuccess,
    saveOrderAaction,
    postOrderSuccess,
    updateOrderIdAction,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getOrderType, getSupplierAddress, GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount, arrowUpDounFunc } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button } from "../../../components/Common/CommonButton";
import { getTermAndCondition } from "../../../store/Administrator/TermsAndConditionsRedux/actions";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { breadcrumbReturnFunc, loginUserID, currentDate, loginPartyID, btnIsDissablefunc, loginRoleID, loginJsonBody } from "../../../components/Common/CommonFunction";
import OrderPageTermsTable from "./OrderPageTermsTable";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog"
import { editPartyItemID, editPartyItemIDSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import { order_Type } from "../../../components/Common/C-Varialbes";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { useRef } from "react";
import $ from 'jquery';

let editVal = {}


function initialState(history) {
    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.ORDER_1) {
        page_Id = pageId.ORDER_1;
        listPath = url.ORDER_LIST_1
    }
    else if (sub_Mode === url.ORDER_2) {
        page_Id = pageId.ORDER_2;
        listPath = url.ORDER_LIST_2
    }
    else if (sub_Mode === url.IB_ORDER) {
        page_Id = pageId.IB_ORDER;
        listPath = url.IB_ORDER_PO_LIST;
    }
    else if (sub_Mode === url.ORDER_4) {
        page_Id = pageId.ORDER_4;
        listPath = url.ORDER_LIST_4
    }
    return { page_Id, listPath }
};


const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const RoleID = loginRoleID();
    const ref1 = useRef('')

    const fileds = {
        id: "",
        Supplier: "",

    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [page_id, setPage_id] = useState(() => initialState(history).page_Id)
    const [listPath, setListPath] = useState(() => initialState(history).listPath)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname)
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userAccState, setUserAccState] = useState("");
    const [description, setDescription] = useState('')

    const [deliverydate, setdeliverydate] = useState(currentDate)
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate);
    const [poToDate, setpoToDate] = useState(currentDate);
    const [orderdate, setorderdate] = useState(currentDate);
    const [supplierSelect, setsupplierSelect] = useState('');
    const [partySelect, setPartySelect] = useState('');

    const [orderAmount, setOrderAmount] = useState(0);
    const [termsAndConTable, setTermsAndConTable] = useState([]);
    const [orderTypeSelect, setorderTypeSelect] = useState('');
    const [isOpen_assignLink, setisOpen_assignLink] = useState(false)
    const [orderItemTable, setorderItemTable] = useState([])
    const [findPartyItemAccess, setFindPartyItemAccess] = useState(false)
    const [card, setCard] = useState(false)

    const {
        goBtnOrderdata,
        postMsg,
        vendorSupplierCustomer,
        userAccess,
        orderType,
        updateMsg,
        supplierAddress,
        pageField,
        PartyList,
        assingItemData = ''
    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        orderType: state.CommonAPI_Reducer.orderType,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        assingItemData: state.PartyItemsReducer.editData,
        PartyList: state.PartyMasterReducer.partyList
    }));;

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id))
        dispatch(GoButton_For_Order_AddSuccess(null))
        dispatch(GetVenderSupplierCustomer(subPageMode, RoleID))
        dispatch(getTermAndCondition())
        dispatch(getOrderType())
        dispatch(getPartyListAPI())
        if (!(subPageMode === url.ORDER_4)) {
            dispatch(getSupplierAddress(loginPartyID()))
        }
    }, []);


    useEffect(() => {  // userAccess useEffect
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        });

        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });

            let FindPartyItemAccess = userAccess.find((index) => {
                return (index.id === pageId.PARTYITEM)
            });
            if ((FindPartyItemAccess) && !(subPageMode === url.IB_ORDER)) {
                setFindPartyItemAccess(true)
            };
        };
    }, [userAccess]);

    useEffect(() => { // hasEditVal useEffect

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
                });
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                setDescription(hasEditVal.Description)
                editVal = {}
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)
                setorderTypeSelect({ value: hasEditVal.POType, label: hasEditVal.POTypeName })

                setpoToDate(hasEditVal.POToDate)
                setpoFromDate(hasEditVal.POFromDate)

                const { TermsAndConditions = [] } = hasEditVal;
                const termsAndCondition = TermsAndConditions.map(i => ({
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
        }
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if (assingItemData.Status === true) {
            setisOpen_assignLink(true);
        }
    }, [assingItemData]);

    useEffect(() => {
        if (goBtnOrderdata) {
            let { OrderItems = [], TermsAndConditions = [] } = goBtnOrderdata
            setorderItemTable(OrderItems)

            setTermsAndConTable(TermsAndConditions)
            dispatch(GoButton_For_Order_AddSuccess(''))
        }
    }, [goBtnOrderdata]);

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress]);

    useEffect(() => {
        if ((orderType.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setorderTypeSelect({
                value: orderType[0].id,
                label: orderType[0].Name,
            });
        }
    }, [orderType]);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postOrderSuccess({ Status: false }))
            setTermsAndConTable([])
            dispatch(GoButton_For_Order_AddSuccess([]))

            const a = await CustomAlert({
                Type: 1,
                Message: postMsg.Message,
                RedirectPath: listPath,
            })
            if (a) {
                history.push({
                    pathname: listPath,
                });
            }

        } else if (postMsg.Status === true) {
            dispatch(postOrderSuccess({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: listPath,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateOrderIdSuccess({ Status: false }));
            CustomAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    const supplierOptions = vendorSupplierCustomer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const orderTypeOptions = orderType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const Party_DropdownOptions = PartyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    useEffect(arrowUpDounFunc("#tableArrow"), [orderItemTable])

    function arrowChange(e, ca, v) {
        debugger
        const a = ((e.keyCode > 36) && (e.keyCode < 40));
        const b = e.keyCode === 46;
        const c = e.keyCode === 110;

        if (!/[0-9]/.test(e.key) && a && b && c) {
            e.preventDefault();
            return
        }
        const aa = ref1
        const nodeList = document.querySelectorAll("Quantity");
        const htmlCollection = document.getElementsByTagName("input")
        var arr = Array.from(htmlCollection).filter(i => (e.target.name === i.name))

        let text = "";
        let eId = e.target.id
        let hasnext = false
        for (let x of arr) {
            debugger
            if (hasnext) {
                x.focus();
                hasnext = false
            }
            if (x.id === eId) { hasnext = true }
            else { hasnext = false }


            text = x;
        }
        debugger
    }
    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------

            dataField: "ItemName",
            headerFormatter: (value, row, k) => {
                return (
                    <div className="d-flex justify-content-between" key={row.id}>
                        <div>
                            Item Name
                        </div>

                        <div>
                            <samp style={{ display: (supplierSelect.value > 0) && (findPartyItemAccess) ? "block" : "none" }} className="text-primary fst-italic text-decoration-underline"
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
                    <div key={row.id} className="text-end">
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
                    // <span >
                    <Input type="text"
                        id={`Quantit__${k}`}
                        name="Quantity"
                        htmlFor={"Quantity"}
                        defaultValue={row.Quantity}
                        key={`Quantity${row.id}`}
                        className="text-end move"
                        // onChange={(e) => {
                        //     const val = e.target.value
                        //     let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                        //     if ((isnum) || (val === '')) {
                        //         val_onChange(val, row, "qty")
                        //     } else {
                        //         document.getElementById(`Quantity${k}`).value = row.Quantity
                        //     }
                        //     handleKeyDown(e, orderItemTable)
                        // }}
                        autoComplete="off"
                        onKeyDown={(e, v, c) => {
                            // arrowChange(e, v, c)
                            // handleKeyDown(e, orderItemTable)
                        }}
                    />
                    // </span>
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
                        key={`ddlUnit${row.id}`}
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
                            key={`Ratey${row.id}`}
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


        {//------------- MRP column ----------------------------------
            text: "MRP",
            dataField: "MRPValue",
            // sort: true,
            formatter: (value, row, k) => {

                return (
                    <div key={row.id} className="text-end">
                        <span>{row.MRPValue}</span>
                    </div>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
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
                            key={`Comment${row.id}`}

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
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
    };

    const goButtonHandler = async () => {

        if (!supplierSelect > 0) {
            await CustomAlert({
                Type: 4,
                Message: `Please select ${fieldLabel.Supplier}`
            })
            return;
        }
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :0:00`))

        if (subPageMode === url.ORDER_4) {
            dispatch(getSupplierAddress(supplierSelect.value))
        }
        const jsonBody = JSON.stringify({
            Party: supplierSelect.value,
            Customer: loginPartyID(),
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
            RateParty: supplierSelect.value
        })
        dispatch(GoButton_For_Order_Add(subPageMode, jsonBody))
    };

    function orderdateOnchange(e, date) {
        setorderdate(date)
    };

    function supplierOnchange(e) {
        setsupplierSelect(e)
    };

    function partyOnchange(e) {
        setCard(true)
        setPartySelect(e)
    };

    function Open_Assign_func() {
        setisOpen_assignLink(false)
        dispatch(editPartyItemIDSuccess({ Status: false }));
        breadcrumbReturnFunc({ dispatch, userAcc: userAccState })
        goButtonHandler()
    };

    async function assignItem_onClick() {

        const isParty = subPageMode === url.ORDER_1 ? supplierSelect.value : loginPartyID()
        const config = {
            editId: isParty,
            Party: isParty,
            btnmode: mode.assingLink,
            subPageMode,
            btnId: `btn-assingLink-${supplierSelect.value}`
        }

        const isConfirmed = await CustomAlert({
            Type: 7,
            Message: "Do you confirm your choice?",
        });

        if (isConfirmed) {

            const jsonBody = JSON.stringify({ ...loginJsonBody(), ...{ PartyID: isParty } });

            dispatch(editPartyItemID({ jsonBody, config }))
            dispatch(GoButton_For_Order_AddSuccess([]))
        };
    };

    const saveHandeller = async (event) => {
        event.preventDefault();

        const btnId = event.target.id
        btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const division = loginPartyID();
            const supplier = supplierSelect.value;

            const validMsg = []
            const itemArr = []
            const isVDC_POvalidMsg = []

            function isChanged({ i, isedit, isdel }) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))
                const arr = {
                    id: i.editrowId,
                    Item: i.Item_id,
                    Quantity: isdel ? 0 : i.Quantity,
                    MRP: i.MRP_id,
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

            function orderItem({ i, isedit }) {  //isvdc_po logic

                if ((i.Quantity > 0) && (i.Rate > 0) && !(orderTypeSelect.value === 3)) {
                    var isdel = false;
                    isChanged({ i, isedit, isdel })
                }
                else if ((i.Quantity < 1) && (i.editrowId) && !(orderTypeSelect.value === 3)) {
                    var isdel = true;
                    isChanged({ i, isedit, isdel })
                }
                else if ((i.Quantity > 0) && (i.Rate > 0)) {

                    if (i.Bom) {
                        if ((itemArr.length === 0)) {
                            const isdel = false;
                            isChanged({ i, isedit, isdel })

                        } else {
                            if (isVDC_POvalidMsg.length === 0)
                                isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type Of Order Only One Item Quantity Accept..." });
                        }
                    } else {
                        isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                }
                else if ((i.Quantity < 1) && (i.editrowId)) {
                    if (i.Bom) {
                        if ((itemArr.length === 0)) {
                            const isdel = true;
                            isChanged({ i, isedit, isdel })

                        } else {
                            if (isVDC_POvalidMsg.length === 0)
                                isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type of order Only One Item Quantity Accept..." });
                        }
                    } else {
                        isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                };
            }

            await orderItemTable.forEach(i => {

                if ((i.Quantity > 0) && !(i.Rate > 0)) {
                    // validMsg.push(`${i.ItemName}:  This Item Rate Is Require...`);
                    validMsg.push({ [i.ItemName]: "This Item Rate Is Require..." });

                }
                //  else if (!(i.Quantity > 0) && (i.Rate > 0)) {
                //     validMsg.push(`${i.ItemName}:  This Item Quantity Is Require...`);
                // }

                else if (pageMode === mode.edit) {
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
                    const isedit = 0;
                    orderItem({ i, isedit })
                };
            })
            const termsAndCondition = await termsAndConTable.map(i => ({
                TermsAndCondition: i.value,
                IsDeleted: i.IsDeleted
            }))

            if (isVDC_POvalidMsg.length > 0) {
                CustomAlert({
                    Type: 4,
                    Message: isVDC_POvalidMsg,
                })
                return returnFunc();
            };
            if (validMsg.length > 0) {
                CustomAlert({
                    Type: 4,
                    Message: validMsg,
                })

                return returnFunc();
            }
            if (itemArr.length === 0) {
                CustomAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })

                return returnFunc();
            }
            if (orderTypeSelect.length === 0) {
                CustomAlert({
                    Type: 4,
                    Message: "Please Select PO Type",
                })
                return returnFunc();
            }
            if ((termsAndCondition.length === 0) && !(subPageMode === url.ORDER_2)
                && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
            ) {
                CustomAlert({
                    Type: 4,
                    Message: "Please Enter One Terms And Condition",
                })
                return returnFunc();
            }

            const po_JsonBody = {
                OrderDate: orderdate,
                OrderAmount: orderAmount,
                OrderItem: itemArr,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
            }
            const SO_JsonBody = {
                OrderDate: orderdate,
                OrderAmount: orderAmount,
                OrderItem: itemArr,
                Customer: supplier,// swipe supllier 
                Supplier: division,// swipe Customer
                OrderType: order_Type.SaleOrder,
            }
            const IB_JsonBody = {
                DemandDate: orderdate,
                DemandAmount: orderAmount,
                DemandItem: itemArr,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
            }
            const comm_jsonBody = {
                DeliveryDate: deliverydate,
                Description: description,
                BillingAddress: billAddr.value,
                ShippingAddress: shippAddr.value,
                OrderNo: 1,
                FullOrderNumber: "PO0001",
                Division: division,
                POType: orderTypeSelect.value,
                POFromDate: orderTypeSelect.value === 1 ? currentDate : poFromDate,
                POToDate: orderTypeSelect.value === 1 ? currentDate : poToDate,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                OrderTermsAndConditions: termsAndCondition
            };


            let jsonBody;   //json body decleration 
            if (subPageMode === url.IB_ORDER) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_JsonBody });
            }
            else if (subPageMode === url.ORDER_4) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...SO_JsonBody });
            }
            else {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...po_JsonBody });
            }
            // +*********************************

            if (pageMode === mode.edit) {
                dispatch(updateOrderIdAction({ jsonBody, updateId: editVal.id, btnId }))

            } else {
                dispatch(saveOrderAaction({ jsonBody, subPageMode, btnId }))
            }

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content">

                    {/* <table id="people">
                        <thead>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Location</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                            </tr>
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                            </tr>
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                            </tr>
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                            </tr>
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                            </tr>
                        </tbody>
                    </table> */}
                    {RoleID === 2 ?
                        <div className="px-2 mb-1 mt-n1 c_card_filter header text-black" >
                            <div className=" mt-1 mb-2 row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-3 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "115px" }}>Party</Label>
                                        <Col sm="6">
                                            <Select
                                                value={partySelect}
                                                classNamePrefix="select2-Customer"
                                                isDisabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                                options={Party_DropdownOptions}
                                                onChange={partyOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                            </div>
                        </div>
                        : null}


                    <div>
                        <div className="px-2 mb-1 mt-n1 c_card_filter header text-black" >{/* Order Date And Supplier Name,Go_Button*/}
                            <div className=" mt-1 row ">                                  {/* Order Date And Supplier Name,Go_Button*/}
                                <Col sm="6">                                              {/* Order Date*/}
                                    <FormGroup className=" row mt-3 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "115px" }}>Order Date</Label>
                                        <Col sm="6">
                                            <Flatpickr
                                                style={{ userselect: "all" }}
                                                id="orderdate"
                                                name="orderdate"
                                                value={orderdate}
                                                disabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    // altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={orderdateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>


                                <Col sm="6">                                              {/*Supplier Name And Go_Button*/}                                <FormGroup className="mb-1 row mt-3 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Supplier}</Label>
                                    <Col sm="6">
                                        <Select
                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            isDisabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                            options={supplierOptions}
                                            onChange={supplierOnchange}
                                        />
                                    </Col>
                                    <Col sm="1" className="mx-4 ">                      {/*Go_Button  */}
                                        {pageMode === mode.defaultsave ?
                                            (orderItemTable.length === 0) ?
                                                < Go_Button onClick={(e) => goButtonHandler()} />
                                                :
                                                <Change_Button onClick={(e) => dispatch(GoButton_For_Order_AddSuccess([]))} />
                                            : null
                                        }
                                    </Col>
                                </FormGroup>
                                </Col >

                            </div>
                        </div>

                        <div className="px-2  mb-1 c_card_body text-black" >              {/*  Description and Delivery Date  field */}
                            <div className="row">                                         {/*  Description and Delivery Date  field */}
                                <div className="col col-6">                               {/*  Description field */}
                                    <FormGroup className=" row  mt-3" >
                                        <Label className="   p-2"
                                            style={{ width: "115px" }}>Description</Label>
                                        <div className="col-6">
                                            <Input type="text"
                                                value={description}
                                                placeholder='Enter Order Description'
                                                onChange={e => setDescription(e.target.value)}
                                            />

                                        </div>

                                    </FormGroup>
                                </div >

                                {!(subPageMode === url.IB_ORDER) ?
                                    <div className="col col-6" >                            {/*  Delivery Date field */}
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
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(e, date) => { setdeliverydate(date) }}
                                                />
                                            </div>

                                        </FormGroup>
                                    </div > : null}

                            </div>

                            {subPageMode === url.ORDER_1 ? <div>                             {/*  Billing Address   and Shipping Address*/}
                                <div className="row  ">

                                    <div className="col col-6">                             {/* Billing Address */}
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
                                                        })
                                                    }}
                                                    onChange={(e) => { setbillAddr(e) }}
                                                />
                                            </div>
                                        </FormGroup>
                                    </div >

                                    <div className="col col-6">                               {/*  Billing Shipping Address */}
                                        <FormGroup className=" row " >
                                            <Label className=" p-2"
                                                style={{ width: "130px" }}>Shipping Address</Label>
                                            <div className="col col-6">
                                                <Select
                                                    value={shippAddr}
                                                    classNamePrefix="select2-Customer"
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'non',
                                                        })
                                                    }}
                                                    options={supplierAddress}
                                                    onChange={(e) => { setshippAddr(e) }}
                                                />
                                            </div>
                                        </FormGroup>
                                    </div >
                                </div>

                                <div className="row" >                                        {/**PO Type  (PO From Date and PO To Date)*/}
                                    <div className="col col-6" >                              {/**PO Type */}
                                        <FormGroup className=" row  " >
                                            <Label className=" p-2"
                                                style={{ width: "115px" }}>PO Type</Label>
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


                                {(orderTypeSelect.label === 'Open PO') ?
                                    <div className="row" >                                    {/*PO From Date */}
                                        <div className="col col-6" >
                                            <FormGroup className=" row " >
                                                <Label className=" p-2"
                                                    style={{ width: "115px" }}>PO From Date</Label>
                                                <div className="col col-6 ">
                                                    <Flatpickr
                                                        id="pofromdate"
                                                        name="pofromdate"
                                                        value={poFromDate}
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

                                        <div className="col col-6" >                        {/*PO To Date */}
                                            <FormGroup className=" row  " >
                                                <Label className=" p-2"
                                                    style={{ width: "130px" }}>PO To Date</Label>
                                                <div className="col col-6 ">
                                                    <Flatpickr
                                                        id="potodate"
                                                        name="potodate"
                                                        value={poToDate}
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
                                    </div> : null}
                            </div>
                                : null}

                        </div>
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
                                                        id="tableArrow"
                                                        responsive
                                                        ref={ref1}
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


                    <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.TermsAndConditions} tableData={orderItemTable} />


                    {
                        ((orderItemTable.length > 0) && (!isOpen_assignLink)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton
                                pageMode={pageMode}
                                userAcc={userAccState}
                                onClick={saveHandeller}
                            />
                        </div>
                            : <div className="row save1"></div>
                    }
                </div >

                <Modal
                    isOpen={isOpen_assignLink}
                    toggle={() => {
                        setisOpen_assignLink(false)
                    }}
                    size="xl"
                >

                    <PartyItems
                        editValue={assingItemData.Data}
                        isAssing={true}
                        masterPath={url.PARTYITEM}
                        redirectPath={subPageMode}
                        isOpenModal={Open_Assign_func}
                        pageMode={mode.assingLink}
                    />

                </Modal>

            </React.Fragment >
        )
    } else {
        return null
    }

}


export default Order

