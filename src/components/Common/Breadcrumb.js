import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col } from "reactstrap"
import { Redirect } from "react-router-dom";
import { Search } from "react-bootstrap-table2-toolkit";

const Breadcrumb = props => {

  const { SearchBar } = Search;

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
    <Row style={{ Color: "F7F8F4" }}>
      <Col xs="3">
        <table>
          <tr>
            <td>
              {props.IsButtonVissible ? <button type="button" className="btn btn-success"
                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                onClick={() => { NewButtonHandeller() }} >
                New
              </button> :
                <></>}
            </td>
            <td>
              <h4 className="mb-2 font-size-18 " style={{ marginTop: "5%", paddingLeft: "5px" }}>{props.breadcrumbItem}</h4>
            </td>
          </tr>
        </table>
      </Col>
      <Col sm="7">
        <div className="search-box d-inline-block">
          <div className="position-relative">
            {(props.IsButtonVissible) ? <><SearchBar {...props.SearchProps} />
              <i className="bx bx-search-alt search-icon-search" />
            </> : <></>
            }

          </div>
        </div>
      </Col>
      <Col xs="2">
        {
          !(props.breadcrumbCount === undefined) ?
            <div className="bg-soft-success text-center text-danger external-event "
              style={{ marginTop: "5%", marginLeft: "20%", marginRight: "20%" }}
            >
              Count : &nbsp;(&nbsp; {props.breadcrumbCount}&nbsp;)
            </div>
            :
            <></>
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
