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
import { AlertState, commonPageField } from "../../../store/actions";
import {
    PostMethodForDriverMaster,
    PostMethod_ForDriverMasterSuccess,
    getMethod_ForDriverListSuccess,
    editDriverTypeSuccess,
    updateDriverTypeID,
    updateDriverTypeIDSuccess,
} from "../../../store/Administrator/DriverRedux/action";
import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr"
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText,
    onChangeDate,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { breadcrumbReturn, loginUserID, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";

const DriverMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Name: "",
        Address: "",
        UID: "",
        DOB: ''
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.DriverReducer.PostDataMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        updateMsg: state.DriverReducer.updateMessage,
        pageField: state.CommonPageFieldReducer.pageField
    }));

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
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
            breadcrumbReturn({dispatch,userAcc});
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
                const { id, Name, DOB, UID, Address } = hasEditVal// new change
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.DOB.valid = true;
                hasValid.UID.valid = true;
                hasValid.Address.valid = true;

                values.Name = Name;
                values.DOB = DOB;
                values.UID = UID;
                values.Address = Address;
                values.id = id

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.DriverMaster))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editDriverTypeSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))
            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.DRIVER_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(getMethod_ForDriverListSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            setState(() => resetFunction(fileds, state))//+++++++++ Clear form values 
            history.push({
                pathname: url.DRIVER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updateDriverTypeIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
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

    const SaveHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                Address: values.Address,
                DOB: values.DOB,
                UID: values.UID,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID()
            });

            saveDissable(true);//save Button Is dissable function

            if (pageMode === mode.edit) {
                dispatch(updateDriverTypeID(jsonBody, values.id));
            }

            else {
                dispatch(PostMethodForDriverMaster(jsonBody));
            }
        }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };// new change

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>

                        <MetaTags>
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={SaveHandler} noValidate>

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
                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label>{fieldLabel.DOB} </Label>
                                                                    <Flatpickr
                                                                        name="DOB"
                                                                        value={values.DOB}
                                                                        className="form-control d-block p-2 bg-white text-dark"
                                                                        placeholder="YYYY-MM-DD"
                                                                        autoComplete="0,''"
                                                                        options={{
                                                                            altInput: true,
                                                                            altFormat: "F j, Y",
                                                                            dateFormat: "Y-m-d",
                                                                            minDate: new Date().fp_incr("n"),
                                                                            maxDate: new Date().fp_incr(0) // 14 days from now"0,''"
                                                                        }}
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

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.UID}</Label>
                                                                <Input
                                                                    name="UID"
                                                                    value={values.UID}
                                                                    type="text"
                                                                    placeholder="Please Enter UID"
                                                                    autoComplete='off'
                                                                    className={isError.UID.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    onChange={(event) => onChangeText({ event, state, setState })}
                                                                />
                                                                {isError.UID.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.UID}</span>
                                                                )}
                                                            </FormGroup>

                                                        </Row>
                                                        <FormGroup className="mt-2">
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton
                                                                        pageMode={pageMode}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"DriverMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>

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