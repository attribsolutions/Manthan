import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col, Button, Label, Modal, Card, InputGroup } from "reactstrap"
import { Redirect, useHistory } from "react-router-dom";
import { Search } from "react-bootstrap-table2-toolkit";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbShow } from "../../store/Utilites/Breadcrumb/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import * as XLSX from 'xlsx';

const Breadcrumb = props => {

  const { SearchBar } = Search;
  const history = useHistory();

  const dispatch = useDispatch();
  
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [ListData, setListData] = useState([]);
  
  const { bredcrumbName, RoleAccessModifiedinSingleArray} = useSelector((state) => ({
    bredcrumbName: state.BreadcrumbReducer.bredcrumbName,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

  }));

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  let Countsize = ''
  if (props.breadcrumbCount) { Countsize = props.breadcrumbCount; }
  const [IsRedirectNewButton, setIsRedirectNewButton] = useState(false);

  // New Button Handller
  const NewButtonHandeller = () => {
debugger
    let RelatedPageid=0
    const userPageAccess = history.location.state

   if (!(userPageAccess===undefined)) {
    RelatedPageid=userPageAccess.UserDetails.RelatedPageID
   }

   const found=RoleAccessModifiedinSingleArray.find((element)=>{
     return element.id===RelatedPageid
   })
   
    history.push({
      pathname: props.RedirctPath,
      state: {fromDashboardAccess: true,UserDetails:found}
    })

  }

  // Onfocus Search Box
  useEffect(() => {
    if (!(props.breadcrumbCount === undefined)) {
      document.getElementById("search-bar-0").focus();
    }
    history.listen(location => dispatch(BreadcrumbShow('')));
  }, [])


  useEffect(() => {
    if (!(props.ExcelData === undefined)) {
      if ((props.ExcelData.length > 0)) {
        // object to array conversion
        const propertyNames = Object.keys(props.ExcelData[0]);
        setListData(propertyNames)
      }
    }
  }, [props.ExcelData])

  var list = []
  var object1 = {}
  const DownloadInExcelButtonHanler = (event, values) => {
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
            {ListData.map((index) => {

              return <>
                <div className="row">
                  <div className="col col-12">
                    <Row>
                      <div className="col col-6 col col-6" >
                        <AvInput className=" text-black checkbox-border-red " type="checkbox" name={index} />&nbsp;&nbsp;&nbsp;
                        <label className="form-label text-black"> {index} </label>
                      </div>
                      {/* <div className="col col-6 bg-info" >
                        <AvInput className=" text-black checkbox-border-red" type="checkbox" name={index} />&nbsp;&nbsp;&nbsp;
                        <label className="form-label text-black"> {index} </label>
                      </div> */}
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
                  <Col md={12}  >
                    <button type="button" className="btn btn-success"
                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                      onClick={() => { NewButtonHandeller() }} >
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
                    {bredcrumbName.length > 0 ? <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary" style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbName}</label>
                      : <></>}
                    {/* color:"#5156be" */}
                  </Col>
                </Row>
            }
          </div>
        </Col>

        <Col md={Countsize.length < 10 ? 3 : Countsize.length < 25 ? 2 : 1}
          className='text-end'>

          {props.isExcelButtonVisible === true ?
            <>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm mt-1 font-size-16  "
                  onClick={() => {
                    tog_scroll();
                  }}
                  data-toggle="modal"
                >
                  Download   {/* <i className="bx bx-download text-danger font-size-14" ></i> */}
                </button>
              </div>
            </> : <></>}
        </Col>

        <Col sm={2}>
          <div className="search-box d-inline-block">
            <div className="position-relative">
              {
                (props.IsButtonVissible)
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
        <Col md={Countsize.length < 10 ? 1 : Countsize.length < 25 ? 2 : 3} className="text-right" >
          {
            !(props.breadcrumbCount === undefined)
              ?
              <div className="bg-dark text-center text-light external-event  col-form-label  border border-Success rounded-2" style={{ width: "100%" }}>
                {props.breadcrumbCount}
              </div>
              :
              <React.Fragment></React.Fragment>
          }
        </Col>
        {/* Redirct To master Component  */}
        {(IsRedirectNewButton) ? <Redirect to={{ pathname: props.RedirctPath ,state: {fromDashboardAccess: true,label:props.userPageAccess}}}/> : null}
      </Row>
    </React.Fragment>
  )
}
Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}
export default Breadcrumb
