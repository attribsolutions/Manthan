import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"
import { loginUserDetails } from "../Common/CommonFunction"

const Footer = () => {

  let FooterDetails = loginUserDetails()

  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row style={{ height: "1cm" }}>
            {/* <Col md={6}>{new Date().getFullYear()} © FoodERP  <samp className="pl-4 text-primary">
              <samp className="text-black">Party :</samp>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

              {FooterDetails.PartyName}</samp></Col>
            <samp className="text-black">Role :</samp>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by
                <Link to="#" className="ms-1 text-decoration-underline">
                  AttribSolution
                </Link>
              </div>
            </Col> */}
            <Col md={2} >{new Date().getFullYear()} © FoodERP </Col>
            <Col md={2} >
              <span className="text-black">Party : </span>
              <span className="pl-4 text-primary">{FooterDetails.PartyName}</span>
            </Col>
            <Col md={2}><span className="text-black">Role : </span>
              <span className="pl-4 text-primary">{FooterDetails.RoleName}</span>
            </Col>
            <Col md={2} ><span className="text-black">Company : </span>
              <span className="pl-4 text-primary">{FooterDetails.CompanyName}</span>
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
