import React, { useEffect, useMemo, useRef, useState } from "react";
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
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { useDispatch, useSelector } from "react-redux";
import {useHistory } from "react-router-dom";
import { Breadcrumb_inputName, AlertState, commonPageField } from "../../../store/actions";
import {
    editPartyTypeSuccess,
    PostPartyTypeAPISuccess,
    getPartyTypelist,
    updatePartyTypeID,
    PostPartyTypeAPI,
} from "../../../store/Administrator/PartyTypeRedux/action";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { PARTYTYPE_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { createdBy } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


const PartyType = (props) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const { PostAPIResponse,  pageField, userAccess } =
        useSelector((state) => ({
            PostAPIResponse: state.PartyTypeReducer.PostData,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
        }));

    useEffect(() => {
        dispatch(commonPageField(31))
    }, []);

    {/** Dyanamic Page access state and OnChange function */ }
    const initialFiled = useMemo(() => {

        const fileds = {
            id: "",
            Name: "",
            IsSCM: false,
            IsDivision: false,
        }
        return initialFiledFunc(fileds)
    }, []);

    const [state, setState] = useState(initialFiled)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


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
        dispatch(getPartyTypelist());
    }, [dispatch]);


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

                const { id, Name, IsSCM, IsDivision } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.IsSCM = IsSCM;
                values.IsDivision = IsDivision;
                values.id = id
                hasValid.Name.valid = true;
                hasValid.IsSCM.valid = true;
                hasValid.IsDivision.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))

            }
            dispatch(editPartyTypeSuccess({ Status: false }))
        }
    }, [])


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
                    RedirectPath: PARTYTYPE_lIST,

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
                IsSCM: values.IsSCM,
                IsDivision: values.IsDivision,
                CreatedBy: createdBy(),
                CreatedOn: "2022-07-18T00:00:00",
                UpdatedBy: createdBy(),
                UpdatedOn: "2022-07-18T00:00:00"
            });
            console.log("jsonBody", jsonBody)

            if (pageMode === "edit") {
                dispatch(updatePartyTypeID(jsonBody, values.id));
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
                    <Breadcrumb pageHeading={userPageAccessState.PageHeading} />
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
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsSCM} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                checked={values.IsSCM}
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
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsDivision} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                defaultChecked={values.IsDivision}
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

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                        module={"PartyType"}
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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartyType



