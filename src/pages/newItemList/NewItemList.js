import React, { useState, useEffect } from "react";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Col,  Row, Input,} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { GetFranchise_ItemGroup_ActionSuccess, GetFranchise_Items_ActionSuccess, GetFranchise_NameListAction_Success, GetFranchise_TableData_ActionSuccess } from "../../store/NewItemList/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { SpinnerState } from "../../store/Utilites/Spinner/actions";

const NewItemList = () => {

    const axios = require('axios');
    const dispatch = useDispatch();
    const current = new Date();
    const month = current.getMonth() + 1;

    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`}`;

    const initialDrodownSelect = [{ value: 0, label: "All" }]
    const [FranchaiseNameState, setFranchaiseName] = useState(initialDrodownSelect)
    const [SelectItemsState, setSelectItems] = useState(initialDrodownSelect)
    const [SelectItmGroupState, setSelectItmGroup] = useState(initialDrodownSelect)


    function AxiosFranchisenamesCallFunction() {
        var config = {
            method: 'get',
            url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchises`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        // dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                // dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetFranchise_NameListAction_Success(response.data.data))
                } else {
                    dispatch(GetFranchise_NameListAction_Success([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                // dispatch(SpinnerState(false));
                dispatch(GetFranchise_NameListAction_Success([]))
                console.log('error', error);
                alert("NetWork Error")
            });
    }
    function AxiosFranchiseNamesItemGroupCallFunction() {
        var config = {
            method: 'get',
            url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchiseGroups`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        // dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                console.log('response', response.data.data);
                // dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetFranchise_ItemGroup_ActionSuccess(response.data.data))
                } else {
                    dispatch(GetFranchise_ItemGroup_ActionSuccess([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                // dispatch(SpinnerState(false));
                dispatch(GetFranchise_ItemGroup_ActionSuccess([]))
                console.log('error', error);
                alert("NetWork Error")
            });
    }
    function AxiosFranchiseItemsCallFunction() {
        var config = {
            method: 'get',
            url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchiseItems?ItemGroup=0`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        // dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                console.log('response', response.data.data);
                // dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetFranchise_Items_ActionSuccess(response.data.data))
                } else {
                    dispatch(GetFranchise_Items_ActionSuccess([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                // dispatch(SpinnerState(false));
                dispatch(GetFranchise_ItemGroup_ActionSuccess([]))
                console.log('error', error);
                alert("NetWork Error")
            });
    }

    function GETFranchiseData(FromDate, ToDate, Franchises, ItemGroups, Items) {
        // alert(`http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchiseSale?FromDate=${FromDate}&ToDate=${ToDate}&Franchises=${Franchises}&GroupIDs=${ItemGroups}&items=${Items}`)
        var config = {
            method: 'get',
            url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchiseSale?FromDate=${FromDate}&ToDate=${ToDate}&Franchises=${Franchises}&GroupIDs=${ItemGroups}&items=${Items}`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetFranchise_TableData_ActionSuccess(response.data.data))
                } else {
                    dispatch(GetFranchise_TableData_ActionSuccess([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                dispatch(SpinnerState(false));
                dispatch(GetFranchise_TableData_ActionSuccess([]))
                console.log('error', error);
                alert("NetWork Error")
            });
    }


   

    const { FranchiseName, ItemGroup, Items, TableListData } = useSelector((state) => ({
        FranchiseName: state.Pos_NewItemList_Reducer.FranchiseName,
        ItemGroup: state.Pos_NewItemList_Reducer.ItemGroup,
        Items: state.Pos_NewItemList_Reducer.Items,
        TableListData: state.Pos_NewItemList_Reducer.TableData,
    }));

    function SelectDate_GO_Button_Handller() {
        let FromDate = document.getElementById("fromDate-input").value;
        let ToDate = document.getElementById("toDate-input").value;
        let Franchise = (FranchaiseNameState.map((element) => {
            return element.value
        })).toString();
        let Items = (SelectItemsState.map((element) => {
            return element.value
        })).toString();
        var ItemGroups = (SelectItmGroupState.map((element) => {
            return element.value
        })).toString();

        GETFranchiseData(FromDate, ToDate, Franchise, ItemGroups, Items);
    }

    useEffect(() => {
        AxiosFranchisenamesCallFunction();
        AxiosFranchiseNamesItemGroupCallFunction();
        AxiosFranchiseItemsCallFunction();
        SelectDate_GO_Button_Handller();
    }, [])

    const optionMulti = FranchiseName.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    const optionfranchiseItemGroup = ItemGroup.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    const optionItemList = Items.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    const defaultSorted = [
        {
            dataField: "FranchiseName", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: 15,
        totalSize: TableListData.length, // replace later with size(users),
        custom: true,
    };

    const pagesListColumns = [
        // {
        //     text: "ID",
        //     dataField: "ItemName",
        //     sort: false,
        //     type: "hidden",
        //     hidden :false ,
        //     formatter: ( cell,row,index) => {
        //         console.log("index r",index)
        //         return index
        //     }
        // },
        {
            text: "FranchiseName",
            dataField: "FranchiseName",
            sort: true,

        },
        {
            text: "Group Name",
            dataField: "ItemGroupName",
            sort: true,
        },
        {
            text: "ItemName",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "Quantity",
            dataField: "Quantity",
            sort: true,
        },
        {
            text: "Rate",
            dataField: "Rate",
            sort: true,
        },
        {
            text: "GST",
            dataField: "GST",
            sort: true,
        },
        {
            text: "Amount",
            dataField: "Amount",
            sort: true,
        },
        {
            text: "UOM",
            dataField: "UOM",
            sort: true,
        },

    ];
    return (
        <React.Fragment>
            <div className="page-content">
                {/* <Container fluid> */}
                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            data={TableListData}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Sales Report"}
                                        IsButtonVissible={false}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={TableListData.length}
                                        RedirctPath={false}
                                        IsSearch={true}
                                    />
                                    <Row>
                                        <Col md={1}>
                                            <div className="mb-1 text-left">
                                                <label htmlFor="horizontal-firstname-input" className="col-ls-6 col-form-label">From Date</label>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-1 text-left">
                                                <Input className="form-control" type="date"
                                                    defaultValue={currentDate} id="toDate-input" />
                                            </div>
                                        </Col>
                                        <Col md={1}>
                                            <div className="mb-1 text-left">
                                                <label htmlFor="horizontal-firstname-input" className="col-ls-6 col-form-label">To Date</label>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-1 text-left">
                                                <Input className="form-control" type="date"
                                                    defaultValue={currentDate} id="fromDate-input" />
                                            </div>
                                        </Col>
                                        <Col md={1}>
                                            <div className="mb-1 text-left">
                                                <div className="mb-1 text-left">
                                                    <label htmlFor="horizontal-firstname-input" className="col-ls-6 col-form-label">Franchise Name</label>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-1 text-left">
                                                <Select
                                                    id="ddlfranchiseName"
                                                    value={FranchaiseNameState}
                                                    isMulti={true}
                                                    options={optionMulti}
                                                    classNamePrefix="select2-selection"
                                                    // isLoading={true}
                                                    onChange={(e) => {
                                                        if (e.length === 0) setFranchaiseName(initialDrodownSelect)
                                                        else { setFranchaiseName(e) }

                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={1}>
                                            <div className="mb-1 text-left">
                                                <label htmlFor="horizontal-firstname-input"
                                                    className="col-ls-6 col-form-label">Item Groups</label>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-3">

                                                <Select
                                                    id="ddlItemGroup"
                                                    value={SelectItmGroupState}
                                                    isMulti={true}
                                                    options={optionfranchiseItemGroup}
                                                    classNamePrefix="select2-selection"
                                                    // isLoading={true}
                                                    onChange={(e) => {
                                                        if (e.length === 0) setSelectItmGroup(initialDrodownSelect)
                                                        else setSelectItmGroup(e);
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={1}>
                                            <div className="mb-1 text-left">
                                                <label htmlFor="horizontal-firstname-input"
                                                    className="col-ls-6 col-form-label">Item Name</label>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-3">
                                                <Select
                                                    id="ddlItemName"
                                                    value={SelectItemsState}
                                                    isMulti={true}
                                                    options={optionItemList}
                                                    classNamePrefix="select2-selection"
                                                    // isLoading={true}
                                                    onChange={(e) => {
                                                        if (e.length === 0) setSelectItems(initialDrodownSelect)
                                                        else setSelectItems(e);
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={3}></Col>
                                        <Col md={1}>
                                            <div className="mb-3 align-left">
                                                <button className="btn btn-success waves-effect btn-label wave-label" type="button"
                                                    onClick={() => { SelectDate_GO_Button_Handller() }}
                                                ><i className="bx bx-smile label-icon"></i>Search</button>
                                            </div>
                                        </Col>

                                    </Row>
                                    <br></br>
                                    <Row>
                                        <hr></hr>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    defaultSorted={defaultSorted}
                                                    classes={"table  table-bordered"}
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone
                                                {...paginationProps}
                                            />
                                        </Col>
                                    </Row>

                                    { }
                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    )}
                </PaginationProvider>
                {
                    (TableListData.length) === 0 ? <><br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br></>
                        : <></>
                }
            </div>
        </React.Fragment>
    );
};

export default NewItemList;
