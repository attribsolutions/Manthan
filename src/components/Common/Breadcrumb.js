import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col } from "reactstrap"
import { Redirect, useHistory } from "react-router-dom";
import { Search } from "react-bootstrap-table2-toolkit";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbShow } from "../../store/Utilites/Breadcrumb/actions";

const Breadcrumb = props => {

  const { SearchBar } = Search;
  const history = useHistory();
  const dispatch = useDispatch();

  let Countsize = ''
  if (props.breadcrumbCount) { Countsize = props.breadcrumbCount; }
  const [IsRedirectNewButton, setIsRedirectNewButton] = useState(false);

  // New Button Handller
  const NewButtonHandeller = () => {
    setIsRedirectNewButton(true)
  }

  const { bredcrumbName, } = useSelector((state) => ({
    bredcrumbName: state.BreadcrumbReducer.bredcrumbName,
  }));

  // Onfocus Search Box
  useEffect(() => {
    if (!(props.breadcrumbCount === undefined)) {
      document.getElementById("search-bar-0").focus();
    }
    history.listen(location => dispatch(BreadcrumbShow('')));
  }, [])

  return (
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
                     {bredcrumbName.length > 0 ? <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary" style={{ paddingLeft: "7px" ,color:"#5156be" }} >&nbsp;/&nbsp;{bredcrumbName}</label>
                    : <></>}
                    {/* color:"#5156be" */}
                </Col>
              </Row>
          }

        </div>
      </Col>

      <Col md={Countsize.length < 10 ? 3 : Countsize.length < 25 ? 2 : 1}>  </Col>

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
      {(IsRedirectNewButton) ? <Redirect to={{ pathname: props.RedirctPath }} /> : null}
    </Row>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}
export default Breadcrumb
