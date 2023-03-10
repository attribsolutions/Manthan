import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  CardHeader,
  FormGroup,
  Input
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole,
  updateID,
  PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import {
  AlertState,
  commonPageField,
  commonPageFieldSuccess,
  updateSuccess
} from "../../../store/actions";
import Select from "react-select";
import { Breadcrumb_inputName, CommonBreadcrumbDetails } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeSelect,
  onChangeText,
  resetFunction,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { breadcrumbReturn, loginCompanyID, loginUserID, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import * as xlsx from "xlsx";
import { isLength } from "lodash";
const RoleMaster = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const fileds = {
    id: "",
    Name: "",
    Description: "",
    Dashboard: "",
    RoleEmployeeTypes: "",
    isActive: true,
    isSCMRole: false,
    IsPartyConnection: false
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [modalCss, setModalCss] = useState(false);
  const [userPageAccessState, setUserPageAccessState] = useState(123);
  const [editCreatedBy, seteditCreatedBy] = useState("");

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    postMsg,
    updateMsg,
    pageField,
    userAccess,
    EmployeeType } = useSelector((state) => ({
      postMsg: state.RoleMaster_Reducer.postMsg,
      updateMsg: state.RoleMaster_Reducer.updateMsg,
      EmployeeType: state.EmployeeTypeReducer.EmployeeTypeList,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField
    }));

  useEffect(() => {
    const page_Id = pageId.ROLE
    dispatch(commonPageFieldSuccess());
    dispatch(commonPageField(page_Id))
    dispatch(getEmployeeTypelist());
  }, []);

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const hasShowModal = props.hasOwnProperty(mode.editValue)

  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

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
      setUserPageAccessState(userAcc)
      breadcrumbReturn({ dispatch, userAcc });
      dispatch(CommonBreadcrumbDetails({
        // bredcrumbItemName: '',
        pageHeading: userAcc.PageHeading,
        userAccess: {},
        newBtnView: false,
        showCount: false,
        excelData: [],
        breadShow: true
      }))
    };
  }, [userAccess])

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
        setModalCss(true)
      }

      if (hasEditVal) {
        const listItems = hasEditVal.RoleEmployeeTypes.map((data) => ({
          value: data.EmployeeType,
          label: data.EmployeeTypeName
        }))

        const { id, Name, Description, Dashboard, isActive, isSCMRole, IsPartyConnection, RoleEmployeeTypes } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }

        hasValid.Name.valid = true;
        hasValid.Description.valid = true;
        hasValid.Dashboard.valid = true;
        hasValid.isActive.valid = true;
        hasValid.isSCMRole.valid = true;
        hasValid.IsPartyConnection.valid = true;
        hasValid.RoleEmployeeTypes.valid = true;

        values.id = id
        values.Name = Name
        values.Description = Description
        values.Dashboard = Dashboard
        values.isActive = isActive
        values.isSCMRole = isSCMRole
        values.IsPartyConnection = IsPartyConnection
        values.RoleEmployeeTypes = listItems;

        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        seteditCreatedBy(hasEditVal.CreatedBy)
      }
      dispatch(editSuccess({ Status: false }))
    }
  }, [])

  useEffect(() => {
    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      setState(() => resetFunction(fileds, state))// Clear form values  
      saveDissable(false);//save Button Is enable function
      dispatch(Breadcrumb_inputName(''))

      if (pageMode === mode.dropdownAdd) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
          RedirectPath: url.ROLE_lIST,

        }))
      }
    }
    else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
      saveDissable(false);//save Button Is enable function
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMsg.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [postMsg.Status])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      saveDissable(false);//Update Button Is enable function
      setState(() => resetFunction(fileds, state))// Clear form values  
      history.push({
        pathname: url.ROLE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      saveDissable(false);//Update Button Is enable function
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

  const EmployeeType_DropdownOptions = EmployeeType.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const SaveHandler = (event) => {
    event.preventDefault();
    if (formValid(state, setState)) {
      const jsonBody = JSON.stringify({
        Name: values.Name,
        Description: values.Description,
        Dashboard: values.Dashboard,
        isActive: values.isActive,
        isSCMRole: values.isSCMRole,
        IsPartyConnection: values.IsPartyConnection,
        RoleEmployeeTypes: values.RoleEmployeeTypes.map((i) => { return ({ EmployeeType: i.value }) }),
        Company:loginCompanyID(),
        CreatedBy: loginUserID(),
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: loginUserID(),
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      });

      saveDissable(true);//save Button Is dissable function

      if (pageMode === mode.edit) {
        dispatch(updateID(jsonBody, values.id));
      }
      else {
        dispatch(postRole(jsonBody));
      }
    }
  };
  // const readUploadFile = (e) => {
  // 
  //   e.preventDefault();
  //   if (e.target.files) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //     
  //       const data = e.target.result;
  //       const workbook = xlsx.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const exlReturn = xlsx.utils.sheet_to_json(worksheet);
  //       console.log(JSON.stringify(exlReturn));
     
  //       const jsArr = []
  //       function parentfunc(i5) {

         
  //         const parArr = {
  //           CustomerGSTTin:i5.CustomerGSTTin,
  //           GrandTotal: i5.GrandTotal,
  //           RoundOffAmount: i5.RoundOffAmount,
  //           Customer: i5.Customer,
  //           Party:i5.Party,
  //           InvoiceDate: i5.InvoiceDate,
  //           InvoiceNumber: i5.InvoiceNumber,
  //           InvoiceItems: []
  //         }
  //         parArr.InvoiceItems.push(childFunc(i5))
  //         return parArr
  //       }

  //       function childFunc(i5) {

  //         return {
  //           Item: i5.ItemID,
  //           Unit: i5.Unit,
  //           BatchCode: i5.BatchCode,
  //           Quantity: i5.Quantity,
  //           BatchDate: i5.BatchDate,
  //           BatchID: i5.BatchID,
  //           BaseUnitQuantity: i5.BaseUnitQuantity,
  //           LiveBatch: i5.LiveBatch,
  //           MRP: i5.MRP,
  //           Rate: i5.Rate,
  //           BasicAmount: i5.BasicAmount,
  //           GSTAmount: i5.GSTAmount,
  //           GST: i5.GST,
  //           CGST:i5.CGST,
  //           SGST: i5.SGST,
  //           IGST: i5.IGST,
  //           GSTPercentage: i5.GSTPercentage,
  //           CGSTPercentage:i5.CGSTPercentage,
  //           SGSTPercentage: i5.SGSTPercentage,
  //           IGSTPercentage: i5.IGSTPercentage,
  //           Amount: i5.Amount,
  //           TaxType:i5.TaxType,
  //           DiscountType: i5.DiscountType,
  //           Discount: i5.Discount,
  //           DiscountAmount: i5.DiscountAmount,
  //         }


  //       }

  //       exlReturn.map((i1) => {

  //         const islengt = jsArr.find(i5 => {
  //           return (i1.InvoiceNumber === i5.InvoiceNumber)
  //         });

  //         if (jsArr.length === 0) {
  //           jsArr.push(parentfunc(i1))
  //         }
  //         else if (islengt) {
  //           islengt.InvoiceItems.push(childFunc(i1))
  //         } else {
  //           jsArr.push(parentfunc(i1))
  //         }
  //       })
  //       console.log("data1", jsArr);
  //       console.log("data1",JSON.stringify( jsArr));

  //       var a = [
  //         {
  //           CustomerGSTTin: "41",
  //           GrandTotal: 35573,
  //           RoundOffAmount: "0.00",
  //           Customer: 24,
  //           Party: 4,
  //           CreatedBy: 30,
  //           UpdatedBy: 30,
  //           InvoiceDate: "2023-02-27",
  //           InvoiceItems: [
  //             {
  //               Item: 106,
  //               Unit: 910,
  //               BatchCode: "A10",
  //               Quantity: "11.000",
  //               BatchDate: "2023-02-25",
  //               BatchID: 772,
  //               BaseUnitQuantity: "13961.000",
  //               LiveBatch: 191,
  //               MRP: null,
  //               Rate: "3000.00",
  //               BasicAmount: "33000.00",
  //               GSTAmount: "1650.00",
  //               GST: 106,
  //               CGST: "825.00",
  //               SGST: "825.00",
  //               IGST: 0,
  //               GSTPercentage: "5.00",
  //               CGSTPercentage: 2.5,
  //               SGSTPercentage: 2.5,
  //               IGSTPercentage: 0,
  //               Amount: "34650.00",
  //               TaxType: "GST",
  //               DiscountType: "",
  //               Discount: "0",
  //               DiscountAmount: "0"
  //             }

  //           ]

  //         }]
  //     }
  //     reader.readAsArrayBuffer(e.target.files[0]);
  //   }
  // }


  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (modalCss || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" >
          <Container fluid>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <Card className="text-black">
              <CardHeader className="card-header  text-black c_card_header" >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                <form onSubmit={SaveHandler} noValidate>
                  <Row className="">
                    <Col md={12}>
                      <Card>
                        <CardBody className="c_card_body">
                          <Row>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label>{fieldLabel.Name} </Label>
                              <Input
                                name="Name"
                                id="txtName"
                                value={values.Name}
                                type="text"
                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Name"
                                autoComplete='off'
                                autoFocus={true}
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                  dispatch(Breadcrumb_inputName(event.target.value))
                                }}
                              />
                              {isError.Name.length > 0 && (
                                <span className="invalid-feedback">{isError.Name}</span>
                              )}
                            </FormGroup>


                            <Col md={1} className="mx-n1"> </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.RoleEmployeeTypes} </Label>
                              <Select
                                name="RoleEmployeeTypes"
                                value={values.RoleEmployeeTypes}
                                isSearchable={false}
                                isMulti={true}
                                options={EmployeeType_DropdownOptions}
                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                classNamePrefix="dropdown"
                              />
                              {isError.RoleEmployeeTypes.length > 0 && (
                                <span className="text-danger f-8"><small>{isError.RoleEmployeeTypes}</small></span>
                              )}
                            </FormGroup>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Description} </Label>
                                <Input
                                  type="text"
                                  value={values.Description}
                                  className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Description"
                                  autoComplete="off"
                                  placeholder="Please Enter description"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Description.length > 0 && (
                                  <span className="invalid-feedback">{isError.Description}</span>
                                )}
                              </FormGroup>

                              <Col md="1">  </Col>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Dashboard} </Label>
                                <Input
                                  type="text"
                                  value={values.Dashboard}
                                  className={isError.Dashboard.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Dashboard"
                                  autoComplete="off"
                                  placeholder="Please Enter dashboard"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Dashboard.length > 0 && (
                                  <span className="invalid-feedback">{isError.Dashboard}</span>
                                )}
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >{fieldLabel.isSCMRole}</Label>
                                  <Col md={2} style={{ marginTop: '9px', marginLeft: "1cm" }} >

                                    <div className="form-check form-switch form-switch-md mb-3" >
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isSCMRole}
                                        name="isSCMRole"
                                        onChange={(e) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isSCMRole = e.target.checked;
                                            return a
                                          })
                                        }}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-3 col-form-label" >{fieldLabel.isActive}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={values.isActive}
                                        name="isActive"
                                        onChange={(e) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isActive = e.target.checked;
                                            return a
                                          })
                                        }}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-5 col-form-label" >{fieldLabel.IsPartyConnection}</Label>
                                  <Col md={1} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={values.IsPartyConnection}
                                        name="IsPartyConnection"
                                        onChange={(e) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.IsPartyConnection = e.target.checked;
                                            return a
                                          })
                                        }}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            {/* <Row className=" col col-sm-12">
                              <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >Upload</Label>
                                <Input
                                  className="form-control "
                                  type="file"
                                  name="upload"
                                  id="upload"
                                  accept=".xlsx"
                                  onChange={readUploadFile}
                                />
                              </FormGroup>
                            </Row > */}

                            <FormGroup>
                              <Row>
                                <Col sm={2}>
                                  <SaveButton pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"RoleMaster"}
                                  />
                                </Col>
                              </Row>
                            </FormGroup >
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </form>
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
export default RoleMaster
