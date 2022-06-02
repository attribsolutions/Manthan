import React from 'react'
import { Input } from 'reactstrap'

export default function ValidationTest() {
  return (
    <React.Fragment>
            {/* <div className="page-content">
                <MetaTags>
                    <title>Page Master| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <Form
                                    >
                                       
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Name
                                                </Label>
                                                <Col sm={4}>
                                                    <Input name="Name" id="txtName" value={""} type="text"
                                                        placeholder=" Please Enter Name "
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter a Name' },
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                   
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Discription
                                                </Label>
                                                <Col sm={4}>
                                                    <Input name="Discription" value={"EditData.Description"} type="text"
                                                        placeholder=" Please Enter Discription "
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                     
                                       

                                
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    DisplayIndex
                                                </Label>
                                                <Col sm={4}>
                                                    <Input name="DisplayIndex" value={"EditData.DisplayIndex"} type="text"
                                                        autoComplete='off' placeholder=" Please Enter DisplayIndex" validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Please enter a Display Index ' },
                                                        }} />
                                                </Col>
                                            </Row>
                                     
                                         
                                            

                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                   
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        
                                                </div>
                                            </Col>{" "}
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div> */}
        </React.Fragment>
  )
}
