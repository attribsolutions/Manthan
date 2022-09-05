import React, { useEffect, useRef, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";

import { MetaTags } from "react-meta-tags";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import { editEmployeeTypeSuccess, PostEmployeeTypeSubmit, PostEmployeeTypeSubmitSuccess, updateEmployeeTypeID } from "../../../store/Administrator/EmployeeTypeRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertState } from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/actions";

const EmployeeTypesMaster = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

//*** "isEditdata get all data from ModuleID for Binding  Form controls
let editDataGatingFromList = props.state;
let propsPageMode = props.pageMode;
let pageModeProps=props.pageMode;

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.EmployeeTypeReducer.PostEmployeeType,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

  }));

   // userAccess useEffect
   useEffect(() => {
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
      setPageMode(pageModeProps);
      dispatch(editEmployeeTypeSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
    }
    else if (!(propsPageMode === undefined)) {
        setPageMode(propsPageMode)
    }

  }, [editDataGatingFromList,propsPageMode])

  useEffect(() => {
    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)&&!(pageMode==="dropdownAdd")) {
     
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
          RedirectPath: '/EmployeeTypeList',

        }))
      }
    }
    else if ((PostAPIResponse.Status === true) && !(pageMode==="dropdownAdd")) {
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

    const FormSubmitButton_Handler = (event, values) => {
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
            dispatch(updateEmployeeTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostEmployeeTypeSubmit(jsonBody));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit")||(pageMode==="copy")||(pageMode==="dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>Employee Type| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                <Container fluid>
                    <Card className="text-black">
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                        </CardHeader>

                        <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                            <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                ref={formRef}
                            >
                                <Row className="">
                                    <Col md={12}>
                                        <Card>
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 ">
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

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >IsPartyConnection </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }}>
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                            defaultChecked={EditData.IsPartyConnection}
                                                                            name="IsPartyConnection"
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
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >IsSCM </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
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
                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <div>
                                                                    {
                                                                        pageMode === "edit" ?
                                                                            userPageAccessState.RoleAccess_IsEdit ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
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
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
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
                                                </Row>

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

export default EmployeeTypesMaster
