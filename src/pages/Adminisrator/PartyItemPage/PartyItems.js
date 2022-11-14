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

import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, getItemList, getItemListSuccess, } from "../../../store/actions";

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
import { getpartyItemList, getPartyItemListSuccess, getSupplier, PostPartyItems, PostPartyItemsSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import SaveButton from "../../../components/Common/CommonSaveButton";
import { Td, Th, Tr } from "react-super-responsive-table";



const PartyItems = (props) => {

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();
    let editMode = history.location.pageMode;
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [isChecked, Setcheckbox] = useState([false])

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




    const GoButton_Handler = () => {
        let supplier = supplierSelect.value

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
                                                                        value={supplierSelect}
                                                                        classNamePrefix="select2-Supplier"
                                                                        isDisabled={editMode === "edit" ? true : false}
                                                                        options={supplierOptions}
                                                                        onChange={(e) => { setSupplierSelect(e) }}
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
                             <div  className="table-responsive">
                                {/* <BootstrapTable> */}
                                  <Table className="table table-bordered table-responsive">
                                    <Tr >
                                        <Th className="col-sm-1 text-center" style={{ height: "1cm" }}>Id</Th>
                                        <Th className="col-sm-5 text-center">ItemName</Th>
                                        <Th className="col-sm-1 text-center">Select All</Th>
                                    </Tr>

                                    {partyItem.map((i, k) => {
                                        return (
                                            <Tr style={{ height: "20px" }}>
                                                <Td className="col-sm-1 text-center" id="td">{i.id}</Td>
                                                <Td className="col-sm-5 text-center">{i.Name}</Td>
                                                <Td className="col-sm-1 text-center">
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="myCheck"
                                                        // checked={isChecked}
                                                        defaultChecked={i.itemCheck}
                                                        onChange={e => {
                                                            i.itemCheck = e.target.checked
                                                        }}

                                                    />
                                                </Td>
                                            </Tr>)
                                    })}
                                

                                </Table>

                                </div>
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


