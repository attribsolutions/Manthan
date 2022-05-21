import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, CardHeader, Button, Label, Input } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback,AvField } from "availity-reactstrap-validation";
import { useDispatch } from "react-redux";
// import {
//   postRole, updateID
// } from "../../store/RoleMasterRedux/actions";

const AddRole = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const EditData = props.location.state
  const [IsEditData, setIsEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  // console.log("EditData",EditData)

  useEffect(() => {
    if (!(EditData === undefined)) {
      setIsEditData(EditData);
      setIsEdit(true);
    }
  }, [])

  // console.log("EditData",IsEdit)
  const handleValidUpdate = (event, values) => {
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Description: values.Discription,
        IsActive: values.IsActive,
        Icon: values.Icon,
        Dashboard: values.Dashboard,
      }),
    };
    console.log("values", values)
    // if (IsEdit) {
    //   dispatch(updateID((requestOptions.body),(IsEditData.ID)));
    //   console.log(IsEditData.ID)
    //   history.push("/RoleListPage");
    // } 
    // else {
    //   dispatch(postRole(requestOptions.body, ));
    //   history.push("/AddRoleList");
    // }
  };

  //   return (
  //     <React.Fragment>
  //       <div className="page-content">
  //         <Container fluid>
  //           <Row>
  //             <Col lg={12}>
  //               <Card>
  //                 <CardHeader>
  //                 <Breadcrumbs title="Pages Count" breadcrumbItem=" Add Role List"  />
  //                  {/* <h1 className="card-title">*** Add Role List *** </h1> */}
  //                 </CardHeader>
  //                 <CardBody>
  //                   <AvForm
  //                     onValidSubmit={(e, v) => { handleValidUpdate(e, v) }}
  //                   //  onValidSubmit={(e, v) => { handleValidSubmit(e, v); }}
  //                   >
  //                     <AvGroup>
  //                       <Row className="mb-4">
  //                         <Label className="col-sm-2 col-form-label">
  //                           Name
  //                         </Label>
  //                         <Col sm={4}>
  //                           <AvInput
  //                             name="Name"
  //                             value={IsEditData.Name}
  //                             required
  //                           />
  //                           <AvFeedback> Name is Required....!</AvFeedback>
  //                         </Col>
  //                       </Row>{" "}
  //                     </AvGroup>

  //                     <AvGroup>
  //                       <Row className="mb-4">
  //                         <Label
  //                           htmlFor="horizontal-password-input"
  //                           className="col-sm-2 col-form-label"
  //                         >
  //                           Discription
  //                         </Label>
  //                         <Col sm={4}>
  //                           <AvInput
  //                             name="Discription"
  //                             value={IsEditData.Description}
  //                             required
  //                           />
  //                           <AvFeedback>  Discription is Required....!</AvFeedback>
  //                         </Col>
  //                       </Row>{" "}
  //                     </AvGroup>

  //                     <AvGroup>
  //                       <Row className="mb-4">
  //                         <Label
  //                           htmlFor="horizontal-password-input"
  //                           className="col-sm-2 col-form-label"
  //                         >
  //                           Icon
  //                         </Label>
  //                         <Col sm={4}>
  //                           <AvInput
  //                             name="Icon"
  //                             value={IsEditData.Icon}
  //                             required
  //                           />
  //                           <AvFeedback> Icon is Required....!</AvFeedback>
  //                         </Col>
  //                       </Row>{" "}
  //                     </AvGroup>

  //                     <Row className="mb-4">
  //                       <Label
  //                         className="col-sm-2 col-form-label"
  //                         htmlFor="horizontal-password-inputk"
  //                       >
  //                         IsActive
  //                       </Label>
  //                       <Col sm={4}>
  //                         <AvInput
  //                           type="checkbox"
  //                           checked={IsEditData.IsActive}
  //                           name="IsActive"
  //                           className="form-control"
  //                           id="horizontal-customCheck"
  //                         />
  //                       </Col>
  //                     </Row>
  //                     <AvGroup>
  //                       <Row className="mb-4">
  //                         <Label
  //                           htmlFor="horizontal-password-input"
  //                           className="col-sm-2 col-form-label"
  //                         >
  //                           Dashboard
  //                         </Label>
  //                         <Col sm={4}>
  //                           <AvInput
  //                             name="Dashboard"
  //                             value={IsEditData.Dashboard}
  //                             required
  //                           />
  //                           <AvFeedback> Dashboard is Required....!</AvFeedback>
  //                         </Col>
  //                       </Row>{" "}
  //                     </AvGroup>

  //                     <Row className="justify-content-end">
  //                       <Col sm={2}>
  //                         <div>
  //                           {IsEdit ? <button
  //                             type="submit"
  //                             className="btn btn-success w-md"
  //                           >
  //                             Update
  //                           </button>
  //                             : <button
  //                               type="submit"
  //                               className="btn btn-success w-md"
  //                             >
  //                               Save
  //                             </button>}
  //                         </div>
  //                       </Col>{" "}
  //                       <Col sm={10}></Col>
  //                     </Row>

  //                     </AvForm>
  //                 </CardBody>
  //               </Card>
  //             </Col>
  //           </Row>
  //         </Container>
  //       </div>
  //     </React.Fragment>

  //   )
  // // }
  // export default AddRole;
  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs breadcrumbItem={"Role Master "} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>

                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidUpdate(e, v);
                    }}
                  >

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField name="Name" id="txtName"
                          // value={EditData.Name}
                            type="text"
                            placeholder="Please Enter Name"
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Name...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        Discription
                        </Label>
                        <Col sm={4}>
                          <AvField name="Discription" id="txtName"
                          //  value={EditData.Discription}
                            type="text"
                            placeholder="Please Enter Discription"
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Discription...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        Icon
                        </Label>
                        <Col sm={4}>
                          <AvField name="Icon" id="txtName"
                          //  value={EditData.Icon}
                            type="text"
                            placeholder="Please Enter Icon"
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Icon...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>


                    <Row className="mb-4">
                      <Label
                        className="col-sm-2 col-form-label"
                        htmlFor="horizontal-password-inputk"
                      >
                        IsActive
                      </Label>
                      <Col sm={4}>
                        <AvInput
                          type="checkbox"
                          // checked={EditData.isActive}
                          name="isActive"
                          className="form-control"
                          id="horizontal-customCheck"
                        />
                      </Col>
                    </Row>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        Dashboard
                        </Label>
                        <Col sm={4}>
                          <AvField name="Dashboard" id="txtName"
                          //  value={EditData.Dashboard}
                            type="text"
                            placeholder="Please Enter Dashboard"
                            // autoComplete='off'
                            validate={{
                              required: { value: true, errorMessage: 'Please enter a Dashboard...!' },
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
export default AddRole
