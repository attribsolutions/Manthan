import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import SchemeMaster from "./SchemeMaster";
import {
  DeleteGiftVouchersByScheme,
  DeleteGiftVouchersBySchemeSuccess,
  Upload_Voucher,
  Upload_Voucher_Success,
  deleteSchemelistSuccess,
  delete_SchemeList_ID,
  editSchemeID,
  getSchemeList,
  saveSchemeMaster_Success,
  updateSchemeIDSuccess
} from "../../../store/Administrator/SchemeMasterRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";

import { Button, Col, FormGroup, Label, Modal, Row, Spinner } from "reactstrap";
import Dropzone from "react-dropzone";
import * as XLSX from 'xlsx';
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";

const SchemeMasterList = () => {





  const dispatch = useDispatch();
  const IsSCMCompany = _cfunc.loginIsSCMCompany()



  const [ModalOpen, setModalOpen] = useState({ Open: false, Data: null });
  const [borderStyle, setBorderStyle] = useState("2px dashed #ced4da");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validJsonData, setValidJsonData] = useState(null); // Store valid JSON data
  const [hederFilters, setHederFilters] = useState({ fromdate: _cfunc.currentDate_ymd, todate: _cfunc.currentDate_ymd })
  const { fromdate, todate, } = hederFilters;
  const [fileStatus, setFileStatus] = useState(null); // "valid" | "invalid" | null
  const [message, setMessage] = useState("");

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SchemeReducer.listBtnLoading,
      goBtnLoading: state.SchemeReducer.goBtnLoading,
      tableList: state.SchemeReducer.SchemeList,
      UploadBtnloading: state.SchemeReducer.UploadBtnloading,
      deleteVoucherMsg: state.SchemeReducer.deleteVoucherMsg,
      editData: state.SchemeReducer.editData,
      deleteVoucherLoading: state.SchemeReducer.deleteVoucherLoading,
      updateMsg: state.SchemeReducer.updateMsg,
      UploadMsg: state.SchemeReducer.UploadMsg,
      deleteMsg: state.SchemeReducer.deleteMsg,
      postMsg: state.SchemeReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { UploadBtnloading, deleteVoucherMsg, deleteVoucherLoading, UploadMsg, listBtnLoading } = reducers;


  const action = {
    getList: getSchemeList,
    editId: editSchemeID,
    deleteId: delete_SchemeList_ID,
    postSucc: saveSchemeMaster_Success,
    updateSucc: updateSchemeIDSuccess,
    deleteSucc: deleteSchemelistSuccess
  }

  useEffect(() => {
    const page_Id = pageId.SCHEME_MASTER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    goButtonHandler();
  }, []);


  function upBtnFunc(config) {
    setModalOpen({ Open: true, Data: config.rowData });
  }

  const handleFile = (rowData) => {
    if (!uploadedFile) return;

    // ✅ Step 1: Check file type
    if (!uploadedFile.name.endsWith(".csv") && !uploadedFile.name.endsWith(".xlsx")) {
      setFileStatus("invalid");
      setMessage("Only CSV or Excel files are allowed.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);

      // ✅ Step 2: Parse Excel file
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // ✅ Convert to JSON (object format based on headers)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // defval: "" fills blank cells with empty string


      // ✅ Optional: Validate based on prefix
      const prefix = rowData?.QRPrefix;
      const isValid = jsonData.every(row =>
        row[Object.keys(row)[0]] && String(row[Object.keys(row)[0]]).startsWith(prefix)
      );

      if (isValid) {
        setFileStatus("valid");
        setMessage(`${uploadedFile.name} is a valid file.`);
        setValidJsonData(jsonData); // Store valid JSON data for further processing

      } else {
        setFileStatus("invalid");
        setMessage(`Each value in the first column must start with '${prefix}'.`);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const uploadFile = () => {

    const jsonBody = JSON.stringify({
      Scheme: ModalOpen.Data.id,
      Data: validJsonData,
    })
    dispatch(Upload_Voucher({ jsonBody }));
  }


  function tog_backdrop() {
    setModalOpen({ Open: false, Data: null });
    setUploadedFile(null);
    setBorderStyle("2px dashed #ced4da");
    setFileStatus(null);
    setMessage("");
    setValidJsonData(null); // Reset valid JSON data
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }


  useEffect(async () => {

    if ((deleteVoucherMsg.Status === true) && (deleteVoucherMsg.StatusCode === 200)) {

      dispatch(DeleteGiftVouchersBySchemeSuccess({ Status: false }));
      customAlert({
        Type: 1,
        Message: JSON.stringify(deleteVoucherMsg.Message),
      })
    } else if (deleteVoucherMsg.Status === true) {
      dispatch(DeleteGiftVouchersBySchemeSuccess({ Status: false }));
      customAlert({
        Type: 4,
        Message: JSON.stringify(deleteVoucherMsg.Message),
      })
    }
  }, [deleteVoucherMsg,]);



  useEffect(async () => {

    if ((UploadMsg.Status === true) && (UploadMsg.StatusCode === 200)) {
      dispatch(Upload_Voucher_Success({ Status: false }));
      setModalOpen({ Open: false, Data: null });
      customAlert({
        Type: 1,
        Message: JSON.stringify(UploadMsg.Message),
      })
    } else if (UploadMsg.Status === true) {
      dispatch(Upload_Voucher_Success({ Status: false }));
      setModalOpen({ Open: false, Data: null });
      customAlert({
        Type: 4,
        Message: JSON.stringify(UploadMsg.Message),
      })
    }
  }, [UploadMsg,]);

  function todateOnchange(e, date) {
    let newObj = { ...hederFilters }
    newObj.todate = date
    setHederFilters(newObj)
  }

  function fromdateOnchange(e, date) {
    let newObj = { ...hederFilters }
    newObj.fromdate = date
    setHederFilters(newObj)
  }

  const goButtonHandler = () => {
    let config = {};
    debugger
    const jsonBody = JSON.stringify({
      FromDate: fromdate,
      ToDate: todate,
    });
    config["jsonBody"] = jsonBody;

    dispatch(getSchemeList(config));
  };


  const { pageField, goBtnLoading } = reducers
  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />

      <>
        <div className="px-2   c_card_filter text-black" >
          <div className="row" >
            <Col sm="3" className="">
              <FormGroup className="mb-2 row mt-3 " >
                <Label className="col-sm-5 p-2"
                  style={{ width: "83px" }}>FromDate</Label>
                <Col sm="7">
                  <C_DatePicker
                    name='FromDate'
                    value={fromdate}
                    onChange={fromdateOnchange}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col sm="3" className="">
              <FormGroup className="mb-2 row mt-3 " >
                <Label className="col-sm-5 p-2"
                  style={{ width: "65px" }}>ToDate</Label>
                <Col sm="7">
                  <C_DatePicker

                    options={{
                      minDate: (_cfunc.disablePriviousTodate({ fromDate: fromdate })),
                      maxDate: "today",
                      altInput: true,
                      altFormat: "d-m-Y",
                      dateFormat: "Y-m-d",
                    }}
                    value={_cfunc.ToDate({ FromDate: fromdate, Todate: todate })}
                    name="ToDate"
                    onChange={todateOnchange}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col sm="5" ></Col>

            <Col sm="1" className="mt-3 mb-2 ">
              <Go_Button
                // loading={listBtnLoading}
                onClick={goButtonHandler}
                loading={goBtnLoading}
             
              />
            </Col>
          </div>
        </div>
      </>
      {
        (pageField) &&
        <CommonPurchaseList
          action={action}
          reducers={reducers}
          showBreadcrumb={false}
          upBtnFunc={upBtnFunc}
          MasterModal={SchemeMaster}
          masterPath={url.SCHEME_MASTER}
          newBtnPath={url.SCHEME_MASTER}
          ButtonMsgLable={"Scheme"}
          deleteName={"SchemeName"}
          goButnFunc={goButtonHandler}
        />
      }
      <Modal
        isOpen={ModalOpen.Open}
        toggle={() => {
          tog_backdrop()
        }}
        className="modal-dialog-centered"
      >
        <div
          className=""
          style={{ width: "150%", margin: "auto" }}
        >
          <div className="p-4 bg-light rounded shadow-sm">
            <h3 className="mb-3 text-center">Upload Voucher</h3>
            <hr />
            <Row className="mb-4">
              <Col>
                <div className="bg-white p-3 rounded shadow-sm border mt-3">
                  <h6 className="text-primary mb-2">Previous Voucher Detail</h6>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">

                    {/* Voucher counts displayed horizontally with spacing */}
                    <div className="d-flex gap-4 flex-wrap">
                      <div><strong>Total:</strong> {ModalOpen?.Data?.TotalVoucherCodeCount}</div>
                      <div>
                        <strong>Active:</strong>{" "}
                        <span className="text-success">{ModalOpen?.Data?.ActiveVoucherCodeCount}</span>
                      </div>
                      <div>
                        <strong>Inactive:</strong>{" "}
                        <span className="text-danger">{ModalOpen?.Data?.InactiveVoucherCodeCount}</span>
                      </div>
                    </div>

                    {/* Delete button aligned to the right */}


                    <Button
                      className="btn btn-sm btn-danger mt-2 mt-md-0 d-flex justify-content-center align-items-center"
                      onClick={() => {
                        dispatch(DeleteGiftVouchersByScheme({ deleteId: ModalOpen?.Data?.id }));
                      }}
                      disabled={deleteVoucherLoading}
                      style={{ width: '80px' }} // Optional: fixes button width to prevent resizing
                    >
                      {deleteVoucherLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="invisible ms-xxl-n5">Delete</span> {/* Keeps spacing and width */}
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>


                  </div>
                </div>
              </Col>
            </Row>


            <Row className="mb-4">
              <Col>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    setUploadedFile(file);
                    setBorderStyle("3px dotted green");
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      style={{
                        border: borderStyle,
                        padding: '30px',
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        transition: 'border 0.3s ease'
                      }}
                    >
                      <input {...getInputProps()} />
                      <i className="display-4 text-muted bx bxs-cloud-upload mb-3" />
                      <h5 className="text-muted"> {uploadedFile ? uploadedFile.name : "Drop files here or click to upload."}            </h5>
                    </div>
                  )}
                </Dropzone>
              </Col>
            </Row>

            <Row>
              {fileStatus === "valid" ? <Col xs="auto">
                <Button className="btn btn-success" onClick={uploadFile} disabled={UploadBtnloading}>
                  {UploadBtnloading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="invisible ms-xxl-n5">Upload</span> {/* Keeps spacing and width */}

                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>

              </Col>
                :
                <Col xs="auto">
                  <Button
                    className="btn btn-primary"
                    onClick={() => {
                      handleFile(ModalOpen.Data)
                    }}
                  >
                    Validate
                  </Button>

                </Col>}


              <Col className="col">

                <div className="bg-white py-xxl-1 rounded shadow-sm" style={{ height: "32px" }}>
                  {fileStatus === "valid" && (
                    <>
                      {message?.split('\n').map((msg, index) => (
                        <li key={index} className="text-success d-flex align-items-start">
                          <i className="mdi mdi-check-decagram text-success me-2 font-size-16  px-1"></i>
                          <span>{msg}</span>
                        </li>
                      ))}
                    </>
                  )}

                  {fileStatus === "invalid" && (
                    <>
                      {message?.split('\n').map((msg, index) => (
                        <li key={index} className="text-danger d-flex align-items-start ">
                          <i className="mdi mdi-close-circle text-danger me-2 font-size-16 px-1"></i>
                          <span>{msg}</span>
                        </li>
                      ))}
                    </>

                  )}
                </div>

              </Col>


            </Row>
          </div>
        </div>




      </Modal>
    </React.Fragment>
  )
}

export default SchemeMasterList;
