import React, { useEffect, useRef, useState } from "react";
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
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvField, AvForm, AvInput, } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { BreadcrumbShow, AlertState, commonPageField } from "../../../store/actions";
import {
    editPartyTypeSuccess,
    PostPartyTypeAPISuccess,
    getPartyTypelist,
    updatePartyTypeID,
    PostPartyTypeAPI,
} from "../../../store/Administrator/PartyTypeRedux/action";
import {
    comAddPageFieldFunc,
    formValChange,
    formValid,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/CommonSaveButton";


const PartyType = (props) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");


    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let propsPageMode = props.pageMode;

    //Access redux store Data /  'save_ModuleSuccess' action data

    const { PostAPIResponse, PartyTypes, pageField, RoleAccessModifiedinSingleArray } =
        useSelector((state) => ({
            PostAPIResponse: state.PartyTypeReducer.PostData,
            PartyTypes: state.PartyMasterReducer.PartyTypes,
            pageField: state.CommonPageFieldReducer.pageField,
            RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        }));

    useEffect(() => {
        dispatch(commonPageField(53))
    }, []);

    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            IsSCM: "",
            IsDivision: "",
        },
        fieldLabel: {
            Name: '',
            IsSCM: '',
            IsDivision: '',
        },

        isError: {
            Name: "",
            IsSCM: "",
            IsDivision: "",
        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            IsSCM: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            IsDivision:{
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


    // userAccess useEffect
    useEffect(() => {
        let userAcc = undefined;
        if (editDataGatingFromList === undefined) {
            let locationPath = history.location.pathname;
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return `/${inx.ActualPagePath}` === locationPath;
            });
        } else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage;
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return `/${inx.ActualPagePath}` === relatatedPage;
            });
        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc);
        }
    }, [RoleAccessModifiedinSingleArray]);

    useEffect(() => {
        dispatch(getPartyTypelist());
    }, [dispatch]);


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        if (!(userPageAccessState === "")) {
            document.getElementById("txtName").focus();
        }
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setPageMode("edit");
            dispatch(editPartyTypeSuccess({ Status: false }));
            dispatch(BreadcrumbShow(editDataGatingFromList.Name));
        } else if (!(propsPageMode === undefined)) {
            setPageMode(propsPageMode);
        }
    }, [editDataGatingFromList, propsPageMode]);


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            // setpartyType_dropdown_Select('')
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
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
                    RedirectPath: '/PartyTypeList',

                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
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
        if (pageField.length > 0) {
            comAddPageFieldFunc({ state, setState, pageField })
        }
    }, [pageField])


    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            IsSCM: values.IsSCM,
            IsDivision: values.IsDivision,
            CreatedBy: 1,
            CreatedOn: "2022-07-18T00:00:00",
            UpdatedBy: 1,
            UpdatedOn: "2022-07-18T00:00:00"
        });


        if (pageMode === "edit") {
            dispatch(updatePartyTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostPartyTypeAPI(jsonBody));
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
                                                                value={EditData.Name}
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
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsSCM} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                            <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                defaultChecked={EditData.IsSCM}
                                                                                name="IsSCM"
                                                                            // defaultChecked
                                                                            />
                                                                            <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsDivision} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                            <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                defaultChecked={EditData.IsDivision}
                                                                                name="IsDivision"
                                                                            // defaultChecked
                                                                            />
                                                                            <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "PartyType" })}
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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartyType



