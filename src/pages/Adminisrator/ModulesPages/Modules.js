import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
    CardHeader,
    FormGroup,
    Input,
} from "reactstrap";
import {
    AvForm,
    AvInput,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
    PostModelsSubmit,
    updateModuleID,
    PostModelsSubmitSuccess,
    editModuleIDSuccess,
} from "../../../store/Administrator/ModulesRedux/actions";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField } from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/CommonSaveButton";
import { MODULE_lIST } from "../../../routes/route_url";
import { comAddPageFieldFunc, formValid, onChangeText } from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";

const Modules = (props) => {
debugger
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    let editDataGatingFromList = props.state;
    let propsPageMode = props.pageMode;
    let pageModeProps = props.pageMode


    const [modalCss, setModalCss] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, pageField, userAccess } = useSelector((state) => ({
        PostAPIResponse: state.Modules.modulesSubmitSuccesss,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField

    }));

    useEffect(() => {
        dispatch(commonPageField(14))
    }, []);

    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            id: "",
            DisplayIndex: "",
            isActive: "",
            Icon: ""

        },
        fieldLabel: {
            Name: '',
            DisplayIndex: '',
            isActive: '',
            Icon: ''
        },

        isError: {
            Name: "",
            DisplayIndex: "",
            isActive: "",
            Icon: ""
        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            DisplayIndex: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            isActive: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            Icon: {
                regExp: '',
                inValidMsg: "",
                valid: false
            }

        },
        required: {

        }
    })
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


    // userAccess useEffect
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

                const { id, Name, DisplayIndex, isActive, Icon } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.DisplayIndex = DisplayIndex;
                values.isActive = isActive;
                values.Icon = Icon;
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(BreadcrumbShow(hasEditVal.Modules))

            }
            dispatch(editModuleIDSuccess({ Status: false }))
        }
    }, [])

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
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
                    RedirectPath: MODULE_lIST,

                }))
            }
        } else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
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

    //'Save' And 'Update' Button Handller
    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                DisplayIndex: values.DisplayIndex,
                isActive: values.isActive,
                Icon: values.Icon,
                CreatedBy: 9,
                UpdatedBy: 9
            });

            if (pageMode === 'edit') {
                dispatch(updateModuleID(jsonBody, values.id));
            }
            else {
                dispatch(PostModelsSubmit(jsonBody));
            }
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    let IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                    <Container fluid  >

                        <Card className="text-black" >
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                                    <Row className="">
                                        <Col md={12}  >
                                            <Card >
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
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
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.DisplayIndex} </Label>
                                                            <Input name="DisplayIndex" autoComplete='off'
                                                                placeholder="Please Enter DisplayIndex"
                                                                value={values.DisplayIndex}
                                                                 type="text"
                                                                 className={isError.DisplayIndex.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                 onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(BreadcrumbShow(event.target.value))
                                                                }}
                                                            />
                                                              {isError.DisplayIndex.length > 0 && (
                                                                <span className="invalid-feedback">{isError.DisplayIndex}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Icon} </Label>
                                                            <Input name="Icon"
                                                                autoComplete='off'
                                                                placeholder="Please Enter IconPath"
                                                                value={values.Icon} 
                                                                type="text"
                                                                className={isError.Icon.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(BreadcrumbShow(event.target.value))
                                                                }}
                                                            />
                                                             {isError.Icon.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Icon}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <FormGroup className="mb-2 col col-sm-5">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.isActive}  </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                            <div className="form-check form-switch form-switch-md mb-3" >
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                value={values.isActive}
                                                                                name="isActive"
                                                                                onChange={(event) => onChangeText({ event, state, setState })}
                                                                            />
                                                                        </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                {SaveButton({ pageMode, userPageAccessState, module: "Modules" })}
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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default Modules
// if (!(userPageAccessState === '')) {

// }
// else {
//     return (
//         <React.Fragment></React.Fragment>
//     )
// }