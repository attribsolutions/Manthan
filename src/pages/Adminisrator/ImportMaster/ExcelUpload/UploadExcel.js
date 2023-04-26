import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    ListGroupItemHeading,
    Progress,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, groupBy, loginCompanyID } from "../../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"
import { fileDetails, readExcelFile } from "./readFile";
import CInput from "../../../../CustomValidateForm/CInput";
import { GoButton_ImportFiledMap_Add, GoButton_ImportFiledMap_AddSuccess } from "../../../../store/Administrator/ImportFieldMapRedux/action";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import './scss.scss'
const UploadExcel = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const  preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: '', amount: 0 }
    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }
    const [state, setState] = useState(initialFiledFunc(fileds))
    
    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([])
    const [preUploadjson, setPreUploadjson] = useState([])
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails)
    const [partySelect, SetPartySelect] = useState([])
   

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        partyList,
        compareParam = []
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        partyList: state.PartyMasterReducer.partyList,
        compareParam: state.ImportFieldMap_Reducer.addGoButton,
    }));

    useEffect(() => {
        const page_Id = pageId.UPLOAD_EXCEL
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const PartyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));


    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            PartyID: partySelect.value,
            CompanyID: loginCompanyID()
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    async function upload() {

        var files = selectedFiles;
        if (files.length == 0) {
            CustomAlert({
                Type: 3,
                Message: "Please choose any file...",
            })
            return;
        }
        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX' || extension == '.CSV') {

            const readjson = await readExcelFile({ file: files[0], compareParam, })

            const btnerify = document.getElementById("btn-verify")
            const btnupload = document.getElementById('btn-upload')


            if (readjson.length > 0) {
                debugger
                const aa = await fileDetails({ compareParam, readjson, setReadJsonDetail })
                debugger
                setPreUploadjson(readjson)
                btnerify.style.display = "none"
                btnupload.style.display = "block"
            }

        } else {
            CustomAlert({
                Type: 3,
                Message: "Please select a valid excel file.",
            })
        }
    }

    async function handleAcceptedFiles(files) {

        if (selectedFiles.length > 0) {
            const isConfirmed = await CustomAlert({
                Type: 8,
                Message: "Do you confirm your choice?",
            });
            if (!isConfirmed) {
                return
            }
        };
        try {
            const btnerify = document.getElementById("btn-verify")
            const btnupload = document.getElementById('btn-upload')
            const progDiv = document.getElementById("file-proccess")

            btnerify.style.display = "block"
            btnupload.style.display = "none"
            progDiv.style.display = "none"
        } catch (d) { }

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


    const SaveHandler = (event) => {
        event.preventDefault();

        const parArr = {}
        const outerArr = []

        compareParam.forEach(ele => {
            if ((ele.Value !== null)) {
                parArr[ele.FieldName] = ele.Value
            }
        })

        const c_invoice = compareParam.find(i => (i.FieldName === "InvoiceNumber"))
        const invoiceGroup = groupBy(preUploadjson, (party) => (party[c_invoice.Value]))

        invoiceGroup.forEach(inv => {
            let parentObj;
            let invoiceItems = []
            inv.forEach(ele => {
                parentObj = {
                    "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                    "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : '',
                    "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : '',
                    "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                    "FullInvoiceNumber": ele[parArr.FullInvoiceNumber] ? ele[parArr.FullInvoiceNumber] : '',
                    "Customer": ele[parArr.Customer] ? ele[parArr.Customer] : '',
                    "Party": ele[parArr.Party] ? ele[parArr.Party] : '',
                    "CreatedBy": ele[parArr.CreatedBy] ? ele[parArr.CreatedBy] : '',
                    "UpdatedBy": ele[parArr.FullInvoiceNumber] ? ele[parArr.FullInvoiceNumber] : '',
                    "InvoiceDate": ele[parArr.InvoiceDate] ? ele[parArr.InvoiceDate] : '',
                }



                invoiceItems.push({
                    "Item": ele[parArr.Item] ? ele[parArr.Item] : '',
                    "Unit": ele[parArr.Unit] ? ele[parArr.Unit] : '',
                    "BatchCode": ele[parArr.BatchCode] ? ele[parArr.BatchCode] : '',
                    "Quantity": ele[parArr.Quantity] ? ele[parArr.Quantity] : '',
                    "BatchDate": ele[parArr.BatchDate] ? ele[parArr.BatchDate] : '',
                    "BaseUnitQuantity": ele[parArr.BaseUnitQuantity] ? ele[parArr.BaseUnitQuantity] : '',
                    "LiveBatch": ele[parArr.LiveBatch] ? ele[parArr.LiveBatch] : '',
                    "MRP": ele[parArr.MRP] ? ele[parArr.MRP] : '',
                    "MRPValue": ele[parArr.MRPValue] ? ele[parArr.MRPValue] : '',
                    "Rate": ele[parArr.Rate] ? ele[parArr.Rate] : '',
                    "BasicAmount": ele[parArr.BasicAmount] ? ele[parArr.BasicAmount] : '',
                    "GSTAmount": ele[parArr.GSTAmount] ? ele[parArr.GSTAmount] : '',
                    "GST": ele[parArr.GST] ? ele[parArr.GST] : '',
                    "GSTValue": ele[parArr.GSTValue] ? ele[parArr.GSTValue] : '',
                    "CGST": ele[parArr.CGST] ? ele[parArr.CGST] : '',
                    "SGST": ele[parArr.SGST] ? ele[parArr.SGST] : '',
                    "IGST": ele[parArr.IGST] ? ele[parArr.IGST] : '',
                    "GSTPercentage": ele[parArr.GSTPercentage] ? ele[parArr.GSTPercentage] : '',
                    "CGSTPercentage": ele[parArr.CGSTPercentage] ? ele[parArr.CGSTPercentage] : '',
                    "SGSTPercentage": ele[parArr.SGSTPercentage] ? ele[parArr.SGSTPercentage] : '',
                    "IGSTPercentage": ele[parArr.IGSTPercentage] ? ele[parArr.IGSTPercentage] : '',
                    "Amount": ele[parArr.Amount] ? ele[parArr.Amount] : '',
                    "TaxType": ele[parArr.TaxType] ? ele[parArr.TaxType] : '',
                    "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : '',
                    "Discount": ele[parArr.Discount] ? ele[parArr.Discount] : '',
                    "DiscountAmount": ele[parArr.DiscountAmount] ? ele[parArr.DiscountAmount] : '',

                })
            })

            outerArr.push({ ...parentObj, ...invoiceItems })
        });
        console.log('Upload data', outerArr)
    };



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <div className="page-content">

                        <div className="px-2 c_card_header text-black" >
                            <div className="px-2   c_card_filter text-black" >
                                <div className="row" >
                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    value={partySelect}
                                                    options={PartyDropdown_Options}
                                                    onChange={(e) => { SetPartySelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >



                                    <Col md="1"></Col>
                                    <Col sm="2" className="mt-3 ">
                                        <Go_Button
                                            onClick={goButtonHandler}
                                        />
                                    </Col>
                                </div>

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


                                            <div >
                                                <div className="error-msg">
                                                    <i className="fa fa-error"></i>
                                                    No of line Item:54
                                                </div>
                                                <div className="error-msg">
                                                    <i class="fa fa-warning"></i>
                                                    No of invoices:8
                                                </div>
                                                <div className="error-msg">
                                                    <i className="fa fa-error"></i>
                                                    No of Party:5
                                                </div>
                                                <div className="error-msg">
                                                    <i className="fa fa-error"></i>
                                                    No of invoice Dates:2022-2023
                                                </div>
                                                <div className="error-msg">
                                                    <i className="fa fa-error"></i>
                                                    Total Amount:5454
                                                </div>
                                            </div>
                                            {/* <div id="file-proccess" style={{
                                                width: "80%",
                                                paddingRight: "40%",
                                                marginBottom: "10px",
                                                display: "none"
                                            }}>
                                                <div className='progress'>
                                                    <div className='progress-bar progress-bar-animated bg-primary progress-bar-striped'
                                                        id="_progressbar"
                                                        role='progressbar'
                                                        aria-valuenow={10}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ width: '0%' }}>
                                                        <span id='file-proccess-lable'>0% </span>
                                                    </div>
                                                </div>
                                            </div> */}




                                            <details>
                                                <summary>Epcot Center</summary>
                                                <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                                            </details>
                                        </Card>
                                    )
                                })}
                            </div>


                        </div>

                        <div className="text- mt-4" >

                            <button
                                type="button"
                                style={{ display: "none" }}
                                id='btn-upload'
                                className="btn btn-success "
                                onClick={SaveHandler}
                            >
                                Upload Files
                            </button>
                            <button
                                type="button"
                                id='btn-verify'
                                className="btn btn-primary "
                                onClick={upload}
                            >
                                Verify Files
                            </button>
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

export default UploadExcel






