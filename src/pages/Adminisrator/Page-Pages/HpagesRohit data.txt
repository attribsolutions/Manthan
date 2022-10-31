<React.Fragment>
<div className="page-content" style={{ marginTop: IsEditModeSaSS }}>
    <Breadcrumbs breadcrumbItem={"Page Master"} />
    <Container fluid>
        <Card>
            <Row>
                <Col lg={12}>
                    <Card >
                        <CardHeader>
                            <h4 className="card-title">React Validation - Normal</h4>
                            <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                        </CardHeader>

                        <CardBody>
                            <AvForm
                                onValidSubmit={(e, v) => {
                                    handleValidSubmit(e, v);
                                }}
                                ref={formRef}
                            >
                                <Row>
                                    <Card >
                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                            <Row >

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                        <AvField name="Name" id="txtName" value={EditData.Name}
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please enter your Name...!' },
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>
                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Email </Label>
                                                        <AvField name="email"
                                                            id="email"
                                                            type="email"
                                                            value={EditData.email}
                                                            placeholder="Enter your EmailID "
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter your EmailID' },
                                                                tel: {
                                                                    pattern: /\S+@\S+\.\S+/
                                                                }
                                                            }}

                                                        />

                                                    </FormGroup>
                                                </Col>
                                                <Col md="1">  </Col>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">MobileNo </Label>
                                                        <AvField name="Mobile" type="tel"
                                                            value={EditData.Mobile}
                                                            placeholder="+91 "
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                                                                tel: {
                                                                    pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                                                                }
                                                            }}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                        </CardBody>
                                    </Card>
                                </Row>

                                {/* <Row>
                                    <Card >
                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>



                                            <Row>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">DesignationID </Label>
                                                        <Select
                                                        // value={DesignationIDselect}
                                                        // options={DesignationIDValues}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="1">  </Col>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">working_hours </Label>
                                                        <AvField name="working_hours" value={EditData.working_hours}
                                                            type="number"
                                                            placeholder="Please Enter WorkingHours"
                                                            autoComplete='off'
                                                            validate={{
                                                                number: true,
                                                                required: { value: true, errorMessage: '*WorkingHours is Required' },

                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Row> */}

                                <Row>
                                    <Card >
                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                            <Row className="mb-4">

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Module</Label>
                                                        <Select
                                                            value={selectModule}
                                                            options={optionModule}
                                                            autoComplete='off'
                                                            onChange={(e) => { HModuleSelectOnChangeHandller(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>
                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Page Type </Label>
                                                        <Select
                                                            value={selectPageList}
                                                            options={optionPageList}
                                                            autoComplete='off'
                                                            onChange={(e) => { PageList_SelectOnChangeHandller(e) }}
                                                        />

                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>
                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Page List </Label>
                                                        <Select
                                                            value={selectPageList}
                                                            options={optionPageList}
                                                            autoComplete='off'
                                                            onChange={(e) => { PageList_SelectOnChangeHandller(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">DisplayIndex</Label>
                                                        <AvField name="DisplayIndex" value={EditData.DisplayIndex} type="number"
                                                            autoComplete='off'
                                                            placeholder=" Please Enter DisplayIndex" validate={{
                                                                number: true,
                                                                required: { value: true, errorMessage: 'Please enter a Display Index only 2 digit ' },
                                                                tel: {
                                                                    pattern: /^\d{1,2}$/
                                                                }
                                                            }} />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>
                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">PagePath</Label>
                                                        <AvField name="ActualPagePath" value={EditData.ActualPagePath} type="text"
                                                            placeholder="Please Enter Actual Page Path"
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter Actual Page Path' },
                                                            }}
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>
                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Icon</Label>
                                                        <AvField name="Icon" value={EditData.Icon} type="text"
                                                            placeholder="Please Enter Icon"
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter Icon' },
                                                            }}
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>


                                            <Row>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Row style={{ marginTop: '25px' }}>
                                                            <Label
                                                                htmlFor="horizontal-firstname-input"
                                                                className="col-sm-3 col-form-label"
                                                            >IsActive</Label>
                                                            <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                <AvInput name="isActive" type="checkbox" id="switch1" switch="none" defaultChecked checked={EditData.isActive} />
                                                                <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                            </Col>
                                                        </Row>

                                                    </FormGroup>
                                                </Col>

                                                <Col md="1">  </Col>

                                                <Col md="3">
                                                    <FormGroup className="mb-3">
                                                        <Row style={{ marginTop: '25px' }}>
                                                            <Label
                                                                htmlFor="horizontal-firstname-input"
                                                                className="col-sm-3 col-form-label"
                                                            >Is Show on Menu</Label>
                                                            <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                <AvInput name="isShowOnMenu" type="checkbox" id="abc" switch="none" checked={isShowPageChecked} Value={EditData.IsActive} disabled='' />
                                                                <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                            </Col>
                                                        </Row>

                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Row>



                            </AvForm>
                            <div>
                            </div>
                        </CardBody>
                    </Card>

                </Col>
            </Row>
        </Card>
    </Container>
</div>
</React.Fragment >