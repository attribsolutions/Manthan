import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import {
    editGroupTypeIDSuccess,
    saveGroupTypeMasterSuccess,
} from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    metaTagLabel,
    loginPartyID,
    currentDate_ymd
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveVoucher, saveVoucherSuccess, updateVoucherID, updateVoucherIDSuccess, ValideVoucherID, ValideVoucherIDSuccess } from "../../../store/Administrator/voucherRedux/action";
import { C_DatePicker } from "../../../CustomValidateForm";
import { hideBtnCss } from "../../../components/Common/ListActionsButtons";
import { Voucher_Validity_Check_API } from "../../../helpers/backend_helper";

const Voucher = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        VoucherCode: "",
        InvoiceDate: currentDate_ymd,
        InvoiceNumber: "",
        InvoiceAmount: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const [vailidity, setvailidity] = useState();




    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        saveBtnloading,
        VoucherValidityData,
        VoucherLoading
    } = useSelector((state) => ({
        saveBtnloading: state.VoucherReducer.saveBtnloading,
        postMsg: state.VoucherReducer.PostData,

        VoucherValidityData: state.VoucherReducer.VoucherValidityData,
        VoucherLoading: state.VoucherReducer.VoucherLoading,

        updateMsg: state.VoucherReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));




    useEffect(() => {
        const page_Id = pageId.VOUCHER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        return () => {

            dispatch(ValideVoucherIDSuccess({ Status: false }))
            dispatch(saveVoucherSuccess({ Status: false }))

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
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };

    }, [userAccess])

    useEffect(() => {

        if (VoucherValidityData?.StatusCode === 200 && VoucherValidityData?.Status === true) {
            customAlert({
                Type: 1,
                Message: VoucherValidityData.Message,
            })
        } else if (VoucherValidityData?.Status === false && [404, 400, 204].includes(VoucherValidityData?.StatusCode)) {
            customAlert({
                Type: 4,
                Message: VoucherValidityData.Message,
            })
        }
    }, [VoucherValidityData])


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                setEditData(hasEditVal);
                const { id, Name, IsReserved, Sequence } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.IsReserved.valid = true;
                hasValid.Sequence.valid = true;

                values.id = id
                values.Name = Name;
                values.IsReserved = IsReserved;
                values.Sequence = Sequence;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editGroupTypeIDSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveVoucherSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.VOUCHER_LIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.VOUCHER_LIST }) }
            }

        } else if
            (postMsg.Status === false && [404, 400, 204].includes(postMsg.StatusCode)) {

            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))//Clear form values
            history.push({
                pathname: url.VOUCHER_LIST,
            })

        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateVoucherIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    VoucherCode: values.VoucherCode,
                    InvoiceDate: values.InvoiceDate,
                    InvoiceNumber: values.InvoiceNumber,
                    InvoiceAmount: values.InvoiceAmount,
                    Party: loginPartyID(),

                });

                if (pageMode === mode.edit) {
                    dispatch(updateVoucherID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveVoucher({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // var IsEditMode_Css = ''
    // if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black"  >
                                <form noValidate>
                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <Col sm={6}>
                                                    <Label htmlFor="validationCustom01" className="me-2">{fieldLabel.VoucherCode}</Label>
                                                    <FormGroup className="mb-2 "> {/* Use d-flex to align items horizontally */}
                                                        <Row>
                                                            <Col sm={8}>
                                                                <Input
                                                                    name="VoucherCode"
                                                                    type="text"
                                                                    value={values.VoucherCode}
                                                                    className={isError.VoucherCode.length > 0 ? "is-invalid form-control" : "form-control "}
                                                                    placeholder="Please Enter Voucher Code"
                                                                    style={{ marginRight: "34px" }}
                                                                    autoComplete="off"
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState });
                                                                        dispatch(Breadcrumb_inputName(event.target.value));
                                                                    }}
                                                                />
                                                                {isError.VoucherCode.length > 0 && (
                                                                    <span className="invalid-feedback"  >{isError.VoucherCode}</span>
                                                                )}

                                                            </Col>
                                                            <Col sm={2}>

                                                                <button
                                                                    title="Verify Voucher Code"
                                                                    type="button"
                                                                    className={`${hideBtnCss} px-2`}
                                                                    onClick={async () => {
                                                                        if (values.VoucherCode === "") {
                                                                            customAlert({ Type: 2, Message: "Please Enter Voucher Code" })
                                                                            return;
                                                                        } else {
                                                                            dispatch(ValideVoucherID({ Voucher_Code: values.VoucherCode }));
                                                                        }
                                                                    }}
                                                                >
                                                                    {VoucherLoading ? <Spinner size="sm"></Spinner> : <i className="mdi mdi-check" style={{ fontSize: "18px" }}></i>}
                                                                </button>
                                                            </Col>
                                                        </Row>

                                                    </FormGroup>
                                                </Col>

                                                <Col>
                                                    <FormGroup className="mb-2 col col-sm-8">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.InvoiceDate}</Label>
                                                        <C_DatePicker
                                                            name="InvoiceDate"
                                                            value={values.InvoiceDate}
                                                            type="text"
                                                            className={isError.InvoiceDate.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter InvoiceDate"
                                                            autoComplete="off"
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState });
                                                            }}
                                                        />
                                                        {isError.InvoiceDate.length > 0 && (
                                                            <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>


                                            <Row>
                                                <Col sm={6}>

                                                    <FormGroup className="mb-2 col col-sm-8 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.InvoiceNumber} </Label>
                                                        <Input
                                                            name="InvoiceNumber"
                                                            type="text"
                                                            value={values.InvoiceNumber}
                                                            className={isError.InvoiceNumber.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Invoice Number"
                                                            autoFocus={true}
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.InvoiceNumber.length > 0 && (
                                                            <span className="invalid-feedback" >{isError.InvoiceNumber}</span>
                                                        )}
                                                    </FormGroup>

                                                </Col>
                                                <Col>
                                                    <FormGroup className="mb-2 col col-sm-8 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.InvoiceAmount} </Label>
                                                        <Input
                                                            name="InvoiceAmount"
                                                            type="text"
                                                            value={values.InvoiceAmount}
                                                            className={isError.InvoiceAmount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Invoice Amount "
                                                            autoFocus={true}
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.InvoiceAmount.length > 0 && (
                                                            <span className="invalid-feedback">{isError.InvoiceAmount}</span>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <FormGroup>
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton pageMode={pageMode}
                                                            loading={saveBtnloading}
                                                            forceDisabled={!(VoucherValidityData?.StatusCode === 200 && VoucherValidityData?.Status === true)}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"Voucher"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup >

                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Voucher
