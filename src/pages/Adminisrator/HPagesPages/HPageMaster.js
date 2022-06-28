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
    Button
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
            setEditData(editDataGatingFromList[0]);
            setIsEdit(true);
            setSelectModule({
                label: editDataGatingFromList[0].ModuleName,
                value: editDataGatingFromList[0].Module
            })
            setPageList({
                value: editDataGatingFromList[0].RelatedPageID,
                label: editDataGatingFromList[0].RelatedPageName,
            })

            setPageAccessData(editDataGatingFromList[0].PagePageAccess)

            // When value 2 is get then DropDown lable is "ListPage" and ShowMenu is disabled Otherwise DropDown lable is "AddPage" and ShowMenu is enabled
            let showCheckBox = editDataGatingFromList[0].PageType
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
                <MetaTags>
                    <title>Page Master| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <AvForm
                                        onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                                        ref={formRef}
                                    >
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Name
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Name" id="txtName" value={EditData.Name} type="text"
                                                        placeholder=" Please Enter Name "
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter a Name' },
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Description
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Discription" value={EditData.Description} type="text"
                                                        defaultValue=''
                                                        placeholder=" Please Enter Discription "
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                Module
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectModule}
                                                    options={optionModule}
                                                    autoComplete='off'
                                                    onChange={(e) => { HModuleSelectOnChangeHandller(e) }}
                                                />
                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    DisplayIndex
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="DisplayIndex" value={EditData.DisplayIndex} type="number"
                                                        autoComplete='off'
                                                        placeholder=" Please Enter DisplayIndex" validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Please enter a Display Index only 2 digit ' },
                                                            tel: {
                                                                pattern: /^\d{1,2}$/
                                                            }
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Icon
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Icon" value={EditData.Icon} type="text"
                                                        placeholder="Please Enter Icon"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Icon' },
                                                        }}
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Actual Page Path
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="ActualPagePath" value={EditData.ActualPagePath} type="text"
                                                        placeholder="Please Enter Actual Page Path"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Actual Page Path' },
                                                        }}
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                PageType
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectPageType}
                                                    id="first_name"
                                                    options={[{
                                                        value: 1,
                                                        label: "AddPage",
                                                    },
                                                    {
                                                        value: 2,
                                                        label: "ListPage",
                                                    }]}
                                                    autoComplete='off'
                                                    onChange={(e) => { PageType_SelectOnChangeHandller(e); }}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                PageList
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectPageList}
                                                    options={optionPageList}
                                                    autoComplete='off'
                                                    onChange={(e) => { PageList_SelectOnChangeHandller(e) }}
                                                />
                                            </Col>
                                        </Row>


                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                Is Show on Menu
                                            </Label>
                                            <Col sm={4}>
                                                {/* <input
                                                        type="checkbox"
                                                        id="abc"
                                                    /> */}
                                                <AvInput
                                                    type="checkbox" id="abc"
                                                    name="isShowOnMenu"
                                                    checked={isShowPageChecked}
                                                    disabled=''
                                                ></AvInput>
                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    IsActive
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="isActive"
                                                        checked={EditData.isActive}
                                                        type="checkbox"
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                PageAccess
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectPageAccessDropDown}
                                                    options={PageAccessValues}
                                                    autoComplete='off'
                                                    onChange={(e) => { handllerPageAccess(e) }}
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                {" "}
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    onClick={() =>
                                                        AddRoleHandler()
                                                    }
                                                >
                                                    Add
                                                </Button>
                                            </Col>
                                            <Col sm={3}>
                                                {PageAccessData.length > 0 ? (
                                                    <div>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered mb-0 table">
                                                                <thead >
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody >
                                                                    {PageAccessData.map((TableValue) => (
                                                                        <tr key={TableValue.AccessID}>
                                                                            <td>
                                                                                <h5 className="my-0 text-primary">
                                                                                    {TableValue.AccessName}
                                                                                </h5>
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-danger btn-sm waves-effect waves-light"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Add PageAccess"
                                                                                    onClick={() => {
                                                                                        PageAccess_DeleteButton_Handller(TableValue.AccessID)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    <i class="mdi mdi-trash-can d-block font-size-10"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ) :
                                                    null
                                                }
                                            </Col>
                                        </Row>

                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                    {
                                                        IsEdit ? (<button
                                                            type="submit"
                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                                            className="btn btn-success w-md"
                                                        >
                                                            <i class="fas fa-edit me-2"></i>Update
                                                        </button>) : (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </Col>{" "}
                                        </Row>
                                    </AvForm>
                                    <br></br>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default HPageMaster;
