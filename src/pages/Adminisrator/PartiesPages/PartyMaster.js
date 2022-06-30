import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup } from "reactstrap";
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
        let DateInput = document.getElementById("FSSAIExipry").value;
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
                MobileNo: values.MobileNo,
                State: 0,
                District: 0,
                Taluka: 0,
                City: 0,
                CustomerDivision: 1,
                GSTIN: values.GSTIN,
                FSSAINo: values.FSSAINo,
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
            console.log("update requestOptions", requestOptions.body)
        }
        else {
            dispatch(postPartyData(requestOptions.body));
            // console.log("requestOptions", requestOptions.body)
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
                                <CardHeader>
                                    <h4 className="card-title">React Validation - Normal</h4>
                                    <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
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
                                                                            pattern: /\S+@\S+\.\S+/
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
                                                                <AvField name="MobileNo" type="tel"
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
                                                                <Label htmlFor="validationCustom01">PartyType </Label>
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
                                                                <Label htmlFor="validationCustom01"> DivisionType </Label>
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
                                                                <Label htmlFor="validationCustom01">CompanyName </Label>
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
                                                                    validate={{ required: { value: true } }}
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
                                                                    validate={{ required: { value: true } }}
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
                                                                <AvField
                                                                    name="FSSAIExipry"
                                                                    value={EditData.FSSAIExipry}
                                                                    type="date"
                                                                    errorMessage="Enter First FSSAIExipry"
                                                                    className="form-control"
                                                                    validate={{ required: { value: true } }}
                                                                    id="FSSAIExipry"
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
                                                                    <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-lg ">
                                                                        <Input
                                                                            value={EditData.IsActive}
                                                                            type="checkbox"
                                                                            className="form-control"
                                                                            id="horizontal-firstname-input"
                                                                            placeholder="Enter Your First Name"
                                                                        />
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
                                                                    placeholder="Enter your PIN No. "
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
                                                                <Label htmlFor="validationCustom01">District </Label>
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
