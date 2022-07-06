import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col } from "reactstrap"
import { Redirect } from "react-router-dom";
import { Search } from "react-bootstrap-table2-toolkit";

const Breadcrumb = props => {

  const { SearchBar } = Search;
 let Countsize='' 
 if(props.breadcrumbCount){ Countsize=props.breadcrumbCount;}
  const [IsRedirectNewButton, setIsRedirectNewButton] = useState(false);

  // New Button Handller
  const NewButtonHandeller = () => {
    setIsRedirectNewButton(true)
  }

  // Onfocus Search Box
  useEffect(() => {
    if (!(props.breadcrumbCount === undefined)) {
      document.getElementById("search-bar-0").focus();
    }
  }, [])

  return (
    <Row style={{ Color: "F7F8F4", marginTop: "-5px", marginBottom: "7px" }}>
      <Col md={4}>
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

                  <label className="font-size-18 form-label " style={{ paddingLeft: "7px" }} >{props.breadcrumbItem}</label>
                </Col>
              </Row>
              :
              <Row>
                <Col md={12}>
                  <label className="font-size-18  col-ls-6 col-form-label" style={{ marginLeft: "6px" }}>{props.breadcrumbItem}</label>

                </Col>
              </Row>
          }

        </div>
      </Col>
      
      <Col md={Countsize.length < 10 ? 5 : Countsize.length < 25 ? 4 : 3}>  </Col>

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
