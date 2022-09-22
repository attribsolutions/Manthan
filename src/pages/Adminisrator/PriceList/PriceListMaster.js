import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";

import Select from "react-select";
import { MetaTags } from "react-meta-tags";

import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvField, AvForm, AvInput, } from "availity-reactstrap-validation";

import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { BreadcrumbShow, AlertState } from "../../../store/actions";
import { getPriceListData, postPriceListData, postPriceListDataSuccess } from "../../../store/Administrator/PriceList/action";
import { getPartyTypes } from "../../../store/Administrator/PartyRedux/action";

const PriceListMaster = (props) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let propsPageMode = props.pageMode;

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    // const [partyTypeSelect, setPartyTypeSelect] = useState({ value: '' });
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const { PostAPIResponse,
        priceListByPartyType,
        PartyTypes,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        PostAPIResponse: state.PriceListReducer.PostData,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
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
    }, [dispatch]);


    const PartyTypeDropdown_Options = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)

    }
    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            // setpartyType_dropdown_Select('')
            dispatch(postPriceListDataSuccess({ Status: false }))
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            setDropOpen(!dropOpen)
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostAPIResponse.Message,
                RedirectPath: '',

            }))

        }

    }, [PostAPIResponse])

    function goButtonHandler() {
        if (!(partyType_dropdown_Select === '')) {
            dispatch(getPriceListData(partyType_dropdown_Select.value))
        }
    }




    const [menu, setMenu] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const [currentPrice, setCurrentPrice] = useState({ Name: '' });

    const dropOpen_ONClickHandler = price => {
        setCurrentPrice(price)
        setDropOpen(true)
    }
    const delete_PriceList = price => {

    }

    function sub_Price_Add_Handler() {
        debugger
        var price = document.getElementById("txtsubprice")
        if (price.value === "") {
            alert("please enter value")
        } else {
            var mkup = document.getElementById(`mkupMkdown`).checked
            const jsonBody = JSON.stringify({
                Name: price.value,
                BasePriceListID: currentPrice.id,
                PLPartyType: partyType_dropdown_Select.value,
                MkUpMkDn: 1,
                Company: 1,
                CreatedBy: 1,
                CreatedOn: "2022-07-18T00:00:00",
                UpdatedBy: 1,
                UpdatedOn: "2022-07-18T00:00:00"
            });
            dispatch(postPriceListData(jsonBody));
        }

    }
    const toggle = () => {
        setMenu('');
    }

    function fun1(data1) {
        return (
            <div>
                {
                    data1.map(tree => fun2(tree))
                }
            </div>
        )
    }

    function fun2(node) {

        return (
            <div style={{ paddingLeft: "20px" }} className={""} >
                <div className='row justify-content-center mt-n4 '>
                    <div className=' col-10'>
                        <Input type="text" disabled={true} defaultValue={node.Name} >
                        </Input>
                    </div>
                    <div className=' col-1 al-end'>
                        <input type="checkBox" id={`mkUp${node.id}`}>
                        </input>
                    </div>
                    <div className=' col-1 '>
                        <i className="mdi mdi-pencil font-size-12"
                            onClick={e => setMenu(node.id)}  ></i>
                        <Dropdown isOpen={menu === node.id} toggle={toggle} className="d-inline-block">
                            <DropdownToggle className="btn header-item " tag="button">

                            </DropdownToggle>
                            <DropdownMenu className="language-switch dropdown-menu-end">
                                <DropdownItem
                                    key={node.id}
                                    onClick={(e) => { dropOpen_ONClickHandler(node) }}
                                >
                                    <span className="align-middle text-black" >{"Add Sub-Rate"}</span>
                                </DropdownItem>

                                <DropdownItem
                                    key={node.id}
                                    onClick={() => delete_PriceList(node.id)}
                                // // className={`notify-item ${selectedLang === key ? "active" : "none"
                                //     }`}
                                >
                                    <span className="align-middle text-danger"> {"Delete"} </span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {node.childern ? fun1(node.childern) : null}
                </div>
            </div>

        )

    }




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

                        <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                            <Row className="">
                                <Col md={12}>
                                    <Card style={{ backgroundColor: "whitesmoke" }}>


                                        <CardHeader className="card-header   text-black " style={{ backgroundColor: "#dddddd" }} >
                                            <Row className="mt-3">
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

                                                <Col md="3" className="mt- ">
                                                    <Button type="button" color="primary" onClick={(e) => { goButtonHandler() }}>Go</Button>
                                                </Col>

                                            </Row>
                                        </CardHeader>



                                        <div className={" row mt-4"}>
                                            <Modal
                                                isOpen={dropOpen}
                                                toggle={() => { setDropOpen(!dropOpen) }}
                                                size="sm"
                                                centered={true}
                                                backdrop={'static'}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0">Add sub-Price </h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDropOpen(!dropOpen)
                                                        }}
                                                        className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <Row className="justify-content-md-left">

                                                        <span className="form-label text-primary text-center">{currentPrice.Name}</span>

                                                        <Label htmlFor="horizontal-firstname-input" 
                                                        className="col-4 col-form-label" >sub-Price </Label>
                                                        <Col style={{ marginTop: '9px' }} >
                                                            <Input type="text" id='txtsubprice' />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mt-2">
                                                        <Label className="col-4 col-form-label" >MkUp </Label>
                                                        <Col className="mt-2">
                                                            <Input type={"checkbox"} id='mkupMkdown' />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-light" onClick={() => {
                                                        setDropOpen(!dropOpen)
                                                    }}>Close</button>
                                                    <button type="button" className="btn btn-primary" 
                                                    onClick={() => { sub_Price_Add_Handler() }} >Add</button>
                                                </div>

                                            </Modal>
                                            <Col md={1} ></Col>
                                            <Col md={5} >
                                           <div className="row"> <h4 className={'text-center text-primary'}>Price List</h4></div>
                                                <Card>
                                                    <CardBody className="mt-3">
                                                        
                                                        {fun1(priceListByPartyType)}

                                                    </CardBody>

                                                </Card>
                                            </Col>

                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    )
}


export default PriceListMaster



