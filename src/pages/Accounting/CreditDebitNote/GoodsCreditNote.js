import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    Breadcrumb_inputName,
    Retailer_List_Success, commonPageFieldSuccess,
    saveCredit, CredietDebitType, saveCredit_Success, EditCreditlistSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, C_Button, SaveButton, } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { InvoiceNumberSuccess, SalesReturnAddBtn_Action, SalesReturnAddBtn_Action_Succcess, InvoiceNumber } from "../../../store/Sales/SalesReturnRedux/action";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import { return_discountCalculate_Func } from "../../Sale/SalesReturn/SalesCalculation";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.GOODS_CREDIT_NOTE ) {
        page_Id = pageId.GOODS_CREDIT_NOTE;
        listPath = url.GOODS_CREDIT_LIST
    }
    else if (sub_Mode === url.GOODS_DEBIT_NOTE) {
        page_Id = pageId.GOODS_DEBIT_NOTE;
        listPath = url.GOODS_DEBIT_LIST
    }

    return { page_Id, listPath }
};


const GoodsCreditNote = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)

    const fileds = {
        CRDRNoteDate: currentDate_ymd,
        Customer: "",
        Narration: "",
        InvoiceNO: "",
        ItemName: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }]);
    const [TableArr, setTableArr] = useState([]);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        InvoiceNo,
        pageField,
        userAccess,
        addButtonData,
        saveBtnloading,
        addBtnLoading,
        invoiceNoDropDownLoading,
        retailerDropLoading,
        CreditDebitType,
    } = useSelector((state) => ({
        saveBtnloading: state.CredietDebitReducer.saveBtnloading,
        postMsg: state.CredietDebitReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.RetailerList,
        ItemList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        addButtonData: state.SalesReturnReducer.addButtonData,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        addBtnLoading: state.SalesReturnReducer.addBtnLoading,
        invoiceNoDropDownLoading: state.SalesReturnReducer.invoiceNoDropDownLoading,
        retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
        CreditDebitType: state.CredietDebitReducer.CreditDebitType,
    }));


    useEffect(() => {
        dispatch(InvoiceNumberSuccess([]));
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id));
        dispatch(goButtonPartyItemAddPage(JSON.stringify(_cfunc.loginJsonBody())));

        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID(),
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(BreadcrumbShowCountlabel(`${"Total Amount"} :${0}`));
        return () => {
            dispatch(Retailer_List_Success([]));
        };
    }, []);

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue);//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue);//changes

    const values = { ...state.values };
    const { isError } = state;
    const { fieldLabel } = state;


    useEffect(() => {// userAccess useEffect
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath);
        })
        if (userAcc) {
            setUserAccState(userAcc);
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    useEffect(() => {
        let credietDebitBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(credietDebitBody));

    }, []);

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        try {
            if ((hasShowloction || hasShowModal)) {

                let hasEditVal = null
                if (hasShowloction) {
                    setPageMode(location.pageMode)
                    hasEditVal = location.editValue
                }
                else if (hasShowModal) {
                    hasEditVal = props.editValue
                    setPageMode(props.pageMode)
                }
                if (hasEditVal) {

                    const { CRDRNoteDate, Customer, Narration, GrandTotal, CRDRInvoices = '', CustomerID, CRDRNoteItems = [] } = hasEditVal
                    debugger
                    const { values, fieldLabel, hasValid, required, isError } = { ...state }
                    values.CRDRNoteDate = CRDRNoteDate;
                    values.Customer = { label: Customer, value: CustomerID };
                    values.InvoiceNO = CRDRInvoices[0]
                        ? {
                            label: CRDRInvoices[0].FullInvoiceNumber,
                            value: CRDRInvoices[0].id
                        } : '';
                    values.Narration = Narration;
                    setTableArr(CRDRNoteItems)

                    let dataCount = CRDRNoteItems.length;
                    let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(GrandTotal).toFixed(2));
                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`));

                    setState({ values, fieldLabel, hasValid, required, isError })
                    dispatch(Breadcrumb_inputName(hasEditVal.Name))
                    seteditCreatedBy(hasEditVal.CreatedBy)
                }
                dispatch(EditCreditlistSuccess({ Status: false }))
            }
        } catch (w) { _cfunc.CommonConsole(w) }
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCredit_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))
            setTableArr([])

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let alertResponse = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (alertResponse) {
                    history.push({ pathname: listPath})
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCredit_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    useEffect(() => {

        if (addButtonData.StatusCode === 200 && addButtonData.Status === true) {
            dispatch(SalesReturnAddBtn_Action_Succcess({ StatusCode: false }))
            try {
                const updateItemArr = [...TableArr];
                let existingIds = updateItemArr.map(item => item.id);
                let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

                addButtonData.Data.forEach((i) => {
                    const MRPOptions = i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP, Rate: i.Rate }));
                    const GSTOptions = i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST }));

                    const highestMRP = i.ItemMRPDetails.reduce((prev, current) => {// Default highest GST when Return mode "2==ItemWise"
                        return (prev.MRP > current.MRP) ? prev : current;
                    }, '');

                    const highestGST = i.ItemGSTDetails.reduce((prev, current) => {// Default  highest GST when Return mode "2==ItemWise"
                        return (prev.GST > current.GST) ? prev : current;
                    }, '');

                    i.Rate = highestMRP.Rate || "";
                    i.MRP = highestMRP.MRP || "";
                    i.MRPValue = highestMRP.MRPValue || "";

                    i.GST = highestGST.GST || "";
                    i.GSTPercentage = highestGST.GSTPercentage || "";

                    const InvoiceQuantity = i.Quantity
                    const newItemRow = {
                        ...i,
                        Quantity: '',
                        InvoiceQuantity,
                        id: nextId,
                        MRPOptions,
                        GSTOptions,
                    }
                    const caculate = return_discountCalculate_Func(newItemRow)
                    newItemRow["roundedTotalAmount"] = caculate.roundedTotalAmount;
                    updateItemArr.push(newItemRow);
                    nextId++;
                });

                let sumOfGrandTotal = updateItemArr.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]) || 0, 0);
                let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
                dispatch(BreadcrumbShowCountlabel(count_label));
                updateItemArr.sort((a, b) => b.id - a.id);
                setTableArr(updateItemArr);
                setState((i) => {
                    let a = { ...i }
                    a.values.ItemName = ""
                    a.hasValid.ItemName.valid = true;
                    return a
                })

            } catch (error) { _cfunc.CommonConsole(error); }
        }
    }, [addButtonData]);


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

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));


    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            formatter: (cell, row) => (<Label style={{ minWidth: "200px" }}>{row.ItemName}</Label>)
        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-discount-row",
            formatExtraData: { TableArr },
            formatter: (cell, row, key, { TableArr }) => {
                return (
                    <div className="parent" >
                        <div className="child" style={{ minWidth: "100px" }}>
                            <CInput

                                defaultValue={row.Quantity}
                                autoComplete="off"
                                type="text"
                                cpattern={decimalRegx}
                                placeholder="Enter Quantity"
                                className="col col-sm text-end"
                                onChange={(event) => {
                                    row["Quantity"] = event.target.value;
                                    totalAmountCalcuationFunc(row, TableArr)
                                }}
                            />
                        </div>
                        <div className="child mt-2 pl-1">
                            <label className="label">&nbsp;{row.UnitName}</label>
                        </div>

                    </div>
                )
            }
        },

        {
            text: "MRP",
            dataField: "MRP",
            formatExtraData: { TableArr },
            formatter: (cell, row, key, { TableArr }) => {
                return (
                    <>
                        <div style={{ minWidth: "90px" }}>
                            <Select
                                id={`MRP${key}`}
                                name="MRP"
                                defaultValue={(row.MRP === "") ? "" : { value: row.MRP, label: row.MRPValue }}
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={row.MRPOptions}
                                onChange={(event) => {
                                    try {
                                        row.MRP = event.value;
                                        row.MRPValue = event.label;
                                        row.Rate = event.Rate;
                                        totalAmountCalcuationFunc(row, TableArr)
                                        document.getElementById(`Rate-${key}-${row.id}`).value = event.Rate
                                    } catch (error) {
                                        _cfunc.CommonConsole(error)
                                    }

                                }}

                            />
                        </div>
                    </>
                )
            }
        },

        {
            text: "GST",
            dataField: "",

            formatExtraData: { TableArr },
            formatter: (cell, row, key, { TableArr }) => {
                return (<div style={{ minWidth: "90px" }}>
                    <Select
                        id={`GST${key}`}
                        name="GST"
                        defaultValue={(row.GST === "") ? "" : { value: row.GST, label: row.GSTPercentage }}
                        isSearchable={true}
                        // isDisabled={returnMode === 1 && true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.GSTOptions}
                        onChange={(event) => {
                            row.GST = event.value;
                            row.GSTPercentage = event.label;
                            totalAmountCalcuationFunc(row, TableArr)
                        }}
                    />
                </div>)
            }
        },
        {
            text: "Basic Rate",
            dataField: "",

            classes: () => "sales-rate-row",
            formatExtraData: { TableArr },
            formatter: (cellContent, row, key, { TableArr }) => {
                if (!Number(row["DiscountType"])) {
                    row["DiscountType"] = 2;
                }
                return (
                    <>
                        <div className="">
                            <div className="parent  mb-1">
                                <div className="child">
                                    <Select
                                        id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        defaultValue={discountDropOption[1]}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            row.DiscountType = e.value;
                                            row.Discount = ''
                                            document.getElementById(`Discount-${key}`).value = ''//changr Discount value  by id
                                            totalAmountCalcuationFunc(row, TableArr);
                                        }}
                                    />
                                </div>
                                <div className="child">
                                    <CInput
                                        type="text"
                                        id={`Discount-${key}`}//this id use discount type onchange
                                        placeholder="Dist."
                                        className="text-end"
                                        cpattern={decimalRegx}
                                        onChange={(e) => {
                                            let e_val = Number(e.target.value);

                                            // Check if discount type is "percentage"
                                            if (Number(row.DiscountType) === 2) {// Discount type 2 represents "percentage"
                                                // Limit the input to the range of 0 to 100
                                                if (e_val >= 100) {
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ""; // Clear the input value if it is less than 0
                                                }
                                            }
                                            row.Discount = e.target.value;
                                            totalAmountCalcuationFunc(row, TableArr)
                                        }}

                                    />
                                </div>
                            </div>
                            <div className="parent">
                                <CInput
                                    defaultValue={row.Rate}
                                    id={`Rate-${key}-${row.id}`}//this id use discount type onchange
                                    placeholder="Enter Rate"
                                    type="text"
                                    cpattern={decimalRegx}
                                    className="text-end"
                                    onChange={(event) => {
                                        row.Rate = event.target.value
                                        totalAmountCalcuationFunc(row, TableArr)
                                    }}
                                />
                            </div>

                        </div>
                    </>
                );
            },
        },
        {
            text: "Item Comment",
            dataField: "",
            formatter: (_cell, row, key) => {
                return (<>
                    <div className="parent">
                        <div className="child">
                            <Input
                                placeholder="Enter Comment"
                                defaultValue={row.ItemComment}
                                type="text"
                                onChange={(event) => { row.ItemComment = event.target.value }}
                            />
                        </div>
                    </div>
                </>
                )
            }
        },
        {
            text: "Action ",
            formatExtraData: { TableArr },
            formatter: (_cell, row, key, { TableArr }) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row, TableArr) }}>
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    const totalAmountCalcuationFunc = (row, TablelistArray = []) => {
        const caculate = return_discountCalculate_Func(row)
        row.roundedTotalAmount = caculate.roundedTotalAmount;

        let sumOfGrandTotal = TablelistArray.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]) || 0, 0);
        let dataCount = TablelistArray.length;
        let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(sumOfGrandTotal).toFixed(2));
        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`));
    }

    const deleteButtonAction = (row, TablelistArray = []) => {
        const newArr = TablelistArray.filter((index) => !(index.id === row.id))
        let sumOfGrandTotal = newArr.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]) || 0, 0);
        let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
        dispatch(BreadcrumbShowCountlabel(count_label));
        setTableArr(newArr)
    }

    const ReturnDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.CRDRNoteDate = date;
            a.hasValid.CRDRNoteDate.valid = true
            return a
        })
    }

    const AddPartyHandler = async () => {

        const invalidMsg1 = []
        if ((values.ItemName === '')) {
            invalidMsg1.push(`Select Item Name`)
        }

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return
        }

        const jsonBody = JSON.stringify({
            "ItemID": values.ItemName.value,
            "BatchCode": "",
            "Customer": values.Customer.value // Customer Swipe when Po return
        })

        const InvoiceId = ''
        dispatch(SalesReturnAddBtn_Action({ jsonBody, InvoiceId, returnMode: 2 }))//(returnMode === 2) ItemWise
    }

    const RetailerHandler = (event) => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNO = ""
            a.values.Customer = event

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNO.valid = true;

            return a
        })
        setTableArr([])

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    const RetailerOnCancelClickHandler = () => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNO = ""
            a.values.Customer = ''

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNO.valid = true;
            return a
        })
        setTableArr([])
    }

    const itemNameOnChangeHandler = (hasSelect, evn) => {
        if (values.Customer === "") {
            customAlert({ Type: 3, Message: `Please select ${fieldLabel.Customer}` })
            return
        }
        onChangeSelect({ hasSelect, evn, state, setState, })
        // setReturnMode(2)
    }

    const changeButtonHandler = async () => {
        const permission = await customAlert({ Type: 7, Message: "Are you sure you want to change the customer?" })
        if (permission) {
            setTableArr([])
        }
    }

    const SaveHandler = async (event) => {
        try {
            event.preventDefault();
            const btnId = event.target.id;
            let grand_total = 0;
            const invalidMessages = [];
            const filterData = TableArr.filter((i) => {
                if (i.Quantity > 0) {
                    let msgString = ' Please Select';

                    if (i.MRP === '') { msgString = msgString + ', ' + "MRP" };
                    if (i.GST === '') { msgString = msgString + ', ' + "GST" };
                    if (!(Number(i.Rate) > 0)) { msgString = msgString + ', ' + "Rate" };

                    if (((i.MRP === '') || (i.GST === '') || !(Number(i.Rate) > 0))) {
                        invalidMessages.push({ [i.ItemName]: msgString });
                    }
                    return true
                }
            });

            if (invalidMessages.length > 0) {
                customAlert({
                    Type: 4,
                    Message: invalidMessages,
                });
                return;
            }

            if (filterData.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                });
                return;
            }

            const creditNoteItems = filterData.map((i) => {

                const calculate = return_discountCalculate_Func(i);
                grand_total += Number(calculate.roundedTotalAmount);

                return {
                    "CRDRNoteDate": "2023-09-04",
                    "Item": i.Item,
                    "ItemName": i.ItemName,
                    "Quantity": i.Quantity,
                    "Unit": i.Unit,
                    "BaseUnitQuantity": i.BaseUnitQuantity,
                    "BatchCode": '1111',
                    "MRP": i.MRP,
                    "MRPValue": i.MRPValue,
                    "Rate": i.Rate,
                    "GST": i.GST,
                    "ItemComment": i.ItemComment,
                    "CGST": Number(calculate.CGST_Amount).toFixed(2),
                    "SGST": Number(calculate.SGST_Amount).toFixed(2),
                    "IGST": Number(calculate.IGST_Amount).toFixed(2),
                    "GSTPercentage": calculate.GST_Percentage,
                    "CGSTPercentage": calculate.CGST_Percentage,
                    "SGSTPercentage": calculate.SGST_Percentage,
                    "IGSTPercentage": calculate.IGST_Percentage,
                    "BasicAmount": Number(calculate.discountBaseAmt).toFixed(2),
                    "GSTAmount": Number(calculate.roundedGstAmount).toFixed(2),
                    "Amount": Number(calculate.roundedTotalAmount).toFixed(2),
                    "TaxType": 'GST',
                    "DiscountType": calculate.discountType,
                    "Discount": calculate.discount,
                    "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
                };
            });

            const noteType_BySubPageMode = () => {
                return (subPageMode === url.GOODS_CREDIT_NOTE) ?
                    CreditDebitType.find((index) => index.Name === "Goods CreditNote")?.id
                    : CreditDebitType.find((index) => index.Name === "Goods DebitNote")?.id;
            };

            const jsonBody = JSON.stringify({
                CRDRNoteDate: values.CRDRNoteDate,
                Customer: values.Customer.value,
                NoteType: noteType_BySubPageMode(),
                GrandTotal: grand_total.toFixed(2),
                Narration: values.Narration,
                CRDRNoteItems: creditNoteItems,
                Party: _cfunc.loginPartyID(),
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                CRDRInvoices: [{ Invoice: values.InvoiceNO.value, }],
            });

            dispatch(saveCredit({ jsonBody, btnId }));

        } catch (e) { _cfunc.CommonConsole(e) }
    };




    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >
                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CRDRNoteDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='CRDRNoteDate'
                                                value={values.CRDRNoteDate}
                                                onChange={ReturnDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >



                            </Row>

                            <Row>
                                <Col sm="6"> {/*//Retailer DropDown */}
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                isLoading={retailerDropLoading}
                                                isDisabled={((TableArr.length > 0)) ? true : false}
                                                options={customerOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={RetailerHandler}
                                                onCancelClick={RetailerOnCancelClickHandler}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {TableArr.length > 0 &&
                                                <Change_Button
                                                    type="button"
                                                    onClick={changeButtonHandler}
                                                />
                                            }
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6"> {/* Narration Input*/}
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Narration"
                                                id="Narration"
                                                value={values.Narration}
                                                type="text"
                                                className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Enter Comment"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Narration.length > 0 && (
                                                <span className="invalid-feedback">{isError.Narration}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6"> {/* //ItemName */}
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <C_Select
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
                                                onChange={itemNameOnChangeHandler}
                                            />
                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            <C_Button
                                                type="button"
                                                loading={addBtnLoading}
                                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                                onClick={() => AddPartyHandler("ItemWise")}
                                            >
                                                Add
                                            </C_Button>
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/* //InvoiceNO DropDown */}
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.InvoiceNO}</Label>
                                        <Col sm="7">
                                            <C_Select
                                                name="InvoiceNO"
                                                value={values.InvoiceNO}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
                                                isLoading={invoiceNoDropDownLoading}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={TableArr}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "60vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton
                                            pageMode={pageMode}
                                            forceDisabled={addBtnLoading}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
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

export default GoodsCreditNote





