import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, getRoles, addUser, updateID, addUserSuccess }
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editSuccess } from "../../../store/Administrator/RoleMasterRedux/action";

const AddUser = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  const [RoleData, setRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");

  // M_Roles DropDown
  const [RoleDropDown, setRoleDropDown] = useState("");

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { AddUserMessage, } = useSelector((state) => ({
    AddUserMessage: state.User_Registration_Reducer.AddUserMessage,
  }));

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      dispatch(editSuccess({ Status: false }))
      // setEmployeeSelect({
      //   value: editDataGatingFromList.Employee,
      //   label: editDataGatingFromList.EmployeeID
      // })
      // setRoleData(editDataGatingFromList.UserRole[0].Role)
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {
    if ((AddUserMessage.Status === true) && (AddUserMessage.StatusCode === 201)) {
      dispatch(addUserSuccess({ Status: false }))
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
          RedirectPath: '/usersList',
          AfterResponseAction: false
        }))
      }
    }
    else if (AddUserMessage.Status === true) {
      dispatch(addUserSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: "error Message",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [AddUserMessage.Status])

  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getRoles());
  }, [dispatch]);
  const { employee } = useSelector((state) => ({
    employee: state.User_Registration_Reducer.employee
  }));

  const EmployeeValues = employee.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
  }

  const { Roles } = useSelector((state) => ({
    Roles: state.User_Registration_Reducer.Roles
  }));

  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
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
    }
  }

  const handleValidSubmit = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({

        email: values.email,
        LoginName: values.LoginName,
        password: "1234",
        Employee: EmployeeSelect.value,
        isActive: values.isActive,
        AdminPassword: "1234",
        isSendOTP: values.isSendOTP,
        CreatedBy: 1,
        UpdatedBy: 1,
        UserRole: RoleData.map((d) => ({
          Role: d.value,
        })),
      }),
    };

    if (RoleData.length <= 0) {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "At Least One Role Data Add in the Table",
        RedirectPath: false,
        PermissionAction: false,
      }));
    }
    else if (IsEdit) {
      dispatch(updateID(requestOptions.body, EditData.id));
      setEditData([]);
    }
    else {
      dispatch(addUser(requestOptions.body));
    }
  };

  // For Delete Button in table
  function UserRoles_DeleteButton_Handller(tableValue) {
    setRoleData(RoleData.filter(
      (item) => !(item.value === tableValue)
    )
    )
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-3.5%" };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
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
                    ref={formRef}
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
                                    
                                    <tr key={TableValue.Role}>
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
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Roles"
                                          onClick={() => {
                                            UserRoles_DeleteButton_Handller(TableValue.value)
                                          }
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
