import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import SchemeMaster from "./SchemeMaster";
import {
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
import { Col, Label, Modal, Row } from "reactstrap";
import Dropzone from "react-dropzone";
import * as XLSX from 'xlsx';
const SchemeMasterList = () => {

  const dispatch = useDispatch();
  const [ModalOpen, setModalOpen] = useState(false);
  const [borderStyle, setBorderStyle] = useState("2px dashed #ced4da");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [fileStatus, setFileStatus] = useState(null); // "valid" | "invalid" | null
  const [message, setMessage] = useState("");

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SchemeReducer.listBtnLoading,
      goBtnLoading: state.SchemeReducer.goBtnLoading,
      tableList: state.SchemeReducer.SchemeList,
      editData: state.SchemeReducer.editData,
      updateMsg: state.SchemeReducer.updateMsg,
      deleteMsg: state.SchemeReducer.deleteMsg,
      postMsg: state.SchemeReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  debugger

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

    setModalOpen(true);

  }

  const handleFile = (e) => {


    if (!uploadedFile) return;

    // ✅ Step 1: Check file type
    if (!uploadedFile.name.endsWith(".csv")) {
      setFileStatus("invalid");
      setMessage("Only CSV files are allowed.");
      return;
    }

    // ✅ Step 2: Read and parse file using XLSX
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const prefix = "PSA";
      const isValid = jsonData.slice(1).every(row =>
        row[0] && String(row[0]).startsWith(prefix)
      );

      if (isValid) {
        setFileStatus("valid");
        setMessage(`${uploadedFile.name} is valid File.`);
      } else {
        setFileStatus("invalid");
        setMessage(`Each value in the first column must start with '${prefix}'.`);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };


  function tog_backdrop() {

    setModalOpen(false);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }


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
        isOpen={ModalOpen}
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


            </Row>
            <Row>
              {fileStatus === "valid" ? <Col xs="auto">
                <button
                  className="btn btn-success"
                  onClick={
                    handleFile
                  }
                >
                  Upload
                </button>

              </Col>
                :
                <Col xs="auto">
                  <button
                    className="btn btn-primary"
                    onClick={
                      handleFile
                    }
                  >
                    Validate
                  </button>

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
