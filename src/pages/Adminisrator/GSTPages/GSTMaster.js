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
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertState } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { AvForm } from "availity-reactstrap-validation";
import {
    deleteGSTForMasterPage,
    deleteGSTForMasterPageSuccess,
    getGSTListPage,
    postGoButtonForGST_Master,
    postGoButtonForGST_Master_Success,
    postGSTMasterData,
    postGSTMasterDataSuccess
} from "../../../store/Administrator/GSTRedux/action";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";

const GSTMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef(null);
    let editMode = history.location.pageMode;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserAccState] = useState('');
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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {

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
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        dispatch(postGoButtonForGST_Master_Success([]));
    }, [dispatch]);

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postGSTMasterDataSuccess({ Status: false }))
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
                    AfterResponseAction: getGSTListPage,
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

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [TableData]);

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const GSTPercentageHandler = (e, user) => {
        user["GSTPercentage"] = e.target.value
    }

    const CurrentGSTPercentageHandler = (e, user) => {
        user["CurrentGSTPercentage"] = e.target.value
    }

    const CurrentHSNCodeHandler = (e, user) => {
        user["GSTPercentage"] = e.target.value
    }

    const HSNCodeHandler = (e, user) => {
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

    const GoButton_Handler = () => {

        const jsonBody = JSON.stringify({
            EffectiveDate: effectiveDate,
        });
        if (!(effectiveDate)) {
            alert("EffectiveDate not select")
        }
        dispatch(postGoButtonForGST_Master(jsonBody))
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
                                    onChange={(e) => CurrentGSTPercentageHandler(e, user)}
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
            formatter: (cellContent, user, key) => {
                if (((cellContent > 0) && (user["GSTPerDis"] === undefined) || user.GSTPerDis)) {
                    user["GSTPerDis"] = true
                } else {
                    user["GSTPerDis"] = false
                }
                return (
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={cellContent}
                                    disabled={user.GSTPerDis}
                                    className="col col-sm text-end"
                                    onChange={(e) => GSTPercentageHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                )
            },
        },
        {
            text: "Current HSNCode",
            dataField: "CurrentHSNCode",
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
                                    onChange={(e) => CurrentHSNCodeHandler(e, user)}
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
            formatter: (cellContent, user, key) => {
                if (((cellContent > 0) && (user["hsncodeDis"] === undefined) || user.hsncodeDis)) {
                    user["hsncodeDis"] = true
                } else {
                    user["hsncodeDis"] = false
                }
                return (

                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={cellContent}
                                    disabled={user.hsncodeDis}
                                    className="col col-sm text-end"
                                    onChange={(e) => HSNCodeHandler(e, user)}
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
    const handleValidSubmit = () => {
        var ItemData = TableData.map((index) => ({
            EffectiveDate: effectiveDate,
            Company: loginCompanyID(),
            CreatedBy: loginUserID(),
            IsDeleted: 0,
            UpdatedBy: loginUserID(),
            Item: index.Item,
            GSTPercentage: index.GSTPercentage,
            HSNCode: index.HSNCode,
            id: index.id
        }))


        const Find = ItemData.filter((index) => {
            return (!(index.GSTPercentage === '') && !(index.HSNCode === '') && (index.id === ''))
        })

        const jsonBody = JSON.stringify(Find)

        if (!(Find.length > 0) && !(editMode)) {
            alert("At Least one MRP add")
        }
        else {
            dispatch(postGSTMasterData(jsonBody));
            console.log("jsonBody", jsonBody)
        }


    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

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
                                <Row className="">
                                    <Col md={12}>
                                        <Card style={{ backgroundColor: "whitesmoke" }}>

                                            <CardHeader className="card-header   text-black c_card_body"  >
                                                <Row className="mt-2">
                                                    <Col md="6">
                                                        <FormGroup className="mb-4 row">
                                                            <Label className="col-md-4">EffectiveDate</Label>
                                                            <Col md="8">
                                                                <C_DatePicker
                                                                    id="EffectiveDateid"
                                                                    name="effectiveDate"
                                                                    placeholder = "Please Enter EffectiveDate"
                                                                    value={effectiveDate}
                                                                    onChange={EffectiveDateHandler}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="2">
                                                        <Button type="button" color="btn btn-outline-success border-2 font-size-12  "
                                                            className="mt-n2"
                                                            onClick={() => { GoButton_Handler() }} >Go</Button>

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
                                                                        id="table_Arrow"
                                                                        responsive
                                                                        bordered={false}
                                                                        striped={false}
                                                                        classes={"table  table-bordered"}
                                                                        noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
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
        </React.Fragment>
    )
}


export default GSTMaster





