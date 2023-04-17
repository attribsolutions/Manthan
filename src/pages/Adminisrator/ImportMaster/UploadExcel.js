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
import { commonPageField, commonPageFieldSuccess, } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc } from "../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"

const UploadExcel = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const XLSX = require('xlsx');

    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [partySelect, SetPartySelect] = useState([])

    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [selectedFiles, setselectedFiles] = useState([])


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        partyList
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        const page_Id = pageId.UPLOAD_EXCEL
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
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



    const data = [{
        id: 1,
        fieldLabel: "asas",
    },
    {
        id: 2,
        fieldLabel: "asxdasd",
    },
    {
        id: 3,
        fieldLabel: "asdasdasas",
    },
    {
        id: 4,
        fieldLabel: "sdasd",
    },
    ]


    const SaveHandler = (event) => {
        event.preventDefault();
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))
        if (formValid(state, setState)) {

            let BOMrefID = 0
            if ((pageMode === mode.edit)) {
                BOMrefID = EditData.id
            };

            const jsonBody = JSON.stringify({
                // BomDate: values.BomDate,
                // EstimatedOutputQty: values.EstimatedOutputQty,
                // Comment: values.Comment,
                // IsActive: values.IsActive,
                // Item: values.ItemName.value,
                // Unit: values.UnitName.value,
                // CreatedBy: loginUserID(),
                // Company: loginCompanyID(),
                // BOMItems: BOMItems,
                // IsVDCItem: values.IsVDCItem,
                // ReferenceBom: BOMrefID
            });



            // if (pageMode === mode.edit) {
            //     dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
            // }
            // else {
            //     dispatch(saveBOMMaster(jsonBody));
            // }
        }
    };

    const compair = [
        // {
        //     FieldLabel: 'First Name',
        //     RelatedKeyField: "FirstName1",
        //     ValidationRegX: /^[0-9]*$/
        // },
        {
            FieldLabel: 'ID',
            RelatedKeyField: "DistributorID",
            ValidationRegX: /^[0-9]*$/
        }

    ]



    const readUploadFile = (file) => {

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {

            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const result = XLSX.utils.sheet_to_json(worksheet);

            let invalidMsg = []
            result.forEach((r1) => {
                compair.forEach((c1) => {
                    const regExp = RegExp(c1.ValidationRegX)
                    if (!(regExp.test(r1[c1.RelatedKeyField]))) {
                        invalidMsg.push(`${c1.RelatedKeyField} :${r1[c1.RelatedKeyField]} is invalid Format`)
                    }
                })
            })
            if (invalidMsg.length > 0) {
                alert(JSON.stringify(invalidMsg))
            }

            console.log('Upload data', result)

            //    //displaying the json result
            //    var resultEle = document.getElementById("json-result");
            //    resultEle.value = JSON.stringify(result, null, 4);
            //    resultEle.style.display = 'block';
        }
    }

    function upload() {

        var files = selectedFiles;
        // var files = document.getElementById('file_upload').files;
        debugger
        if (files.length == 0) {
            alert("Please choose any file...");
            return;
        }
        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX' || extension == '.CSV') {
            // excelFileToJSON(files[0]);
            readUploadFile(files[0])
        } else {
            alert("Please select a valid excel file.");
        }
    }

    function handleAcceptedFiles(files) {
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


    // useEffect(() => {
    //     try {


    //         let a = document.getElementById("preloader1")
    //         if (a) {
    //             setTimeout(() => {
    //                 a.style.display = 'none'
    //             }, 7000);
    //         }
    //         let k = document.getElementById("pace-progress1")

    //         if (k) {

    //             let t = 80
    //             let myInterval
    //             setTimeout(() => {
    //                 myInterval = setInterval(myTimer, 500);
    //             }, 4000);

    //             function myTimer() {

    //                 console.log("myInterval")
    //                 t = t + 5

    //                 let b = document.getElementById("pace-progress1")
    //                 debugger
    //                 // let c = document.getElementById("sr-only")

    //                 b.style.width = `${t}%`
    //                 // c.innerText = `${t}%`
    //                 if (t === 100) {
    //                     clearInterval(myInterval)
    //                 }

    //             }


    //         }

    //     } catch (e) { }

    // })
    // useEffect(() => {
    //     try {


    //         let a = document.getElementById("d111")

    //         if (a) {
    //             const myInterval = setInterval(myTimer, 1000);
    //             let t = 10
    //             a.style.cssText = `${t}%`

    //             function myTimer() {
    //                 debugger
    //                 console.log("myInterval")
    //                 t = t + 10

    //                 let b = document.getElementById("d111")
    //                 let c = document.getElementById("sr-only")

    //                 b.style.cssText = `width:${t}%`
    //                 c.innerText = `${t}%`
    //                 if (t === 100) {
    //                     clearInterval(myInterval)
    //                 }

    //             }


    //         }

    //     } catch (e) { }

    // })

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

                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.ImportType}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                // value={SupplierSelect}
                                                // options={SupplierOptions}
                                                // onChange={SupplierOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.PatternType}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                // value={SupplierSelect}
                                                // options={SupplierOptions}
                                                // onChange={SupplierOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col md="1"></Col>
                                    <Col sm="2" className="mt-3 ">
                                        <Go_Button
                                        //  onClick={goButtonHandler} 
                                        />
                                    </Col>
                                </div>

                            </div>

                        </div>

                        {/* <div className="mt-1">

                            <Input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                id="file_upload" />
                            <Button className="btn btn-success" onClick={upload}>Upload</Button>

                            <br></br>
                            <br></br>

                            <textarea id="json-result" style={{ display: "none", height: "500px", width: "350px" }}></textarea>

                        </div> */}

                        <div className="mb-3 mt-3">
                            <Container className='p-4'>

                            </Container >
                            {/*  */}
                            {/* <div class="alert alert-danger d-flex align-items-center" role="alert">
                                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill" /></svg>
                                <div>
                                    An example danger alert with an icon
                                </div>
                            </div> */}

                            {/*  */}
                            <Dropzone
                                onDrop={acceptedFiles => {
                                    handleAcceptedFiles(acceptedFiles)
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="dropzone">
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
                                            <div style={{ width: "80%", paddingRight: "40%", marginBottom: "10px" }}>
                                                <div className='progress'>
                                                    <div className='progress-bar progress-bar-animated bg-primary progress-bar-striped'
                                                        id="d111"
                                                        role='progressbar'
                                                        aria-valuenow={10}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ width: '50%' }}>
                                                        <span id='sr-only'>0% </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>

                        </div>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={upload}
                            >
                                Verify Files
                            </button>
                        </div>




                    </div>

                    <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            <SaveButton pageMode={pageMode}
                                //   onClick={onsave}
                                userAcc={userPageAccessState}
                                module={"LoadingSheet"}
                            />
                        </Col>
                    </FormGroup >
                </form>

                <Card1 header={<h2>Heading</h2>} footer="Footer text">
                    {(aa) => {
                        debugger
                        return <div>
                            <p>Content with a heading and a footer</p>
                        </div>
                    }}
                </Card1>
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

export function Card1(props) {
    debugger
    // const { children, header, footer }=props
    const a = "dddd"

    return (
        <>
            {/* {header && <header>{header}</header>}
           {children(props)}
            {footer && <footer>{footer}</footer>} */}
        </>
    );
}



