
import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, } from 'reactstrap'
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeCheckbox, onChangeSelect, onChangeText, resetFunction } from '../../../components/Common/validationFunction';
import { mode, pageId, url } from '../../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, SSDD_List_under_Company } from '../../../store/actions';
import { breadcrumbReturnFunc, btnIsDissablefunc, getSettingBasedPartyTypeID, loginCompanyID, loginJsonBody, loginPartyID, loginPartyName, loginPartyTypeName, loginRoleID, loginSystemSetting, loginUserDetails, loginUserID, metaTagLabel } from '../../../components/Common/CommonFunction';
import { GetRoutesList, GetRoutesListSuccess } from '../../../store/Administrator/RoutesRedux/actions';
import { priceListByPartyAction } from '../../../store/Administrator/PriceList/action';
import { editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, postPartyData, postPartyDataSuccess, updatePartyID, updatePartyIDSuccess } from '../../../store/Administrator/PartyRedux/action';
import { getCityOnDistrict, getCityOnDistrictSuccess, getState, updateEmployeeIDSuccess } from '../../../store/Administrator/EmployeeRedux/action';
import AddMaster from '../EmployeePages/Drodown';
import PartyType from '../PartyTypes/PartyType';
import PriceDropOptions from './MasterAdd/FirstTab/PriceDropOptions';
import Select from "react-select"
import CityMaster from '../CityPages/CityMaster';
import { C_Select } from '../../../CustomValidateForm';
import { C_Button, SaveButton } from '../../../components/Common/CommonButton';
import { customAlert } from '../../../CustomAlert/ConfirmDialog';
import { MetaTags } from 'react-meta-tags';
import { useHistory } from "react-router-dom";
import { getPartyTypelist } from '../../../store/Administrator/PartyTypeRedux/action';
import { getCountryList_Action, getCountryList_Success } from '../../../store/Administrator/CountryRedux/action';
import AddressDetailsTable1 from './AddressDetailsTable1';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import SimpleBar from "simplebar-react"
import SaveButtonDraggable from '../../../components/Common/saveButtonDraggable';
import { deltBtnCss, editBtnCss, vieBtnCss } from '../../../components/Common/ListActionsButtons';

