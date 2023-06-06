import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
} from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"
import { fileDetails, readExcelFile } from "./readFile";
import {
    GoButton_ImportFiledMap_Add,
    GoButton_ImportFiledMap_AddSuccess
} from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import {
    ExcelUpload_save_action,
    ExcelUpload_save_action_Success
} from "../../../../store/Administrator/ImportMasterMapRedux/action";
import './scss.scss'


const InvoiceExcelUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: '', amount: 0, invoiceNO: [], partyNO: [] }
    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([])
    const [preUploadjson, setPreUploadjson] = useState([])
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails)
    const [preViewDivShow, setPreViewDivShow] = useState(false)
    const [partySelect, SetPartySelect] = useState([])


    const {
        postMsg,
        pageField,
        userAccess,
        partyList,
        compareParameter = []
    } = useSelector((state) => ({
        postMsg: state.ImportMasterMap_Reducer.excelPostMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        partyList: state.PartyMasterReducer.partyList,
        compareParameter: state.ImportExportFieldMap_Reducer.addGoButton,
    }));

    useEffect(() => {
        const page_Id = pageId.INVOICE_EXCEL_UPLOAD
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        if ((_cfunc.loginIsSCMCompany() === 1)) {
            goButtonHandler()
        }
        return () => {
            dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
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

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(ExcelUpload_save_action_Success({ Status: false }))
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(ExcelUpload_save_action_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])

    const PartyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));


    function goButtonHandler(e) {
        let partyId = ((_cfunc.loginIsSCMCompany() === 1)) ? _cfunc.loginPartyID() : e.value;
        const jsonBody = JSON.stringify({
            PartyID: partyId,
            CompanyID: _cfunc.loginCompanyID()
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    async function uploadBtnFunc() {

        if (compareParameter.length === 0) {
            customAlert({
                Type: 3,
                Message: "Please wait Downloading field Details.",
            })
            return
        }

        var files = selectedFiles;
        if (files.length == 0) {
            customAlert({
                Type: 3,
                Message: "Please choose any file...",
            })
            return;
        }

        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX' || extension == '.CSV') {


            const readjson = await readExcelFile({ file: files[0], compareParameter, })
            if (readjson.length > 0) {

                const isdetails = await fileDetails({ compareParameter, readjson })
                let { invoiceNO } = isdetails;
                if ((invoiceNO.length > 0)) {
                    setReadJsonDetail(isdetails)
                    setPreUploadjson(readjson)
                    setPreViewDivShow(true)
                } else {
                    customAlert({
                        Type: 3,
                        Message: "Mapping not match."
                    })
                }
                // const btnerify = document.getElementById("btn-verify");
                // const btnupload = document.getElementById('btn-uploadBtnFunc');
                // const filedetail = document.getElementById('filedetail');

                // btnerify.style.display = "none"
                // btnupload.style.display = "block"
            }

        } else {
            customAlert({
                Type: 3,
                Message: "Please select a valid excel file.",
            })
        }
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
        setPreUploadjson([])
        setPreViewDivShow(false)
        // try {
        //     const btnerify = document.getElementById("btn-verify")
        //     const btnupload = document.getElementById('btn-uploadBtnFunc')
        //     const progDiv = document.getElementById("file-proccess")

        //     btnerify.style.display = "block"
        //     btnupload.style.display = "none"
        //     progDiv.style.display = "none"
        // } catch (d) { }

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


    const SaveHandler = async (event) => {

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

            readJsonDetail.invoice.forEach(inv => {
                let parentObj;
                let invoiceItems = []
                inv.forEach(ele => {
                    parentObj = {
                        "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                        "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : '',
                        "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : 0,
                        "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "FullInvoiceNumber": ele[parArr.FullInvoiceNumber] ? ele[parArr.FullInvoiceNumber] : '',
                        "Customer": ele[parArr.Customer] ? ele[parArr.Customer] : '',
                        "Party": _cfunc.loginPartyID(),
                        CreatedBy: _cfunc.loginUserID(),
                        UpdatedBy: _cfunc.loginUserID(),
                        "InvoiceDate": ele[parArr.InvoiceDate] ? ele[parArr.InvoiceDate] : '',
                    }

                    invoiceItems.push({
                        "Item": ele[parArr.Item] ? ele[parArr.Item] : '',
                        "Unit": ele[parArr.Unit] ? ele[parArr.Unit] : '',
                        "BatchCode": ele[parArr.BatchCode] ? ele[parArr.BatchCode] : '',
                        "Quantity": ele[parArr.Quantity] ? ele[parArr.Quantity] : 0,
                        "BatchDate": ele[parArr.BatchDate] ? ele[parArr.BatchDate] : '',
                        "BaseUnitQuantity": ele[parArr.BaseUnitQuantity] ? ele[parArr.BaseUnitQuantity] : '',
                        "LiveBatch": ele[parArr.LiveBatch] ? ele[parArr.LiveBatch] : '',
                        "MRP": ele[parArr.MRP] ? ele[parArr.MRP] : '',
                        "MRPValue": ele[parArr.MRPValue] ? ele[parArr.MRPValue] : '',
                        "Rate": ele[parArr.Rate] ? ele[parArr.Rate] : '',
                        "BasicAmount": ele[parArr.BasicAmount] ? ele[parArr.BasicAmount] : '',
                        "GSTAmount": ele[parArr.GSTAmount] ? ele[parArr.GSTAmount] : '',
                        "GST": ele[parArr.GST] ? ele[parArr.GST] : '',
                        "GSTValue": ele[parArr.GSTValue] ? ele[parArr.GSTValue] : 0,
                        "CGST": ele[parArr.CGST] ? ele[parArr.CGST] : 0,
                        "SGST": ele[parArr.SGST] ? ele[parArr.SGST] : 0,
                        "IGST": ele[parArr.IGST] ? ele[parArr.IGST] : 0,
                        "GSTPercentage": ele[parArr.GSTPercentage] ? ele[parArr.GSTPercentage] : 0,
                        "CGSTPercentage": ele[parArr.CGSTPercentage] ? ele[parArr.CGSTPercentage] : 0,
                        "SGSTPercentage": ele[parArr.SGSTPercentage] ? ele[parArr.SGSTPercentage] : 0,
                        "IGSTPercentage": ele[parArr.IGSTPercentage] ? ele[parArr.IGSTPercentage] : 0,
                        "Amount": ele[parArr.Amount] ? ele[parArr.Amount] : 0,
                        "TaxType": ele[parArr.TaxType] ? ele[parArr.TaxType] : '',
                        "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : '',
                        "Discount": ele[parArr.Discount] ? ele[parArr.Discount] : 0,
                        "DiscountAmount": ele[parArr.DiscountAmount] ? ele[parArr.DiscountAmount] : 0,

                    })
                })

                outerArr.push({ ...parentObj, InvoiceItems: invoiceItems })
            });

            const jsonBody = JSON.stringify({ "BulkData": outerArr })
            dispatch(ExcelUpload_save_action({ jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <form noValidate>
                    <div className="page-content">

                        <div className="px-2 c_card_header text-black" >
                            <div className="px-2   c_card_filter text-black" >
                                {
                                    (!(_cfunc.loginIsSCMCompany() === 1)) ? <>
                                        <div className="row">
                                            <Col sm="3">
                                                <FormGroup className="mb-2 row mt-3 " >
                                                    <Label className=" p-2"

                                                        style={{ width: "115px" }}>{fieldLabel.Party}</Label>
                                                    <Col >
                                                        <Select
                                                            classNamePrefix="select2-Customer"
                                                            value={partySelect}
                                                            options={PartyDropdown_Options}
                                                            onChange={(e) => {
                                                                SetPartySelect(e)
                                                                goButtonHandler(e)
                                                            }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col >
                                        </div>
                                    </>
                                        : <>
                                            {(!(compareParameter.length > 0)) ?
                                                <div className="row ">
                                                    <div className="d-flex justify-content-start p-2 ">
                                                        <div>Please wait Downloading field Details.</div>
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
                                                <div >
                                                    <h4 className="pt-4 pb-4 text-primary" >{"Upload Your Excel."}</h4>
                                                </div>}


                                        </>
                                }

                            </div>

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
                                                <i className="display-4 text-muted bx bxs-cloud-uploadBtnFunc" />
                                            </div>
                                            <h4>Drop files here or click to uploadBtnFunc.</h4>
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
                                            {/* <div className="error-msg">
    <i className="fa fa-error"></i>
    Total Amount:5454
</div> */}
                                        </div>
                                    </Card>
                                }
                            </div>


                        </div>

                        <div className="text- mt-4" >
                            {preViewDivShow ?
                                <button
                                    type="button"
                                    // style={{ display: "none" }}
                                    id='btn-uploadBtnFunc'
                                    className="btn btn-success "
                                    onClick={SaveHandler}
                                >
                                    Upload Files
                                </button>
                                :
                                <button
                                    type="button"
                                    id='btn-verify'
                                    className="btn btn-primary "
                                    onClick={uploadBtnFunc}
                                >
                                    Verify Files
                                </button>
                            }
                        </div>



                    </div>

                </form>


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






