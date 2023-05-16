import React, { useEffect, useMemo, useState } from "react";
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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import MetaTags from "react-meta-tags"
import Select from "react-select";
import classnames from "classnames";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import {
  AlertState,
  Breadcrumb_inputName,
  editHPagesIDSuccess,
  getModuleList,
  getPageAccess_DropDown_API,
  getPageList,
  getPageListSuccess,
  saveModuleMasterSuccess,
  saveHPages,
  saveHPagesSuccess,
  updateHPages,
  updateHPagesSuccess,
  getPageType
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PAGE_lIST } from "../../../routes/route_url";
import { breadcrumbReturnFunc, loginUserID, metaTagLabel } from "../../../components/Common/CommonFunction";
import PageFieldMaster_Tab from "./PageFieldMaster";
import * as mode from "../../../routes/PageMode"
import * as pageId from "../../../routes/allPageID"
import { SaveButton } from "../../../components/Common/CommonButton";
import AddMaster from "../EmployeePages/Drodown";
import Modules from "../ModulesPages/Modules";
import * as url from "../../../routes/route_url";

const PageMaster = (props) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const [EditData, setEditData] = useState([]);
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState('');

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [relatedPageListShowUI, setRelatedPageListShowUI] = useState(false);
  const [tablePageAccessDataState, setTablePageAccessDataState] = useState([]);
  const [module_DropdownSelect, setModule_DropdownSelect] = useState("");
  const [pageType_DropdownSelect, setPageType_DropdownSelect] = useState("");
  const [relatedPage_DropdownSelect, setrelatedPage_DropdownSelect] = useState("");
  const [pageAccessDropDownView, setPageAccessDropDownView] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [pageAccessData, setPageAccessData] = useState([]);
  const [editCreatedBy, seteditCreatedBy] = useState("");
  const [findAddMasterAccess, setFindAddMasterAccess] = useState(false)

  const [pageFieldTabTable, setPageFieldTabTable] = useState([{
    ControlID: '',
    FieldLabel: '',
    ControlType: { label: "select...", value: 0 },
    FieldValidation: { label: "select...", value: 0 },
    InValidMsg: '',
    ListPageSeq: '',
    IsCompulsory: false,
    DefaultSort: 0,
    FieldSequence: false,
    ShowInListPage: false,
    ShowInDownload: false,
    DownloadDefaultSelect: false,
  }]);

  const {
    postMsg,
    updateMsg,
    userAccess,
    ModuleData,
    PageAccess,
    modulePostAPIResponse,
    PageList,
    PageType
  } = useSelector((state) => ({
    postMsg: state.H_Pages.saveMessage,
    updateMsg: state.H_Pages.updateMessage,
    userAccess: state.Login.RoleAccessUpdateData,
    ModuleData: state.Modules.modulesList,
    PageAccess: state.H_Pages.PageAccess,
    modulePostAPIResponse: state.Modules.modulesSubmitSuccesss,
    PageList: state.H_Pages.PageList,
    PageType: state.H_Pages.PageType
  }));

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const hasShowModal = props.hasOwnProperty(mode.editValue)

  // userAccess useEffect
  useEffect(() => {

    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserAccState(userAcc)
      breadcrumbReturnFunc({ dispatch, userAcc });
    };
    userAccess.find((index) => {
      if (index.id === pageId.MODULE) {
        return setFindAddMasterAccess(true)
      }
    });
  }, [userAccess])

  useEffect(() => {
    dispatch(getModuleList());
    dispatch(getPageAccess_DropDown_API());
    dispatch(getPageType());
  }, [dispatch]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if ((hasShowloction || hasShowModal)) {

      let hasEditVal = null
      if (hasShowloction) {
        setPageMode(location.pageMode)
        hasEditVal = location.editValue
      }
      else if (hasShowModal) {
        hasEditVal = props.editValue
        setPageMode(props.pageMode)
      }

      if (hasEditVal) {

        let pageType_ID = hasEditVal.PageType;

        setEditData(hasEditVal);

        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        setPageAccessData(hasEditVal.PagePageAccess);
        seteditCreatedBy(hasEditVal.CreatedBy);


        setModule_DropdownSelect({
          label: hasEditVal.ModuleName,
          value: hasEditVal.Module,
        });
        if ((pageType_ID === 1)) {
          setPageAccessDropDownView(false);
          setPageType_DropdownSelect({
            label: hasEditVal.PageTypeName,
            value: hasEditVal.PageType,
          });
        }
        if ((pageType_ID === 2) || ((pageType_ID === 3))) {
          setPageAccessDropDownView(true);
          setPageType_DropdownSelect({
            label: hasEditVal.PageTypeName,
            value: hasEditVal.PageType,
          });
        }

        let PageFieldMaster = hasEditVal.PageFieldMaster.map((index) => {
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
            InValidMsg: index.InValidMsg,
            IsCompulsory: index.IsCompulsory,
            DefaultSort: index.DefaultSort,
            ListPageSeq: index.ListPageSeq,
            Alignment:index.Alignment,
            ShowInListPage: index.ShowInListPage,
            ShowInDownload: index.ShowInDownload,
            DownloadDefaultSelect: index.ShownloadDefaultSelect
          }
        })
        PageFieldMaster.sort((firstItem, secondItem) => firstItem.ListPageSeq - secondItem.ListPageSeq);

        if (!(PageFieldMaster.length === 0) && (pageType_ID === 1) || (pageType_ID === 3)) {
          setPageFieldTabTable(PageFieldMaster)
        }

        let PageFieldList = hasEditVal.PageFieldList.map((index) => {
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
            InValidMsg: index.InValidMsg,
            IsCompulsory: index.IsCompulsory,
            DefaultSort: index.DefaultSort,
            ListPageSeq: index.ListPageSeq,
            Alignment:index.Alignment,
            ShowInListPage: index.ShowInListPage,
            ShowInDownload: index.ShowInDownload,
            DownloadDefaultSelect: index.ShownloadDefaultSelect
          }
        })
        PageFieldList.sort((firstItem, secondItem) => firstItem.ListPageSeq - secondItem.ListPageSeq);


        if ((pageType_ID === 2)) {
          setPageFieldTabTable(PageFieldList)
        }

        if (hasEditVal.PageType === 2) {
          setRelatedPageListShowUI(true)
        }
        setrelatedPage_DropdownSelect({
          value: hasEditVal.RelatedPageId,
          label: hasEditVal.RelatedPageName,
        });
      }

      dispatch(editHPagesIDSuccess({ Status: false }));
    }
  }, []);

  const pageAccessval = useMemo(() => {
    const arr = []
    PageAccess.forEach(i => {
      i["hascheck"] = false;
      pageAccessData.forEach(ele => {
        if (ele.AccessName === i.Name) {
          i.hascheck = true
        }
      })
      arr.push(i)
    })
    return arr
  }, [pageAccessData, PageAccess]);

  // This UseEffect clear Form Data and when modules Save Successfully.
  useEffect(() => {
    if (postMsg.Status === true && postMsg.StatusCode === 200) {
      dispatch(saveHPagesSuccess({ Status: false }));
      setModule_DropdownSelect("");
      setPageType_DropdownSelect("");
      setrelatedPage_DropdownSelect("");

      if (pageMode === "true") {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMsg.Message,
          })
        );
      } else {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMsg.Message,
            RedirectPath: PAGE_lIST,
            AfterResponseAction: false,
          })
        );
      }
    } else if (postMsg.Status === true) {
      dispatch(saveHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: JSON.stringify(postMsg.Message),
          RedirectPath: false,
          AfterResponseAction: false,
        })
      );
    }
  }, [postMsg]);

  useEffect(() => {
    if ((modulePostAPIResponse.Status === true) && (modulePostAPIResponse.StatusCode === 200)) {
      dispatch(saveModuleMasterSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: modulePostAPIResponse.Message,
      }))
      tog_center()
    } else if (modulePostAPIResponse.Status === true) {
      dispatch(saveModuleMasterSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(modulePostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }

  }, [modulePostAPIResponse])

  useEffect(() => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      history.push({
        pathname: PAGE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  const Module_DropdownOption = ModuleData.map((d) => ({
    value: d.id,
    label: d.Name,
  }));

  // PageList Dropdown
  const PageList_DropdownOption = PageList.map((d) => ({
    value: d.id,
    label: d.Name,
  }));

  // PageType Dropdown
  const PageType_DropdownOption = PageType.map((data) => ({
    value: data.id,
    label: data.Name,
  }));

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const FormSubmitButton_Handler = (event, values) => {

    let Access = []
    PageAccess.forEach((element, key) => {
      if (element.hascheck) {
        Access.push({ Access: element.id })
      }
    });
    const PageFieldMaster = pageFieldTabTable.map((index) => ({
      ControlID: index.ControlID,
      FieldLabel: index.FieldLabel,
      InValidMsg: index.InValidMsg,
      IsCompulsory: index.IsCompulsory,
      DefaultSort: index.DefaultSort,
      ListPageSeq: index.ListPageSeq,
      Alignment: index.Alignment,
      ShowInListPage: index.ShowInListPage,
      ShowInDownload: index.ShowInDownload,
      ControlType: index.ControlType.value,
      FieldValidation: index.FieldValidation.value,
      DownloadDefaultSelect: index.DownloadDefaultSelect,
    }))

    if (
      Access.length === 0 &&
      (pageType_DropdownSelect.value === 2)
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

    if ((pageType_DropdownSelect.value === 2) && (relatedPage_DropdownSelect === undefined)) {
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: "Please Select Related Page ID",
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
      CountLabel: values.CountLabel,
      ShowCountLabel: values.ShowCountLabel,
      ActualPagePath: values.pagePath,
      PageType: pageType_DropdownSelect.value,
      PageHeading: values.pageheading,
      PageDescription: values.pagedescription,
      PageDescriptionDetails: values.pageheadingdescription,
      RelatedPageID: (pageType_DropdownSelect.value === 2) ? relatedPage_DropdownSelect.value : 0,
      IsDivisionRequired: values.IsDivisionRequired,
      IsEditPopuporComponent: values.IsEditPopuporComponent,
      CreatedBy: loginUserID(),
      UpdatedBy: loginUserID(),
      PagePageAccess: Access,
      PageFieldMaster: PageFieldMaster,
    })

    if ((pageType_DropdownSelect.value === 1) && (PageFieldMaster.length === 0)) {
      {
        dispatch(
          AlertState({
            Type: 4,
            Status: true,
            Message: "PageFields is Required",
            RedirectPath: false,
            PermissionAction: false,
          })
        );
        return;
      }
    }

    if (pageMode === mode.edit) {
      dispatch(updateHPages(jsonBody, EditData.id));

    } else {
      dispatch(saveHPages(jsonBody));

    }
  };

  // for module dropdown
  const Module_DropdownSelectHandller = (e) => {
    setModule_DropdownSelect(e);
  };

  //  for PageType deropDown
  const PageType_DropdownSelectHandller = (e) => {

    if (e.value === 2) {
      relatedPage_DropdownSelectHandller()
      setRelatedPageListShowUI(true)
      dispatch(getPageList(e.value));
      setPageAccessDropDownView(true);
    }
    else if (e.value === 1) {
      setRelatedPageListShowUI(false)
      setTablePageAccessDataState([]);
      setPageAccessDropDownView(false);
      dispatch(getPageListSuccess([]));
      setrelatedPage_DropdownSelect({ value: 0 });
    }
    else if (e.value === 3) {
      setRelatedPageListShowUI(false)
      setTablePageAccessDataState([]);
      setPageAccessDropDownView(true);
      dispatch(getPageListSuccess([]));
      // setrelatedPage_DropdownSelect({ value: 0 });
    }
    setPageType_DropdownSelect(e);
  };

  const relatedPage_DropdownSelectHandller = (e) => {
    setrelatedPage_DropdownSelect(e);
  };

  function tog_center() {
    setmodal_center(!modal_center)
  }


  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "-70px" }}>
          <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
          <Container fluid>
            <AvForm
              id="mainForm"
              name="mainForm"
              onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v); }}>

              <Col lg={12}>
                <Card className="text-black " style={{ minHeight: "100px" }}>
                  <CardHeader className="card-header   text-black c_card_header" >
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
                      {/* {!(pageType_DropdownSelect.value === 2) ? */}
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
                      {/* : <></> */}
                      {/* } */}

                    </Nav>

                    <TabContent
                      activeTab={customActiveTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <Card className="text-black c_card_body" >
                          <CardBody >
                            <Row >
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
                                      dispatch(Breadcrumb_inputName(e.target.value));
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

                        <Card className=" mt-n2 text-black c_card_body">
                          <CardBody>
                            <Row >
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
                              {(findAddMasterAccess) ?
                                <Col md="1" className=" mt-3">
                                  <AddMaster
                                    masterModal={Modules}
                                    masterPath={url.MODULE}
                                  />
                                </Col>
                                : <Col md="1"> </Col>}


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
                                    id="pagePathid"
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
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01"> Show Count Label</Label>
                                  <AvField
                                    name="ShowCountLabel"
                                    value={EditData.ShowCountLabel}
                                    type="text"
                                    placeholder="Please Enter  Show Count Label"
                                    autoComplete="off"
                                  />
                                </FormGroup>
                              </Col>

                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">
                                  <Col md="3"> </Col>
                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-4 col-form-label mt-4"
                                  >
                                    Count Label
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
                                        defaultChecked={EditData.CountLabel}
                                        name="CountLabel"
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


                            <Row Col sm="12">
                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">
                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-3 col-form-label mt-4"
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

                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">

                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-4 col-form-label mt-4"
                                  >
                                    Division Req*{" "}
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

                              {(pageType_DropdownSelect.value === 2) || (pageType_DropdownSelect.value === 3) ?
                                <FormGroup className="mb-1 col col-sm-4">
                                  <Row className="justify-content-md-left">

                                    <Label
                                      htmlFor="horizontal-firstname-input"
                                      className="col-sm-4 col-form-label mt-4"
                                    >
                                      EditMode show In Component
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
                                          defaultChecked={EditData.IsEditPopuporComponent}
                                          name="IsEditPopuporComponent"
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="customSwitchsizemd"
                                        ></label>
                                      </div>
                                    </Col>
                                  </Row>
                                </FormGroup>
                                : null}

                            </Row>

                          </CardBody>

                        </Card>

                        {pageAccessDropDownView ? (

                          <Card className=" mt-n2">
                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                              <h5 className="text-black "> Page Access</h5><br></br>

                              <Row className="row ">
                                {pageAccessval.map((index, key) => {

                                  return (
                                    <Col className="col col-4 text-black" >
                                      <li>
                                        <Row className="row ">
                                          <Col className=" col col-6 ">
                                            <li>
                                              <Label>{index.Name}</Label>
                                            </li>
                                          </Col>

                                          <Col className=" col col-6 ">
                                            <Input
                                              className="col col-2 text-black "
                                              type="checkbox"
                                              defaultChecked={index.hascheck}
                                              onChange={e => {
                                                pageAccessval[key].hascheck = e.target.checked
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </li>
                                    </Col>
                                  )
                                })}
                              </Row>
                            </CardBody>
                          </Card>
                        ) : null}
                      </TabPane>

                      <TabPane tabId="2">
                        <PageFieldMaster_Tab
                          pageFieldTabTable={pageFieldTabTable}
                          setPageFieldTabTable={setPageFieldTabTable} >
                        </PageFieldMaster_Tab>
                      </TabPane>

                    </TabContent>
                    <Row >{/* +++++++++++++++++++++++++++ Save Button  ++++++++++++++++++++++++++++++++++++++++++ */}
                      <Col sm={2}>





                        {/* {
                            pageMode === "edit" ?
                              userPageAccessState.RoleAccess_IsEdit ?
                                <button
                                  type="submit"
                                  data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                  className="btn btn-success w-md"
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
                                    className="btn btn-primary w-md"
                                  > <i className="fas fa-save me-2"></i> Save
                                  </button>
                                  :
                                  <></>
                              )
                          } */}
                      </Col>
                    </Row>
                  </CardBody>
                  <div style={{ paddingLeft: "30px", paddingBottom: "10px" }}>
                    <SaveButton pageMode={pageMode}
                      userAcc={userPageAccessState}
                      editCreatedBy={editCreatedBy}
                      module={"PageMaster"}
                    />
                  </div>
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