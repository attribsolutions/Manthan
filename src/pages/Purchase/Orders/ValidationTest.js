import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        document.getElementById("valInp1").focus();
    },[]);

    const [validation, setValidation] = useState({
        valInp1: null,
        valInp2: null,
        valInp3: null,

    })

    function handleSubmit(e) {
        e.preventDefault()
        const modifiedV = { ...validation }
        var fnm = document.getElementById("valInp1")
        var lnm = document.getElementById("valInp2")
        var unm = document.getElementById("valInp3")

        if (fnm.id === "valInp1") {
            if ((fnm.value !== "")) {
                modifiedV[fnm.id] = true
            } else {
                modifiedV[fnm.id] = false
            }
        }

        if (lnm.id === "valInp2") {
            if (/^[0-9]+$/.test(lnm.value)) { modifiedV[lnm.id] = true }
            else {
                modifiedV[lnm.id] = false
            }
        }

        if (unm.id === "valInp3") {
            var Emailvalidation = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            if ((Emailvalidation.test(unm.value))) {
                modifiedV[unm.id] = true
            }
            else {
                modifiedV[unm.id] = false
            }
        }
        setValidation(modifiedV)

        if ((modifiedV["valInp1"]) && (modifiedV["valInp2"]) && (modifiedV["valInp3"])) {
            alert("submit scuccess")
        }
    }

    //for change tooltip display propery
    const onChangeValidation = (fieldName, value, catagory) => {

        const modifiedV = { ...validation }
        if ((value !== "") && (catagory === "text")) {
            modifiedV[fieldName] = true
        }
        else if (catagory === "Number") {
            if (/^[0-9]+$/.test(value)) { modifiedV[fieldName] = true }
            else {
                modifiedV[fieldName] = false
            }
        }
        else if (catagory === "email") {
            var Emailvalidation = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            if ((Emailvalidation.test(value))) {
                modifiedV[fieldName] = true
            }
            else {
                modifiedV[fieldName] = false
            }
        }
        else {
            modifiedV[fieldName] = false
        }
        setValidation(modifiedV)
    }

    const onKeyPress = (e) => {

        var cont = e.target.id;
        var abc = cont.split("p");
        cont = abc[1];

        if ((e.keyCode === 40 || e.keyCode === 13) && (cont < 3)) {
            cont = ++cont;
            document.getElementById("valInp" + cont).focus();
            return
        }
        if (e.keyCode === 38 && cont > 1) {
            cont = cont - 1;
            document.getElementById("valInp" + cont).focus();
            return
        }
        if (e.keyCode === 13 && cont == 3) {
            document.getElementById("saveKye").click();
            return
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
                                        autoComplete='off'
                                        onChange={event => {
                                            onChangeValidation("valInp1", event.target.value, "text")
                                        }}
                                        onKeyDown={(event) => { onKeyPress(event) }}
                                        valid={validation["valInp1"] === true}
                                        invalid={
                                            validation["valInp1"] !== true &&
                                            validation["valInp1"] !== null
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
                                        autoComplete='off'
                                        onChange={event => {
                                            onChangeValidation("valInp2", event.target.value, "Number")
                                        }}
                                        onKeyDown={event => onKeyPress(event)}
                                        on
                                        valid={validation["valInp2"] === true}
                                        invalid={
                                            validation["valInp2"] !== true &&
                                            validation["valInp2"] !== null
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
                                        id="valInp3"
                                        placeholder="lastName"
                                        autoComplete='off'
                                        onChange={event => {
                                            onChangeValidation("valInp3", event.target.value, "email")
                                        }}
                                        onKeyDown={event => onKeyPress(event)}
                                        valid={validation["valInp3"] === true}
                                        invalid={
                                            validation["valInp3"] !== true &&
                                            validation["valInp3"] !== null
                                        }
                                    />
                                </Col>
                            </Row>
                            <Button id='saveKye' color="primary" type="button" onClick={e => {
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
