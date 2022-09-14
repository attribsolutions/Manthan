import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Select from "react-select";

import classnames from "classnames";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import ReactSelect from "react-select";
import { Tbody, Thead } from "react-super-responsive-table";
import { getControlTypes, getFieldValidations, saveHPages } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";

const PageMasterTab = () => {
    const dispatch = useDispatch();
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const [EditData, setEditData] = useState([]);

    const [relatedPageListShowUI, setRelatedPageListShowUI] = useState(false);
    const [pageFieldTabTable, setPageFieldTabTable] = useState([{

        FieldLabel: '',
        ControlType: { label: "select", value: 0 },
        FieldValidation: { label: "select", value: 0 },
        IsCompulsory: '',
        FieldSequence: '',
        ShowInListPage: '',
        ListPageSeq: '',
        ShowInDownload: '',
        DownloadDefaultSelect: '',
      
    }]);

    const { ControlTypes, FieldValidations ,PostAPIResponse} = useSelector((state) => ({
        ControlTypes: state.H_Pages.ControlTypes,
        FieldValidations: state.H_Pages.FieldValidations,
        PostAPIResponse: state.H_Pages.saveMessage,

    }));

    useEffect(() => {
        dispatch(getControlTypes());
        dispatch(getFieldValidations());
    }, [dispatch]);

    const ControlTypes_DropdownOptions = ControlTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const FieldValidations_DropdownOptions = FieldValidations.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    function PageField_Tab_AddRow_Handler() {

        var newarr1 = [...pageFieldTabTable, {
            FieldLabel: '',
            ControlType: { label: "select", value: 0 },
            FieldValidation: { label: "select", value: 0 },
            IsCompulsory: '',
            FieldSequence: '',
            ShowInListPage: '',
            ListPageSeq: '',
            ShowInDownload: '',
            DownloadDefaultSelect: '',
           
        }]
        setPageFieldTabTable(newarr1)
    }

    function PageField_DeleteRow_Handler(key) {

        var removeElseArrray1 = pageFieldTabTable.filter((i, k) => {
            return !(k === key)
        })
        setPageFieldTabTable(removeElseArrray1)
    }

    function PageField_onChange_Handler(event, type, key) {
        debugger
        var found = pageFieldTabTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "FieldLabel") {

            newSelectValue = {
                FieldLabel: event,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }
        else if (type === 'ControlType') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: event,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }

        else if (type === 'FieldValidation') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: event,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }
        else if (type === 'IsCompulsory') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: event,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }

        else if (type === 'ShowInListPage') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: event,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }
        else if (type === 'ListPageSeq') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: event,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }
        else if (type === 'ShowInDownload') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: event,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }
        else if (type === 'DownloadDefaultSelect') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: event,
                
            }
        }
        else if (type === 'LinktoField') {

            newSelectValue = {
                FieldLabel: found.FieldLabel,
                ControlType: found.ControlType,
                FieldValidation: found.FieldValidation,
                IsCompulsory: found.IsCompulsory,
                FieldSequence: found.FieldSequence,
                ShowInListPage: found.ShowInListPage,
                ListPageSeq: found.ListPageSeq,
                ShowInDownload: found.ShowInDownload,
                DownloadDefaultSelect: found.DownloadDefaultSelect,
               
            }
        }

        let newTabArr = pageFieldTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setPageFieldTabTable(newTabArr)
    }


    const toggleCustom = (tab) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };


    const FormSubmitButton_Handler = (event, values) => {


        const jsonBody = JSON.stringify({
            PageHeading: "test List",
            Name: "test List",
            PageDescription: "test List",
            PageDescriptionDetails: "test List",
            Module: 2,
            isActive: true,
            DisplayIndex: 2,
            Icon: "test List",
            ActualPagePath: "test List",
            isShowOnMenu: true,
            PageType: 2,
            RelatedPageID: 35,
            CreatedBy: 1,
            UpdatedBy: 1,
            PagePageAccess: [
                {
                    Access: 2
                },
                {
                    Access: 3
                }
            ],
            PageFieldMaster: [
                {
                  FieldLabel: "testLabel",
                  IsCompulsory: true,
                  ListPageSeq: 1,
                  ShowInListPage: true,
                  ShowInDownload: true,
                  DownloadDefaultSelect: true,
                  ControlType: 1,
                  FieldValidation: 1
                }
              ]
        })
        dispatch(saveHPages(jsonBody));
    };



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v); }}>
                        <Breadcrumb title="Components" breadcrumbItem="Tabs & Accordions" />
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="h4">Custom Tabs</CardTitle>
                                    <p className="card-title-desc">Example of custom tabs</p>
                                </CardHeader>
                                <CardBody>
                                    <Nav tabs className="nav-tabs-custom nav-justified">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "1",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("1");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-home"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Page Master Details</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "2",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("2");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-user"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Page Field</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "3",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("3");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-envelope"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Messages</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "4",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("4");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-cog"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Settings</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                        // className={classnames({
                                        //     active: activeTab1 === "7",
                                        // })}
                                        // onClick={() => {
                                        //     toggle1("7")
                                        // }}
                                        >
                                            <span className="d-block d-sm-none">
                                                <i className="fas fa-home"></i>
                                            </span>
                                            {/* <span className="d-none d-sm-block">Tab7</span> */}
                                            <Button type="submit"> save</Button>

                                        </NavLink>
                                    </Nav>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="p-3 text-muted"
                                    >
                                        <TabPane tabId="1">
                                            <Row>
                                                <Card className="text-black" >
                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3 ">
                                                                    <Label>Name </Label>
                                                                    <AvField
                                                                        name="Name"
                                                                        id="txtName"
                                                                        //   value={EditData.Name}
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage: "Please Enter Name",
                                                                            },
                                                                        }}

                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1"> </Col>

                                                            <Col md="7">
                                                                <FormGroup className="mb-3 ">
                                                                    <Label>Page Description </Label>
                                                                    <AvField
                                                                        name="pagedescription"
                                                                        //   value={EditData.PageDescription}
                                                                        type="text"
                                                                        placeholder="Please Enter Page Description"
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage: "Please Enter Page Description",
                                                                            },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label>Page Heading</Label>
                                                                    <AvField
                                                                        name="pageheading"
                                                                        type="text"
                                                                        defaultValue=""
                                                                        //   value={EditData.PageHeading}
                                                                        placeholder="Enter your Page Heading "
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1"> </Col>
                                                            <Col md="7">
                                                                <FormGroup className="mb-3">
                                                                    <Label>Page Description Details</Label>
                                                                    <AvField
                                                                        name="pageheadingdescription"
                                                                        type="text"
                                                                        defaultValue=""
                                                                        //   value={EditData.PageDescriptionDetails}
                                                                        placeholder="Enter your Description "
                                                                        validate={{
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage:
                                                                                    "Please Enter Page Description Deails",
                                                                            },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                                <Card className=" mt-n2 text-black">
                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                        <Row>
                                                            <Col md="3">

                                                                <FormGroup className="mb-3 ">
                                                                    <Label htmlFor="validationCustom01">Module</Label>
                                                                    <ReactSelect
                                                                        //   value={module_DropdownSelect}
                                                                        //   options={Module_DropdownOption}
                                                                        autoComplete="off"
                                                                    //   onChange={(e) => {
                                                                    //     Module_DropdownSelectHandller(e);
                                                                    //   }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1" className=" mt-3">
                                                                {/* <Button className=" mt-3 btn btn-sm" type="button" onClick={() => { DropDownAddHandler() }}>add</Button> */}
                                                            </Col>

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Page Type</Label>
                                                                    <ReactSelect
                                                                        //   value={pageType_DropdownSelect}
                                                                        //   options={PageType_DropdownOption}
                                                                        autoComplete="off"
                                                                    //   onChange={(e) => {
                                                                    //     PageType_DropdownSelectHandller(e);
                                                                    //   }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1"> </Col>
                                                            {relatedPageListShowUI ? <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">
                                                                        Related Page List
                                                                    </Label>
                                                                    <ReactSelect
                                                                        //   value={pageList_DropdownSelect}
                                                                        //   options={PageList_DropdownOption}
                                                                        autoComplete="off"
                                                                    //   onChange={(e) => {
                                                                    //     PageList_DropdownSelectHandller(e);
                                                                    //   }}
                                                                    />
                                                                </FormGroup>
                                                            </Col> : <></>}

                                                        </Row>

                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup>
                                                                    <Label htmlFor="validationCustom01">
                                                                        Display Index
                                                                    </Label>
                                                                    <AvField
                                                                        name="displayIndex"
                                                                        //   value={EditData.DisplayIndex}
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        placeholder=" Please Enter Display Index"
                                                                        validate={{
                                                                            number: true,
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage:
                                                                                    "Please Enter Display Index Only 2 Digit ",
                                                                            },
                                                                            tel: {
                                                                                pattern: /^\d{1,2}$/,
                                                                            },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1"> </Col>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Page Path</Label>
                                                                    <AvField
                                                                        name="pagePath"
                                                                        //   value={EditData.ActualPagePath}
                                                                        type="text"
                                                                        placeholder="Please Enter Page Path"
                                                                        validate={{
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage: "Please Enter Page Path",
                                                                            },
                                                                        }}
                                                                        autoComplete="off"
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Icon</Label>
                                                                    <AvField
                                                                        name="Icon"
                                                                        //   value={EditData.Icon}
                                                                        type="text"
                                                                        placeholder="Please Enter Icon"
                                                                        validate={{
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage: "Please Enter Icon",
                                                                            },
                                                                        }}
                                                                        autoComplete="off"
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1"> </Col>
                                                            <FormGroup className="mb-1 col col-sm-6">
                                                                <Row className="justify-content-md-left">

                                                                    <Label
                                                                        htmlFor="horizontal-firstname-input"
                                                                        className="col-sm-2 col-form-label mt-4"
                                                                    >
                                                                        Active{" "}
                                                                    </Label>
                                                                    <Col md={5} style={{ marginTop: "15px" }}>
                                                                        <div
                                                                            className="form-check form-switch form-switch-md mb-1"
                                                                            dir="ltr"
                                                                        >
                                                                            <AvInput
                                                                                type="checkbox"
                                                                                className="form-check-input mt-4"
                                                                                id="customSwitchsizemd"
                                                                                checked={EditData.isActive}
                                                                                name="isActive"
                                                                                defaultChecked={true}
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor="customSwitchsizemd"
                                                                            ></label>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Row>
                                        </TabPane>

                                        <TabPane tabId="2">

                                            {/* <Card> */}
                                            {/* <CardBody style={{ backgroundColor: "whitesmoke" }}> */}

                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <Table className="table table-bordered">
                                                        <Thead >
                                                            <tr>
                                                                <th>Field Label</th>
                                                                <th className="col col-sm-2">Control Type</th>
                                                                <th className="col col-sm-2" >Field Validation</th>
                                                                <th>List Page Seq</th>
                                                                <th>Is Compulsory</th>
                                                                <th>Show In List Page</th>
                                                                <th>Show In Download</th>
                                                                <th>Download Default Select</th>
                                                                <th>Action</th>


                                                            </tr>
                                                        </Thead>
                                                        <Tbody  >
                                                            {pageFieldTabTable.map((TableValue, key) => (
                                                                <tr >
                                                                    <td>
                                                                        <Col >
                                                                            <Input
                                                                                type="text"
                                                                                id={`FieldLabel${key}`}
                                                                                value={pageFieldTabTable[key].FieldLabel}
                                                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "FieldLabel", key)}>
                                                                            </Input>
                                                                        </Col>
                                                                    </td>
                                                                    <td>

                                                                        <Select
                                                                            id={`ControlType-${key}`}

                                                                            // placeholder="select unit"
                                                                            value={pageFieldTabTable[key].ControlType}
                                                                            options={ControlTypes_DropdownOptions}
                                                                            onChange={(e) => PageField_onChange_Handler(e, "ControlType", key)}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Select
                                                                            id={`FieldValidation-${key}`}
                                                                            // placeholder="select unit"
                                                                            value={pageFieldTabTable[key].FieldValidation}
                                                                            options={FieldValidations_DropdownOptions}
                                                                            onChange={(e) => PageField_onChange_Handler(e, "FieldValidation", key)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Input

                                                                            type="text"
                                                                            id={`ListPageSeq${key}`}
                                                                            value={pageFieldTabTable[key].ListPageSeq}
                                                                            onChange={(e) => PageField_onChange_Handler(e.target.value, "ListPageSeq", key)}>

                                                                        </Input>
                                                                    </td>
                                                                    <td>
                                                                        <Input

                                                                            type="checkbox"
                                                                            id={`IsCompulsory${key}`}
                                                                            checked={pageFieldTabTable[key].IsCompulsory}
                                                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "IsCompulsory", key)}>

                                                                        </Input>
                                                                    </td>
                                                                    <td>
                                                                        <Input

                                                                            type="checkbox"
                                                                            id={`ShowInListPage${key}`}
                                                                            checked={pageFieldTabTable[key].ShowInListPage}
                                                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInListPage", key)}>

                                                                        </Input>
                                                                    </td>

                                                                    <td>
                                                                        <Input

                                                                            type="checkbox"
                                                                            id={`ShowInDownload${key}`}
                                                                            checked={pageFieldTabTable[key].ShowInDownload}
                                                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInDownload", key)}>

                                                                        </Input>
                                                                    </td>

                                                                    <td>
                                                                        <Input

                                                                            type="checkbox"
                                                                            id={`DownloadDefaultSelect${key}`}
                                                                            checked={pageFieldTabTable[key].DownloadDefaultSelect}
                                                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "DownloadDefaultSelect", key)}>

                                                                        </Input>
                                                                    </td>

                                                                    <td>
                                                                        {(pageFieldTabTable.length === key + 1) ?
                                                                            <Row className="">
                                                                                <Col md={6} className=" mt-3">
                                                                                    {(pageFieldTabTable.length > 1) ? <>
                                                                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                            PageField_DeleteRow_Handler(key)
                                                                                        }} >
                                                                                        </i>
                                                                                    </> : <Col md={6} ></Col>}

                                                                                </Col>

                                                                                <Col md={6} >
                                                                                    <Button className="btn btn-sm btn-light mt-3   align-items-sm-center text-center"
                                                                                        type="button"
                                                                                        onClick={() => { PageField_Tab_AddRow_Handler(key) }} >
                                                                                        <i className="dripicons-plus"></i>
                                                                                    </Button>
                                                                                </Col>
                                                                            </Row>
                                                                            :

                                                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                PageField_DeleteRow_Handler(key)
                                                                            }} >
                                                                            </i>
                                                                        }
                                                                    </td>

                                                                </tr>
                                                            ))}


                                                        </Tbody>
                                                    </Table>
                                                </Col>
                                            </Row>

                                            {/* </CardBody> */}
                                            {/* </Card> */}

                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        Etsy mixtape wayfarers, ethical wes anderson tofu
                                                        before they sold out mcsweeney's organic lomo retro
                                                        fanny pack lo-fi farm-to-table readymade. Messenger
                                                        bag gentrify pitchfork tattooed craft beer, iphone
                                                        skateboard locavore carles etsy salvia banksy hoodie
                                                        helvetica. DIY synth PBR banksy irony. Leggings
                                                        gentrify squid 8-bit cred pitchfork. Williamsburg
                                                        banh mi whatever gluten-free, carles pitchfork
                                                        biodiesel fixie etsy retro mlkshk vice blog.
                                                        Scenester cred you probably haven't heard of them,
                                                        vinyl craft beer blog stumptown. Pitchfork
                                                        sustainable tofu synth chambray yr.
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="4">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        Trust fund seitan letterpress, keytar raw denim
                                                        keffiyeh etsy art party before they sold out master
                                                        cleanse gluten-free squid scenester freegan cosby
                                                        sweater. Fanny pack portland seitan DIY, art party
                                                        locavore wolf cliche high life echo park Austin.
                                                        Cred vinyl keffiyeh DIY salvia PBR, banh mi before
                                                        they sold out farm-to-table VHS viral locavore cosby
                                                        sweater. Lomo wolf viral, mustache readymade
                                                        thundercats keffiyeh craft beer marfa ethical. Wolf
                                                        salvia freegan, sartorial keffiyeh echo park vegan.
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </AvForm>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PageMasterTab;