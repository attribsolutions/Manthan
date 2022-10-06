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
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";

import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr"
import {
    comAddPageFieldFunc,
    formValid,
    onChangeText,
    onChangeDate
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { editGroupTypeIdSuccess, getGroupTypeslistSuccess, PostGroupTypeSubmit, PostGroupTypeSubmitSuccess, updateGroupTypeID } from "../../../store/Administrator/GroupTypeRedux/action";

const GroupTypeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    let editDataGetingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const [pageMode, setPageMode] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [EditData, setEditData] = useState([]);
    const [DOB_Date_Select, setDOB_Date_Select] = useState("");
    // ////////////////////////////////////
    const [state, setState] = useState({
        values: {
            Name: "",
        },
        fieldLabel: {
            Name: "",
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
    }
    )
    //////////////////////////


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        PostAPIResponse,
        pageField,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        PostAPIResponse: state.DriverReducer.PostDataMessage,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    console.log("pageField", pageField)

    useEffect(() => {
        // dispatch(commonPageFieldSuccess([]));
        dispatch(commonPageField(91))
    }, []);

    //userAccess useEffect
    useEffect(() => {
        let userAcc = undefined
        if ((editDataGetingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGetingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGetingFromList === undefined)) {
            const { Name } = editDataGetingFromList
            const { values, fieldLabel, hasValid, required, isError } = { ...state }
            values.Name = Name;


            setState({ values, fieldLabel, hasValid, required, isError })

            // setEditData(editDataGetingFromList);
            setPageMode(pageModeProps);
            // setDOB_Date_Select(editDataGetingFromList.DOB)

            dispatch(editGroupTypeIdSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGetingFromList.DriverMaster))
            return
        }
    }, [editDataGetingFromList])



    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostGroupTypeSubmitSuccess({ Status: false }))
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
                    RedirectPath: '/DriverList',
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(getGroupTypeslistSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])



    // ////////////////////////////////////////////////////////////
    useEffect(() => {
        if (pageField.length > 0) {
            comAddPageFieldFunc({ state, setState, pageField })
        }
    }, [pageField])


    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;



    const formSubmitHandler = (event) => {
        debugger
        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({
                Name: values.Name,
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
                console.log("jsonBody",jsonBody)
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
                                                                    <div>
                                                                        {
                                                                            pageMode === "edit" ?
                                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
                                                                                        className="btn btn-success w-md mt-3"
                                                                                    >
                                                                                        <i class="fas fa-edit me-2"></i>Update
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                                : (

                                                                                    userPageAccessState.RoleAccess_IsSave ?
                                                                                        <button
                                                                                            type="submit"
                                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
                                                                                            className="btn btn-primary w-md mt-3 "
                                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                                        </button>
                                                                                        :
                                                                                        <></>
                                                                                )
                                                                        }
                                                                    </div>
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

export default GroupTypeMaster
