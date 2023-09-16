import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {

  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={8}></Col>
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
