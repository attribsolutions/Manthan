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

import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import { editCountry_ID_Success, getCountryList_Action, saveCountryMaster_Action, saveCountryMaster_Success, updateCountry_ID_Action, updateCountry_ID_Success } from "../../../store/Administrator/CountryRedux/action";

const CountryMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Country: "",
        Currency: "",
        CurrencySymbol: "",
        Weight: '',
        IsTaxApplicable: false

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
        saveBtnloading: state.CountryReducer.saveBtnloading,
        postMsg: state.CountryReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        updateMsg: state.CountryReducer.updateMessage,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        const page_Id = pageId.COUNTRY_MASTER
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

                const { id, Country, Currency, CurrencySymbol, Weight, IsTaxApplicable } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Country.valid = true;
                hasValid.Currency.valid = true;
                hasValid.CurrencySymbol.valid = true;
                hasValid.Weight.valid = true;
                hasValid.IsTaxApplicable.valid = true;

                values.Country = Country;
                values.Currency = Currency;
                values.CurrencySymbol = CurrencySymbol;
                values.Weight = Weight;
                values.IsTaxApplicable = IsTaxApplicable;
                values.id = id;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.CountryMaster))
                seteditCreatedBy(hasEditVal?.CreatedBy)
            }
            dispatch(editCountry_ID_Success({ Status: false }))
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: true }))//change party drop-down disable when edit/view
        }
        return () => {
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: false }))//change party drop-down restore state
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCountryMaster_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            dispatch(Breadcrumb_inputName(''))
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

                dispatch(getCountryList_Action());

                props.isOpenModal(false)
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.COUNTRY_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCountryMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200) {

            setState(() => resetFunction(fileds, state))//+++++++++ Clear form values 
            history.push({
                pathname: url.COUNTRY_LIST,
            })
            dispatch(getCountryList_Action());
        } else if (updateMsg.Status === true) {
            dispatch(updateCountry_ID_Success({ Status: false }));
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

            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify([{
                    "Country": values.Country,
                    "Currency": values.Currency,
                    "CurrencySymbol": values.CurrencySymbol,
                    "Weight": values.Weight,
                    "IsTaxApplicable": values.IsTaxApplicable

                }]);

                if (pageMode === mode.edit) {
                    dispatch(updateCountry_ID_Action({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveCountryMaster_Action({ jsonBody, btnId }));
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

                <div className="page-content" >
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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Country} </Label>
                                                            <Input
                                                                id="txtName"
                                                                name="Country"
                                                                type="text"
                                                                value={values.Country}
                                                                autoFocus={true}
                                                                autoComplete='off'
                                                                className={isError.Country.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Country"
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Country.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Country}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Currency} </Label>
                                                            <Input
                                                                id="txtName"
                                                                name="Currency"
                                                                type="text"
                                                                value={values.Currency}
                                                                autoFocus={true}
                                                                autoComplete='off'
                                                                className={isError.Currency.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Currency"
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Currency.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Currency}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>


                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.CurrencySymbol} </Label>
                                                            <Input
                                                                name="CurrencySymbol"
                                                                value={values.CurrencySymbol}
                                                                type="text"
                                                                className={isError.CurrencySymbol.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Currency Symbol"
                                                                autoComplete='off'
                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                            />
                                                            {isError.CurrencySymbol.length > 0 && (
                                                                <span className="invalid-feedback">{isError.CurrencySymbol}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Weight} </Label>
                                                            <Input
                                                                name="Weight"
                                                                value={values.Weight}
                                                                type="text"
                                                                className={isError.Weight.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Weight"
                                                                autoComplete='off'
                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                            />
                                                            {isError.Weight.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Weight}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-5 col-form-label" >{fieldLabel.IsTaxApplicable} </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" >
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            name="IsTaxApplicable"
                                                                            checked={values.IsTaxApplicable}
                                                                            onChange={(e) => {
                                                                                setState((i) => {
                                                                                    const a = { ...i }
                                                                                    a.values.IsTaxApplicable = e.target.checked;
                                                                                    return a
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
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
                                                                    module={"CountryMaster"}
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

export default CountryMaster
