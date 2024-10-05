import React, { useEffect, useRef, useState, } from "react";
import { Card, Input } from "reactstrap";
import cbm_logo from "../../../../assets/images/cbm_logo.png"

import "./button.css"
import { CustomerMobileView } from "../Function";




export const CustomermobileViewBackground = (props) => {

    const [CustomerMobileNumber, setCustomerMobileNumber] = useState("");
    const [error, setError] = useState('');
    const [Response, setResponse] = useState("");
    const [showContent, setShowContent] = useState(false);
    const [display, setDisplay] = useState('');
    const buttonRef = useRef(null); // Reference to the Send button


    const SaveHandler = async () => {
        const [Mac_ID, Party] = props.Details.split("&");
        console.log(Mac_ID); // "64:51:06:3F:5F:D2"
        console.log(Party); // "60722
        debugger
        setResponse("")
        if (!validateMobileNumber(CustomerMobileNumber)) {
            setError('Please enter a valid 10-digit mobile number.');

        } else {
            const jsonData = await CustomerMobileView({ Mobile: CustomerMobileNumber, IsLinkToBill: 0, MacID: Mac_ID, Party: Party, CreatedOn: new Date().toISOString() })
            setResponse(jsonData)
        }
    }
    useEffect(() => {
        if (Response.Status === true && Response.StatusCode === 200) {
            setCustomerMobileNumber("");
        }
    }, [Response.Status, Response.StatusCode])

    const scrollToElement = (id_1, id_2) => {
        const element_1 = document.getElementById(id_1); // Find the element
        const element_2 = document.getElementById(id_2); // Find the element


        if (element_1) {
            element_1.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (element_2) {
            element_2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const validateMobileNumber = (number) => {
        // Example regex for mobile number validation (10 digits)
        const mobileRegex = /^(?:\+91|91)?[789]\d{9}$/;

        return mobileRegex.test(number);
    };




    const handleChange = (event) => {

        const value = event.target.value;
        const isNumber = /^\d{0,10}$/.test(value)

        if (isNumber) {
            setCustomerMobileNumber(value);
            // Validate the mobile number
            if (value && !validateMobileNumber(value)) {
                setError('Please enter a valid 10-digit mobile number.');
            } else {
                // event.target.blur();
                scrollToElement("BTN_ID", "CARD_ID")

                setError('');
            }
        }
    };

    const handleClick = (num) => {
        setDisplay(display + num); // Append clicked number to the existing display
    };

    const handleBackspace = () => {
        setDisplay(display.slice(0, -1)); // Remove the last character
    };


    // console.log("response", (Response.Status === true && Response.StatusCode === 200))
    // console.log(" validation", !(validateMobileNumber(CustomerMobileNumber)))
    let IsShowSent = false
    if (Response.Status === true && Response.StatusCode === 200) {
        IsShowSent = true
    } else if (validateMobileNumber(CustomerMobileNumber)) {
        IsShowSent = true
    }

    return (
        <React.Fragment>
            <div
                className="container-fluid"
                style={{
                    minHeight: '100vh', // Full screen height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'top',
                    position: 'relative',
                }}
            >
                {/* Background layers */}
                <div
                    className="bg-overlay auth-bg"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                ></div>
                <div
                    className="bg-overlay bg-primary"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                ></div>
                <ul
                    className="bg-bubbles"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                {/* Content Section */}
                <div style={{ zIndex: 2, textAlign: 'center', }}>
                    {/* Image */}
                    <img
                        src={cbm_logo}
                        alt="CBM Logo"
                        style={{
                            width: '250px',
                            height: '250px',
                            marginBottom: '-45px',
                        }}
                    />

                    {/* Card with Input below the image */}
                    <Card id="CARD_ID"
                        style={{
                            background: 'whitesmoke',
                            margin: '10px auto',
                            boxShadow: '0px 1px 5px 1px grey',
                            padding: '30px',
                            width: '370px',
                            height: "170px",
                            zIndex: 2, // Keep card on top of the background
                        }}
                    >
                        <h4>Customer Mobile</h4>

                        <Input
                            type="tel"
                            id="Numiric_ID"
                            className="input font-size-22"
                            autoComplete="off"
                            placeholder="Enter Mobile Number"
                            value={CustomerMobileNumber}
                            onChange={handleChange}
                        />
                        {error && <div style={{ color: "red" }} className="error-message">{error}</div>}
                    </Card>


                    <button id="BTN_ID" ref={buttonRef} className="button" onClick={SaveHandler} style={{ marginLeft: "90px", marginTop: "30px" }}>
                        <div className="outline"></div>
                        <div className="state state--default" style={{ top: "10px" }} >
                            <div style={{ top: "-12px" }} className="icon">
                                <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                    fill="none"

                                >
                                    <g style={{ filter: 'url(#shadow)' }}>
                                        <path
                                            d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                                            fill="currentColor"
                                        ></path>
                                        <path
                                            d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                                            fill="currentColor"
                                        ></path>
                                    </g>
                                    <defs>
                                        <filter id="shadow">
                                            <feDropShadow
                                                dx="0"
                                                dy="1"
                                                stdDeviation="0.6"
                                                floodOpacity="0.5"
                                            ></feDropShadow>
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                            <p style={{ top: "10px" }} >
                                {['S', 'e', 'n', 'd', 'C', 'o', 'n', 't', 'a', 'c', 't'].map((letter, index) => (
                                    <span key={index} style={{ '--i': index }}>{letter}</span>
                                ))}
                            </p>
                        </div>
                        {IsShowSent ? <div className="state state--sent" style={{ top: "10px" }}>
                            <div className="icon" style={{ top: "-12px" }}>
                                <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    strokeWidth="0.5px"
                                    stroke="black"
                                >
                                    <g style={{ filter: 'url(#shadow)' }}>
                                        <path
                                            fill="currentColor"
                                            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                            <p>
                                {['S', 'e', 'n', 't'].map((letter, index) => (
                                    <span key={index} style={{ '--i': index + 5 }}>{letter}</span>
                                ))}
                            </p>
                        </div> :

                            <div className="state state--sent" style={{ top: "10px" }}>
                                <div className="icon" style={{ top: "-12px" }}>
                                    <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        height="1em"
                                        width="1em"
                                        strokeWidth="0.5px"
                                        stroke="black"
                                    >
                                        <g style={{ filter: 'url(#shadow)' }}>
                                            <path
                                                fill="currentColor"
                                                d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                                            ></path>
                                            <path
                                                fill="currentColor"
                                                d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <p>
                                    {['F', 'a', 'i', 'l'].map((letter, index) => (
                                        <span key={index} style={{ '--i': index + 5 }}>{letter}</span>
                                    ))}
                                </p>
                            </div>

                        }
                    </button>
                    {/* <NumberPad
                        handleBackspace={handleBackspace}
                        handleClick={handleClick}
                    /> */}
                </div>






            </div>
        </React.Fragment >

    );
};








export const NumberPad = ({ handleClick, handleBackspace }) => {
    const disableContextMenu = (e) => {
        e.preventDefault(); // Prevents default context menu from showing
    };

    return (
        <div className="mt-5 ml-5">
            <ul id="keyboard" onContextMenu={disableContextMenu}>
                <li className="letter" onClick={() => handleClick('1')}>1</li>
                <li className="letter" onClick={() => handleClick('2')}>2</li>
                <li className="letter" onClick={() => handleClick('3')}>3</li>
                <li className="letter clearl" onClick={() => handleClick('4')}>4</li>
                <li className="letter" onClick={() => handleClick('5')}>5</li>
                <li className="letter" onClick={() => handleClick('6')}>6</li>
                <li className="letter clearl" onClick={() => handleClick('7')}>7</li>
                <li className="letter" onClick={() => handleClick('8')}>8</li>
                <li className="letter" onClick={() => handleClick('9')}>9</li>
                <li className="letter" onClick={() => handleClick('0')}>0</li>
                <li className="letter clearl" onClick={handleBackspace}>Back</li> {/* Back button */}
            </ul>
        </div>
    );
};


