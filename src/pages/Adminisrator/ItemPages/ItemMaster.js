import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  CardHeader,
  FormGroup,
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvInput,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";

import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import {
  editItemSuccess,
  getItemGroup_ForDropDown,
  postItemData,
  PostItemDataSuccess,
  updateItemID,
} from "../../../store/Administrator/ItemsRedux/action";
import Select from "react-select";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const ItemsMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [itemGroupSelect, setItemGroupSelect] = useState("");

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse, ItemGroupList,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.ItemMastersReducer.postMessage,
    ItemGroupList: state.ItemMastersReducer.ItemGroupList,
  }));

  // userAccess useEffect
  useEffect(() => {
    if ((editDataGatingFromList === undefined)) {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    } else {
        let RelatedPageID = history.location.state.UserDetails.RelatedPageID
        const userfound = RoleAccessModifiedinSingleArray.find((element) => {
            return element.id === RelatedPageID
        })
        setUserPageAccessState(userfound)
    }

}, [history])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    dispatch(getItemGroup_ForDropDown());
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setItemGroupSelect({
        value: editDataGatingFromList.ItemGroup_id,
        label: editDataGatingFromList.ItemGroupName,
      });
      setPageMode("edit");
      dispatch(editItemSuccess({ Status: false }));
      dispatch(editItemSuccess({ Status: false }));
      dispatch(BreadcrumbShow(editDataGatingFromList.Name));
      return;
    }
  }, [editDataGatingFromList]);

  useEffect(() => {
    if (PostAPIResponse.Status === true && PostAPIResponse.StatusCode === 200) {
      dispatch(PostItemDataSuccess({ Status: false }));
      setItemGroupSelect('')
      formRef.current.reset();
      if (pageMode === "other") {
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
            RedirectPath: "/ItemList",
            AfterResponseAction: false,
          })
        );
      }
    } else if (PostAPIResponse.Status === true) {
      dispatch(PostItemDataSuccess({ Status: false }));
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

  //'Save' And 'Update' Button Handller
  const handleValidUpdate = (event, values) => {
    const jsonBody = JSON.stringify({
      Name: values.Name,
      GSTPercentage: values.GSTPercentage,
      MRP: values.MRP,
      ItemGroup: itemGroupSelect.value,
      isActive: values.isActive,
      Sequence: values.Sequence,
      BaseUnitID: values.BaseUnit,
      Rate: values.Rate,
      CreatedBy: 1,
      CreatedOn: "2022-05-20T11:22:55.711483Z",
      UpdatedBy: 1,
      UpdatedOn: "2022-05-20T11:22:55.711483Z",
    });
debugger
    if (pageMode === 'edit') {
      dispatch(updateItemID(jsonBody, EditData.id));
    }
    else {
      dispatch(postItemData(jsonBody));
    }
  };

  const ItemGroup_Options = ItemGroupList.map((index) => ({
    value: index.id,
    label: index.Name,
  }));

  function handllerItemGroupID(e) {
    setItemGroupSelect(e);
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = "";
  if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Item Master| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
          <Container fluid>

            <Card className="text-black" >
              <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>
              <CardBody
                className=" vh-10 0 text-black"
                style={{ backgroundColor: "#whitesmoke" }}
              >
                <AvForm
                  onValidSubmit={(e, v) => {
                    handleValidUpdate(e, v);
                  }}
                  ref={formRef}
                >
                  <Row>
                    <Col md={12}>
                      <Card>
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">Name</Label>
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
                            <Col md="1"> </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">
                                {" "}
                                Item Group{" "}
                              </Label>
                              <Select
                                name="ItemGroup"
                                id="txtItemGroup"
                                value={itemGroupSelect}
                                options={ItemGroup_Options}
                                onChange={(e) => {
                                  handllerItemGroupID(e);
                                }}
                                autocomplete="off"
                              />
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">
                                GST (%)
                              </Label>
                              <AvField
                                name="GSTPercentage"
                                value={EditData.GSTPercentage}
                                id="txtGST"
                                type="text"
                                placeholder="Please Enter GST (%)"
                                autoComplete="off"
                                validate={{
                                  number: true,
                                  required: {
                                    value: true,
                                    errorMessage: "Please Enter  GST (%)",
                                  },
                                }}
                              />
                            </FormGroup>

                            <Col md="1"> </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">
                                Base Unit
                              </Label>
                              <AvField
                                name="BaseUnit"
                                value={EditData.BaseUnitID_id}
                                id="txtBaseUnit"
                                type="text"
                                placeholder="Please Enter BaseUnit"
                                autoComplete="off"
                                validate={{
                                  number: true,
                                  required: {
                                    value: true,
                                    errorMessage: "Please Enter BaseUnit",
                                  },
                                }}
                              />
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">Rate</Label>
                              <AvField
                                name="Rate"
                                value={EditData.Rate}
                                id="txtRate"
                                type="text"
                                placeholder="Please Enter Rate"
                                autoComplete="off"
                                validate={{
                                  number: true,
                                  required: {
                                    value: true,
                                    errorMessage: "Please Enter Rate",
                                  },
                                }}
                              />
                            </FormGroup>

                            <Col md="1"> </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">MRP</Label>
                              <AvField
                                name="MRP"
                                id="txtMRP"
                                value={EditData.MRP}
                                type="text"
                                placeholder="Please Enter MRP"
                                autoComplete="off"
                                validate={{
                                  number: true,
                                  required: {
                                    value: true,
                                    errorMessage: "Please Enter MRP",
                                  },
                                }}
                              />
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup className="mb-3 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">Sequence</Label>
                              <AvField
                                name="Sequence"
                                value={EditData.Sequence}
                                id="txtSequence"
                                type="text"
                                placeholder="Please Enter Sequence"
                                autoComplete="off"
                                validate={{
                                  number: true,
                                  required: {
                                    value: true,
                                    errorMessage: "Please Enter Sequence",
                                  },
                                }}
                              />
                            </FormGroup>

                            <Col md="1"> </Col>
                            <FormGroup className="mb-2 col col-sm-6">
                              <Row className="justify-content-md-left">
                                <Label
                                  htmlFor="horizontal-firstname-input"
                                  className="col-sm-2 col-form-label mt-4"
                                >
                                  Active
                                </Label>
                                <Col md={2} style={{ marginTop: "30px" }}>
                                  {/* <AvInput
                                      checked={(EditData.ID === 0) ? false : EditData.IsActive}
                                      name="IsActive"
                                      type="checkbox"
                                      id="switch1"
                                      switch="none"
                                      defaultChecked />
                                    <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label> */}
                                  <div
                                    className="form-check form-switch form-switch-md mb-3"
                                    dir="ltr"
                                  >
                                    <AvInput
                                      type="checkbox"
                                      className="form-check-input"
                                      id="customSwitchsizemd"
                                      defaultChecked={EditData.isActive}
                                      name="isActive"
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
                          <FormGroup >
                            <Row >
                              <Col sm={2}>
                                <div>
                                  {
                                    pageMode === "edit" ?
                                      userPageAccessState.RoleAccess_IsEdit ?
                                        <button
                                          type="submit"
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
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
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
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
                    </Col>
                  </Row>
                </AvForm>
              </CardBody>
            </Card>
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
export default ItemsMaster;
