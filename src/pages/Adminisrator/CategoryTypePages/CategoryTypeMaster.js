import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
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
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";

import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    PostMethodForCategoryTypeMaster,
    PostMethod_ForCategoryTypeMasterAPISuccess,
    editCategoryTypeIDSuccess,
    updateCategoryTypeID,
    getCategoryTypelistSuccess,
} from "../../../store/Administrator/CategoryTypeRedux/actions";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/CommonSaveButton";
import { CATEGORYTYPE_lIST } from "../../../routes/route_url";

const CategoryTypeMaster = (props) => {
    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();
    const [modalCss, setModalCss] = useState(false);

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);


    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGetingFromList = props.state;
    let pageModeProps = props.pageMode;

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, pageField, userAccess } = useSelector((state) => ({
        PostAPIResponse: state.categoryTypeReducer.PostData,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        dispatch(commonPageField(16))
    }, []);

    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            id: ""

        },
        fieldLabel: {
            Name: '',

        },

        isError: {
            Name: "",

        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
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

    //userAccess useEffect
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        debugger
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

                const { id, Name } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(BreadcrumbShow(hasEditVal.CategoryTypeMaster))

            }
            dispatch(editCategoryTypeIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostMethod_ForCategoryTypeMasterAPISuccess({ Status: false }))


            if (pageMode === "other") {
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
                    RedirectPath: CATEGORYTYPE_lIST,
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(getCategoryTypelistSuccess({ Status: false }))
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

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
            });
            if (pageMode === "edit") {
                dispatch(updateCategoryTypeID(jsonBody, values.id));
            }
            else {
                dispatch(PostMethodForCategoryTypeMaster(jsonBody))
            }

        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete="off"
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(BreadcrumbShow(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "CategoryTypeMaster" })}
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
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default CategoryTypeMaster

