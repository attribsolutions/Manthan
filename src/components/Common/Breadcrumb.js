import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col, Modal, Table, Button, } from "reactstrap"
import { Redirect, useHistory } from "react-router-dom";
import { Search } from "react-bootstrap-table2-toolkit";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbShow } from "../../store/Utilites/Breadcrumb/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import * as XLSX from 'xlsx';

const Breadcrumb = props => {

  const { SearchBar } = Search;
  const dispatch = useDispatch();
  const history = useHistory();
  const { showCount = false } = props


  // for Excel Download
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [ListData, setListData] = useState([]);

  const {
    bredcrumbName = '',
    filterSize,
    searchProps,
    RoleAccessModifiedinSingleArray
  } = useSelector((state) => ({
    bredcrumbName: state.BreadcrumbReducer.bredcrumbName,
    filterSize: state.BreadcrumbReducer.filterSize,
    searchProps: state.BreadcrumbReducer.searchProps,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

  }));

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  
  const [IsRedirectNewButton, setIsRedirectNewButton] = useState(false);

  // New Button Handller
  const NewButtonHandeller = () => {

    let pathName = history.location.pathname

    let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
      return (`/${inx.ActualPagePath}` === pathName)
    })
    let listPagePath = RoleAccessModifiedinSingleArray.find((inx) => {
      return (inx.id === userAcc.RelatedPageID)
    })
    if (listPagePath === undefined) {
      return
    }
    //  if (listPagePath.RoleAccess_IsShowOnMenu) {
    history.push({
      pathname: `/${listPagePath.ActualPagePath}`,
    })
    // }else{
    //   setIsRedirectNewButton(true)
    // }


  }

  // Onfocus Search Box
  useEffect(() => {
    // document.getElementById("search-bar-0").focus();
    
    if (!(props.IsSearchVissible === undefined)) {
    }
    history.listen(location => dispatch(BreadcrumbShow('')));
  }, [history])


  useEffect(() => {
    if (!(props.ExcelData === undefined)) {
      if ((props.ExcelData.length > 0)) {
        // object to array conversion
        const propertyNames = Object.keys(props.ExcelData[0]);
        setListData(propertyNames)
      }
    }
  }, [props.ExcelData])

  const DownloadInExcelButtonHanler = (event, values) => {
    debugger
    var list = []
    var object1 = {}
    var selectedValues = Object.keys(values);
    var filteredValues = selectedValues.filter(function (selectedValues) {
      return values[selectedValues]
    });

    props.ExcelData.map((index1) => {
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
  }


  const handleChange = (e) => {
    var chek = document.getElementById("checkAll")
    if (chek) {
      for (var i = 0; i < ListData.length; i++) {
        document.getElementById(`chckbox${i}`).checked = true
      }
    }
    else {
      for (var i = 0; i < ListData.length; i++) {
        document.getElementById(`chckbox${i}`).checked = false
      }
    }
  };


  return (
    <React.Fragment>
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
          <AvForm onValidSubmit={(e, v) => { DownloadInExcelButtonHanler(e, v); }}>
            <div className="form-check">
              <input
                id="checkAll"
                type="checkbox"
                className="form-check-input"
                onChange={() => { handleChange() }}
              />
              <label className="form-label text-black">All Select</label>
            </div>

            {ListData.map((index, key) => {
              return <>
                <div className="row" >
                  <div className="col col-12"  >
                    <Row>
                      <div className="col col-12 " >
                        <AvInput
                          className=" text-black checkbox-border-red"
                          type="checkbox"
                          id={`chckbox${key}`}
                          name={index}
                          checked={key?.isChecked || false}
                          onChange={() => { handleChange() }}
                        />&nbsp;&nbsp;&nbsp;
                        <label className="form-label text-black"> {index} </label>
                      </div>
                    </Row>
                  </div>
                </div>
              </>
            })}

            <div className="modal-body">
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setmodal_scroll(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Download in Excel
                </button>
              </div>
            </div>
          </AvForm>
        </div>
      </Modal>

      <Row style={{ Color: "F7F8F4", marginTop: "-5px", marginBottom: "7px" }}>
        <Col md={6}>
          <div className="mb-1 text-left">
            {
              props.IsButtonVissible ?
                <Row>
                  <Col md={12}>
                    <button type="button" className="btn btn-success"
                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                      onClick={() => { NewButtonHandeller() }}>
                      New
                    </button>

                    <label className="font-size-18 form-label text-black " style={{ paddingLeft: "7px" }} >{props.breadcrumbItem}</label>
                    {/* {bredcrumbName.length > 0 ? <label className="font-size-24 form-label  text-secondary" style={{ paddingLeft: "7px" }}>&nbsp;/&nbsp;{bredcrumbName}</label>
                    : <></>} */}
                  </Col>
                </Row>
                :
                <Row>
                  <Col md={12}>
                    <label className="font-size-20  col-ls-6 col-form-label text-black" style={{ marginLeft: "6px" }}>{props.breadcrumbItem}</label>
                    {/* {bredcrumbName.length > 0 ? <label className="font-size-24 form-label  text-nowrap bd-highlight text-secondary" style={{ paddingLeft: "7px" }} >&nbsp;/ <kbd className="bg-light text-secondary">{bredcrumbName}</kbd></label>
                    : <></>} */}

                   
                    {( bredcrumbName.length > 0 )?
                      <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary"
                        style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbName}</label>
                      : <></>
                    }
                  </Col>
                </Row>
            }
          </div>
        </Col>

        <Col md={filterSize.length < 10 ? 3 : filterSize.length < 25 ? 2 : 1}
          className='text-end'>

          {props.isExcelButtonVisible === true ?
            <>
              <div>
                <Button
                  type="button"
                  title="Download List"
                  color="btn btn-sm btn-outline-primary mt-1"
                  onClick={() => {
                    tog_scroll();
                  }}
                  data-toggle="modal"
                >
                  <i className="bx bx-download font-size-14" ></i>
                </Button>
              </div>
            </> : <></>}
        </Col>

        <Col sm={2}>
          <div className="search-box d-inline-block">
            <div className="position-relative">
              {

                (props.IsSearchVissible)
                  ?
                  <React.Fragment><SearchBar {...props.SearchProps} />
                    <i className="bx bx-search-alt search-icon-search" />
                  </React.Fragment>
                  :
                  <React.Fragment></React.Fragment>
              }
            </div>
          </div>
        </Col>


        <Col md={filterSize.length < 10 ? 1 : filterSize.length < 25 ? 2 : 3} className="text-right col-md-2 px-0 justify-content-end">

          {
            (showCount)
              ?
              <div className="bg-dark text-center text-light external-event  col-form-label  border border-Success rounded-2" style={{ width: "100%" }}>
                {filterSize}
              </div>
              :
              <React.Fragment></React.Fragment>
          }
        </Col>
        {/* Redirct To master Component  */}
        {(IsRedirectNewButton) ? <Redirect to={{ pathname: props.RedirctPath, state: { fromDashboardAccess: true, label: props.userPageAccess } }} /> : null}
      </Row>
    </React.Fragment>
  )
}
Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}
export default Breadcrumb;
