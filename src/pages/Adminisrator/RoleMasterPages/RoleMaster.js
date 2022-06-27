import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, } from "reactstrap";
import { AvForm, AvGroup, AvField } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID,PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { AddUserMessage, } = useSelector((state) => ({
    AddUserMessage: state.RoleMaster_Reducer.AddUserMessage,
  }));
  
    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      dispatch(editSuccess({ Status: false }))
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
                RedirectPath: '/rolesList',
                AfterResponseAction: false
            }))
        }
    } 
    else if (AddUserMessage.Status === true) {
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
            Type: 4,
            Status: true,
            Message: "error Message",
            RedirectPath: false,
            AfterResponseAction: false
        }));
    }
}, [AddUserMessage.Status])

    //'Save' And 'Update' Button Handller
  const handleValidUpdate = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Description: values.Description,
        isActive: values.isActive,
        Dashboard: values.Dashboard,
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      }),
    };
    if (IsEdit) {
      dispatch(updateID(requestOptions.body, EditData.ID));
    }
    else {
      dispatch(postRole(requestOptions.body));
    }
  };

 // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (IsEdit === true) { IsEditMode_Css = "-3.5%" };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
        <Breadcrumbs breadcrumbItem={"Role Master "} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidUpdate(e, v);
                    }}
                    ref={formRef}
                  >
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField name="Name" id="txtName"
                            value={EditData.Name}
                            type="text"
                            placeholder="Please Enter Name"
                            autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Name...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Description
                        </Label>
                        <Col sm={4}>
                          <AvField name="Description" id="txtName"
                            value={EditData.Description}
                            type="text"
                            placeholder="Please Enter Discription"
                            autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Discription...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Dashboard
                        </Label>
                        <Col sm={4}>
                          <AvField name="Dashboard" id="txtName"
                            value={EditData.Dashboard}
                            type="text"
                            placeholder="Please Enter Dashboard"
                            autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Dashboard...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          IsActive
                        </Label>
                        <Col sm={4}>
                          <AvField name="isActive"
                            checked={(EditData.ID === 0) ? false : EditData.isActive}
                            type="checkbox" validate={{
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <Row className="justify-content-end">
                      <Col sm={10}></Col>
                      <Col sm={2}>
                        <div>
                          {
                            IsEdit ? (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                                className="btn btn-success w-md"
                              >
                                <i class="fas fa-edit me-2"></i>Update
                              </button>) : (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                className="btn btn-success w-md"
                              > <i className="fas fa-save me-2"></i> Save
                              </button>
                            )
                          }
                        </div>
                      </Col>
                    </Row>
                  </AvForm>
                  <div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
export default RoleMaster
