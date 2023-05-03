import React, { useEffect, useState } from "react"
import { Row, Modal, Button, } from "reactstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbReset } from "../../store/Utilites/Breadcrumb/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import * as XLSX from 'xlsx';

const BreadcrumbNew = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [modal_scroll, setmodal_scroll] = useState(false);
  const [downListKey, setDownListKey] = useState([]);

  const [trueValues, setTrueValues] = useState({});

  let { showCountlabel = '', bredcrumbItemName = '', breadcrumbDetail } = useSelector((state) => ({
    showCountlabel: state.BreadcrumbReducer.showCountlabel,
    bredcrumbItemName: state.BreadcrumbReducer.bredcrumbItemName,
    breadcrumbDetail: state.BreadcrumbReducer.breadcrumbDetail,

  }));

  const {
    newBtnView = true,
    excelBtnView = true,
    pageHeading = '',
    CountLabel = true,
    newBtnPath = "",
    pageMode = "",
    downBtnData = [],
    defaultDownBtnData = {}
  } = breadcrumbDetail;

  // console.log(downListKey)

  // useEffect(() => {
  //   downListKey.splice(0, 0, 'SelectAll')
  // }, [downListKey])

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const NewButtonHandeller = () => {
    history.push({
      pathname: newBtnPath,
      pageMode: pageMode
    })
  }

  useEffect(() => {
    dispatch(BreadcrumbReset())
  }, [history.location.pathname]);

  useEffect(() => {
    var keysValues = {}

    if (!(downBtnData === undefined)) {
    
      if ((downBtnData.length > 0)) {
        const propertyNames = Object.keys(downBtnData[0]);
        setDownListKey(propertyNames)

        keysValues = Object.keys(defaultDownBtnData).filter(k => defaultDownBtnData[k] === true)
        setTrueValues(keysValues)
      }
    }
  }, [downBtnData])

  const DownloadInExcelButtonHanler = (event, values) => {
  
    let list = []
    let object1 = {}
    var selectedValues = Object.keys(values);
    var filteredValues = selectedValues.filter(function (selectedValues) {
      return values[selectedValues]
    });
    downBtnData.map((index1) => {
      filteredValues.map((index2) => {
        if (index1.hasOwnProperty(index2)) {
          object1[index2] = index1[index2]
        }
      })
      list.push(object1)
      object1 = {}
    })
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Excel File.xlsx");
    setmodal_scroll(false)
  }

  // function OnChangeFunc(event, value, key) {
   
  //   var data = downListKey.map((i, key) => { return key })
  //   console.log(data)
  //   if (value === "SelectAll") {
  //     data.map((indx, key) => {
  //       document.getElementById(`chckbox${indx}`).checked = event
  //     })
  //   }
  // }

  function ExcelCheckBox() {
    const arrDiv = []

    downListKey.forEach((index, key) => {

      arrDiv.push(
        <div className="row" >
          <div className="col col-12"  >
            <Row>
              <div className="col col-12 " >
                <AvInput
                  className=" text-black checkbox-border-red"
                  type="checkbox"
                  id={`chckbox${key}`}
                  defaultChecked={trueValues.find((i) => {
                    return (index === i) ? true : false
                  })}
                  name={index}
                  // onChange={(e) => { OnChangeFunc(e.target.checked, index, key) }}
                />&nbsp;&nbsp;&nbsp;
                <label className="form-label text-black"> {index} </label>
              </div>
            </Row>
          </div>
        </div>
      )
    })
    return arrDiv
  }

  return (
    <React.Fragment>
      <header id="page-topbar1" style={{ zIndex: "1" }}  >
        <div className="navbar-header blur1" style={{ paddingRight: "-10px", zIndex: "-1" }}>
          <div className="d-flex" >
            <div className="navbar-brand-box" style={{ backgroundColor: "white" }} ></div>
            <div style={{ paddingLeft: "7px" }} >

              {
                newBtnView ?
                  <div >
                    <button type="button" className="btn btn-success"
                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                      onClick={NewButtonHandeller}>
                      New
                    </button>
                    <label className="font-size-18 form-label text-black " style={{ paddingLeft: "7px", }} >{pageHeading}</label>
                  </div>
                  :
                  <div>
                    <label className="font-size-18  col-ls-6 col-form-label text-black" style={{ marginLeft: "6px" }}>
                      {pageHeading}</label>
                    {(bredcrumbItemName.length > 0) ?
                      <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary"
                        style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbItemName}</label>
                      : null
                    }
                  </div>
              }
            </div>
          </div>

          <div className=" d-flex  justify-content-end"  >
            {excelBtnView ?
              <div className="px-2 " style={{ marginTop: "7px" }}>
                <Button
                  type="button"
                  title="Download List"
                  color="btn btn-sm btn-outline-primary "
                  onClick={() => { tog_scroll(); }}
                  data-toggle="modal"
                >
                  <i className="bx bx-download font-size-14" ></i>
                </Button>
              </div>
              : null}
            {
              (((CountLabel) && (showCountlabel.length > 0))) ?
                <div className="bg-dark text-center text-light external-event col-form-label  border border-Success rounded-2"
                  style={{ width: "100%" }}>
                  <samp className="px-2 ">{showCountlabel}</samp>
                </div>
                :
                null
            }
          </div>


        </div>
      </header>
      <Modal
        isOpen={modal_scroll}
        toggle={() => {
          tog_scroll();
        }}
        scrollable={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">List</h5>

          <button
            type="button"
            onClick={() => setmodal_scroll(false)}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <AvForm onValidSubmit={(event, values) => { DownloadInExcelButtonHanler(event, values); }}>
            <ExcelCheckBox />

            <div className="modal-body">
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setmodal_scroll(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" >
                  Download in Excel
                </button>
              </div>
            </div>
          </AvForm>
        </div>
      </Modal>
    </React.Fragment>
  )

}


export default BreadcrumbNew
