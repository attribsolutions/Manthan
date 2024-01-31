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
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import {
    saveDriverMaster,
    saveDriverMasterSuccess,
    getDriverListSuccess,
    editDriverID_Success,
    updateDriverID,
    updateDriverID_Success,
    getDriverList,
} from "../../../store/Administrator/DriverRedux/action";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText,
    onChangeDate,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";

const DriverMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Name: "",
        Address: "",
        DOB: '',
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.DriverReducer.saveBtnloading,
        postMsg: state.DriverReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        updateMsg: state.DriverReducer.updateMessage,
        pageField: state.CommonPageFieldReducer.pageField
    }));
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
    
    useEffect(() => {
        const page_Id = pageId.DRIVER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
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
                _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };
    }, [userAccess])

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

                const { id, Name, DOB, Address, Party, PartyName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.DOB.valid = true;
                hasValid.Address.valid = true;
               
                values.Name = Name;
                values.DOB = DOB;
                values.Address = Address;
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.DriverMaster))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editDriverID_Success({ Status: false }))
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: true }))//change party drop-down disable when edit/view
        }
        return () => {
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: false }))//change party drop-down restore state
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveDriverMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            dispatch(Breadcrumb_inputName(''))
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

                const jsonBody = {
                    ..._cfunc.loginJsonBody(),
                    PartyID:  commonPartyDropSelect.value
                };
                dispatch(getDriverList(jsonBody));

                props.isOpenModal(false)
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.DRIVER_lIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getDriverListSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))//+++++++++ Clear form values 
            history.push({
                pathname: url.DRIVER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateDriverID_Success({ Status: false }));
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

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            if (( commonPartyDropSelect.value === 0)) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    Address: values.Address,
                    DOB: values.DOB,
                    Party:  commonPartyDropSelect.value,
                    Company: _cfunc.loginCompanyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateDriverID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveDriverMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };// new change

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>

                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                  
                        <Card className="text-black" style={{ marginTop: "3px" }}>
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form noValidate>

                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                id="txtName"
                                                                name="Name"
                                                                type="text"
                                                                value={values.Name}
                                                                autoFocus={true}
                                                                autoComplete='off'
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <Col md="4">
                                                            <FormGroup className="mb-3">
                                                                <Label>{fieldLabel.DOB} </Label>
                                                                <C_DatePicker
                                                                    name="DOB"
                                                                    value={values.DOB}
                                                                    placeholder={"DD/MM/YYYY"}
                                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Address} </Label>
                                                            <Input
                                                                name="Address"
                                                                value={values.Address}
                                                                type="text"
                                                                className={isError.Address.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Address"
                                                                autoComplete='off'
                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                            />
                                                            {isError.Address.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Address}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>



                                                    <FormGroup className="mt-2">
                                                        <Row>
                                                            <Col sm={2}>
                                                                <SaveButton
                                                                    loading={saveBtnloading}
                                                                    pageMode={pageMode}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"DriverMaster"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup >

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
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

export default DriverMaster




const Email = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)

const Mobile = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)
const NotNull = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)