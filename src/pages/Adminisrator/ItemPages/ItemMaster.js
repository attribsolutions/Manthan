// import React, { useEffect, useRef, useState } from "react";
// import Breadcrumb from "../../../components/Common/Breadcrumb";
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Label,
//   CardHeader,
//   FormGroup,
// } from "reactstrap";
// import {
//   AvForm,
//   AvField,
//   AvInput,
// } from "availity-reactstrap-validation";
// import { useDispatch, useSelector } from "react-redux";

// import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
// import {
//   editItemSuccess,
//   getItemGroup_ForDropDown,
//   postItemData,
//   PostItemDataSuccess,
//   updateItemID,
// } from "../../../store/Administrator/ItemsRedux/action";
// import Select from "react-select";
// import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
// import { MetaTags } from "react-meta-tags";
// import { useHistory } from "react-router-dom";
// import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

// const ItemsMaster = (props) => {

//   const formRef = useRef(null);
//   const dispatch = useDispatch();
//   const history = useHistory()

//   //*** "isEditdata get all data from ModuleID for Binding  Form controls
//   let editDataGatingFromList = props.state;

//   //'IsEdit'--if true then update data otherwise it will perfrom save operation
//   const [EditData, setEditData] = useState([]);
//   const [pageMode, setPageMode] = useState("save");
//   const [userPageAccessState, setUserPageAccessState] = useState('');
//   const [itemGroupSelect, setItemGroupSelect] = useState("");

//   //Access redux store Data /  'save_ModuleSuccess' action data
//   const { PostAPIResponse, ItemGroupList,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
//     PostAPIResponse: state.ItemMastersReducer.postMessage,
//     ItemGroupList: state.ItemMastersReducer.ItemGroupList,
//   }));

//   // userAccess useEffect
//   useEffect(() => {
//     if ((editDataGatingFromList === undefined)) {
//         const userAcc = CommonGetRoleAccessFunction(history)
//         if (!(userAcc === undefined)) {
//             setUserPageAccessState(userAcc)
//         }
//     } else {
//         let RelatedPageID = history.location.state.UserDetails.RelatedPageID
//         const userfound = RoleAccessModifiedinSingleArray.find((element) => {
//             return element.id === RelatedPageID
//         })
//         setUserPageAccessState(userfound)
//     }

// }, [history])

//   // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
//   useEffect(() => {

//     if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
//     dispatch(getItemGroup_ForDropDown());
//     if (!(editDataGatingFromList === undefined)) {
//       setEditData(editDataGatingFromList);
//       setItemGroupSelect({
//         value: editDataGatingFromList.ItemGroup_id,
//         label: editDataGatingFromList.ItemGroupName,
//       });
//       setPageMode("edit");
//       dispatch(editItemSuccess({ Status: false }));
//       dispatch(editItemSuccess({ Status: false }));
//       dispatch(BreadcrumbShow(editDataGatingFromList.Name));
//       return;
//     }
//   }, [editDataGatingFromList]);

//   useEffect(() => {
//     if (PostAPIResponse.Status === true && PostAPIResponse.StatusCode === 200) {
//       dispatch(PostItemDataSuccess({ Status: false }));
//       setItemGroupSelect('')
//       formRef.current.reset();
//       if (pageMode === "other") {
//         dispatch(
//           AlertState({
//             Type: 1,
//             Status: true,
//             Message: PostAPIResponse.Message,
//           })
//         );
//       } else {
//         dispatch(
//           AlertState({
//             Type: 1,
//             Status: true,
//             Message: PostAPIResponse.Message,
//             RedirectPath: "/ItemList",
//             AfterResponseAction: false,
//           })
//         );
//       }
//     } else if (PostAPIResponse.Status === true) {
//       dispatch(PostItemDataSuccess({ Status: false }));
//       dispatch(
//         AlertState({
//           Type: 4,
//           Status: true,
//           Message: JSON.stringify(PostAPIResponse.Message),
//           RedirectPath: false,
//           AfterResponseAction: false,
//         })
//       );
//     }
//   }, [PostAPIResponse]);

