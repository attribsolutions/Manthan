import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"
import { loginCompanyName, loginIsSCMCompany, loginUserDetails } from "../Common/CommonFunction"

const Footer = () => {

  let FooterDetails = loginUserDetails()
  let CompanyName = loginCompanyName()
  let IsSCMCompany = loginIsSCMCompany() === 1 ? "IsSCM" : "Non-SCM"

  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={2} >
              <span className="text-black">Party : </span>
              <span className="pl-4 text-primary">{FooterDetails.PartyName}</span>
            </Col>
            <Col md={2}><span className="text-black">Role : </span>
              <span className="pl-4 text-primary">{FooterDetails.RoleName}</span>
            </Col>
            <Col md={4} ><span className="text-black">Company : </span>
              <span className="pl-4 text-primary">{CompanyName}&nbsp;&nbsp;({IsSCMCompany})</span>
            </Col>

            <Col md={4} >
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by
                <Link to="#" className="ms-1 text-decoration-underline">
                  AttribSolution
                </Link>
              </div></Col>

          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
