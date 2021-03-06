import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup } from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import {
    editPartyIDSuccess, GetCompanyByDivisionTypeID, getDistrictOnState, getDistrictOnStateSuccess, getDivisionTypesID,
    GetPartyTypeByDivisionTypeID, postPartyData, postPartyDataSuccess, updatePartyID
} from "../../../store/Administrator/PartyRedux/action";
import { getState } from "../../../store/Administrator/M_EmployeeRedux/action";
import Flatpickr from "react-flatpickr"
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";

const PartyMaster = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const [state_DropDown_select, setState_DropDown_select] = useState("");
    const [FSSAIExipry_Date_Select, setFSSAIExipry_Date_Select] = useState("");
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState("");
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, State, DistrictOnState, companyList, DivisionTypes, PartyTypes } = useSelector((state) => ({
        PostAPIResponse: state.PartyMasterReducer.PartySaveSuccess,
        State: state.M_EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        companyList: state.PartyMasterReducer.CompanyName,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
        PartyTypes: state.PartyMasterReducer.PartyTypes,

    }));

    // userAccess useEffect
    useEffect(() => {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    useEffect(() => {
        dispatch(getState());
        dispatch(getDistrictOnState());
        dispatch(GetCompanyByDivisionTypeID());
        dispatch(getDivisionTypesID());
        dispatch(GetPartyTypeByDivisionTypeID());
    }, [dispatch]);


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setPageMode("edit");
            setFSSAIExipry_Date_Select(editDataGatingFromList.FSSAIExipry)

            setDistrict_dropdown_Select({
                value: editDataGatingFromList.District_id,
                label: editDataGatingFromList.DistrictName
            })

            setCompanyList_dropdown_Select({
                value: editDataGatingFromList.Company_id,
                label: editDataGatingFromList.CompanyName
            })

            setDivision_dropdown_Select({
                value: editDataGatingFromList.DivisionType_id,
                label: editDataGatingFromList.DivisionTypeName
            })
            setPartyType_dropdown_Select({
                value: editDataGatingFromList.PartyType_id,
                label: editDataGatingFromList.PartyTypeName
            })
            setState_DropDown_select({
                value: editDataGatingFromList.State_id,
                label: editDataGatingFromList.StateName
            })

            dispatch(editPartyIDSuccess({ Status: false }))
            return
        }
    }, [editDataGatingFromList])

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            formRef.current.reset();
            setCompanyList_dropdown_Select('')
            setDivision_dropdown_Select('')
            setPartyType_dropdown_Select('')
            setDistrict_dropdown_Select('')
            setState_DropDown_select('')
            setFSSAIExipry_Date_Select('')
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
                    RedirectPath: '/PartyList',
                    AfterResponseAction: false
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse.Status])

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
        dispatch(GetCompanyByDivisionTypeID(e.value))
    }

    const PartyTypeByDivisionTypeIDValues = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerPartyTypeByDivisionTypeID(e) {
        setPartyType_dropdown_Select(e)

    }



    //'Save' And 'Update' Button Handller
    const FormSubmitButton_Handler = (event, values) => {

        const jsonBody = JSON.stringify({
            Name: values.Name,
            PartyType: partyType_dropdown_Select.value,
            DivisionType: division_dropdown_Select.value,
            Company: companyList_dropdown_Select.value,
            PAN: values.PAN,
            CustomerDivision: values.CustomerDivision,
            Email: values.Email,
            Address: values.Address,
            PIN: values.PIN,
            MobileNo: values.MobileNo,
            AlternateContactNo: values.AlternateContactNo,
            State: state_DropDown_select.value,
            District: district_dropdown_Select.value,
            Taluka: 0,
            City: 0,
            CustomerDivision: 1,
            GSTIN: values.GSTIN,
            FSSAINo: values.FSSAINo,
            FSSAIExipry: FSSAIExipry_Date_Select,
            isActive: values.isActive,
            CreatedBy: 1,
            CreatedOn: "2022-06-24T11:16:53.165483Z",
            UpdatedBy: 1,
            UpdatedOn: "2022-06-24T11:16:53.330888Z"
        });

        if (pageMode === 'edit') {
            dispatch(updatePartyID(jsonBody, EditData.id));
        }
        else {
            dispatch(postPartyData(jsonBody));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content text-black" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                <MetaTags>
                    <title>Party Master| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card className="text-black" >
                                <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                                </CardHeader>

                                <CardBody>
                                    <AvForm
                                        onValidSubmit={(e, v) => {
                                            FormSubmitButton_Handler(e, v);
                                        }}
                                        ref={formRef}
                                    >
                                        <Row>
                                            <Card style={{ backgroundColor: "whitesmoke" }} >

                                                <Row className="mt-3 ">
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <AvField name="Name" id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                placeholder="Please Enter Name"
                                                                // autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Name' },
                                                                }}
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="1">  </Col>
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">Mobile Number </Label>
                                                            <AvField name="MobileNo" type="tel"
                                                                value={EditData.MobileNo}
                                                                id="mobileNo"
                                                                placeholder="Enter Mobile No."
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Enter your Mobile Number' },
                                                                    tel: {
                                                                        pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                                                                        errorMessage: "Please Enter 10 Digit Mobile Number."
                                                                    }
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="1">  </Col>

                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">Alternate Contact Number(s)</Label>
                                                            <AvField name="AlternateContactNo" type="tel"
                                                                value={EditData.AlternateContactNo}
                                                                id="mobileNo"
                                                                // defaultValue={''}
                                                                placeholder="Alternate Contact Number(s)"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3 ">
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">Email </Label>
                                                            <AvField name="Email" type="email"
                                                                id="email"
                                                                value={EditData.Email}
                                                                placeholder="Enter your Email"
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter your Email' },
                                                                    tel: {
                                                                        pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/",
                                                                        errorMessage: "Please Enter valid Email Address.(Ex:abc@gmail.com)"
                                                                    }
                                                                }
                                                                }
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Row>


                                        <Row>
                                            <Card className="mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                                                <Row className="mt-3 ">
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01"> Division Type </Label>
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
                                                            <Label htmlFor="validationCustom01">Party Type </Label>
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
                                                            <Label htmlFor="validationCustom01">Company Name </Label>
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
                                                    {/* <Col md="3">
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
                                                    </Col> */}
                                                    {/* <Col md="1">  </Col> */}
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01"> PAN </Label>
                                                            <AvField
                                                                name="PAN"
                                                                value={EditData.PAN}
                                                                placeholder="Please Enter PAN"
                                                                type="text"
                                                                errorMessage="Please Enter PAN Number."
                                                                className="form-control"
                                                                validate={{
                                                                    required: { value: true },
                                                                    tel: {
                                                                        pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                                                        errorMessage: 'Please Enter valid PAN Number.(Ex:AAAAA1234A).'
                                                                    }
                                                                }}
                                                                id="validationCustom01"
                                                            />
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
                                                                errorMessage="Please Enter GSTIN Number."
                                                                className="form-control"
                                                                validate={{
                                                                    required: { value: true },
                                                                    tel: {
                                                                        pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                                                        errorMessage: 'Please Enter valid GSTIN number.(Ex:27AAAAA0000A1Z5).'
                                                                    }
                                                                }}
                                                                id="validationCustom01"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="1">  </Col>
                                                </Row>

                                                <Row>
                                                    {/* <Col md="4"></Col> */}
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">
                                                                FSSAI No </Label>
                                                            <AvField
                                                                name="FSSAINo"
                                                                value={EditData.FSSAINo}
                                                                placeholder="Please Enter FSSAINo"
                                                                type="text"

                                                                errorMessage="Please Enter FSSAI Number."
                                                                className="form-control"
                                                                validate={{
                                                                    required: { value: true },
                                                                    tel: {
                                                                        pattern: /^(?:\d[- ]*){14}$/,
                                                                        errorMessage: 'FSSAINo Should be Fourteen Digit Only.'
                                                                    }
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="1"></Col>
                                                    <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">FSSAI Exipry </Label>
                                                            <Flatpickr
                                                                id="FSSAIExipry"
                                                                name="FSSAIExipry"
                                                                value={FSSAIExipry_Date_Select}
                                                                className="form-control d-block p-2 bg-white text-dark"
                                                                placeholder=" Please Enter FSSAI Exipry"
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
                                                                    className="col-sm-4 col-form-label"
                                                                >
                                                                    Active
                                                                </Label>
                                                                <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input " id="inp-isActive"
                                                                            checked={EditData.isActive}
                                                                            defaultChecked={true}
                                                                            name="isActive"
                                                                        />
                                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Row>

                                        <Row  >
                                            <Card className="mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                                                <Row className="mt-3 ">
                                                    <Col md="7" >
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
                                                    {/* <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-2">
                                                                <Label htmlFor="validationCustom01"> City </Label>
                                                                <Select
                                                                    value={""}
                                                                    options={""}
                                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                                />
                                                            </FormGroup>
                                                        </Col> */}
                                                   
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
                                                    {/* <Col md="1">  </Col>
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
                                                        </Col> */}
                                                    <Col md="1">  </Col>
                                                    <Col md="3">
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

                                                <FormGroup >
                                                    <Row >
                                                        <Col sm={2}>
                                                            <div>
                                                                {
                                                                    pageMode === "edit" ?
                                                                        userPageAccessState.RoleAccess_IsEdit ?
                                                                            <button
                                                                                type="submit"
                                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party"
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
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party"
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
                                            </Card>
                                        </Row>

                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
}
export default PartyMaster
