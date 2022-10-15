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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr"
import { AlertState } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { deleteGSTForMasterPage, deleteGSTForMasterPageSuccess, postGoButtonForGST_Master, postGoButtonForGST_Master_Success, postGSTMasterData, postGSTMasterDataSuccess } from "../../../store/Administrator/GSTRedux/action";

const GSTMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef(null);
    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editMode = history.location.pageMode;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [effectiveDate, setEffectiveDate] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        deleteMessage,
        TableData,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.GSTReducer.postMsg,
        deleteMessage: state.GSTReducer.deleteMsg,
        TableData: state.GSTReducer.GSTGoButton,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

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
        const editDataGatingFromList = history.location.editValue

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (!(editDataGatingFromList === undefined)) {
            document.getElementById("EffectiveDateid").disabled = true;

            var effectiveDate = editDataGatingFromList.EffectiveDate

            const jsonBody = JSON.stringify({
                EffectiveDate: effectiveDate,
            });
            dispatch(postGoButtonForGST_Master(jsonBody));
            setEffectiveDate(effectiveDate)
        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        dispatch(postGoButtonForGST_Master_Success([]));
    }, [dispatch]);

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postGSTMasterDataSuccess({ Status: false }))
            formRef.current.reset();
            setEffectiveDate('')
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
                    RedirectPath: "/GSTList",
                }))
            }
        }

        else if (postMsg.Status === true) {
            dispatch(postGSTMasterDataSuccess({ Status: false }))
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
            dispatch(deleteGSTForMasterPageSuccess({ Status: false }));
            dispatch(postGoButtonForGST_Master_Success([]))
            GoButton_Handler()
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMessage.Message,
                    //   AfterResponseAction: getMRPListPage,
                })
            );
        } else if (deleteMessage.Status === true) {
            dispatch(deleteGSTForMasterPageSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMessage.Message),
                })
            );
        }
    }, [deleteMessage]);

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const GSTPercentageHandler = (e, cellContent, user, abd) => {
        user["GSTPercentage"] = e.target.value
    }

    const CurrentGSTPercentageHandler = (e, cellContent, user, key) => {
        user["CurrentGSTPercentage"] = e.target.value
    }

    const CurrentHSNCodeHandler = (e, cellContent, user, abd) => {
        user["GSTPercentage"] = e.target.value
    }

    const HSNCodeHandler = (e, cellContent, user, key) => {
        user["HSNCode"] = e.target.value
    }
    //select id for delete row
    const deleteHandeler = (id, name) => {
        dispatch(
            AlertState({
                Type: 5,
                Status: true,
                Message: `Are you sure you want to delete this Item : "${name}"`,
                RedirectPath: false,
                PermissionAction: deleteGSTForMasterPage,
                ID: id,
            })
        );
    };

    const GoButton_Handler = (event, values) => {

        const jsonBody = JSON.stringify({
            EffectiveDate: effectiveDate,

        });
        if (!(effectiveDate)) {
            alert("EffectiveDate not select")
        }
        dispatch(postGoButtonForGST_Master(jsonBody))
        console.log("Go button Post Json", jsonBody)
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
            text: "Current GSTPercentage",
            dataField: "CurrentGSTPercentage",
            sort: true,
            formatter: (cellContent, user, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >

                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    disabled={true}
                                    defaultValue={TableData[key].CurrentGSTPercentage}
                                    className="col col-sm text-center"
                                    onChange={(e) => CurrentGSTPercentageHandler(e, cellContent, user, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        {

            text: "GSTPercentage ",
            dataField: "GSTPercentage",
            sort: true,
            formatter: (cellContent, user, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={TableData[key].GSTPercentage}
                                    disabled={!(user.GSTPercentage === '') ? true : false}
                                    className="col col-sm text-center"
                                    onChange={(e) => GSTPercentageHandler(e, cellContent, user, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        {
            text: "Current HSNCode",
            dataField: "CurrentHSNCode",
            sort: true,
            formatter: (cellContent, user, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >

                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    disabled={true}
                                    defaultValue={TableData[key].CurrentHSNCode}
                                    className="col col-sm text-center"
                                    onChange={(e) => CurrentHSNCodeHandler(e, cellContent, user, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        {

            text: "HSNCode ",
            dataField: "HSNCode",
            sort: true,
            formatter: (cellContent, user, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={TableData[key].HSNCode}
                                    disabled={!(user.HSNCode === '') ? true : false}
                                    className="col col-sm text-center"
                                    onChange={(e) => HSNCodeHandler(e, cellContent, user, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
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
            EffectiveDate: effectiveDate,
            Company: 1,
            CreatedBy: 1,
            IsDeleted:0,
            UpdatedBy: 1,
            Item: index.Item,
            GSTPercentage: index.GSTPercentage,
            HSNCode: index.HSNCode,
            id:index.id
        }))

        const Find = ItemData.filter((index) => {
            return (!(index.GSTPercentage === '') && !(index.HSNCode === '') && (index.id === ''))
        })
        const jsonBody = JSON.stringify(Find)

        dispatch(postGSTMasterData(jsonBody));
        console.log("jsonBody", jsonBody)
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };


    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>PartyType| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                <Container fluid>
                    <AvForm
                        onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v);
                        }}
                        ref={formRef}
                    >

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody>

                                <Row className="">
                                    <Col md={12}>
                                        <Card style={{ backgroundColor: "whitesmoke" }}>

                                            <CardHeader className="card-header   text-black " style={{ backgroundColor: "#e9e9ef" }} >
                                                <Row className="mt-3">
                                                    <Col md="3">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 ml-n5 ">EffectiveDate</Label>
                                                            <Col md="9">
                                                                <Flatpickr
                                                                    id="EffectiveDateid"
                                                                    name="effectiveDate"
                                                                    value={effectiveDate}
                                                                    className="form-control d-block p-2 bg-white text-dark"
                                                                    placeholder=" Please Enter FSSAI Exipry"
                                                                    options={{
                                                                        altInput: true,
                                                                        altFormat: "F j, Y",
                                                                        dateFormat: "Y-m-d"
                                                                    }}
                                                                    onChange={EffectiveDateHandler}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                  
                                                    <Col md="3" >
                                                        <Button type="button" color="btn btn-outline-success border-2 font-size-12" onClick={() => { GoButton_Handler() }} >Go</Button>

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
                                                keyField="id"
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
                                                                        keyField={"id"}
                                                                        responsive
                                                                        bordered={false}
                                                                        striped={false}
                                                                        // defaultSorted={defaultSorted}
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


export default GSTMaster





