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
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import {
    editPartyTypeSuccess,
    SavePartyTypeAPISuccess,
    getPartyTypelist,
    updatePartyTypeAction,
    SavePartyTypeAction,
    updatePartyTypeIDSuccess,
    getPartyTypelistSuccess
} from "../../../store/Administrator/PartyTypeRedux/action";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_Select } from "../../../CustomValidateForm";
import { getCountryList_Action, getCountryList_Success } from "../../../store/Administrator/CountryRedux/action";


const PartyType = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        id: "",
        Name: "",
        SAPIndicator: "",
        IsSCM: _cfunc.loginIsSCMCompany() > 0 ? true : false,
        IsDivision: false,
        IsRetailer: false,
        IsVendor: false,
        IsAdminDivision: false,
        IsFranchises: false,
        CountryName: { value: 1, label: "India" }

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.modeSTPsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg, pageField, updateMsg, userAccess, saveBtnloading, countryList = [], countryListloading } =
        useSelector((state) => ({
            countryList: state.CountryReducer.CountryList,
            countryListloading: state.CountryReducer.loading,
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
        dispatch(getCountryList_Action());
        return () => {
            dispatch(getCountryList_Success());
            dispatch(SavePartyTypeAPISuccess({ Status: false }))

        }
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
                    const { id, Name, IsSCM, IsDivision, IsRetailer, IsVendor, IsAdminDivision, CountryID, CountryName, IsFranchises, SAPIndicator } = hasEditVal
                    const { values, fieldLabel, hasValid, required, isError } = { ...state }
                    values.Name = Name;
                    values.IsSCM = IsSCM;
                    values.IsDivision = IsDivision;
                    values.IsRetailer = IsRetailer
                    values.IsVendor = IsVendor
                    values.IsAdminDivision = IsAdminDivision
                    values.IsFranchises = IsFranchises
                    values.SAPIndicator = SAPIndicator
                    values.CountryName = CountryID !== null && { label: CountryName, value: CountryID }


                    values.id = id
                    hasValid.Name.valid = true;
                    hasValid.IsSCM.valid = true;
                    hasValid.IsDivision.valid = true;
                    hasValid.IsRetailer.valid = true
                    hasValid.IsVendor.valid = true
                    hasValid.IsAdminDivision.valid = true
                    hasValid.CountryName.valid = true
                    hasValid.IsFranchises.valid = true
                    hasValid.SAPIndicator.valid = true

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
           
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
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

    const CountryListOptions = countryList?.map((data) => ({
        value: data.id,
        label: data.Country
    }));

    const SaveHandler = (event) => {
        event.preventDefault();
        const btnId = event.target.id;
        _cfunc.btnIsDissablefunc({ btnId, state: true })
        try {
            if (formValid(state, setState)) {
                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    IsSCM: values.IsSCM,
                    IsDivision: values.IsDivision,
                    IsRetailer: values.IsRetailer,
                    IsVendor: values.IsVendor,
                    Country: values.CountryName.value,
                    IsFranchises: values.IsFranchises,
                    SAPIndicator: values.SAPIndicator,
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
            _cfunc.btnIsDissablefunc({ btnId:btnId, state: false })
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>

                                    <Col md={12}>
                                        <Card>
                                            <CardBody className="c_card_body">
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6 ">
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
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.CountryName} </Label>
                                                            <C_Select
                                                                name="CountryName"
                                                                value={values.CountryName}
                                                                isSearchable={true}
                                                                isLoading={countryListloading}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={CountryListOptions}
                                                                onChange={(hasSelect, evn) => {
                                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                                }}
                                                            />
                                                            {/* {isError.CountryName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.CountryName}</small></span>
                                                            )} */}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.SAPIndicator} </Label>
                                                            <Input
                                                                name="SAPIndicator"
                                                                value={values.SAPIndicator}
                                                                type="text"
                                                                className={isError.SAPIndicator.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter SAP Indicator"
                                                                autoComplete='off'
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                }}
                                                            />
                                                            {isError.SAPIndicator.length > 0 && (
                                                                <span className="invalid-feedback">{isError.SAPIndicator}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-6 col-form-label" >{fieldLabel.IsSCM} </Label>
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
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-6 col-form-label" >{fieldLabel.IsDivision} </Label>
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
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-6 col-form-label" >{fieldLabel.IsRetailer} </Label>
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
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-6 col-form-label" >{fieldLabel.IsVendor} </Label>
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
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label className="col-sm-6 col-form-label" >{fieldLabel.IsFranchises} </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3">
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            checked={values.IsFranchises}
                                                                            name="IsFranchises"
                                                                            onChange={(e) => {
                                                                                setState((i) => {
                                                                                    const a = { ...i }
                                                                                    a.values.IsFranchises = e.target.checked;
                                                                                    return a
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup className="mb-2 col col-sm-6">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-6 col-form-label" >{fieldLabel.IsAdminDivision} </Label>
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
                                                    </Col>
                                                </Row>

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



