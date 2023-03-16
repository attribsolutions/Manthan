import React, { useEffect, useRef, useState } from "react"
import MetaTags from "react-meta-tags"
import './partymaster.scss'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import Select from "react-select";
import { priceListByPartyAction } from "../../../store/Administrator/PriceList/action";
import { getState } from "../../../store/Administrator/EmployeeRedux/action"
import {
    editPartyIDSuccess,
    getAddressTypes,
    getCompany,
    getDistrictOnState,
    getPartyTypes,
    priceListByPartyAction,
    postPartyData,
    postPartyDataSuccess,
    updatePartyID
} from "../../../store/Administrator/PartyRedux/action"
import {
    comAddPageFieldFunc,
    formValid,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/validationFunction";
import { AlertState, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions"
import Tree from "./Tree"
import AddressDetails_Tab from "."
import { PARTY_lIST } from "../../../routes/route_url"

const PartyMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserAccState] = useState("");
    const [activeTab1, setactiveTab1] = useState("1")
    const [state_DropDown_select, setState_DropDown_select] = useState("");
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState("");
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [PriceList_dropdown_Select, setPriceList_dropdown_Select] = useState("");
    const [dropOpen, setDropOpen] = useState(false);
    const [AddressDetailsMaster, setAddressDetailsMaster] = useState([]);
    const [modalCss, setModalCss] = useState(false);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }
    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        State,
        // PriceList,
        DistrictOnState,
        Company,
        PartyTypes,
        priceListByPartyType,
        pageField,
        userAccess
    } = useSelector((state) => ({
        PostAPIResponse: state.PartyMasterReducer.PartySaveSuccess,
        State: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        Company: state.PartyMasterReducer.Company,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        PriceList: state.PartyMasterReducer.PriceList,
        AddressTypes: state.PartyMasterReducer.AddressTypes,
        userAccess: state.Login.RoleAccessUpdateData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const [state, setState] = useState({
        values: {
            id: "",
            Name: "",
            MobileNo: "",
            PriceList: "",
            PartyType: "",
            Company: "",
            PAN: "",
            Email: "",
            AlternateContactNo: "",
            State: "",
            District: "",
            GSTIN: "",
            MkUpMkDn: "",
            isActive: "",
            IsDivision: "",
            PartyAddress: ""


        },
        fieldLabel: {
            Name: '',
            MobileNo: '',
            PriceList: '',
            PartyType: '',
            Company: '',
            PAN: '',
            Email: '',
            AlternateContactNo: '',
            State: '',
            District: '',
            GSTIN: '',
            MkUpMkDn: '',
            isActive: '',
            IsDivision: '',
            PartyAddress: ''

        },

        isError: {
            Name: "",
            MobileNo: "",
            PriceList: "",
            PartyType: "",
            Company: "",
            PAN: "",
            Email: "",
            AlternateContactNo: "",
            State: "",
            District: "",
            GSTIN: "",
            MkUpMkDn: "",
            isActive: "",
            IsDivision: "",
            PartyAddress: ""

        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            MobileNo: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            PriceList: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            PartyType: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            Company: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            PAN: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            Email: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            AlternateContactNo: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            State: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            District: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            GSTIN: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            MkUpMkDn: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            isActive: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            IsDivision: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            PartyAddress: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

        },
        required: {

        }
    })
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(10))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(getState());
        dispatch(getDistrictOnState());
        dispatch(getAddressTypes());
        dispatch(priceListByPartyAction());
        dispatch(getPartyTypes());
        dispatch(getCompany());
    }, [dispatch]);

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                const { id, Name, PriceList, MobileNo, email, Company, PAN, GSTIN, State,MKUpMkDn,
                    District, PartyAddress, isActive, PartyType, IsDivision, State_id, District_id,
                    Company_id } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.Address.valid = true;
                hasValid.MobileNo.valid = true;
                hasValid.Email.valid = true;
                hasValid.PAN.valid = true;
                hasValid.GSTIN.valid = true;
                hasValid.Company.valid = true;
                hasValid.isActive.valid = true;
                hasValid.PriceList.valid = true;
                hasValid.State.valid = true;
                hasValid.District.valid = true;
                hasValid.IsDivision.valid = true;
                hasValid.PartyAddress.valid = true;
                hasValid.PartyType.valid = true;
                hasValid.MkUpMkDn.valid = true;

                values.id = id
                values.Name = Name;
                values.MobileNo = MobileNo;
                values.Email.valid = email;
                values.PAN.valid = PAN;
                values.GSTIN.valid = GSTIN;
                values.MkUpMkDn.valid = MKUpMkDn;
                values.isActive.valid = isActive;
                values.PartyAddress.valid = PartyAddress;
                values.PriceList = { label: PriceList, value: PriceList };
                values.PartyType = { label: PartyType, value: PartyType };
                values.State = { label: State, value: State_id };
                values.District = { label: District, value: District_id };
                values.Company = { label: Company, value: Company_id };
                values.IsDivision ={label: IsDivision, value: IsDivision}
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))

            }
            dispatch(editPartyIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: PARTY_lIST,
                    AfterResponseAction: false
                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
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


    useEffect(() => {

        if (pageField) {
          const fieldArr = pageField.PageFieldMaster
          comAddPageFieldFunc({ state, setState, fieldArr })
        }
      }, [pageField])

    const StateValues = State.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const DistrictOnStateValues = DistrictOnState.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const companyListValues = Company.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision
    }));

    // party drop down option
    // const PriceList_DropdownOptions = PriceList.map((data) => ({
    //     value: data.id,
    //     label: data.Name
    // }));

    function handllerState(e) {
        setState_DropDown_select(e)
        dispatch(getDistrictOnState(e.value))
        setDistrict_dropdown_Select('')
    }

    function handllerDistrictOnState(e) {
        setDistrict_dropdown_Select(e)
    }

    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)
    }

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)
        setPriceList_dropdown_Select({ label: '' })
        setCompanyList_dropdown_Select('')
        dispatch(priceListByPartyAction(e.value))
    }

    const test1 = () => {
        return (
            <>
                <Modal
                    isOpen={dropOpen}
                    toggle={() => { setDropOpen(!dropOpen) }}
                    size="sm"
                    centered={true}
                // backdrop={'static'}
                >
                    <div>
                        <div className="text-center mt-2">
                            {/* <Label className="text-primary text-center "> {priceList.label}</Label> */}
                            <Input type="button" className="btn btn-light text-primary"

                                onClick={() => {
                                    // sub_Price_Add_Handler()
                                }}
                                value={PriceList_dropdown_Select.label}
                            />

                        </div>
                        <Tree data={priceListByPartyType} priceList={PriceList_dropdown_Select}
                            func1={setPriceList_dropdown_Select} func2={setDropOpen} />
                    </div>

                </Modal>

            </>
        )
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            PriceList: PriceList_dropdown_Select.value,
            PartyType: partyType_dropdown_Select.value,
            Company: companyList_dropdown_Select.value,
            PAN: values.PAN,
            Email: values.Email,
            MobileNo: values.MobileNo,
            AlternateContactNo: values.AlternateContactNo,
            State: state_DropDown_select.value,
            District: district_dropdown_Select.value,
            Taluka: 0,
            City: 0,
            GSTIN: values.GSTIN,
            MkUpMkDn: values.MkUpMkDn,
            isActive: values.isActive,
            IsDivision: partyType_dropdown_Select.division,
            CreatedBy: 1,
            CreatedOn: "2022-06-24T11:16:53.165483Z",
            UpdatedBy: 1,
            UpdatedOn: "2022-06-24T11:16:53.330888Z",
            PartyAddress: AddressDetailsMaster,
        });

        if (pageMode === 'edit') {
            dispatch(updatePartyID(jsonBody, EditData.id));
            console.log("update jsonBody", jsonBody)
        }
        else {
            dispatch(postPartyData(jsonBody));
            console.log("post jsonBody", jsonBody)
        }
    }
    };

    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Container fluid>
                    <form onSubmit={formSubmitHandler} ref={formRef} noValidate>
                            
                            <Row>

                                <Col lg={12}>
                                    <Card className="text-black" >
                                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                                        </CardHeader>
                                        <CardBody>
                                            <Nav tabs className="nav-tabs-custom nav-justified">
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-1"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "1",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("1")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Party Master</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-2"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "2",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("2")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Address Details</span>

                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>

                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                    // className={classnames({
                                                    //     active: activeTab1 === "7",
                                                    // })}
                                                    // onClick={() => {
                                                    //     toggle1("7")
                                                    // }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        {/* <span className="d-none d-sm-block">Tab7</span> */}
                                                        {/* <Button type="submit"> save</Button> */}
                                                        <Row >
                                                            <Col sm={2}>
                                                                <div>
                                                                    {
                                                                        pageMode === "edit" ?
                                                                            userPageAccessState.RoleAccess_IsEdit ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
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
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
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
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                                <TabPane tabId="1">
                                                    <Row>
                                                        <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >

                                                            <Row className="mt-3 ">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                                        <Input
                                                                            name="Name"
                                                                            id="txtName"
                                                                            value={values.Name}
                                                                            type="text"
                                                                            className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please Enter Name"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                                dispatch(Breadcrumb_inputName(event.target.value))
                                                                            }}
                                                                        />
                                                                        {isError.Name.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.Name}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.MobileNo} </Label>
                                                                        <Input
                                                                            name="Mobile"
                                                                            value={values.MobileNo}
                                                                            type="text"
                                                                            className={isError.MobileNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please Enter Mobile"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                            }}
                                                                        />
                                                                        {isError.MobileNo.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.MobileNo}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>

                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.AlternateContactNo}</Label>
                                                                        <Input
                                                                            name="AlternateContactNo"
                                                                            value={values.AlternateContactNo}
                                                                            type="text"
                                                                            className={isError.AlternateContactNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please AlternateContactNo"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                            }}
                                                                        />
                                                                        {isError.AlternateContactNo.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.AlternateContactNo}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row className="mt-3">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.Email} </Label>
                                                                        <Input
                                                                            name="Email"
                                                                            value={values.Email}
                                                                            type="text"
                                                                            className={isError.Email.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please Enter Email"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                            }}
                                                                        />
                                                                        {isError.Email.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.email}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Row>
                                                    <Row>
                                                        <Card className=" text-black mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                                                            <Row className="mt-3 ">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> {fieldLabel.PartyType}</Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                name="PartyType"
                                                                                value={values.PartyType}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={PartyTypeDropdown_Options}
                                                                                onChange={(e, v) => {
                                                                                    onChangeSelect({ e, v, state, setState });
                                                                                    PartyType_Dropdown_OnChange_Handller(v)
                                                                                }
                                                                                }
                                                                            />
                                                                            {isError.PartyType.length > 0 && (
                                                                                <span className="text-danger f-8"><small>{isError.PartyType}</small></span>
                                                                            )}

                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.PriceList} </Label>
                                                                        <Input
                                                                            value={PriceList_dropdown_Select.label}
                                                                            placeholder="Select..."
                                                                            onClick={(e) => setDropOpen(!dropOpen)}
                                                                        >
                                                                        </Input>
                                                                        {test1()}
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>

                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> {fieldLabel.Company} </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                name="Company"
                                                                                value={values.Company}
                                                                                isSearchable={false}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={companyListValues}
                                                                                onChange={(v, e) => {
                                                                                    onChangeSelect({ e, v, state, setState });
                                                                                    handllercompanyList(v)
                                                                                }
                                                                                }
                                                                            />
                                                                            {isError.Company.length > 0 && (
                                                                                <span className="text-danger f-8"><small>{isError.Company}</small></span>
                                                                            )}
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.PAN} </Label>
                                                                        <Input
                                                                            name="PAN"
                                                                            value={values.PAN}
                                                                            type="text"
                                                                            className={isError.PAN.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please Enter PAN"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                            }}
                                                                        />
                                                                        {isError.PAN.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.PAN}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> {fieldLabel.GSTIN} </Label>
                                                                        <Input
                                                                            name="GSTIN"
                                                                            value={values.GSTIN}
                                                                            type="text"
                                                                            className={isError.GSTIN.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                            placeholder="Please Enter GSTIN"
                                                                            autoComplete='off'
                                                                            onChange={(event) => {
                                                                                onChangeText({ event, state, setState })
                                                                            }}
                                                                        />
                                                                        {isError.GSTIN.length > 0 && (
                                                                            <span className="invalid-feedback">{isError.GSTIN}</span>
                                                                        )}
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label">
                                                                                {fieldLabel.MKUpMkDn}
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                                    <Input type="checkbox" className="form-check-input"
                                                                                        checked={values.MKUpMkDn}
                                                                                        name="MKUpMkDn"
                                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> {fieldLabel.State} </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                name="State"
                                                                                value={values.State}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={StateValues}
                                                                                onChange={(v, e) => {
                                                                                    onChangeSelect({ e, v, state, setState });
                                                                                    handllerState(v)
                                                                                }
                                                                                }
                                                                            />
                                                                            {isError.State.length > 0 && (
                                                                                <span className="text-danger f-8"><small>{isError.State}</small></span>
                                                                            )}
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> {fieldLabel.District} </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                name="District"
                                                                                value={values.District}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={DistrictOnStateValues}
                                                                                onChange={(v, e) => {
                                                                                    onChangeSelect({ e, v, state, setState });
                                                                                    handllerDistrictOnState(v)
                                                                                }
                                                                                }
                                                                            />
                                                                            {isError.District.length > 0 && (
                                                                                <span className="text-danger f-8"><small>{isError.District}</small></span>
                                                                            )}
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1"></Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label">
                                                                                {fieldLabel.isActive}
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                                    <Input type="checkbox" className="form-check-input"
                                                                                        checked={values.isActive}
                                                                                        name="isActive"
                                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1"></Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label">
                                                                                {fieldLabel.IsDivision}
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                                    <Input type="checkbox" className="form-check-input"
                                                                                        checked={values.IsDivision}
                                                                                        name="IsDivision"
                                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="2">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <AddressDetails_Tab tableData={AddressDetailsMaster} func={setAddressDetailsMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="3">

                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>

                        </form>
                    </Container>
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
export default PartyMaster;




