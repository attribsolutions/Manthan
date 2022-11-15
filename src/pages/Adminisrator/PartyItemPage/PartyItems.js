import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
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
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { getpartyItemList, getPartyItemListSuccess, getSupplier, PostPartyItems, PostPartyItemsSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable, { CHECKBOX_STATUS_CHECKED } from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import SaveButton from "../../../components/Common/CommonSaveButton";
import { countlabelFunc } from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { AvCheckbox } from "availity-reactstrap-validation";


const PartyItems = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    let editMode = history.location.pageMode;
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);

    const [supplierSelect, setSupplierSelect] = useState('');
    const [userAccState, setUserPageAccessState] = useState("");
    // get method for dropdown
    useEffect(() => {
        dispatch(getSupplier());
    }, [dispatch]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        supplier,
        partyItem,

        pageField,
        userAccess } = useSelector((state) => ({

            postMsg: state.PartyItemsReducer.postMsg,
            partyItem: state.PartyItemsReducer.partyItem,
            supplier: state.PartyItemsReducer.supplier,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.


    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(getPartyItemListSuccess([]))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
            }))

        } else if
            (postMsg.Status === true) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])


    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));
    
    const tableColumns = [
        {
            text: "PartyItemID",
            dataField: "id",
            sort: true,
        },
        {
            text: "ItemName",
            dataField: "Name",
            sort: true,
        }];


       const selectRow = {
            
            mode: 'checkbox',
            clickToSelect: true,
            text: "Action",
            dataField: "itemCheck",
            sort: true,
            selectColumnPosition: 'right',
            headerColumnStyle: {
                lable:'SelectAll'
              },

            formatter: (cellContent, row, col,k) => (
                <span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        onChange={e => row.itemCheck = e.target.checked}
                    />
                    
                </span>
                

            ),


   }

    // ];
    // const selectRow = {
    //     mode: 'checkbox',
    //     clickToSelect: true,
    //     headerColumnStyle: {
    //     },

    // }

    const pageOptions = {
        sizePerPage: 15,
        custom: true,
    };


    const GoButton_Handler = (e) => {
        let supplier = e.value

        if (!supplier > 0) {
            alert("Please Select Supplier")
            return
        }

        if (partyItem.length > 0) {
            if (window.confirm("Refresh  Item...!")) {
                dispatch(getPartyItemListSuccess([]))
            } else {
                return
            }
        }
        dispatch(getpartyItemList(supplier))
        // dispatch(getItemList(ItemList))
    };


    const saveHandeller = (event, values) => {
        const Find = partyItem.filter((index) => {
            return (index.itemCheck === true)
        })

        var PartyData = Find.map((index) => ({
            Item: index.id,
            Party: supplierSelect.value

        }))
        const jsonBody = JSON.stringify(Find, PartyData)
        dispatch(PostPartyItems(PartyData));
        console.log("post Data", jsonBody)

    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userAccState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>

                        <Breadcrumb
                            pageHeading={userAccState.PageHeading}
                            newBtnView={false}
                            showCount={true}
                            excelBtnView={false}
                        />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userAccState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userAccState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <Row className="">
                                    <Col md={12}>
                                        <Card>
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> SupplierName </Label>
                                                                <Col md="12">
                                                                    <Select
                                                                        value={supplierSelect}
                                                                        classNamePrefix="select2-Supplier"
                                                                        // isDisabled={editMode === "edit" ? true : false}
                                                                        options={supplierOptions}
                                                                        onChange={(e) => { ; GoButton_Handler(e) }
                                                                        // dispatch(GoButton_Handler());
                                                                    }
                                                                                  
                                                                        // onClick={GoButton_Handler}


                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3" className="mt-4">
                                                            {/* <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                                                // onClick={GoButton_Handler}
                                                            >Go</Button> */}
                                                        </Col>
                                                    </Row>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                                <PaginationProvider
                                    pagination={paginationFactory(pageOptions)}
                                >
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider

                                            keyField="id"
                                            data={partyItem}
                                            columns={tableColumns}
                                            search
                                        >
                                            {toolkitProps => (
                                                <React.Fragment>
                                                    <div className="table">
                                                        <BootstrapTable
                                                             selectRow={ selectRow }
                                                            keyField={"id"}
                                                            bordered={true}
                                                            striped={false}
                                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                            classes={"table align-middle table-nowrap table-hover"}
                                                            headerWrapperClasses={"thead-light"}

                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                        {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                        {mySearchProps(toolkitProps.searchProps)}
                                                    </div>

                                                    <Row className="align-items-md-center mt-30">
                                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                            <PaginationListStandalone
                                                                {...paginationProps}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </React.Fragment>
                                            )
                                            }
                                        </ToolkitProvider>
                                    )
                                    }

                                </PaginationProvider>


                                {(supplier.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                    <SaveButton pageMode={pageMode} userAcc={userAccState}
                                        module={"supplier"} onClick={saveHandeller}
                                    />
                                </div>
                                    : <div className="row save1"></div>}

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
export default PartyItems



