import React, { useEffect, useState } from "react";
import { Col, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
  commonPageField,
  commonPageFieldSuccess,
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeSelect,
  onChangeText,
  resetFunction,
} from "../../../components/Common/validationFunction";
import { PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index";
import { ClaimListfortracking, PriceList_Dropdown_API } from "../../../helpers/backend_helper";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import {
  editClaimTrackingEntryIDSuccess,
  saveClaimTrackingEntry,
  saveClaimTrackingEntry_Success,
  updateClaimTrackingEntryID,
  updateClaimTrackingEntryIDSuccess,
} from "../../../store/Accounting/ClaimTrackingEntryRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { useMemo } from "react";
import {
  fetchDataAndSetDropdown,
  getCurrent_Month_And_Year,
} from "./ClaimRelatedFunc";
import Slidewithcaption from "../../../components/Common/CommonImageComponent";

const ClaimTrackingEntry = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDate_ymd = _cfunc.date_ymd_func();

  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState(123);
  const [editCreatedBy, seteditCreatedBy] = useState("");

  const [typeOption, setTypeOption] = useState([]);
  const [typeOfClaimOption, setTypeOfClaimOption] = useState([]);
  const [claimCheckByOption, setClaimCheckByOption] = useState([]);
  const [creditNoteStatusOption, setCreditNoteStatusOption] = useState([]);
  const [claimListfortrackingApi, setClaimListfortrackingApi] = useState([]);
  const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not
  const [claimTradefortrackingApi, setClaimTradefortrackingApi] = useState([]);

  const [UploadFile, setUploadFile] = useState([]);

  const [CreditNoteUpload, setCreditNoteUpload] = useState({});




  const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);

  const fileds = {
    Date: currentDate_ymd,
    ClaimId: "",
    ClaimText: "",
    PartyName: "",
    Type: "",
    ClaimReceivedSource: "",
    ClaimTrade: "",
    TypeOfClaim: "",
    ClaimForTheMonth: "",
    ClaimAmount: "",
    Remark: "",
    CompanyName: "",
    ClaimCheckBy: "",
    CreditNotestatus: "",
    CreditNoteNo: "",
    CreditNoteDate: currentDate_ymd,
    ClaimSummaryDate: currentDate_ymd,
    CreditNoteAmount: "",
    CreditNoteUpload: "",
    File: []
  };

  const [state, setState] = useState(() => initialFiledFunc(fileds));

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    partyList,
    saveBtnloading,
    postMsg,
    partyDropdownLoading,
    updateMsg,
    pageField,
    userAccess,
  } = useSelector((state) => ({
    saveBtnloading: state.ClaimTrackingEntry_Reducer.saveBtnloading,
    postMsg: state.ClaimTrackingEntry_Reducer.postMsg,
    partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
    partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
    updateMsg: state.ClaimTrackingEntry_Reducer.updateMessage,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField,
  }));

  //Max Month is current Month
  const maxMonthCurrent = useMemo(() => {
    const current = getCurrent_Month_And_Year();
    return `${current.Year}-${current.Month}`;
  }, []);

  // userAccess useEffect
  useEffect(() => {
    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    }

    userAcc = userAccess.find((inx) => {
      return `/${inx.ActualPagePath}` === locationPath;
    });

    if (userAcc) {
      setUserAccState(userAcc);
      _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
    }
  }, [userAccess]);

  useEffect(() => {
    if (pageField) {
      const fieldArr = pageField.PageFieldMaster;
      comAddPageFieldFunc({ state, setState, fieldArr });
    }
  }, [pageField]);

  const values = { ...state.values };
  const { isError } = state;
  const { fieldLabel } = state;

  const location = { ...history.location };
  const hasShowloction = location.hasOwnProperty(mode.editValue);
  const hasShowModal = props.hasOwnProperty(mode.editValue);

  // onLoad Page Relate API Call
  useEffect(() => {
    const page_Id = pageId.CLAIM_TRACKING_ENTRY;
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(page_Id));
    // dispatch(priceListByCompay_Action());
    return () => {
      dispatch(commonPageFieldSuccess(null));
    };
  }, []);


  useEffect(async () => {
    const { file, filename } = CreditNoteUpload
    const response = await fetch(file);
    const data = await response.blob();
    const fetchFile = new File([data], filename);

    setState((i) => {
      const a = { ...i }
      a.values.CreditNoteUpload = fetchFile;
      return a
    })

  }, [CreditNoteUpload])


  useEffect(() => {
    if ((hasShowloction || hasShowModal) && pageField) {
      let hasEditVal = null;
      if (hasShowloction) {
        setPageMode(location.pageMode);
        hasEditVal = location.editValue;
      } else if (hasShowModal) {
        hasEditVal = props.editValue;
        setPageMode(props.pageMode);
        setModalCss(true);
      }

      if (hasEditVal) {
        const {
          id,
          Date,
          ClaimReceivedSource,
          ClaimAmount,
          Remark,
          CreditNoteNo,
          CreditNoteDate,
          CreditNoteAmount,
          ClaimSummaryDate,
          CreditNoteUpload,
          Claim,
          TypeName,
          Type,
          ClaimTradeName,
          ClaimTrade,
          TypeOfClaimName,
          TypeOfClaim,
          ClaimCheckByName,
          ClaimCheckBy,
          CreditNotestatusName,
          CreditNotestatus,
          PartyName,
          Party,
          Year,
          Month,
          PartyTypeName,
          FullClaimNo,
          FileName
        } = hasEditVal;

        const { values, fieldLabel, hasValid, required, isError } = {
          ...state,
        };
        for (const key in hasValid) {
          if (hasValid.hasOwnProperty(key)) {
            hasValid[key].valid = true;
          }
        }

        values.id = id;
        values.Date = Date;
        values.ClaimReceivedSource = ClaimReceivedSource;
        values.ClaimAmount = ClaimAmount;
        values.Remark = Remark;
        values.CreditNoteNo = CreditNoteNo;
        values.CreditNoteDate = CreditNoteDate;
        values.CreditNoteAmount = CreditNoteAmount;
        values.ClaimSummaryDate = ClaimSummaryDate;
        values.ClaimText = FullClaimNo;
        const filename = FileName.split('/').pop();

        // const response = await fetch(CreditNoteUpload);
        // const data = await response.blob();
        // const file = new File([data], filename);
        // values.CreditNoteUpload = file

        setCreditNoteUpload({ file: CreditNoteUpload, filename: filename })

        values.ClaimId = {
          label: `${id} ${PartyName} /${PartyTypeName} (${ClaimAmount})`,
          value: Claim,
        };
        values.Type = { label: TypeName, value: Type };
        values.ClaimTrade = { label: ClaimTradeName, value: ClaimTrade };
        values.TypeOfClaim =
          TypeOfClaimName === null
            ? { label: "Select...", value: 0 }
            : { label: TypeOfClaimName, value: TypeOfClaim };
        values.ClaimCheckBy = { label: ClaimCheckByName, value: ClaimCheckBy };
        values.CreditNotestatus = {
          label: CreditNotestatusName,
          value: CreditNotestatus,
        };
        values.PartyName = { label: PartyName, value: Party };

        setYearAndMonth({ Year: Year, Month: Month });
        setState({ values, fieldLabel, hasValid, required, isError });
        seteditCreatedBy(hasEditVal.CreatedBy);
        dispatch(editClaimTrackingEntryIDSuccess({ Status: false }));
      }
    }
  }, [pageField, hasShowloction, hasShowModal]);

  // Post UseEffect
  useEffect(async () => {
    if (postMsg.Status === true && postMsg.StatusCode === 200) {
      dispatch(saveClaimTrackingEntry_Success({ Status: false }));
      setState(() => resetFunction(fileds, state)); // Clear form values

      if (pageMode === "other") {
        customAlert({
          Type: 1,
          Message: postMsg.Message,
        });
      } else {
        let isPermission = await customAlert({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
        });
        if (isPermission) {
          history.push({ pathname: url.CLAIM_TRACKING_ENTRY_LIST });
        }
      }
    } else if (postMsg.Status === true) {
      dispatch(saveClaimTrackingEntry_Success({ Status: false }));
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      });
    }
  }, [postMsg]);

  useEffect(() => {
    if (UploadFile.length > 0) {
      setmodal_backdrop(true)
    }
  }, [UploadFile])

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // update UseEffect
  useEffect(() => {
    if (
      updateMsg.Status === true &&
      updateMsg.StatusCode === 200 &&
      !modalCss
    ) {
      setState(() => resetFunction(fileds, state)); // Clear form values
      history.push({
        pathname: url.CLAIM_TRACKING_ENTRY_LIST,
      });
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateClaimTrackingEntryIDSuccess({ Status: false }));
      customAlert({
        Type: 3,
        Message: JSON.stringify(updateMsg.Message),
      });
    }
  }, [updateMsg, modalCss]);

  useEffect(async () => {
    fetchDataAndSetDropdown(76, setTypeOption); // set Type dropdown
    fetchDataAndSetDropdown(78, setTypeOfClaimOption); // set TypeOfClaim dropdown
    fetchDataAndSetDropdown(79, setClaimCheckByOption); // set ClaimCheckBy dropdown
    fetchDataAndSetDropdown(82, setCreditNoteStatusOption); // set CreditNoteStatus dropdown
    dispatch(getcompanyList());

    const resp = await ClaimListfortracking(JSON.stringify(yearAndMonth));
    setClaimListfortrackingApi(resp.StatusCode === 200 ? resp.Data : []);

    const resp1 = await PriceList_Dropdown_API();
    setClaimTradefortrackingApi(resp1.StatusCode === 200 ? resp1.Data : []);
  }, []);




  const partyListOptions = partyList.map((i) => ({
    value: i.id,
    label: i.Name,
  }));

  const ClaimIdOptions = claimListfortrackingApi.map((i, index) => ({
    value: index + 1,
    claimId: i.id,
    label: `${i.id} ${i.PartyName} /${i.PartyTypeName} (${i.ClaimAmount})`,
    Party: { value: i.PartyID, label: i.PartyName },
    ClaimAmount: i.ClaimAmount,
    PartyTypeID: i.PartyTypeID,
  }));

  const ClaimTradeOptions = claimTradefortrackingApi.map((i) => ({
    value: i.id,
    label: i.Name,
  }));

  const ClaimRecordDate_Onchange = (e, date) => {
    setState((i) => {
      const a = { ...i };
      a.values.Date = date;
      a.hasValid.Date.valid = true;
      return a;
    });
  };

  const CreditNoteDate_Onchange = (e, date) => {
    setState((i) => {
      const a = { ...i };
      a.values.CreditNoteDate = date;
      a.hasValid.CreditNoteDate.valid = true;
      return a;
    });
  };

  const ClaimSummaryDate_Onchange = (e, date) => {
    setState((i) => {
      const a = { ...i };
      a.values.ClaimSummaryDate = date;
      a.hasValid.ClaimSummaryDate.valid = true;
      return a;
    });
  };



  const partyOnChange = (hasSelect, evn) => {
    onChangeSelect({ hasSelect, evn, state, setState });
  };

  const onchangeHandler = async (event, key, type) => {
    const file = Array.from(event.target.files)
    setState((i) => {
      const a = { ...i }
      a.values.File = file;
      return a
    })
  }

  const ClaimIdOnChange = (hasSelect, evn) => {
    onChangeSelect({ hasSelect, evn, state, setState });

    setState((i) => {
      const a = { ...i };
      a.values.ClaimAmount = hasSelect.ClaimAmount;
      a.values.PartyName = hasSelect.Party;
      a.values.Type = { value: 77, label: 'Return Claim' };

      a.isError.Type = "";
      a.isError.PartyName = "";
      a.isError.ClaimAmount = "";

      a.hasValid.Type.valid = true;
      a.hasValid.PartyName.valid = true;
      a.hasValid.ClaimAmount.valid = true;

      return a;
    });
  };

  async function MonthAndYearOnchange(e) {
    const selectdMonth = getCurrent_Month_And_Year(e.target.value);
    setYearAndMonth(selectdMonth);

    setState((i) => {
      const a = { ...i };
      a.values.ClaimAmount = "";
      a.values.ClaimId = "";
      a.values.PartyName = "";
      a.hasValid.ClaimId.valid = true;
      a.hasValid.PartyName.valid = false;
      a.hasValid.ClaimAmount.valid = false;
      return a;
    });
    // when month is select then ClaimListfortracking API call
    const resp = await ClaimListfortracking(JSON.stringify(selectdMonth));
    setClaimListfortrackingApi(resp.StatusCode === 200 ? resp.Data : []);
  }

  const saveHandeller = async (event) => {
    event.preventDefault();
    const btnId = event.target.id;

    try {
      if (formValid(state, setState)) {
        _cfunc.btnIsDissablefunc({ btnId, state: true });

        const formData = new FormData();

        formData.append('Date', values.Date);
        formData.append('Month', yearAndMonth.Month);
        formData.append('Year', yearAndMonth.Year);
        formData.append('ClaimReceivedSource', values.ClaimReceivedSource);
        formData.append('Type', values.Type.value);
        formData.append('ClaimTrade', values.ClaimTrade.value);
        formData.append('TypeOfClaim', (values.TypeOfClaim === "" || values.TypeOfClaim === 0) ? 0 : values.TypeOfClaim.value);
        formData.append('ClaimAmount', values.ClaimAmount);
        formData.append('Remark', values.Remark);
        formData.append('ClaimCheckBy', values.ClaimCheckBy.value);
        formData.append('CreditNotestatus', values.CreditNotestatus.value);
        formData.append('CreditNoteNo', values.CreditNoteNo);
        formData.append('CreditNoteDate', values.CreditNoteDate);
        formData.append('CreditNoteAmount', values.CreditNoteAmount);
        formData.append('ClaimSummaryDate', values.ClaimSummaryDate);
        formData.append('Claim', values.ClaimId.claimId === undefined ? "" : values.ClaimId.claimId);
        formData.append('Party', values.PartyName.value);
        formData.append('FullClaimNo', values.ClaimText ? values.ClaimText : values.ClaimId.claimId);
        formData.append('PartyType', values.ClaimId.PartyTypeID === undefined ? "" : values.ClaimId.PartyTypeID);
        debugger
        if (pageMode === mode.edit && values.File[0] === undefined) {
          formData.append(`CreditNoteUpload`, values.CreditNoteUpload);
        } else {
          formData.append(`CreditNoteUpload`, values.File[0]);


        }

        if (pageMode === mode.edit) {
          dispatch(
            updateClaimTrackingEntryID({ formData, updateId: values.id, btnId })
          );
        } else {
          dispatch(saveClaimTrackingEntry({ formData }));
        }
      }
    } catch (e) {
      _cfunc.btnIsDissablefunc({ btnId, state: false });
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = "";
  if (modalCss || pageMode === mode.dropdownAdd) {
    IsEditMode_Css = "-5.5%";
  }

  if (!(userPageAccessState === "")) {
    return (
      <React.Fragment>
        <PageLoadingSpinner isLoading={(!pageField)} />
        <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
        <div className="page-content" >

          <Modal
            isOpen={modal_backdrop}
            toggle={() => {
              tog_backdrop()
            }}
            style={{ width: "800px", height: "800px", borderRadius: "50%" }}
            className="modal-dialog-centered "
          >
            {(UploadFile.length > 0) && <Slidewithcaption Images={UploadFile} />}
          </Modal>

          <form noValidate>
            <div className="px-2 c_card_filter header text-black mb-2">


              {/* *******Claim Record Date***** &&& ******Claim For The Month********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className="row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.Date}{" "}
                    </Label>
                    <Col sm="7">
                      <C_DatePicker
                        name="Date"
                        value={values.Date}
                        onChange={ClaimRecordDate_Onchange}
                      />
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimForTheMonth}{" "}
                    </Label>
                    <Col sm="7">
                      <Input
                        className="form-control"
                        type="month"
                        value={`${yearAndMonth.Year}-${yearAndMonth.Month}`}
                        onChange={(e) => MonthAndYearOnchange(e)}
                        max={maxMonthCurrent}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* *******Select Claim Id dropdown***** &&& ******Select Claim Id Inputbox********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimId}{" "}
                    </Label>
                    <Col sm="7">
                      <C_Select
                        id="ClaimId "
                        name="ClaimId"
                        value={values.ClaimId}
                        className="react-dropdown"
                        isDisabled={!(values.ClaimText === "") && true}
                        classNamePrefix="dropdown"
                        options={ClaimIdOptions}
                        onChange={(hasSelect, evn) => {
                          ClaimIdOnChange(hasSelect, evn);
                        }}
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                      />
                      {isError.ClaimId.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.ClaimId}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {" "}
                      {fieldLabel.ClaimText}
                    </Label>
                    <Col sm="7">
                      <Input
                        type="text"
                        name="ClaimText"
                        id="ClaimText"
                        placeholder="Please Enter Manual Claim No."
                        disabled={values.ClaimId.value > 0 && true}
                        value={values.ClaimText}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="px-2 text-black mb-2 mt-n1" style={{ backgroundColor: "#f6f6f6" }}>
              {/* *******Party***** &&& ********* Claim Received Source********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.PartyName}{" "}
                    </Label>
                    <Col sm="7">
                      <C_Select
                        id="PartyName "
                        name="PartyName"
                        value={values.PartyName}
                        isSearchable={true}
                        isLoading={partyDropdownLoading}
                        isDisabled={values.ClaimId.value > 0 && true}
                        className="react-dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        classNamePrefix="dropdown"
                        options={
                          !(values.ClaimId.value > 0) ? partyListOptions : []
                        }
                        onChange={(hasSelect, evn) => {
                          partyOnChange(hasSelect, evn);
                        }}
                      />
                      {isError.PartyName.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.PartyName}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimReceivedSource}
                    </Label>
                    <Col sm="7">
                      <Input
                        type="text"
                        name="ClaimReceivedSource"
                        id="ClaimReceivedSource"
                        placeholder="Please Enter Claim Received Source"
                        value={values.ClaimReceivedSource}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      />
                      {isError.ClaimReceivedSource.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.ClaimReceivedSource}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* *******Type***** &&& ********* Claim Trade********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.Type}{" "}
                    </Label>
                    <Col sm="7">
                      <Select
                        name="Type"
                        value={values.Type}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        options={typeOption}
                        onChange={(hasSelect, evn) => {
                          onChangeSelect({ hasSelect, evn, state, setState });
                        }}
                      />
                      {isError.Type.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.Type}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimTrade}{" "}
                    </Label>
                    <Col sm="7">
                      <Select
                        name="ClaimTrade"
                        value={values.ClaimTrade}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        options={ClaimTradeOptions}
                        onChange={(hasSelect, evn) => {
                          onChangeSelect({ hasSelect, evn, state, setState });
                        }}
                      />
                      {isError.ClaimTrade.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.ClaimTrade}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.TypeOfClaim}{" "}
                    </Label>
                    <Col sm="7">
                      <Select
                        name="TypeOfClaim"
                        value={values.TypeOfClaim}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        options={typeOfClaimOption}
                        onChange={(hasSelect, evn) => {
                          onChangeSelect({ hasSelect, evn, state, setState });
                        }}
                      />
                      {isError.TypeOfClaim.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.TypeOfClaim}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {" "}
                      {fieldLabel.ClaimAmount}
                    </Label>
                    <Col sm="7">
                      <Input
                        name="ClaimAmount"
                        id="ClaimAmount"
                        value={values.ClaimAmount}
                        type="text"
                        className={
                          isError.ClaimAmount.length > 0
                            ? "is-invalid form-control"
                            : "form-control"
                        }
                        placeholder="Please Enter Claim Amount"
                        autoComplete="off"
                        autoFocus={true}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      />
                      {isError.ClaimAmount.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.ClaimAmount}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* ************** Remark **************  */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {" "}
                      {fieldLabel.Remark}
                    </Label>
                    <Col sm="7">
                      <Input
                        type="text"
                        name="Remark"
                        id="Remark"
                        placeholder="Please Enter Remark"
                        autoComplete="off"
                        value={values.Remark}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      />
                      {isError.Remark.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.Remark}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* ******* Claim Check By ***** &&& *********Credit Note status ********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimCheckBy}{" "}
                    </Label>
                    <Col sm="7">
                      <Select
                        name="ClaimCheckBy"
                        value={values.ClaimCheckBy}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        options={claimCheckByOption}
                        onChange={(hasSelect, evn) => {
                          onChangeSelect({ hasSelect, evn, state, setState });
                        }}
                      />
                      {isError.ClaimCheckBy.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.ClaimCheckBy}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup className=" row mt-2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.CreditNotestatus}{" "}
                    </Label>
                    <Col sm="7">
                      <Select
                        name="CreditNotestatus"
                        value={values.CreditNotestatus}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        options={creditNoteStatusOption}
                        onChange={(hasSelect, evn) => {
                          onChangeSelect({ hasSelect, evn, state, setState });
                        }}
                      />
                      {isError.CreditNotestatus.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.CreditNotestatus}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* ******* Credit Note No ***** &&& ********* Credit Note Date ********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {" "}
                      {fieldLabel.CreditNoteNo}
                    </Label>
                    <Col sm="7">
                      <Input
                        name="CreditNoteNo"
                        id="CreditNoteNo"
                        value={values.CreditNoteNo}
                        type="text"
                        className={
                          isError.CreditNoteNo.length > 0
                            ? "is-invalid form-control"
                            : "form-control"
                        }
                        placeholder="Please Enter Credit Note No."
                        autoComplete="off"
                        autoFocus={true}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      // style={{ width: "100%", height: "10px" }} // Adjust width and height as needed
                      />
                      {isError.CreditNoteNo.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.CreditNoteNo}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className="row  mt-n2">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.CreditNoteDate}{" "}
                    </Label>
                    <Col sm="7">
                      <C_DatePicker
                        name="CreditNoteDate"
                        value={values.CreditNoteDate}
                        onChange={CreditNoteDate_Onchange}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              {/* ******* Credit Note Amount ***** &&& ********* Credit Note Upload Date ********** */}
              <Row>
                <Col sm="6">
                  <FormGroup className=" row mt-n2 ">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {" "}
                      {fieldLabel.CreditNoteAmount}
                    </Label>
                    <Col sm="7">
                      <Input
                        name="CreditNoteAmount"
                        id="CreditNoteAmount"
                        value={values.CreditNoteAmount}
                        type="text"
                        className={
                          isError.CreditNoteAmount.length > 0
                            ? "is-invalid form-control"
                            : "form-control"
                        }
                        placeholder="Please Enter Credit Note Amount"
                        autoComplete="off"
                        autoFocus={true}
                        onChange={(event) => {
                          onChangeText({ event, state, setState });
                        }}
                      // style={{ width: "100%", height: "10px" }} // Adjust width and height as needed
                      />
                      {isError.CreditNoteAmount.length > 0 && (
                        <span className="text-danger f-8">
                          <small>{isError.CreditNoteAmount}</small>
                        </span>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className="row mt-n2">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {fieldLabel.ClaimSummaryDate}{" "}
                    </Label>
                    <Col sm="7">
                      <C_DatePicker
                        name="ClaimSummaryDate"
                        value={values.ClaimSummaryDate}
                        onChange={ClaimSummaryDate_Onchange}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm="10">
                  <FormGroup className="row mt-n2">
                    <Label
                      className="col-sm-1 p-2"
                      style={{ width: "115px", marginRight: "0.4cm" }}
                    >
                      {"Upload Credit Note"}
                    </Label>
                    <Col sm="6">
                      <div>
                        <div className="btn-group btn-group-example col-8 " role="group">
                          <Input
                            type="file"
                            className="form-control "
                            name="image"
                            id="fileInput"
                            multiple
                            accept=".jpg, .jpeg, .png ,.pdf"
                            onChange={(event) => { onchangeHandler(event, "ImageUpload") }}
                          />
                        </div>
                        {values.CreditNoteUpload !== null && pageMode === mode.edit && (
                          <div>
                            <p>Uploaded files:{values.CreditNoteUpload ? values.CreditNoteUpload.name : null}</p>
                            <ul>
                            </ul>
                          </div>
                        )}
                      </div>

                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <FormGroup>
              <Col>
                <SaveButton
                  pageMode={pageMode}
                  loading={saveBtnloading}
                  onClick={saveHandeller}
                  userAcc={userPageAccessState}
                  editCreatedBy={editCreatedBy}
                />
              </Col>
            </FormGroup>
          </form>
        </div>
      </React.Fragment>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
};

export default ClaimTrackingEntry;
