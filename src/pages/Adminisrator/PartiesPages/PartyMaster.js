import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import {
    editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, getDivisionTypesID,
    GetPartyTypeByDivisionTypeID, postPartyData, postPartyDataSuccess, updatePartyID
} from "../../../store/Administrator/PartyRedux/action";
import { getState } from "../../../store/Administrator/M_EmployeeRedux/action";
import Flatpickr from "react-flatpickr"
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions";
const PartyMaster = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);

    //'IsEdit'--if true then update data otherwise it will perfrom save operation
    const [IsEdit, setIsEdit] = useState(false);
    const [PageMode, setPageMode] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    const [state_DropDown_select, setState_DropDown_select] = useState("");
    const [FSSAIExipry_Date_Select, setFSSAIExipry_Date_Select] = useState("");
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState("");
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PartySaveSuccess, State, DistrictOnState, companyList, DivisionTypes, PartyTypes } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        State: state.M_EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        companyList: state.Company.companyList,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
        PartyTypes: state.PartyMasterReducer.PartyTypes,

    }));

    useEffect(() => {
        dispatch(getState());
        dispatch(getDistrictOnState());
        dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());
        dispatch(GetPartyTypeByDivisionTypeID());
    }, [dispatch]);


    const StateValues = State.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));
    function handllerState(e) {
        setState_DropDown_select(e)
        dispatch(getDistrictOnState(e.value))
        setDistrict_dropdown_Select('')

    }

    const DistrictOnStateValues = DistrictOnState.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerDistrictOnState(e) {
        setDistrict_dropdown_Select(e)

    }

    const companyListValues = companyList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)

    }

    const DivisionTypesValues = DivisionTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }

    const PartyTypeByDivisionTypeIDValues = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerPartyTypeByDivisionTypeID(e) {
        setPartyType_dropdown_Select(e)

    }

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        document.getElementById("txtName").focus();
        if (!(editDataGatingFromList === undefined)) {

            setEditData(editDataGatingFromList);
            setIsEdit(true);
            setFSSAIExipry_Date_Select(editDataGatingFromList.FSSAIExipry)

            setDistrict_dropdown_Select({
                value: editDataGatingFromList.District,
                label: editDataGatingFromList.DistrictName
            })
            // setCompanyList_dropdown_Select({
            //     value: editDataGatingFromList.Company,
            //     label: editDataGatingFromList.CompanyNa
            // })
            setDivision_dropdown_Select({
                value: editDataGatingFromList.DividionTypeID,
                label: editDataGatingFromList.DivisionType
            })
            setPartyType_dropdown_Select({
                value: editDataGatingFromList.PartyTypeID,
                label: editDataGatingFromList.PartyType
            })
            setState_DropDown_select({
                value: editDataGatingFromList.State,
                label: editDataGatingFromList.StateName
            })

            dispatch(editPartyIDSuccess({ Status: false }))
            return
        }
    }, [editDataGatingFromList])

    useEffect(() => {
        if ((PartySaveSuccess.Status === true) && (PartySaveSuccess.StatusCode === 200)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            formRef.current.reset();
            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PartySaveSuccess.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PartySaveSuccess.Message,
                    RedirectPath: '/partyList',
                    AfterResponseAction: false
                }))
            }
        }
        else if (PartySaveSuccess.Status === true) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PartySaveSuccess.Status])

    //'Save' And 'Update' Button Handller
    const handleValidUpdate = (event, values) => {
        debugger
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                PartyTypeID: partyType_dropdown_Select.value,
                DividionTypeID: division_dropdown_Select.value,
                companyID: 0,
                CustomerDivision: values.CustomerDivision,
                Email: values.Email,
                Address: values.Address,
                PIN: values.PIN,
                MobileNo: values.MobileNo,
                State: state_DropDown_select.value,
                District: district_dropdown_Select.value,
                Taluka: 0,
                City: 0,
                CustomerDivision: 1,
                GSTIN: values.GSTIN,
                FSSAINo: values.FSSAINo,
                FSSAIExipry: FSSAIExipry_Date_Select,
                IsActive: 1,
                CreatedBy: 1,
                CreatedOn: "2022-06-24T11:16:53.165483Z",
                UpdatedBy: 1,
                UpdatedOn: "2022-06-24T11:16:53.330888Z"
            }),
        };

        if (IsEdit) {
            dispatch(updatePartyID(requestOptions.body, EditData.ID));
        }
        else {
            dispatch(postPartyData(requestOptions.body));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true) { IsEditMode_Css = "-3.5%" };

    return (
        <React.Fragment>
            <div className="page-content text-black" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumbs breadcrumbItem={"Party Master "} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card >
                                <CardHeader>
                                    <h4 className="card-title text-black">React Validation - Normal</h4>
                                    <p className="card-title-desc  text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                                </CardHeader>
                                <CardBody>
                                    <AvForm
                                        onValidSubmit={(e, v) => {
                                            handleValidUpdate(e, v);
                                        }}
                                        ref={formRef}
                                    >


                                        <Row>
                                            <Card >
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row className="mb-4">

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">Name </Label>
                                                                <AvField name="Name" id="txtName"
                                                                    value={EditData.Name}
                                                                    type="text"
                                                                    placeholder="Please Enter Name"
                                                                    // autoComplete='off'
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please enter a Name...!' },
                                                                    }} />

                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">Email </Label>
                                                                <AvField name="Email" type="email"
                                                                    id="email"
                                                                    value={EditData.Email}
                                                                    placeholder="Enter your EmailID "
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please Enter your EmailID' },
                                                                        tel: {
                                                                            pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/",
                                                                            errorMessage: ""
                                                                        }
                                                                    }
                                                                    }

                                                                />

                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">MobileNo </Label>
                                                                <AvField name="MobileNo" type="text"
                                                                    value={EditData.MobileNo}
                                                                    id="mobileNo"
                                                                    placeholder="+91 "
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                                                                        tel: {
                                                                            pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                                                                        }
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Row>


                                        <Row>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> DivisionType </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={division_dropdown_Select}
                                                                        options={DivisionTypesValues}
                                                                        onChange={(e) => { handllerDivisionTypes(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">PartyType </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={partyType_dropdown_Select}
                                                                        options={PartyTypeByDivisionTypeIDValues}
                                                                        onChange={(e) => { handllerPartyTypeByDivisionTypeID(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">CompanyName </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={companyList_dropdown_Select}
                                                                        options={companyListValues}
                                                                        onChange={(e) => { handllercompanyList(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">CustomerDivision </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={""}
                                                                        options={""}
                                                                    // onChange={(e) => { handllerDesignationID(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> GSTIN </Label>
                                                                <AvField
                                                                    name="GSTIN"
                                                                    value={EditData.GSTIN}
                                                                    placeholder="Please Enter GSTIN"
                                                                    type="text"
                                                                    errorMessage="Enter First GSTIN"
                                                                    className="form-control"
                                                                    validate={{
                                                                        required: { value: true },
                                                                        tel: {
                                                                            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                                                            errorMessage: 'Please specify a valid GSTTIN Number.'
                                                                        }
                                                                    }}
                                                                    id="validationCustom01"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">
                                                                    FSSAI No </Label>
                                                                <AvField
                                                                    name="FSSAINo"
                                                                    value={EditData.FSSAINo}
                                                                    placeholder="Please Enter FSSAINo"
                                                                    type="text"
                                                                    errorMessage="Enter First FSSAINo"
                                                                    className="form-control"
                                                                    validate={{
                                                                        required: { value: true },
                                                                        tel: {
                                                                            pattern: /^[0-3][0-9]{13}$/,
                                                                            errorMessage: 'Please specify a valid FSSAI Number.'
                                                                        }
                                                                    }}
                                                                    id="FSSAINo"


                                                                />
                                                            </FormGroup>
                                                        </Col>


                                                    </Row>
                                                    <Row>
                                                        {/* <Col md="4"></Col> */}
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">FSSAIExipry </Label>
                                                                <Flatpickr
                                                                    id="FSSAIExipry"
                                                                    name="FSSAIExipry"
                                                                    value={FSSAIExipry_Date_Select}
                                                                    className="form-control d-block p-2 bg-white text-dark"
                                                                    placeholder="YYYY-MM-DD"
                                                                    options={{
                                                                        altInput: true,
                                                                        altFormat: "F j, Y",
                                                                        dateFormat: "Y-m-d"
                                                                      }}
                                                                    onChange={(selectedDates, dateStr, instance) => {
                                                                        setFSSAIExipry_Date_Select(dateStr)
                                                                    }}

                                                                />

                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1"></Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Row style={{ marginTop: '25px' }}>
                                                                    <Label
                                                                        htmlFor="horizontal-firstname-input"
                                                                        className="col-sm-3 col-form-label"
                                                                    >
                                                                        IsActive
                                                                    </Label>
                                                                    <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                        <AvInput name="isActive" type="checkbox" id="switch1" switch="none" defaultChecked Value={EditData.IsActive} />
                                                                        <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                                    </Col>
                                                                </Row>

                                                            </FormGroup>
                                                        </Col>



                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Row>


                                        <Row>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">Address </Label>
                                                                <AvField name="Address" value={EditData.Address} type="text"
                                                                    placeholder=" Please Enter Address "
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please Enter your Address' },
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-2">
                                                                <Label htmlFor="validationCustom01"> City </Label>
                                                                <Select
                                                                    value={""}
                                                                    options={""}
                                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="1">
                                                            <FormGroup className="mb-2">
                                                                <Label htmlFor="validationCustom01"> PIN </Label>
                                                                <AvField name="PIN" type="text"
                                                                    value={EditData.PIN}
                                                                    placeholder=" PIN No. "
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please Enter your PIN No.' },
                                                                        tel: {
                                                                            pattern: "^[1-9][0-9]{5}$",
                                                                            errorMessage: 'PIN Should be Six Digit Only.'
                                                                        }
                                                                    }
                                                                    }

                                                                />
                                                            </FormGroup>
                                                        </Col>





                                                    </Row>
                                                    <Row>

                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">State </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={state_DropDown_select}
                                                                        options={StateValues}
                                                                        onChange={(e) => { handllerState(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">District </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={district_dropdown_Select}
                                                                        options={DistrictOnStateValues}
                                                                        onChange={(e) => { handllerDistrictOnState(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-5">
                                                                <Label htmlFor="validationCustom01">Taluka </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        value={""}
                                                                        options={""}
                                                                    // onChange={(e) => { handllerDesignationID(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
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
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party ID"
                                                                            className="btn btn-success w-md"
                                                                        >
                                                                            <i class="fas fa-edit me-2"></i>Update
                                                                        </button>) : (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party ID"
                                                                            className="btn btn-success w-md"
                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                        </button>
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
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
export default PartyMaster
