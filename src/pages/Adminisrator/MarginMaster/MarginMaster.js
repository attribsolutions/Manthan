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
import { getPartyTypes } from "../../../store/Administrator/PartyRedux/action";
import { get_Party_ForDropDown, get_PriceList_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import {

    postGoButtonForMargin_Master,
    postGoButtonForMargin_Master_Success,
    postMarginMasterData,
    postMarginMasterDataSuccess
} from "../../../store/Administrator/MarginMasterRedux/action";
import { AvForm } from "availity-reactstrap-validation";

const MarginMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef(null);
    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [partyName_dropdown_Select, setPartyName_dropdown_Select] = useState("");
    const [priceList_dropdown_Select, setpriceList_dropdown_Select] = useState("");
    const [effectiveDate, setEffectiveDate] = useState('');
    const [Margin, setMRP] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        TableData,
        Party,
        PriceList,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        TableData: state.MarginMasterReducer.MarginGoButton,
        PostAPIResponse: state.MarginMasterReducer.PostData,
        Party: state.ItemMastersReducer.Party,
        PriceList: state.ItemMastersReducer.PriceList,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));

    // userAccess useEffect
    useEffect(() => {
        let userAcc = undefined;
        if (editDataGatingFromList === undefined) {
            let locationPath = history.location.pathname;
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return `/${inx.ActualPagePath}` === locationPath;
            });
        } else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage;
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return `/${inx.ActualPagePath}` === relatatedPage;
            });
        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc);
        }
    }, [RoleAccessModifiedinSingleArray]);

    useEffect(() => {
        dispatch(get_PriceList_ForDropDown());
        dispatch(get_Party_ForDropDown());
        dispatch(postGoButtonForMargin_Master_Success([]));
    }, [dispatch]);

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

    const MRPHandler = (e, cellContent, user, abd) => {
        user["Margin"] = e.target.value
    }

    const CurrentMRPHandler = (e, cellContent, user, key) => {
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
            alert("PriceList not select")
        }
        else if (!(effectiveDate)) {
            alert("EffectiveDate not select")
        }
        dispatch(postGoButtonForMargin_Master(jsonBody))
        console.log(jsonBody)
    };

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postMarginMasterDataSuccess({ Status: false }))
            formRef.current.reset();
            setPartyName_dropdown_Select('')
            setEffectiveDate('')
            setpriceList_dropdown_Select('')
            setMRP('')

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
                    RedirectPath: '/MarginList',
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
            dataField: "",
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
                                    defaultValue={TableData[key].CurrentMargin}
                                    className="col col-sm text-center"
                                    onChange={(e) => CurrentMRPHandler(e, cellContent, user, key)}
                                />
                            </FormGroup>
                        </Col>

                    </div>
                </>
            ),
        },
        {

            text: "Margin ",
            dataField: "",
            sort: true,
            formatter: (cellContent, user, abd) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={Margin}
                                    className="col col-sm text-center"
                                    onChange={(e) => MRPHandler(e, cellContent, user, abd)}
                                />
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
            Company: 1,
            CreatedBy: 1,
            UpdatedBy: 1,
            Item: index.id,
            Margin: index.Margin
        }))

        const Find = ItemData.find((index) => {
            return !(index.Margin === undefined)
        })

        console.log("Find", Find)
        const jsonBody = JSON.stringify([Find])

        dispatch(postMarginMasterData(jsonBody));
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

                            <CardBody className=" vh-10 0 text-black"  >
                                <Row className="">
                                    <Col md={12}>
                                        <Card style={{ backgroundColor: "whitesmoke" }}>


                                            <CardHeader className="card-header   text-black " style={{ backgroundColor: "#e9e9ef" }} >
                                                <Row className="mt-3">
                                                    <Col md="3">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2 ml-n4 ">PriceList</Label>
                                                            <Col md="9">
                                                                <Select
                                                                    value={priceList_dropdown_Select}
                                                                    options={PriceList_DropdownOptions}
                                                                    className="rounded-bottom"
                                                                    placeholder="select"
                                                                    onChange={(e) => { PriceList_Dropdown_OnChange_Handller(e) }}
                                                                    classNamePrefix="select2-selection"

                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="3">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2 ml-n4 ">Party Name</Label>
                                                            <Col md="9">
                                                                <Select
                                                                    value={partyName_dropdown_Select}
                                                                    options={PartyTypeDropdown_Options}
                                                                    className="rounded-bottom"
                                                                    placeholder="select"
                                                                    onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                    classNamePrefix="select2-selection"

                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="3">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2 ml-n4 ">EffectiveDate</Label>
                                                            <Col md="9">
                                                                <Flatpickr
                                                                    id="effectiveDate"
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
                                                                        //  cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
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
                                    <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save MRP"

                                        className="btn btn-primary w-md "
                                    > <i className="fas fa-save me-2"></i> Save
                                    </button>
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