//   //'Save' And 'Update' Button Handller
//   const handleValidUpdate = (event, values) => {
//     const jsonBody = JSON.stringify({
//       Name: values.Name,
//       GSTPercentage: values.GSTPercentage,
//       MRP: values.MRP,
//       ItemGroup: itemGroupSelect.value,
//       isActive: values.isActive,
//       Sequence: values.Sequence,
//       BaseUnitID: values.BaseUnit,
//       Rate: values.Rate,
//       CreatedBy: 1,
//       CreatedOn: "2022-05-20T11:22:55.711483Z",
//       UpdatedBy: 1,
//       UpdatedOn: "2022-05-20T11:22:55.711483Z",
//     });
// debugger
//     if (pageMode === 'edit') {
//       dispatch(updateItemID(jsonBody, EditData.id));
//     }
//     else {
//       dispatch(postItemData(jsonBody));
//     }
//   };

//   const ItemGroup_Options = ItemGroupList.map((index) => ({
//     value: index.id,
//     label: index.Name,
//   }));

//   function handllerItemGroupID(e) {
//     setItemGroupSelect(e);
//   }

//   // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
//   var IsEditMode_Css = "";
//   if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

//   if (!(userPageAccessState === '')) {
//     return (
//       <React.Fragment>
//         <MetaTags>
//           <title>Item Master| FoodERP-React FrontEnd</title>
//         </MetaTags>
//         <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
//           <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
//           <Container fluid>

//             <Card className="text-black" >
//               <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
//                 <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
//                 <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
//               </CardHeader>
//               <CardBody
//                 className=" vh-10 0 text-black"
//                 style={{ backgroundColor: "#whitesmoke" }}
//               >
//                 <AvForm
//                   onValidSubmit={(e, v) => {
//                     handleValidUpdate(e, v);
//                   }}
//                   ref={formRef}
//                 >
//                   <Row>
//                     <Col md={12}>
//                       <Card>
//                         <CardBody style={{ backgroundColor: "whitesmoke" }}>
//                           <Row>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">Name</Label>
//                               <AvField
//                                 name="Name"
//                                 id="txtName"
//                                 value={EditData.Name}
//                                 type="text"
//                                 placeholder="Please Enter Name"
//                                 autoComplete="off"
//                                 validate={{
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter Name",
//                                   },
//                                 }}
//                                 onChange={(e) => {
//                                   dispatch(BreadcrumbShow(e.target.value));
//                                 }}
//                               />
//                             </FormGroup>
//                             <Col md="1"> </Col>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">
//                                 {" "}
//                                 Item Group{" "}
//                               </Label>
//                               <Select
//                                 name="ItemGroup"
//                                 id="txtItemGroup"
//                                 value={itemGroupSelect}
//                                 options={ItemGroup_Options}
//                                 onChange={(e) => {
//                                   handllerItemGroupID(e);
//                                 }}
//                                 autocomplete="off"
//                               />
//                             </FormGroup>
//                           </Row>

//                           <Row>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">
//                                 GST (%)
//                               </Label>
//                               <AvField
//                                 name="GSTPercentage"
//                                 value={EditData.GSTPercentage}
//                                 id="txtGST"
//                                 type="text"
//                                 placeholder="Please Enter GST (%)"
//                                 autoComplete="off"
//                                 validate={{
//                                   number: true,
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter  GST (%)",
//                                   },
//                                 }}
//                               />
//                             </FormGroup>

//                             <Col md="1"> </Col>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">
//                                 Base Unit
//                               </Label>
//                               <AvField
//                                 name="BaseUnit"
//                                 value={EditData.BaseUnitID_id}
//                                 id="txtBaseUnit"
//                                 type="text"
//                                 placeholder="Please Enter BaseUnit"
//                                 autoComplete="off"
//                                 validate={{
//                                   number: true,
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter BaseUnit",
//                                   },
//                                 }}
//                               />
//                             </FormGroup>
//                           </Row>

//                           <Row>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">Rate</Label>
//                               <AvField
//                                 name="Rate"
//                                 value={EditData.Rate}
//                                 id="txtRate"
//                                 type="text"
//                                 placeholder="Please Enter Rate"
//                                 autoComplete="off"
//                                 validate={{
//                                   number: true,
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter Rate",
//                                   },
//                                 }}
//                               />
//                             </FormGroup>

//                             <Col md="1"> </Col>
//                             <FormGroup className="mb-2 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">MRP</Label>
//                               <AvField
//                                 name="MRP"
//                                 id="txtMRP"
//                                 value={EditData.MRP}
//                                 type="text"
//                                 placeholder="Please Enter MRP"
//                                 autoComplete="off"
//                                 validate={{
//                                   number: true,
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter MRP",
//                                   },
//                                 }}
//                               />
//                             </FormGroup>
//                           </Row>

