import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, CardHeader, Button, Label, Input } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback, AvField } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID
} from "../../store/Administrator/RoleMasterRedux/action";

const AddRole = (props) => {

  const dispatch = useDispatch();
  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const formRef = useRef(null);
  var isEditData = props.state;

  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(isEditData === undefined)) {
      setEditData(isEditData);
      setIsEdit(true);
      dispatch(editSuccess({ Status: false }))
    }
  }, [IsEdit])

  const { AddUserMessage, } = useSelector((state) => ({
    AddUserMessage: state.RoleMaster_Reducer.AddUserMessage,
  }));

  useEffect(() => {
    if ((AddUserMessage.Status === "true")) {
      dispatch(postRole({ Status: false }))
      formRef.current.reset();
    }
  }, [AddUserMessage.Status])


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

    console.log("values", values)
    if (IsEdit) {
      dispatch(updateID(requestOptions.body, EditData.ID));
    }

    else {
      dispatch(postRole(requestOptions.body));

    }
    console.log("requestOptions", requestOptions.body)

  };

  var IsEditModeSaSS=''
  if(IsEdit===true){IsEditModeSaSS= "-3.5%"};

  return (
    <React.Fragment>
     <div className="page-content" style={{marginTop:IsEditModeSaSS}}>
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
                            // autoComplete='off'
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
                            // autoComplete='off'
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
                            // autoComplete='off'
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
export default AddRole
