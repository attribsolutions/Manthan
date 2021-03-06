import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, Label, Button, Modal } from "reactstrap";
import { AvForm, AvField, AvGroup, AvFeedback, } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSubModuleEditDataUsingIDSuccess, SaveSubModuleSuccess, save_H_Sub_Modules,
  updateSubModule_UsingID
} from "../../../store/Administrator/SubModulesRedux/actions";
import { fetchModelsList, PostModelsSubmitSuccess } from "../../../store/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MetaTags } from "react-meta-tags";
import Modules from'../ModulesPages/Modules'

const SubModules = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [modal_center, setmodal_center] = useState(false);

  let editDataGatingFromList = props.EditState;

  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const [ModuldeSelect, setModuldeSelect] = useState("");

  const { modulesList, saveMessage ,M_Success} = useSelector((state) => ({
    modulesList: state.Modules.modulesList,
    saveMessage: state.SubModules.saveMessage,
    M_Success: state.Modules.modulesSubmitSuccesss,
  }));

 
  useEffect(() => {
    dispatch(fetchModelsList());
    document.getElementById("txtName").focus();

    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      setModuldeSelect({
        value: editDataGatingFromList.ModuleID,
        label: editDataGatingFromList.ModuleName,
      })
      dispatch(GetSubModuleEditDataUsingIDSuccess({ Status: "false" }))
    }
  }, [dispatch, editDataGatingFromList]);

  useEffect(() => {
    if ((M_Success.Status === true)) {
        dispatch(PostModelsSubmitSuccess({ Status: false }))
        formRef.current.reset();
        // setModuldeSelect()
        setmodal_center(!modal_center)
        dispatch(fetchModelsList());
      
    }
}, [M_Success.Status])

  const H_modulesOptions = modulesList.map((Data) => ({
    value: Data.ID,
    label: Data.Name,
  }));

  function tog_center() {
    // dispatch(GetSubModuleEditDataUsingIDSuccess({ Status: "false" }))
    setmodal_center(!modal_center)
}

  function handllerModuleID(e) {
    setModuldeSelect(e)
  }

  function AddNewItemsDropdownHandler () {
    tog_center()
}

  const handleValidUpdate = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Module: ModuldeSelect.value,
        Icon: values.Icon,
        IsActive: values.IsActive,
        DisplayIndex: values.DisplayIndex,
        CreatedBy: 1,
        UpdatedBy: 1,
      })
    };
    if (IsEdit) {
      dispatch(updateSubModule_UsingID((requestOptions.body), (EditData.ID)));
    }
    else {
      dispatch(save_H_Sub_Modules(requestOptions.body));
    }
  };
  var IsEditModeSaSS = ''
  if (IsEdit === true) { IsEditModeSaSS = "-3.5%" };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditModeSaSS }}>
        <MetaTags>
          <title>Sub-Modules| FoodERP-React FrontEnd</title>
        </MetaTags>
        <Breadcrumbs breadcrumbItem={"Sub Modules"} />
        <Container fluid  >
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody >
                  <AvForm
                    onValidSubmit={(e, v) => { (handleValidUpdate(e, v)) }}
                    ref={formRef}  >
                    {/* onValidSubmit = {() => onSave(this.state.activeItem)} */}
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField
                            name="Name"
                            id="txtName" autocomplete="off"
                            value={EditData.Name}
                            required
                          />
                          <AvFeedback> Name is Required....!</AvFeedback>
                        </Col>
                      </Row>{" "}
                    </AvGroup>
                    
                    <Row className="mb-4">
                      <Label className="col-sm-2 col-form-label">
                        Modules
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={
                            ModuldeSelect
                          }
                          options={H_modulesOptions}
                          onChange={(e) => { handllerModuleID(e) }}
                          autocomplete="off"
                        />
                      </Col>

                      <Col xl={3} lg={4} sm={6} className="icon-demo-content">
                        <i className="dripicons-plus" onClick={() => { AddNewItemsDropdownHandler()}}></i>
                      </Col>
                    </Row>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label
                          htmlFor="horizontal-password-input"
                          className="col-sm-2 col-form-label"
                        >
                          Icon
                        </Label>
                        <Col sm={4}>
                          <AvField
                            name="Icon"
                            value={EditData.Icon}
                            required
                            autocomplete="off"
                          />
                          <AvFeedback> Icon is Required....!</AvFeedback>
                        </Col>
                      </Row>{" "}
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label
                          htmlFor="horizontal-password-input"
                          className="col-sm-2 col-form-label"
                        >
                          DisplayIndex
                        </Label>
                        <Col sm={4}>
                          <AvField
                            name="DisplayIndex"
                            autocomplete="off"
                            value={EditData.DisplayIndex}
                            validate={{
                              number: true,
                              required: { value: true, },
                            }} />
                          <AvFeedback> DisplayIndex is Required....!</AvFeedback>
                        </Col>
                      </Row>{" "}
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          IsActive
                        </Label>
                        <Col sm={4}>
                          <AvField name="IsActive"
                            autocomplete="off"
                            checked={(EditData.ID === 0) ? false : EditData.IsActive}
                            type="checkbox" />
                        </Col>
                      </Row>
                    </AvGroup>
                    <Row className="justify-content-end">
                      <Col sm={10}></Col>
                      <Col sm={2}>
                        <div>
                          {
                            IsEdit ? (<button
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
                      </Col>{" "}
                    </Row>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
                        isOpen={modal_center}
                        toggle={() => { tog_center() }}
                        size="xl"
                    >
                        <Modules  IsComponentMode={true} />
                    </Modal>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default SubModules;