//                           <Row>
//                             <FormGroup className="mb-3 col col-sm-4 ">
//                               <Label htmlFor="validationCustom01">Sequence</Label>
//                               <AvField
//                                 name="Sequence"
//                                 value={EditData.Sequence}
//                                 id="txtSequence"
//                                 type="text"
//                                 placeholder="Please Enter Sequence"
//                                 autoComplete="off"
//                                 validate={{
//                                   number: true,
//                                   required: {
//                                     value: true,
//                                     errorMessage: "Please Enter Sequence",
//                                   },
//                                 }}
//                               />
//                             </FormGroup>

//                             <Col md="1"> </Col>
//                             <FormGroup className="mb-2 col col-sm-6">
//                               <Row className="justify-content-md-left">
//                                 <Label
//                                   htmlFor="horizontal-firstname-input"
//                                   className="col-sm-2 col-form-label mt-4"
//                                 >
//                                   Active
//                                 </Label>
//                                 <Col md={2} style={{ marginTop: "30px" }}>
//                                   {/* <AvInput
//                                       checked={(EditData.ID === 0) ? false : EditData.IsActive}
//                                       name="IsActive"
//                                       type="checkbox"
//                                       id="switch1"
//                                       switch="none"
//                                       defaultChecked />
//                                     <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label> */}
//                                   <div
//                                     className="form-check form-switch form-switch-md mb-3"
//                                     dir="ltr"
//                                   >
//                                     <AvInput
//                                       type="checkbox"
//                                       className="form-check-input"
//                                       id="customSwitchsizemd"
//                                       defaultChecked={EditData.isActive}
//                                       name="isActive"
//                                     />
//                                     <label
//                                       className="form-check-label"
//                                       htmlFor="customSwitchsizemd"
//                                     ></label>
//                                   </div>
//                                 </Col>
//                               </Row>
//                             </FormGroup>
//                           </Row>
//                           <FormGroup >
//                             <Row >
//                               <Col sm={2}>
//                                 <div>
//                                   {
//                                     pageMode === "edit" ?
//                                       userPageAccessState.RoleAccess_IsEdit ?
//                                         <button
//                                           type="submit"
//                                           data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
//                                           className="btn btn-success w-md"
//                                         >
//                                           <i class="fas fa-edit me-2"></i>Update
//                                         </button>
//                                         :
//                                         <></>
//                                       : (
//                                         userPageAccessState.RoleAccess_IsSave ?
//                                           <button
//                                             type="submit"
//                                             data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
//                                             className="btn btn-primary w-md"
//                                           > <i className="fas fa-save me-2"></i> Save
//                                           </button>
//                                           :
//                                           <></>
//                                       )
//                                   }
//                                 </div>
//                               </Col>
//                             </Row>
//                           </FormGroup >
//                         </CardBody>
//                       </Card>
//                     </Col>
//                   </Row>
//                 </AvForm>
//               </CardBody>
//             </Card>
//           </Container>
//         </div>
//       </React.Fragment>
//     );
//   }
//   else {
//     return (
//       <React.Fragment></React.Fragment>
//     )
//   }
// };
// export default ItemsMaster;

import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Form,
    FormGroup,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap"

