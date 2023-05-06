import React, { useEffect, useState, useRef } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr"
import { AlertState } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {
    get_Division_ForDropDown,
    get_Party_ForDropDown
} from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import { AvForm } from "availity-reactstrap-validation";
import {
    deleteID_In_MasterPage,
    deleteID_In_MasterPageSuccess,
    getMRPListPage,
    postGoButtonForMRP_Master,
    postGoButtonForMRP_MasterSuccess,
    postMRPMasterData, postMRPMasterDataSuccess
} from "../../../store/Administrator/MRPMasterRedux/action";
import { MRP_lIST } from "../../../routes/route_url";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    loginIsSCMCompany,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as mode from "../../../routes/PageMode"
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { Change_Button } from "../../../components/Common/CommonButton";

const MRPMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef(null);
    let editMode = history.location.pageMode;
    let IsSCM = loginIsSCMCompany()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");

    const [party_dropdown_Select, setParty_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [effectiveDate, setEffectiveDate] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        deleteMessage,
        TableData,
        Party,
        Division,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.MRPMasterReducer.postMsg,
        deleteMessage: state.MRPMasterReducer.deleteIdForMRPMaster,
        TableData: state.MRPMasterReducer.MRPGoButton,
        Party: state.ItemMastersReducer.Party,
        Division: state.ItemMastersReducer.Division,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(postGoButtonForMRP_MasterSuccess([]));
        dispatch(get_Party_ForDropDown());
        dispatch(get_Division_ForDropDown());
    }, [dispatch]);

    useEffect(() => {

        const editDataGatingFromList = history.location.editValue

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (!(editDataGatingFromList === undefined)) {

            var divisionid = editDataGatingFromList.Division_id === null ? 0 : editDataGatingFromList.Division_id
            var divisionName = editDataGatingFromList.DivisionName === null ? "Select.." : editDataGatingFromList.DivisionName
            var partyId = editDataGatingFromList.Party_id === null ? 0 : editDataGatingFromList.Party_id
            var partyName = editDataGatingFromList.PartyName === null ? "Select.." : editDataGatingFromList.PartyName
            var effectiveDate = editDataGatingFromList.EffectiveDate

            const jsonBody = JSON.stringify({
                Division: (IsSCM === 1) ? 0 : divisionid,
                Party: (IsSCM === 1) ? 0 : partyId,
                EffectiveDate: effectiveDate
            });
            dispatch(postGoButtonForMRP_Master(jsonBody))
            setDivision_dropdown_Select({ label: divisionName, value: divisionid })
            setParty_dropdown_Select({ label: partyName, value: partyId })
            setEffectiveDate(effectiveDate)

        }
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postMRPMasterDataSuccess({ Status: false }))
            setDivision_dropdown_Select('')
            setEffectiveDate('')
            setParty_dropdown_Select('')

            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: MRP_lIST,
                }))
            }
        }

        else if (postMsg.Status === true) {
            dispatch(postMRPMasterDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteID_In_MasterPageSuccess({ Status: false }));
            dispatch(postGoButtonForMRP_MasterSuccess([]))
            GoButton_Handler()
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMessage.Message,
                    AfterResponseAction: getMRPListPage,
                })
            );
        } else if (deleteMessage.Status === true) {
            dispatch(deleteID_In_MasterPageSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMessage.Message),
                })
            );
        }
    }, [deleteMessage]);

    const PartyDropdown_Options = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function PartyType_Dropdown_OnChange_Handller(e) {
        setParty_dropdown_Select(e)
    }

    function Division_Dropdown_OnChange_Handller(e) {
        setDivision_dropdown_Select(e)
    }

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const MRPHandler = (e, user) => {

        user["MRP"] = e.target.value
    }

    const CurrentMRPHandler = (e, user) => {
        user["CurrentMRP"] = e.target.value
    }
    //select id for delete row
    const deleteHandeler = (id, name) => {
        dispatch(
            AlertState({
                Type: 5,
                Status: true,
                Message: `Are you sure you want to delete this Item : "${name}"`,
                RedirectPath: false,
                PermissionAction: deleteID_In_MasterPage,
                ID: id,
            })
        );
    };

    const GoButton_Handler = (event, values) => {

        let division = { ...division_dropdown_Select }
        let party = { ...party_dropdown_Select }

        const jsonBody = JSON.stringify({
            Division: division.value ? division.value : 0,
            Party: party.value ? party.value : 0,
            EffectiveDate: effectiveDate
        });

        if (!(effectiveDate)) {
            CustomAlert({
                Type: 4,
                Message: "Effective Date is Required"
            })
            return;
        }
        dispatch(postGoButtonForMRP_Master(jsonBody))
    };

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableData.length,
        custom: true,
    };

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Current MRP",
            dataField: "CurrentMRP",
            sort: true,
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >

                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    disabled={true}
                                    defaultValue={cellContent}
                                    className="col col-sm text-end"
                                    onChange={(e) => CurrentMRPHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        {

            text: "Effective from ",
            dataField: "CurrentDate",
            sort: true,
            formatter: (cellContent) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-6 ">
                                <Label style={{ color: "#B0290B" }}>{cellContent}</Label>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        {

            text: "MRP ",
            dataField: "MRP",
            sort: true,

            formatter: (cellContent, user) => {

                if (((cellContent > 0) && (user["mrp"] === undefined) || user.mrp)) {
                    user["mrp"] = true
                } else {
                    user["mrp"] = false
                }
                return (

                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={cellContent}
                                    disabled={user.mrp}
                                    className="col col-sm text-end"
                                    onChange={(e) => MRPHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                )
            },
        },
        {
            text: "Action ",
            dataField: "",
            formatter: (cellContent, user) => (

                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                {!(user.id === '') ?
                                    <Button
                                        id={"deleteid"}
                                        type="button"
                                        className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                        onClick={() => { deleteHandeler(user.id, user.Name); }}
                                    >
                                        <i className="mdi mdi-delete font-size-18"></i>
                                    </Button> : <></>}
                            </FormGroup>
                        </Col>

                    </div>
                </>

            ),
        },
    ]

    //'Save' And 'Update' Button Handller
    const handleValidSubmit = (event, values) => {

        var ItemData = TableData.map((index) => ({
            Division: (IsSCM === 1) ? null : division_dropdown_Select.value,
            Party: (IsSCM === 1) ? null : party_dropdown_Select.value,
            EffectiveDate: effectiveDate,
            Company: loginCompanyID(),
            CreatedBy: loginUserID(),
            UpdatedBy: loginUserID(),
            IsDeleted: 0,
            IsAdd: true,
            Item: index.Item,
            MRP: index.MRP,
            id: index.id
        }))

        const Find = ItemData.filter((index) => {
            return (!(index.MRP === '') && (index.id === ''))
        })
        const jsonBody = JSON.stringify(Find)
        dispatch(postMRPMasterData(jsonBody));

    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "3cm" }}>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.MRP} /> */}
                {/* <Breadcrumb pageHeading={userPageAccessState.PageHeading} /> */}
                <Container fluid>
                    <AvForm
                        onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v);
                        }}
                        ref={formRef}
                    >
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody>
                                <Row >
                                    <Col>
                                        <Card style={{ backgroundColor: "whitesmoke" }}>
                                            <CardHeader className="card-header   text-black c_card_body" >

                                                <Row className="mt-3 " >
                                                    {(IsSCM === 1) ?
                                                        null
                                                        :
                                                        <Col sm={3}>
                                                            <FormGroup className="mb-3 row ">
                                                                <Label className="col-sm-6 p-2 " style={{ width: "2cm" }}>Division</Label>
                                                                <Col sm={8} >
                                                                    <Select
                                                                        value={division_dropdown_Select}
                                                                        options={Division_DropdownOptions}
                                                                        isDisabled={((editMode === "edit") || (TableData.length > 0)) ? true : false}
                                                                        className="divisionName"
                                                                        placeholder="select"
                                                                        onChange={(e) => { Division_Dropdown_OnChange_Handller(e) }}
                                                                        classNamePrefix="select2-selection"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>}

                                                    {(IsSCM === 1) ?
                                                        null
                                                        :
                                                        <Col sm={3} >
                                                            <FormGroup className="mb-3 row ">
                                                                <Label className="col-sm-6 p-2" style={{ width: "2.5cm" }} >Party Name</Label>
                                                                <Col sm={8} >
                                                                    <Select
                                                                        value={party_dropdown_Select}
                                                                        options={PartyDropdown_Options}
                                                                        isDisabled={((editMode === "edit") || (TableData.length > 0)) ? true : false}
                                                                        className="rounded-bottom"
                                                                        placeholder="select"
                                                                        onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                        classNamePrefix="select2-selection"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    }

                                                    <Col sm={4}>
                                                        <FormGroup className="mb-3 row col ">
                                                            <Label className="col-sm-6 p-2 " style={{ width: "2.9cm" }}>EffectiveDate</Label>
                                                            <Col sm={8}>
                                                                <Flatpickr
                                                                    id="EffectiveDateid"
                                                                    name="effectiveDate"
                                                                    value={effectiveDate}
                                                                    disabled={((editMode === "edit") || (TableData.length > 0)) ? true : false}
                                                                    className="form-control d-block p-2 bg-white text-dark"
                                                                    placeholder=" Please Enter FSSAI Exipry"
                                                                    options={{
                                                                        altFormat: "d-m-Y",
                                                                        dateFormat: "Y-m-d",
                                                                    }}
                                                                    onChange={EffectiveDateHandler}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col >


                                                    <Col sm={1} >
                                                        {((TableData.length > 0)) ?
                                                            !(editMode) ?
                                                                < Change_Button onClick={(e) => {
                                                                    dispatch(postGoButtonForMRP_MasterSuccess([]));
                                                                }} />
                                                                : null
                                                            : <Button type="button" color="btn btn-outline-success border-2 font-size-12"
                                                                onClick={() => { GoButton_Handler() }} >Go</Button>
                                                        }

                                                    </Col>


                                                </Row>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                                {TableData.length > 0 ?
                                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                                keyField="Item"
                                                data={TableData}
                                                columns={pagesListColumns}
                                                search
                                            >
                                                {(toolkitProps) => (
                                                    <React.Fragment>
                                                        <Row>
                                                            <Col xl="12">
                                                                <div className="table-responsive">
                                                                    <BootstrapTable
                                                                        keyField={"Item"}
                                                                        responsive
                                                                        bordered={false}
                                                                        striped={false}
                                                                        classes={"table  table-bordered"}
                                                                        {...toolkitProps.baseProps}
                                                                        {...paginationTableProps}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="align-items-md-center mt-30">
                                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                <PaginationListStandalone {...paginationProps} />
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment>
                                                )}
                                            </ToolkitProvider>
                                        )}

                                    </PaginationProvider>
                                    : null}
                                {TableData.length > 0 ?
                                    <div>
                                        {
                                            (editMode) ?
                                                <button
                                                    type="submit"
                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
                                                    className="btn btn-success w-md mt-3"
                                                >
                                                    <i class="fas fa-edit me-2"></i>Update
                                                </button>
                                                : <button
                                                    type="submit"
                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
                                                    className="btn btn-primary w-md mt-3 "
                                                > <i className="fas fa-save me-2"></i> Save
                                                </button>
                                        }
                                    </div>
                                    : null}

                            </CardBody>
                        </Card>
                    </AvForm>
                </Container>
            </div>
        </React.Fragment >
    )
}


export default MRPMaster





