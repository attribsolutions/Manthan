import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess, } from "../../../../store/actions";
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
    InvoiceExcelUpload_save_action,
    InvoiceExcelUpload_save_Success
} from "../../../../store/Administrator/ImportExcelPartyMapRedux/action";
import './scss.scss'
import { C_Button, Go_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import { C_Select } from "../../../../CustomValidateForm";


const InvoiceExcelUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const userAdminRole = _cfunc.loginUserAdminRole();

    const preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: '', amount: 0, invoiceNO: [], partyNO: [] }

    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([])
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails)
    const [preViewDivShow, setPreViewDivShow] = useState(false)
    const [partySelect, SetPartySelect] = useState([])


    const {
        postMsg,
        userAccess,
        compareParameter = [],
        partyList,
        partyDropDownLoading,
        compareParamLoading,
        saveBtnLoading,
    } = useSelector((state) => ({
        postMsg: state.ImportExcelPartyMap_Reducer.invoiceExcelUploadMsg,
        saveBtnLoading: state.ImportExcelPartyMap_Reducer.invoiceUploadSaveLoading,

        partyList: state.PartyMasterReducer.partyList,
        partyDropDownLoading: state.PartyMasterReducer.goBtnLoading,

        compareParameter: state.ImportExportFieldMap_Reducer.addGoButton,
        compareParamLoading: state.ImportExportFieldMap_Reducer.goBtnLoading,
        userAccess: state.Login.RoleAccessUpdateData,
    }));
    debugger
    useEffect(() => {
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        dispatch(getPartyListAPI());
        if (!userAdminRole) {
            goButtonHandler()
        }
        return () => {
            dispatch(GoButton_ImportFiledMap_AddSuccess([]));
            dispatch(getPartyListAPISuccess([]));
            dispatch(commonPageFieldSuccess(null));
        }

    }, []);

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
            SetPartySelect('');
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

        let partyId = (!userAdminRole) ? _cfunc.loginPartyID() : partySelect.value;
        const jsonBody = JSON.stringify({
            PartyID: partyId,
            CompanyID: _cfunc.loginCompanyID()
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    async function veifyExcelBtn_Handler() {

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
        if (extension == '.CSV') {
            const readjson = await readExcelFile({ file: files[0], compareParameter, })
            if (readjson.length > 0) {

                const isdetails = await fileDetails({ compareParameter, readjson })
                let { invoiceNO } = isdetails;
                if ((invoiceNO.length > 0)) {
                    setReadJsonDetail(isdetails)
                    setPreViewDivShow(true)
                } else {
                    customAlert({
                        Type: 3,
                        Message: "Mapping not match."
                    })
                }
            }

        } else {
            customAlert({
                Type: 3,
                Message: "Please select a valid CSV file.",
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

            readJsonDetail.invoice.forEach(inv => {
                let parentObj;
                let invoiceItems = []
                inv.forEach(ele => {
                    parentObj = {
                        "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                        "TCSAmount": ele[parArr.TCSAmount] ? ele[parArr.TCSAmount] : 0,
                        "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : '',
                        "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : 0,
                        "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "FullInvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                        "Customer": ele[parArr.Customer] ? ele[parArr.Customer] : '',
                        "Party": _cfunc.loginPartyID(),
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
                        "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : '',
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
                <PageLoadingSpinner isLoading={((partyDropDownLoading && (userAdminRole)) || compareParamLoading)} />

                <form noValidate>
                    <div className="page-content">

                        <div className="px-2   c_card_filter text-black" >

                            {userAdminRole && <div className="row pt-2">
                                <Col sm="5">
                                    <FormGroup className="row px-1">
                                        <Label className="col-sm-5 p-2" style={{ width: "83px" }}>
                                            Party
                                        </Label>
                                        <Col sm="6">
                                            <C_Select
                                                value={partySelect}
                                                isSearchable={true}
                                                isLoading={partyDropDownLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={partyList.map((data) => ({
                                                    value: data.id,
                                                    label: data.Name,
                                                }))}

                                                onChange={(e) => { SetPartySelect(e) }}
                                                styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="1" className="mb-2">
                                    <Go_Button
                                        // loading={reducers.loading}
                                        onClick={goButtonHandler} />
                                </Col>
                            </div>}
                        </div>

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

                                // <div >
                                //     <h4 className="pt-4 pb-4 text-primary" >{"Upload Your Excel."}</h4>
                                //     <spam onClick={() => dounloadDummyFormat_handler(compareParameter)}>Download Dumy Format</spam>
                                // </div>}
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
                                    loading={saveBtnLoading}
                                    className="btn btn-primary"
                                    onClick={veifyExcelBtn_Handler}
                                >
                                    Verify Files
                                </C_Button>

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






