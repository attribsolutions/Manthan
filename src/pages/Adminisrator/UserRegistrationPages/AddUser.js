import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button, FormGroup, Table } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, getRoles, addUser, updateID, addUserSuccess }
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { Tbody, Thead } from "react-super-responsive-table";

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
    // document.getElementById("txtName").focus();
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
          RedirectPath: '/userList',
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
  if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-5.5%" };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
        <Breadcrumbs breadcrumbItem={"User Registration "} />
        <Container fluid>

          <Card >
            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
              <h4 className="card-title text-black">React Validation - Normal</h4>
              <p className="card-title-desc text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
            </CardHeader>

            <CardBody className="text-black">
              <AvForm
                onValidSubmit={(e, v) => {
                  handleValidSubmit(e, v);
                }}
                ref={formRef}
              >


                <Card className=" text-black">
                  <CardBody style={{ backgroundColor: "whitesmoke" }}>
                    <Row>
                      <FormGroup className="mb-2 col col-sm-4 " >
                        <Label htmlFor="validationCustom01">Employee </Label>
                        <Select
                          value={EmployeeSelect}
                          options={EmployeeValues}
                          onChange={(e) => { handllerEmployeeID(e) }}
                        />
                      </FormGroup>
                      <Col md="1">  </Col>
                      <FormGroup className="mb-1 col col-sm-4 " >
                        <Label htmlFor="validationCustom01">Name </Label>
                        <AvField name="LoginName" id="txtName" value={EditData.LoginName}
                          type="text"
                          placeholder="Please Enter LoginName"
                          // autoComplete='off'
                          validate={{
                            required: { value: true, errorMessage: 'Please enter a LoginName...!' },
                          }} />
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup className="mb-0 mt-0 col col-sm-6">
                        <Row className="justify-content-md-left">
                          <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label mt-4 " >IsActive </Label>
                          <Col md={2} style={{ marginTop: '30px' }} >
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                              <input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                checked={(EditData.ID === 0) ? false : EditData.isActive}
                                name="IsActive"
                              />
                              <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                            </div>

                          </Col>
                          <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label mt-4 " >Mobile Login </Label>
                          <Col md={2} style={{ marginTop: '30px' }} >
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                              <input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                checked={(EditData.ID === 0) ? false : EditData.isActive}
                                name="IsActive"
                              />
                              <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                            </div>

                          </Col>
                        </Row>
                      </FormGroup>
                      
                      <FormGroup className=" mt-0 mb-0 col col-sm-6">
                        <Row className="justify-content-md-left">
                          <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label mt-4" >IsSendOTP </Label>
                          <Col md={2} style={{ marginTop: '30px' }} >
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                              <input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                checked={(EditData.ID === 0) ? false : EditData.isSendOTP}
                                name="isSendOTP"
                              />
                              <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                            </div>

                          </Col>
                          <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label mt-4" >Email Login </Label>
                          <Col md={2} style={{ marginTop: '30px' }} >
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                              <input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                checked={(EditData.ID === 0) ? false : EditData.isSendOTP}
                                name="isSendOTP"
                              />
                              <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                            </div>

                          </Col>
                        </Row>
                      </FormGroup>

                    </Row>
                  </CardBody>
                </Card>

                <Card className=" text-black">
                  <CardBody style={{ backgroundColor: "whitesmoke" }}>
                    <Row >
                      <FormGroup className="mt-1 ml-3 mb-3 col col-sm-4 " >
                        <Label htmlFor="validationCustom01">Roles </Label>
                        <Select
                          value={RoleDropDown}
                          options={RolesValues}
                          onChange={(e) => { setRoleDropDown(e) }}
                          classNamePrefix="select2-selection"
                        />
                        <FormGroup className=" mt-3 col col-sm-6">
                          <Row >

                            <Col sm={2} >
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
                                      className="btn btn-primary w-md"
                                    > <i className="fas fa-save me-2"></i> Save
                                    </button>
                                  )
                                }
                              </div>
                            </Col>

                          </Row>
                        </FormGroup >
                      </FormGroup>

                      <Col sm={1} style={{ marginTop: '33px' }} >
                        {" "}
                        <Button
                          type="button"
                          className="btn btn-sm mt-1 mb-0 btn-light   btn-outline-primary   "
                          // color="light"
                          onClick={() =>
                            AddRoleHandler()
                          }
                        >
                          <i className="dripicons-plus "></i>
                        </Button>
                    
                        
                      </Col>
                      <Col sm={3} style={{ marginTop: '33px' }}>
                        {RoleData.length > 0 ? (
                          <div>
                            <div className="table-responsive">
                              <Table className="table table-bordered mb-0 table">
                                <Thead >
                                  <tr>
                                    <th>RoleName</th>
                                    <th>ID</th>
                                    <th>Action</th>
                                  </tr>
                                </Thead>
                                <Tbody >
                                  {RoleData.map((TableValue) => (

                                    <tr key={TableValue.Role}>
                                      <td>
                                          {TableValue.label}
                                      </td>
                                      <td>
                                          {TableValue.value}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-soft-danger btn-sm waves-effect waves-light border-danger"
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
                                </Tbody>
                              </Table>
                            </div>
                          </div>
                        ) : (
                          <>
                            
                          </>
                        )}
                      </Col>
                    </Row>

                    {/* <FormGroup className=" mt-0 mb-0 col col-sm-6">
                          <Row >

                            <Col sm={2} >
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
                                      className="btn btn-primary w-md"
                                    > <i className="fas fa-save me-2"></i> Save
                                    </button>
                                  )
                                }
                              </div>
                            </Col>

                          </Row>
                        </FormGroup > */}
                  </CardBody>

                </Card>

              </AvForm>
            </CardBody>

          </Card>

        </Container >
      </div >
    </React.Fragment >
  );
}
export default AddUser
