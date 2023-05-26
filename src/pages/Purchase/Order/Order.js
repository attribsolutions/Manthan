import React, { useEffect, useLayoutEffect, useState } from "react";
import { MetaTags } from "react-meta-tags"
import { useHistory } from "react-router-dom";
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
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { basicAmount, GstAmount, Amount } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button } from "../../../components/Common/CommonButton";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";

import OrderPageTermsTable from "./OrderPageTermsTable";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";

import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import { order_Type } from "../../../components/Common/C-Varialbes";
import { useRef } from "react";
import { CInput, C_DatePicker, onlyNumberRegx } from "../../../CustomValidateForm/index";

import * as _act from "../../../store/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { editPartyItemID } from "../../../store/Administrator/PartyItemsRedux/action";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { pageFieldUseEffect, table_ArrowUseEffect, updateMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { orderApprovalFunc, orderApprovalMessage } from "./orderApproval";


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
    const RoleID = _cfunc.loginRoleID();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const ref1 = useRef('')

    const fileds = {
        id: "",
        Supplier: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [description, setDescription] = useState('')

    const [deliverydate, setdeliverydate] = useState(currentDate_ymd)
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate_ymd);
    const [poToDate, setpoToDate] = useState(currentDate_ymd);
    const [orderdate, setorderdate] = useState(currentDate_ymd);

    const [supplierSelect, setsupplierSelect] = useState('');
    const [partySelect, setPartySelect] = useState('');

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
        supplierAddress,
        pageField,
        PartyList,
        assingItemData = '',
        approvalDetail,
        orderApprovalMsg
    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        orderType: state.CommonAPI_Reducer.orderType,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
        approvalDetail: state.OrderReducer.approvalDetail,
        assingItemData: state.PartyItemsReducer.editData,
        PartyList: state.PartyMasterReducer.partyList
    }));;

    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useLayoutEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.GoButton_For_Order_AddSuccess(null))
        dispatch(_act.commonPageField(page_id))
        dispatch(_act.GetVenderSupplierCustomer(subPageMode, RoleID))
        dispatch(_act.getTermAndCondition())
        dispatch(_act.getOrderType())
        dispatch(getPartyListAPI())
        if (!(subPageMode === url.ORDER_4)) {
            dispatch(_act.getSupplierAddress(_cfunc.loginPartyID()))
        }
    }, []);


    useEffect(() => userAccessUseEffect({ // userAccess useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
        otherloginAccss// for other pages login role access chack
    }), [userAccess]);

    const otherloginAccss = (ind) => {
        if ((ind.id === pageId.PARTYITEM) && !(subPageMode === url.IB_ORDER)) {
            setFindPartyItemAccess(true)
        }
    };


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
                dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :${hasEditVal.OrderAmount}`))
                setorderdate(hasEditVal.OrderDate)

                if (subPageMode === url.ORDER_4) {
                    setsupplierSelect({
                        label: hasEditVal.CustomerName,
                        value: hasEditVal.Customer
                    });
                } else {
                    setsupplierSelect({
                        label: hasEditVal.SupplierName,
                        value: hasEditVal.Supplier
                    });
                }
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
            dispatch(_act.editOrderIdSuccess({ Status: false }))
        } else {
            dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :0`))
        }
    }, []);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(_act.saveOrderActionSuccess({ Status: false }))

            setTermsAndConTable([])
            dispatch(_act.GoButton_For_Order_AddSuccess([]))
            // ??******************************+++++++++++++++++++++++++++++++++++++++++
            // if (subPageMode === url.ORDER_2) { //        SAP OEDER-APROVUAL CODE
            //     let btnId = postMsg.btnId;
            //     _cfunc.btnIsDissablefunc({ btnId, state: true })
            //     let config = { btnId }
            //     config.orderId = postMsg.OrderID;
            //     dispatch(_act.getOrderApprovalDetailAction(config));
            // }
            // ??******************************+++++++++++++++++++++++++++++++++++++++++++++++
            // else {
                const a = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (a) {
                    history.push({
                        pathname: listPath,
                    });
                }
            // }
        }
        else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {
            dispatch(_act.saveOrderActionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg])

    useEffect(() => updateMsgUseEffect({
        updateMsg, modalCss,
        history, dispatch,
        updateSuccss: _act.saveOrderActionSuccess,
        listPath: listPath
    }), [updateMsg])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField])

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [orderItemTable]);

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
            dispatch(_act.GoButton_For_Order_AddSuccess(''))
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

    useEffect(() => {
        orderApprovalFunc({ dispatch, approvalDetail })
    }, [approvalDetail]);

    useEffect(() => {
        orderApprovalMessage({ dispatch, orderApprovalMsg })
    }, [orderApprovalMsg]);

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


    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------

            dataField: "ItemName",
            sort: true,
            sortValue: (cell, row) => row["ItemName"],
            headerFormatter: (value, row, k, f) => {
                return (
                    <div className="d-flex justify-content-between" key={row.id}>
                        <div>
                            Item Name
                        </div>
                        <div className="cursor-pointer" onClick={assignItem_onClick}>
                            <samp style={{ display: (supplierSelect.value > 0) && (findPartyItemAccess) ? "block" : "none" }} className="text-primary fst-italic text-decoration-underline"
                            >
                                Assign-Items</samp>
                        </div>

                    </div>
                )
            },
        },

        {//------------- Stock Quantity column ----------------------------------
            text: "Stock Qty",
            sort: true,
            hidden: !(pageMode === mode.defaultsave) && true,
            dataField: "StockQuantity",
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
            formatter: (value, row, k) => {
                return (
                    <>
                        <CInput
                            key={`Quantity-${k}`}
                            id={`Quantity-${k}`}
                            cpattern={onlyNumberRegx}
                            defaultValue={row.Quantity}
                            autoComplete="off"
                            className=" text-end"
                            onChange={(e) => {
                                row["Quantity"] = e.target.value
                                itemWise_CalculationFunc(row)
                            }}
                        />
                    </>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            formatter: (value, row, key) => {

                if (!row.UnitName) {
                    row["Unit_id"] = 0;
                    row["UnitName"] = 'null';

                    row.UnitDetails.forEach(i => {
                        if ((i.PODefaultUnit) && !(subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                        else if ((i.SODefaultUnit) && (subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                    });
                    // ********************** //if default unit is not selected then auto first indx unit select
                    if ((row["UnitName"] === 'null') && row.UnitDetails.length > 0) {
                        defaultUnit(row.UnitDetails[0])
                    }
                    // **********************                   

                    function defaultUnit(i) {
                        row["Unit_id"] = i.UnitID;
                        row["po_Unit_id"] = i.UnitID;
                        row["UnitName"] = i.UnitName;
                        row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                        row["Rate"] = i.Rate;
                    }

                } else {
                    row["edit_Qty"] = row.Quantity;
                    row["edit_Unit_id"] = row.Unit_id;

                    row.UnitDetails.forEach(i => {
                        if ((row.Unit_id === i.UnitID)) {
                            row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                            row["UnitName"] = i.UnitName;
                        }
                    });

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
                                baseUnitQty: i.BaseUnitQuantity,
                                Rate: i.Rate
                            }))
                        }
                        onChange={e => {
                            row["Unit_id"] = e.value;
                            row["UnitName"] = e.label
                            row["BaseUnitQuantity"] = e.baseUnitQty;
                            if (!(subPageMode === url.ORDER_1)) {
                                row["Rate"] = e.Rate
                                itemWise_CalculationFunc(row)
                                document.getElementById(`Rate-${key}`).innerText = e.Rate
                            }

                        }}
                    >
                    </Select >
                )
            },
            headerStyle: () => {
                return { width: '150px', textAlign: 'center' };
            }
        },

        {//------------- Rate column ----------------------------------
            text: "Rate/Unit",
            dataField: "",
            formatter: (value, row, k) => {
                if (subPageMode === url.ORDER_1) {
                    return (
                        <div key={row.id} className="text-end">
                            <CInput
                                type="text"
                                id={`Rate-${k}`}
                                cpattern={onlyNumberRegx}
                                defaultValue={row.Rate}
                                onChange={(event) => {
                                    row.Rate = event.target.value;
                                    itemWise_CalculationFunc(row);
                                }}
                            />

                        </div>
                    )
                }
                else {
                    return (
                        <div key={row.id} className="text-end">

                            <span id={`Rate-${k}`}>{row.Rate}</span>
                        </div>
                    )
                }

            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },


        {//------------- MRP column ----------------------------------
            text: "MRP",
            dataField: "",
            formatter: (value, row, k) => {

                return (
                    <div key={row.id} className="text-end">
                        <span>{row.MRPValue}</span>
                    </div>
                )
            },
            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            },
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            dataField: "",
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

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },
    ];
    const defaultSorted = [
        {
            dataField: "ItemName", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];



    function itemWise_CalculationFunc(row) {

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
        dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
    };

    const goButtonHandler = async () => {


        if (!supplierSelect > 0) {
            await customAlert({
                Type: 4,
                Message: `Please select ${fieldLabel.Supplier}`
            })
            return;
        }
        let btnId = `go-btn${subPageMode}`
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :0:00`))


        let PO_Body = {
            Party: supplierSelect.value,
            Customer: _cfunc.loginPartyID(),
            RateParty: _cfunc.loginPartyID(),
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
        }
        let SO_body = {
            Party: _cfunc.loginPartyID(), //swap  party and customer for sale oerder
            Customer: supplierSelect.value,//swap  party and customer for sale oerder
            RateParty: supplierSelect.value,
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
        }


        let jsonBody;   //json body decleration 
        if (subPageMode === url.ORDER_4) {
            jsonBody = JSON.stringify({ ...SO_body, });
        }
        else {
            jsonBody = JSON.stringify({ ...PO_Body, });
        }
        let config = { subPageMode, jsonBody, btnId }
        dispatch(_act.GoButton_For_Order_Add(config))
    };

    function orderdateOnchange(e, date) {
        setorderdate(date)
    };

    function supplierOnchange(e) {
        setsupplierSelect(e);
        if (subPageMode === url.ORDER_4) {
            dispatch(_act.getSupplierAddress(e.value))
        }
    };

    function partyOnchange(e) {
        setPartySelect(e)
    };

    function Open_Assign_func() {
        setisOpen_assignLink(false)
        dispatch(_act.editPartyItemIDSuccess({ Status: false }));
        _cfunc.breadcrumbReturnFunc({ dispatch, userAcc: userPageAccessState })
        goButtonHandler()
    };

    async function assignItem_onClick(event) {
        event.stopPropagation();
        const isParty = subPageMode === url.ORDER_1 ? supplierSelect.value : _cfunc.loginPartyID()
        const config = {
            editId: isParty,
            Party: isParty,
            btnmode: mode.assingLink,
            subPageMode,
            btnId: `btn-assingLink-${supplierSelect.value}`
        }

        const isConfirmed = await customAlert({
            Type: 7,
            Message: "Do you confirm your choice?",
        });

        if (isConfirmed) {

            const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), ...{ PartyID: isParty } });

            dispatch(editPartyItemID({ jsonBody, config }))
            dispatch(_act.GoButton_For_Order_AddSuccess([]))
        };
    };

    const saveHandeller = async (event) => {
        event.preventDefault();

        const btnId = event.target.id
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const division = _cfunc.loginPartyID();
            const supplier = supplierSelect.value;

            const validMsg = []
            const itemArr = []
            const isVDC_POvalidMsg = []

            await orderItemTable.forEach(i => {

                if ((i.Quantity > 0) && !(i.Rate > 0)) {
                    validMsg.push({ [i.ItemName]: "This Item Rate Is Require..." });
                }
                else if (pageMode === mode.edit) {

                    var ischange = (!(Number(i.edit_Qty) === Number(i.Quantity)) || !(i.edit_Unit_id === i.Unit_id));

                    if (ischange && (i.edit_Qty === 0)) {
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


            function orderItem({ i, isedit }) {  //isvdc_po logic

                if ((i.Quantity > 0) && (i.Rate > 0) && !(orderTypeSelect.value === 3)) {
                    var isdel = false;
                    isRowValueChanged({ i, isedit, isdel })
                }
                else if ((i.Quantity < 1) && (i.editrowId) && !(orderTypeSelect.value === 3)) {
                    var isdel = true;
                    isRowValueChanged({ i, isedit, isdel })
                }
                else if ((i.Quantity > 0) && (i.Rate > 0)) {

                    if (i.Bom) {
                        if ((itemArr.length === 0)) {
                            const isdel = false;
                            isRowValueChanged({ i, isedit, isdel })

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
                            isRowValueChanged({ i, isedit, isdel })

                        } else {
                            if (isVDC_POvalidMsg.length === 0)
                                isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type of order Only One Item Quantity Accept..." });
                        }
                    } else {
                        isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                };
            }

            function isRowValueChanged({ i, isedit, isdel }) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))
                const arr = {
                    id: i.editrowId,
                    Item: i.Item_id,
                    Quantity: isdel ? 0 : i.Quantity,
                    MRP: i.MRP_id,
                    MRPValue: i.MRPValue,
                    Rate: i.Rate,
                    Unit: i.Unit_id,
                    BaseUnitQuantity: (Number(i.BaseUnitQuantity) * Number(i.Quantity)).toFixed(2),
                    Margin: "",
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    GST: i.GST_id,
                    GSTPercentage: i.GSTPercentage,
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

            const termsAndCondition = await termsAndConTable.map(i => ({
                TermsAndCondition: i.value,
                IsDeleted: i.IsDeleted
            }))

            if (isVDC_POvalidMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: isVDC_POvalidMsg,
                })
                return returnFunc();
            };
            if (validMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: validMsg,
                })

                return returnFunc();
            }
            if (itemArr.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })

                return returnFunc();
            }
            if (orderTypeSelect.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Select PO Type",
                })
                return returnFunc();
            }
            if ((termsAndCondition.length === 0) && !(subPageMode === url.ORDER_2)
                && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
            ) {
                customAlert({
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
                POFromDate: orderTypeSelect.value === 1 ? currentDate_ymd : poFromDate,
                POToDate: orderTypeSelect.value === 1 ? currentDate_ymd : poToDate,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
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
                dispatch(_act.updateOrderIdAction({ jsonBody, updateId: editVal.id, btnId }))

            } else {
                dispatch(_act.saveOrderAction({ jsonBody, subPageMode, btnId }))
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    }


    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">

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

                                            <C_DatePicker
                                                name="orderdate"
                                                value={orderdate}
                                                disabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
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
                                                < Go_Button
                                                    id={`go-btn${subPageMode}`}
                                                    onClick={(e) => goButtonHandler()} />
                                                :
                                                <Change_Button
                                                    id={`change-btn${subPageMode}`}
                                                    onClick={(e) => dispatch(_act.GoButton_For_Order_AddSuccess([]))} />
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
                                                <C_DatePicker
                                                    id="deliverydate"
                                                    name="deliverydate"
                                                    value={deliverydate}
                                                    disabled={pageMode === "edit" ? true : false}
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
                                                    <C_DatePicker
                                                        id="pofromdate"
                                                        name="pofromdate"
                                                        value={poFromDate}
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
                                                    <C_DatePicker
                                                        id="potodate"
                                                        name="potodate"
                                                        value={poToDate}
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



                    <ToolkitProvider
                        keyField={"Item_id"}
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
                                                keyField={"Item_id"}
                                                id="table_Arrow"
                                                ref={ref1}
                                                defaultSorted={defaultSorted}
                                                bordered={false}
                                                striped={false}
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>


                    <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.TermsAndConditions} tableData={orderItemTable} />


                    {
                        ((orderItemTable.length > 0) && (!isOpen_assignLink)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton
                                pageMode={pageMode}
                                userAcc={userPageAccessState}
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

