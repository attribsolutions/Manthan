import React, { useEffect, useMemo, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
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
import { Breadcrumb_inputName } from "../../../store/actions";
import {
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    PostMethod_ForCompanyGroupMasterSuccess,
    editCompanyGroupTypeSuccess,
    updateCompanyGroupTypeID,
    PostMethodForCompanyGroupMaster,
    getMethodForCompanyGroupList
} from "../../../store/Administrator/CompanyGroupRedux/action";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { COMPANYGROUP_lIST } from "../../../routes/route_url";
import { UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS } from "../../../store/Administrator/CompanyGroupRedux/actionType";
import SaveButton from "../../../components/Common/CommonSaveButton";


const CompanyGroupMaster = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState();
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modalCss, setModalCss] = useState(false);
    const [Checkbox, setCheckbox] = useState(false);

    {/** Dyanamic Page access state and OnChange function */ }

    const initialFiled = useMemo(() => {

        const fileds = {
            id: "",
            Name: "",
            IsSCM: false
        }
        return initialFiledFunc(fileds)
    }, []);

    const [state, setState] = useState(initialFiled)


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg, updateMsg, pageField, userAccess } = useSelector((state) => ({
        postMsg: state.CompanyGroupReducer.PostDataMessage,
        updateMsg: state.CompanyGroupReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField

    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(3))
    }, []);

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
                debugger
                const { id, Name, IsSCM } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.IsSCM = IsSCM;
                hasValid.Name.valid = true;
                hasValid.IsSCM.valid = true;
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
            }
            dispatch(editCompanyGroupTypeSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

            dispatch(PostMethod_ForCompanyGroupMasterSuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: COMPANYGROUP_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(PostMethod_ForCompanyGroupMasterSuccess({ Status: false }))
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
            history.push({
                pathname: COMPANYGROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS({ Status: false }));
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

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                IsSCM: Checkbox,
                CreatedBy: 1,
                UpdatedBy: 1
            });

            if (pageMode === "edit") {
                dispatch(updateCompanyGroupTypeID(jsonBody, values.id));
                console.log("update data", jsonBody)
            }
            else {
                dispatch(PostMethodForCompanyGroupMaster(jsonBody));
                console.log("post data", jsonBody)
            }
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01"> {fieldLabel.Name}</Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                type="text"
                                                                value={values.Name}
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

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">{fieldLabel.IsSCM}</Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                defaultChecked={values.IsSCM}
                                                                                name="IsSCM"
                                                                                // onChange={(event) => onChangeText({ event, state, setState })}
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
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                        module={"CompanyGroupMaster"}
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
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default CompanyGroupMaster

