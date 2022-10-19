import React, { useEffect, useRef, useState, } from "react";
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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { MetaTags } from "react-meta-tags";
import {
    editEmployeeTypeSuccess,
    PostEmployeeTypeSubmit,
    PostEmployeeTypeSubmitSuccess,
    updateEmployeeTypeID
} from "../../../store/Administrator/EmployeeTypeRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/actions";
import { SaveButton } from "../../../components/CommonSaveButton";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { EMPLOYEETYPE_lIST } from "../../../routes/route_url";


const EmployeeTypesMaster = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history  = useHistory()

    const [pageMode, setPageMode] = useState();
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modalCss, setModalCss] = useState(false);


    const [state, setState] = useState({
        values: {
            id: "",
            Name: "",
            IsPartyConnection: false,
            IsSCM: false
        },
        fieldLabel: {
            Name: "",
            IsPartyConnection: false,
            IsSCM: false
        },

        isError: {
            Name: "",
            IsPartyConnection: false,
            IsSCM: false
        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            IsPartyConnection: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            IsSCM: {
                regExp: '',
                inValidMsg: "",
                valid: false
            }
        },
        required: {

        }
    }
    )

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, pageField, userAccess, } = useSelector((state) => ({
        PostAPIResponse: state.EmployeeTypeReducer.PostEmployeeType,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(115))
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


    useEffect(() => {


        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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
                const { id, Name, IsPartyConnection, IsSCM } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.IsPartyConnection = IsPartyConnection;
                values.IsSCM = IsSCM;
                values.id = id
                hasValid.Name.valid = true;
                hasValid.IsSCM.valid = true;
                hasValid.IsPartyConnection.valid = true;
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(BreadcrumbShow(hasEditVal.Name))
            }
            dispatch(editEmployeeTypeSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {

            dispatch(PostEmployeeTypeSubmitSuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                    RedirectPath: EMPLOYEETYPE_lIST,

                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(PostEmployeeTypeSubmitSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])


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
                IsPartyConnection: values.IsPartyConnection,
                IsSCM: values.IsSCM,
                Description: "sfasfgasd",
                CreatedBy: 1,
                CreatedOn: "2022-07-18T00:00:00",
                UpdatedBy: 1,
                UpdatedOn: "2022-07-18T00:00:00"
            });

            if (pageMode === "edit") {
                dispatch(updateEmployeeTypeID(jsonBody, values.id));
            }
            else {
                dispatch(PostEmployeeTypeSubmit(jsonBody));
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
                    <MetaTags>
                        <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                    <Container fluid>
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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(BreadcrumbShow(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >{fieldLabel.IsPartyConnection}</Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }}>
                                                                        <div className="form-check form-switch form-switch-md mb-3" >
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                value={values.IsPartyConnection}
                                                                                name="IsPartyConnection"
                                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >{fieldLabel.IsSCM} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" >
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                value={values.IsSCM}
                                                                                name="IsSCM"
                                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>

                                                        </Row>
                                                        <FormGroup >
                                                            <Row >
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "EmployeeTypesMaster" })}
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default EmployeeTypesMaster
