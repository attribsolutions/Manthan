import React from 'react'

const PrefixTab = () => {
  return (
    <div>
       <Card className="text-black " >
                                                            <CardBody className="c_card_body">
                                                                <Col>
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Order Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Orderprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Orderprefix"
                                                                                placeholder="Please Enter Order Prefix"
                                                                                className="form-control "
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col >
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01">Invoice Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Invoiceprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Invoiceprefix"
                                                                                placeholder="Please Enter Invoice Prefix "
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> GRN Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Grnprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Grnprefix"
                                                                                placeholder="Please Enter GRN Prefix"
                                                                                className="form-control "
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup>
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Receipt Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Receiptprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Receiptprefix"
                                                                                placeholder="Please Enter Receipt Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Challan Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Challanprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Challanprefix"
                                                                                placeholder="Please Enter Challan Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> WorkOrder Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].WorkOrderprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="WorkOrderprefix"
                                                                                placeholder="Please Enter WorkOrder Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> MaterialIssue Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].MaterialIssueprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="MaterialIssueprefix"
                                                                                placeholder="Please Enter MaterialIssue Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Demand Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Demandprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Demandprefix"
                                                                                placeholder="Please Enter Demand Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> IBChallan Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].IBChallanprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="IBChallanprefix"
                                                                                placeholder="Please Enter IBChallan Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> IBInward Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].IBInwardprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="IBInwardprefix"
                                                                                placeholder="Please Enter IBInward Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>
                                                            </CardBody>
                                                        </Card>
    </div>
  )
}

export default PrefixTab
