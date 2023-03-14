import React, { Component, useState } from "react";
import { Form, Input } from "reactstrap";



export default function Index() {

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        isError: {
            name: '',
            email: '',
            password: ''
        }
    }
    )


    const onSubmit = e => {
        
        e.preventDefault();
        if (formValid(state)) {
            console.log(state)
        } else {
            console.log("Form is invalid!");
        }
    };

    const formValChange = e => {
        
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...state.isError };

        switch (name) {
            case "name":
                isError.name =
                    value.length < 4 ? "Atleast 4 characaters required" : "";
                break;
            case "email":
                isError.email = regExp.test(value)
                    ? ""
                    : "Email address is invalid";
                break;
            case "password":
                isError.password =
                    value.length < 6 ? "Atleast 6 characaters required" : "";
                break;
            default:
                break;
        }
        setState({
            isError,
            [name]: value
        })
    };

    const regExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)


    const formValid = ({ isError, ...rest }) => {
        
        let isValid = false;
        Object.values(isError).forEach(val => {

            if ((val.length >= 0)) {
                isValid = false
            } else {
                isValid = true
            }
        });

        Object.values(rest).forEach(val => {
            if (val === null) {
                isValid = false
            } else {
                isValid = true
            }
        });
        return isValid
    };

    const { isError } = state;
    console.log("page")
    return (
        <div className="page-content">
            <Form onSubmit={onSubmit} >
                <div className="form-group">
                    <label >Name</label>
                   
                    <Input
                        type="text"
                        className={isError.name.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="name"
                        onChange={(e) => { formValChange(e) }}
                    />
                    {isError.name.length > 0 && (
                        <span className="invalid-feedback">{isError.name}</span>
                    )}
                </div>
                <div className="form-group">
                    <label >Email *</label>
                    <Input
                        type="text"
                        className={isError.email.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="email"
                        onChange={(e) => { formValChange(e) }}
                    />
                    {isError.email.length > 0 && (
                        <span className="invalid-feedback">{isError.email}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <Input
                        type="text"
                        className={isError.password.length > 0 ? "is-invalid form-control" : "form-control"}
                    // name="password"
                    // onChange={e=>formValChange(e)}
                    />
                    {isError.password.length > 0 && (
                        <span className="invalid-feedback">{isError.password}</span>
                    )}
                </div>
                <button type="submit" className="btn btn-block btn-danger">Create User</button>
            </Form>
        </div>
    )
}
// }


// 