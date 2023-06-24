import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveSalesReturnMaster, saveSalesReturnMaster_Success } from "../../../store/Sales/SalesReturnRedux/action";
import CustomTable2 from "../../../CustomTable2/Table";
import { CInput, C_DatePicker } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { getpartyItemList } from "../../../store/Administrator/PartyItemsRedux/action";
import { SalesReturn_add_button_api_For_Item } from "../../../helpers/backend_helper";
import * as _cfunc from "../../../components/Common/CommonFunction";
import "../../Sale/Invoice/SalesReturn/salesReturn.scss";
import { salesReturnCalculate } from "../../Sale/Invoice/SalesReturn/SalesCalculation";

const StockEntry = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const fileds = {
        Date: currentDate_ymd,
        ItemName: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    const [TableArr, setTableArr] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ItemList,
        pageField,
        userAccess,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        postMsg: state.SalesReturnReducer.postMsg,
        ItemList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        const page_Id = pageId.STOCK_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getpartyItemList(_cfunc.loginJsonBody()))
    }, []);

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            setTableArr([])
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: url.SALES_RETURN_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    function Date_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    function deleteButtonAction(row) {
        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    function quantityHandler(event, row) {

        row["Qty"] = event.target.value

        let input = event.target.value

        // if (returnMode === 1) {
        let v1 = Number(row.Quantity);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        // }
        row.Qty = event.target.value

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.ItemName}</Label>
                )
            }
        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        id={`Qty${key}`}
                        key={`Qty${row.id}`}
                        defaultValue={row.Qty}
                        autoComplete="off"
                        type="text"
                        cpattern={decimalRegx}
                        className="col col-sm text-end"
                        onChange={(event) => quantityHandler(event, row)}
                    />
                </span>)
            }
        },
        {
            text: "Unit",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key, a, b) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`Unit${key}`}
                        name="Unit"
                        // defaultValue={returnMode === 1 && { value: row.RowData.Unit, label: row.RowData.UnitName }}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.ItemUnitDetails}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                        }}
                        onChange={(event) => {
                            row.Unit = event.value
                            row.BaseUnitQuantity = event.BaseUnitQuantity
                        }}
                    />
                </span>)
            }
        },
        {
            text: "MRP",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {
                return (
                    <>
                        <span style={{ justifyContent: 'center', width: "100px" }}>
                            <Select
                                id={`MRP${key}`}
                                name="MRP"
                                // defaultValue={returnMode === 1 && { value: row.RowData.MRP, label: row.RowData.MRPValue }}
                                isSearchable={true}
                                // isDisabled={returnMode === 1 && true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={row.ItemMRPDetails}
                                onChange={(event) => {
                                    row.MRP = event.value
                                    row.MRPValue = event.label
                                }}
                            />
                        </span></>)
            }
        },

        {
            text: "GST",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`GST${key}`}
                        name="GST"
                        // defaultValue={returnMode === 1 && { value: row.RowData.GST, label: row.RowData.GSTPercentage }}
                        isSearchable={true}
                        // isDisabled={returnMode === 1 && true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.ItemGSTHSNDetails}
                        onChange={(event) => {
                            row.GST_ID = event.value
                            row.GST = event.label
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Rate",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        id=""
                        key={row.id}
                        defaultValue={row.Rate}
                        // disabled={returnMode === 1 && true}
                        type="text"
                        cpattern={/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/}
                        className="col col-sm text-end"
                        onChange={(event) => { row.Rate = event.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "BatchCode",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultValue={row.RowData.BatchCode}
                        // disabled={returnMode === 1 && true}
                        type="text"
                        className="col col-sm text-center"
                        onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "BatchDate",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <C_DatePicker
                        name='Date'
                        // defaultValue={returnMode === 1 ? _cfunc.date_ymd_func(row.RowData.BatchDate) : currentDate_ymd}
                        // disabled={returnMode === 1 ? true : false}
                        onChange={(e, date) => {
                            row.BatchDate = _cfunc.date_ymd_func(date)
                        }}
                    />
                </span>)
            }
        },

        {
            text: "Action ",
            dataField: "",
            // hidden: (returnMode === 1) && true,
            formatter: (cellContent, row, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row) }}
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    async function AddPartyHandler(e, type) {

        const find = TableArr.find((element) => {
            return element.ItemId === values.ItemName.value
        });

        if (values.ItemName === '') {
            customAlert({
                Type: 4,
                Message: `Select Item Name`
            })
            return
        }

        else if (find === undefined) {
            setTableArr([...TableArr]);
        }

        else {
            customAlert({
                Type: 3,
                Message: "Item Name Already Exist",
            })
            return
        }
        
        let resp;
        try {
            resp = await SalesReturn_add_button_api_For_Item(values.ItemName.value)

            const data = resp.Data.InvoiceItems.map((i) => ({
                unitOps: i.ItemUnitDetails.map(i => ({ label: i.UnitName, value: i.Unit, BaseUnitQuantity: i.BaseUnitQuantity })),
                MRPOps: i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP })),
                GSTOps: i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST })),
                ItemName: i.ItemName,
                ItemId: i.Item,
                Quantity: i.Quantity,
                Rate: i.Rate,
                RowData: i,
                BatchDate: currentDate_ymd
            }))

            const itemArr = [...TableArr]

            data.forEach((i) => {
                itemArr.push({
                    id: itemArr.length + 1,
                    ItemUnitDetails: i.unitOps,
                    ItemMRPDetails: i.MRPOps,
                    ItemGSTHSNDetails: i.GSTOps,
                    ItemName: i.ItemName,
                    ItemId: i.ItemId,
                    Quantity: i.Quantity,
                    Rate: i.Rate,
                    gstPercentage: i.RowData.GSTPercentage,
                    RowData: i.RowData,
                    BatchDate: currentDate_ymd
                })
            })

            setTableArr(itemArr)

            setState((i) => {
                let a = { ...i }
                a.values.ItemName = ""
                a.hasValid.ItemName.valid = true;
                return a
            })
        } catch (w) { }
    }

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        let grand_total = 0;
        const ReturnItems = TableArr.map((i) => {

            var gstPercentage = i.GST
            const calculate = salesReturnCalculate({ Rate: i.Rate, Qty: i.Qty, gstPercentage: gstPercentage })

            grand_total = grand_total + Number(calculate.tAmount)

            return ({
                "Item": i.ItemName.value,
                "ItemName": i.ItemName.label,
                "Quantity": i.Qty,
                "Unit": i.Unit,
                "BaseUnitQuantity": i.BaseUnitQuantity,
                "BatchCode": i.BatchCode,
                "BatchDate": i.BatchDate,
                "Amount": calculate.tAmount,
                "MRP": i.MRP,
                "MRPValue": i.MRPValue,
                "Rate": i.Rate,
                "BasicAmount": calculate.baseAmt,
                "GSTAmount": calculate.gstAmt.toFixed(2),
                "GST": i.GST_ID,
                "GSTPercentage": gstPercentage,
                "CGST": calculate.CGST,
                "SGST": calculate.SGST,
                "IGST": 0,
                "CGSTPercentage": (gstPercentage / 2),
                "SGSTPercentage": (gstPercentage / 2),
                "IGSTPercentage": 0,
                "TaxType": "GST",
                "ReturnItemImages": []
            })
        })

        const filterData = ReturnItems.filter((i) => {
            return i.Quantity > 0
        })

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: " Please Enter One Item Quantity"
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        const invalidMsg1 = []

        ReturnItems.forEach((i) => {

            if ((i.Unit === undefined) || (i.Unit === null)) {
                invalidMsg1.push(`${i.ItemName} : Unit Is Required`)
            }
            else if ((i.MRP === undefined) || (i.MRP === null)) {
                invalidMsg1.push(`${i.ItemName} : MRP Is Required`)
            }
            else if ((i.GST === undefined) || (i.GST === null)) {
                invalidMsg1.push(`${i.ItemName} : GST Is Required`)
            }
            else if ((i.Rate === undefined) || (i.Rate === null)) {
                invalidMsg1.push(`${i.ItemName} : Rate Is Required`)
            }
            else if ((i.BatchCode === undefined) || (i.BatchCode === null)) {
                invalidMsg1.push(`${i.ItemName} : BatchCode Is Required`)
            };
        })

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Date: values.Date,
                    ReturnReason: values.ReturnReason.value,
                    Customer: values.Customer.value,
                    Comment: values.Comment,
                    GrandTotal: grand_total,
                    Party: _cfunc.loginPartyID(),
                    RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    ReturnItems: filterData,
                });
                dispatch(saveSalesReturnMaster({ jsonBody, btnId }));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-3 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />

                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "add")}
                                                > Add</Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>


                        </div>

                        <CustomTable2
                            data={TableArr}
                            columns={pagesListColumns}
                            classes={" table table-responsive table-bordered table-hover"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Record Not available
                                </div>
                            }
                        >
                        </CustomTable2>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default StockEntry
