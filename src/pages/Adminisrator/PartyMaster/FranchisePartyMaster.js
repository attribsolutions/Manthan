
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, } from 'reactstrap'
import { bulkSetState, comAddPageFieldFunc, formValid, initialFiledFunc, onChangeCheckbox, onChangeSelect, onChangeText, resetFunction } from '../../../components/Common/validationFunction';
import { mode, pageId, url } from '../../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, SSDD_List_under_Company } from '../../../store/actions';
import { breadcrumbReturnFunc, btnIsDissablefunc, date_ymd_func, getSettingBasedPartyTypeID, loginCompanyID, loginJsonBody, loginPartyID, loginPartyName, loginPartyTypeName, loginRoleID, loginSystemSetting, loginUserAdminRole, loginUserDetails, loginUserID, metaTagLabel } from '../../../components/Common/CommonFunction';
import { GetRoutesList, GetRoutesListSuccess } from '../../../store/Administrator/RoutesRedux/actions';
import { priceListByPartyAction } from '../../../store/Administrator/PriceList/action';
import { Get_Subcluster_On_cluster_API, mobileApp_Send_Retailer_Api } from '../../../helpers/backend_helper';
import { editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, postPartyData, postPartyDataSuccess, updatePartyID } from '../../../store/Administrator/PartyRedux/action';
import { getCityOnDistrict, getCityOnDistrictSuccess, getState, saveEmployeeAction, updateEmployeeIDSuccess } from '../../../store/Administrator/EmployeeRedux/action';
import AddMaster from '../EmployeePages/Drodown';
import PartyType from '../PartyTypes/PartyType';
import PriceDropOptions from './MasterAdd/FirstTab/PriceDropOptions';
import Select from "react-select"
import CityMaster from '../CityPages/CityMaster';
import { C_Select, CInput } from '../../../CustomValidateForm';
import { C_Button, SaveButton } from '../../../components/Common/CommonButton';
import { customAlert } from '../../../CustomAlert/ConfirmDialog';
import { alertMessages } from '../../../components/Common/CommonErrorMsg/alertMsg';
import { MetaTags } from 'react-meta-tags';
import { userAccessUseEffect } from '../../../components/Common/CommonUseEffect';
import { useHistory } from "react-router-dom";
import { getPartyTypelist } from '../../../store/Administrator/PartyTypeRedux/action';
import { getCountryList_Action, getCountryList_Success } from '../../../store/Administrator/CountryRedux/action';
import AddressDetailsTable from './MasterAdd/AddressDetailsTab/Table';
import AddressDetailsTable1 from './AddressDetailsTable1';
import { showToastAlert } from '../../../helpers/axios_Config';
// import AddressDetailsTable from './Table';
// 

// import { onChangeText,  } from '../../../../../components/Common/validationFunction'
// import { Breadcrumb_inputName } from '../../../../../store/actions'





