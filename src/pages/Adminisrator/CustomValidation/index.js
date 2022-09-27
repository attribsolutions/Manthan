import React, { Component, useState } from "react";
import { Input } from "reactstrap";

const formValid = ({ isError, ...rest }) => {
    debugger
    let isValid = false;
    Object.values(isError).forEach(val => {
        if (val.length > 0) {
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
    return isValid;
};

const regExp = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)


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
        debugger
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
            ["acx"]: value,
            [name]: value
        })
    };

 console.log(state)
    // render() {
    const { isError } = state;
    return (
        <div className="page-content">
            <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className={isError.name.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="name"
                        onChange={formValChange}
                    />
                    {isError.name.length > 0 && (
                        <span className="invalid-feedback">{isError.name}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className={isError.email.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="email"
                        onChange={formValChange}
                    />
                    {isError.email.length > 0 && (
                        <span className="invalid-feedback">{isError.email}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className={isError.password.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="password"
                        onChange={formValChange}
                    />
                    {isError.password.length > 0 && (
                        <span className="invalid-feedback">{isError.password}</span>
                    )}
                </div>
                <button type="submit" className="btn btn-block btn-danger">Create User</button>
            </form>
        </div>
    )
}
// }


// 