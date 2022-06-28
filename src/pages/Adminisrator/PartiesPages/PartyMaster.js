import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input } from "reactstrap";
import { AvForm, AvGroup, AvField } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import { editPartyIDSuccess, postPartyData, postPartyDataSuccess, updatePartyID } from "../../../store/Administrator/PartyRedux/action";

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

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PartySaveSuccess, } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
    }));

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        document.getElementById("txtName").focus();
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setIsEdit(true);
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
                    RedirectPath: '/partyMaster',
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
        let DateInput = document.getElementById("dateInput", "").value;
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                PartyTypeID: 0,
                DividionTypeID: 0,
                companyID: 0,
                CustomerDivision: values.CustomerDivision,
                Email: values.Email,
                Address: values.Address,
                PIN: values.PIN,
                MobileNo:9088999080,
                State: 0,
                District: 0,
                Taluka: 0,
                City: 0,
                GSTIN: 0,
                FSSAINo: 0,
                FSSAIExipry: DateInput,
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
            console.log("requestOptions", requestOptions.body)
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true) { IsEditMode_Css = "-3.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumbs breadcrumbItem={"Party Master "} />
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
                                                        // autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please enter a Name...!' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                PartyType
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                DivisionType
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                CompanyName
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>

                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-2 col-form-label">
                                                    CustomerDivision
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="CustomerDivision" id="txtName"
                                                        value={EditData.CustomerDivision}
                                                        type="text"
                                                        placeholder="Please Enter CustomerDivision"
                                                        // autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please enter a CustomerDivision...!' },
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
                                                    <AvField name="Email" type="email"
                                                        value={EditData.Email}
                                                        placeholder="Enter your EmailID "
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
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-2 col-form-label">
                                                    PIN
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="PIN" type="text"
                                                        value={EditData.PIN}
                                                        placeholder="Enter your PAN No. "
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter your PIN No.' },
                                                            tel: {
                                                                pattern: "^[1-9][0-9]{5}$",
                                                                errorMessage: 'PIN Should be Six Digit Only.'
                                                            }
                                                        }
                                                        }

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
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter your Address' },
                                                        }}
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
                                                    <AvField name="MobileNo" type="tel"
                                                        value={EditData.MobileNo}
                                                        placeholder="+91 "
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                                                            tel: {
                                                                pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                                                            }
                                                        }}

                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                State
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                District
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                Taluka
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-2 col-form-label">
                                                    GSTIN
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="GSTIN" id="txtName"
                                                        value={EditData.GSTIN}
                                                        type="text"
                                                        placeholder="Please Enter GSTIN"
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please enter a GSTIN...!' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-2 col-form-label">
                                                    FSSAINo
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="FSSAINo" id="txtName"
                                                        value={EditData.FSSAINo}
                                                        type="text"
                                                        placeholder="Please Enter FSSAINo"
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please enter a FSSAINo...!' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                FSSAIExipry
                                            </Label>
                                            <div class="col-lg-2">
                                                <Input
                                                    className="form-control"
                                                    id="dateInput"
                                                    type="date"
                                                    Value={EditData.FSSAIExipry}
                                                    on
                                                />
                                            </div>
                                        </Row>
                                        <Row className="mb-4">
                                            <Label className="col-sm-2 col-form-label">
                                                City
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={""}
                                                    options={""}
                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-2 col-form-label">
                                                    IsActive
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="IsActive"
                                                    value=""
                                                        checked={(EditData.ID === 0) ? false : EditData.IsActive}
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
export default PartyMaster
