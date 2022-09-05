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
  Modal,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvForm, AvInput } from "availity-reactstrap-validation";
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
  updateHPages,
} from "../../../store/Administrator/HPagesRedux/actions";
import { fetchModelsList, PostModelsSubmitSuccess } from "../../../store/Administrator/ModulesRedux/actions";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import Modules from "../ModulesPages/Modules";

const PageMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let pageModeProps=props.pageMode

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [relatedPageListShowUI, setRelatedPageListShowUI] = useState(false);
  const [tablePageAccessDataState, setTablePageAccessDataState] = useState([]);
  const [module_DropdownSelect, setModule_DropdownSelect] = useState("");
  const [pageType_DropdownSelect, setPageType_DropdownSelect] = useState("");
  const [pageList_DropdownSelect, setPageList_DropdownSelect] = useState("");
  const [pageAccessDropDownView, setPageAccessDropDownView] = useState(false);
  const [modal_center, setmodal_center] = useState(false);

  const [pageAccess_DropDownSelect, setPageAccess_DropDownSelect] =
    useState("");

  //Access redux store Data
  const {
    ModuleData,
    PostAPIResponse,
    PageList,
    PageAccess,
    RoleAccessModifiedinSingleArray,
    modulePostAPIResponse } = useSelector(
      (state) => ({
        ModuleData: state.Modules.modulesList,
        PostAPIResponse: state.H_Pages.saveMessage,
        PageList: state.H_Pages.PageList,
        PageAccess: state.H_Pages.PageAccess,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        modulePostAPIResponse: state.Modules.modulesSubmitSuccesss
      })
    );
  // userAccess useEffect
  useEffect(() => {
    // debugger

    // if ((editDataGatingFromList === undefined)) {
    //   const userAcc = CommonGetRoleAccessFunction(history)
    //   if (!(userAcc === undefined)) {
    //     setUserPageAccessState(userAcc)
    //   }
    // } else {
    //   let RelatedPageID = history.location.state.UserDetails.RelatedPageID
    //   const userfound = RoleAccessModifiedinSingleArray.find((element) => {
    //     return element.id === RelatedPageID
    //   })
    //   setUserPageAccessState(userfound)
    // }

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

  // For PageAccess DropDown
  useEffect(() => {
    dispatch(getPageAccess_DropDown_API());
  }, [dispatch]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    dispatch(fetchModelsList());

    if (!(editDataGatingFromList === undefined)) {
   
      setPageMode(pageModeProps);
      
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      setEditData(editDataGatingFromList);
      setTablePageAccessDataState(editDataGatingFromList.PagePageAccess);

      setModule_DropdownSelect({
        label: editDataGatingFromList.ModuleName,
        value: editDataGatingFromList.Module,
      });
      setPageList_DropdownSelect({
        value: editDataGatingFromList.RelatedPageID,
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
        setPageList_DropdownSelect({ value: 0 });
        setPageType_DropdownSelect({ value: 1, label: "AddPage" });
      }
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
      setPageList_DropdownSelect("");
      formRef.current.reset();

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

  //'Save' And 'Update' Button Handller
  const FormSubmitButton_Handler = (event, values) => {
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
      RelatedPageID: pageList_DropdownSelect.value,
      CreatedBy: 1,
      UpdatedBy: 1,
      PagePageAccess: tablePageAccessDataState.map((d) => ({
        Access: d.AccessID,
      })),
    });

    if (pageMode === "edit") {
      dispatch(updateHPages(jsonBody, EditData.id));
    } else {
      dispatch(saveHPages(jsonBody));
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
      PageList_DropdownSelectHandller()
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
      setPageList_DropdownSelect({ value: 0 });
    }
    setPageType_DropdownSelect(e);
  };

  const PageList_DropdownSelectHandller = (e) => {
    setPageList_DropdownSelect(e);
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
  if ((pageMode === "edit")||(pageMode==="copy")||(pageMode==="dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
          <Container fluid>
            <MetaTags>
              <title>Page Master| FoodERP-React FrontEnd</title>
            </MetaTags>

            <Card className="text-black" >
              <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody>
                <AvForm
                  onValidSubmit={(e, v) => {
                    FormSubmitButton_Handler(e, v);
                  }}
                  ref={formRef}
                >
                  <Card>
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
                        {relatedPageListShowUI ? <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">
                              Related Page List
                            </Label>
                            <Select
                              value={pageList_DropdownSelect}
                              options={PageList_DropdownOption}
                              autoComplete="off"
                              onChange={(e) => {
                                PageList_DropdownSelectHandller(e);
                              }}
                            />
                          </FormGroup>
                        </Col>:<></> }
                        
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
                       
                      </Row>

                      <Row>
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
                  {pageAccessDropDownView ? (
                    <Card className=" mt-n2 text-black">
                      <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="">
                          <FormGroup className=" ml-3 col col-sm-4 mb-3 ">
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

                        <FormGroup >
                          <Row >
                            <Col sm={2}>
                              <div>
                                {
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
                                }
                              </div>
                            </Col>
                          </Row>
                        </FormGroup >
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className=" mt-n2 text-black">
                      <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <FormGroup >
                          <Row >
                            <Col sm={2}>
                              <div>
                                {
                                  pageMode === "edit" ?
                                    userPageAccessState.RoleAccess_IsEdit ?
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
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
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                          className="btn btn-primary w-md"
                                        > <i className="fas fa-save me-2"></i> Save
                                        </button>
                                        :
                                        <></>
                                    )
                                }
                              </div>
                            </Col>
                          </Row>
                        </FormGroup >
                      </CardBody>
                    </Card>
                  )}
                </AvForm>
              </CardBody>
            </Card>
            <Modal
              isOpen={modal_center}
              toggle={() => {
                tog_center();
              }}
              size="xl"
            >
              <Modules pageMode={"dropdownAdd"} />
            </Modal>
          </Container>
        </div>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};

export default PageMaster;
