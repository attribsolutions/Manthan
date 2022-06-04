import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Label,
    Input,
} from "reactstrap";
import Select from "react-select";
import { Custom_ValidationFun } from '../ValidationFunctions';

export default function ValidationTest() {

    useEffect(() => {
        document.getElementById("valInp1").focus();
        // document.getElementById("valInp1").target.next.focus();

        // document.getElementById("react-select-2-input").focus();
    }, []);

    const [selectModule, setSelectModule] = useState('');

    const [validation, setValidation] = useState({
        valInp1: null,
        valInp2: null,
        valInp3: null,
    })

    const optionModule = [{
        value: 1,
        label: "Test1",
    }, {
        value: 2,
        label: "Test2",
    }];

    function handleSubmit(e) {

        e.preventDefault()
        const modifiedV = { ...validation }
        var fnm = document.getElementById("valInp1");
        var lnm = document.getElementById("valInp2");
        var unm = document.getElementById("valInp3");

        setValidation({ ...validation }[fnm.id] = Custom_ValidationFun(fnm));
        setValidation({ ...validation }[lnm.id] = Custom_ValidationFun(lnm));
        setValidation({ ...validation }[fnm.id] = Custom_ValidationFun(unm));

        if ((modifiedV["valInp1"]) && (modifiedV["valInp2"]) && (modifiedV["valInp3"])) {
            alert("submit scuccess")
        }
    }

    const handleEnter = (event) => {
        const form = event.target.form;
        const index = [...form].indexOf(event.target);
        const ID =event.target.id;
        debugger
          if ((event.keyCode === 40)&&(form.length-2>index)) {
            form.elements[index + 1].focus();
            event.preventDefault();
          }

          if ((event.keyCode === 38)&&(!(index===0))) {
            form.elements[index - 1].focus();
            event.preventDefault();
          }
          if (event.keyCode === 13) {
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
          }
        
    }
 
    const handleEnter1 = (event) => {
        const form= (event.target.form)
        if (event.key.toLowerCase() === "enter") {
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
          }
          debugger
        // if (event.key.toLowerCase() === "enter") {
        //   const form = event.target.form;
        //   const index = [...form].indexOf(event.target);
        //   form.elements[index + 1].focus();
        //   debugger
        //   event.preventDefault();
        // }
      };








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
                                    Not null
                                </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        name="text"
                                        className="form-control"
                                        id="valInp1"
                                        placeholder="First name"
                                        autoComplete='off'
                                        onChange={event => {
                                            setValidation({ ...validation, valInp1: Custom_ValidationFun(event.target) })
                                        }}
                                        onKeyDown={(event) => { handleEnter(event) }}
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
                                    Number
                                </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        name="textNum"
                                        className="form-control"
                                        id="valInp2"
                                        placeholder="City name"
                                        autoComplete='off'
                                        onChange={event => {
                                            setValidation({ ...validation, valInp2: Custom_ValidationFun(event.target) })
                                        }}
                                        onKeyDown={event => handleEnter(event)}
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
                                    Email
                                </Label>
                                <Col sm={4}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="valInp3"
                                        placeholder="lastName"
                                        autoComplete='off'
                                        onChange={event => {
                                            setValidation({ ...validation, valInp3: Custom_ValidationFun(event.target) })
                                        }}
                                        onKeyDown={event => handleEnter(event)}
                                        valid={validation["valInp3"] === true}
                                        invalid={
                                            validation["valInp3"] !== true &&
                                            validation["valInp3"] !== null
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row className="row mt-4">
                                <Label htmlFor="valInpSelect" className="col-sm-3 col-form-label">
                                    select Input
                                </Label>
                                <Col sm={4}>
                                    <Select
                                        id="valInp4"
                                        title="select"
                                        value={selectModule}
                                        options={optionModule}
                                        // autoComplete='off'
                                        onChange={(e) => { setSelectModule(e); }}
                                        onKeyDown={event => handleEnter(event)}

                                    />
                                </Col>
                            </Row>
                            <Row className="row mt-4">
                                <Label htmlFor="valInpSelect" className="col-sm-3 col-form-label">
                                    select Input
                                </Label>
                                <Col sm={4}>
                                    <Select
                                        id="valInp4"
                                        title="select"
                                        value={selectModule}
                                        options={optionModule}
                                        // autoComplete='off'
                                        onChange={(e) => { setSelectModule(e); }}
                                        // onKeyDown={event => handleEnter(event)}

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





// return (
//     <React.Fragment>
//         <div className="page-content">
//             <Card>
//                 <CardBody>
//                     <form
//                         className="needs-validation"
//                         method="post"
//                         id="tooltipForm"
//                     >
//                         <Row className="row mt-4">
//                             <Label htmlFor="valInp" className="col-sm-3 col-form-label">
//                                 Not null
//                             </Label>
//                             <Col sm={4}>
//                                 <Input
//                                     type="text"
//                                     name="text"
//                                     className="form-control"
//                                     id="valInp1"
//                                     placeholder="First name"
//                                     autoComplete='off'
//                                     onChange={event => {
//                                         setValidation({ ...validation, valInp1: Custom_ValidationFun(event.target) })
//                                     }}
//                                     onKeyDown={(event) => { onKeyPress(event) }}
//                                     valid={validation["valInp1"] === true}
//                                     invalid={
//                                         validation["valInp1"] !== true &&
//                                         validation["valInp1"] !== null
//                                     }
//                                 />
//                             </Col>
//                         </Row>
//                         <Row className="row mt-4">
//                             <Label htmlFor="validationTooltip02" className="col-sm-3 col-form-label">
//                                 Number
//                             </Label>
//                             <Col sm={4}>
//                                 <Input
//                                     type="text"
//                                     name="textNum"
//                                     className="form-control"
//                                     id="valInp2"
//                                     placeholder="City name"
//                                     autoComplete='off'
//                                     onChange={event => {
//                                         setValidation({ ...validation, valInp2: Custom_ValidationFun(event.target) })
//                                     }}
//                                     onKeyDown={event => onKeyPress(event)}
//                                     on
//                                     valid={validation["valInp2"] === true}
//                                     invalid={
//                                         validation["valInp2"] !== true &&
//                                         validation["valInp2"] !== null
//                                     }
//                                 />
//                             </Col>
//                         </Row>
//                         <Row className="row mt-4">

//                             <Label htmlFor="valInp3" className="col-sm-3 col-form-label">
//                                 Email
//                             </Label>
//                             <Col sm={4}>
//                                 <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="valInp3"
//                                     placeholder="lastName"
//                                     autoComplete='off'
//                                     onChange={event => {
//                                         setValidation({ ...validation, valInp3: Custom_ValidationFun(event.target) })
//                                     }}
//                                     onKeyDown={event => onKeyPress(event)}
//                                     valid={validation["valInp3"] === true}
//                                     invalid={
//                                         validation["valInp3"] !== true &&
//                                         validation["valInp3"] !== null
//                                     }
//                                 />
//                             </Col>
//                         </Row>
//                         <Row className="row mt-4">
//                             <Label htmlFor="valInpSelect" className="col-sm-3 col-form-label">
//                                 select Input
//                             </Label>
//                             <Col sm={4}>
//                                 <Select
//                                     id="valInp4"
//                                     title="select"
//                                     value={selectModule}
//                                     options={optionModule}
//                                     // autoComplete='off'
//                                     onChange={(e) => { setSelectModule(e); }}

//                                 />
//                             </Col>
//                         </Row>
//                         <Row className="row mt-4">
//                             <Label htmlFor="valInpSelect" className="col-sm-3 col-form-label">
//                                 select Input
//                             </Label>
//                             <Col sm={4}>
//                                 <Select
//                                     id="valInp4"
//                                     title="select"
//                                     value={selectModule}
//                                     options={optionModule}
//                                     // autoComplete='off'
//                                     onChange={(e) => { setSelectModule(e); }}

//                                 />
//                             </Col>
//                         </Row>

//                         <Button id='saveKye' color="primary" type="button" onClick={e => {
//                             handleSubmit(e)
//                         }}>
//                             Submit form
//                         </Button>
//                     </form>
//                 </CardBody>
//             </Card>
//         </div>
//     </React.Fragment>
// )