const FranchisePartyMaster = (props) => {

  const dispatch = useDispatch();

  const history = useHistory()

  const AdderssRef = useRef(null);
  const PinRef = useRef(null);
  const IsDefaultRef = useRef(null);






  const fileds = {

    // party details
    Name: "",
    MobileNo: "",
    PartyType: "",
    Supplier: [],
    PAN: "",
    Email: "",
    State: "",
    District: "",
    CityName: "",
    PIN: '',
    PartyAddress: "",
    isActive: false,
    PriceList: "",
    IsDefault: false,
    Addressid: ""
  }



  const [state, setState] = useState(() => initialFiledFunc(fileds))
  const [isMobileRetailer, setIsMobileRetailer] = useState(false);
  const [priceListSelect, setPriceListSelect] = useState({ value: '' });
  const [addressDetails, setAddressDetails] = useState([{ Address: '', PIN: '', RowID: 0, IsDefault: false }]);

  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState(11);
  const [editCreatedBy, seteditCreatedBy] = useState("");

  const location = { ...history.location }
  const hasShowModal = props.hasOwnProperty(mode.editValue)
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const [modalCss, setModalCss] = useState(false);

  const [EditAddressDetails, setEditAddressDetails] = useState({ RowId: 0, IsEdit: false, id: "" });




  const values = { ...state.values }

  const { isError } = state;
  const { fieldLabel } = state;

  const {
    updateMsg,
    postMsg,
    stateRedux,
    DistrictOnState,
    PartyTypes,
    CityOnDistrict,
    SupplierRedux,
    districtDropDownLoading,
    cityDropDownLoading,
    countryList,
    commonPartyDropSelect,
    pageField,
    editData,
    userAccess,
    saveBtnloading,
    priceListByPartyType,
  } = useSelector((state) => ({
    saveBtnloading: state.PartyMasterReducer.saveBtnloading,
    countryList: state.CountryReducer.CountryList,
    countryListloading: state.CountryReducer.loading,
    clusterDropdown: state.ClusterReducer.ClusterListData,
    updateMsg: state.PartyMasterReducer.updateMsg,
    postMsg: state.PartyMasterReducer.postMsg,

    stateRedux: state.EmployeesReducer.State,
    DistrictOnState: state.PartyMasterReducer.DistrictOnState,
    CityOnDistrict: state.EmployeesReducer.City,
    PartyTypes: state.PartyTypeReducer.ListData,
    priceListByPartyType: state.PriceListReducer.priceListByPartyType,
    SupplierRedux: state.CommonAPI_Reducer.SSDD_List,
    RoutesList: state.RoutesReducer.RoutesList,
    pageField: state.CommonPageFieldReducer.pageField,
    userAccess: state.Login.RoleAccessUpdateData,
    districtDropDownLoading: state.PartyMasterReducer.districtDropDownLoading,
    cityDropDownLoading: state.EmployeesReducer.cityDropDownLoading,
    commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
  }));


  useEffect(() => {
    const page_Id = pageId.FRANCHISE_PARTY_MASTER
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(page_Id))

  }, []);



  useEffect(async () => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(postPartyDataSuccess({ Status: false }));
      customAlert({
        Type: 1,
        Message: postMsg.Message,
      })
      history.push({
        pathname: url.PARTY_lIST
      })
    }
    else if ((postMsg.Status === true)) {
      dispatch(postPartyDataSuccess({ Status: false }))
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg])



  useEffect(() => {


    // dispatch(commonPageField(page_id))
    dispatch(getState());
    dispatch(getPartyTypelist());

    dispatch(getCountryList_Action());
    dispatch(SSDD_List_under_Company())
    return () => {

      dispatch(getCountryList_Success());
      dispatch(getCityOnDistrictSuccess([]))//clear City privious options
      dispatch(getDistrictOnStateSuccess([]))//clear district privious options
      dispatch(editPartyIDSuccess({ Status: false }));
    }
  }, [])


  useEffect(() => {

    let userAcc = null;
    let locationPath;

    if (props.pageMode === mode.dropdownAdd) {
      locationPath = props.masterPath;
    } else {
      locationPath = location.pathname;
    }

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserAccState(userAcc);
      if (!props.isdropdown) {
        breadcrumbReturnFunc({ dispatch, userAcc });
      }
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
      setIsMobileRetailer(location.IsMobileRetailer)
      if (hasEditVal) {

        const { id, Name, MobileNo, PartySubParty, isActive, Email, PartyType, PriceList, Supplier, PAN, State, District, PartyAddress, PIN, CityName } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }
        debugger

        hasValid.Name.valid = true;
        hasValid.MobileNo.valid = true;
        hasValid.Email.valid = true;
        hasValid.PartyType.valid = true;
        hasValid.Supplier.valid = true;

        hasValid.PAN.valid = true;
        hasValid.State.valid = true;
        hasValid.District.valid = true;
        hasValid.PartyAddress.valid = true;
        hasValid.CityName.valid = true;
        hasValid.isActive.valid = true;
        hasValid.PriceList.valid = true;




        values.id = id;
        values.Name = Name;
        values.MobileNo = MobileNo;
        values.Email = Email;
        values.PartyType = { value: PartyType?.id, label: PartyType?.Name };
        values.Supplier = PartySubParty.map((r, i) => ({ ...r, label: r.PartyName, value: r.Party }))
        values.PriceList = { value: PriceList?.id, label: PriceList?.Name };
        values.isActive = location.IsMobileRetailer ? true : isActive
        values.PAN = PAN;
        values.State = { value: State?.id, label: State?.Name };
        values.District = { value: District?.id, label: District?.Name };

        values.PartyAddress = PartyAddress[0]?.Address;
        values.IsDefault = PartyAddress[0]?.IsDefault;;
        values.PIN = PartyAddress[0]?.PIN;
        values.Addressid = PartyAddress[0]?.id

        values.CityName = { value: CityName?.id, label: CityName?.Name };
        setPriceListSelect({ value: PriceList?.id, label: PriceList?.Name })
        setAddressDetails([
          { Address: '', PIN: '', RowID: 0, IsDefault: false },
          ...PartyAddress.map((r, i) => ({ ...r, RowID: i + 1 }))
        ]);

        setState({ values, fieldLabel, hasValid, required, isError })

        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        seteditCreatedBy(hasEditVal.CreatedBy)
      }
    }
  }, [])


  useEffect(async () => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      dispatch(updatePartyIDSuccess({ Status: false }));
      dispatch(editPartyIDSuccess({ Status: false }));

      setState(() => resetFunction(fileds, state))//Clear form values

      let isPermission = await customAlert({
        Type: 1,
        Status: true,
        Message: updateMsg.Message,
      })
      if (isPermission) {
        history.push({ pathname: url.RETAILER_APPROVAL })
      }


    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updatePartyIDSuccess({ Status: false }));
      dispatch(editPartyIDSuccess({ Status: false }));


      customAlert({
        Type: 3,
        Message: JSON.stringify(updateMsg.Message),
      })

    }

  }, [updateMsg, modalCss]);


  useEffect(() => {
    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])




  const handleAdd = ({ RowIndex, EditAddressDetails }) => {
    debugger
    if (AdderssRef?.current?.value.trim() || PinRef?.current?.value.trim()) {
      const inputRow = {
        id: EditAddressDetails?.id, Address: AdderssRef?.current?.value, PIN: PinRef?.current?.value, RowID: EditAddressDetails.IsEdit ? EditAddressDetails.RowID : RowIndex, fssaidocumenturl: null, IsDefault: IsDefaultRef?.current?.checked
        , FSSAINo: "",
        FSSAIExipry: null,

      }
      AdderssRef.current.value = "";
      PinRef.current.value = "";
      IsDefaultRef.current.checked = false
      if (EditAddressDetails.IsEdit) {
        setAddressDetails(prev => {
          return prev.map(row =>
            row.RowID === EditAddressDetails.RowID ? { ...inputRow } : row
          );
        });
        setEditAddressDetails({ RowID: 0, IsEdit: false })
      } else {
        setAddressDetails(prev => {
          const maxRowId = prev.length > 0
            ? Math.max(...prev.map(item => item.RowID || 0))
            : -1;
          const newRow = { ...inputRow, RowID: maxRowId + 1 };
          return [...prev, newRow];
        });
      }


    }
  };

  const handleDelete = (RowID) => {

    setAddressDetails(prev => {

      return prev.filter((row, i) => {
        return row.RowID !== (RowID);
      });
    });


  };


  const handleEdit = (Row) => {
    AdderssRef.current.value = Row.Address;
    PinRef.current.value = Row.PIN;
    IsDefaultRef.current.checked = Row.IsDefault;

    setEditAddressDetails({ RowID: Row.RowID, IsEdit: true, id: Row.id })
  };


  const SaveHandler = async (event) => {
    debugger
    const formData = new FormData();
    event.preventDefault();
    const btnId = event.target.id;


    try {
      const skipValidation = addressDetails.length > 0;

      // Step 1: Temporarily update validation flags for PartyAddress & PIN
      let modifiedState = { ...state };

      if (skipValidation && !isMobileRetailer) {
        modifiedState.hasValid.PartyAddress.valid = true;
        modifiedState.hasValid.PIN.valid = true;
        modifiedState.isError.PartyAddress = "";
        modifiedState.isError.PIN = "";
      }
      if (formValid(state, setState)) {
        btnIsDissablefunc({ btnId, state: true });


        const supplierArr = values.Supplier.map((i) => ({
          Party: i.value,
          Distance: i.value,
          CreatedBy: loginUserID(),
          UpdatedBy: loginUserID(),
          Creditlimit: "",
          Route: "",
          Delete: 0,
        }));

        debugger
        const jsonBody = JSON.stringify({
          "Name": values.Name,
          "ShortName": "",
          "PriceList": priceListSelect.value,
          "PartyType": values.PartyType.value,
          "Company": loginCompanyID(),
          "PAN": "",
          "Email": "",
          "MobileNo": values.MobileNo,
          "AlternateContactNo": "",
          "Country": loginUserDetails().Country_id,
          "State": values.State.value,
          "District": values.District.value,
          "City": (values.CityName === "") ? "" : values.CityName.value,
          "SAPPartyCode": null,
          "Taluka": 0,
          "Latitude": "",
          "Longitude": "",
          "GSTIN": "",
          "isActive": values.isActive,
          "CreatedBy": loginUserID(),
          "UpdatedBy": loginUserID(),
          "IsApprovedParty": isMobileRetailer && false,
          "PartySubParty": supplierArr,
          "PartyAddress": isMobileRetailer ?
            [{
              Address: values.PartyAddress,
              PIN: values.PIN,
              RowID: 0,
              IsDefault: values.IsDefault,
              id: values.Addressid,
              FSSAINo: "",
              FSSAIExipry: null
            }]
            : addressDetails.filter((row, i) => {
              debugger
              if (row.PIN === "" && row.RowID !== 0) {
                customAlert({
                  Type: 4,
                  Message: "PIN Required",
                })
                return
              }
              return row.RowID !== 0;
            }),
          "PartyPrefix": [
            {
              "Orderprefix": "",
              "Invoiceprefix": "",
              "Grnprefix": "",
              "Receiptprefix": "",
              "Challanprefix": "",
              "WorkOrderprefix": "",
              "MaterialIssueprefix": "",
              "Demandprefix": "",
              "IBChallanprefix": "",
              "IBInwardprefix": "",
              "PurchaseReturnprefix": "",
              "Creditprefix": "",
              "Debitprefix": "",
            }
          ],

        });

        formData.append('PartyData', jsonBody);
        addressDetails?.forEach((item, key) => {
          if (item.RowID !== 0) {  // 0 == iNPUT COLUMN
            formData.append(`fssaidocument_${item.RowID}`, "");
          }
        })
        if (pageMode === mode.edit) {
          dispatch(updatePartyID({ formData, updateId: values.id, btnId }));
        } else {
          dispatch(postPartyData({ formData, btnId }));
        }
      }
    } catch (e) {
      btnIsDissablefunc({ btnId, state: false });
    }
  };



  useEffect(() => {
    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])



  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])




  useEffect(() => {
    if (PartyTypes.length === 1) {

      setState((i) => {
        let a = { ...i }
        a.values.PartyType = {
          value: PartyTypes[0].id,
          label: PartyTypes[0].Name
        }
        a.hasValid.valid = true;
        return a
      })
      dispatch(priceListByPartyAction(PartyTypes[0].id))
    }
  }, [PartyTypes])




  useEffect(() => {

    const PartyTypeID = getSettingBasedPartyTypeID(loginSystemSetting().PriceListSetting, loginRoleID())
    let PartyType = null
    if (PartyTypeID !== null) {
      PartyType = PartyTypes.find(i => (i.id === PartyTypeID))
    } else {
      PartyType = PartyTypes.find(i => (i.IsRetailer))
    }


  }, [PartyTypes, pageField])


  const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
    value: index.id,
    label: index.Name,
    division: index.IsDivision,
    IsRetailer: index.IsRetailer
  }));

  const StateValues = stateRedux.map((index) => ({
    value: index.id,
    label: index.Name
  }));

  const DistrictOnStateValues = DistrictOnState.map((index) => ({
    value: index.id,
    label: index.Name
  }));

  const SupplierOptions = SupplierRedux.map((index) => ({
    value: index.id,
    label: index.Name
  }));

  const City_DropdownOptions = CityOnDistrict.map((index) => ({
    value: index.id,
    label: index.Name
  }));



  function partyTypeOnChange(hasSelect, evn) {

    onChangeSelect({ hasSelect, evn, state, setState })
    setPriceListSelect({ label: '' })
    dispatch(priceListByPartyAction(hasSelect.value))
  }

  function handllerState(hasSelect, evn,) {
    onChangeSelect({ hasSelect, evn, state, setState })
    dispatch(getDistrictOnState(hasSelect.value))
    dispatch(getCityOnDistrictSuccess([]))

    setState((i) => {
      const a = { ...i }
      a.values.District = "";
      a.hasValid.District.valid = false

      a.values.CityName = "";
      a.hasValid.CityName.valid = false
      return a
    })
  }

  function District_Dropdown_Handler(e) {
    dispatch(getCityOnDistrict(e.value))
    setState((i) => {
      const a = { ...i }
      a.values.CityName = "";
      a.hasValid.CityName.valid = false
      return a
    })
  }





  const priceListOnClick = function () {

    const hasNone = document.getElementById("price-drop").style;

    if ((priceListByPartyType.length > 0)) {
      if ((hasNone.display === "none") || (hasNone.display === "")) {
        hasNone.display = "block";
      } else {
        hasNone.display = "none";
      }
    }

  };

  const columns = [
    {
      dataField: 'Address',
      text: 'Address',
      formatExtraData: addressDetails,
      formatter: (cell, row, rowIndex, addressDetails) => {
        if (rowIndex === 0) {
          return (
            <Input
              type="text"
              name="Address"
              innerRef={AdderssRef}
              defaultValue={AdderssRef?.current?.value}
              onChange={(e) => { AdderssRef.current.value = e.target.value }}
              placeholder="Enter Address"
            />
          );
        }
        return cell;
      }
    },
    {
      dataField: 'PIN',
      text: 'PIN',
      formatter: (cell, row, rowIndex) => {
        if (rowIndex === 0) {
          return (
            <Input
              type="text"
              name="PIN"
              innerRef={PinRef}
              value={PinRef?.current?.value}
              onChange={(e) => { PinRef.current.value = e.target.value }}
              placeholder="Enter Pin"
            />
          );
        }
        return cell;
      }
    },

    {
      dataField: 'IsDefault',
      text: 'IsDefault',
      formatter: (cell, row, rowIndex) => {
        if (rowIndex === 0) {
          return (


            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
              <div className="form-check form-switch form-switch-md mb-3">
                <Input type="checkbox"
                  className="form-check-input"
                  innerRef={IsDefaultRef}
                  checked={IsDefaultRef?.current?.checked}
                  name="IsDefault"
                  onChange={(e) => { IsDefaultRef.current.checked = e.target.checked }}
                />
              </div>
            </Col>
          );
        }
        return cell;
      }
    },





    {
      dataField: 'Actions',
      text: 'Actions',
      formatExtraData: EditAddressDetails,
      formatter: (cell, row, rowIndex, EditAddressDetails) => {
        debugger
        if (rowIndex === 0) {
          return (
            <Button
              className={`btn-edit ${EditAddressDetails.IsEdit ? editBtnCss : vieBtnCss} mx-xxl-2`}
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Edit Party Type"
              onClick={() => handleAdd({ RowIndex: rowIndex, EditAddressDetails: EditAddressDetails })}
            ><i className="dripicons-plus font-size-18"></i></Button>
          );
        }
        return (
          <>
            <Button
              className={`btn-edit ${editBtnCss} mx-xxl-2`}
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              disabled={EditAddressDetails.IsEdit && EditAddressDetails.RowID === row.RowID}
              title="Edit Party Type"
              onClick={() => handleEdit(row)}
            ><i className="mdi mdi-pencil font-size-18"></i></Button>

            <Button
              className={`btn-delete ${deltBtnCss}`}
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Delete Party Type"
              onClick={() => handleDelete(row.RowID)}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </Button>

          </>
          // <Button color="danger" size="sm" onClick={() => handleDelete(row.RowID)}>
          //   Remove
          // </Button>
        );
      }
    }
  ];


  // const displayRows = [...addressDetails.map((r, i) => ({ ...r, RowID: i + 1 }))];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" >
          <Container fluid>
            <Row>

              <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
              <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                <CardHeader className="card-header   text-black c_card_header" >
                  <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                  <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                </CardHeader>
                <CardBody className="text-black">
                  {/* Row 1 */}
                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label >{fieldLabel.Name} </Label>
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
                    </Col>
                    <Col md={4}>
                      {/* <FormGroup>
                        <Label >{fieldLabel.Email} </Label>
                        <Input
                          name="Email"
                          value={values.Email}
                          type="text"
                          className={isError.Email.length > 0 ? "is-invalid form-control" : "form-control"}
                          placeholder="Please Enter Email"
                          autoComplete='off'
                          onChange={(event) => {
                            onChangeText({ event, state, setState })
                          }}
                        />
                        {isError.Email.length > 0 && (
                          <span className="invalid-feedback">{isError.Email}</span>
                        )}
                      </FormGroup> */}
                      <FormGroup>
                        <Label >{fieldLabel.MobileNo} </Label>
                        <Input
                          name="MobileNo"
                          value={values.MobileNo}
                          type="text"
                          className={isError.MobileNo.length > 0 ? "is-invalid form-control" : "form-control"}
                          placeholder="Please Enter Mobile"
                          autoComplete='off'
                          onChange={(event) => {
                            onChangeText({ event, state, setState })
                          }}
                        />
                        {isError.MobileNo.length > 0 && (
                          <span className="invalid-feedback">{isError.MobileNo}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label> {fieldLabel.Supplier} </Label>
                        <Select
                          id="supplierName"
                          name="Supplier"
                          value={values.Supplier}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          options={SupplierOptions}

                          isMulti={true}
                          onChange={(hasSelect, evn) => {
                            onChangeSelect({ hasSelect, evn, state, setState })
                          }}
                        />
                        {isError.Supplier.length > 0 && (
                          <span className="text-danger f-8"><small>{isError.Supplier}</small></span>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label> {fieldLabel.State} </Label>
                        <C_Select
                          name="State"
                          value={values.State}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          isSearchable={true}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          options={StateValues}
                          placeholder="Select State"
                          onChange={handllerState}
                        />
                        {isError.State.length > 0 && (
                          <span className="text-danger f-8"><small>{isError.State}</small></span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label > {fieldLabel.District} </Label>
                        <C_Select
                          name="District"
                          value={values.District}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          isSearchable={true}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          isLoading={districtDropDownLoading}
                          options={DistrictOnStateValues}
                          onChange={(hasSelect, evn) => {
                            onChangeSelect({ hasSelect, evn, state, setState, })
                            District_Dropdown_Handler(hasSelect)
                          }}
                        />
                        {isError.District.length > 0 && (
                          <span className="text-danger f-8"><small>{isError.District}</small></span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label htmlFor="validationCustom01">{fieldLabel.CityName} </Label>
                        <C_Select
                          name="CityName"
                          id="CityName"
                          value={values.CityName}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          isSearchable={true}
                          classNamePrefix="dropdown"
                          isLoading={cityDropDownLoading}
                          options={City_DropdownOptions}
                          onChange={(hasSelect, evn) => {
                            onChangeSelect({ hasSelect, evn, state, setState, })
                          }}
                        />
                        {isError.CityName.length > 0 && (
                          <span className="text-danger f-8"><small>{isError.CityName}</small></span>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Row 3 */}
                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label > {fieldLabel.PartyType}</Label>
                        <Select
                          name="PartyType"
                          value={values.PartyType}
                          isSearchable={true}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          options={PartyTypeDropdown_Options}
                          onChange={partyTypeOnChange}
                        />
                        {isError.PartyType.length > 0 && (
                          <span className="text-danger f-8"><small>{isError.PartyType}</small></span>
                        )}

                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>{fieldLabel.PriceList} </Label>
                        <Input
                          value={priceListSelect.label}
                          autoComplete={"off"}
                          placeholder="Select..."
                          onClick={priceListOnClick}
                        >
                        </Input>

                        <PriceDropOptions
                          data={priceListByPartyType}
                          priceList={priceListSelect}
                          setPriceSelect={setPriceListSelect} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>

                      <FormGroup row className="align-items-center mt-xxl-4">
                        <Label className="col-sm-4 col-form-label">
                          {fieldLabel.isActive}
                        </Label>

                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">

                          <Col md={4} >
                            <div className="form-check form-switch form-switch-md mb-3">
                              <Input type="checkbox"
                                className="form-check-input"
                                checked={values.isActive}
                                name="isActive"
                                onChange={(event) => onChangeCheckbox({ event, state, setState })}
                              />
                            </div>
                          </Col>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>

                  <hr></hr>

                  {isMobileRetailer && <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label >{fieldLabel.PartyAddress} </Label>
                        <Input
                          name="PartyAddress"
                          id="txtName"
                          value={values.PartyAddress}
                          type="text"
                          className={isError.PartyAddress.length > 0 ? "is-invalid form-control" : "form-control"}
                          placeholder="Please Enter PartyAddress"
                          autoComplete='off'
                          autoFocus={true}
                          onChange={(event) => {
                            onChangeText({ event, state, setState })
                            dispatch(Breadcrumb_inputName(event.target.value))
                          }}
                        />
                        {isError.PartyAddress.length > 0 && (
                          <span className="invalid-feedback">{isError.PartyAddress}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label >{fieldLabel.PIN} </Label>
                        <Input
                          name="PIN"
                          value={values.PIN}
                          type="text"
                          className={isError.PIN.length > 0 ? "is-invalid form-control" : "form-control"}
                          placeholder="Please Enter PIN"
                          autoComplete='off'
                          onChange={(event) => {
                            onChangeText({ event, state, setState })
                          }}
                        />
                        {isError.PIN.length > 0 && (
                          <span className="invalid-feedback">{isError.PIN}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup row className="align-items-center mt-xxl-4">
                        <Label className="col-sm-4 col-form-label">
                          {fieldLabel.IsDefault}
                        </Label>
                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                          <Col md={4} >
                            <div className="form-check form-switch form-switch-md mb-3">
                              <Input type="checkbox"
                                className="form-check-input"
                                checked={values.IsDefault}
                                name="IsDefault"
                                onChange={(event) => onChangeCheckbox({ event, state, setState })}
                              />
                            </div>
                          </Col>








                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  }


                  {!isMobileRetailer && <Row className="mb-3">
                    <Col md={12}>
                      <div className="p-3">
                        <BootstrapTable
                          keyField="id"
                          data={addressDetails}
                          columns={columns}
                          bordered
                          hover
                          striped
                        />
                      </div>
                    </Col>
                  </Row>}
                </CardBody>
              </Card>
            </Row>

            <SaveButtonDraggable>
              <SaveButton pageMode={pageMode}
                loading={saveBtnloading}
                userAcc={userPageAccessState}
                editCreatedBy={editCreatedBy}
                module={"PartyMaster"}
                onClick={SaveHandler}
              />
            </SaveButtonDraggable>
          </Container>
        </div>
      </React.Fragment>
    )

  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }

}


export default FranchisePartyMaster