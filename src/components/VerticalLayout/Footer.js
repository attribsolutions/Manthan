import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  let user
  try {
    user = JSON.parse(localStorage.getItem("roleId"))
  } catch (e) {

  }
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row style={{ height: "1cm" }}>
            <Col md={6}>{new Date().getFullYear()} © FoodERP  <samp className="pl-4 text-primary">
              <samp className="text-black">Party :</samp>
              {user.PartyName}</samp></Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by
                <Link to="#" className="ms-1 text-decoration-underline">
                  AttribSolution
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
