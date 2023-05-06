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
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { get_Party_ForDropDown, get_PriceList_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import {
    deleteID_In_Margin_MasterPage,
    deleteID_In_Margin_MasterPageSuccess,
    getMarginListPage,
    postGoButtonForMargin_Master,
    postGoButtonForMargin_Master_Success,
    postMarginMasterData,
    postMarginMasterDataSuccess
} from "../../../store/Administrator/MarginMasterRedux/action";
import { AvForm } from "availity-reactstrap-validation";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";

const MarginMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef(null);
    let editMode = history.location.pageMode;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserAccState] = useState("");
    const [partyName_dropdown_Select, setPartyName_dropdown_Select] = useState("");
    const [priceList_dropdown_Select, setpriceList_dropdown_Select] = useState("");
    const [effectiveDate, setEffectiveDate] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        TableData,
        deleteMessage,
        Party,
        PriceList,
        userAccess
    } = useSelector((state) => ({
        TableData: state.MarginMasterReducer.MarginGoButton,
        deleteMessage: state.MarginMasterReducer.deleteId_For_MarginMaster,
        PostAPIResponse: state.MarginMasterReducer.PostData,
        Party: state.ItemMastersReducer.Party,
        PriceList: state.ItemMastersReducer.PriceList,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const location = { ...history.location }
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
            var PriceListid = editDataGatingFromList.PriceList_id
            var priceListName = editDataGatingFromList.PriceListName
            var partyId = editDataGatingFromList.Party_id
            var partyName = editDataGatingFromList.PartyName
            var effectiveDate = editDataGatingFromList.EffectiveDate

            const jsonBody = JSON.stringify({
                PriceList: PriceListid,
                Party: partyId,
                EffectiveDate: effectiveDate
            });
            dispatch(postGoButtonForMargin_Master(jsonBody))
            setPartyName_dropdown_Select({ label: partyName, value: partyId })
            setpriceList_dropdown_Select({ label: priceListName, value: PriceListid })
            setEffectiveDate(effectiveDate)

        }
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        dispatch(get_PriceList_ForDropDown());
        dispatch(get_Party_ForDropDown());
        dispatch(postGoButtonForMargin_Master_Success([]));
    }, [dispatch]);

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteID_In_Margin_MasterPageSuccess({ Status: false }));
            dispatch(postGoButtonForMargin_Master_Success([]))
            GoButton_Handler()
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMessage.Message,
                    AfterResponseAction: getMarginListPage,
                })
            );
        } else if (deleteMessage.Status === true) {
            dispatch(deleteID_In_Margin_MasterPageSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMessage.Message),
                })
            );
        }
    }, [deleteMessage]);

    const PartyTypeDropdown_Options = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const PriceList_DropdownOptions = PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyName_dropdown_Select(e)
    }

    function PriceList_Dropdown_OnChange_Handller(e) {
        setpriceList_dropdown_Select(e)
    }

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const MarginHandler = (e, user) => {
        user["Margin"] = e.target.value
    }

    const CurrentMRPHandler = (e, user) => {
        user["CurrentMRP"] = e.target.value
    }

    const GoButton_Handler = (event, values) => {

        let priceList = { ...priceList_dropdown_Select }
        let party = { ...partyName_dropdown_Select }

        const jsonBody = JSON.stringify({
            PriceList: priceList.value ? priceList.value : " ",
            Party: party.value ? party.value : 0,
            EffectiveDate: effectiveDate
        });
        if (!(priceList.value)) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "PriceList not select",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }
        else if (!(effectiveDate)) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "EffectiveDate not select",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }

        dispatch(postGoButtonForMargin_Master(jsonBody))
    };

    //select id for delete row
    const deleteHandeler = (id, name) => {
        dispatch(
            AlertState({
                Type: 5,
                Status: true,
                Message: `Are you sure you want to delete this Item : "${name}"`,
                RedirectPath: false,
                PermissionAction: deleteID_In_Margin_MasterPage,
                ID: id,
            })
        );
    };

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postMarginMasterDataSuccess({ Status: false }))
            setPartyName_dropdown_Select('')
            setEffectiveDate('')
            setpriceList_dropdown_Select('')

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
                    RedirectPath: url.MARGIN_lIST,
                }))
            }
        }

        else if (PostAPIResponse.Status === true) {
            dispatch(postMarginMasterDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

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
            text: "Current Margin",
            dataField: "CurrentMargin",
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
            text: "Margin ",
            dataField: "Margin",
            sort: true,
            formatter: (cellContent, user) => {

                if (((cellContent > 0) && (user["margin"] === undefined) || user.margin)) {
                    user["margin"] = true
                } else {
                    user["margin"] = false
                }
                return (

                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={cellContent}
                                    disabled={user.margin}
                                    className="col col-sm text-end"
                                    onChange={(e) => MarginHandler(e, user)}
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
            PriceList: priceList_dropdown_Select.value,
            Party: partyName_dropdown_Select.value,
            EffectiveDate: effectiveDate,
            Company: loginCompanyID(),
            CreatedBy: loginUserID(),
            UpdatedBy: loginUserID(),
            IsDeleted: 0,
            Item: index.Item,
            Margin: index.Margin,
            id: index.id
        }))

        const Find = ItemData.filter((index) => {
            return (!(index.Margin === '') && (index.id === ''))
        })

        const jsonBody = JSON.stringify(Find)

        dispatch(postMarginMasterData(jsonBody));
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };


    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>{metaTagLabel(userAccess)}</MetaTags>
                <Container fluid>
                    <AvForm
                        onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v);
                        }}
                        ref={formRef}
                    >
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ marginBottom: "4cm" }}>
                                <Row className="">
                                    <Col md={12} >
                                        <Card style={{ backgroundColor: "whitesmoke" }}>
                                            <CardHeader className="card-header   text-black c_card_body "  >
                                                <Row className="mt-3">
                                                    <Col sm={3}>
                                                        <FormGroup className="mb-3 row">
                                                            <Label className="col-sm-4 p-2 ml-n4 ">PriceList</Label>
                                                            <Col sm={8}>
                                                                <Select
                                                                    value={priceList_dropdown_Select}
                                                                    options={PriceList_DropdownOptions}
                                                                    isDisabled={editMode === "edit" ? true : false}
                                                                    className="rounded-bottom"
                                                                    placeholder="select"
                                                                    onChange={(e) => { PriceList_Dropdown_OnChange_Handller(e) }}
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm={3}>
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2" style={{ width: "2.5cm" }}>Party Name</Label>
                                                            <Col sm={8} style={{}}>
                                                                <Select
                                                                    value={partyName_dropdown_Select}
                                                                    options={PartyTypeDropdown_Options}
                                                                    isDisabled={editMode === "edit" ? true : false}
                                                                    className="rounded-bottom"
                                                                    placeholder="select"
                                                                    onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-md-6 p-2" style={{ width: "2.9cm" }}>EffectiveDate</Label>
                                                            <Col sm={8}>
                                                                <Flatpickr
                                                                    id="EffectiveDateid"
                                                                    name="effectiveDate"
                                                                    value={effectiveDate}
                                                                    isDisabled={editMode === "edit" ? true : false}
                                                                    className="form-control d-block p-2 bg-white text-dark"
                                                                    placeholder=" Please Enter EffectiveDate"
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
                                                    <Col sm={1}>
                                                        <Button type="button" color="btn btn-outline-success border-2 font-size-12 " onClick={() => { GoButton_Handler() }} >Go</Button>
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

export default MarginMaster





