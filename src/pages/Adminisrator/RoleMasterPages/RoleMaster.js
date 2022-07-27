import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID, PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";

const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const userPageAccess = history.location.state

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);
  const [pageHeading, setPageHeading] = useState({ PageHeading: "", PageDescription: "", PageDescriptionDetails: "" });

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { AddUserMessage, } = useSelector((state) => ({
    AddUserMessage: state.RoleMaster_Reducer.AddUserMessage,
  }));

  useEffect(() => {

    if ((userPageAccess === undefined)) {

      history.push("/Dashboard")
    }
    else {
      if (!(userPageAccess.fromDashboardAccess)) {
        history.push("/Dashboard")
      }
      debugger
      setPageHeading(userPageAccess.label)
    };
  }, [props])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      dispatch(editSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {
    if ((AddUserMessage.Status === true) && (AddUserMessage.StatusCode === 200)) {
      dispatch(PostSuccess({ Status: false }))
      formRef.current.reset();
      if (PageMode === true) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: AddUserMessage.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: AddUserMessage.Message,
          RedirectPath: '/roleList',
          AfterResponseAction: false
        }))
      }
    }
    else if (AddUserMessage.Status === true) {
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(AddUserMessage.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [AddUserMessage.Status])

  //'Save' And 'Update' Button Handller
  const handleValidUpdate = (event, values) => {
    debugger
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Description: values.Description,
        isActive: values.isActive,
        Dashboard: values.Dashboard,
        isSCMRole: values.isSCMRole,
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      }),
    };

    if (IsEdit) {
      dispatch(updateID(requestOptions.body, EditData.id));
    }
    else {
      dispatch(postRole(requestOptions.body));

    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (IsEdit === true) { IsEditMode_Css = "-5.5%" };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Role Master| FoodERP-React FrontEnd</title>
      </MetaTags>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
      <Breadcrumbs breadcrumbItem={pageHeading.PageHeading} />
        <Container fluid>
          <Card>
            <CardHeader
              className="card-header   text-black"
              style={{ backgroundColor: "#dddddd" }}
            >
              <h4 className="card-title text-black">{pageHeading.PageDescription}</h4>
              <p className="card-title-desc text-black">{pageHeading.PageDescriptionDetails}</p>
            </CardHeader>
            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
              <AvForm onValidSubmit={(e, v) => { handleValidUpdate(e, v) }}
                ref={formRef}
              >
                <Row>
                  <Col md={12}  >
                    <Card >
                      <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Name </Label>
                            <AvField name="Name" id="txtName"
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
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Description </Label>
                            <AvField name="Description" id="txtName"
                              value={EditData.Description}
                              type="text"
                              placeholder="Please Enter Description"
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter Description' },
                              }} />
                          </FormGroup>
                        </Row>

                        <Row>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Dashboard </Label>
                            <AvField name="Dashboard" id="txtName"
                              value={EditData.Dashboard}
                              type="text"
                              placeholder="Please Enter Dashboard"
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter Dashboard' },
                              }} />
                          </FormGroup>
                        </Row>

                        <FormGroup className="mb-2 col col-sm-5">
                          <Row className="justify-content-md-left">
                            <Label className="col-sm-3 col-form-label" >Is SCM Role </Label>
                            <Col md={2} style={{ marginTop: '9px' }} >

                              <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <AvInput type="checkbox" className="form-check-input"
                                  checked={EditData.isSCMRole}
                                  name="isSCMRole"
                                />
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>

                        <FormGroup className="mb-2 col col-sm-5">
                          <Row className="justify-content-md-left">
                            <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                            <Col md={2} style={{ marginTop: '9px' }} >

                              <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                  checked={EditData.isActive}
                                  defaultChecked={true}
                                  name="isActive"
                                />
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>

                        <FormGroup >
                          <Row >

                            <Col sm={2}>
                              <div>
                                {
                                  IsEdit ? (
                                    <button
                                      type="submit"
                                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
                                      className="btn btn-success w-md"
                                    >
                                      <i class="fas fa-edit me-2"></i>Update
                                    </button>) : (
                                    <button
                                      type="submit"
                                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                      className="btn btn-primary w-md"
                                    > <i className="fas fa-save me-2"></i> Save
                                    </button>
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
  );
}
export default RoleMaster
