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
    postOrder,
    postOrderSuccess,
    updateOrderId,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getOrderType, getSupplierAddress, GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { getTermAndCondition } from "../../../store/Administrator/TermsAndConditionsRedux/actions";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { breadcrumbReturn, createdBy, currentDate, saveDissable, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import OrderPageTermsTable from "./OrderPageTermsTable";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog"
import * as pageId from "../../../routes/allPageID"
import { editPartyItemID, editPartyItemIDSuccess } from "../../../store/Administrator/PartyItemsRedux/action";

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
    else if (sub_Mode === url.ORDER_3) {
        page_Id = pageId.ORDER_3;
        listPath = url.ORDER_LIST_3;
    };
    return { page_Id, listPath }
};


const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

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
    const [userAccState, setUserPageAccessState] = useState("");
    const [description, setDescription] = useState('')

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
    const [isOpen_assignLink, setisOpen_assignLink] = useState(false)
    const [orderItemTable, setorderItemTable] = useState([])
    const [findPartyItemAccess, setFindPartyItemAccess] = useState(false)

    const {
        goBtnOrderdata,
        postMsg,
        vendorSupplierCustomer,
        userAccess,
        orderType,
        updateMsg,
        supplierAddress = [],
        pageField,
        assingItemData = ''
    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        vendorSupplierCustomer: state.SupplierReducer.vendorSupplierCustomer,
        supplierAddress: state.SupplierReducer.supplierAddress,
        orderType: state.SupplierReducer.orderType,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        assingItemData: state.PartyItemsReducer.editData
    }));;

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id))
        dispatch(GoButton_For_Order_AddSuccess(null))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        dispatch(getSupplierAddress())
        dispatch(getTermAndCondition())
        dispatch(getOrderType())
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        });

        if (userAcc) {
            setUserPageAccessState(userAcc);
            breadcrumbReturn({ dispatch, userAcc });
            let FindPartyItemAccess = userAccess.find((index) => {
                return (index.id === pageId.PARTYITEM)
            });
            if ((FindPartyItemAccess) && !(subPageMode === url.ORDER_3)) {
                setFindPartyItemAccess(true)
            };
        };
    }, [userAccess]);

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
        if (assingItemData.Status === true) {
            setisOpen_assignLink(true);
        }
    }, [assingItemData]);

    useEffect(() => {
        if (goBtnOrderdata) {
            let { OrderItems = [], TermsAndConditions = [] } = goBtnOrderdata
            setorderItemTable(OrderItems)
            debugger
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
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
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
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
            dispatch(postOrderSuccess({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++Update Button Is enable function
            history.push({
                pathname: listPath,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++Update Button Is enable function
            dispatch(updateOrderIdSuccess({ Status: false }));
            CustomAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
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
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
    };

    const supplierOptions = vendorSupplierCustomer.map((i) => ({
        value: i.id,
        label: i.Name,
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
                    <span >
                        <Input type="text"
                            id={`Quantity${k}`}
                            defaultValue={row.Quantity}
                            key={`Quantity${row.id}`}
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

    function Open_Assign_func() {
        setisOpen_assignLink(false)
        dispatch(editPartyItemIDSuccess({ Status: false }));
        goButtonHandler()
    }

    const goButtonHandler = async () => {

        if (!supplierSelect > 0) {
            await CustomAlert({
                Type: 4,
                Message: `Please select ${fieldLabel.Supplier}`
            })
            return;
        }
        dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :0:00`))

        const jsonBody = JSON.stringify({
            Party: supplierSelect.value,
            Customer: userParty(),
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id
        })
        dispatch(GoButton_For_Order_Add(subPageMode, jsonBody))
    };

    function orderdateOnchange(e, date) {
        setorderdate(date)
    };

    function supplierOnchange(e) {
        setsupplierSelect(e)
    };

    async function assignItem_onClick() {
        var msg = "Do you confirm your choice?"
        const isConfirmed = await CustomAlert({
            Type: 7,
            Message: msg,
            RedirectPath: url.ORDER_LIST_1,
        });
        if (isConfirmed) {
            dispatch(GoButton_For_Order_AddSuccess([]))
            dispatch(editPartyItemID(supplierSelect.value, mode.assingLink));
        };
    };

    const saveHandeller = async () => {
        const division = userParty();
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

        function orderItem({ i, isedit }) {  //isvdc_po logic
            debugger
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
        debugger
        if (isVDC_POvalidMsg.length > 0) {
            await CustomAlert({
                Type: 4,
                Message: isVDC_POvalidMsg,
            })
            return
        };
        if (validMsg.length > 0) {
            // dispatch(AlertState({
            //     Type: 4,
            //     Status: true,
            //     Message: validMsg,
            //     RedirectPath: false,
            //     AfterResponseAction: false
            // }));
            await CustomAlert({
                Type: 4,
                Message: validMsg,
            })
            return
        }
        if (itemArr.length === 0) {
            // dispatch(AlertState({
            //     Type: 4,
            //     Status: true,
            //     Message: "Please Enter One Item Quantity",
            //     RedirectPath: false,
            //     AfterResponseAction: false
            // }));
            await CustomAlert({
                Type: 4,
                Message: "Please Enter One Item Quantity",
            })

            return
        }
        if (orderTypeSelect.length === 0) {
            await CustomAlert({
                Type: 4,
                Message: "Please Select PO Type",
            })
            // dispatch(AlertState({
            //     Type: 4,
            //     Status: true,
            //     Message: "Please Select PO Type",
            //     RedirectPath: false,
            //     AfterResponseAction: false
            // }));
            return
        }
        if ((termsAndCondition.length === 0) && !(subPageMode === url.ORDER_3)) {
            await CustomAlert({
                Type: 4,
                Message: "Please Enter One Terms And Condition",
            })
            // dispatch(AlertState({
            //     Type: 4,
            //     Status: true,
            //     Message: "Please Enter One Terms And Condition",
            //     RedirectPath: false,
            //     AfterResponseAction: false
            // }));

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
            OrderTermsAndConditions: termsAndCondition
        });

        saveDissable({ id: userAccState.ActualPagePath, state: true });//+++++++++save Button Is dissable function

        if (pageMode === mode.edit) {
            dispatch(updateOrderId(jsonBody, editVal.id))

        } else {

            dispatch(postOrder(jsonBody))
        }

    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content">

                    <div className="px-2 mb-1 mt-n1 c_card_filter header text-black" >{/* Order Date And Supplier Name,Go_Button*/}
                        <div className=" mt-1 row ">                                  {/* Order Date And Supplier Name,Go_Button*/}
                            <Col sm="6">{/* Order Date*/}
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


                            <Col sm="6">{/*Supplier Name */}
                                <FormGroup className="mb-1 row mt-3 " >
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
                                    <Col sm="1" className="mx-4 ">{/*Go_Button  */}
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

                            {!(subPageMode === url.ORDER_3) ?
                                <div className="col col-6" >{/*  Delivery Date field */}
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
                                                    // minDate: pageMode === "edit" ? orderdate : "today",

                                                }}
                                                onChange={(e, date) => { setdeliverydate(date) }}
                                            />
                                        </div>

                                    </FormGroup>
                                </div > : null}

                        </div>

                        {subPageMode === url.ORDER_1 ? <div>
                            <div className="row  ">                                       {/*  Billing Address   and Shipping Address*/}

                                <div className="col col-6">{/* Billing Address */}
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

                                <div className="col col-6">{/*  Billing Shipping Address */}
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


                    <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.TermsAndConditions} tableData={orderItemTable} />


                    {
                        ((orderItemTable.length > 0) && (!isOpen_assignLink)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"Order"} onClick={saveHandeller}
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
                        masterPath={url.PARTYITEM}
                        redirectPath={(subPageMode === url.ORDER_1) ? url.ORDER_1 : url.ORDER_2}
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

