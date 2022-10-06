import React, { useEffect, useRef, useState } from "react";
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
import MetaTags from "react-meta-tags"
//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Select from "react-select";

import classnames from "classnames";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import ReactSelect from "react-select";
import { Tbody, Thead } from "react-super-responsive-table";
import { AlertState, BreadcrumbShow, editHPagesIDSuccess, fetchModelsList, getControlTypes, getFieldValidations, getPageAccess_DropDown_API, getPageList, getPageListSuccess, PostModelsSubmitSuccess, saveHPages, saveHPagesSuccess, updateHPages } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const PageMaster = (props) => {
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let pageModeProps = props.pageMode
  console.log("editDataGatingFromList", editDataGatingFromList)
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [relatedPageListShowUI, setRelatedPageListShowUI] = useState(false);
  const [tablePageAccessDataState, setTablePageAccessDataState] = useState([]);
  const [module_DropdownSelect, setModule_DropdownSelect] = useState("");
  const [pageType_DropdownSelect, setPageType_DropdownSelect] = useState("");
  const [relatedPage_DropdownSelect, setrelatedPage_DropdownSelect] = useState("");
  const [pageAccessDropDownView, setPageAccessDropDownView] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [pageAccess_DropDownSelect, setPageAccess_DropDownSelect] =
    useState("");


  const [pageFieldTabTable, setPageFieldTabTable] = useState([{
    ControlID: '',
    FieldLabel: '',
    ControlType: { label: "select", value: 0 },
    FieldValidation: { label: "select", value: 0 },
    InValidMsg:'',
    ListPageSeq: '',
    IsCompulsory: false,
    DefaultSort: false,
    FieldSequence: false,
    ShowInListPage: false,
    ShowInDownload: false,
    DownloadDefaultSelect: false,

  }]);

  const {
    ControlTypes,
    FieldValidations,
    PostAPIResponse,
    RoleAccessModifiedinSingleArray,
    ModuleData,
    PageAccess,
    modulePostAPIResponse,
    PageList } = useSelector((state) => ({
      ControlTypes: state.H_Pages.ControlTypes,
      FieldValidations: state.H_Pages.FieldValidations,
      PostAPIResponse: state.H_Pages.saveMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      ModuleData: state.Modules.modulesList,
      PageAccess: state.H_Pages.PageAccess,
      modulePostAPIResponse: state.Modules.modulesSubmitSuccesss,
      PageList: state.H_Pages.PageList,
    }));

  useEffect(() => {

    let userAcc = undefined
    if ((editDataGatingFromList === undefined)) {

      let locationPath = history.location.pathname
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === locationPath)
      })
    }
    else if (!(editDataGatingFromList === undefined)) {
      let relatatedPage = props.relatatedPage
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === relatatedPage)
      })

    }
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }


  }, [RoleAccessModifiedinSingleArray])

  useEffect(() => {
    dispatch(fetchModelsList());
    dispatch(getControlTypes());
    dispatch(getFieldValidations());
    dispatch(getPageAccess_DropDown_API());
  }, [dispatch]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }

    if (!(editDataGatingFromList === undefined)) {
      debugger

      setPageMode(pageModeProps);

      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      setEditData(editDataGatingFromList);
      setTablePageAccessDataState(editDataGatingFromList.PagePageAccess);

      setModule_DropdownSelect({
        label: editDataGatingFromList.ModuleName,
        value: editDataGatingFromList.Module,
      });
      let PageFieldMaster = editDataGatingFromList.PageFieldMaster.map((index) => {
        debugger
        return {
          ControlType: {
            label: index.ControlTypeName,
            value: index.ControlType
          },
          FieldValidation: {
            label: index.FieldValidationName,
            value: index.FieldValidation
          },
          ControlID: index.ControlID,
          FieldLabel: index.FieldLabel,
          InValidMsg:index.InValidMsg,
          IsCompulsory: index.IsCompulsory,
          DefaultSort: index.DefaultSort,
          ListPageSeq: index.ListPageSeq,
          ShowInListPage: index.ShowInListPage,
          ShowInDownload: index.ShowInDownload,
        }
      })
      if (!(PageFieldMaster.length === 0)) {
        setPageFieldTabTable(PageFieldMaster)
      }
      

      if (editDataGatingFromList.PageType === 2) {
        setRelatedPageListShowUI(true)
      }
      setrelatedPage_DropdownSelect({
        value: editDataGatingFromList.RelatedPageId,
        label: editDataGatingFromList.RelatedPageName,
      });

      // When value 2 is get then DropDown lable is "ListPage" and ShowMenu is disabled Otherwise DropDown lable is "AddPage" and ShowMenu is enabled
      let pageType_ID = editDataGatingFromList.PageType;

      if (pageType_ID === 2) {
        setPageAccessDropDownView(true);
        dispatch(getPageList(pageType_ID));
        setPageType_DropdownSelect({ value: 2, label: "ListPage" });

      } else if (pageType_ID === 1) {
        dispatch(getPageListSuccess([]));
        setrelatedPage_DropdownSelect({ value: 0 });
        setPageType_DropdownSelect({ value: 1, label: "AddPage" });
      }
     
      // setPageFieldTabTable(PageFieldMaster)
      dispatch(editHPagesIDSuccess({ Status: false }));
    }
  }, [editDataGatingFromList]);


  // This UseEffect clear Form Data and when modules Save Successfully.
  useEffect(() => {
    if (PostAPIResponse.Status === true && PostAPIResponse.StatusCode === 200) {
      dispatch(saveHPagesSuccess({ Status: false }));
      setModule_DropdownSelect("");
      setPageAccess_DropDownSelect("");
      setPageType_DropdownSelect("");
      setrelatedPage_DropdownSelect("");
      if (pageMode === "true") {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
          })
        );
      } else {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
            RedirectPath: `/PageList`,
            AfterResponseAction: false,
          })
        );
      }
    } else if (PostAPIResponse.Status === true) {
      dispatch(saveHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: JSON.stringify(PostAPIResponse.Message),
          RedirectPath: false,
          AfterResponseAction: false,
        })
      );
    }
  }, [PostAPIResponse]);

  useEffect(() => {
    if ((modulePostAPIResponse.Status === true) && (modulePostAPIResponse.StatusCode === 200)) {
      dispatch(PostModelsSubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: modulePostAPIResponse.Message,
      }))
      tog_center()
    } else if (modulePostAPIResponse.Status === true) {
      dispatch(PostModelsSubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(modulePostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }

  }, [modulePostAPIResponse])

  const PageAccessValues = PageAccess.map((Data) => ({
    value: Data.id,
    label: Data.Name,
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
    },
  ];

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
      ControlID: '',
      FieldLabel: '',
      ControlType: { label: "select", value: 0 },
      FieldValidation: { label: "select", value: 0 },
      InValidMsg:'',
      IsCompulsory: '',
      DefaultSort: '',
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


    var found = pageFieldTabTable.find((i, k) => {
      return (k === key)
    })
    let newSelectValue = ''

    if (type === "ControlID") {

      newSelectValue = {
        ControlID: event,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }

    else if (type === "FieldLabel") {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: event,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'ControlType') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: event,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }

    else if (type === 'FieldValidation') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: event,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'InValidMsg') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:event,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'IsCompulsory') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: event,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }

    else if (type === 'DefaultSort') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: event,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }

    else if (type === 'ShowInListPage') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: event,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'ListPageSeq') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: event,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'ShowInDownload') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: event,
        DownloadDefaultSelect: found.DownloadDefaultSelect,

      }
    }
    else if (type === 'DownloadDefaultSelect') {

      newSelectValue = {
        ControlID: found.ControlID,
        FieldLabel: found.FieldLabel,
        ControlType: found.ControlType,
        FieldValidation: found.FieldValidation,
        InValidMsg:found.InValidMsg,
        IsCompulsory: found.IsCompulsory,
        DefaultSort: found.DefaultSort,
        ShowInListPage: found.ShowInListPage,
        ListPageSeq: found.ListPageSeq,
        ShowInDownload: found.ShowInDownload,
        DownloadDefaultSelect: event,

      }
    }

    let newTabArr = pageFieldTabTable.map((index, k) => {
      return (k === key) ? newSelectValue : index
    })
    setPageFieldTabTable(newTabArr)
  }

  function FieldValidation_Dropdown_Handler(e) {
    dispatch(getFieldValidations(e.value))
    setPageFieldTabTable(e)
  }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const FormSubmitButton_Handler = (event, values) => {

    const PageFieldMaster = pageFieldTabTable.map((index) => ({
      ControlID: index.ControlID,
      FieldLabel: index.FieldLabel,
      InValidMsg:index.InValidMsg,
      IsCompulsory: index.IsCompulsory,
      DefaultSort: index.DefaultSort,
      ListPageSeq: index.ListPageSeq,
      ShowInListPage: index.ShowInListPage,
      ShowInDownload: index.ShowInDownload,
      ControlType: index.ControlType.value,
      FieldValidation: index.FieldValidation.value,
      DownloadDefaultSelect: index.DownloadDefaultSelect,
    }))

    if (
      tablePageAccessDataState.length <= 0 &&
      !(pageType_DropdownSelect.value === 1)
    ) {
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: "At Least One PageAccess is Select",
          RedirectPath: false,
          PermissionAction: false,
        })
      );
      return;
    }

    const jsonBody = JSON.stringify({
      Name: values.Name,
      Module: module_DropdownSelect.value,
      isActive: values.isActive,
      DisplayIndex: values.displayIndex,
      Icon: values.Icon,
      ActualPagePath: values.pagePath,
      PageType: pageType_DropdownSelect.value,
      PageHeading: values.pageheading,
      PageDescription: values.pagedescription,
      PageDescriptionDetails: values.pageheadingdescription,
      RelatedPageID: relatedPage_DropdownSelect.value,
      IsDivisionRequired: values.IsDivisionRequired,
      CreatedBy: 1,
      UpdatedBy: 1,
      PagePageAccess: tablePageAccessDataState.map((d) => ({
        Access: d.AccessID,
      })),
      PageFieldMaster: PageFieldMaster,
    })


    if (pageMode === "edit") {
      dispatch(updateHPages(jsonBody, EditData.id));
      console.log("updated jsonBody", jsonBody)
    } else {
      dispatch(saveHPages(jsonBody));
      console.log("post jsonBody", jsonBody)
    }
  };


  // for module dropdown
  const Module_DropdownSelectHandller = (e) => {
    setModule_DropdownSelect(e);
  };

  function PageAccess_DropdownSelect_Handler(e) {
    setPageAccess_DropDownSelect(e);
  }

  //  for PageType deropDown
  const PageType_DropdownSelectHandller = (e) => {
    if (e.value === 2) {
      relatedPage_DropdownSelectHandller()
      setRelatedPageListShowUI(true)
      // let showCheckBox = document.getElementById("inp-showOnMenu")
      // const findShowOnMenu = PageAccessValues.find((element) => {
      //   return element.label === "IsShowOnMenu";
      // });
      // if (!(findShowOnMenu === undefined)) {
      //   setTablePageAccessDataState([
      //     {
      //       AccessID: findShowOnMenu.value,
      //       AccessName: findShowOnMenu.label,
      //     },
      //   ]);
      // }

      // setisShowPageChecked(true)
      dispatch(getPageList(e.value));
      // showCheckBox.disabled = true
      setPageAccessDropDownView(true);
    } else if (e.value === 1) {
      setRelatedPageListShowUI(false)
      setTablePageAccessDataState([]);
      // showCheckBox.disabled = false
      setPageAccessDropDownView(false);
      dispatch(getPageListSuccess([]));
      setrelatedPage_DropdownSelect({ value: 0 });
    }
    setPageType_DropdownSelect(e);
  };

  const relatedPage_DropdownSelectHandller = (e) => {
    setrelatedPage_DropdownSelect(e);
  };

  // ADD Button handler

  function Common_Find_Function(arry, elementValue, findvalue) {
    return arry.find((index) => {
      return index[elementValue] === findvalue;
    });
  }

  function AddRoleHandler() {
    const drop_value = pageAccess_DropDownSelect.value;
    const drop_label = pageAccess_DropDownSelect.label;

    // find function pass Parameter (array,indexParameter,findvalue)
    const find = Common_Find_Function(
      tablePageAccessDataState,
      "AccessID",
      drop_value
    );

    if (pageAccess_DropDownSelect.length <= 0) {
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: "Select One DropDown Value",
        })
      );
    } else if (find === undefined) {
      if (drop_label === "IsEdit") {
        // find function pass Parameter (array,indexParameter,findvalue)
        const findIsView = Common_Find_Function(
          tablePageAccessDataState,
          "AccessName",
          "IsView"
        );
        // find function pass Parameter (array,indexParameter,findvalue)
        const find_IsEditSelf = Common_Find_Function(
          tablePageAccessDataState,
          "AccessName",
          "IsEditSelf"
        );

        const ViewValues = Common_Find_Function(
          PageAccessValues,
          "label",
          "IsView"
        );

        const IsEditSelfValues = Common_Find_Function(
          PageAccessValues,
          "label",
          "IsEditSelf"
        );
        if ((findIsView === undefined) && (find_IsEditSelf === undefined)) {
          // find function pass Parameter (array,indexParameter,findvalue)

          setTablePageAccessDataState([
            ...tablePageAccessDataState,
            {
              AccessID: ViewValues.value,
              AccessName: ViewValues.label,
            },
            {
              AccessID: IsEditSelfValues.value,
              AccessName: IsEditSelfValues.label,
            },
            {
              AccessID: drop_value,
              AccessName: drop_label,
            },
          ]);
          return;
        }
        else if (findIsView === undefined) {
          setTablePageAccessDataState([
            ...tablePageAccessDataState,
            {
              AccessID: ViewValues.value,
              AccessName: ViewValues.label,
            },
            {
              AccessID: drop_value,
              AccessName: drop_label,
            },
          ]);
          return;
        }
        else if (find_IsEditSelf === undefined) {
          setTablePageAccessDataState([
            ...tablePageAccessDataState,
            {
              AccessID: IsEditSelfValues.value,
              AccessName: IsEditSelfValues.label,
            },
            {
              AccessID: drop_value,
              AccessName: drop_label,
            },
          ]);
          return;
        }
      }

      setTablePageAccessDataState([
        ...tablePageAccessDataState,
        { AccessID: drop_value, AccessName: drop_label },
      ]);
    } else {
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: "PageAccess Data already Exists ",
        })
      );
    }
  }

  // For Delete Button in table
  function PageAccess_DeleteButton_Handller(tableValue) {
    setTablePageAccessDataState(
      tablePageAccessDataState.filter((item) => !(item.AccessID === tableValue))
    );
  }

  function tog_center() {
    setmodal_center(!modal_center)
  }
  function DropDownAddHandler() {
    tog_center()
  }

  function TableBodyFunction() {
    return tablePageAccessDataState.map((TableValue) => {
      let ViewValues = false;

      if ((TableValue.AccessName === "IsView") || (TableValue.AccessName === "IsEditSelf")) {
        // find function pass Parameter (array,indexParameter,findvalue)
        // const ViewValues = Common_Find_Function(PageAccessValues, "label", "IsView");
        const View = tablePageAccessDataState.find((element) => {
          return element.AccessName === "IsEdit";
        });
        if (!(View === undefined)) ViewValues = true;
      }
      return (
        <tr>
          <td>{TableValue.AccessName}</td>
          <td>
            {!(TableValue.AccessName === "IsShowOnMenu") && !ViewValues ? (
              <i
                className="mdi mdi-trash-can d-block text-danger font-size-20"
                onClick={() => {
                  PageAccess_DeleteButton_Handller(TableValue.AccessID);
                }}
              ></i>
            ) : null}
          </td>
        </tr>
      );
    });
  }
  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = "";
  if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <MetaTags>
            <title>Page Master| FoodERP-React FrontEnd</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v); }}>
              <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
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
                      {/* <NavItem>
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
                      </NavItem> */}
                      <NavItem>
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
                          {/* <Button type="submit"> save</Button> */}
                          <Row >
                            <Col sm={2}>
                              <div>
                                {
                                  pageMode === "edit" ?
                                    userPageAccessState.RoleAccess_IsEdit ?
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                        className="btn btn-success w-md float-right"
                                      >
                                        <i class="fas fa-edit me-2"></i>Update
                                      </button>
                                      :
                                      <></>
                                    : (
                                      userPageAccessState.RoleAccess_IsSave ?
                                        <button
                                          type="submit"
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                          className="btn btn-primary w-md float-right"
                                        > <i className="fas fa-save me-2"></i> Save
                                        </button>
                                        :
                                        <></>
                                    )
                                }
                              </div>
                            </Col>
                          </Row>
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent
                      activeTab={customActiveTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <Row>
                          <Card className="text-black"  >
                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                              <Row>
                                <Col md="3">
                                  <FormGroup className="mb-3 ">
                                    <Label>Name </Label>
                                    <AvField
                                      name="Name"
                                      id="txtName"
                                      value={EditData.Name}
                                      type="text"
                                      placeholder="Please Enter Name"
                                      autoComplete="off"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: "Please Enter Name",
                                        },
                                      }}
                                      onChange={(e) => {
                                        dispatch(BreadcrumbShow(e.target.value));
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
                                      value={EditData.PageDescription}
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
                                      value={EditData.PageHeading}
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
                                      value={EditData.PageDescriptionDetails}
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
                                    <Select
                                      value={module_DropdownSelect}
                                      options={Module_DropdownOption}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        Module_DropdownSelectHandller(e);
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col md="1" className=" mt-3">
                                  <Button className=" mt-3 btn btn-sm" type="button" onClick={() => { DropDownAddHandler() }}>add</Button>
                                </Col>

                                <Col md="3">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">Page Type</Label>
                                    <Select
                                      value={pageType_DropdownSelect}
                                      options={PageType_DropdownOption}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        PageType_DropdownSelectHandller(e);
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col md="1"> </Col>
                                {relatedPageListShowUI ?
                                  <Col md="3">
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="validationCustom01">
                                        Related Page List
                                      </Label>
                                      <Select
                                        value={relatedPage_DropdownSelect}
                                        options={PageList_DropdownOption}
                                        autoComplete="off"
                                        onChange={(e) => {
                                          relatedPage_DropdownSelectHandller(e);
                                        }}
                                      />
                                    </FormGroup>
                                  </Col> : null}


                              </Row>

                              <Row>
                                <Col md="3">
                                  <FormGroup>
                                    <Label htmlFor="validationCustom01">
                                      Display Index
                                    </Label>
                                    <AvField
                                      name="displayIndex"
                                      value={EditData.DisplayIndex}
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
                                      value={EditData.ActualPagePath}
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

                                <Col md="1"> </Col>
                                <Col md="3">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">Icon</Label>
                                    <AvField
                                      name="Icon"
                                      value={EditData.Icon}
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
                              </Row>

                              <Row>

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

                                <Col md="1"> </Col>
                                <FormGroup className="mb-1 col col-sm-6">
                                  <Row className="justify-content-md-left">

                                    <Label
                                      htmlFor="horizontal-firstname-input"
                                      className="col-sm-4 col-form-label mt-4"
                                    >
                                      Is DivisionRequired{" "}
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
                                          defaultChecked={EditData.IsDivisionRequired}
                                          name="IsDivisionRequired"
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

                          {pageAccessDropDownView ? (
                            <Card className=" mt-n2 text-black">
                              <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                <Row className="">
                                  <FormGroup className=" ml-3 col col-sm-4 mb-4 ">
                                    <Label htmlFor="validationCustom01">
                                      Page Access
                                    </Label>
                                    <Select
                                      options={PageAccessValues}
                                      onChange={(e) => {
                                        PageAccess_DropdownSelect_Handler(e);
                                      }}
                                      // defaultValue={{ label: "IsShowOnMenu", value: 1 }}
                                      classNamePrefix="select2-selection"
                                    />
                                  </FormGroup>

                                  <Col sm={1} style={{ marginTop: "28px" }}>
                                    <Button
                                      type="button"
                                      className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                      onClick={() => AddRoleHandler()}
                                    >
                                      <i className="dripicons-plus "></i>
                                    </Button>
                                  </Col>

                                  <Col sm={3} style={{ marginTop: "28px" }}>
                                    {tablePageAccessDataState.length > 0 ? (
                                      <div className="table-responsive">
                                        <Table className="table table-bordered  text-center">
                                          <Thead>
                                            <tr>
                                              <th>Page Access</th>

                                              <th>Action</th>
                                            </tr>
                                          </Thead>

                                          <Tbody>{TableBodyFunction()}</Tbody>
                                        </Table>
                                      </div>
                                    ) : (
                                      <> </>
                                    )}
                                  </Col>
                                </Row>

                              </CardBody>
                            </Card>
                          ) : <></>}

                        </Row>
                      </TabPane>

                      <TabPane tabId="2">

                        {/* <Card> */}
                        {/* <CardBody style={{ backgroundColor: "whitesmoke" }}> */}

                        {/* {!(PageFieldShowUI) ? */}
                        < Row className="mt-3">
                          <Col md={12}>
                            <Table className="table table-bordered">
                              <Thead >
                                <tr>
                                  <th>Control ID</th>
                                  <th>Field Label</th>
                                  <th className="col col-sm-2">Control Type</th>
                                  <th className="col col-sm-2" >Field Validation</th>
                                  <th className="col col-sm-2" >InValid Msg</th>
                                  <th>List Page Seq</th>
                                  <th>Is Compulsory</th>
                                  <th>Default Sort</th>
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
                                          id={`ControlID${key}`}
                                          defaultValue={EditData.ControlID}
                                          value={pageFieldTabTable[key].ControlID}
                                          onChange={(e) => PageField_onChange_Handler(e.target.value, "ControlID", key)}>
                                        </Input>
                                      </Col>
                                    </td>
                                    <td>
                                      <Col >
                                        <Input
                                          type="text"
                                          id={`FieldLabel${key}`}
                                          defaultValue={EditData.FieldLabel}
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
                                        onChange={(e) => { FieldValidation_Dropdown_Handler(e); PageField_onChange_Handler(e, "ControlType", key) }}
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id={`FieldValidation-${key}`}
                                        // placeholder="select unit"
                                        value={pageFieldTabTable[key].FieldValidation}
                                        options={FieldValidations_DropdownOptions}
                                        onChange={(e) => { PageField_onChange_Handler(e, "FieldValidation", key); }}
                                      />
                                    </td>
                                    <td>
                                      <Input

                                        type="text"
                                        id={`InValidMsg${key}`}
                                        defaultValue={EditData.InValidMsg}
                                        value={pageFieldTabTable[key].InValidMsg}
                                        onChange={(e) => PageField_onChange_Handler(e.target.value, "InValidMsg", key)}>

                                      </Input>
                                    </td>
                                    <td>
                                      <Input

                                        type="text"
                                        id={`ListPageSeq${key}`}
                                        defaultValue={EditData.ListPageSeq}
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
                                        id={`DefaultSort${key}`}
                                        checked={pageFieldTabTable[key].DefaultSort}
                                        onChange={(e) => PageField_onChange_Handler(e.target.checked, "DefaultSort", key)}>

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
                                        defaultChecked={pageFieldTabTable[key].DownloadDefaultSelect}
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
                        {/* : <></>} */}

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
      </React.Fragment >
    )
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}
export default PageMaster;