import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import BreadcrumbDemo from "../../../components/Common/CmponentRelatedCommonFile/BreadcrumbDemo"
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation"
import Select from "react-select";
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions"
import { getBaseUnit_ForDropDown, get_CategoryTypes_ForDropDown, get_Category_ForDropDown, get_SubCategory_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import { getDivisionTypelist } from "../../../store/Administrator/DivisionTypeRedux/action";
import Dropzone from "react-dropzone";

const ItemsMaster = () => {
    const [selectedFiles, setselectedFiles] = useState([])
    const dispatch = useDispatch();
    const [activeTab1, setactiveTab1] = useState("5")
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select, setBaseUnit_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select2, setBaseUnit_dropdown_Select2] = useState("");
    const [categoryType_dropdown_Select, setCategoryType_dropdown_Select] = useState("");
    const [category_dropdown_Select, setCategory_dropdown_Select] = useState("");
    const [subCategory_dropdown_Select, setsubCategory_dropdown_Select] = useState("");
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [name, setName] = useState("");
    const [DefaultBaseUnit, setDefaultBaseUnit] = useState("");


    const { companyList, BaseUnit, CategoryType, Category, SubCategory, DivisionType } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryType: state.ItemMastersReducer.CategoryType,
        Category: state.ItemMastersReducer.Category,
        SubCategory: state.ItemMastersReducer.SubCategory,
        DivisionType: state.DivisionTypeReducer.ListData,
    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(get_Category_ForDropDown());
        dispatch(get_SubCategory_ForDropDown());
        dispatch(getDivisionTypelist());
    }, [dispatch]);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

    const Company_DropdownOptions = companyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function CompanyList_DropDown_handller(e) {
        setCompanyList_dropdown_Select(e)
    }

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function BaseUnit_DropDown_handller(e) {
        setBaseUnit_dropdown_Select(e)
    }

    const BaseUnit_DropdownOptions2 = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function BaseUnit2_DropDown_handller(e) {
        setBaseUnit_dropdown_Select2(e)
    }

    const CategoryType_DropdownOptions = CategoryType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function CategoryType_DropDown_handller(e) {
        setCategoryType_dropdown_Select(e)
    }
    const Category_DropdownOptions = Category.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function Category_DropDown_handller(e) {
        setCategory_dropdown_Select(e)
    }
    const SubCategory_DropdownOptions = SubCategory.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function SubCategory_DropDown_handller(e) {
        setsubCategory_dropdown_Select(e)
    }
    const DivisionType_DropdownOptions = DivisionType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DivisionType_DropDown_handller(e) {
        setDivisionType_dropdown_Select(e)
    }

    // for image upload
    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
    }


    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Tabs & Accordions | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    <AvForm >
                        {/* Render Breadcrumbs */}
                        <BreadcrumbDemo title="Components" breadcrumbItem="Tabs & Accordions" />
                        <Row>


                            <Col lg={12}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="h4">Justify Tabs</CardTitle>

                                    </CardHeader>
                                    <CardBody>
                                        <Nav tabs className="nav-tabs-custom nav-justified">
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("1")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab1</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "2",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("2")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab2</span>

                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "3",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("3")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab3</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "4",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("4")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab4</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "5",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("5")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab5</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "6",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("6")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab6</span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                            <TabPane tabId="1">
                                                <Col md={12}  >
                                                    <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                            <Row>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">Name</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter Name "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Name' },
                                                                        }}
                                                                        onChange={(e) => { (setName(e.target.value)) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">ShortName</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter ShortName "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Name' },
                                                                        }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Company</Label>
                                                                    <Select
                                                                        value={companyList_dropdown_Select}
                                                                        options={Company_DropdownOptions}
                                                                        onChange={(e) => { CompanyList_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                    <Select
                                                                        value={BaseUnit_dropdown_Select}
                                                                        options={BaseUnit_DropdownOptions}
                                                                        onChange={(e) => { BaseUnit_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">BarCode</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter BarCode "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter BarCode' },
                                                                        }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">Sequence</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter Sequence "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Sequence' },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-2 col col-sm-5">
                                                                    <Row className="justify-content-md-left">
                                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                                                                        <Col md={2} style={{ marginTop: '9px' }} >

                                                                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                    checked={""}
                                                                                    defaultChecked={true}
                                                                                    name="isActive"
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Col md={12}  >
                                                    <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                            <Row>
                                                                <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                            </Row>

                                                            <Row>
                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Category Type</Label>
                                                                    <Select
                                                                        value={categoryType_dropdown_Select}
                                                                        options={CategoryType_DropdownOptions}
                                                                        onChange={(e) => { CategoryType_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>
                                                            </Row>
                                                            <Row>
                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Category</Label>
                                                                    <Select
                                                                        value={category_dropdown_Select}
                                                                        options={Category_DropdownOptions}
                                                                        onChange={(e) => { Category_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>
                                                            </Row>
                                                            <Row>
                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Sub Category</Label>
                                                                    <Select
                                                                        value={subCategory_dropdown_Select}
                                                                        options={SubCategory_DropdownOptions}
                                                                        onChange={(e) => { SubCategory_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            </TabPane>
                                            <TabPane tabId="3">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                        <Select
                                                                            value={BaseUnit_dropdown_Select}
                                                                            options={BaseUnit_DropdownOptions}
                                                                            onChange={BaseUnit_DropDown_handller}
                                                                        />
                                                                    </FormGroup>
                                                                    <Row>
                                                                        <h5> <Label className="text-primary mt-4" >{BaseUnit_dropdown_Select.label}&nbsp;</Label><input></input> </h5>
                                                                        <FormGroup className=" col col-sm-2 " >

                                                                            <Select
                                                                                placeholder="select unit"
                                                                                value={BaseUnit_dropdown_Select2}
                                                                                options={BaseUnit_DropdownOptions2}
                                                                                onChange={BaseUnit2_DropDown_handller}
                                                                            />
                                                                        </FormGroup>
                                                                        {/* <FormGroup className="mb-3 col col-sm-4 " >

                                                                            <AvField name="Name" value={""} type="text" id='txtName'
                                                                                placeholder="  "
                                                                                autoComplete="off"
                                                                            />

                                                                        </FormGroup> */}
                                                                    </Row>
                                                                </Row>

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="4">
                                                <Row>
                                                    <Col className="col-12">
                                                        <Card>
                                                            <CardBody>
                                                                {/* <CardTitle>Image Upload</CardTitle> */}
                                                                {/* <CardSubtitle className="mb-3">
                                                                    {" "}
                                                                    DropzoneJS is an open source library that provides
                                                                    drag’n’drop file uploads with image previews.
                                                                </CardSubtitle> */}
                                                                <Form>
                                                                    <Dropzone
                                                                        onDrop={acceptedFiles => {
                                                                            handleAcceptedFiles(acceptedFiles)
                                                                        }}
                                                                    >
                                                                        {({ getRootProps, getInputProps }) => (
                                                                            // <div className="dropzone">
                                                                            <div
                                                                                className="dz-message needsclick mt-2"
                                                                                {...getRootProps()}
                                                                            >
                                                                                <input {...getInputProps()} />

                                                                                <div className="mb-3">
                                                                                    Image Upload
                                                                                    {/* <i className="display-4 text-muted bx bxs-cloud-upload" /> */}
                                                                                </div>
                                                                                {/* <h4>Drop files here or click to upload.</h4> */}
                                                                            </div>
                                                                            // </div>
                                                                        )}
                                                                    </Dropzone>
                                                                    <div className="dropzone-previews mt-3" id="file-previews">
                                                                        {selectedFiles.map((f, i) => {
                                                                            return (
                                                                                <Card
                                                                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                                    key={i + "-file"}
                                                                                >
                                                                                    <div className="p-2">
                                                                                        <Row className="align-items-center">
                                                                                            <Col className="col-auto">
                                                                                                <img
                                                                                                    data-dz-thumbnail=""
                                                                                                    height="80"
                                                                                                    className="avatar-sm rounded bg-light"
                                                                                                    alt={f.name}
                                                                                                    src={f.preview}
                                                                                                />
                                                                                            </Col>
                                                                                            <Col>
                                                                                                <Link
                                                                                                    to="#"
                                                                                                    className="text-muted font-weight-bold"
                                                                                                >
                                                                                                    {f.name}
                                                                                                </Link>
                                                                                                <p className="mb-0">
                                                                                                    <strong>{f.formattedSize}</strong>
                                                                                                </p>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </Card>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </Form>

                                                                <div className="text-center mt-4">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary "
                                                                    >
                                                                        Upload
                                                                    </button>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="5">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Division Type</Label>
                                                                        <Select
                                                                            value={divisionType_dropdown_Select}
                                                                            options={DivisionType_DropdownOptions}
                                                                            onChange={(e) => { DivisionType_DropDown_handller(e) }}
                                                                        />
                                                                    </FormGroup>
                                                                </Row>

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                            </TabPane>
                                            <TabPane tabId="6">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>
                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">MRP</Label>
                                                                        <AvField name="MRP" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter MRP "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter MRP ' },
                                                                            }}
                                                                            onChange={(e) => { (setName(e.target.value)) }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">GST</Label>
                                                                        <AvField name="GST" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter GST "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter GST' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">HSN</Label>
                                                                        <AvField name="HSN" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter HSN "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter HSN' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Margin</Label>
                                                                        <AvField name="Margin" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter Margin "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter Margin' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>

                                                                </Row>
                                                            </CardBody>
                                                        </Card>

                                                    </Col>

                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>

                    </AvForm>
                </Container>
            </div>
        </React.Fragment >
    );
}

export default ItemsMaster;
