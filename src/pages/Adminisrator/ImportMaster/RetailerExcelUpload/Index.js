import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Card,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import * as _cfunc from "../../../../components/Common/CommonFunction";

import Dropzone from "react-dropzone"
import {
    GoButton_ImportFiledMap_Add,
    GoButton_ImportFiledMap_AddSuccess
} from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import {
    RetailerExcelUpload_save_action_Success
} from "../../../../store/Administrator/ImportExcelPartyMapRedux/action";
import './scss.scss'
import PriceDropOptions from "../../PartyMaster/MasterAdd/FirstTab/PriceDropOptions";
import { priceListByPartyAction, priceListByPartyActionSuccess } from "../../../../store/Administrator/PriceList/action";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../../store/Administrator/PartyTypeRedux/action";
import { retailer_FileDetails, retailer_SaveHandler } from "./AllHndlerFunc";
import { C_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import { readExcelFile } from "../InvoiceExcelUpload/readFile";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";

const RetailerExcelUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const userAdminRole = _cfunc.loginUserAdminRole();

    const preDetails = { fileFiled: '', invoice: [], party: [], invoiceDate: [], amount: 0, invoiceNO: [], partyNO: [] }

    const [priceListSelect, setPriceListSelect] = useState({ value: '', label: "" })

    const [userPageAccessState, setUserAccState] = useState('');
    const [retailerId, setRetailerId] = useState('')
    const [selectedFiles, setselectedFiles] = useState([])

    const [preUploadjson, setPreUploadjson] = useState([])
    const [readJsonDetail, setReadJsonDetail] = useState(preDetails)
    const [preViewDivShow, setPreViewDivShow] = useState(false)
    const [partySelect, SetPartySelect] = useState('')


    const {
        postMsg,
        pageField,
        userAccess,
        priceListByPartyType = [],
        compareParameter = [],
        partyTypes,
        compareParamLoading,
        saveBtnLoading,
        priceListDropDownLoading,
        // partyTypesDropDownLoading,
        // partyList,
        partyDropDownLoading,
        commonPartyDropSelect
    } = useSelector((state) => ({
        postMsg: state.ImportExcelPartyMap_Reducer.partyExcelUploadMsg,
        saveBtnLoading: state.ImportExcelPartyMap_Reducer.partyUploadSaveLoading,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,

        partyTypes: state.PartyTypeReducer.ListData,
        partyTypesDropDownLoading: state.PartyTypeReducer.goBtnLoading,

        // partyList: state.PartyMasterReducer.partyList,
        // partyDropDownLoading: state.PartyMasterReducer.goBtnLoading,

        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        priceListDropDownLoading: state.PriceListReducer.priceListDropDownLoading,

        compareParameter: state.ImportExportFieldMap_Reducer.addGoButton,
        compareParamLoading: state.ImportExportFieldMap_Reducer.goBtnLoading,

        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    useLayoutEffect(() => {
        const page_Id = pageId.INVOICE_EXCEL_UPLOAD
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyTypelist());
        // dispatch(getPartyListAPI());

        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(priceListByPartyActionSuccess([]))
            dispatch(getPartyTypelistSuccess([]))
        }
    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        goButtonHandler()
        if (commonPartyDropSelect.value > 0) {
        }
        return () => {
            dispatch(GoButton_ImportFiledMap_AddSuccess([]));

        }

    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)



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
            dispatch(RetailerExcelUpload_save_action_Success({ Status: false }))

            //clear all states
            setPriceListSelect({ value: '', label: "" });
            setRetailerId('')
            setselectedFiles([])
            setPreUploadjson([])
            setPreViewDivShow(false)
            SetPartySelect('')

            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(RetailerExcelUpload_save_action_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if ((partyTypes.length > 0)) {
            let isRetailer = partyTypes.find(i => (i.IsRetailer))
            if (!(isRetailer === undefined)) {
                setRetailerId(isRetailer.id)
                dispatch(priceListByPartyAction(isRetailer.id))
            }
        }
    }, [partyTypes])

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            PartyID: '',
            CompanyID: '',
            // PartyID: commonPartyDropSelect.value,
            // CompanyID: _cfunc.loginCompanyID(),
            IsFieldType: 2// type 2 is all Retailer fields
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    async function veifyExcelBtn_Handler() {
        let alertMsg = ''

        if (commonPartyDropSelect.value === 0) {
            alertMsg = alertMessages.commonPartySelectionIsRequired;
        }
        else if (compareParameter.length === 0) {
            alertMsg = alert.waitForDownloadFieldDetails;
        }
        else if (selectedFiles.length === 0) {
            alertMsg = alertMessages.chooseAnyFile
        };


        if (alertMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: alertMsg,
            })
            return;
        }


        const filename = selectedFiles[0].name;
        const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        if ((extension === '.csv') || extension === ".xlsx") {
            const readjson = await readExcelFile({ file: selectedFiles[0], compareParameter, })
            if (readjson.length > 0) {

                const isdetails = await retailer_FileDetails({ compareParameter, readjson })
                let { invoiceNO } = isdetails;
                if ((invoiceNO.length > 0)) {
                    setPreUploadjson(readjson)
                    setPreViewDivShow(true)
                    setReadJsonDetail(readjson)

                } else {
                    customAlert({
                        Type: 3,
                        Message: alertMessages.mappingNotMatchError
                    })
                }
            }

        } else {
            customAlert({
                Type: 3,
                Message: alertMessages.unSupportedFileFormat,
            })
        }
    }


    async function handleAcceptedFiles(files) {

        let alertMsg = ''

        if (commonPartyDropSelect.value === 0) {
            alertMsg = alertMessages.commonPartySelectionIsRequired;
        }
        else if (compareParameter.length === 0) {
            alertMsg = alertMessages.waitForDownloadFieldDetails;
        }

        if (alertMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: alertMsg,
            })
            return;
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

        setReadJsonDetail(preDetails)
        setPreUploadjson([])
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

    const priceListOnClick = function () {

        const hasNone = document.getElementById("price-drop").style;

        if ((priceListByPartyType.length > 0)) {
            if ((hasNone.display === "none") || (hasNone.display === "")) {
                hasNone.display = "block";
            } else {
                hasNone.display = "none";
            }
        }

    };


    const uploadSaveHandler = (event) => {

        let validMsg = []

        if ((commonPartyDropSelect.value === "")) {
            validMsg.push({ Msg: alertMessages.commonPartySelectionIsRequired })
        }
        if ((priceListSelect.value === '')) {
            validMsg.push({ Msg: alertMessages.PricelistIsRequired })
        }
        if (validMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: validMsg
            })
            return
        }

        retailer_SaveHandler({
            event,
            dispatch,
            compareParameter,
            readJsonDetail,
            partySelect: commonPartyDropSelect,
            priceListSelect,
            retailerId
        })
    }


    const removeFile = () => {
        setRetailerId('')
        setselectedFiles([])
        setPreUploadjson([])
        setPreViewDivShow(false)
        SetPartySelect('')
        document.getElementById("demo1").style.border = "";
    }


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={(!pageField)} />
                <form noValidate>
                    <div className="page-content">
                        <div >
                            <div className="px-2  mb-1 c_card_filter text-black" >
                                <div className="row" >

                                    <Col sm={4} >
                                        <FormGroup className="mb- row mt-3 mb-2" >
                                            <Label className="col-sm-4 p-2"
                                                style={{ width: "65px" }}>PriceList</Label>
                                            <Col sm="8">
                                                <Input
                                                    value={priceListSelect.label}
                                                    disabled={partyDropDownLoading}
                                                    autoComplete={"off"}
                                                    placeholder="Select..."
                                                    onClick={priceListOnClick}
                                                />
                                                <PriceDropOptions
                                                    data={priceListByPartyType}
                                                    priceList={priceListSelect}
                                                    setPriceSelect={setPriceListSelect} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </div>
                            </div>

                        </div>
                        <div className="mb-3 mt-3">
                            <h4 className="pt-4 pb-4 text-primary" >{"Upload Your Excel."}</h4>
                            <Dropzone
                                onDrop={acceptedFiles => {
                                    document.getElementById("demo1").style.border = "4px dotted green";
                                    handleAcceptedFiles(acceptedFiles)
                                }}
                                multiple={false}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div id='demo1' className="d-flex dropzone justify-content-between">
                                        <div className="dz-message needsclick mt-2" {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className="mb-3">
                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                            </div>
                                            <h4>Drop files here or click to upload.</h4>
                                        </div>
                                        <div>
                                            <button
                                                name="Cancel"
                                                style={{ borderRadius: "10px", border: "none", backgroundColor: "white" }}
                                                onClick={removeFile}
                                                type="button"
                                                className={` px-2`}
                                            >
                                                <i className="mdi mdi-close" style={{ fontSize: "25px" }}></i>
                                            </button>
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

                </form >


            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default RetailerExcelUpload






