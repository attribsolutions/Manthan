import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, getRoles, addUser, updateID }
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { fetchModelsList } from "../../../store/Administrator/ModulesRedux/actions";


const AddUser = (props) => {

  const dispatch = useDispatch();
  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const [RoleData, setRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");

  // M_Roles DropDown
  const [RoleDropDown, setRoleDropDown] = useState("");

  var isEditData = props.state;

  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(isEditData === undefined)) {
      setEditData(isEditData[0]);
      setIsEdit(true);
      setEmployeeSelect({
        value: isEditData.EmployeeID,
        label: isEditData.EmployeeID
      })
      setRoleData(isEditData.RoleID)
    }
  }, [IsEdit])

  const { AddUserMessage, } = useSelector((state) => ({
    AddUserMessage: state.User_Registration_Reducer.AddUserMessage,
  }));

  useEffect(() => {
    if ((AddUserMessage.Status === true)) {
      dispatch(addUser(undefined))
    }
  }, [AddUserMessage.Status])

  /// Employee DropDown
  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getRoles());
    
  }, [dispatch]);

  const { employee } = useSelector((state) => ({
    employee: state.User_Registration_Reducer.employee
  }));

  const EmployeeValues = employee.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
  }

  useEffect(() => {
    dispatch(fetchModelsList());
  }, [dispatch]);

  const { Roles } = useSelector((state) => ({
    Roles: state.User_Registration_Reducer.Roles
  }));

  const RolesValues = Roles.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));

  /// Role Table Validation
  function AddRoleHandler() {
    const find = RoleData.find((element) => {
      return element.value === RoleDropDown.value
    });
    if (RoleDropDown.length <= 0) {
      dispatch(AlertState({
        Type: 3, Status: true,
        Message: "Select One Role",
      }));
    }
    else if (find === undefined) {
      setRoleData([...RoleData, RoleDropDown]);
    }
    else {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "RoleData already Exists ",
      }));
      // window.alert("RoleData already Exists");
    }
  }

  const handleValidSubmit = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({

        email: values.email,
        LoginName: values.LoginName,
        password: "1234",
        EmployeeID: EmployeeSelect.value,
        isActive: values.isActive,
        AdminPassword: "1234",
        isSendOTP: values.isSendOTP,
        RoleID: RoleData.map((d) => ({
          // RoleName: d.label,
          RoleID: d.value,
        })),
      }),
    };
    console.log("post data",requestOptions)
    if (RoleData.length <= 0) {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "At Least One Role Data Add in the Table",
        RedirectPath: false,
        PermissionAction: false,
      }));
    }
    else if (IsEdit) {
      dispatch(updateID(requestOptions.body, EditData.ID));
      setEditData([]);
    }
    else {
      dispatch(addUser(requestOptions.body));
      console.log("post data",requestOptions.body)
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs breadcrumbItem={"User Registration "} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>

                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                  >

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          LoginName
                        </Label>
                        <Col sm={4}>
                          <AvField name="LoginName" id="txtName" value={EditData.LoginName}
                            type="text"
                            placeholder="Please Enter LoginName"
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a LoginName...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          EmailID
                        </Label>
                        <Col sm={4}>
                          <AvField name="email" type="email"
                            value={EditData.email}
                            placeholder="Enter your EmailID "
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your EmailID' },
                              tel: {
                                pattern: /\S+@\S+\.\S+/
                              }
                            }
                            }

                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Employee
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={EmployeeSelect}
                          options={EmployeeValues}
                          onChange={(e) => { handllerEmployeeID(e) }}
                        />
                      </Col>
                    </Row>

               
                   

                    <Row className="mb-2">
                      <Label className="col-sm-2 col-form-label">
                        Roles
                      </Label>
                      <Col sm={4}>
                        {" "}
                        <Select
                          value={RoleDropDown}
                          options={RolesValues}
                          onChange={(e) => { setRoleDropDown(e) }}
                          classNamePrefix="select2-selection"
                          required=""
                        />
                      </Col>
                      <Col sm={1}>
                        {" "}
                        <Button
                          type="button"
                          color="primary"
                          onClick={() =>
                            AddRoleHandler()
                          }
                        >
                          Add
                        </Button>
                      </Col>
                      <Col sm={3}>
                        {RoleData.length > 0 ? (
                          <div>
                            <div className="table-responsive">
                              <table className="table table-bordered mb-0 table">
                                <thead >
                                  <tr>
                                    <th>RoleName</th>
                                    <th>ID</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody >
                                  {RoleData.map((TableValue) => (
                                    <tr key={TableValue.ID}>
                                      <td>
                                        <h5 className="my-0 text-primary">
                                          {TableValue.label}
                                        </h5>
                                      </td>
                                      <td>
                                        <h5 className="my-0 text-primary">
                                          {TableValue.value}
                                        </h5>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm waves-effect waves-light"
                                          onClick={() =>
                                            setRoleData(
                                              RoleData.filter(
                                                (item) =>
                                                  item.ID !== TableValue.ID
                                              )
                                            )
                                          }
                                        >
                                          <i class="mdi mdi-trash-can d-block font-size-10"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="border border-warning card">
                              <div className="card-header bg-transparent border-warning">
                                <h5 className="my-0 text-warning">
                                  <i className="mdi mdi-bullseye-arrow me-3"></i>
                                  Roles Data Not Found...!
                                </h5>
                              </div>
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label
                        className="col-sm-2 col-form-label"
                        htmlFor="horizontal-password-inputk"
                      >
                        isActive
                      </Label>
                      <Col sm={4}>
                        <AvField name="isActive"
                          checked={EditData.isActive}
                          type="checkbox"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label
                        className="col-sm-2 col-form-label"
                        htmlFor="horizontal-password-inputk"
                      >
                        Is SendOTP
                      </Label>
                      <Col sm={4}>
                        <AvField
                          type="checkbox"
                          checked={EditData.isSendOTP}
                          name="isSendOTP"
                          
                          id="horizontal-customCheck"

                        />
                      </Col>
                    </Row>
                    <Row className="justify-content-end">
                      <Col sm={2}>
                      <div>
                                                    {
                                                        IsEdit ? (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update User"
                                                                className="btn btn-success w-md"
                                                            >
                                                                <i class="fas fa-edit me-2"></i>Update
                                                            </button>) : (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save User"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        )
                                                    }
                                                </div>
                      </Col>{" "}
                      <Col sm={10}></Col>
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
export default AddUser
