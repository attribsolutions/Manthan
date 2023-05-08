import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, CardBody, Col, FormGroup, Input, Label } from 'reactstrap'
import { comAddPageFieldFunc, initialFiledFunc, onChangeText } from '../../../../../components/Common/validationFunction'

const PrefixTab = forwardRef((props, ref) => {

    const fileds = {
        OrderPrefix: '',
        InvoicePrefix: '',
        GRNPrefix: '',
        ChallanPrefix:'',
        ReceiptPrefix: '',
        WorkOrderPrefix: '',
        MaterialIssuePrefix: '',
        DemandPrefix: '',
        IBChallanPrefix: '',
        IBInwardPrefix: '',
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
debugger
    useImperativeHandle(ref, () => ({
        setCurrentState(arr) {
            setState(arr)
        },
        getCurrentState: () => {
            return state
        },
    }));

    const { values } = state;
    const { isError } = state;
    const { fieldLabel } = state;

    const {
        pageField,
    } = useSelector((state) => ({
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    return (
        <div>
            <Card className="text-black " >
                <CardBody className="c_card_body">

                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.OrderPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="OrderPrefix"
                                value={values.OrderPrefix}
                                type="text"
                                className={isError.OrderPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Order Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>
                        {isError.OrderPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.OrderPrefix}</span>
                        )}
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.InvoicePrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="InvoicePrefix"
                                value={values.InvoicePrefix}
                                type="text"
                                className={isError.InvoicePrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Invoice Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>
                        {isError.InvoicePrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.InvoicePrefix}</span>
                        )}
                    </FormGroup>




                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.GRNPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="GRNPrefix"
                                value={values.GRNPrefix}
                                type="text"
                                className={isError.GRNPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Invoice Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>
                        {isError.GRNPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.GRNPrefix}</span>
                        )}
                    </FormGroup>




                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.ReceiptPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="ReceiptPrefix"
                                value={values.ReceiptPrefix}
                                type="text"
                                className={isError.ReceiptPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Receipt Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>
                        {isError.ReceiptPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.ReceiptPrefix}</span>
                        )}
                    </FormGroup>


                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.WorkOrderPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="ChallanPrefix"
                                value={values.WorkOrderPrefix}
                                type="text"
                                className={isError.WorkOrderPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Receipt Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>

                        {isError.WorkOrderPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.WorkOrderPrefix}</span>
                        )}
                    </FormGroup>


                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.MaterialIssuePrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="ChallanPrefix"
                                value={values.MaterialIssuePrefix}
                                type="text"
                                className={isError.MaterialIssuePrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Receipt Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>

                        {isError.MaterialIssuePrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.MaterialIssuePrefix}</span>
                        )}
                    </FormGroup>


                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.DemandPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="ChallanPrefix"
                                value={values.DemandPrefix}
                                type="text"
                                className={isError.DemandPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Receipt Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>

                        {isError.DemandPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.DemandPrefix}</span>
                        )}
                    </FormGroup>


                    <FormGroup className="mb-3">
                        <Label className='col col-4'>{fieldLabel.ChallanPrefix} </Label>
                        <Col sm={4}>
                            <Input
                                name="ChallanPrefix"
                                value={values.IBChallanPrefix}
                                type="text"
                                className={isError.IBChallanPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter IBChallan Prefix"
                                autoComplete='off'
                                onChange={(event) => {
                                    onChangeText({ event, state, setState })
                                }}
                            />
                        </Col>
                        {isError.IBChallanPrefix.length > 0 && (
                            <span className="invalid-feedback">{isError.IBChallanPrefix}</span>
                        )}
                    </FormGroup>



                </CardBody>
            </Card>
        </div>
    )
})

export default PrefixTab
