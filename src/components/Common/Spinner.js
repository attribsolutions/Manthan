import React, { useEffect } from 'react'
import {useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { Modal, } from "reactstrap";
// import { hasError500 } from '../../store/Utilites/CommonError/actions'

const Spinner = () => {
    const history = useHistory();
 
    //redux Spinner State
    const { SpinnerState, error500 } = useSelector((state) => ({
        SpinnerState: state.SpinnerReducer.SpinnerState,
        error500: state.CommonError.error500,
    }));

    useEffect(() => {
        if (error500) {
            // dispatch(hasError500(null))
            history.push({
                pathname: "/auth-500",
                state: error500
            })
        }
    }, [error500])

    useEffect(() => {
        if (!SpinnerState) {
            setTimeout(() => {
                try {
                    // document.getElementById("overlay").style.display = "none";
                } catch (e) { }
            }, )
        } else {
            try {
                // document.getElementById("overlay").style.display = "block";
            } catch (e) { }
        }
    }, [SpinnerState])


    return (
        <React.Fragment>
            {/* <div id="overlay" style={{ display: SpinnerState ? "block1" : "none" }}> */}
                <div id="overlay" >
                <div className="cv-spinner">
                    <span className="spinner"></span>
                    {/* <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                    Loading...
                </button> */}
                </div>
            </div>
            {/* <Modal
                isOpen={SpinnerState}
                centered={true}
                scrollable={false}
                size="sm"
            >
                <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
            </Modal> */}
        </React.Fragment>
    )
}
export default Spinner