import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col } from "reactstrap"
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CustomSearchInput } from "../../store/Utilites/CustomSearchRedux/actions";

const Breadcrumb3 = props => {

    const dispatch = useDispatch();

    const [IsRedirectNewButton, setIsRedirectNewButton] = useState(false);

    // New Button Handller
    const NewButtonHandeller = () => {
        setIsRedirectNewButton(true)
    }
    function searchFunctionHandller(e) {
        dispatch(CustomSearchInput(e.target.value))
      }

    // Onfocus Search Box
    useEffect(() => {
        if (!(props.breadcrumbCount === undefined)) {
            //   document.getElementById("search-bar-0").focus();
        }
    }, [])

    return (
        <Row xs="12">
            <Col md={4}>
        <div className=" text-left">
          {
            props.IsButtonVissible ?
                <Row>
                <Col md={2}>
                  <button type="button" className="btn btn-success"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                    onClick={() => { NewButtonHandeller() }} >
                    New
                  </button>
               </Col>
                <Col md={10}>
                <h4 className="font-size-18 form-label" style={{marginTop:"6px"}}>{props.breadcrumbItem}</h4>
                </Col>
                </Row>
              :
              <React.Fragment>
                <h4 className="font-size-18  col-ls-6 col-form-label" style={{marginLeft:"6px"}}>{props.breadcrumbItem}</h4>
              </React.Fragment>
          }
         
        </div>
      </Col>
            
            <Col md={5}>
            </Col>
            <Col md={2} className="text-right">
                    <div className="search-box d-inline-block">
                        <div className="position-relative">
                            {
                                (props.IsButtonVissible || props.IsSearch === true) ?
                                <React.Fragment>
                                        <div clclassNameass="search-box d-inline-block">
                                            <div class="position-relative">
                                                    <span id="search-bar-0-label" className="sr-only">Search this table</span>
                                                    <input id="search-bar-0"
                                                        type="text"
                                                        aria-labelledby="search-bar-0-label"
                                                        className="form-control "
                                                        placeholder="Search"
                                                        onChange={(e) => { searchFunctionHandller(e) }}
                                                    />
                                                    <i class="bx bx-search-alt search-icon-search"></i>
                                           </div>
                                        </div>
                                    </React.Fragment>
                                    :
                                    <React.Fragment></React.Fragment>
                            }
                        </div>
                   
                </div>
            </Col>
            <Col md={1} className="text-right">
                {
                    !(props.breadcrumbCount === undefined) ?
                        <div className="bg-soft-success text-center text-danger external-event col-ls-6 col-form-label"
                        >
                            Count : &nbsp;(&nbsp; {props.breadcrumbCount}&nbsp;)
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

Breadcrumb3.propTypes = {
    breadcrumbItem: PropTypes.string,
    title: PropTypes.string
}
export default Breadcrumb3
