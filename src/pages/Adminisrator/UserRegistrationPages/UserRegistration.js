import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button, FormGroup, Table } from "reactstrap";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, getRoles, addUser, updateID, addUserSuccess }
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { Tbody, Thead } from "react-super-responsive-table";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";

const AddUser = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [RoleData, setRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");

  // M_Roles DropDown
  const [RoleDropDown, setRoleDropDown] = useState([]);

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse, employee, Roles,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.User_Registration_Reducer.AddUserMessage,
    employee: state.User_Registration_Reducer.employee,
    Roles: state.User_Registration_Reducer.Roles,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

  }));

  // userAccess useEffect
  useEffect(() => {
      if ((editDataGatingFromList === undefined)) {
          const userAcc = CommonGetRoleAccessFunction(history)
          if (!(userAcc === undefined)) {
              setUserPageAccessState(userAcc)
          }
      } else {
          let RelatedPageID = history.location.state.UserDetails.RelatedPageID
          const userfound = RoleAccessModifiedinSingleArray.find((element) => {
              return element.id === RelatedPageID
          })
          setUserPageAccessState(userfound)
      }

  }, [history])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }

    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      dispatch(BreadcrumbShow(editDataGatingFromList.LoginName))
      setPageMode("edit");
      dispatch(editSuccess({ Status: false }))
      setEmployeeSelect({
        value: editDataGatingFromList.Employee,
        label: editDataGatingFromList.EmployeeName
      })
      setRoleData(editDataGatingFromList.UserRole)
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 201)) {
      dispatch(addUserSuccess({ Status: false }))
      formRef.current.reset();
      setEmployeeSelect('')
      setRoleDropDown('')
      setRoleData('')
      if (pageMode === "other") {
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
          RedirectPath: '/UserList',
          AfterResponseAction: false
        }))
      }
    }
    else if (PostAPIResponse.Status === true) {
      dispatch(addUserSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])

  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getRoles());
  }, [dispatch]);


  const EmployeeValues = employee.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
  }



  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  /// Role dopdown
  function RoleDropDown_select_handler(e,role,key) {


  
    const find =  RoleDropDown.filter((index,key1) => {
      return !(index.Role === role)
    })
     debugger
    if (find===undefined){
      setRoleDropDown([...RoleDropDown,{Party:e.value,Role:role}])
    }else{
      // RoleDropDown
      // setRoleDropDown([...RoleDropDown[a].Party=e.value])

    }


    
  };
  debugger
  /// Role Table Validation
  function AddRoleHandler() {
    const find = RoleData.find((element) => {
      return element.Role === RoleDropDown.value
    });


    if (RoleDropDown.length <= 0) {
      dispatch(AlertState({
        Type: 3, Status: true,
        Message: "Select One Role",
      }));
    }
    else if (find === undefined) {
      setRoleData([...RoleData, { Role: RoleDropDown.value, Name: RoleDropDown.label }]);
    }
    else {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "RoleData Already Exists ",
      }));
    }
  }

  const handleValidSubmit = (event, values) => {

    const jsonBody = JSON.stringify({
      email: values.email,
      LoginName: values.loginName,
      password: "1234",
      Employee: EmployeeSelect.value,
      isActive: values.isActive,
      AdminPassword: "1234",
      isSendOTP: values.isSendOTP,
      isLoginUsingMobile: values.isLoginUsingMobile,
      isLoginUsingEmail: values.isLoginUsingEmail,
      CreatedBy: 1,
      UpdatedBy: 1,
      UserRole: RoleData.map((d) => ({
        Role: d.Role,
      })),
    })

    if (RoleData.length <= 0) {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "At Least One Role Data Add in the Table",
        RedirectPath: false,
        PermissionAction: false,
      }));
    }
    else if (pageMode === 'edit') {
      dispatch(updateID(jsonBody, EditData.id));
      setEditData([]);
    }
    else {
      dispatch(addUser(jsonBody));
    }
  };

  // For Delete Button in table
  function UserRoles_DeleteButton_Handller(tableValue) {
    setRoleData(RoleData.filter(
      (item) => !(item.value === tableValue)
    )
    )
  }


   const rolaTable=()=>{
return(
  <Table className="table table-bordered  text-center">
  <Thead >
    <tr>
      <th>RoleName</th>

      <th>Roles</th>
    </tr>
  </Thead>
  <Tbody  >
    {Data.map((TableValue,key) => (
      <tr key={TableValue.Role}>
        <td>
          {TableValue.Name}
        </td>
        <td>
          {/* <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
            UserRoles_DeleteButton_Handller(TableValue.value)
          }} >
          </i> */}
          <FormGroup className="" >
                             
                              <Select
                                defaultValue={{value:1,label:"text"}}
                                options={RolesValues}
                                onChange={(e) => { RoleDropDown_select_handler(e,TableValue.id,key) }}
                                classNamePrefix="select2-selection"
                              />

                            </FormGroup>
        </td>
      </tr>
    ))}
  </Tbody>
</Table>
)
  }
  var a={test:1,test2:2}

 const [test,setTEst]=useState([])
  console.log("111",a["test"])
  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>User Registration| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
          <Container fluid>
            <Row>
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
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
                          <Row >
                            <FormGroup className="mb-1 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Employee </Label>
                              <Select
                                value={EmployeeSelect}
                                options={EmployeeValues}
                                onChange={(e) => { handllerEmployeeID(e) }}
                              />
                            </FormGroup>

                          </Row>
                          <Row >

                            <FormGroup className="mb-1 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Login Name</Label>
                              <AvField name="loginName" id="txtName"
                                type="text"
                                placeholder="Please Enter Name"
                                defaultvalue=''
                                value={EditData.LoginName}
                                autoComplete='off'
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Name' },
                                }}
                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                              />
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup className="mb-1 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Password</Label>
                              <AvField name="password" id="password"
                                type="password"
                                value={EditData.password}
                                placeholder="Please Enter Password"
                                autoComplete="new-password"
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Password' },
                                }}
                                onChange={(e) => { }}
                              />
                            </FormGroup>

                          </Row>

                          <Row className="mt-2">
                            <FormGroup className="mb-1 col col-sm-12 " >
                              <Row className="justify-content-md-left">
                                <Label htmlFor="horizontal-firstname-input" className=" col-sm-2 col-form-label" >Enable Mobile Login</Label>
                                <Col md="1" style={{ marginTop: '9px' }} >
                                  <div className="form-check form-switch form-switch-md ml-4 " dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      checked={EditData.isLoginUsingMobile}
                                      defaultChecked={true}
                                      name="isLoginUsingMobile"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>

                                <Col md="2" >  </Col>
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Active </Label>
                                <Col md="1" style={{ marginTop: '9px' }} >
                                  <div className="form-check form-switch form-switch-md " dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      defaultChecked={EditData.isActive}
                                      name="isActive"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>
                                <Col md="5" >  </Col>
                              </Row>
                            </FormGroup>
                          </Row>

                          <Row >
                            <FormGroup className="col col-sm-12  " >
                              <Row className="justify-content-md-left">
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Enable Email Login</Label>
                                <Col md={1} style={{ marginTop: '10px' }} >
                                  <div className="form-check form-switch form-switch-md" dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      checked={EditData.isLoginUsingEmail}
                                      defaultChecked={true}
                                      name="isLoginUsingEmail"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>

                                <Col md="2" >  </Col>
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Send OTP </Label>
                                <Col md={1} style={{ marginTop: '10px' }} >
                                  <div className="form-check form-switch form-switch-md" dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      defaultChecked={EditData.isSendOTP}
                                      name="isSendOTP"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>
                                <Col md="5" >  </Col>
                              </Row>
                            </FormGroup>
                          </Row>
                        </CardBody>
                      </Card>

                      <Card className="mt-n2">
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row className="">
                            {/* <FormGroup className=" ml-3 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Roles </Label>
                              <Select
                                value={RoleDropDown}
                                options={RolesValues}
                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                classNamePrefix="select2-selection"
                              />

                            </FormGroup> */}

                            {/* <Col className="text-center" sm={1} style={{ marginTop: '28px' }} >
                              {" "}
                              <Button
                                type="button"
                                className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                onClick={() =>
                                  AddRoleHandler()
                                }
                              >
                                <i className="dripicons-plus "></i>
                              </Button>
                            </Col> */}
                            <Col sm={6} style={{ marginTop: '28px' }}>
                              {RoleData ? (

                                <div className="table-responsive">
                                 { rolaTable()}
                                </div>
                              ) : (
                                <>
                                </>
                              )}
                            </Col>
                            {/* <FormGroup > */}
                              
                              <Row >
                                <Col sm={2}>
                                  <div>
                                    {
                                      pageMode === "edit" ?
                                        userPageAccessState.RoleAccess_IsEdit ?
                                          <button
                                            type="submit"
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update User"
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
                                              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save User"
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
                            {/* </FormGroup > */}
                          </Row>
                        </CardBody>
                      </Card>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container >
        </div >
      </React.Fragment >
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};
export default AddUser;

const Data= [
  {
    "id": 60,
    "Name": "Chiatle CSS Manufacturer",
    "Party_id": 1,
    "Role_id": null
  },
  {
    "id": 53,
    "Name": "Shivamrut Distributors",
    "Party_id": 7,
    "Role_id": 1
  },
  {
    "id": 54,
    "Name": "Avdhoot sales",
    "Party_id": 8,
    "Role_id": 3
  }
]
