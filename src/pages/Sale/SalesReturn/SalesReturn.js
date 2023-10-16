import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button,
    Modal,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, Retailer_List_Success, commonPageFieldSuccess, goButtonPartyItemAddPageSuccess } from "../../../store/actions";
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
import { C_Button, SaveButton, } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import {
    saveSalesReturnMaster,
    InvoiceNumber,
    InvoiceNumberSuccess,
    saveSalesReturnMaster_Success,
    SalesReturnAddBtn_Action,
    SalesReturnAddBtn_Action_Succcess
} from "../../../store/Sales/SalesReturnRedux/action";
import "./salesReturn.scss";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import { return_discountCalculate_Func } from "./SalesCalculation";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Slidewithcaption from "../../../components/Common/CommonImageComponent";
import NewCommonPartyDropdown from "../../../components/Common/NewCommonPartyDropdown";

const SalesReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();
    const { SaleableItemReasonID = '' } = _cfunc.loginSystemSetting();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        ItemName: "",
        InvoiceNumber: "",
        BatchCode: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }]);
    const [TableArr, setTableArr] = useState([]);
    const [ImageCount, setImageCount] = useState(0);

    const [returnMode, setReturnMode] = useState(0); //(1==ItemWise) OR (2==invoiceWise)
    const [imageTable, setImageTable] = useState([]);  // Selected Image Array

    const [isSaleableStock, setIsSaleableStock] = useState(false);
    const [ReturnReasonFilterData, setReturnReasonOptions] = useState([]);
    const [filteredReasonArr, setFilteredReasonArr] = useState([]);
    const [reasonArrExceptPartyID, setReasonArrExceptPartyID] = useState([]);

    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        ReturnReasonListRedux,
        InvoiceNo,
        pageField,
        userAccess,
        addButtonData,
        saveBtnloading,
        addBtnLoading,
        invoiceNoDropDownLoading,
        retailerDropLoading,
        commonPartyDropSelect
    } = useSelector((state) => ({
        addButtonData: state.SalesReturnReducer.addButtonData,
        postMsg: state.SalesReturnReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.RetailerList,
        ItemList: state.PartyItemsReducer.partyItem,
        ReturnReasonListRedux: state.PartyMasterBulkUpdateReducer.SelectField,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        addBtnLoading: state.SalesReturnReducer.addBtnLoading,
        invoiceNoDropDownLoading: state.SalesReturnReducer.invoiceNoDropDownLoading,
        retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.SALES_RETURN))
        dispatch(BreadcrumbShowCountlabel(`${"Total Amount"} :${0}`))
        return () => {
            dispatch(Retailer_List_Success([]));
        }
    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            const jsonBody = JSON.stringify({
                Type: 1,
                PartyID: commonPartyDropSelect.value,
                CompanyID: _cfunc.loginCompanyID()
            });
            dispatch(Retailer_List(jsonBody));
            dispatch(goButtonPartyItemAddPage({ jsonBody: JSON.stringify({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }) }))
        }

        setState((i) => {

            let a = { ...i }
            a.values.Customer = ""
            a.values.ItemName = ""
            a.values.InvoiceNumber = ''

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
            return a
        })
        return () => {
            dispatch(InvoiceNumberSuccess([]));
            dispatch(goButtonPartyItemAddPageSuccess([]));
            dispatch(Retailer_List_Success([]));
            setTableArr([]);
        }

    }, [commonPartyDropSelect]);

    useEffect(() => {
        if (TableArr.length === 0) {
            setReturnMode(0)
        }
    }, [TableArr]);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {// userAccess useEffect
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

    useEffect(() => {// Return Reason dropdown Values
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
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let alterRepont = customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (alterRepont) {
                    history.push({ pathname: url.SALES_RETURN_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

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

                    if (returnMode === 2) { //(returnMode === 2) ItemWise
                        i.Rate = highestMRP.Rate || "";
                        i.MRP = highestMRP.MRP || "";
                        i.MRPValue = highestMRP.MRPValue || "";

                        i.GST = highestGST.GST || "";
                        i.GSTPercentage = highestGST.GSTPercentage || "";
                    }

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

            } catch (error) { _cfunc.CommonConsole(error) }
        }
    }, [addButtonData])

    //useeffect For image Mode set open
    useEffect(() => {
        if (imageTable.length > 0) {
            setmodal_backdrop(true)
        }
    }, [imageTable])

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

    useEffect(async () => {

        try {
            let partyIDsArray = SaleableItemReasonID.split(",").map(id => parseInt(id.trim(), 10));
            let filteredReasons = ReturnReasonListRedux.filter(item => partyIDsArray.includes(item.id));
            let reasonsExceptPartyID = ReturnReasonListRedux.filter(item => !partyIDsArray.includes(item.id));
            setFilteredReasonArr(filteredReasons);
            setReasonArrExceptPartyID(reasonsExceptPartyID);

        } catch (e) { }

    }, [ReturnReasonListRedux]);

    useEffect(() => {

        if (isSaleableStock) {
            setReturnReasonOptions(filteredReasonArr);
        } else {
            setReturnReasonOptions(reasonArrExceptPartyID);
        }
    }, [isSaleableStock, filteredReasonArr, reasonArrExceptPartyID]);

    const ReturnReasonOptions = ReturnReasonFilterData.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",

            formatter: (cell, row) => {
                return (
                    <Label style={{ minWidth: "200px" }}>{row.ItemName}</Label>
                )
            }
        },

        {
            text: "Invoice Qty",
            hidden: (returnMode === 1) ? false : true,
            align: () => "right",
            formatter: (cell, row) => <Label>{row.InvoiceQuantity}</Label>,

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
                                isDisabled={returnMode === 1 && true}
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
                        isDisabled={returnMode === 1 && true}
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
            text: "Batch",
            dataField: "",
            classes: () => "sales-rate-row",
            formatter: (cell, row,) => {
                return (
                    <>
                        <div className="">
                            <div className="parent mb-1">
                                <Input
                                    defaultValue={row.BatchCode}
                                    placeholder="Enter BatchCode"
                                    type="text"
                                    className="col col-sm text-center"
                                    onChange={(event) => { row.BatchCode = event.target.value }}
                                />
                            </div>
                            <div className="parent">
                                <C_DatePicker
                                    options={{
                                        maxDate: 'today',
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    placeholder="Enter BatchDate"
                                    defaultValue={row.BatchDate}
                                    onChange={(e, date) => {
                                        row.BatchDate = _cfunc.date_ymd_func(date)
                                    }}
                                />
                            </div>

                        </div>

                    </>
                );
            },

        },
        {
            text: "Return Reason",
            dataField: "",
            classes: () => "sales-return-row",
            formatExtraData: { ReturnReasonOptions }, // Pass ReturnReasonOptions as part of formatExtraData

            formatter: (cellContent, row, rowIndex, { ReturnReasonOptions }) => {
                return (<>
                    <div className="parent mb-1">
                        <div className="child">
                            <Select
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                value={ReturnReasonOptions.find(option => option.value === row.defaultReason)}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                                options={ReturnReasonOptions}
                                onChange={event => {
                                    row["defaultReason"] = event.value;
                                }}
                            />
                        </div>
                    </div>
                    <div className="parent">
                        <div className="child">
                            <Input
                                placeholder="Enter Comment"
                                defaultChecked={row.ItemComment}
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
            text: "Image",
            dataField: "",
            classes: () => "sales-return-Image-row",
            formatExtraData: { ReturnReasonOptions }, // Pass ReturnReasonOptions as part of formatExtraData


            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <div>
                        <div className="btn-group btn-group-example mb-3" role="group">
                            <Input
                                type="file"
                                className="form-control "
                                name="image"
                                multiple
                                id="file"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onChange={(event) => { imageSelectHandler(event, row) }}
                            />
                            <button name="image"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onClick={(event) => {
                                    if ((row.ImageURL) && (row.ImageURL.length === 0)) {
                                        return setmodal_backdrop(false)
                                    } else if ((row.ImageURL) && (row.ImageURL.length > 0)) {
                                        imageShowHandler(row)
                                    }
                                }}
                                id="ImageId" type="button" className="btn btn-primary "> Show </button>
                        </div>
                        {/* Image Count: {row && row.ImageURL ? ImageCount : 0} */}
                    </div>


                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            hidden: returnMode === 1 ? true : false,
            formatExtraData: { TableArr },
            formatter: (cellContent, row, key, { TableArr }) => (
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
        let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
        dispatch(BreadcrumbShowCountlabel(count_label))
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
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const AddPartyHandler = async (byType) => {

        const invalidMsg1 = []
        if ((values.ItemName === '') && (byType === 'ItemWise')) {
            invalidMsg1.push(`Select Item Name`)
        }
        if ((values.InvoiceNumber === '') && (values.Customer === '') && (byType === 'InvoiceWise')) {
            invalidMsg1.push(`Select ${fieldLabel.Customer}.`)
        }
        else if ((values.InvoiceNumber === '') && (byType === 'InvoiceWise')) {
            invalidMsg1.push(`Select Invoice No.`)
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
            "BatchCode": values.BatchCode,
            "Customer": values.Customer.value // Customer Swipe when Po return
        })

        const InvoiceId = values.InvoiceNumber ? values.InvoiceNumber.value : ''
        const nrwReturnMode = (byType === 'ItemWise') ? 2 : 1 //(returnMode === 2) ItemWise
        dispatch(SalesReturnAddBtn_Action({ jsonBody, InvoiceId, returnMode: nrwReturnMode }))
        setReturnMode(nrwReturnMode)
    }

    const RetailerHandler = (event) => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.values.Customer = event

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;

            return a
        })
        setTableArr([])

        const jsonBody = JSON.stringify({
            PartyID: commonPartyDropSelect.value,
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    const RetailerOnCancelClickHandler = () => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.values.Customer = ''

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
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
        setReturnMode(2)
    }

    const imageSelectHandler = async (event, row) => { // image Select  handler

        const file = Array.from(event.target.files)
        const slides = file.map(item => {  //Create File to URl to Show Image of Particular row
            return URL.createObjectURL(item);
        })
        row["Image"] = file
        row["ImageURL"] = slides
        setImageCount(slides.length)
    }

    const imageShowHandler = async (row) => { // image Show handler
        const file = Array.from(row.Image)
        // const slides = file.map(item => return {
        //      Image: URL.createObjectURL(item)
        // })
        const slides = file.map(item => ({
            Image: URL.createObjectURL(item)
        }));
        setImageTable(slides)
    }

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id;
        let grand_total = 0;
        const invalidMessages = [];

        const filterData = TableArr.filter((i) => {
            if (i.Quantity > 0) {
                let msgString = ' Please Select';

                if (i.MRP === '') { msgString = msgString + ', ' + "MRP" };
                if (i.GST === '') { msgString = msgString + ', ' + "GST" };
                if (i.BatchCode === '') { msgString = msgString + ', ' + "BatchCode" };
                if (i.BatchDate === '') { msgString = msgString + ', ' + "BatchDate" };
                if (!(Number(i.Rate) > 0)) { msgString = msgString + ', ' + "Rate" };
                if (!i.defaultReason) { msgString = msgString + ', ' + "Return Reason" };

                if (((!i.defaultReason) || (i.MRP === '') || (i.GST === '')
                    || (i.BatchCode === '') || (i.BatchDate === '') || !(Number(i.Rate) > 0))) {
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
        const formData = new FormData(); // Create a new FormData object

        const ReturnItems = filterData.map((i, key) => {

            if (!i.defaultReason) {
                invalidMessages.append(i.ItemName, 'Select Return Reason'); // Add error message to FormData
            }

            const calculate = return_discountCalculate_Func(i);
            grand_total += Number(calculate.roundedTotalAmount);

            let ToatlImages = []
            if (i.Image !== undefined) {
                ToatlImages = Array.from(i.Image).map((item, key) => {
                    formData.append(`uploaded_images_${i.Item}`, i.Image[key]);  //Sending image As a file 
                    return { Item_pic: `Purchase Return Image Count${key}` }
                })
            } else {
                ToatlImages = []
            }

            return {
                "Item": i.Item,
                "ItemName": i.ItemName,
                "ApprovedQuantity": i.Quantity,
                "Quantity": i.Quantity,
                "Unit": i.Unit,
                "BaseUnitQuantity": i.BaseUnitQuantity,
                "BatchCode": i.BatchCode,
                "BatchDate": i.BatchDate,
                "BatchID": 1,  //when Mode=1 then BatchID=1
                "MRP": i.MRP,
                "MRPValue": i.MRPValue,
                "Rate": i.Rate,
                "GST": i.GST,
                "ItemReason": i.defaultReason ? i.defaultReason : "",
                "Comment": i.ItemComment,
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
                "PurchaseReturn": "",
                "SubReturn": "",
                "ReturnItemImages": ToatlImages,
            };
        });

        try {
            formData.append('ReturnDate', values.ReturnDate);
            formData.append('ReturnReasonOptions', isSaleableStock ? 1 : 0);
            formData.append('BatchCode', values.BatchCode);
            formData.append('Customer', values.Customer.value);
            formData.append('Party', commonPartyDropSelect.value);
            formData.append('Comment', values.Comment);
            formData.append('GrandTotal', Number(grand_total).toFixed(2));
            formData.append('RoundOffAmount', (grand_total - Math.trunc(grand_total)).toFixed(2));
            formData.append('CreatedBy', _cfunc.loginUserID());
            formData.append('UpdatedBy', _cfunc.loginUserID());
            formData.append('Mode', 1);
            formData.append('IsApproved', 1);
            formData.append('PurchaseReturnReferences', JSON.stringify([])); // Convert to JSON string
            formData.append('ReturnItems', JSON.stringify(ReturnItems)); // Convert to JSON string

            dispatch(saveSalesReturnMaster({ formData, btnId })); // Send FormData as the payload
        } catch (e) {
            _cfunc.CommonConsole(e);
        }
    };

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <NewCommonPartyDropdown pageMode={pageMode} />
                    <Modal
                        isOpen={modal_backdrop}
                        toggle={() => {
                            tog_backdrop()
                        }}

                        style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                        className="modal-dialog-centered "

                    >
                        {(imageTable.length > 0) && <Slidewithcaption Images={imageTable} />}
                    </Modal>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >
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

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isDisabled={(returnMode === 1) ? true : false}
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
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Enter Comment"
                                                autoComplete='off'
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
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BatchCode}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="BatchCode"
                                                value={values.BatchCode}
                                                placeholder="Enter BatchCode"
                                                type='text'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.BatchCode.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.BatchCode}</small></span>
                                            )}


                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">

                                            {(!(returnMode === 1)) &&///(returnMode === 1) InvoiceWise */}
                                                <C_Button
                                                    type="button"
                                                    loading={addBtnLoading}
                                                    className="btn btn-outline-primary border-1 font-size-12 text-center"
                                                    onClick={() => AddPartyHandler("ItemWise")}
                                                >
                                                    Add
                                                </C_Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>IsSaleableStock</Label>
                                        <Col sm="7">
                                            <Input
                                                style={{ marginRight: "0.4cm", marginTop: "10px", width: "15px", height: "15px" }}
                                                type="checkbox"
                                                disabled={TableArr.length > 0 && true}
                                                defaultChecked={isSaleableStock}
                                                onChange={(event) => { setIsSaleableStock(event.target.checked) }}
                                            />

                                        </Col>

                                    </FormGroup>
                                </Col >

                                {/* <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.InvoiceNumber}</Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="InvoiceNumber "
                                                name="InvoiceNumber"
                                                value={values.InvoiceNumber}
                                                //(returnMode === 2) ItemWise
                                                isDisabled={((returnMode === 2) || invoiceNoDropDownLoading || (TableArr.length > 0)) ? true : false}
                                                isSearchable={true}
                                                isLoading={invoiceNoDropDownLoading}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setReturnMode(1)
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
                                                (!(returnMode === 2)) &&//(returnMode === 2) ItemWise
                                                <C_Button
                                                    type="button"
                                                    loading={addBtnLoading}
                                                    className="btn btn-outline-primary border-1 font-size-12 text-center"
                                                    onClick={() => AddPartyHandler("InvoiceWise")}>
                                                    Select
                                                </C_Button>

                                            }
                                        </Col>
                                    </FormGroup>
                                </Col > */}

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
                                                        key={`table-key-${returnMode}`}
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

export default SalesReturn






































