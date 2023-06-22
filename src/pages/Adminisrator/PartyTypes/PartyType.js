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
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Breadcrumb_inputName,
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import {
    editPartyTypeSuccess,
    SavePartyTypeAPISuccess,
    getPartyTypelist,
    updatePartyTypeAction,
    SavePartyTypeAction,
    updatePartyTypeIDSuccess
} from "../../../store/Administrator/PartyTypeRedux/action";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";


const PartyType = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        id: "",
        Name: "",
        IsSCM: _cfunc.loginIsSCMCompany() > 0 ? true : false,
        IsDivision: false,
        IsRetailer: false,
        IsVendor: false,
        IsAdminDivision: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.modeSTPsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg, pageField, updateMsg, userAccess, saveBtnloading } =
        useSelector((state) => ({
            saveBtnloading: state.PartyTypeReducer.saveBtnloading,
            postMsg: state.PartyTypeReducer.PostData,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
            updateMsg: state.PartyTypeReducer.updateMessage
        }));

    useEffect(() => {
        const page_Id = pageId.PARTYTYPE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyTypelist());
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
       
        if (!(props.pageMode === mode.dropdownAdd)) {
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
                    const { id, Name, IsSCM, IsDivision, IsRetailer, IsVendor, IsAdminDivision } = hasEditVal
                    const { values, fieldLabel, hasValid, required, isError } = { ...state }
                    values.Name = Name;
                    values.IsSCM = IsSCM;
                    values.IsDivision = IsDivision;
                    values.IsRetailer = IsRetailer
                    values.IsVendor = IsVendor
                    values.IsAdminDivision = IsAdminDivision

                    values.id = id
                    hasValid.Name.valid = true;
                    hasValid.IsSCM.valid = true;
                    hasValid.IsDivision.valid = true;
                    hasValid.IsRetailer.valid = true
                    hasValid.IsVendor.valid = true
                    hasValid.IsAdminDivision.valid = true

                    setState({ values, fieldLabel, hasValid, required, isError })
                    dispatch(Breadcrumb_inputName(hasEditVal.Name))
                    seteditCreatedBy(hasEditVal.CreatedBy)
                }
                dispatch(editPartyTypeSuccess({ Status: false }))
            }
        }

    }, [])


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SavePartyTypeAPISuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                // history.push({
                //     Data: postMsg.Data
                // })
                dispatch(getPartyTypelist())

                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.PARTYTYPE_lIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.PARTYTYPE_lIST }) }
            }

        } else if
            (postMsg.Status === true) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values 
            history.push({
                pathname: url.PARTYTYPE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {

            dispatch(updatePartyTypeIDSuccess({ Status: false }));

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

    const SaveHandler = (event) => {
        event.preventDefault();
        const btnId = event.target.id;
        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    IsSCM: values.IsSCM,
                    IsDivision: values.IsDivision,
                    IsRetailer: values.IsRetailer,
                    IsVendor: values.IsVendor,
                    IsAdminDivision: values.IsAdminDivision,
                    Company: _cfunc.loginCompanyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                });
                if (pageMode === mode.edit) {
                    dispatch(updatePartyTypeAction({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(SavePartyTypeAction({ jsonBody, btnId }));
                }
            }
        } catch (error) {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    {/* <Row className=""> */}
                                    <Col md={12}>
                                        <Card>
                                            <CardBody className="c_card_body">
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                        <Input
                                                            name="Name"
                                                            id="txtName"
                                                            value={values.Name}
                                                            type="text"
                                                            className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                            autoFocus={true}
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
                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-sm-5 col-form-label" >{fieldLabel.IsSCM} </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-2">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsSCM}
                                                                        disabled={_cfunc.loginIsSCMCompany() > 0 ? true : false}
                                                                        name="IsSCM"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsSCM = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-sm-5 col-form-label" >{fieldLabel.IsDivision} </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsDivision}
                                                                        name="IsDivision"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsDivision = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Row>

                                                {/* <Row>
                                                    
                                                </Row> */}

                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-sm-5 col-form-label" >{fieldLabel.IsRetailer} </Label>
                                                            <Col md={1} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsRetailer}
                                                                        name="IsRetailer"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsRetailer = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-sm-5 col-form-label" >{fieldLabel.IsVendor} </Label>
                                                            <Col md={1} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsVendor}
                                                                        name="IsVendor"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsVendor = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Row>

                                                {/* <Row>
                                                    <FormGroup className="mb-2 col col-sm-5">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsVendor} </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsVendor}
                                                                        name="IsVendor"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsVendor = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Row> */}

                                                {/* <Row>
                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-sm-5 col-form-label" >{fieldLabel.IsAdminDivision} </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        name="IsAdminDivision"
                                                                        checked={values.IsAdminDivision}
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsAdminDivision = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Row> */}

                                                <FormGroup>
                                                    <Row>
                                                        <Col sm={2}>
                                                            <SaveButton pageMode={pageMode}
                                                                loading={saveBtnloading}
                                                                onClick={SaveHandler}
                                                                userAcc={userPageAccessState}
                                                                editCreatedBy={editCreatedBy}
                                                                module={"PartyType"}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </FormGroup >

                                            </CardBody>
                                        </Card>
                                    </Col>
                                    {/* </Row> */}
                                </form>
                            </CardBody>
                        </Card>

                    </Container>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartyType



