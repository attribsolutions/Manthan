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
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    saveSalesManMaster,
    saveSalesManMasterSuccess,
    editSalesManIDSuccess,
    updateSalesManID,
    getSalesManlistSuccess,
    updateSalesManIDSuccess,
} from "../../../store/Administrator/SalesManRedux/actions";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginCompanyID, loginPartyID, loginUserID, btnIsDissablefunc, loginRoleID, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import PartyDropdownMaster from "../../../components/Common/PartyDropdownComp/PartyDropdown";

const SalesManMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const RoleID = loginRoleID()

    const fileds = {
        id: "",
        Name: "",
        MobileNo: "",
        Party: '',
        IsActive: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.SalesManReducer.PostData,
            updateMsg: state.SalesManReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.SALESMAN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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

                const { id, Name, IsActive, MobileNo, Party, PartyName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.id = id;
                values.MobileNo = MobileNo;
                values.IsActive = IsActive
                hasValid.Party.valid = true;

                hasValid.Name.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.MobileNo.valid = true;
                values.Party = { value: Party, label: PartyName }

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editSalesManIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesManMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state)) // Clear form values 
            dispatch(Breadcrumb_inputName(''))
            if (pageMode === "other") {
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
                    RedirectPath: url.SALESMAN_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getSalesManlistSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.SALESMAN_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSalesManIDSuccess({ Status: false }));
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

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    MobileNo: values.MobileNo,
                    IsActive: values.IsActive,
                    Party: RoleID === 2 ? values.Party.value : loginPartyID(),
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateSalesManID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveSalesManMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                   <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        {RoleID === 2 ?
                            <PartyDropdownMaster
                                state={state}
                                setState={setState} />
                            : null}
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header">
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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete="off"
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
                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Mobile Number </Label>
                                                            <Input
                                                                name="MobileNo"
                                                                value={values.MobileNo}
                                                                type="text"
                                                                className={isError.MobileNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Mobile"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                }}
                                                            />
                                                            {isError.MobileNo.length > 0 && (
                                                                <span className="invalid-feedback">{isError.MobileNo}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    {/* {RoleID === 2 ?
                                                        <Row>
                                                            <FormGroup className="mt-2 col col-sm-4 ">
                                                                <PartyDropdownMaster
                                                                    fieldLabel={fieldLabel.Party}
                                                                    state={values.Party}
                                                                    setState={setState} />
                                                            </FormGroup>
                                                        </Row>
                                                        : null} */}

                                                    <Row>
                                                        <FormGroup className="mt-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">{fieldLabel.IsActive}</Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3">
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            checked={values.IsActive}
                                                                            name="IsActive"
                                                                            onChange={(e) => {
                                                                                setState((i) => {
                                                                                    const a = { ...i }
                                                                                    a.values.IsActive = e.target.checked;
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
                                                                <SaveButton pageMode={pageMode}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"RoutesMaster"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
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

export default SalesManMaster

