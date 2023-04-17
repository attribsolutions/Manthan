import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc } from "../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

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

        var files = document.getElementById('file_upload').files;
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

                        <div className="mt-1">

                            <Input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                id="file_upload" />
                            <Button className="btn btn-success" onClick={upload}>Upload</Button>

                            <br></br>
                            <br></br>

                            <textarea id="json-result" style={{ display: "none", height: "500px", width: "350px" }}></textarea>

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
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default UploadExcel
