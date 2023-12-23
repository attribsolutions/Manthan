import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess, goButtonPartyItemAddPage, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as mode from "../../../../routes/PageMode";
import * as _cfunc from "../../../../components/Common/CommonFunction";

import { getPartyListAPI, getPartyListAPISuccess } from "../../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"
import { dounloadDummyFormat_handler, downloadDummyFormatHandler, fileDetails, readExcelFile } from "./readFile";
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
import { C_Button, Go_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import { C_Select } from "../../../../CustomValidateForm";
import NewCommonPartyDropdown from "../../../../components/Common/NewCommonPartyDropdown";
import { async } from "q";
import { ImportMaster_Map_Unit_GoButton_API } from "../../../../helpers/backend_helper";


const InvoiceExcelUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: [], amount: 0, invoiceNO: [], partyNO: [] }

    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([])
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails)
    const [preViewDivShow, setPreViewDivShow] = useState(false)
    const [verifyLoading, setverifyLoading] = useState(false)

    const [unitMapData, setunitMapData] = useState([])






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

        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
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
            dispatch(GoButton_ImportExcelPartyMap({ partyId }))
            dispatch(goButtonPartyItemAddPage({ jsonBody }));
            dispatch(GoButton_ImportExcelPartyMap({ partyId, mapType: 3 }))
            const resp = await ImportMaster_Map_Unit_GoButton_API({ partyId })

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

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)


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
        }
        else if (postMsg.Status === true) {
            dispatch(InvoiceExcelUpload_save_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        };
    }, [postMsg])



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
                Message: "Please Select Party",
            })
            setverifyLoading(false)
            return
        }

        if (compareParameter.length === 0) {
            customAlert({
                Type: 3,
                Message: "Please wait Downloading field Details.",
            })
            setverifyLoading(false)
            return
        }

        var files = selectedFiles;
        if (files.length == 0) {
            customAlert({
                Type: 3,
                Message: "Please choose any file...",
            })
            setverifyLoading(false)
            return;
        }



        const filename = files[0].name;
        const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        if ((extension === '.csv') || extension === ".xlsx") {
            const readjson = await readExcelFile({ file: files[0], compareParameter, })

            let Invalid_Invoice = [];
            readjson.filter(i => i.shouldRemove).forEach(i => {
                Invalid_Invoice.push({ [i.Invoice_No]: ' contains zero or negative values' })
            });
            if (Invalid_Invoice.length > 0) {
                Invalid_Invoice.push({ [""]: 'Proceed to ignore this invoice?' })

            }

            let isConfirmed = true
            if (Invalid_Invoice.length > 0) {
                isConfirmed = await customAlert({
                    Type: 7,
                    Message: Invalid_Invoice,
                });
            }

            if (isConfirmed) {
                const filteredReadjson = readjson.filter(i => !i.shouldRemove);

                if (readjson.length > 0) {

                    const isdetails = await fileDetails({ compareParameter, filteredReadjson })


                    const isUploadInvoiceOfSameDate = _cfunc.areAllDatesSame(isdetails.invoiceDate)
                    if (!isUploadInvoiceOfSameDate) {
                        customAlert({
                            Type: 3,
                            Message: "Please upload only the invoices with the same date"

                        })
                        setverifyLoading(false)
                        return
                    }

                    if (PartyMapData.length > 0) {
                        const PartyMap = isdetails.partyNO;
                        const itemMap = isdetails.itemCode;
                        const unitMap = isdetails.unitCode;
                        const NotMapCustomers = []
                        ///////////////////////////////////////////////// Wrong unit Code///////////////////////////////////////////////////////////////////////

                        const filteredUnitArray = unitMapData.filter(i => i.MapUnit === null || i.MapUnit === '');
                        filteredUnitArray.forEach(i => {

                            NotMapCustomers.push({ [i.Name]: 'Unit is Not Map' })
                        });

                        if (filteredUnitArray.length > 0) {
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }

                        const arrayOfUnitMapStrings = unitMap.map(String);
                        const mapUnitValues = unitMapData.map(obj => obj.MapUnit);
                        const notPresentUnitValues = arrayOfUnitMapStrings.filter(value => !mapUnitValues.includes(value));
                        if (notPresentUnitValues.length > 0) {
                            notPresentUnitValues.forEach(i => {
                                NotMapCustomers.push({ [i === "undefined" ? "" : i]: `${i === "undefined" ? "Unit Code is missing" : "Wrong Unit Code"}` })
                            });
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }

                        ///////////////////////////////////////////////// Wrong Item Code///////////////////////////////////////////////////////////////////////

                        const filteredItemArray = ItemList.filter(i => i.MapItem === null || i.MapItem === '');
                        filteredItemArray.forEach(i => {

                            NotMapCustomers.push({ [i.ItemName]: 'Item is Not Map' })
                        });

                        if (filteredItemArray.length > 0) {
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }

                        const arrayOfItemMapStrings = itemMap.map(String);
                        const mapItemValues = ItemList.map(obj => obj.MapItem);
                        const notPresentItemValues = arrayOfItemMapStrings.filter(value => !mapItemValues.includes(value));
                        if (notPresentItemValues.length > 0) {
                            notPresentItemValues.forEach(i => {
                                NotMapCustomers.push({ [i === "undefined" ? "" : i]: `${i === "undefined" ? "Item Code is missing" : "Wrong Item Code"}` })
                            });
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }

                        ///////////////////////////////////////////////// Wrong Party Code///////////////////////////////////////////////////////////////////////

                        const filteredArray = PartyMapData.filter(i => i.MapCustomer === null || i.MapCustomer === '');

                        filteredArray.forEach(i => {
                            NotMapCustomers.push({ [i.CustomerName]: 'Party is Not Map' })
                        });

                        if (NotMapCustomers.length > 0) {
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }

                        const arrayOfPartyMapStrings = PartyMap.map(String);
                        const mapCustomerValues = PartyMapData.map(obj => obj.MapCustomer);
                        const notPresentPartyValues = arrayOfPartyMapStrings.filter(value => !mapCustomerValues.includes(value));
                        if (notPresentPartyValues.length > 0) {
                            notPresentPartyValues.forEach(i => {
                                NotMapCustomers.push({ [i === "undefined" ? "" : i]: `${i === "undefined" ? "Party Code is missing" : "Wrong Party Code"}` })
                            });
                            customAlert({
                                Type: 3,
                                Message: NotMapCustomers
                            })
                            setverifyLoading(false)
                            return;
                        }
                    }


                    let { invoiceNO } = isdetails;
                    if ((invoiceNO.length > 0)) {
                        setReadJsonDetail(isdetails)
                        setPreViewDivShow(true)
                    }
                }
            }

        } else {
            customAlert({
                Type: 3,
                Message: 'Unsupported file format. Please select an Excel (XLSX) or CSV file.',
            })
        }
        setverifyLoading(false)
    }


    async function handleAcceptedFiles(files) {
        if (compareParameter.length === 0) {
            customAlert({
                Type: 3,
                Message: "Please wait Downloading field Details.",
            })
            return
        }

        if (selectedFiles.length > 0) {
            const isConfirmed = await customAlert({
                Type: 8,
                Message: "Do you confirm your choice?",
            });
            if (!isConfirmed) {

                return
            }
        };

        setReadJsonDetail(preDetails)
        setPreViewDivShow(false)

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
            const parArr = readJsonDetail.fileFiled
            const outerArr = []

            compareParameter.forEach(ele => {
                if ((ele.Value !== null)) {
                    parArr[ele.FieldName] = ele.Value
                }
            })

            readJsonDetail.invoice.forEach(async (inv) => {
                let parentObj;
                let invoiceItems = []
                const invoiceTotalAmount = inv.reduce((total, invoice) => total + Number(invoice[parArr.Amount]), 0);


                inv.forEach(async (ele) => {

                    parentObj = {
                        "ImportFromExcel": 1,
                        "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                        "TCSAmount": ele[parArr.TCSAmount] ? ele[parArr.TCSAmount] : 0,
                        "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : invoiceTotalAmount.toFixed(2),
                        "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : 0,
                        "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "FullInvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "Customer": ele[parArr.Customer] ? ele[parArr.Customer] : '',
                        "Party": _cfunc.loginSelectedPartyID(),
                        CreatedBy: _cfunc.loginUserID(),
                        UpdatedBy: _cfunc.loginUserID(),
                        "InvoiceDate": ele[parArr.InvoiceDate] ? ele[parArr.InvoiceDate] : '',
                    }

                    invoiceItems.push({
                        "Item": ele[parArr.Item] ? ele[parArr.Item] : '',
                        "Unit": ele[parArr.Unit] ? ele[parArr.Unit] : '',
                        "Quantity": ele[parArr.Quantity] ? ele[parArr.Quantity] : 0,
                        "BatchDate": ele[parArr.BatchDate] ? ele[parArr.BatchDate] : null,
                        "BatchCode": ele[parArr.BatchCode] ? ele[parArr.BatchCode] : 0,
                        "BaseUnitQuantity": ele[parArr.BaseUnitQuantity] ? ele[parArr.BaseUnitQuantity] : '',
                        "LiveBatch": ele[parArr.LiveBatch] ? ele[parArr.LiveBatch] : '',
                        "MRP": ele[parArr.MRP] ? ele[parArr.MRP] : '',
                        "MRPValue": ele[parArr.MRPValue] ? ele[parArr.MRPValue] : '',
                        "Rate": ele[parArr.Rate] ? ele[parArr.Rate] : '',
                        "BasicAmount": ele[parArr.BasicAmount] ? ele[parArr.BasicAmount] : '',
                        "GSTAmount": ele[parArr.GSTAmount] ? ele[parArr.GSTAmount] : '',
                        "GST": '',
                        "GSTValue": ele[parArr.GSTValue] ? ele[parArr.GSTValue] : 0,       ///  Note ** GSTValue ===GST percentage
                        "CGST": ele[parArr.CGST] ? ele[parArr.CGST] : (ele[parArr.GSTAmount] / 2).toFixed(2),
                        "SGST": ele[parArr.SGST] ? ele[parArr.SGST] : (ele[parArr.GSTAmount] / 2).toFixed(2),
                        "IGST": ele[parArr.IGST] ? ele[parArr.IGST] : 0,
                        "GSTPercentage": ele[parArr.GSTPercentage] ? ele[parArr.GSTPercentage] : 0,
                        "CGSTPercentage": ele[parArr.CGSTPercentage] ? ele[parArr.CGSTPercentage] : (ele[parArr.GSTPercentage] / 2).toFixed(2),
                        "SGSTPercentage": ele[parArr.SGSTPercentage] ? ele[parArr.SGSTPercentage] : (ele[parArr.GSTPercentage] / 2).toFixed(2),
                        "IGSTPercentage": ele[parArr.IGSTPercentage] ? ele[parArr.IGSTPercentage] : 0,
                        "Amount": ele[parArr.Amount] ? ele[parArr.Amount] : 0,
                        "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : 2,
                        "Discount": ele[parArr.Discount] ? ele[parArr.Discount] : 0,
                        "DiscountAmount": ele[parArr.DiscountAmount] ? ele[parArr.DiscountAmount] : 0,

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

                    <NewCommonPartyDropdown />

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
                            {preViewDivShow &&
                                <Card style={{ borderTop: "0px" }}>
                                    <div id="filedetail">

                                        <details>
                                            <summary>No. of Invoice: {readJsonDetail.invoice.size}</summary>
                                            <div className="error-msg">
                                                <p>
                                                    {readJsonDetail.invoiceNO.map(i => (<Label>{i} ,&#160;</Label>))}
                                                </p>
                                            </div>

                                        </details>

                                        <details>
                                            <summary>No. of Party :{readJsonDetail.partyNO.length}</summary>
                                            <div className="error-msg">
                                                <p>
                                                    {readJsonDetail.partyNO.map(i => (<Label>{i} ,&#160;</Label>))}
                                                </p>
                                            </div>
                                        </details>

                                        <details>
                                            <summary>No. of Dates :{readJsonDetail.invoiceDate.length}</summary>
                                            <div className="error-msg">
                                                <p>
                                                    {readJsonDetail.invoiceDate.map(i => (<Label>{i} ,&#160;</Label>))}
                                                </p>
                                            </div>
                                        </details>

                                        <details>
                                            <summary>Total Amount :{readJsonDetail.amount}</summary>
                                        </details>

                                    </div>
                                </Card>
                            }
                        </div>


                    </div>

                    <div className="text- mt-4" >
                        {preViewDivShow ?

                            <C_Button
                                type="button"
                                id='btn-uploadBtnFunc'
                                spinnerColor={"white"}
                                className="btn btn-success"
                                loading={saveBtnLoading}
                                onClick={uploadSaveHandler}
                            >
                                Upload Files
                            </C_Button>
                            :
                            <C_Button
                                type="button"
                                id='btn-verify'
                                spinnerColor={"white"}
                                loading={verifyLoading}
                                className="btn btn-primary"
                                onClick={veifyExcelBtn_Handler}
                            >
                                Verify Files
                            </C_Button>

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






