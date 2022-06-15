import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, } from "reactstrap";
import { AvForm, AvGroup, AvField } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";

import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editItemSuccess, postItemData, PostItemDataSuccess, updateItemID } from "../../../store/Administrator/ItemsRedux/action";

const ItemsMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostData, } = useSelector((state) => ({
    PostData: state.ItemMastersReducer.PostData,
  }));

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
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
          RedirectPath: '/itemsList',
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
        isActive: values.isActive,
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      }),
    };
    if (IsEdit) {
      dispatch(updateItemID(requestOptions.body, EditData.ID));
      console.log("requestOptions", requestOptions.body)
      console.log("requestOptionsqqq", EditData.ID)
    }
    else {
      dispatch(postItemData(requestOptions.body));
      console.log("requestOptions", requestOptions.body)
    }
  };

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
                    <AvGroup>
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
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          GSTPercentage
                        </Label>
                        <Col sm={4}>
                          <AvField name="GSTPercentage" id="txtName"
                            value={EditData.GSTPercentage}
                            type="text"
                            placeholder="Please Enter Discription"
                            autoComplete='off'
                            validate={{
                              number: true,
                              required: { value: true, errorMessage: 'Please enter a GSTPercentage...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          MRP
                        </Label>
                        <Col sm={4}>
                          <AvField name="MRP" id="txtName"
                            value={EditData.MRP}
                            type="text"
                            placeholder="Please Enter Dashboard"
                            autoComplete='off'
                            validate={{
                              number: true,
                              required: { value: true, errorMessage: 'Please enter a MRP...!' },

                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
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
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                                className="btn btn-success w-md"
                              >
                                <i class="fas fa-edit me-2"></i>Update
                              </button>) : (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
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
