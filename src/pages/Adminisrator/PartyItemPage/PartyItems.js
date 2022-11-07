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
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";

import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, } from "../../../store/actions";

import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,

} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { getSupplier, goButton, goButtonSuccess, PostPartyItemsSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import SaveButton from "../../../components/Common/CommonSaveButton";



const PartyItems = (props) => {

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();
    let editMode = history.location.pageMode;
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [SupplierNameSelect, setSupplierNameSelect] = useState('');
    const [userAccState, setUserPageAccessState] = useState("");
    // get method for dropdown
    useEffect(() => {
        dispatch(getSupplier());
    }, [dispatch]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        supplier,
        ItemName,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartyItemsReducer.postMsg,
            ItemName: state.PartyItemsReducer.itemName,
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

        const editDataGatingFromList = history.location.editValue

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (!(editDataGatingFromList === undefined)) {
            var SupplierName = editDataGatingFromList.Supplier
            var Supplierid = 28

            const jsonBody = JSON.stringify({
                Party: Supplierid,
            }
            );
            dispatch(goButton(jsonBody))
            setSupplierNameSelect({ label: SupplierName, value: Supplierid })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])


    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(goButtonSuccess([]))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
            }))

        } else if (postMsg.Status === true) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])


    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    // const defaultSorted = [
    //     {
    //         dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
    //         order: "asc", // desc or asc
    //     },
    // ];

    // const pageOptions = {
    //     sizePerPage: (items.length + 2),
    //     totalSize: 0,
    //     custom: true,
    // };

    const pagesListColumns = [
        {
            text: "id",
            dataField: "id",
            sort: true,
        },

        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },

        {
            text: "Select All",
            dataField: "checkbox",
            sort: true,
        },

    ];

    const GoButton_Handler = () => {
        let party = SupplierNameSelect.value

        if (!party > 0) {
            alert("Please Select Supplier")
            return
        }

        if (ItemName.length > 0) {
            if (window.confirm("Refresh  Item...!")) {
                dispatch(goButtonSuccess([]))
            } else {
                return
            }
        }

        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        const jsonBody = JSON.stringify({
            Party: party,
        }
        );

        dispatch(goButton(jsonBody))
        console.log("jsonBody", jsonBody)
    };


    const saveHandeller = () => {
        const jsonBody = JSON.stringify({

           
        });
         dispatch(PostPartyItemsSuccess(jsonBody));
        
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
                        <Breadcrumb breadcrumbItem={userAccState.PageHeading} />

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
                                                                        value={SupplierNameSelect}
                                                                        classNamePrefix="select2-Supplier"
                                                                        isDisabled={editMode === "edit" ? true : false}
                                                                        options={supplierOptions}
                                                                        onChange={(e) => { setSupplierNameSelect(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3" className="mt-4">
                                                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                                                onClick={GoButton_Handler}
                                                            >Go</Button>
                                                        </Col>
                                                    </Row>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={items}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-unRresponsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered table-hover"}

                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />

                                                    {mySearchProps(toolkitProps.searchProps)}
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

                    </PaginationProvider> */}


                                <Table className="table table-bordered table-responsive">
                                    <tr style={{ backgroundColor: "#dddddd" }}>
                                        <th>Id</th>
                                        <th>ItemName</th>
                                        <th>Select All</th>
                                    </tr>
                                    {arr.map((i, k) => {
                                        return (<tr>
                                            <td>{i.id}</td>
                                            <td>{i.ItemName}</td>
                                            <td><Input
                                                type="checkbox"
                                                id={`inpcheck${k}`}
                                            ></Input></td>
                                        </tr>)

                                    })}

                                </Table>

                                {(ItemName.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                    <SaveButton pageMode={pageMode} userAcc={userAccState}
                                        module={"PartyItems"} onClick={saveHandeller}
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



const arr = [{
    ItemName: "Abc1",
    id: 1
},
{
    ItemName: "Abc2",
    id: 2
},
{
    ItemName: "Abc3",
    id: 3
},
{
    ItemName: "Abc4",
    id: 4
},
{
    ItemName: "Abc5",
    id: 5
}]