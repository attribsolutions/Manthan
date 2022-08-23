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
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Col,
    Container,
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

const ItemsMaster = () => {
    const dispatch = useDispatch();
    const [activeTab1, setactiveTab1] = useState("5")
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select, setBaseUnit_dropdown_Select] = useState("");
    const [categoryType_dropdown_Select, setCategoryType_dropdown_Select] = useState("");
    const [category_dropdown_Select, setCategory_dropdown_Select] = useState("");
    const [subCategory_dropdown_Select, setsubCategory_dropdown_Select] = useState("");
    const [name, setName] = useState("");


    const { companyList, BaseUnit, CategoryType, Category, SubCategory } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryType: state.ItemMastersReducer.CategoryType,
        Category: state.ItemMastersReducer.Category,
        SubCategory: state.ItemMastersReducer.SubCategory,
    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(get_Category_ForDropDown());
        dispatch(get_SubCategory_ForDropDown());
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
                                                        active: activeTab1 === "5",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("5")
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
                                                        active: activeTab1 === "6",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("6")
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
                                                        active: activeTab1 === "7",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("7")
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
                                                        active: activeTab1 === "8",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("8")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab4</span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                            <TabPane tabId="5">
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
                                            <TabPane tabId="6">
                                                <Col md={12}  >
                                                    <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                            <Row>
                                                                
                                                                    {/* <Label className="text-primary fontsize-30" >{name}</Label> */}
                                                                    <h4><span className="text-primary">{name}</span></h4>
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
                                            <TabPane tabId="7">
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

                                            <TabPane tabId="8">
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

                        </Row>

                    </AvForm>
                </Container>
            </div>
        </React.Fragment >
    );
}

export default ItemsMaster;
