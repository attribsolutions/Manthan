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
import { AlertState } from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const Modules = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    let editDataGatingFromList = props.state;
    let propsPageMode = props.pageMode;

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.Modules.modulesSubmitSuccesss,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

    }));

    // userAccess useEffect
    useEffect(() => {

        // if ((editDataGatingFromList === undefined)) {
        //     const userAcc = CommonGetRoleAccessFunction(history)
            
        //     if (!(userAcc === undefined)) {
        //         setUserPageAccessState(userAcc)
        //     }
        // } else {
        //     let RelatedPageID = history.location.state.UserDetails.RelatedPageID
        //     const userfound = RoleAccessModifiedinSingleArray.find((element) => {
        //         return element.id === RelatedPageID
        //     })
        //     setUserPageAccessState(userfound)
        // }

///////////////

        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {
    
          let locationPath = history.location.pathname
          userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
          })
        }
        else if (!(editDataGatingFromList === undefined)) {
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

        if (!(editDataGatingFromList === undefined)) {

            setEditData(editDataGatingFromList);
            setPageMode("edit");
            dispatch(editModuleIDSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.Name))
           
        }
        else if (!(propsPageMode === undefined)) {
            setPageMode(propsPageMode)
            
        }
    }, [editDataGatingFromList, propsPageMode])

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)&&!(pageMode==="dropdownAdd")) {
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
                    RedirectPath: '/ModuleList',

                }))
            }
        } else if ((PostAPIResponse.Status === true) && !(pageMode==="dropdownAdd")) {
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


    //'Save' And 'Update' Button Handller
    const FormSubmitButton_Handler = (event, values) => {

        const jsonBody = JSON.stringify({
            Name: values.Name,
            DisplayIndex: values.DisplayIndex,
            isActive: values.IsActive,
            Icon: values.Icon,
            CreatedBy: 9,
            UpdatedBy: 9
        });

        if (pageMode === 'edit') {
            dispatch(updateModuleID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostModelsSubmit(jsonBody));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    let IsEditMode_Css = ''
    if (pageMode === "edit" || pageMode == "dropdownAdd") { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>Module| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                    <Container fluid  >

                        <Card className="text-black" >
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                    ref={formRef}
                                >

                                    <Row className="">
                                        <Col md={12}  >
                                            <Card >
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <AvField
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Name' },
                                                                }}
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">Display Index </Label>
                                                            <AvField name="DisplayIndex" autoComplete='off'
                                                                placeholder="Please Enter DisplayIndex"
                                                                value={EditData.DisplayIndex} type="text"
                                                                validate={{
                                                                    number: true,
                                                                    required: { value: true, errorMessage: 'Display Index is Required' },
                                                                    tel: {
                                                                        pattern: /^\d{1,4}$/,
                                                                        errorMessage: 'Only Number is Required (Only Two Digit) '
                                                                    }
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">Icon </Label>
                                                            <AvField name="Icon"
                                                                autoComplete='off'
                                                                placeholder="Please Enter IconPath"
                                                                value={EditData.Icon} type="text" validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Icon' },
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </Row>

                                                    <FormGroup className="mb-2 col col-sm-5">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >Active </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                        defaultChecked={EditData.isActive}
                                                                        name="IsActive"
                                                                    // defaultChecked
                                                                    />
                                                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <div>
                                                                    {
                                                                        pageMode === "edit" ?
                                                                            userPageAccessState.RoleAccess_IsEdit ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
                                                                                    className="btn btn-success w-md"
                                                                                >
                                                                                    <i class="fas fa-edit me-2"></i>Update
                                                                                </button>
                                                                                :
                                                                                <></>
                                                                            : (
                                                                                userPageAccessState.RoleAccess_IsSave ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                                                                        className="btn btn-primary w-md"
                                                                                    > <i className="fas fa-save me-2"></i> Save
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                            )
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup >
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </AvForm>
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