import React, { useEffect, useState } from "react";
import {
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
import {
    getPriceListData,
    postPriceListDataSuccess
} from "../../../store/Administrator/PriceList/action";
import { getPartyTypes } from "../../../store/Administrator/PartyRedux/action";
import { getItemList, get_Division_ForDropDown, get_PriceList_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import { AvField } from "availity-reactstrap-validation";
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

const MarginMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [priceList_dropdown_Select, setpriceList_dropdown_Select] = useState("");
    const [FSSAIExipry, setFSSAIExipry] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        pages,
        PartyTypes,
        PriceList,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        pages: state.ItemMastersReducer.pages,
        PostAPIResponse: state.PriceListReducer.postMsg,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
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
        dispatch(getPartyTypes());
        dispatch(get_Division_ForDropDown());
        dispatch(getItemList());
        dispatch(get_PriceList_ForDropDown());
    }, [dispatch]);

    const PartyTypeDropdown_Options = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const PriceList_DropdownOptions = PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)

    }

    function PriceList_Dropdown_OnChange_Handller(e) {
        setpriceList_dropdown_Select(e)

    }
    const FSSAIExipryHandler = (e, date) => {
        setFSSAIExipry(date)
    }
    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            // setpartyType_dropdown_Select('')
            dispatch(postPriceListDataSuccess({ Status: false }))
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostAPIResponse.Message,
                RedirectPath: '',
            }))
        }

    }, [PostAPIResponse])

    const pageOptions = {
        sizePerPage: 10,
        totalSize: pages.length,
        custom: true,
    };

    // const defaultSorted = [
    //     {
    //       dataField: "Name",
    //       order: "asc",
    //     },
    //   ];
    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Current MRP",
            dataField: "",
            sort: true,
        },
        {
            text: "MRP ",
            dataField: "",
            sort: true,
            formatter: (cellContent, user) => (
                <>
                    <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Col>
                        <FormGroup className="mb-3 col col-sm-4 ">
                            <Input type="text" className="col col-sm text-center"></Input>
                            </FormGroup>
                        </Col>
                       
                    </div>
                </>
            ),
        },
    ]
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
                                            <Col md="4">
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

                                                <Col md="4">
                                                    <FormGroup className="mb-3 row ">
                                                        <Label className="col-sm-3 p-2 ml-n4 ">Party Type</Label>
                                                        <Col md="9">
                                                            <Select
                                                                value={partyType_dropdown_Select}
                                                                options={PartyTypeDropdown_Options}
                                                                className="rounded-bottom"
                                                                placeholder="select"
                                                                onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                classNamePrefix="select2-selection"

                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                <Col md="4">
                                                    <FormGroup className="mb-3 row ">
                                                        <Label className="col-sm-3 p-1 ml-n4 ">EffectiveDate</Label>
                                                        <Col md="9">
                                                            <Flatpickr
                                                                id="FSSAIExipry"
                                                                name="FSSAIExipry"
                                                                value={FSSAIExipry}
                                                                className="form-control d-block p-2 bg-white text-dark"
                                                                placeholder=" Please Enter FSSAI Exipry"
                                                                options={{
                                                                    altInput: true,
                                                                    altFormat: "F j, Y",
                                                                    dateFormat: "Y-m-d"
                                                                }}
                                                                onChange={FSSAIExipryHandler}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                    </Card>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                data={pages}
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
                </Container>
            </div>
        </React.Fragment>
    )
}


export default MarginMaster