const FranchisePartyMaster = (props) => {

  const dispatch = useDispatch();
  const loginPartyType = loginPartyTypeName()
  const history = useHistory()

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
    isActive: true,
    PriceList: "",
  }
  const [state, setState] = useState(() => initialFiledFunc(fileds))
  const [showAddressTable, setShowAddressTable] = useState(false);

  const [priceListSelect, setPriceListSelect] = useState({ value: '' });
  const [partyType_AddMasterAccess, setPartyType_AddMasterAccess] = useState(false)
  const [city_AddMasterAccess, setCity_AddMasterAccess] = useState(false)

  const [SubClusterOptions, setSubClusterOptions] = useState({});

  const [partyTypeDisabled, setPartyTypeDisabled] = useState(false)
  const [supplierDisabled, setSupplierDisabled] = useState(false)

  const [buttonShow, setButtonShow] = useState(false);
  const [imageTable, setImageTable] = useState('');
  const [addressTable, setAddressTable] = useState([]);


  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState(11);
  const [editCreatedBy, seteditCreatedBy] = useState("");
  const baseTabRef = useRef(null);
  const [activeTab1, setactiveTab1] = useState("1")
  const addressTabRef = useRef(null);
  const [EditData, setEditData] = useState('');
  const location = { ...history.location }
  const hasShowModal = props.hasOwnProperty(mode.editValue)
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const [modalCss, setModalCss] = useState(false);
  const [page_id] = useState(() => (props).page_Id)

  const prefixTabRef = useRef(null);
  const [isMobileRetailer, setIsMobileRetailer] = useState(false);

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
    countryListloading,
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
    updateMsg: state.PartyTypeReducer.updateMessage,
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
    return () => {


      // dispatch(saveSchemeTypeSuccess({ Status: false }))

    }
  }, []);



  useEffect(async () => {
    debugger
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

      if (hasEditVal) {
        setEditData(hasEditVal);
        const { id, Name, MobileNo, isActive, Email, PartyType, PriceList, Supplier, PAN, State, District, PartyAddress, PIN, CityName } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }


        hasValid.Name.valid = true;
        hasValid.MobileNo.valid = true;
        hasValid.Email.valid = true;
        hasValid.PartyType.valid = true;
        hasValid.Supplier.valid = true;

        hasValid.PAN.valid = true;
        hasValid.State.valid = true;
        hasValid.District.valid = true;
        hasValid.PartyAddress.valid = true;
        hasValid.PIN.valid = true;
        hasValid.CityName.valid = true;
        hasValid.isActive.valid = true;
        hasValid.PriceList.valid = true;

        values.id = id;
        values.Name = Name;
        values.MobileNo = MobileNo;
        values.Email = Email;
        values.PartyType = PartyType;
        values.Supplier = Supplier;
        values.PriceList = PriceList;
        values.isActive = isActive;

        values.PAN = PAN;
        values.State = State;
        values.District = District;
        values.PartyAddress = PartyAddress;
        values.PIN = PIN;
        values.CityName = CityName;


        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(editPartyIDSuccess({ Status: false }))
        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        seteditCreatedBy(hasEditVal.CreatedBy)
      }
    }
  }, [])


  useEffect(() => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      setState(() => resetFunction(fileds, state))//Clear form values
      history.push({
        pathname: url.FRANCHISE_CUSTOMER_MASTER,
      })

    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateEmployeeIDSuccess({ Status: false }));
      dispatch(
        customAlert({
          Type: 3,
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




  const SaveHandler = async (event) => {
    event.preventDefault();
    const btnId = event.target.id;


    try {
      const skipValidation = addressTable.length > 0;

      // Step 1: Temporarily update validation flags for PartyAddress & PIN
      let modifiedState = { ...state };

      if (skipValidation) {
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


        const jsonBody = JSON.stringify({
          "Name": values.Name,
          "ShortName": "",
          "PriceList": priceListSelect.value,
          "PartyType": values.PartyType.value,
          "Company": loginCompanyID(),
          "PAN": values.PAN,
          "Email": values.Email,
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
          "isActive": true,
          "CreatedBy": loginUserID(),
          "UpdatedBy": loginUserID(),
          "IsApprovedParty": false,
          "PartySubParty": supplierArr,

          PartyAddress: addressTable,
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

        if (pageMode === mode.edit) {
          dispatch(updatePartyID({ jsonBody, updateId: values.id, btnId }));
        } else {
          dispatch(postPartyData({ jsonBody, btnId }));
        }
      }
    } catch (e) {
      btnIsDissablefunc({ btnId, state: false });
    }
  };






  useEffect(() => {
    if (commonPartyDropSelect.value <= 0) {
      setAddressTable([])
    }
  }, [commonPartyDropSelect]);


  useEffect(() => {
    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

  useEffect(() => {

    userAccess.forEach((index) => {
      if (index.id === pageId.FRANCHISE_PARTY_MASTER) {
        return setPartyType_AddMasterAccess(true)
      }
      if (index.id === pageId.CITY) {
        return setCity_AddMasterAccess(true)
      }
    });

  }, [userAccess])
  useEffect(() => {

    if (commonPartyDropSelect.value <= 0) {
      setPriceListSelect({ value: '' })
      dispatch(Breadcrumb_inputName(""))
    }


    setState((i) => {
      let a = { ...i }

      a.values.Name = ''

      a.values.MobileNo = ''
      a.values.PartyType = ''

      a.values.Supplier = []
      a.values.PAN = ''
      a.values.Email = ''

      a.values.State = ''
      a.values.District = ''

      a.values.CityName = ''
      a.values.PIN = ''
      a.values.isActive = true;
      a.values.PartyAddress = ''

      a.hasValid.PartyAddress.valid = false;
      a.hasValid.Name.valid = false;

      a.hasValid.MobileNo.valid = false;
      a.hasValid.PartyType.valid = false;

      a.hasValid.Supplier.valid = false;
      a.hasValid.PAN.valid = false;
      a.hasValid.Email.valid = false;

      a.hasValid.State.valid = false;
      a.hasValid.District.valid = false;

      a.hasValid.CityName.valid = false;

      a.hasValid.PIN.valid = false;

      return a
    })

    if (commonPartyDropSelect.value > 0) {
      dispatch(GetRoutesList({ ...loginJsonBody(), "PartyID": commonPartyDropSelect.value }))

    }
    return () => {
      dispatch(GetRoutesListSuccess([]));
    }
  }, [commonPartyDropSelect]);


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






  const addOrUpdateDataHandler = (e, btnMode) => {
    try {
      const skipValidation = addressTable.length > 0 && btnMode === "add";

      // Step 1: Temporarily update validation flags for PartyAddress & PIN
      let modifiedState = { ...state };

      if (skipValidation) {
        modifiedState.hasValid.PartyAddress.valid = true;
        modifiedState.hasValid.PIN.valid = true;
        modifiedState.isError.PartyAddress = "";
        modifiedState.isError.PIN = "";
      }

      // ✅ Pass modifiedState and update UI state also
      const isvalid = formValid(modifiedState, setState);  // Just use setState

      if (isvalid) {
        const val = {
          Address: modifiedState.values.PartyAddress,
          PIN: modifiedState.values.PIN,
        };

        if (btnMode === "update") {
          const updatedTableData = addressTable.map((row) =>
            row.RowId === modifiedState.values.RowId ? { ...row, ...val } : row
          );
          setAddressTable(updatedTableData);
        } else {
          val.RowId = addressTable.length + 1;
          setAddressTable([...addressTable, val]);
          setShowAddressTable(true);
        }

        setButtonShow(false);

        // Step 3: Clear PartyAddress & PIN fields after add/update
        setState((prev) => {
          const updated = { ...prev };
          updated.values.PartyAddress = "";
          updated.values.PIN = "";
          updated.hasValid.PartyAddress.valid = false;
          updated.hasValid.PIN.valid = false;
          updated.isError.PartyAddress = "";
          updated.isError.PIN = "";
          return updated;
        });
      }
    } catch (error) {
      console.error("Error in addOrUpdateDataHandler:", error);
    }
  };





  useEffect(() => {

    const PartyTypeID = getSettingBasedPartyTypeID(loginSystemSetting().PriceListSetting, loginRoleID())
    let PartyType = null
    if (PartyTypeID !== null) {
      PartyType = PartyTypes.find(i => (i.id === PartyTypeID))
    } else {
      PartyType = PartyTypes.find(i => (i.IsRetailer))
    }


  }, [PartyTypes, pageField])

  useEffect(() => {


    setState((i) => {
      const a = { ...i }
      a.values.PartyType = { value: 31, label: "Franchise Customer" };
      a.hasValid.PartyType.valid = true


      a.values.Supplier = [{ value: loginPartyID(), label: loginPartyName() }];
      a.hasValid.Supplier.valid = true

      setSupplierDisabled(true);
      setPartyTypeDisabled(true);
      dispatch(priceListByPartyAction(31))
      return a
    })


  }, [loginPartyType, PartyTypes, SupplierRedux])

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




  const CountryListOptions = countryList?.map((data) => ({
    value: data.id,
    label: data.Country
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




  const handleEditRow = (row) => {

    setButtonShow(true);
    setState((i) => {

      const a = { ...i }
      a.values.PartyAddress = row.Address;


      a.values.PIN = row.PIN;

      a.values["RowId"] = row.RowId;
      a.values["id"] = row.id

      a.hasValid.PartyAddress.valid = true

      a.hasValid.PIN.valid = true


      a.isError.PartyAddress = ""

      a.isError.PIN = ""

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





  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" >
          <Container fluid>
            <Row>
              <Col lg={12}>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>


                <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                  <CardHeader className="card-header   text-black c_card_header" >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                  </CardHeader>

                  <CardBody className=" vh-10 0 text-black" >
                    <Row className="mt-3 ">
                      <Col md="3">
                        <FormGroup className="mb-3">
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
                      <Col md="1">  </Col>
                      <Col md="3">
                        <FormGroup className="mb-3">
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
                        </FormGroup>
                      </Col>


                      <Col md="1">  </Col>

                      <Col md="3">
                        <FormGroup className="mb-3">
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

                      <Col md="1">  </Col>

                    </Row>




                    <Row className='mt-1'>

                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label> {fieldLabel.State} </Label>

                          <Col sm={12}>
                            <C_Select
                              name="State"
                              value={values.State}

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
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col md="1">  </Col>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label > {fieldLabel.District} </Label>

                          <Col sm={12}>
                            <C_Select
                              name="District"
                              value={values.District}

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
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col md="1"></Col>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">{fieldLabel.CityName} </Label>

                          <C_Select
                            name="CityName"
                            id="CityName"
                            value={values.CityName}

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
                      {

                        (city_AddMasterAccess) ?
                          <Col md="1" className=" mt-3">
                            <AddMaster
                              masterModal={CityMaster}
                              masterPath={url.CITY}
                            />
                          </Col> : <Col md="1"> </Col>

                      }
                    </Row>
                    <Row className='mt-1'>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label > {fieldLabel.PartyType}</Label>
                          <Col sm={12}>
                            <Select
                              name="PartyType"
                              value={values.PartyType}
                              isSearchable={true}

                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={PartyTypeDropdown_Options}
                              onChange={partyTypeOnChange}
                            />
                            {isError.PartyType.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.PartyType}</small></span>
                            )}

                          </Col>
                        </FormGroup>

                      </Col>




                      {

                        (partyType_AddMasterAccess) ?
                          <Col md="1" className=" mt-3">
                            <AddMaster
                              masterModal={PartyType}
                              masterPath={url.PARTYTYPE}
                            />
                          </Col> : <Col md="1"> </Col>

                      }     <Col md="3" className="mb-3">
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
                          {/* {(isError.PriceList.length > 0 && (priceListSelect.value === "" || priceListSelect.label === "")) && (
                                        <span className="text-danger f-8"><small>{isError.PriceList}</small></span>
                                    )} */}
                        </FormGroup>

                      </Col>

                      <Col md="1"> </Col>

                      < Col md="3">
                        <FormGroup className="mb-3">
                          <Label> {fieldLabel.Supplier} </Label>
                          <Col sm={12}>
                            <Select
                              id="supplierName"
                              name="Supplier"
                              value={values.Supplier}

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
                          </Col>
                        </FormGroup>
                      </Col>

                    </Row>
                    <Col md="1"></Col>
                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label>{fieldLabel.PAN} </Label>
                        <Input
                          name="PAN"
                          value={values.PAN}
                          type="text"
                          className={isError.PAN.length > 0 ? "is-invalid form-control" : "form-control"}
                          placeholder="Please Enter PAN"
                          autoComplete='off'
                          onChange={(event) => {
                            onChangeText({ event, state, setState })
                          }}
                        />
                        {isError.PAN.length > 0 && (
                          <span className="invalid-feedback">{isError.PAN}</span>
                        )}
                      </FormGroup>
                    </Col>


                    <Row>


                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Row style={{ marginTop: '25px' }}>
                            <Label
                              className="col-sm-4 col-form-label">
                              {fieldLabel.isActive}
                            </Label>
                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                              <div className="form-check form-switch form-switch-md mb-3">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={values.isActive}
                                  // disabled={( url.PARTY_SELF_EDIT) && true}
                                  name="isActive"
                                  onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                />
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>


                  </CardBody>
                </Card>


                <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                  <CardBody className='vh-10 0 text-black'>
                    <Row className='mt-3'>
                      <Col md="9" >
                        <FormGroup className="mb-3">
                          <Label>{fieldLabel.PartyAddress} </Label>
                          <Input
                            name="PartyAddress"
                            value={values.PartyAddress}
                            type="textarea"
                            className={isError.PartyAddress.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter Address"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.PartyAddress.length > 0 && (
                            <span className="invalid-feedback">{isError.PartyAddress}</span>
                          )}
                        </FormGroup>

                      </Col>
                      {!(buttonShow) ?
                        <Col md={1}>
                          <Row className=" mt-3">
                            <Col >
                              <Button
                                className="button_add badge badge-soft-primary font-size-12 waves-effect  waves-light  btn-outline-primary  "
                                type="button"
                                onClick={(e) => addOrUpdateDataHandler(e, "add")}
                              >
                                <i className="dripicons-plus mt-3"> </i>
                              </Button>
                            </Col>
                          </Row>
                        </Col> :
                        <Col md={1}>
                          <Row style={{ marginTop: "29px" }}>
                            <Col >

                              <C_Button
                                // style={{ backgroundColor: "#0762ab", color: "#fff" }}
                                type="button"
                                className="btn btn-info font-size-12 text-center"
                                onClick={(e) => addOrUpdateDataHandler(e, "update")}
                              >
                                Update
                              </C_Button>
                            </Col>
                          </Row>
                        </Col>}
                      {/* 
                      <Col md="1">  </Col> */}
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label>{fieldLabel.PIN}</Label>

                          <Input
                            name="PIN"
                            value={values.PIN}
                            type="text"
                            cpattern={/^\d{6}$/}
                            className={isError.PIN.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter PIN"
                            autoComplete="off"
                            onChange={(event) => onChangeText({ event, state, setState })}
                          />
                          {isError.PIN.length > 0 && (
                            <span className="invalid-feedback">{isError.PIN}</span>
                          )}
                        </FormGroup>
                      </Col>

                    </Row>

                  </CardBody>
                </Card>



              </Col>
              <Row>

                {addressTable.length > 0 && (
                  <AddressDetailsTable1
                    addressTable={addressTable}
                    onEdit={handleEditRow}
                    setAddressTable={setAddressTable}
                  />
                )}



              </Row>
            </Row>
            <FormGroup>
              <Row>
                <div style={{ paddingBottom: "10px" }}>
                  <SaveButton pageMode={pageMode}
                    loading={saveBtnloading}
                    userAcc={userPageAccessState}
                    editCreatedBy={editCreatedBy}
                    module={"PartyMaster"}
                    onClick={SaveHandler}
                  />
                </div>
              </Row>
            </FormGroup>




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