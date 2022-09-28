import React, { useEffect, useState } from "react";
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
import { getItemList, get_Division_ForDropDown, get_Party_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import { AvForm } from "availity-reactstrap-validation";
import { postMRPMasterData, postMRPMasterDataSuccess } from "../../../store/Administrator/MRPMasterRedux/action";
import { getCategorylist } from "../../../store/Administrator/CategoryRedux/action";

const MRPMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [party_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [EffectiveDate, setEffectiveDate] = useState('');
    const [MRP, setMRP] = useState();

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        TableData,
        Party,
        Division,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        TableData: state.ItemMastersReducer.pages,
        // TableData: state.CategoryMasterReducer.CategoryListData,
        PostAPIResponse: state.PriceListReducer.PostData,
        Party: state.ItemMastersReducer.Party,
        Division: state.ItemMastersReducer.Division,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));
    console.log("TableData", TableData)
    // userAccess useEffect
    useEffect(() => {
        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    useEffect(() => {
        dispatch(get_Party_ForDropDown());
        dispatch(get_Division_ForDropDown());
        dispatch(getItemList());
        // dispatch(getCategorylist());
    }, [dispatch]);

    const PartyDropdown_Options = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)

    }

    function Division_Dropdown_OnChange_Handller(e) {
        setDivision_dropdown_Select(e)

    }
    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const MRPHandler = (e, cellContent,user,abd) => {
      user["MRP"]=e.target.value
        // setMRP(event.target.value)
    }

    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            // setpartyType_dropdown_Select('')
            dispatch(postMRPMasterDataSuccess({ Status: false }))
            // dispatch(getPriceListData(partyType_dropdown_Select.value))
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
            dataField: "",
            sort: true,
        },
        {

            text: "MRP ",
            dataField: "",
            sort: true,
            formatter: (cellContent, user, abd) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    defaultValue={MRP}
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

        const ItemData = TableData.map((index) => ({
            Division: division_dropdown_Select.value,
            Party: party_dropdown_Select.value,
            EffectiveDate: EffectiveDate,
            Company: 1,
            CreatedBy: 1,
            UpdatedBy: 1,
            Item: index.id,
            MRP:index.MRP 
        }))

        console.log("MRP", MRP)
        const jsonBody = JSON.stringify(ItemData)

        dispatch(postMRPMasterData(jsonBody));
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
                    <Card className="text-black">
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                        </CardHeader>

                        <CardBody>
                            <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}

                            >
                                <Row className="">
                                    <Col md={12}>
                                        <Card style={{ backgroundColor: "whitesmoke" }}>


                                            <CardHeader className="card-header   text-black " style={{ backgroundColor: "#e9e9ef" }} >
                                                <Row className="mt-3">
                                                    <Col md="4">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2 ml-n4 ">Division</Label>
                                                            <Col md="9">
                                                                <Select
                                                                    value={division_dropdown_Select}
                                                                    options={Division_DropdownOptions}
                                                                    className="rounded-bottom"
                                                                    placeholder="select"
                                                                    onChange={(e) => { Division_Dropdown_OnChange_Handller(e) }}
                                                                    classNamePrefix="select2-selection"

                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="4">
                                                        <FormGroup className="mb-3 row ">
                                                            <Label className="col-sm-3 p-2 ml-n4 ">Party Name</Label>
                                                            <Col md="9">
                                                                <Select
                                                                    value={party_dropdown_Select}
                                                                    options={PartyDropdown_Options}
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
                                                                    id="EffectiveDate"
                                                                    name="EffectiveDate"
                                                                    value={EffectiveDate}
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
                                                </Row>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                                <button
                                    type="submit"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save MRP"
                                    className="btn btn-primary w-md mt-2 float-end"
                                > <i className="fas fa-save me-2"></i> Save
                                </button>
                            </AvForm>
                        </CardBody>
                    </Card>

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

                </Container>
            </div>
        </React.Fragment>
    )
}


export default MRPMaster





