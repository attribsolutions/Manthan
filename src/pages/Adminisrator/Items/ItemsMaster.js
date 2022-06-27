import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, } from "reactstrap";
import { AvForm, AvGroup, AvField } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";

import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editItemSuccess, getItemGroup_ForDropDown, postItemData, PostItemDataSuccess, updateItemID } from "../../../store/Administrator/ItemsRedux/action";
import Select from "react-select";

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
  const { PostData, ItemGroupList } = useSelector((state) => ({
    PostData: state.ItemMastersReducer.PostData,
    ItemGroupList: state.ItemMastersReducer.ItemGroupList,
  }));

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    dispatch(getItemGroup_ForDropDown())
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList[0]);
      setItemGroupSelect({
        value: editDataGatingFromList[0].ItemGroupID,
        label: editDataGatingFromList[0].ItemGroupName
      });
      setIsEdit(true);
      dispatch(editItemSuccess({ Status: false }))
      dispatch(editItemSuccess({ Status: false }))
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {
    if ((PostData.Status === true) && (PostData.StatusCode === 200)) {
      dispatch(PostItemDataSuccess({ Status: false }))
      formRef.current.reset();
      if (PageMode === true) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostData.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostData.Message,
          RedirectPath: '/itemList',
          AfterResponseAction: false
        }))
      }
    }
    else if (PostData.Status === true) {
      dispatch(PostItemDataSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: "error Message",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostData.Status])

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
        BaseunitID: values.BaseUnit,
        Rate: values.Rate,
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      })
    };

    if (IsEdit) {
      dispatch(updateItemID(requestOptions.body, EditData.ID));
    }
    else {
      dispatch(postItemData(requestOptions.body));
    }
  };

  const ItemGroup_Options = ItemGroupList.map((Data) => ({
    value: Data.ID,
    label: Data.Name,
  }));

  function handllerItemGroupID(e) {
    setItemGroupSelect(e)
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (IsEdit === true) { IsEditMode_Css = "-3.5%" };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
        <Breadcrumbs breadcrumbItem={"Item Master "} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidUpdate(e, v);
                    }}
                    ref={formRef}
                  >
                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Name
                      </Label>
                      <Col sm={4}>
                        <AvField name="Name" id="txtName"
                          value={EditData.Name}
                          type="text"
                          placeholder="Please Enter Name"
                          autoComplete='off'
                          validate={{
                            required: { value: true, errorMessage: 'Please enter a Name...!' },
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Item Group
                      </Label>
                      <Col sm={4}>
                        <Select
                          name='ItemGroup'
                          id="txtItemGroup"
                          value={
                            itemGroupSelect
                          }
                          options={ItemGroup_Options}
                          onChange={(e) => { handllerItemGroupID(e) }}
                          autocomplete="off"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        GSTPercentage
                      </Label>
                      <Col sm={4}>
                        <AvField name="GSTPercentage"
                          value={EditData.GSTPercentage}
                          id="txtGST"
                          type="text"
                          placeholder="Please Enter GSTPercentage"
                          autoComplete='off'
                          validate={{
                            number: true,
                            required: { value: true, errorMessage: 'Please enter a GSTPercentage...!' },
                          }} />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Base Unit
                      </Label>
                      <Col sm={4}>
                        <AvField name="BaseUnit"
                          value={EditData.BaseunitID}
                          id="txtBaseUnit"
                          type="text"
                          placeholder="Please Enter BaseUnit"
                          autoComplete='off'
                          validate={{
                            number: true,
                            required: { value: true, errorMessage: 'Please enter a BaseUnit...!' },
                          }} />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Rate
                      </Label>
                      <Col sm={4}>
                        <AvField name="Rate"
                          value={EditData.Rate}
                          id="txtRate"
                          type="text"
                          placeholder="Please Enter Rate"
                          autoComplete='off'
                          validate={{
                            number: true,
                            required: { value: true, errorMessage: 'Please enter a Rate...!' },
                          }} />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        MRP
                      </Label>
                      <Col sm={4}>
                        <AvField name="MRP" id="txtMRP"
                          value={EditData.MRP}
                          type="text"
                          placeholder="Please Enter MRP"
                          autoComplete='off'
                          validate={{
                            number: true,
                            required: { value: true, errorMessage: 'Please enter a MRP...!' },

                          }} />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Sequence
                      </Label>
                      <Col sm={4}>
                        <AvField name="Sequence"
                          value={EditData.Sequence}
                          id="txtSequence"
                          type="text"
                          placeholder="Please Enter Sequence"
                          autoComplete='off'
                          validate={{
                            number: true,
                            required: { value: true, errorMessage: 'Please enter a Sequence...!' },
                          }} />
                      </Col>
                    </Row>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          IsActive
                        </Label>
                        <Col sm={4}>
                          <AvField name="isActive"
                            checked={(EditData.ID === 0) ? false : EditData.isActive}
                            type="checkbox" validate={{
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <Row className="justify-content-end">
                      <Col sm={10}></Col>
                      <Col sm={2}>
                        <div>
                          {
                            IsEdit ? (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Item"
                                className="btn btn-success w-md"
                              >
                                <i class="fas fa-edit me-2"></i>Update
                              </button>) : (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Item"
                                className="btn btn-success w-md"
                              > <i className="fas fa-save me-2"></i> Save
                              </button>
                            )
                          }
                        </div>
                      </Col>
                    </Row>
                  </AvForm>
                  <div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
export default ItemsMaster;

