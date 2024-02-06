// ExcelDownloadButton.js

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Label, Card, CardBody } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { ExcelReportComponent } from "../../Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { useSelector } from "react-redux";

const ExcelDownloadButton = ({ }) => {
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [downListKey, setDownListKey] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const {
    pageHeading = '',
    excelBtnView,
    downBtnData,
    pageField
  } = useSelector(({ BreadcrumbReducer }) => ({ ...BreadcrumbReducer.breadcrumbDetail }))

  useEffect(() => {
    initializeDownListKey();
  }, [downBtnData]);

  const initializeDownListKey = () => {
    if (downBtnData.length > 0) {
      const defaultDownBtnArray = downBtnData[0]
        ? Object.keys(downBtnData[0]).map((key) => ({ [key]: true }))
        : [];
      setDownListKey(defaultDownBtnArray);
      const allValuesTrue = defaultDownBtnArray.every(
        (item) => Object.values(item)[0] === true
      );
      setSelectAll(allValuesTrue);
    }
  };

  const handleCheckboxChange = (index) => {
    setDownListKey((prevListKey) => {
      const updatedList = [...prevListKey];
      const key = Object.keys(updatedList[index])[0];
      updatedList[index][key] = !updatedList[index][key];
      updateSelectAllState(updatedList);
      return updatedList;
    });
  };

  const handleSelectAllChange = (e) => {
    setSelectAll((prevSelectAll) => !prevSelectAll);

    setDownListKey((prevListKey) => {
      const updatedList = prevListKey.map((item) => ({
        [Object.keys(item)[0]]: e.target.checked,
      }));
      return updatedList;
    });
  };

  const updateSelectAllState = (updatedList) => {
    const allValuesTrue = updatedList.every(
      (item) => Object.values(item)[0] === true
    );
    setSelectAll(allValuesTrue);
  };

  const ExcelCheckBox = React.memo(() => {
    const trueValues = downListKey.filter((item) => Object.values(item)[0]);
    return (
      <div className="row">
        <div className="col col-12">
          <div className="row">
            <div className="col col-12">
              <Input
                className="text-black checkbox-border-red"
                type="checkbox"
                id={`selectAllCheckbox`}
                checked={selectAll}
                onChange={(e) => handleSelectAllChange(e)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label
                className="form-label text-black"
                style={{ fontSize: "15px", color: "black", fontWeight: "bold" }}
              >
                {" "}
                Select All
              </Label>
            </div>
          </div>
        </div>
        <>
          {downListKey.map((item, index) => (
            <div className="row" key={index}>
              <div className="col col-12">
                <div className="row">
                  <div className="col col-12">
                    <Input
                      className="text-black checkbox-border-red"
                      type="checkbox"
                      id={`chckbox${index}`}
                      defaultChecked={trueValues.includes(item)}
                      onChange={() => handleCheckboxChange(index)}
                      name={index}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Label className="form-label text-black">
                      {" "}
                      {Object.keys(item)[0]}{" "}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    );
  });

  const DownloadInExcelButtonHanler = (event, values) => {
    let tableData = [];
    let object1 = {};

    const filteredValues = downListKey
      .filter((obj) => obj[Object.keys(obj)[0]])
      .map((obj) => Object.keys(obj)[0]);

    downBtnData.forEach((index1) => {
      filteredValues.forEach((index2) => {
        if (index1.hasOwnProperty(index2)) {
          object1[index2] = index1[index2];
        }
      });
      tableData.push(object1);
      object1 = {};
    });
    ExcelReportComponent({
      pageField,
      excelTableData: tableData,
      excelFileName: pageHeading,
      listExcelDownload: filteredValues,
    });
    setmodal_scroll(false);
  };

  return (
    <>
      {excelBtnView && !(downBtnData.length === 0) && (
        <div className="px-2" style={{ marginTop: "3px" }}>
          <Button
            type="button"
            title="Download List"
            style={{ padding: "2px", paddingInline: "5px" }}
            color="btn btn-sm btn-outline-primary"
            onClick={() => setmodal_scroll(true)}
          >
            <i className="bx bx-download font-size-14"></i>
          </Button>
        </div>
      )}

      <Modal
        isOpen={modal_scroll}
        toggle={() => setmodal_scroll(false)}
        scrollable={true}
      >
        <div >
          <div className="modal-header c_card_filter text-black" style={{ backgroundColor: "#cce6f6" }}>
            <h5 className="modal-title mt-0">{pageHeading}</h5>

            <button
              type="button"
              onClick={() => setmodal_scroll(false)}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              style={{ color: "black", fontWeight: "bold" }}
            >
            </button>
          </div>
          <div className="modal-body">
            <AvForm
              onValidSubmit={(event, values) => {
                DownloadInExcelButtonHanler(event, values);
              }}
            >
              <ExcelCheckBox />

                <div className="modal-footer">
                 
                  <button type="submit" className="btn btn-primary">
                    Download in Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setmodal_scroll(false)}
                  >
                    Cancel
                  </button>
                </div>
            </AvForm>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExcelDownloadButton;
