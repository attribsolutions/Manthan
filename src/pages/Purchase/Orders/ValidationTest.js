import React, { useState } from 'react'
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Label,
    Input,
    CardHeader,
} from "reactstrap";
export default function ValidationTest() {



    const [validation, setValidation] = useState({
        fnm: null,
        lnm: null,
        unm: null,
        city: null,
        stateV: null,
    })

    function handleSubmit(e) {

        e.preventDefault()
        const modifiedV = { ...validation }
        var fnm = document.getElementById("validationTooltip01").value
        var lnm = document.getElementById("validationTooltip02").value
        var unm = document.getElementById("validationTooltip03").value
        // var city = document.getElementById("validationTooltip03").value
        // var stateV = document.getElementById("validationTooltip04").value

        if (fnm === "") {
            modifiedV["fnm"] = false
        } else {
            modifiedV["fnm"] = true
        }

        if (lnm === "") {
            modifiedV["lnm"] = false
        } else {
            modifiedV["lnm"] = true
        }

        if (unm === "") {
            modifiedV["unm"] = false
        } else {
            modifiedV["unm"] = true
        }

        // if (city === "") {
        //     modifiedV["city"] = false
        // } else {
        //     modifiedV["city"] = true
        // }

        // if (stateV === "") {
        //     modifiedV["stateV"] = false
        // } else {
        //     modifiedV["stateV"] = true
        // }
        setValidation(modifiedV)
    }

    //for change tooltip display propery
    const onChangeValidation = (fieldName, value) => {

        const modifiedV = { ...validation }
        if (value !== "") {
            modifiedV[fieldName] = true
        } else {
            modifiedV[fieldName] = false
        }
        setValidation(modifiedV)
    }

    const onKeyPress = (e) => {

        var cont = e.target.id;
        var abc = cont.split("p");
        cont = abc[1];
        
      
        if (e.keyCode === 40||e.keyCode ===13) {
          cont = ++cont;
          document.getElementById("valInp" + cont).focus();
          return
        }
        if (e.keyCode === 38 && cont > 0) {
          cont = cont - 1;
          document.getElementById("valInp" + cont).focus();
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Card>
                    <CardBody>
                        <form
                            className="needs-validation"
                            method="post"
                            id="tooltipForm"
                        >
                            <Row className="row mt-4">
                                    <Label htmlFor="valInp" className="col-sm-3 col-form-label">
                                        First name
                                    </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="valInp1"
                                        placeholder="First name"
                                        // onChange={event => {
                                        //     onChangeValidation("fnm", event.target.value)
                                        // }}
                                        onKeyDown={(event)=>{onKeyPress(event)}}
                                        valid={validation["fnm"] === true}
                                        invalid={
                                            validation["fnm"] !== true &&
                                            validation["fnm"] !== null
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row className="row mt-4">
                                    <Label htmlFor="validationTooltip02" className="col-sm-3 col-form-label">
                                    City name
                                    </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="valInp2"
                                        placeholder="City name"
                                        onChange={event => {
                                            onChangeValidation("unm", event.target.value,event)
                                        }}
                                        onKeyDown={event=>onKeyPress(event)}
                                        on
                                        valid={validation["unm"] === true}
                                        invalid={
                                            validation["unm"] !== true &&
                                            validation["unm"] !== null
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row className="row mt-4">
                               
                                    <Label htmlFor="valInp3" className="col-sm-3 col-form-label">
                                        last name
                                    </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="valinp3"
                                        placeholder="lastName"
                                        onChange={event => {
                                            onChangeValidation("lnm", event.target.target,event)
                                        }}
                                        onKeyDown={event=>onKeyPress(event)}
                                        valid={validation["lnm"] === true}
                                        invalid={
                                            validation["lnm"] !== true &&
                                            validation["lnm"] !== null
                                        }
                                    />
                                </Col>
                            </Row>
                            <Button color="primary" type="button" onClick={e => {
                                handleSubmit(e)
                            }}>
                                Submit form
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    )
}
