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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, SaveButton } from "../../../../components/Common/CommonButton";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { Retailer_List } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { saveSalesReturnMaster, InvoiceNumber, InvoiceNumberSuccess, saveSalesReturnMaster_Success } from "../../../../store/Sales/SalesReturnRedux/action";
import CustomTable2 from "../../../../CustomTable2/Table";
import "./salesReturn.scss";
import { CInput, C_DatePicker } from "../../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../../CustomValidateForm/RegexPattern";
import { getpartyItemList } from "../../../../store/Administrator/PartyItemsRedux/action";
import { SalesReturn_add_button_api_For_Invoice, SalesReturn_add_button_api_For_Item } from "../../../../helpers/backend_helper";
import { salesReturnCalculate } from "./SalesCalculation";
import * as _cfunc from "../../../../components/Common/CommonFunction";


const SalesReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        ItemName: "",
        InvoiceNumber: "",
        ReturnReason: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    const [TableArr, setTableArr] = useState([]);

    const [returnMode, setrRturnMode] = useState(0);
    const [imageTable, setImageTable] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        ReturnReasonList,
        InvoiceNo,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.SalesReturnReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.RetailerList,
        ItemList: state.PartyItemsReducer.partyItem,
        ReturnReasonList: state.PartyMasterBulkUpdateReducer.SelectField,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(InvoiceNumberSuccess([]))
        const page_Id = pageId.SALES_RETURN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getpartyItemList(_cfunc.loginJsonBody()))
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        if (TableArr.length === 0) {
            setrRturnMode(0)
        }
    }, [TableArr]);

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

    // Return Reason dropdown Values
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 8
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

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

    function ReturnDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    const ReturnReasonOptions = ReturnReasonList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    function deleteButtonAction(row) {
        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    function quantityHandler(event, row) {

        row["Qty"] = event.target.value

        let input = event.target.value

        if (returnMode === 1) {
            let v1 = Number(row.Quantity);
            let v2 = Number(input)
            if (!(v1 >= v2)) {
                event.target.value = v1;
            }
        }
        row.Qty = event.target.value

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "",
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.ItemName.label}</Label>
                )
            }
        }, ,
        {
            text: "Invoice Qty",
            dataField: "",
            hidden: returnMode === 2 && true,
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.Quantity}</Label>
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
                        defaultValue={returnMode === 1 && { value: row.RowData.Unit, label: row.RowData.UnitName }}
                        isSearchable={true}
                        isDisabled={returnMode === 1 && true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.ItemUnitDetails}
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
                                defaultValue={returnMode === 1 && { value: row.RowData.MRP, label: row.RowData.MRPValue }}
                                isSearchable={true}
                                isDisabled={returnMode === 1 && true}
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
                        defaultValue={returnMode === 1 && { value: row.RowData.GST, label: row.RowData.GSTPercentage }}
                        isSearchable={true}
                        isDisabled={returnMode === 1 && true}
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
                        disabled={returnMode === 1 && true}
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
                        disabled={returnMode === 1 && true}
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
                        name='ReturnDate'
                        defaultValue={returnMode === 1 ? _cfunc.date_ymd_func(row.RowData.BatchDate) : currentDate_ymd}
                        disabled={returnMode === 1 ? true : false}
                        onChange={(e, date) => {
                            row.BatchDate = _cfunc.date_ymd_func(date)
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Item Comment",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultChecked={row.ItemComment}
                        type="text"
                        className="col col-sm text-center"
                        onChange={(event) => { row.ItemComment = event.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "Image",
            dataField: "",
            classes: () => "sales-return-Image-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <div>
                        <div className="btn-group btn-group-example mb-3" role="group">
                            <Input
                                type="file"
                                className="form-control "
                                // value={FileName}
                                name="image"
                                id="file"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onChange={(event) => { onchangeHandler(event, row) }}
                            />
                            <button name="image"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onClick={() => { myFunction(row) }}
                                id="ImageId" type="button" className="btn btn-primary ">Show</button>
                        </div>
                    </div>


                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            hidden: (returnMode === 1) && true,
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

        const invalidMsg1 = []
        if ((values.ItemName === '') && (type === 'add')) {
            invalidMsg1.push(`Select Item Name`)
        }
        if ((values.InvoiceNumber === '') && (values.Customer === '') && (type === 'Select')) {
            invalidMsg1.push(`Select Retailer.`)
        }
        else if ((values.InvoiceNumber === '') && (type === 'Select')) {
            invalidMsg1.push(`Select Invoice No.`)
        }

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return
        }

        let resp;
        try {

            if (returnMode === 2) {
                resp = await SalesReturn_add_button_api_For_Item(values.ItemName.value)
            }
            else {
                resp = await SalesReturn_add_button_api_For_Invoice(values.InvoiceNumber.value)
            }

            const data = resp.Data.InvoiceItems.map((i) => ({
                unitOps: (returnMode === 1) ? { label: i.UnitName, value: i.Unit, BaseUnitQuantity: i.BaseUnitQuantity } : i.ItemUnitDetails.map(i => ({ label: i.UnitName, value: i.Unit, BaseUnitQuantity: i.BaseUnitQuantity })),
                MRPOps: i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP })),
                GSTOps: i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST })),
                ItemName: { label: i.ItemName, value: i.Item },
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

    function RetailerHandler(event) {

        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
            return a
        })
        setTableArr([])

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    // image onchange handler
    const onchangeHandler = async (event, row) => {

        const file = event.target.files[0]
        const base64 = await convertBase64(file);
        let ImageUpload = base64
        row.Image = ImageUpload
        setImageTable(ImageUpload)
    }

    // image convert in string
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    function myFunction(row) {

        var x = document.getElementById("add-img");
        if (x.style.display === "none") {
            x.src = imageTable
            if (imageTable != "") {
                x.style.display = "block";

            }

        } else {
            x.style.display = "none";
        }
    }

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        let grand_total = 0;
        const ReturnItems = TableArr.map((i) => {

            var gstPercentage = returnMode === 1 ? i.gstPercentage : i.GST
            const calculate = salesReturnCalculate({ Rate: i.Rate, Qty: i.Qty, gstPercentage: gstPercentage })

            grand_total = grand_total + Number(calculate.tAmount)

            return ({
                "Item": i.ItemName.value,
                "ItemName": i.ItemName.label,
                "Quantity": i.Qty,
                "Unit": returnMode === 1 ? i.RowData.Unit : i.Unit,
                "BaseUnitQuantity": returnMode === 1 ? i.RowData.BaseUnitQuantity : i.BaseUnitQuantity,
                "BatchCode": returnMode === 1 ? i.RowData.BatchCode : i.BatchCode,
                "BatchDate": returnMode === 1 ? i.RowData.BatchDate : i.BatchDate,
                "Amount": calculate.tAmount,
                "MRP": returnMode === 1 ? i.RowData.MRP : i.MRP,
                "MRPValue": returnMode === 1 ? i.RowData.MRPValue : i.MRPValue,
                "Rate": i.Rate,
                "BasicAmount": calculate.baseAmt,
                "GSTAmount": calculate.gstAmt,
                "GST": returnMode === 1 ? i.RowData.GST : i.GST_ID,
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
                    ReturnDate: values.ReturnDate,
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
                // if (pageMode === mode.edit) {
                //     dispatch(updateCategoryTypeID({ jsonBody, updateId: values.id, btnId }));
                // }
                // else {
                dispatch(saveSalesReturnMaster({ jsonBody, btnId }));

            }
            // }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >
                            < img id='add-img' className='abc1' src={''} style={{ top: "400px" }} />

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReturnDate'
                                                value={values.ReturnDate}
                                                onChange={ReturnDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer "
                                                name="Customer"
                                                // closeMenuOnSelect={false}
                                                // menuIsOpen={menuIsOpen}
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    RetailerHandler(hasSelect)
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnReason} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ReturnReason "
                                                name="ReturnReason"
                                                value={values.ReturnReason}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReturnReasonOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.ReturnReason.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReturnReason}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                // autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback">{isError.Comment}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isDisabled={(returnMode === 1) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(2)
                                                }}
                                            />

                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                (!(returnMode === 1)) &&
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "add")}
                                                > Add</Button>
                                            }

                                        </Col>
                                        {/* <Col sm="1" className="mx-6 mt-1 ">

                                            <Col sm="1" className="mx-6 ">                   
                                                {(pageMode === mode.defaultsave) ?
                                                    (TableArr.length === 0) || (returnMode === 2) ?
                                                        <Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                            onClick={(e,) => AddPartyHandler(e, "1")}
                                                        >        <i > </i>Add</Button>
                                                        :
                                                        <Change_Button onClick={(e) => {
                                                            setTableArr([])
                                                            setState((i) => {
                                                                let a = { ...i }
                                                                a.values.InvoiceNumber = ""
                                                                a.hasValid.InvoiceNumber.valid = true;
                                                                return a
                                                            })
                                                        }} />
                                                    : null
                                                }

                                            </Col>
                                        </Col> */}
                                        {/* <Col sm="1" className="mx-4 mt-1 ">
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginLeft: "0.5cm", color: " rgb(125 74 157)" }}>
                                                OR </Label>

                                        </Col> */}
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.InvoiceNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="InvoiceNumber "
                                                name="InvoiceNumber"
                                                value={values.InvoiceNumber}
                                                isDisabled={((returnMode === 2) || (TableArr.length > 0)) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(1)
                                                }}
                                            />

                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1 ">
                                            {((TableArr.length > 0) || (!(values.ItemName === ""))) ?
                                                <Change_Button onClick={(e) => {
                                                    setTableArr([])
                                                    setState((i) => {
                                                        let a = { ...i }
                                                        a.values.ItemName = ""
                                                        a.values.InvoiceNumber = ""
                                                        return a
                                                    })
                                                }} />
                                                :
                                                (!(returnMode === 2)) &&
                                                <Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "Select")}
                                                >        <i > </i>Select</Button>

                                            }


                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <CustomTable2
                            data={TableArr}
                            columns={pagesListColumns}
                            // customSearch={bulkSearch}
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
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"SalesReturn"}
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

export default SalesReturn
