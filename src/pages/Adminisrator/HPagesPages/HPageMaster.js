import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
    Input,
    Button,
    FormGroup,
    CardHeader
} from "reactstrap";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import {
    AvForm,
    AvGroup,
    AvInput,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import AvField from "availity-reactstrap-validation/lib/AvField";
import ReactSelect from "react-select";
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

const HPageMaster = (props) => {
    var editDataGatingFromList = props.state;

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const [IsEdit, setIsEdit] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [selectModule, setSelectModule] = useState('');
    const [PageMode, setPageMode] = useState(false);
    const [isShowPageChecked, setisShowPageChecked] = useState();
    const [PageAccessData, setPageAccessData] = useState([]);
    const [selectPageType, setPageType] = useState('');
    const [selectPageList, setPageList] = useState('');
    const [selectPageAccessDropDown, setselectPageAccessDropDown] = useState('');

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

    const PageAccessValues = PageAccess.map((Data) => ({
        value: Data.ID,
        label: Data.Name
    }));

    function handllerPageAccess(e) {
        setselectPageAccessDropDown(e)
    }

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        document.getElementById("txtName").focus();
        dispatch(fetchModelsList())
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setIsEdit(true);
            setSelectModule({
                label: editDataGatingFromList.ModuleName,
                value: editDataGatingFromList.Module
            })
            setPageList({
                value: editDataGatingFromList.RelatedPageID,
                label: editDataGatingFromList.RelatedPageName,
            })

            setPageAccessData(editDataGatingFromList.PagePageAccess)

            // When value 2 is get then DropDown lable is "ListPage" and ShowMenu is disabled Otherwise DropDown lable is "AddPage" and ShowMenu is enabled
            let showCheckBox = editDataGatingFromList.PageType
            if (showCheckBox === 2) {
                document.getElementById("abc").disabled = true
                setisShowPageChecked(true)
                dispatch(getPageList(showCheckBox))
                setPageType({ value: 2, label: 'ListPage' })
            }
            else if (showCheckBox === 1) {

                setisShowPageChecked(showCheckBox.isShowOnMenu);
                document.getElementById("abc").disabled = false
                dispatch(getPageListSuccess([]))
                setPageList({ value: 0 })
                setPageType({ value: 1, label: 'AddPage' })

            }

            dispatch(editHPagesIDSuccess({ Status: false }))

        }
    }, [editDataGatingFromList]);

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {
        if ((SaveMessage.Status === true) && (SaveMessage.StatusCode === 200)) {
            dispatch(saveHPagesSuccess({ Status: false }))
            setSelectModule('')
            setselectPageAccessDropDown('')
            setPageType('')
            setPageList('')
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
                    RedirectPath: '/pagesList',
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
    }, [SaveMessage.Status])

    //'Save' And 'Update' Button Handller
    const handleValidSubmit = (event, values) => {

        if (PageAccessData.length <= 0) {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "At Least One PageAccess is Select",
                RedirectPath: false,
                PermissionAction: false,
            }));
            return
        }

        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                Description: values.Discription,
                Module: selectModule.value,
                isActive: values.isActive,
                DisplayIndex: values.DisplayIndex,
                Icon: values.Icon,
                ActualPagePath: values.ActualPagePath,
                isShowOnMenu: values.isShowOnMenu,
                PageType: selectPageType.value,
                RelatedPageID: selectPageList.value,
                CreatedBy: 1,
                UpdatedBy: 1,
                PagePageAccess: PageAccessData.map((d) => ({
                    AccessID: d.AccessID,
                })),
            }),
        };

        if (IsEdit) {
            dispatch(updateHPages(requestOptions.body, EditData.ID));
        }
        else {
            dispatch(saveHPages(requestOptions.body));
        }
    };

    // for module dropdown
    const HModuleSelectOnChangeHandller = (e) => {
        setSelectModule(e);
    }

    const optionModule = ModuleData.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    // PageList Dropdown
    const optionPageList = PageList.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));


    //  for PageType deropDown
    const PageType_SelectOnChangeHandller = (e) => {
        let showCheckBox = document.getElementById("abc")
        if (e.label === "ListPage") {
            setisShowPageChecked(true)
            dispatch(getPageList(e.value))
            showCheckBox.disabled = true
        }
        else if (e.label === "AddPage") {
            showCheckBox.disabled = false
            dispatch(getPageListSuccess([]))
            setPageList({ value: 0 })
        }
        setPageType(e)
    }


    const PageList_SelectOnChangeHandller = (e) => {
        setPageList(e);
    }

    // ADD Button handler
    function AddRoleHandler() {
        const find = PageAccessData.find((element) => {
            return element.AccessID === selectPageAccessDropDown.value
        });
        if (selectPageAccessDropDown.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One DropDown Value",
            }));
        }
        else if (find === undefined) {
            setPageAccessData([...PageAccessData, {
                AccessID: selectPageAccessDropDown.value,
                AccessName: selectPageAccessDropDown.label
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
        setPageAccessData(PageAccessData.filter(
            (item) => !(item.AccessID === tableValue)
        )
        )
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-3.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <Card>
                        <Row>
                            <Col lg={12}>
                                <Card >
                                    <CardHeader>
                                        <h4 className="card-title">React Validation - Normal</h4>
                                        <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                                    </CardHeader>

                                    <CardBody>
                                        <AvForm
                                            onValidSubmit={(e, v) => {
                                                handleValidSubmit(e, v);
                                            }}
                                            ref={formRef}
                                        >
                                            <Row>
                                                <Card >
                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                        <Row >

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Name </Label>
                                                                    <AvField name="Name" id="txtName" value={EditData.Name}
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        autoComplete='off'
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please enter your Name...!' },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1">  </Col>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Email </Label>
                                                                    <AvField name="email"
                                                                        id="email"
                                                                        type="email"
                                                                        value={EditData.email}
                                                                        placeholder="Enter your EmailID "
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter your EmailID' },
                                                                            tel: {
                                                                                pattern: /\S+@\S+\.\S+/
                                                                            }
                                                                        }}

                                                                    />

                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">  </Col>

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">MobileNo </Label>
                                                                    <AvField name="Mobile" type="tel"
                                                                        value={EditData.Mobile}
                                                                        placeholder="+91 "
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                                                                            tel: {
                                                                                pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                                                                            }
                                                                        }}

                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                    </CardBody>
                                                </Card>
                                            </Row>

                                            {/* <Row>
                                    <Card >
                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>



                                            <Row>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">DesignationID </Label>
                                                        <Select
                                                        // value={DesignationIDselect}
                                                        // options={DesignationIDValues}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="1">  </Col>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">working_hours </Label>
                                                        <AvField name="working_hours" value={EditData.working_hours}
                                                            type="number"
                                                            placeholder="Please Enter WorkingHours"
                                                            autoComplete='off'
                                                            validate={{
                                                                number: true,
                                                                required: { value: true, errorMessage: '*WorkingHours is Required' },

                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Row> */}

                                            <Row>
                                                <Card >
                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                        <Row className="mb-4">

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Module</Label>
                                                                    <Select
                                                                        value={selectModule}
                                                                        options={optionModule}
                                                                        autoComplete='off'
                                                                        onChange={(e) => { HModuleSelectOnChangeHandller(e) }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1">  </Col>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Page Type </Label>
                                                                    <Select
                                                                        value={selectPageList}
                                                                        options={optionPageList}
                                                                        autoComplete='off'
                                                                        onChange={(e) => { PageList_SelectOnChangeHandller(e) }}
                                                                    />

                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1">  </Col>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">Page List </Label>
                                                                    <Select
                                                                        value={selectPageList}
                                                                        options={optionPageList}
                                                                        autoComplete='off'
                                                                        onChange={(e) => { PageList_SelectOnChangeHandller(e) }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-4">

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">DisplayIndex</Label>
                                                                    <AvField name="DisplayIndex" value={EditData.DisplayIndex} type="number"
                                                                        autoComplete='off'
                                                                        placeholder=" Please Enter DisplayIndex" validate={{
                                                                            number: true,
                                                                            required: { value: true, errorMessage: 'Please enter a Display Index only 2 digit ' },
                                                                            tel: {
                                                                                pattern: /^\d{1,2}$/
                                                                            }
                                                                        }} />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1">  </Col>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01">PagePath</Label>
                                                                    <AvField name="ActualPagePath" value={EditData.ActualPagePath} type="text"
                                                                        placeholder="Please Enter Actual Page Path"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Actual Page Path' },
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

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Row style={{ marginTop: '25px' }}>
                                                                        <Label
                                                                            htmlFor="horizontal-firstname-input"
                                                                            className="col-sm-3 col-form-label"
                                                                        >IsActive</Label>
                                                                        <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                            <AvInput name="isActive" type="checkbox" id="switch1" switch="none" defaultChecked checked={EditData.isActive} />
                                                                            <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                                        </Col>
                                                                    </Row>

                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="1">  </Col>

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Row style={{ marginTop: '25px' }}>
                                                                        <Label
                                                                            htmlFor="horizontal-firstname-input"
                                                                            className="col-sm-3 col-form-label"
                                                                        >Is Show on Menu</Label>
                                                                        <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                            <AvInput name="isShowOnMenu" type="checkbox" id="abc" switch="none" checked={isShowPageChecked} Value={EditData.IsActive} disabled='' />
                                                                            <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                                        </Col>
                                                                    </Row>

                                                                </FormGroup>
                                                            </Col>

                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Row>



                                        </AvForm>
                                        <div>
                                        </div>
                                    </CardBody>
                                </Card>

                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default HPageMaster;
