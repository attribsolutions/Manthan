import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editGroupIDSuccess,
    saveGroupMaster,
    saveGroupMaster_Success,
    updateGroupIDSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,

    resetFunction
} from "../../../components/Common/validationFunction";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    btnIsDissablefunc,
    loginCompanyID,
    loginUserDetails,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { getpartysetting_API, savePartySetting, savePartySettingMaster_Success } from "../../../store/Administrator/PartySetting/action";
import Slidewithcaption from "../../../components/Common/CommonImageComponent";


const InvoiceConfiguration = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        // PaymentQR: "",
        HSNCodeDigit: "",
        TCSAmountRound: "",
        InvoiceAmountRound: "",
        Invoicea4: "",
        ShowBatch: "",
        AddressInInvoice: "",
        AutoEInvoice: "",
        EInvoiceApplicable: "",
        CreditDebitAmountRound: "",
        PaymentQr: "",
        // IsTCSPercentageforNonValidatedPANCustomer: "",
        // IsTCSPercentageforValidatedPANCustomer: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [hsnDropOption] = useState([{ value: "1", label: "4 Digits" }, { value: "2", label: "6 Digits" }, { value: "3", label: "8 Digits" }])
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [imageTable, setImageTable] = useState([]);  // Selected Image Array
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not




    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        PartySettingdata,
        updateMsg,
        pageField,
        postMsg,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GroupReducer.saveBtnloading,
            postMsg: state.PartySettingReducer.postMsg,
            PartySettingdata: state.PartySettingReducer.PartySettingdata,
            updateMsg: state.GroupReducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const { Data = {}, SystemSetting = {} } = PartySettingdata;


    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.INVOICE_CONFIGURATION
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getpartysetting_API(loginUserDetails().Party_id, loginCompanyID()))


    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);


    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                const { id, Name, GroupType, GroupTypeName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.GroupTypeName = { label: GroupTypeName, value: GroupType };

                hasValid.Name.valid = true;
                hasValid.GroupTypeName.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])



    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: savePartySettingMaster_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.INVOICE_CONFIGURATION,
    }), [postMsg])

    useEffect(() => {
        dispatch(getpartysetting_API(loginUserDetails().Party_id, loginCompanyID()))
    }, [postMsg])



    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.GROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGroupIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])
    useEffect(() => {
        if (imageTable.length > 0) {
            setmodal_backdrop(true)
        }
    }, [imageTable])


    useEffect(() => {

        if (Object.keys(Data).length > 1) {

            if (Data.HSNCodeDigit.Value === "1") {
                Data.HSNCodeDigit.Value = { value: "1", label: "4 Digits" }
            }
            if (Data.HSNCodeDigit.Value === "2") {
                Data.HSNCodeDigit.Value = { value: "2", label: "6 Digits" }
            }
            if (Data.HSNCodeDigit.Value === "3") {
                Data.HSNCodeDigit.Value = { value: "3", label: "8 Digits" }
            } else {
                Data.HSNCodeDigit.Value = { value: "3", label: "8 Digits" }
            }

            setState((i) => {

                const a = { ...i }
                a.values.Invoicea4 = Data.A4Print;
                a.values.AddressInInvoice = Data.AddressOnInvoice;
                a.values.HSNCodeDigit = Data.HSNCodeDigit;
                a.values.InvoiceAmountRound = Data.InvoiceAmountRoundConfiguration;
                a.values.ShowBatch = Data.ShowBatchNoOnInvoicePrint;
                a.values.TCSAmountRound = Data.TCSAmountRoundConfiguration;
                a.values.EInvoiceApplicable = Data.EInvoiceApplicable;
                a.values.AutoEInvoice = Data.AutoEInvoice;
                a.values.CreditDebitAmountRound = Data.CreditDebitAmountRoundConfiguration;
                a.values.PaymentQr = Data.PaymentQRCodeimageonInvoice;
                a.values.PaymentQr["Image"] = SystemSetting.PaymentQRCodeimageonInvoice


                // a.values.IsTCSPercentageforValidatedPANCustomer = Data.IsTCSPercentageforValidatedPANCustomer;
                // a.values.IsTCSPercentageforNonValidatedPANCustomer = Data.IsTCSPercentageforNonValidatedPANCustomer;

                return a
            })
        }

    }, [Data])


    const onChangeSelecthandler = (e) => {

        setState((i) => {
            const a = { ...i }
            a.values.HSNCodeDigit.Value = e;
            return a
        })

    }


    const onchangeHandler = async (event, key, type) => {

        const file = Array.from(event.target.files)
        setState((i) => {
            const a = { ...i }
            a.values.PaymentQr["Image"] = file;
            return a
        })

    }

    const imageShowHandler = () => { // image Show handler
        let slides = []
        if (values.PaymentQr.Image.length > 0) {
            slides = [{
                Image: URL.createObjectURL(values.PaymentQr.Image[0])
            }];
        } else {
            slides = [{
                Image: SystemSetting.PaymentQRCodeimageonInvoice
            }];
        }
        setImageTable(slides)
    }

    function convertImageToFile(imageUrl) {
        return fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const filename = imageUrl.split('/').pop();
                return new File([blob], filename);
            });
    }

    useEffect(() => {
        debugger
        if (Object.keys(SystemSetting).length !== 0) {
            const a = convertImageToFile(SystemSetting.PaymentQRCodeimageonInvoice)
            debugger
            a.then(file => {
                setState((i) => {
                    const a = { ...i }
                    a.values.PaymentQr["Image"] = [file];
                    return a
                })
            }).catch(error => {
            });
        }
    }, [SystemSetting])



    const SaveHandler = async (event) => {
        const formData = new FormData(); // Create a new FormData object
        const BulkData = []

        try {

            Object.values(values).forEach(i => {

                if (i.SystemSetting === "HSN Code Digit") {
                    i.Value = i.Value.value
                }

                const arr = {
                    Setting: i.id,
                    Party: loginUserDetails().Party_id,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    Value: i.Value
                }
                BulkData.push(arr)

            })

            debugger
            formData.append(`uploaded_images_${values.PaymentQr.id}`, values.PaymentQr.Image[0]); // Convert to JSON string
            formData.append('BulkData', JSON.stringify(BulkData)); // Convert to JSON string
            dispatch(savePartySetting({ formData }));

        } catch (e) { console.log(e) }
    };



    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
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
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>

                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <Col md={4} >
                                                    <FormGroup className="mb-3 ">
                                                        <Label htmlFor="validationCustom01">Payment QR</Label>
                                                        <Col sm={7} >

                                                            <div>
                                                                <div className="btn-group btn-group-example mb-3 col-7" role="group">
                                                                    <Input
                                                                        type="file"
                                                                        className="form-control "
                                                                        name="image"
                                                                        id="file"
                                                                        multiple
                                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                                        onChange={(event) => { onchangeHandler(event, "ImageUpload") }}
                                                                    />
                                                                    <button name="image"
                                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                                        onClick={() => {

                                                                            if (SystemSetting.PaymentQRCodeimageonInvoice) { imageShowHandler() }
                                                                        }}
                                                                        id="ImageId" type="button" className="btn btn-primary "> Show </button>
                                                                </div>
                                                                {/* Image Count: {row && row.ImageURL ? ImageCount : 0} */}
                                                            </div>


                                                            {/* <Input type="file" className="form-control "
                                                                name="image"
                                                                id="file"
                                                                accept=".jpg, .jpeg, .png"
                                                                onChange={(event) => { onchangeHandler(event, "ImageUpload") }}
                                                            /> */}
                                                        </Col>


                                                    </FormGroup>
                                                </Col>

                                                <Col md={4} >
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01"> {fieldLabel.HSNCodeDigit} </Label>
                                                        <Col sm={7} >

                                                            <Select
                                                                name="HSNCodeDigit"
                                                                value={values.HSNCodeDigit.Value}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={hsnDropOption}
                                                                onChange={(evn) => onChangeSelecthandler(evn)}

                                                            />

                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">  {fieldLabel.CreditDebitAmountRoundConfiguration} </Label>
                                                        <Col sm={7} >
                                                            <Input
                                                                // style={{ marginLeft: "53px" }}
                                                                type="text"
                                                                className="p-2"
                                                                defaultValue={values.IsTCSPercentageforValidatedPANCustomer.Value}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.IsTCSPercentageforValidatedPANCustomer.Value = e.target.value;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>

                                                        </Col>
                                                    </FormGroup>
                                                </Col> */}

                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.TCSAmountRound} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    checked={values.TCSAmountRound.Value === "0" ? false : true}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }

                                                                            a.values.TCSAmountRound.Value = e.target.checked === false ? "0" : "1";
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                                {/* </Row> */}

                                                <Col sm={8}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={3} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.InvoiceAmountRound} </Label>
                                                            </Col>
                                                            <Col sm={9} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    checked={values.InvoiceAmountRound.Value === "0" ? false : true}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.InvoiceAmountRound.Value = e.target.checked === false ? "0" : "1";
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>



                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01">{fieldLabel.Invoicea4} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    checked={values.Invoicea4.Value === "0" ? false : true}
                                                                    onChange={(e) => {

                                                                        setState((i) => {
                                                                            const a = { ...i }

                                                                            a.values.Invoicea4.Value = e.target.checked === false ? "0" : "1";
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>


                                                <Col sm={8}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={3} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.ShowBatch} </Label>
                                                            </Col>
                                                            <Col sm={9} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    checked={values.ShowBatch.Value === "0" ? false : true}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.ShowBatch.Value = e.target.checked === false ? "0" : "1";
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01">  {fieldLabel.EInvoiceApplicable} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    disabled={values.AutoEInvoice.Value === "1" ? true : false}
                                                                    checked={values.EInvoiceApplicable.Value === "0" ? false : true}
                                                                    onChange={(e) => {

                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.EInvoiceApplicable.Value = e.target.checked === false ? "0" : "1";

                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>


                                                <Col sm={8}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={3} >
                                                                <Label htmlFor="validationCustom01">  {fieldLabel.AutoEInvoice} </Label>
                                                            </Col>
                                                            <Col sm={9} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    disabled={values.EInvoiceApplicable.Value === "1" ? false : true}
                                                                    checked={values.AutoEInvoice.Value === "0" ? false : true}
                                                                    onChange={(e) => {

                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.AutoEInvoice.Value = e.target.checked === false ? "0" : "1";

                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>




                                            </Row>

                                            <Row>

                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01">  {fieldLabel.CreditDebitAmountRound} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    checked={values.CreditDebitAmountRound.Value === "0" ? false : true}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.CreditDebitAmountRound.Value = e.target.checked === false ? "0" : "1";
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                            </Row>



                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton
                                                            loading={saveBtnloading}
                                                            pageMode={pageMode}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"GroupMaster"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
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

export default InvoiceConfiguration

