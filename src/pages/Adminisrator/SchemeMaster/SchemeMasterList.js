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
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { Button, Col, Label, Modal, Row, Spinner } from "reactstrap";
import Dropzone from "react-dropzone";
import * as XLSX from 'xlsx';
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
const SchemeMasterList = () => {

  const dispatch = useDispatch();
  const [ModalOpen, setModalOpen] = useState({ Open: false, Data: null });
  const [borderStyle, setBorderStyle] = useState("2px dashed #ced4da");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validJsonData, setValidJsonData] = useState(null); // Store valid JSON data

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

  const { UploadBtnloading, deleteVoucherMsg, deleteVoucherLoading, UploadMsg } = reducers;


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
    dispatch(getSchemeList())
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
      dispatch(getSchemeList())
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


  const { pageField, goBtnLoading } = reducers
  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
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
