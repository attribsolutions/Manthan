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
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import {
    editGroupTypeIdSuccess,
    getGroupTypeslistSuccess,
    PostGroupTypeSubmit,
    PostGroupTypeSubmitSuccess,
    updateGroupTypeID,
    updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import { GROUPTYPE_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/CommonSaveButton";

const GroupTypeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const initialFiled = {
        id: "",
        Name: "",
        IsReserved: ""
    }

    const [state, setState] = useState(initialFiledFunc(initialFiled))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess
    } = useSelector((state) => ({
        postMsg: state.GroupTypeReducer.PostData,
        updateMsg: state.GroupTypeReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(105))
    }, []);

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
                setEditData(hasEditVal);
                const { id, Name, IsReserved } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.IsReserved.valid = true;

                values.id = id
                values.Name = Name;
                values.IsReserved = IsReserved;
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editGroupTypeIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.GroupTypeMaster))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostGroupTypeSubmitSuccess({ Status: false }))
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
                    RedirectPath: GROUPTYPE_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getGroupTypeslistSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: GROUPTYPE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGroupTypeIDSuccess({ Status: false }));
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
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {

        event.preventDefault();
        if (formValid(state, setState)) {
            debugger
            const jsonBody = JSON.stringify({
                Name: values.Name,
                IsReserved: values.IsReserved,
                CreatedBy: 1,
                CreatedOn: "0002-10-03T12:48:14.910491",
                UpdatedBy: 1,
                UpdatedOn: "0002-10-03T12:48:14.910491"

            });

            if (pageMode === 'edit') {
                dispatch(updateGroupTypeID(jsonBody, EditData.id));
            }
            else {
                dispatch(PostGroupTypeSubmit(jsonBody));
            }
        }
    };


    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>GroupTypeMaster | FoodERP-React FrontEnd</title>
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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                id="txtName"
                                                                name="Name"
                                                                type="text"
                                                                value={values.Name}
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
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
                                                            <FormGroup className="mb-2 col col-sm-3">
                                                                <Row className="justify-content-md-left">
                                                                    <Label className="col-sm-4 col-form-label" >{fieldLabel.IsReserved}</Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >

                                                                        <div className="form-check form-switch form-switch-md mb-3" >
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                checked={values.IsReserved}
                                                                                name="IsReserved"
                                                                                onChange={(event) => onChangeText({ event, state, setState })}
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
                                                                        module={"GroupTypeMaster"}
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
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default GroupTypeMaster
