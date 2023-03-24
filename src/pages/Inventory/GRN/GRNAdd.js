import {
    Button,
    Col,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Label,
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
import { getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { AlertState, BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "../../Purchase/Order/OrderPageCalulation";
import { SaveButton } from "../../../components/Common/CommonButton";
import { editGRNIdSuccess, getGRN_itemMode2_Success, saveGRNAction, saveGRNSuccess } from "../../../store/Inventory/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { breadcrumbReturnFunc, loginUserID, currentDate, btnIsDissablefunc } from "../../../components/Common/CommonFunction";
import FeatherIcon from "feather-icons-react";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import * as pageId from "../../../routes/allPageID"

let initialTableData = []

function initialState(history) {

    let page_Id = '';
    let subPageMode = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.GRN_ADD) {
        page_Id = pageId.GRN_ADD;
        subPageMode = url.GRN_ADD
    }
    else if (sub_Mode === url.GRN_ADD_3) {
        page_Id = pageId.GRN_ADD_3;
        subPageMode = url.GRN_ADD_3
    }
    return { page_Id, subPageMode }
};

const GRNAdd = (props) => {

    // const Data = [
    //     {
    //         Item: 4,
    //         ItemName: "Peda",
    //         Quantity: "1.000",
    //         MRP: null,
    //         MRPValue: null,
    //         Rate: "10.00",
    //         TaxType: "GST",
    //         Unit: 24,
    //         UnitName: "Kg",
    //         BaseUnitQuantity: "8995.000",
    //         GST: 4,
    //         GSTPercentage: "5.00",
    //         MarginValue: null,
    //         BasicAmount: "10.00",
    //         GSTAmount: "0.50",
    //         CGST: "0.25",
    //         SGST: "0.25",
    //         IGST: "0.00",
    //         CGSTPercentage: "2.50",
    //         SGSTPercentage: "2.50",
    //         IGSTPercentage: "0.00",
    //         Amount: "10.50",
    //         BatchCode: "0",
    //         BatchDate: "2023-03-15",
    //         UnitDetails: [
    //             {
    //                 Unit: 24,
    //                 UnitName: "Kg"
    //             }
    //         ]
    //     },
    //     {
    //         Item: 4,
    //         ItemName: "Peda",
    //         Quantity: "1.000",
    //         MRP: null,
    //         MRPValue: null,
    //         Rate: "10.00",
    //         TaxType: "GST",
    //         Unit: 24,
    //         UnitName: "Kg",
    //         BaseUnitQuantity: "8995.000",
    //         GST: 4,
    //         GSTPercentage: "5.00",
    //         MarginValue: null,
    //         BasicAmount: "10.00",
    //         GSTAmount: "0.50",
    //         CGST: "0.25",
    //         SGST: "0.25",
    //         IGST: "0.00",
    //         CGSTPercentage: "2.50",
    //         SGSTPercentage: "2.50",
    //         IGSTPercentage: "0.00",
    //         Amount: "10.50",
    //         BatchCode: "0",
    //         BatchDate: "2023-03-15",
    //         UnitDetails: [
    //             {
    //                 Unit: 24,
    //                 UnitName: "Kg"
    //             }
    //         ]
    //     },
    //     {
    //         Item: 4,
    //         ItemName: "Peda",
    //         Quantity: "1.000",
    //         MRP: null,
    //         MRPValue: null,
    //         Rate: "10.00",
    //         TaxType: "GST",
    //         Unit: 24,
    //         UnitName: "Kg",
    //         BaseUnitQuantity: "8995.000",
    //         GST: 4,
    //         GSTPercentage: "5.00",
    //         MarginValue: null,
    //         BasicAmount: "10.00",
    //         GSTAmount: "0.50",
    //         CGST: "0.25",
    //         SGST: "0.25",
    //         IGST: "0.00",
    //         CGSTPercentage: "2.50",
    //         SGSTPercentage: "2.50",
    //         IGSTPercentage: "0.00",
    //         Amount: "10.50",
    //         BatchCode: "0",
    //         BatchDate: "2023-03-15",
    //         UnitDetails: [
    //             {
    //                 Unit: 24,
    //                 UnitName: "Kg"
    //             }
    //         ]
    //     },
    //     {
    //         Item: 5,
    //         ItemName: "Dahi",
    //         Quantity: "1.000",
    //         MRP: null,
    //         MRPValue: null,
    //         Rate: "10.00",
    //         TaxType: "GST",
    //         Unit: 23,
    //         UnitName: "Kg",
    //         BaseUnitQuantity: "8984.000",
    //         GST: 6,
    //         GSTPercentage: "5.00",
    //         MarginValue: null,
    //         BasicAmount: "10.00",
    //         GSTAmount: "0.50",
    //         CGST: "0.25",
    //         SGST: "0.25",
    //         IGST: "0.00",
    //         CGSTPercentage: "2.50",
    //         SGSTPercentage: "2.50",
    //         IGSTPercentage: "0.00",
    //         Amount: "10.50",
    //         BatchCode: "0",
    //         BatchDate: "2023-03-15",
    //         UnitDetails: [
    //             {
    //                 Unit: 23,
    //                 UnitName: "Kg"
    //             }
    //         ]
    //     }]

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userAccState, setUserAccState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const [page_id, setPage_id] = useState(() => initialState(history).page_Id)
    const [subPageMode, setSubPageMode] = useState(() => initialState(history).subPageMode)
    const [grnDate, setgrnDate] = useState(currentDate);
    const [orderAmount, setOrderAmount] = useState(0);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    const [openPOdrp, setopenPOdrp] = useState(false);
    const [openPOdata, setopenPOdata] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [modalCss, setModalCss] = useState(false);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [EditData, setEditData] = useState({});

    const {
        items,
        postMsg,
        userAccess,
    } = useSelector((state) => ({
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id))
        dispatch(getSupplierAddress())
    }, [])

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if ((items.Status === true) && (items.StatusCode === 200)) {
            const grnItems = items.Data

            grnItems.OrderItem.forEach((ele, k) => {
                ele.id = k + 1;
                ele["poQuantity"] = ele.Quantity
                ele["Quantity"] = ''
                ele["poAmount"] = ele.Amount
                ele["Amount"] = 0
                ele["BatchDate"] = currentDate
                ele["BatchCode"] = '0'
                ele["delbtn"] = false

            });
            initialTableData = []
            const grnDetails = { ...grnItems }

            initialTableData = grnDetails.OrderItem;
            setgrnItemList(initialTableData)
            grnDetails.OrderItem = []

            setGrnDetail(grnDetails)

            const myArr = grnDetails.challanNo.split(",");
            myArr.map(i => ({ Name: i, hascheck: false }))
            setopenPOdata(grnDetails.GRNReferences)
            items.Status = false
            dispatch(getGRN_itemMode2_Success(items))

            dispatch(BreadcrumbShowCountlabel(`${"GRN Amount"} :${grnItems.OrderAmount}`))
        }

    }, [items])

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

                setEditData(hasEditVal);

                const { GRNItems = [], GRNReferences = [] } = hasEditVal;
                let ChallanNo1 = ''

                GRNReferences.forEach(ele => {
                    ChallanNo1 = ChallanNo1.concat(`${ele.ChallanNo},`)
                });
                ChallanNo1 = ChallanNo1.replace(/,*$/, '');

                setGrnDetail(ChallanNo1);
                setgrnItemList(GRNItems)
                dispatch(editGRNIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveGRNSuccess({ Status: false }))
            const promise = await CustomAlert({
                Type: 1,
                Message: postMsg.Message,
            })
            if (promise) {
                history.push({ pathname: subPageMode })
            }

        } else if (postMsg.Status === true) {
            dispatch(saveGRNSuccess({ Status: false }))
            CustomAlert({
                Type: 1,
                Message: JSON.stringify(postMsg.Message),
            })

        }
    }, [postMsg])

    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }
        const amount = Amount(row)
        row["Amount"] = amount
        try {
            document.getElementById(`abc${row.id}`).innerText = amount

        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbShowCountlabel(`${"GRN Amount"} :${sum.toFixed(2)}`))
    }

    const pagesListColumns1 = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",

            formatter: (value, row) => {
                return (<div className=" mt-2">
                    <span key={row.id}>{value}</span>
                </div>)
            }
        },

        {//------------- Quntity first column ----------------------------------
            text: "PO-Qty",
            dataField: "poQuantity",
            hidden: pageMode === mode.view ? true : false,
            formatter: (value, row, k) => {
                return (
                    <div className="text-end" >
                        <samp key={row.id} className="font-asian"> {value}</samp>
                    </div>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "end" };
            }
        },

        {//  ------------Quntity column -----------------------------------  
            text: "GRN-Qty",
            dataField: "",

            formatter: (value, row, k) => {
                try {
                    document.getElementById(`Quantity${k}`).value = row.Quantity
                } catch (e) { }
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${row.id}`}
                            defaultValue={row.Quantity}
                            className="text-end"
                            autoComplete="off"
                            key={row.id}
                            disabled={pageMode === mode.view ? true : false}
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`Quantity${row.id}`).value = row.Quantity
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, grnItemList)}
                        />
                    </span>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center' };
            }
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            formatter: (value, row, key) => {

                if (row.UnitDetails === undefined) {
                    row["UnitDetails"] = []
                }
                if (row.UnitName === undefined) {
                    row["Unit"] = row.UnitDetails[0].Unit
                    row["UnitName"] = row.UnitDetails[0].UnitName
                    row["BaseUnitQuantity"] = row.UnitDetails[0].BaseUnitQuantity
                }
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        key={row.id}
                        isDisabled={pageMode === mode.view ? true : false}
                        defaultValue={{ value: row.Unit, label: row.UnitName }}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.Unit,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["Unit"] = e.value;
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

        {  //-------------MRP column ----------------------------------
            text: "MRP",
            dataField: "",
            hidden: (subPageMode === url.GRN_lIST_3) ? false : true,
            formatter: (value, row, k) => {
                return (
                    <span className="text-right" >
                        <Input
                            key={row.id}
                            type="text"
                            className=" text-end"
                            defaultValue={row.MRP}
                            autoComplete="off"
                            disabled={true}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center' };
            }
        },

        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "",
            formatter: (value, row, k) => {
                if (row.Rate === undefined) { row["Rate"] = 0 }
                if (row.Amount === undefined) { row["Amount"] = 0 }
                return (
                    <span className="text-right" >
                        <Input
                            key={row.id}
                            type="text"
                            id={`Ratey${k}`}
                            className=" text-end"
                            defaultValue={row.Rate}
                            autoComplete="off"
                            disabled={(row.GST === '') || (pageMode === mode.view) ? true : false}
                            onChange={e => {
                                row["Rate"] = e.target.value;
                                const qty = document.getElementById(`Quantity${row.id}`)
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
                return { width: '100px', textAlign: 'center' };
            }
        },

        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`abc${row.id}`}>{row.Amount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {

                try {
                    document.getElementById(`Batch${row.id}`).value = row.BatchCode
                } catch (e) { }
                return (
                    <Input type="text"
                        key={row.id}
                        id={`Batch${row.id}`}
                        placeholder="Batch Code..."
                        className="text-end "
                        disabled={(pageMode === mode.view) ? true : false}
                        defaultValue={row.BatchCode}
                        onChange={e => { row["BatchCode"] = e.target.value }}
                        autoComplete="off"
                    />
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "",
            formatter: (value, row, k) => {
                try {
                    document.getElementById(`BatchDate${k}`).value = row.BatchDate
                } catch (e) { }
                return (
                    <Flatpickr
                        className="form-control d-block p-2 bg-white text-dark"
                        placeholder="Batch Date..."
                        id={`BatchDate${k}`}
                        key={row.id}
                        value={row.BatchDate}
                        data-enable-time
                        disabled={(pageMode === mode.view) ? true : false}
                        options={{
                            altInput: true,
                            altFormat: "d-m-Y",
                            dateFormat: "Y-m-d",
                        }}
                        onChange={(e, date) => { row.BatchDate = date }}
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Action column ----------------------------------
            text: "Action",
            dataField: "",
            hidden: ((pageMode === mode.view) || subPageMode === url.GRN_lIST_3) ? true : false,
            formatter: (value, row, k, a, v) => (
                <div className="d-flex justify-Content-center mt-2" >
                    <div> <Button
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                        onClick={(e) => copybtnOnclick(row)}
                        className="badge badge-soft-primary font-size-12 btn btn-primary
                     waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="bx bxs-copy font-size-8 "></i>
                    </Button ></div>

                    <div >
                        {row.delbtn ? <div >
                            <Button
                                // style={pageMode==='edit'? 'Block' :"None"}

                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top"
                                onClick={(e) => deletebtnOnclick(row)}
                                className="badge badge-soft-danger font-size-12 btn btn-danger
                                      waves-effect waves-light w-xxs border border-light"
                            >
                                <i class="mdi mdi-delete font-size-8 "></i>
                            </Button >
                        </div>
                            : null}

                    </div>
                </div>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '30px', textAlign: 'center', text: "center" };
            }
        },
    ];
    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
        },

        {//------------- Quntity  column ----------------------------------
            text: "Invoice-Qty",
            dataField: "poQuantity",
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "UnitName",
        },

        {  //-------------MRP column ----------------------------------
            text: "MRP",
            dataField: "MRP",
        },
        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "Rate",
        },

        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "Amount",
        },

        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "BatchCode",
        },

        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "BatchDate",
        },

    ];

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (grnItemList.length + 2),
        totalSize: 0,
        custom: true,
    };

    const copybtnOnclick = (r) => {
        const id = r.id
        const newArr = []
        let list = [...initialTableData];

        list.forEach(element => {

            if (element.id < id) {
                newArr.push(element)
            }
            else if (element.id === id) {
                newArr.push(element);
                const ele = { ...element }
                ele.id = element.id + 1
                ele.delbtn = true
                ele.Quantity = 0
                newArr.push(ele)
            }
            else {
                const ele1 = { ...element }
                ele1.id = element.id + 1
                newArr.push(ele1)
            }
        });

        initialTableData = newArr
        setgrnItemList(newArr)

    }

    const deletebtnOnclick = (r) => {
        const list = [...initialTableData];
        const newArr = list.filter(i => { return (!(i.id === r.id)) })
        initialTableData = newArr
        setgrnItemList(newArr)
    }

    const saveHandeller = (event) => {
        event.preventDefault();

        const btnId = event.target.id
        btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const itemArr = []
            const isvalidMsg = [];

            grnItemList.forEach(i => {

                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))
                if (subPageMode === url.GRN_ADD_3) {
                    debugger
                     i.Quantity = i.poQuantity }
                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,
                    MRP: i.MRP,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    GST: i.GST,
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    Amount: i.Amount,

                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GSTPercentage / 2),
                    SGSTPercentage: (i.GSTPercentage / 2),
                    IGSTPercentage: 0,
                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,
                    DiscountType: "0",
                    Discount: "0.00",
                    DiscountAmount: "0.00",
                    TaxType: "GST",
                }
                let isfound = itemArr.filter(ind => {
                    return ind.Item === i.Item
                })

                if (isfound.length > 0) {
                    let dubli = isfound.filter(ele => {
                        let condition = ((i.Rate === ele.Rate) && (i.BatchDate === ele.BatchDate) && (i.BatchCode === ele.BatchCode) && (i.Unit === ele.Unit))

                        return condition
                    })

                    if ((i.Quantity > 0)) {
                        if (dubli.length === 0) {
                            itemArr.push(arr)

                        } else {
                            isvalidMsg.push(`${i.ItemName}:  This Item  Is Dublicate...`)
                        }
                    }
                } else if ((i.Quantity > 0)) {
                    itemArr.push(arr)
                }

            })

            if (invoiceNo.length === 0) {
                CustomAlert({
                    Type: 3,
                    Message: "Please Enter Invoice Number",
                })
                return returnFunc()
            }
            if (itemArr.length === 0) {
                CustomAlert({
                    Type: 3,
                    Message: "Please Enter One Item Quantity",
                })
                return returnFunc()
            }
            if (isvalidMsg.length > 0) {
                CustomAlert({
                    Type: 3,
                    Message: isvalidMsg,
                })
                return returnFunc()
            }
            const jsonBody = JSON.stringify({
                GRNDate: grnDate,
                Customer: grnDetail.Customer,
                GRNNumber: 1,
                GrandTotal: orderAmount,
                Party: grnDetail.Supplier,
                InvoiceNumber: invoiceNo,
                CreatedBy: loginUserID(),
                UpdatedBy: 1,
                GRNItems: itemArr,
                GRNReferences: openPOdata

            });

            if (pageMode === mode.edit) {
                returnFunc()
            } else {
                dispatch(saveGRNAction({ jsonBody, btnId }))
            }
        } catch (error) { returnFunc() }
    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" >

                    <div className="px-2 mb-1  c_card_header " >
                        <Row>
                            <Col sm={5}>

                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            disabled={(pageMode === mode.view) ? true : false}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text"
                                            value={pageMode === mode.view ? EditData.CustomerName : grnDetail.SupplierName}
                                            disabled={pageMode === mode.view ? true : false} />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={pageMode === mode.view ? true : false}
                                            value={pageMode === mode.view ? grnDetail : grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice Date</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            disabled={pageMode === mode.view ? true : false}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice No</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            value={EditData.InvoiceNumber}
                                            placeholder="Enter Invoice No"
                                            disabled={pageMode === mode.view ? true : false}
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                        />
                                    </Col>
                                </FormGroup>


                                {subPageMode === url.GRN_ADD_3 ?
                                    <FormGroup className="mb-2 row  " >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "130px" }}>Close PO</Label>
                                        <Col md="7" style={{ marginLeft: "-14px" }}>
                                            {
                                                openPOdata.length === 1 ?
                                                    <Input
                                                        type="checkbox"
                                                        style={{ paddingTop: "7px" }}
                                                        placeholder="Enter Invoice No"
                                                        disabled={pageMode === mode.view ? true : false}
                                                        onChange={(e) => openPOdata[0].Inward = e.target.checked}
                                                    />
                                                    :
                                                    <Dropdown
                                                        className="d-none d-lg-inline-block ms-1"

                                                        isOpen={openPOdrp}
                                                        toggle={() => {
                                                            setopenPOdrp(!openPOdrp)
                                                        }}
                                                    >
                                                        <DropdownToggle
                                                            className="btn header-item noti-icon mt-n2 mb-n3 "
                                                            tag="button"
                                                        >
                                                            <FeatherIcon
                                                                icon="square"
                                                                className="icon-sm text-primary"
                                                            />
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-lg dropdown-menu-custom"  >
                                                            <Row className="row  g-0 " >
                                                                {openPOdata.map((index, key) => {
                                                                    return (
                                                                        <Col className="col col-6 dropdown-icon-item-custom  text-black "
                                                                        >
                                                                            <li onClick={e => {
                                                                                openPOdata[key].Inward = !openPOdata[key].Inward
                                                                                document.getElementById(`hasInwardCheck${key}`).checked = openPOdata[key].Inward;
                                                                            }} >
                                                                                <Row className="row ">
                                                                                    <Col className=" col user-select ">
                                                                                        <li>
                                                                                            <Label className="" >{index.ChallanNo}</Label>
                                                                                        </li>
                                                                                    </Col>

                                                                                    <Col className=" col  mt-2" style={{ paddingLeft: "inherit" }}>
                                                                                        <Input
                                                                                            id={`hasInwardCheck${key}`}
                                                                                            className="col col-2 text-black "
                                                                                            type="checkbox"
                                                                                            defaultChecked={openPOdata[key].Inward}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </li>
                                                                        </Col>
                                                                    )
                                                                })}
                                                            </Row>

                                                        </DropdownMenu>
                                                    </Dropdown>
                                            }

                                        </Col>
                                    </FormGroup> : null}



                            </Col>
                        </Row>
                    </div>

                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={grnItemList}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-Rresponsive">
                                                    <BootstrapTable
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
                        (grnItemList.length > 0) ?
                            <div className="row save1" style={{ paddingBottom: 'center', marginTop: "-30px" }}>
                                <SaveButton pageMode={pageMode}
                                    editCreatedBy={editCreatedBy}
                                    userAcc={userAccState}
                                    module={"GRN"} onClick={saveHandeller}
                                />
                            </div>
                            :
                            <div className="row save1"></div>
                    }
                </div >

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default GRNAdd

