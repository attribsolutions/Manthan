import React, { useState, useEffect ,useRef} from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, Label, Button, Input } from "reactstrap";
import { AvForm, AvGroup, } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getDesignationID, getEmployeeType, getState, getRegion, 
  postEmployee, getCompany, updateEmployeeID, editEmployeeSuccess, PostEmployeeSuccess }
  from "../../../store/Administrator/M_EmployeeRedux/action";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const AddEmployee = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
 
  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

   //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);
  
  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  var editDataGatingFromList = props.state;
 
  const [DesignationIDselect, setDesignationID] = useState("");
  const [EmployeeTypeselect, setEmployeeType] = useState("");
  const [Stateselect, setState] = useState("");
  // const [Regionselect, setRegion] = useState("");
  const [Companyselect, setCompany] = useState("");

  useEffect(() => {
    dispatch(getDesignationID());
    dispatch(getEmployeeType());
    dispatch(getState());
    // dispatch(getRegion());
    dispatch(getCompany());
  }, [dispatch]);

    const { DesignationID, EmployeeType, State, Region, Company,AddUserMessage } = useSelector((state) => ({
    DesignationID: state.M_EmployeesReducer.DesignationID,
    EmployeeType: state.M_EmployeesReducer.EmployeeType,
    State: state.M_EmployeesReducer.State,
    // Region: state.M_EmployeesReducer.Region,
    Company: state.M_EmployeesReducer.Company,
    AddUserMessage: state.M_EmployeesReducer.AddUserMessage,
}));

  const DesignationIDValues = DesignationID.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));
  function handllerDesignationID(e) {
    setDesignationID(e)
  }

  const EmployeeTypeValues = EmployeeType.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));
 
  function handllerEmployeeType(e) {
    setEmployeeType(e)
  }

  const StateValues = State.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));
  function handllerState(e) {
    setState(e)
  }

  // const RegionValues = Region.map((Data) => ({
  //   value: Data.ID,
  //   label: Data.Name
  // }));
  // function handllerRegion(e) {
  //   setRegion(e)
  // }

  const CompanyValues = Company.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  function handllerCompany(e) {
    setCompany(e)
  }

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      setDesignationID({
        value: editDataGatingFromList.DesignationID.ID,
        label: editDataGatingFromList.DesignationID.Name
      })
      setEmployeeType({
        value: editDataGatingFromList.EmployeeType.ID,
        label: editDataGatingFromList.EmployeeType.Name
      })
      setState({
        value: editDataGatingFromList.State.ID,
        label: editDataGatingFromList.State.Name
      })
      // setRegion({
      //   value: editDataGatingFromList.Region.ID,
      //   label: editDataGatingFromList.Region.Name
      // })
      setCompany({
        value: editDataGatingFromList.Companie.ID,
        label: editDataGatingFromList.Companie.Name
      })
     
      dispatch(editEmployeeSuccess({ Status: false }))
      return
    }
  }, [editDataGatingFromList])

   useEffect(() => {
    if ((AddUserMessage.Status === true) && (AddUserMessage.StatusCode === 200)) {
        dispatch(PostEmployeeSuccess({ Status: false }))
        // formRef.current.reset();
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
                RedirectPath: '/employeesList',
                AfterResponseAction: false
            }))
        }
    } 
    else if (AddUserMessage.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
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
  const handleValidSubmit = (event, values) => {
    let DateInput = document.getElementById("dateInput","").value;
    let DateInput1 = document.getElementById("dateInput1").value;
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Address: values.Address,
        Mobile: values.Mobile,
        email: values.email,
        DOB: DateInput,
        PAN: values.PAN,
        AadharNo: values.AadharNo,
        WorkingHours: values.WorkingHours,
        Designations: DesignationIDselect.value,
        EmployeeType: EmployeeTypeselect.value,
        JoiningDate: DateInput1,
        State: Stateselect.value,
        // Region: Regionselect.value,
        Companies: Companyselect.value,

      }),
        }

    if (IsEdit) {
      dispatch(updateEmployeeID(requestOptions.body, EditData.ID));
    }
    else {
      dispatch(postEmployee(requestOptions.body));
     
    }
  };


 // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditModeSaSS=''
  if(IsEdit===true){IsEditModeSaSS= "-3.5%"};

  return (
    <React.Fragment>
     <div className="page-content" style={{marginTop:IsEditModeSaSS}}>
        <Breadcrumbs breadcrumbItem={"Employee Master "} />
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
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField name="Name" id="txtName" value={EditData.Name}
                            type="text"
                            placeholder="Please Enter Name"
                            // autoComplete='off'
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please enter your Name...!' },
                            // }}
                             />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Address
                        </Label>
                        <Col sm={4}>
                          <AvField name="Address" value={EditData.Address} type="text"
                            placeholder=" Please Enter Address "
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter your Address' },
                            // }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Mobile No.
                        </Label>
                        <Col sm={4}>
                          <AvField name="Mobile" type="tel"
                            value={EditData.Mobile}
                            placeholder="+91 "
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                            //   tel: {
                            //     pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                            //   } }}

                          />
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
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter your EmailID' },
                            //   tel: {
                            //     pattern: /\S+@\S+\.\S+/
                            //   }
                            // }
                            // }

                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <Row className="mb-4">

                      <Label className="col-sm-2 col-form-label">
                        BOD
                      </Label>
                      <div class="col-lg-2">

                        <Input
                          className="form-control"
                          id="dateInput"
                          type="date"
                         Value={EditData.DOB}
                          on
                     
                        />
                      </div>
                    </Row>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          PAN
                        </Label>
                        <Col sm={4}>
                          <AvField name="PAN" type="text"
                            value={EditData.PAN}
                            placeholder="Enter your PAN No. "
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter your PAN No.' },
                            //   tel: {
                            //     pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
                            //   }
                            // }
                            // }

                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          AadharNo
                        </Label>
                        <Col sm={4}>
                          <AvField name="AadharNo" type="text"
                            value={EditData.AadharNo}
                            placeholder="Enter your AadharNo. "
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter your AadharNo' },
                            //   tel: {
                            //     pattern: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
                            //   }
                            // }
                            // }
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          WorkingHours
                        </Label>
                        <Col sm={4}>
                          <AvField name="WorkingHours" id="text" value={EditData.WorkingHours}
                            type="text"
                            placeholder="Please Enter WorkingHours"
                            // autoComplete='off' 
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please enter your WorkingHours ...!' },
                            // }} 
                            />
                        </Col>
                      </Row>
                    </AvGroup>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        DesignationID
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={DesignationIDselect}
                          options={DesignationIDValues}
                          onChange={(e) => { handllerDesignationID(e) }}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        EmployeeType
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={EmployeeTypeselect}
                          options={EmployeeTypeValues}
                          onChange={(e) => { handllerEmployeeType(e) }}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Label className="col-sm-2 col-form-label">
                        JoiningDate
                      </Label>
                      <div class="col-lg-2">
                        <Input
                          className="form-control"
                          id="dateInput1"
                          type="date"
                          Value ={EditData.JoiningDate}
                          on
                        />
                      </div>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        State
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={Stateselect}
                          options={StateValues}
                          onChange={(e) => { handllerState(e) }}
                        />
                      </Col>
                    </Row>

                    {/* <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Region
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={Regionselect}
                          options={RegionValues}
                          onChange={(e) => { handllerRegion(e) }}
                        />
                      </Col>
                    </Row> */}

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        CompanyName
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={Companyselect}
                          options={CompanyValues}
                          onChange={(e) => { handllerCompany(e) }}
                        />
                      </Col>
                    </Row>

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
    </React.Fragment >
  );
}
export default AddEmployee
