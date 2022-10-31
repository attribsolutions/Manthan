import React from 'react'
import { useSelector } from 'react-redux';
import { Modal, } from "reactstrap";

const Spinner = () => {
    
    //redux Spinner State
    const { SpinnerState } = useSelector((state) => ({
       SpinnerState: state.SpinnerReducer.SpinnerState,
    }));

    return (
        <React.Fragment>
            <Modal
                isOpen={SpinnerState}
                centered={true}
                scrollable={true}
                size="sm"
            >
                <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
            </Modal>
        </React.Fragment>
    )
}
export default Spinner