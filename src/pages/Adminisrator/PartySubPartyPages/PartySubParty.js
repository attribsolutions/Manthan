import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Table,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
    PostMethodForPartySubParty,
    PostMethod_ForPartySubPartyAPISuccess,
    postPartySubParty,
    postPartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    get_Division_ForDropDown,
    get_Party_ForDropDown
} from "../../../store/Administrator/ItemsRedux/action";

import { SaveButton } from "../../../components/CommonSaveButton";
import { Tbody, Thead } from "react-super-responsive-table";

const PartySubParty = (props) => {


    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [PartyData, setPartyData] = useState([]);
    const [Division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const dispatch = useDispatch();
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [Party_dropdown_Select, setParty_dropdown_Select] = useState("");
    const history = useHistory()

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        Divisions,
        Party,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartySubPartyReducer.postMsg,
            Divisions: state.ItemMastersReducer.Division,
            Party: state.ItemMastersReducer.Party,
            // pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
        }));

    // useEffect(() => {
    //     dispatch(commonPageField(121))
    // }, []);


    {/*start */ }
    const [state, setState] = useState({
        values: {
            Division: "",
            Party: ""
        },
        fieldLabel: {
            Division: "",
            Party: ""
        },

        isError: {
            Division: "",
            Party: ""
        },
        hasValid: {
            Division: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            Party: {
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
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])
    useEffect(() => {
        debugger
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            // setDivision_dropdown_Select('')
            // setParty_dropdown_Select('')
            dispatch(postPartySubPartySuccess({ Status: false }))
            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: false,
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(postPartySubPartySuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])



    //get method for dropdown
    useEffect(() => {
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
    }, [dispatch]);


    function handllerDivision(e) {
        setDivision_dropdown_Select(e)
    }

    const DivisionValues = Divisions.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerParty(e) {
        setParty_dropdown_Select(e)
    }

    const PartyValues = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const formSubmitHandler = (event) => {

        event.preventDefault();
        // if (formValid(state, setState)) {
        //     const arr = PartyData.map(i => ({
        //         Party: Division_dropdown_Select.value,
        //         SubParty: i.value,
        //         CreatedBy: 1,
        //         UpdatedBy: 1,

        //     }))
        //     const jsonBody = JSON.stringify(arr);
        //     console.log(" jsonBody", jsonBody)
        //     if (pageMode === "edit") {
        //         // dispatch(updateCategoryID(jsonBody, EditData.id));
        //     }
        //     else {
        //         dispatch(PostMethodForPartySubParty(jsonBody));
        //     }
        // }

        const arr = PartyData.map(i => ({
            Party: Division_dropdown_Select.value,
            SubParty: i.value,
            CreatedBy: 1,
            UpdatedBy: 1,

        }))
        const jsonBody = JSON.stringify(arr);
        console.log(" jsonBody", jsonBody)
        dispatch(postPartySubParty(jsonBody));
    };


    /// Role Table Validation
    function AddPartyHandler() {
        debugger
        const find = PartyData.find((element) => {
            return element.value === Party_dropdown_Select.value
        });

        if (Party_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setPartyData([...PartyData, Party_dropdown_Select]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "Party already Exists ",
            }));
        }
    }


    // For Delete Button in table
    function UserRoles_DeleteButton_Handller(tableValue) {
        setPartyData(PartyData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>PartySubPartyMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={"PartySubPartyMaster"} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2  ">
                                                            <Row>
                                                                <Col md="4">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> Division </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={Division_dropdown_Select}
                                                                                options={DivisionValues}
                                                                                onChange={(e) => { handllerDivision(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Party</Label>
                                                                    <Select
                                                                        value={Party_dropdown_Select}
                                                                        options={PartyValues}
                                                                        onChange={(e) => { handllerParty(e) }}

                                                                    />

                                                                </FormGroup>

                                                            </Col>
                                                            <Col sm={2} style={{ marginTop: '28px' }} >
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary text-center"
                                                                    onClick={() =>
                                                                        AddPartyHandler()
                                                                    }
                                                                >
                                                                    <i className="dripicons-plus "></i>
                                                                </Button>
                                                            </Col>

                                                        </Row>
                                                        <Row>
                                                            <Col sm={3} style={{ marginTop: '28px' }}>
                                                                {PartyData.length > 0 ? (

                                                                    <div className="table">
                                                                        <Table className="table table-bordered  text-center">
                                                                            <Thead>
                                                                                <tr>
                                                                                    <th>Party</th>

                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {PartyData.map((TableValue) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            {TableValue.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                UserRoles_DeleteButton_Handller(TableValue.value)
                                                                                            }} >
                                                                                            </i>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </Tbody>
                                                                        </Table>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                    </>
                                                                )}
                                                            </Col>

                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "PartySubParty" })}
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>

                        </Card>

                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartySubParty

