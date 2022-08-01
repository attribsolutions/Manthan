import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
    Button,
    FormGroup,
    CardHeader,
} from "reactstrap";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import {
    AvForm,
    AvInput,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { Tbody, Thead, Table } from "react-super-responsive-table";
import {
    editHPagesIDSuccess,
    getPageAccess_DropDown_API,
    getPageList,
    getPageListSuccess,
    saveHPages,
    saveHPagesSuccess,
    updateHPages
} from "../../../store/Administrator/HPagesRedux/actions";
import { fetchModelsList } from "../../../store/Administrator/ModulesRedux/actions";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";

const HPageMaster = (props) => {

    var editDataGatingFromList = props.state;

    const formRef = useRef(null);
    const dispatch = useDispatch();

    const [IsEdit, setIsEdit] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [PageMode, setPageMode] = useState(false);
    const [tablePageAccessDataState, setTablePageAccessDataState] = useState([]);

    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [pageType_DropdownSelect, setPageType_DropdownSelect] = useState('');
    const [pageList_DropdownSelect, setPageList_DropdownSelect] = useState('');

    const [isShowPageChecked, setisShowPageChecked] = useState(false);
    const [pageAccessDropDownView, setPageAccessDropDownView] = useState(false);
    const [pageAccess_DropDownSelect, setPageAccess_DropDownSelect] = useState('');

    //Access redux store Data
    const { ModuleData, SaveMessage, PageList, PageAccess } = useSelector((state) => ({
        ModuleData: state.Modules.modulesList,
        SaveMessage: state.H_Pages.saveMessage,
        PageList: state.H_Pages.PageList,
        PageAccess: state.H_Pages.PageAccess,
    }));

    // For PageAccess DropDown
    useEffect(() => {
        dispatch(getPageAccess_DropDown_API());
    }, [dispatch]);

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        document.getElementById("txtName").focus();
        dispatch(fetchModelsList())
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setIsEdit(true);
            setTablePageAccessDataState(editDataGatingFromList.PagePageAccess)

            setModule_DropdownSelect({
                label: editDataGatingFromList.ModuleName,
                value: editDataGatingFromList.Module
            })
            setPageList_DropdownSelect({
                value: editDataGatingFromList.RelatedPageID,
                label: editDataGatingFromList.RelatedPageName,
            })

            // When value 2 is get then DropDown lable is "ListPage" and ShowMenu is disabled Otherwise DropDown lable is "AddPage" and ShowMenu is enabled
            let showCheckBox_pageType = editDataGatingFromList.PageType
            debugger
            if (showCheckBox_pageType === 2) {
                // document.getElementById("inp-showOnMenu").disabled = true
                // setisShowPageChecked(true)
                setPageAccessDropDownView(true)
                dispatch(getPageList(showCheckBox_pageType))
                setPageType_DropdownSelect({ value: 2, label: 'ListPage' })
            }
            else if (showCheckBox_pageType === 1) {

                // setisShowPageChecked(showCheckBox_pageType.isShowOnMenu);
                // document.getElementById("inp-showOnMenu").disabled = false
                // setPageAccessDropDownView(false)
                dispatch(getPageListSuccess([]))
                setPageList_DropdownSelect({ value: 0 })
                setPageType_DropdownSelect({ value: 1, label: 'AddPage' })

            }
            dispatch(editHPagesIDSuccess({ Status: false }))
        }
    }, [editDataGatingFromList]);

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {

        if ((SaveMessage.Status === true) && (SaveMessage.StatusCode === 200)) {
            dispatch(saveHPagesSuccess({ Status: false }))
            setModule_DropdownSelect('')
            setPageAccess_DropDownSelect('')
            setPageType_DropdownSelect('')
            setPageList_DropdownSelect('')
            formRef.current.reset();

            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: SaveMessage.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: SaveMessage.Message,
                    RedirectPath: `/PageList`,
                    AfterResponseAction: false
                }))
            }
        }
        else if (SaveMessage.Status === true) {
            dispatch(saveHPagesSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [SaveMessage])


    const PageAccessValues = PageAccess.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Module_DropdownOption = ModuleData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    // PageList Dropdown
    const PageList_DropdownOption = PageList.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    // PageList Dropdown
    const PageType_DropdownOption = [
        {
            value: 1,
            label: "Add Page",
        },
        {
            value: 2,
            label: "Page List",
        }
    ];

    //'Save' And 'Update' Button Handller
    const handleValidSubmit = (event, values) => {

        if (tablePageAccessDataState.length <= 0 && !(pageType_DropdownSelect.value === 1)) {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "At Least One PageAccess is Select",
                RedirectPath: false,
                PermissionAction: false,
            }));
            return
        }

        const jsonBody = JSON.stringify({
            Name: values.Name,
            Module: module_DropdownSelect.value,
            isActive: values.isActive,
            DisplayIndex: values.displayIndex,
            Icon: values.Icon,
            ActualPagePath: values.pagePath,
            isShowOnMenu: isShowPageChecked,
            PageType: pageType_DropdownSelect.value,
            PageHeading: values.pageheading,
            PageDescription: values.pagedescription,
            PageDescriptionDetails: values.pageheadingdescription,
            RelatedPageID: pageList_DropdownSelect.value,
            CreatedBy: 1,
            UpdatedBy: 1,
            PagePageAccess: tablePageAccessDataState.map((d) => ({
                Access: d.AccessID,
            })),
        });

        if (IsEdit) {
            dispatch(updateHPages(jsonBody, EditData.id));
        }
        else {
            dispatch(saveHPages(jsonBody));
        }
    };

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        setModule_DropdownSelect(e);
    }



    function PageAccess_DropdownSelect_Handler(e) {
        setPageAccess_DropDownSelect(e)

    }



    //  for PageType deropDown
    const PageType_DropdownSelectHandller = (e) => {

    

        if (e.value === 2) {


            // let showCheckBox = document.getElementById("inp-showOnMenu")
            const findShowOnMenu = PageAccessValues.find((element) => {
                return element.label === "IsShowOnMenu"
            })
            if (!(findShowOnMenu === undefined)) {
                setTablePageAccessDataState([{
                    AccessID: findShowOnMenu.value,
                    AccessName: findShowOnMenu.label
                }])
            }



            // setisShowPageChecked(true)
            dispatch(getPageList(e.value))
            // showCheckBox.disabled = true
            setPageAccessDropDownView(true)

        }
        else if (e.value === 1) {
            setTablePageAccessDataState([])
            // showCheckBox.disabled = false
            setPageAccessDropDownView(false)
            dispatch(getPageListSuccess([]))
            setPageList_DropdownSelect({ value: 0 })
        }
        setPageType_DropdownSelect(e)
    }








    const PageList_DropdownSelectHandller = (e) => {
        setPageList_DropdownSelect(e);
    }

    // ADD Button handler
    function AddRoleHandler() {

        const find = tablePageAccessDataState.find((element) => {
            return element.AccessID === pageAccess_DropDownSelect.value
        });

debugger
        if (pageAccess_DropDownSelect.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One DropDown Value",
            }));
        }
        else if (find === undefined) {
           const label = pageAccess_DropDownSelect.label;
            const value = pageAccess_DropDownSelect.value;

            if (label === "IsEdit") {
                const findIsView = tablePageAccessDataState.find((element) => {
                    return element.AccessName === "IsView"
                });
                if (findIsView == undefined) {
                    const ViewValues = PageAccessValues.find((element) => {
                        return element.label === "IsView"
                    });
                    setTablePageAccessDataState([
                        ...tablePageAccessDataState,
                        {
                            AccessID: ViewValues.value,
                            AccessName: ViewValues.label
                        },
                        {
                            AccessID: value,
                            AccessName: label,
                        }])
                }
                return
            }

            setTablePageAccessDataState([...tablePageAccessDataState, {
                AccessID: label,
                AccessName: value,
            }
            ]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "PageAccess Data already Exists ",
            }));
        }
    }

    // For Delete Button in table
    function PageAccess_DeleteButton_Handller(tableValue) {
        setTablePageAccessDataState(tablePageAccessDataState.filter(
            (item) => !(item.AccessID === tableValue)
        )
        )
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <MetaTags>
                        <title>Page Master| FoodERP-React FrontEnd</title>
                    </MetaTags>

                    <Card className="text-black" >
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <h4 className="card-title text-black">React Validation - Normal</h4>
                            <p className="card-title-desc text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                        </CardHeader>

                        <CardBody>
                            <AvForm
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v);
                                }}
                                ref={formRef}
                            >
                                <Card >
                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                        <Row >
                                            <Col md="3">
                                                <FormGroup className="mb-3 ">
                                                    <Label >Name </Label>
                                                    <AvField name="Name" id="txtName" value={EditData.Name}
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Name' },
                                                        }}
                                                        onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md="1">  </Col>

                                            <Col md="7">
                                                <FormGroup className="mb-3 ">
                                                    <Label >Page Description </Label>
                                                    <AvField name="pagedescription"
                                                        value={EditData.PageDescription}
                                                        type="text"
                                                        placeholder="Please Enter Page Description"
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Page Description' },
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row >
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label >Page Heading</Label>
                                                    <AvField name="pageheading"
                                                        type="text"
                                                        defaultValue=""
                                                        value={EditData.PageHeading}
                                                        placeholder="Enter your Page Heading "
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md="1">  </Col>
                                            <Col md="7">
                                                <FormGroup className="mb-3">
                                                    <Label>Page Description Details</Label>
                                                    <AvField name="pageheadingdescription"
                                                        type="text"
                                                        defaultValue=""
                                                        value={EditData.PageDescriptionDetails}
                                                        placeholder="Enter your Description "
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Page Description Deails' },
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                <Card className=" mt-n2 text-black">
                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                        <Row >
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Module</Label>
                                                    <Select
                                                        value={module_DropdownSelect}
                                                        options={Module_DropdownOption}
                                                        autoComplete='off'
                                                        onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="1">  </Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Page Type</Label>
                                                    <Select
                                                        value={pageType_DropdownSelect}
                                                        options={PageType_DropdownOption}
                                                        autoComplete='off'
                                                        onChange={(e) => { PageType_DropdownSelectHandller(e) }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md="1">  </Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Related Page List</Label>
                                                    <Select
                                                        value={pageList_DropdownSelect}
                                                        options={PageList_DropdownOption}
                                                        autoComplete='off'
                                                        onChange={(e) => { PageList_DropdownSelectHandller(e) }}
                                                    />

                                                </FormGroup>
                                            </Col>

                                        </Row>

                                        <Row >

                                            <Col md="3">
                                                <FormGroup >
                                                    <Label htmlFor="validationCustom01">Display Index</Label>
                                                    <AvField name="displayIndex" value={EditData.DisplayIndex} type="text"
                                                        autoComplete='off'
                                                        placeholder=" Please Enter Display Index" validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Please Enter Display Index Only 2 Digit ' },
                                                            tel: {
                                                                pattern: /^\d{1,2}$/
                                                            }
                                                        }} />
                                                </FormGroup>
                                            </Col>

                                            <Col md="1">  </Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Page Path</Label>
                                                    <AvField name="pagePath" value={EditData.ActualPagePath} type="text"
                                                        placeholder="Please Enter Page Path"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Page Path' },
                                                        }}
                                                        autoComplete='off'
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md="1">  </Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Icon</Label>
                                                    <AvField name="Icon" value={EditData.Icon} type="text"
                                                        placeholder="Please Enter Icon"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Icon' },
                                                        }}
                                                        autoComplete='off'
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <FormGroup className="mb-1 col col-sm-6">
                                                <Row className="justify-content-md-left">
                                                    {/* <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >Show on Menu</Label>
                                                    <Col md={2} style={{ marginTop: '9px' }} >

                                                        <div className="form-check form-switch form-switch-md mb-1" dir="ltr">
                                                            <input type="checkbox" className="form-check-input " id="inp-showOnMenu"
                                                                checked={isShowPageChecked}
                                                                name="isShowOnMenu"
                                                                onChange={() => { setisShowPageChecked(!isShowPageChecked) }}
                                                            />
                                                            <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                        </div>
                                                    </Col> */}
                                                    {/* <Col md="3">  </Col> */}
                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                                                    <Col md={2} style={{ marginTop: '9px' }} >

                                                        <div className="form-check form-switch form-switch-md mb-1" dir="ltr">
                                                            <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                checked={EditData.isActive}
                                                                name="isActive"
                                                                defaultChecked={true}
                                                            />
                                                            <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Row>

                                    </CardBody>
                                </Card>
                                {pageAccessDropDownView ?
                                    (
                                        <Card className=" mt-n2 text-black">
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row className="">
                                                    <FormGroup className=" ml-3 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Page Access</Label>
                                                        <Select
                                                            options={PageAccessValues}
                                                            onChange={(e) => { PageAccess_DropdownSelect_Handler(e) }}
                                                            // defaultValue={{ label: "IsShowOnMenu", value: 1 }}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                    </FormGroup>

                                                    <Col sm={1} style={{ marginTop: '28px' }} >
                                                        <Button
                                                            type="button"
                                                            className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                                            onClick={() =>
                                                                AddRoleHandler()
                                                            }
                                                        >
                                                            <i className="dripicons-plus "></i>
                                                        </Button>
                                                    </Col>

                                                    <Col sm={3} style={{ marginTop: '28px' }}>
                                                        {tablePageAccessDataState.length > 0 ? (

                                                            <div className="table-responsive">
                                                                <Table className="table table-bordered  text-center">
                                                                    <Thead >
                                                                        <tr>
                                                                            <th>Page Access</th>

                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </Thead>

                                                                    <Tbody  >
                                                                        {tablePageAccessDataState.map((TableValue) => (
                                                                            <tr >
                                                                                <td>
                                                                                    {TableValue.AccessName}
                                                                                </td>
                                                                                <td>
                                                                                   { !(TableValue.AccessName==="IsShowOnMenu") ? <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                        PageAccess_DeleteButton_Handller(TableValue.AccessID)
                                                                                    }} >
                                                                                    </i>
                                                                                     :null}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                            </div>
                                                        )
                                                            :
                                                            (<> </>)
                                                        }
                                                    </Col>
                                                </Row>

                                                <FormGroup className=" mt-3 ">
                                                    <Row className="mb-0">
                                                        <Col sm={2} >
                                                            <div>
                                                                {
                                                                    IsEdit ? (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                                                            className="btn btn-success w-md"
                                                                        >
                                                                            <i class="fas fa-edit me-2"></i>Update
                                                                        </button>) : (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                                                            className="btn btn-primary w-md"
                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                        </button>
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </FormGroup >
                                            </CardBody>
                                        </Card>)
                                    :
                                    (
                                        <Card className=" mt-n2 text-black">
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                <FormGroup className=" mt-3 ">
                                                    <Row className="mb-0">
                                                        <Col sm={2} >
                                                            <div>
                                                                {
                                                                    IsEdit ? (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                                                            className="btn btn-success w-md"
                                                                        >
                                                                            <i class="fas fa-edit me-2"></i>Update
                                                                        </button>) : (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                                                            className="btn btn-primary w-md"
                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                        </button>
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </FormGroup >
                                            </CardBody>
                                        </Card>)
                                }
                            </AvForm>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default HPageMaster;
