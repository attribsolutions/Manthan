import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
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
  AvGroup,
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

const ItemsMaster = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);
  const [itemGroupSelect, setItemGroupSelect] = useState("");

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { postMessage, ItemGroupList } = useSelector((state) => ({
    postMessage: state.ItemMastersReducer.postMessage,
    ItemGroupList: state.ItemMastersReducer.ItemGroupList,
  }));

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    dispatch(getItemGroup_ForDropDown());
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setItemGroupSelect({
        value: editDataGatingFromList.ItemGroup_id,
        label: editDataGatingFromList.ItemGroupName,
      });
      setIsEdit(true);
      dispatch(editItemSuccess({ Status: false }));
      dispatch(editItemSuccess({ Status: false }));
      dispatch(BreadcrumbShow(editDataGatingFromList.Name));
      return;
    }
  }, [editDataGatingFromList]);

  useEffect(() => {
    if (postMessage.Status === true && postMessage.StatusCode === 200) {
      dispatch(PostItemDataSuccess({ Status: false }));
      formRef.current.reset();
      if (PageMode === true) {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMessage.Message,
          })
        );
      } else {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMessage.Message,
            RedirectPath: "/itemList",
            AfterResponseAction: false,
          })
        );
      }
    } else if (postMessage.Status === true) {
      dispatch(PostItemDataSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message:  JSON.stringify(postMessage.Message),
          RedirectPath: false,
          AfterResponseAction: false,
        })
      );
    }
  }, [postMessage]);

  //'Save' And 'Update' Button Handller
  const handleValidUpdate = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({
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
      }),
    };
    debugger;
    if (IsEdit) {
      dispatch(updateItemID(requestOptions.body, EditData.id));
    } else {
      dispatch(postItemData(requestOptions.body));
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
  if (IsEdit === true) {
    IsEditMode_Css = "-5.5%";
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Item Master| FoodERP-React FrontEnd</title>
      </MetaTags>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
        <Breadcrumbs breadcrumbItem={"Item Master "} />
        <Container fluid>
          <Card>
            <CardHeader
              className="card-header   text-black"
              style={{ backgroundColor: "#dddddd" }}
            >
              <h4 className="card-title text-black">
                React Validation - Normal
              </h4>
              <p className="card-title-desc text-black">
                Provide valuable, actionable feedback to your users with HTML5
                form validation–available in all our supported browsers.
              </p>
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
                                    checked={EditData.isActive}
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
                        <Row>
                          <Col sm={2}>
                            <div>
                              {IsEdit ? (
                                <button
                                  type="submit"
                                  data-mdb-toggle="tooltip"
                                  data-mdb-placement="top"
                                  title="Update Employee"
                                  className="btn btn-success w-md"
                                >
                                  <i class="fas fa-edit me-2"></i>Update
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  data-mdb-toggle="tooltip"
                                  data-mdb-placement="top"
                                  title="Save Employee"
                                  className="btn btn-primary w-md"
                                >
                                  {" "}
                                  <i className="fas fa-save me-2"></i> Save
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>
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
};
export default ItemsMaster;
