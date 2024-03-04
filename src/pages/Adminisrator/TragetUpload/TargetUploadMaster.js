
import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    Input,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as mode from "../../../routes/PageMode";
import * as _cfunc from "../../../components/Common/CommonFunction";
import Dropzone from "react-dropzone"
import { readExcelFile } from "./readFile";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

import { Verifiy_Button } from "../../../components/Common/CommonButton";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { saveTargetUploadMaster, saveTargetUploadMaster_Success } from "../../../store/Administrator/TargetUploadRedux/action";
import { url } from "../../../routes";

const TargetUpload = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()


    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedFiles, setselectedFiles] = useState([]);
    const [readJsonDetail, setReadJsonDetail] = useState([]);
    const [updatereadJsonDetail, setUpdateReadJsonDetail] = useState([]);
    const [verifyLoading, setverifyLoading] = useState(false);
    const [isIgnoreNegativeValue, setisIgnoreNegativeValue] = useState(false);
    const [negativeFigureVerify, setNegativeFigureVerify] = useState({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined });


    const {
        postMsg,
        userAccess,
        saveBtnLoading,
    } = useSelector((state) => ({
        postMsg: state.TargetUploadReducer.postMsg,
        saveBtnLoading: state.ImportExcelPartyMap_Reducer.invoiceUploadSaveLoading,
        PartyMapData: state.ImportExcelPartyMap_Reducer.addGoButton,
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,

    }));


    // Common Party Dropdown useEffect
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
            dispatch(saveTargetUploadMaster_Success({ Status: false }))
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            });
            setselectedFiles([]);
            setReadJsonDetail([]);
            setisIgnoreNegativeValue(false)
            setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined });
            document.getElementById("demo1").style.border = "";
            history.push({ pathname: url.TARGET_UPLOAD_LIST })
        }
        else if (postMsg.Status === true) {
            setselectedFiles([]);
            setReadJsonDetail([]);
            setisIgnoreNegativeValue(false)
            setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined })
            document.getElementById("demo1").style.border = "";
            dispatch(saveTargetUploadMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        };
    }, [postMsg])




    useEffect(() => {
        /////////////////////////////////////////////////////////// check Ignore Negative Value in excel file /////////////////////////////////
        let updatereadJsonDetail = readJsonDetail
        if (isIgnoreNegativeValue) {
            updatereadJsonDetail = readJsonDetail.filter(i => !i.RemoveField.length > 0)
        }
        setUpdateReadJsonDetail(updatereadJsonDetail)

    }, [isIgnoreNegativeValue, readJsonDetail])


    async function veifyExcelBtn_Handler() {
        setverifyLoading(true);
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
        if (extension === ".xlsx") {
            const readjson = await readExcelFile({ file: files[0] })

            //////////////////////////////////////// Check  Invoice  Item Contain Negative Value Or Not //////////////////////////////////////////////////////
            const Negative_Value_Item_Array = readjson.filter(i => i.RemoveField.length > 0)

            if (Negative_Value_Item_Array.length > 0) {
                setNegativeFigureVerify({ Negative_Figure_Array: Negative_Value_Item_Array, Not_Verify_Negative_Figure: true })
            } else {
                setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: false })
            }
            setReadJsonDetail(readjson)
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
        ((isIgnoreNegativeValue) || (negativeFigureVerify.Not_Verify_Negative_Figure === false))
    );

    async function handleAcceptedFiles(files) {
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

        setReadJsonDetail([])
        setNegativeFigureVerify({ Negative_Figure_Array: [], Not_Verify_Negative_Figure: undefined })
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


    const uploadSaveHandler = () => {
        try {
            const Data = updatereadJsonDetail.map(i => {
                const { Month, Year, Party, Item, TargetQuantity } = i;
                return {
                    Month: Month,
                    Year: Year,
                    Party: Party,
                    Item: Item,
                    TargetQuantity: TargetQuantity,
                    CreatedOn: _cfunc.loginUserID(),
                    CreatedBy: _cfunc.loginUserID(),
                };
            });
            const jsonBody = JSON.stringify(Data)
            dispatch(saveTargetUploadMaster({ jsonBody }));
        } catch (e) { console.log(e) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">
                    <div className="px-2 c_card_header text-black mt-2" >
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
                                                <span style={{ fontWeight: "bold", fontSize: "14px" }} > Sheet Contains Negative Value:&nbsp;&nbsp;</span>

                                                <div style={{ whiteSpace: "nowrap" }}>
                                                    {negativeFigureVerify.Negative_Figure_Array.map((item, index) => (
                                                        item.RemoveField.map((field, fieldIndex) => (
                                                            <div key={fieldIndex} style={{ display: "inline-block", marginRight: "10px" }}>
                                                                <span style={{ fontWeight: "bold", display: "inline-block", marginRight: "5px" }}>{`${fieldIndex + 1})`}</span>
                                                                {Object.keys(field).map((key) => (
                                                                    <div key={key} style={{ display: "inline-block" }}>
                                                                        <strong>{key}: </strong>
                                                                        {field[key]}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))
                                                    ))}
                                                </div>
                                            </p>
                                        </div>}
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
export default TargetUpload







