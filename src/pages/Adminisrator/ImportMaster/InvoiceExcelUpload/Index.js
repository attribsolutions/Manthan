
import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess, goButtonPartyItemAddPage, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as mode from "../../../../routes/PageMode";
import * as _cfunc from "../../../../components/Common/CommonFunction";

import { getPartyListAPISuccess } from "../../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"
import { InvoiceUploadCalculation, downloadDummyFormatHandler, fileDetails, filterArraysInEntries, readExcelFile } from "./readFile";
import {
    GoButton_ImportFiledMap_Add,
    GoButton_ImportFiledMap_AddSuccess
} from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import {
    GoButton_ImportExcelPartyMap,
    InvoiceExcelUpload_save_action,
    InvoiceExcelUpload_save_Success
} from "../../../../store/Administrator/ImportExcelPartyMapRedux/action";
import './scss.scss'
import { PageLoadingSpinner, Verifiy_Button } from "../../../../components/Common/CommonButton";
import { ImportMaster_Map_Unit_GoButton_API } from "../../../../helpers/backend_helper";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";

const InvoiceExcelUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: [], amount: 0, invoiceNO: [], partyNO: [] };

    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([]);
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails);
    const [updatereadJsonDetail, setUpdateReadJsonDetail] = useState(preDetails);
    const [preViewDivShow, setPreViewDivShow] = useState(false);
    const [verifyLoading, setverifyLoading] = useState(false);
    const [isIgnoreNegativeValue, setisIgnoreNegativeValue] = useState(false);
    const [isIgnoreItem, setisIgnoreItem] = useState(false);
    const [isIgnoreParty, setisIgnoreParty] = useState(false);



    const [unitMapData, setunitMapData] = useState([]);
    const [unitVerify, setUnitVerify] = useState({ Wrong_Unit_Code_Array: [], Not_Verify_Unit: undefined });
    // const [allpartyVerify, setAllPartyVerify] = useState({ Not_Map_Party_Code_Array: [], Not_Map_Party: undefined });
    const [partyVerify, setPartyVerify] = useState({ Wrong_Party_Code_Array: [], Not_Verify_Party: undefined });
    const [itemVerify, setItemVerify] = useState({ Wrong_Item_Code_Array: [], Not_Verify_Item: undefined });
    const [negativeFigureVerify, setNegativeFigureVerify] = useState({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined });
    const [nonCBMItemVerify, setNonCBMItemVerify] = useState({ Non_CBM_Item_Array: [], Not_Verify_Non_CBM_Item: undefined });
    const [invoiceWithsameDateVerify, setInvoiceWithsameDateVerify] = useState({ Invoice_Date: [], Not_Verify_Same_Date: undefined, isFutureDate: false });
    const [invalidFormat, setInvalidFormat] = useState({ Invalid_Format_Array: [], Not_Verify_Invalid_Format: undefined });



    const [colunmMap, setColunmMap] = useState({ Not_Map_Column_Array: [], Not_Map_Columnt: undefined });

    const {
        postMsg,
        userAccess,
        compareParameter = [],
        partyDropDownLoading,
        compareParamLoading,
        saveBtnLoading,
        commonPartyDropSelect,
        PartyMapData,
        ItemList,
    } = useSelector((state) => ({
        postMsg: state.ImportExcelPartyMap_Reducer.invoiceExcelUploadMsg,
        saveBtnLoading: state.ImportExcelPartyMap_Reducer.invoiceUploadSaveLoading,
        PartyMapData: state.ImportExcelPartyMap_Reducer.addGoButton,

        partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        partyDropDownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,

        compareParameter: state.ImportExportFieldMap_Reducer.addGoButton,
        compareParamLoading: state.ImportExportFieldMap_Reducer.goBtnLoading,
        userAccess: state.Login.RoleAccessUpdateData,

        ItemList: state.PartyItemsReducer.partyItem,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));


    // Common Party Dropdown useEffect
    useEffect(async () => {
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        if (commonPartyDropSelect.value > 0) {
            let partyId = commonPartyDropSelect.value;
            goButtonHandler()
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: commonPartyDropSelect.value,
            };
            dispatch(GoButton_ImportExcelPartyMap({ partyId }));
            dispatch(goButtonPartyItemAddPage({ jsonBody }));
            const resp = await ImportMaster_Map_Unit_GoButton_API({ partyId });

            if (resp.StatusCode === 200) {
                setunitMapData(resp.Data)
            }
        }


        return () => {
            dispatch(GoButton_ImportFiledMap_AddSuccess([]));
            dispatch(getPartyListAPISuccess([]));
            dispatch(commonPageFieldSuccess(null));
        }

    }, [commonPartyDropSelect]);

    const location = { ...history.location };
    const hasShowModal = props.hasOwnProperty(mode.editValue);


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath);
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(InvoiceExcelUpload_save_Success({ Status: false }))
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            });
            setselectedFiles([]);
            setPreViewDivShow(false);
            setReadJsonDetail(preDetails);
            setUnitVerify({ Wrong_Unit_Code_Array: [], Not_Verify_Unit: undefined });
            // setAllPartyVerify({ Not_Map_Party_Code_Array: [], Not_Map_Party: undefined });
            setPartyVerify({ Wrong_Party_Code_Array: [], Not_Verify_Party: undefined });
            setItemVerify({ Wrong_Item_Code_Array: [], Not_Verify_Item: undefined });
            setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined });
            setNonCBMItemVerify({ Non_CBM_Item_Array: [], Not_Verify_Non_CBM_Item: undefined });
            setInvoiceWithsameDateVerify({ Invoice_Date: [], Not_Verify_Same_Date: undefined, isFutureDate: false })
            setInvalidFormat({ Invalid_Format_Array: [], Not_Verify_Invalid_Format: undefined });
            setColunmMap({ Not_Map_Column_Array: [], Not_Map_Columnt: undefined })

            document.getElementById("demo1").style.border = "";


        }
        else if (postMsg.Status === true) {
            setselectedFiles([]);
            setPreViewDivShow(false);
            setReadJsonDetail(preDetails);
            setUnitVerify({ Wrong_Unit_Code_Array: [], Not_Verify_Unit: undefined })
            // setAllPartyVerify({ Not_Map_Party_Code_Array: [], Not_Map_Party: undefined })
            setPartyVerify({ Wrong_Party_Code_Array: [], Not_Verify_Party: undefined })
            setItemVerify({ Wrong_Item_Code_Array: [], Not_Verify_Item: undefined })
            setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined })
            setNonCBMItemVerify({ Non_CBM_Item_Array: [], Not_Verify_Non_CBM_Item: undefined })
            setInvoiceWithsameDateVerify({ Invoice_Date: [], Not_Verify_Same_Date: undefined, isFutureDate: false })
            setInvalidFormat({ Invalid_Format_Array: [], Not_Verify_Invalid_Format: undefined });
            setColunmMap({ Not_Map_Column_Array: [], Not_Map_Columnt: undefined })

            document.getElementById("demo1").style.border = "";
            dispatch(InvoiceExcelUpload_save_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        };
    }, [postMsg])


    useEffect(() => {

        let updatereadJsonDetail = {
            fileFiled: readJsonDetail.fileFiled,
            invoice: readJsonDetail.invoice,
            invoiceDate: readJsonDetail.invoiceDate,
            amount: readJsonDetail.amount,
            invoiceNO: readJsonDetail.invoiceNO,
            partyNO: readJsonDetail.partyNO,
            unitCode: readJsonDetail.unitCode,
            itemCode: readJsonDetail.itemCode
        }

        const mapItemValues = ItemList.map(obj => obj.MapItem);
        const mapCustomerValues = PartyMapData.map(obj => obj.MapCustomer);
        /////////////////////////////////////////////////////////// check Ignore Negative Value in excel file /////////////////////////////////

        if (isIgnoreNegativeValue && isIgnoreItem && isIgnoreParty) {

            const conditionFunction = (item) => {

                const itemCodeAsString = item.Item_Code.toString().trim();
                const CustomerCodeAsString = item.Party_Code.toString().trim();
                return !item.shouldRemove && mapItemValues.includes(itemCodeAsString) && mapCustomerValues.includes(CustomerCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);

        } else if (isIgnoreNegativeValue && isIgnoreItem) {
            const conditionFunction = (item) => {
                const itemCodeAsString = item.Item_Code.toString().trim();
                return !item.shouldRemove && mapItemValues.includes(itemCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
        } else if (isIgnoreNegativeValue && isIgnoreParty) {
            const conditionFunction = (item) => {
                const CustomerCodeAsString = item.Party_Code.toString().trim();
                return !item.shouldRemove && mapCustomerValues.includes(CustomerCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
        } else if (isIgnoreItem && isIgnoreParty) {
            const conditionFunction = (item) => {
                const itemCodeAsString = item.Item_Code.toString().trim();
                const CustomerCodeAsString = item.Party_Code.toString().trim();
                return mapItemValues.includes(itemCodeAsString) && mapCustomerValues.includes(CustomerCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
        } else if (isIgnoreNegativeValue) {
            const conditionFunction = (item) => {
                return !item.shouldRemove;
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
            /////////////////////////////////////////////////////////// check Ignore Not Map Item  in excel file /////////////////////////////////
        } else if (isIgnoreItem) {
            const conditionFunction = (item) => {
                const itemCodeAsString = item.Item_Code.toString().trim();
                return mapItemValues.includes(itemCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
            /////////////////////////////////////////////////////////// check Ignore both Not Map Item and Negative Value  in excel file /////////////////////////////////
        } else if (isIgnoreParty) {
            const conditionFunction = (item) => {
                const CustomerCodeAsString = item.Party_Code.toString().trim();
                return mapCustomerValues.includes(CustomerCodeAsString);
            };
            updatereadJsonDetail.invoice = filterArraysInEntries(readJsonDetail.invoice, conditionFunction);
        }

        setUpdateReadJsonDetail(updatereadJsonDetail)

    }, [isIgnoreItem, isIgnoreNegativeValue, readJsonDetail, isIgnoreParty])


    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID(),
            IsFieldType: 1// type 1 is all Invoices fields
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    async function veifyExcelBtn_Handler() {
        setverifyLoading(true);
        if (commonPartyDropSelect.value === 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.requiredPartySelection,
            })
            setverifyLoading(false)
            return
        }

        if (compareParameter.length === 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.waitForDownloadFieldDetails,
            })
            setverifyLoading(false)
            return
        }

        var files = selectedFiles;
        if (files.length == 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.chooseAnyFile,
            })
            setverifyLoading(false)
            return;
        }



        const filename = files[0].name;
        const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        // if ((extension === '.csv') || extension === ".xlsx") {

        if (extension === ".xlsx") {
            const readjson = await readExcelFile({ file: files[0], compareParameter, ItemList })
            
            //////////////////////////////////////// Check  in valid format Value Or Not //////////////////////////////////////////////////////
            if (readjson.NotMapColumn.length > 0) {
                setColunmMap({ Not_Map_Column_Array: readjson.NotMapColumn, Not_Map_Columnt: true });
                setverifyLoading(false);
                return
            } else {
                setColunmMap({ Not_Map_Column_Array: [], Not_Map_Columnt: false })
            }

            //////////////////////////////////////// Check  in valid format Value Or Not //////////////////////////////////////////////////////

            if (readjson.InvalidFormat.length > 0) {
                setInvalidFormat({ Invalid_Format_Array: readjson.InvalidFormat, Not_Verify_Invalid_Format: true })
            } else {
                setInvalidFormat({ Invalid_Format_Array: [], Not_Verify_Invalid_Format: false })
            }

            //////////////////////////////////////// Check  Invoice  Item Contain Negative Value Or Not //////////////////////////////////////////////////////
            const Negative_Value_Item_Array = readjson.filter(i => i.shouldRemove)

            if (Negative_Value_Item_Array.length > 0) {
                setNegativeFigureVerify({ Negative_Figure_Array: Negative_Value_Item_Array, Not_Verify_Negative_Figure: true })
            } else {
                setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: false })
            }
            //////////////////////////////////////check Invoice Item Mapping Code exist in system or not ///////////////////////////////////////

            const mapItemValues = ItemList.map(obj => obj.MapItem);

            const Wrong_Item_Code_Array = readjson.filter(value => {
                const itemCodeAsString = value.Item_Code.toString().trim();
                return !mapItemValues.includes(itemCodeAsString);
            });

            if (Wrong_Item_Code_Array.length > 0) {
                try {
                    const MapItemList = ItemList.filter(obj => obj.MapItem !== null && obj.MapItem !== "");
                    MapItemList.forEach(function (i) {
                        let Item_Code = i.MapItem;
                        let GST = i.GST;
                        let Matching_ItemCode_Objects = readjson.filter(inx => {
                            return (inx.Item_Code).toString().trim() === (Item_Code).toString().trim();
                        });

                        Matching_ItemCode_Objects.forEach(matchingObject => {
                            matchingObject.GST = GST;
                        });

                        if (Matching_ItemCode_Objects) {
                            Matching_ItemCode_Objects.GST = GST;
                        }
                    });
                    setItemVerify({ Wrong_Item_Code_Array: Wrong_Item_Code_Array, Not_Verify_Item: true });
                } catch (error) {

                }
            } else {

                ////////////////////////////////////////////////    GST of Matching Item Code ////////////////////////////////////////////////////////
                try {
                    const MapItemList = ItemList.filter(obj => obj.MapItem !== null && obj.MapItem !== "");
                    MapItemList.forEach(function (i) {
                        let Item_Code = i.MapItem;
                        let GST = i.GST;

                        let Matching_ItemCode_Objects = readjson.filter(inx => {

                            return (inx.Item_Code).toString().trim() === (Item_Code).toString().trim();
                        });

                        Matching_ItemCode_Objects.forEach(matchingObject => {
                            matchingObject.GST = GST;
                        });

                        if (Matching_ItemCode_Objects) {
                            Matching_ItemCode_Objects.GST = GST;
                        }
                    });
                    setItemVerify({ Wrong_Item_Code_Array: [], Not_Verify_Item: false })
                } catch (error) {

                }
            }

            let Not_Ignore_Item_Array = readjson;

            ////////////////////////////////////////////////////  Verifying All Field Mapping with System //////////////////////////////////

            const isdetails = await fileDetails({ compareParameter, Not_Ignore_Item_Array })

            ////////////////////////////////////////////////// Verifying All Uploaded Invoice Is Of Same Date ///////////////////////////////

            const isUploadInvoiceOfSameDate = _cfunc.areAllDatesSame(isdetails.invoiceDate)

            if (!(isUploadInvoiceOfSameDate.allSame) || (isUploadInvoiceOfSameDate.futureDate)) {
                setInvoiceWithsameDateVerify({
                    Not_Verify_Same_Date: true,
                    Invoice_Date: isUploadInvoiceOfSameDate.dates,
                    isFutureDate: isUploadInvoiceOfSameDate.futureDate
                })
            } else {
                setInvoiceWithsameDateVerify({ Not_Verify_Same_Date: false, Invoice_Date: isUploadInvoiceOfSameDate.dates })
            }

            if (PartyMapData.length > 0) {

                /////////////////////////////////////////// Verifiy unit Mapping Code ///////////////////////////////////////////////////////////////

                const unitMap = isdetails.unitCode;
                const arrayOfUnitMapStrings = unitMap.map(String);
                const mapUnitValues = unitMapData.map(obj => obj.MapUnit);

                const Wrong_Unit_Code_Array = arrayOfUnitMapStrings.filter(value => {
                    const unitCodeAsString = value.toString().trim();
                    return !mapUnitValues.includes(unitCodeAsString);
                });

                // const Wrong_Unit_Code_Array = arrayOfUnitMapStrings.filter(value => !mapUnitValues.includes(value));

                if (Wrong_Unit_Code_Array.length > 0) {
                    setUnitVerify({ Wrong_Unit_Code_Array: Wrong_Unit_Code_Array, Not_Verify_Unit: true })
                } else {
                    setUnitVerify({ Wrong_Unit_Code_Array: [], Not_Verify_Unit: false })
                }

                ///////////////////////////////////////////////// Verifiy All Party Mapping  Done or Not ///////////////////////////////////////////////////////////////////////

                const PartyMap = isdetails.partyNO;

                ///////////////////////////////////////////////// Verifiy  Party Mapping code ///////////////////////////////////////////////////////////////////////

                const arrayOfPartyMapStrings = PartyMap.map(String);
                const mapCustomerValues = PartyMapData.map(obj => obj.MapCustomer);


                const Wrong_Party_Code_Array = arrayOfPartyMapStrings.filter(value => {
                    const partyCodeAsString = value.toString().trim();
                    return !mapCustomerValues.includes(partyCodeAsString);
                });

                // const Wrong_Party_Code_Array = arrayOfPartyMapStrings.filter(value => !mapCustomerValues.includes(value));

                if (Wrong_Party_Code_Array.length > 0) {
                    setPartyVerify({ Wrong_Party_Code_Array: Wrong_Party_Code_Array, Not_Verify_Party: true })
                } else {
                    setPartyVerify({ Wrong_Party_Code_Array: [], Not_Verify_Party: false })
                }
            }

            let { invoiceNO } = isdetails;
            if ((invoiceNO.length > 0)) {
                setReadJsonDetail(isdetails)
                setPreViewDivShow(true)
            }
        } else {
            customAlert({
                Type: 3,
                Message: alertMessages.unSupportedFileFormat,
            })
        }
        setverifyLoading(false)
    }

    ////////////////////////////////////////////////////  Verify condition Check If all condition fullfill then only file verified /////////////////////////////

    const isVerify = (
        ((partyVerify.Not_Verify_Party === false) || (isIgnoreParty)) &&
        ((isIgnoreItem) || itemVerify.Not_Verify_Item === false)
        &&
        ((isIgnoreNegativeValue) || (negativeFigureVerify.Not_Verify_Negative_Figure === false))
        &&
        (invoiceWithsameDateVerify.Not_Verify_Same_Date === false) &&
        (unitVerify.Not_Verify_Unit === false) && (colunmMap.Not_Map_Columnt === false)
    );


    async function handleAcceptedFiles(files) {
        if (compareParameter.length === 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.waitForDownloadFieldDetails,
            })
            return
        }

        if (selectedFiles.length > 0) {
            const isConfirmed = await customAlert({
                Type: 8,
                Message: alertMessages.doYouConfirmChoice,
            });
            if (!isConfirmed) {
                return
            }
        };

        //////////////////////////////////////////////////////////// New File is Selected then privious verified details clear//////////////////////////////    

        setReadJsonDetail(preDetails)
        setPreViewDivShow(false)
        setUnitVerify({ Wrong_Unit_Code_Array: [], Not_Verify_Unit: undefined })
        setPartyVerify({ Wrong_Party_Code_Array: [], Not_Verify_Party: undefined })
        setItemVerify({ Wrong_Item_Code_Array: [], Not_Verify_Item: undefined })
        setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined })
        setNonCBMItemVerify({ Non_CBM_Item_Array: [], Not_Verify_Non_CBM_Item: undefined })
        setInvoiceWithsameDateVerify({ Invoice_Date: [], Not_Verify_Same_Date: undefined, isFutureDate: false })
        setInvalidFormat({ Invalid_Format_Array: [], Not_Verify_Invalid_Format: undefined });
        setColunmMap({ Not_Map_Column_Array: [], Not_Map_Columnt: undefined })


        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }


    const uploadSaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            _cfunc.btnIsDissablefunc({ btnId, state: true })
            const parArr = updatereadJsonDetail.fileFiled
            const outerArr = []

            compareParameter.forEach(ele => {
                if ((ele.Value !== null)) {
                    parArr[ele.FieldName] = ele.Value
                }
            })

            updatereadJsonDetail.invoice.forEach(async (inv) => {

                let parentObj;
                let invoiceItems = []
                let invoiceTotalAmount = 0

                inv.forEach(async (ele) => {

                    const calculate = InvoiceUploadCalculation({ Quantity: ele[parArr.Quantity], Rate: ele[parArr.Rate], GST: ele.GST, Discount: ele[parArr.Discount], DiscountType: ele[parArr.DiscountType] });
                    invoiceTotalAmount = invoiceTotalAmount + calculate.Amount;

                    parentObj = {
                        "ImportFromExcel": 1,
                        "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                        "TCSAmount": ele[parArr.TCSAmount] ? ele[parArr.TCSAmount] : 0,
                        "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : invoiceTotalAmount.toFixed(2),
                        "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : 0,
                        "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "FullInvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "Customer": ele[parArr.Customer] ? ele[parArr.Customer].toString().trim() : '',
                        "Party": _cfunc.loginSelectedPartyID(),
                        CreatedBy: _cfunc.loginUserID(),
                        UpdatedBy: _cfunc.loginUserID(),
                        "InvoiceDate": ele[parArr.InvoiceDate] ? ele[parArr.InvoiceDate] : '',
                    }


                    invoiceItems.push({
                        "Item": ele[parArr.Item] ? ele[parArr.Item].toString().trim() : '',
                        "Unit": ele[parArr.Unit] ? ele[parArr.Unit].toString().trim() : '',
                        "Quantity": ele[parArr.Quantity] ? ele[parArr.Quantity] : 0,
                        "BatchDate": ele[parArr.BatchDate] ? ele[parArr.BatchDate] : null,
                        "BatchCode": ele[parArr.BatchCode] ? ele[parArr.BatchCode] : 0,
                        "BaseUnitQuantity": ele[parArr.BaseUnitQuantity] ? ele[parArr.BaseUnitQuantity] : '',
                        "LiveBatch": ele[parArr.LiveBatch] ? ele[parArr.LiveBatch] : '',
                        "MRPValue": ele[parArr.MRP] ? ele[parArr.MRP] : '', //Actul MRP That Map in System
                        "Rate": ele[parArr.Rate] ? ele[parArr.Rate]?.toFixed(2) : '',
                        "BasicAmount": ele[parArr.BasicAmount] ? ele[parArr.BasicAmount] : (calculate.BasicAmount).toFixed(2),
                        "GSTAmount": ele[parArr.GSTAmount] ? ele[parArr.GSTAmount] : (calculate.GSTAmount).toFixed(2),
                        "GST": '',
                        "CGST": ele[parArr.CGST] ? ele[parArr.CGST] : (calculate.GSTAmount / 2).toFixed(2),
                        "SGST": ele[parArr.SGST] ? ele[parArr.SGST] : (calculate.GSTAmount / 2).toFixed(2),
                        "IGST": ele[parArr.IGST] ? ele[parArr.IGST] : 0,
                        "GSTPercentage": ele[parArr.GSTPercentage] ? ele[parArr.GSTPercentage] : calculate.GSTPersentage,
                        "CGSTPercentage": ele[parArr.CGSTPercentage] ? ele[parArr.CGSTPercentage] : (calculate.GSTPersentage / 2).toFixed(2),
                        "SGSTPercentage": ele[parArr.SGSTPercentage] ? ele[parArr.SGSTPercentage] : (calculate.GSTPersentage / 2).toFixed(2),
                        "IGSTPercentage": ele[parArr.IGSTPercentage] ? ele[parArr.IGSTPercentage] : 0,
                        "Amount": ele[parArr.Amount] ? ele[parArr.Amount] : (calculate.Amount).toFixed(2),
                        "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : 2,
                        "Discount": ele[parArr.Discount] ? ele[parArr.Discount]?.toFixed(2) : 0,
                        "DiscountAmount": ele[parArr.DiscountAmount] ? ele[parArr.DiscountAmount] : (calculate.DiscountAmount).toFixed(2),

                        "TaxType": "GST",
                        "QtyInBox": ele[parArr.QtyInBox] ? ele[parArr.QtyInBox] : 0,
                        "QtyInKg": ele[parArr.QtyInKg] ? ele[parArr.QtyInKg] : 0,
                        "QtyInNo": ele[parArr.QtyInNo] ? ele[parArr.QtyInNo] : 0,
                    })

                })

                outerArr.push({ ...parentObj, InvoiceItems: invoiceItems })
            });

            const jsonBody = JSON.stringify({ "BulkData": outerArr })
            dispatch(InvoiceExcelUpload_save_action({ jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={((partyDropDownLoading) || compareParamLoading)} />

                <div className="page-content">
                    <div className="px-2 c_card_header text-black mt-2" >
                        {(compareParamLoading) ?
                            <div className="row ">
                                <div className="d-flex justify-content-start p-2 ">
                                    <div>Please wait Downloading field Details. other wise check filed mapping </div>
                                    <div >
                                        <div className="dot-pulse">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            compareParameter.length > 0 ? < Row >
                                <Col sm={10}>
                                    <h4 className="pt-4 pb-4 text-primary" >{"Upload Your Excel."}</h4>
                                </Col>
                                <Col sm={2} className="mt-4">
                                    <span className="mt-2 text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => downloadDummyFormatHandler(compareParameter)}
                                    >
                                        Download Format
                                    </span>
                                </Col>

                            </Row> : null
                        }

                    </div>

                    <div className="mb-3 mt-3">
                        <Dropzone
                            onDrop={acceptedFiles => {
                                document.getElementById("demo1").style.border = "4px dotted green";
                                handleAcceptedFiles(acceptedFiles)
                            }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div id='demo1' className="dropzone">
                                    <div
                                        className="dz-message needsclick mt-2"
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="mb-3">
                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                        </div>
                                        <h4>Drop files here or click to upload.</h4>
                                    </div>
                                </div>
                            )}
                        </Dropzone>

                        <div className="dropzone-previews mt-3" id="file-previews">
                            {selectedFiles.map((f, i) => {
                                return (
                                    <Card
                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                        key={i + "-file"}
                                    >
                                        <div className="p-2 d-flex justify-containt-space-between">

                                            <Row className="align-items-center">
                                                <Col className="col-auto">
                                                    <img
                                                        data-dz-thumbnail=""
                                                        height="80"
                                                        className="avatar-sm rounded bg-light"
                                                        alt={f.name}
                                                        src={f.preview}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to="#"
                                                        className="text-muted font-weight-bold"
                                                    >
                                                        {f.name}
                                                    </Link>
                                                    <p className="mb-0">
                                                        <strong>{f.formattedSize}</strong>
                                                    </p>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Card>
                                )
                            })}

                            <div id="filedetail">
                                {preViewDivShow ? <Card >

                                    <details>
                                        <summary>&nbsp; &nbsp;  No. of Invoice: {updatereadJsonDetail.invoice.size}</summary>
                                        <div className="error-msg">
                                            <p>
                                                {updatereadJsonDetail.invoiceNO.map(i => (<Label>{i} ,&#160;</Label>))}
                                            </p>
                                        </div>

                                    </details>

                                    <details>
                                        <summary>&nbsp; &nbsp;  No. of Party :{updatereadJsonDetail.partyNO.length}</summary>
                                        <div className="error-msg">
                                            <p>
                                                {updatereadJsonDetail.partyNO.map(i => (<Label>{i} ,&#160;</Label>))}
                                            </p>
                                        </div>
                                    </details>

                                </Card > : null
                                }


                                {colunmMap.Not_Map_Columnt !== undefined ? <details>
                                    <summary>&nbsp; &nbsp; Column Mapping&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{colunmMap.Not_Map_Columnt === true ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    {colunmMap.Not_Map_Columnt === false ? null : <div className="error-msg">
                                        <p>
                                            <span style={{ fontWeight: "bold", fontSize: "15px" }} >Column Mapping:&nbsp;&nbsp;</span>
                                            {colunmMap.Not_Map_Column_Array.map((i, index) => (
                                                <span key={index}>
                                                    <span key={index}>
                                                        <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span> {` ${i}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </span>
                                                </span>
                                            ))}
                                        </p>
                                    </div>}
                                </details> : null}



                                {invalidFormat.Not_Verify_Invalid_Format !== undefined ? <details>
                                    <summary>&nbsp; &nbsp; Invalid Format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{invalidFormat.Not_Verify_Invalid_Format === true ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    {invalidFormat.Not_Verify_Invalid_Format === false ? null : <div className="error-msg">
                                        <p>
                                            <span style={{ fontWeight: "bold", fontSize: "15px" }} >Invalid Format:&nbsp;&nbsp;</span>
                                            {invalidFormat.Invalid_Format_Array.map((i, index) => (
                                                <span key={index}>
                                                    <span key={index}>
                                                        <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span>    {` ${i}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </span>
                                                </span>
                                            ))}
                                        </p>
                                    </div>}
                                </details> : null}



                                {partyVerify.Not_Verify_Party !== undefined ? <details>
                                    {partyVerify.Not_Verify_Party === false ? null : <Row className="mt-2 error-msg" style={{ margin: "unset", backgroundColor: "#c1cfed" }}>
                                        <Col sm={3} style={{ fontWeight: "bold", fontSize: "15px", paddingLeft: "unset" }} className="col-xl-auto">Ignore this Party </Col>
                                        <Col >
                                            <div className="form-check form-switch form-switch-md " style={{ marginTop: "-3px" }}>
                                                <Input type="checkbox" className="form-check-input"
                                                    name="itemVerify"
                                                    onChange={(e) => { setisIgnoreParty(e.target.checked) }}

                                                />
                                            </div>
                                        </Col>
                                    </Row>}
                                    <summary>&nbsp; &nbsp; Party mapping&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{((partyVerify.Not_Verify_Party === true) && (!isIgnoreParty)) ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    {partyVerify.Not_Verify_Party === false ? null : <div className="error-msg">
                                        <p>
                                            <span style={{ fontWeight: "bold", fontSize: "15px" }} >Party mapping code not exist:&nbsp;&nbsp;</span>
                                            {partyVerify.Wrong_Party_Code_Array.map((i, index) => (
                                                <span key={index}>
                                                    <span key={index}>
                                                        <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span>    {` ${i}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </span>
                                                </span>
                                            ))}
                                        </p>
                                    </div>}
                                </details> : null}

                                {itemVerify.Not_Verify_Item !== undefined ? <details>
                                    {itemVerify.Not_Verify_Item === false ? null : <Row className="mt-2 error-msg" style={{ margin: "unset", backgroundColor: "#c1cfed" }}>
                                        <Col sm={3} style={{ fontWeight: "bold", fontSize: "15px", paddingLeft: "unset" }} className="col-xl-auto">Ignore this Item </Col>
                                        <Col >
                                            <div className="form-check form-switch form-switch-md " style={{ marginTop: "-3px" }}>
                                                <Input type="checkbox" className="form-check-input"
                                                    name="itemVerify"
                                                    onChange={(e) => { setisIgnoreItem(e.target.checked) }}

                                                />
                                            </div>
                                        </Col>
                                    </Row>}
                                    <summary>&nbsp; &nbsp; Item mapping   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{((itemVerify.Not_Verify_Item === true) && (!isIgnoreItem)) ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    {itemVerify.Not_Verify_Item === false ? null : <div className="error-msg mt-0" >
                                        <p>
                                            <span style={{ fontWeight: "bold", fontSize: "15px" }} >Item mapping code not exist:&nbsp;&nbsp;</span>
                                            {itemVerify.Wrong_Item_Code_Array?.map((i, index) => (
                                                <span key={index}>
                                                    <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span>    {` ${i.Item_Code}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                </span>
                                            ))}
                                        </p>
                                    </div>}
                                </details> : null}
                                {unitVerify.Not_Verify_Unit !== undefined ? <details>
                                    <summary>&nbsp; &nbsp; Unit mapping   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{unitVerify.Not_Verify_Unit === true ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    {unitVerify.Not_Verify_Unit === false ? null : <div className="error-msg">
                                        <p>
                                            <span style={{ fontWeight: "bold", fontSize: "14px" }} >Unit mapping code not exist:&nbsp;&nbsp;</span>
                                            {unitVerify.Wrong_Unit_Code_Array?.map((i, index) => (
                                                <span key={index}>
                                                    <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span>    {` ${i}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                </span>
                                            ))}
                                        </p>
                                    </div>}
                                </details> : null}

                                {negativeFigureVerify.Not_Verify_Negative_Figure !== undefined ?

                                    <details>
                                        {negativeFigureVerify.Not_Verify_Negative_Figure === false ? null : <Row className="mt-2 error-msg" style={{ margin: "unset", backgroundColor: "#c1cfed" }}>
                                            <Col sm={3} style={{ fontWeight: "bold", fontSize: "15px", paddingLeft: "unset" }} className="col-xl-auto">&nbsp;&nbsp;Ignore Item Contain Negative or zero Value</Col>
                                            <Col   >
                                                <div className="form-check form-switch form-switch-md " style={{ marginTop: "-3px" }}>
                                                    <Input type="checkbox" className="form-check-input"
                                                        name="Ignore Negative value Item"
                                                        onChange={(e) => { setisIgnoreNegativeValue(e.target.checked) }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>}

                                        <summary>&nbsp; &nbsp; Contain negative and zero figure   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;{((negativeFigureVerify.Not_Verify_Negative_Figure === true) && (!isIgnoreNegativeValue)) ?
                                                <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                                <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                        {negativeFigureVerify.Not_Verify_Negative_Figure === false ? null : <div className="error-msg mt-0">
                                            <p>
                                                <span style={{ fontWeight: "bold", fontSize: "14px" }} > Invoice Contains Negative Value:&nbsp;&nbsp;</span>
                                                {negativeFigureVerify.Negative_Figure_Array?.map((i, index) => (
                                                    <span key={index}>
                                                        <span style={{ fontWeight: "bold" }}>{`${index + 1})`}</span>    {` ${i.Invoice_No}`}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </span>
                                                ))}
                                            </p>
                                        </div>}
                                    </details> : null}

                                {nonCBMItemVerify.Not_Verify_Non_CBM_Item !== undefined ? <details>
                                    <summary>&nbsp; &nbsp;Non CBM Item  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nonCBMItemVerify.Not_Verify_Non_CBM_Item === true ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    <div className="error-msg">
                                        <p>
                                            {updatereadJsonDetail.partyNO.map(i => (<Label>{i} ,&#160;</Label>))}
                                        </p>
                                    </div>
                                </details> : null}

                                {invoiceWithsameDateVerify.Not_Verify_Same_Date !== undefined ? <details>

                                    {((invoiceWithsameDateVerify.isFutureDate) || (invoiceWithsameDateVerify.Not_Verify_Same_Date)) ? <Row className="mt-2 error-msg" style={{ margin: "unset", backgroundColor: "#c1cfed" }}> <Col style={{ fontWeight: "bold", fontSize: "15px", paddingLeft: "unset" }}>
                                        Note:{invoiceWithsameDateVerify.isFutureDate ? <div>
                                            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;{"Future date invoice are not allow to upload."}

                                        </div> : null}
                                        &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; {invoiceWithsameDateVerify.Not_Verify_Same_Date ? "Different Date invoices are not allow to upload." : null}

                                    </Col>   </Row> : null}
                                    <summary>&nbsp; &nbsp;Invoices  date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{invoiceWithsameDateVerify.Not_Verify_Same_Date === true ?
                                            <i style={{ color: "tomato", }} className="mdi mdi-close-circle font-size-18  "></i> :
                                            <i style={{ color: "green", }} className="mdi mdi-check-decagram  font-size-18  "></i>}</summary>
                                    <div className="error-msg">
                                        <p>
                                            Uploaded Invoice Date :   {invoiceWithsameDateVerify.Invoice_Date.map(i => (<Label>{i} ,&#160;</Label>))}
                                        </p>
                                    </div>
                                </details> : null}
                            </div>
                        </div>
                    </div>


                    <div className="text- mt-4" >
                        {isVerify ?

                            <Verifiy_Button
                                type="button"
                                id='btn-uploadBtnFunc'
                                spinnerColor={"white"}
                                className="btn btn-success"
                                loading={saveBtnLoading}
                                onClick={uploadSaveHandler}
                            >
                                Upload Files
                            </Verifiy_Button>
                            :
                            <Verifiy_Button
                                type="button"
                                id='btn-verify'
                                spinnerColor={"white"}
                                loading={verifyLoading}
                                className="btn btn-primary"
                                onClick={veifyExcelBtn_Handler}
                            >
                                Verify Files
                            </Verifiy_Button>

                        }
                    </div>

                </div>


            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default InvoiceExcelUpload







