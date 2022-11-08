import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, } from "reactstrap";
import { hasError500 } from '../../store/Utilites/CommonError/actions'

const Spinner = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    //redux Spinner State
    const { SpinnerState, error500 } = useSelector((state) => ({
        SpinnerState: state.SpinnerReducer.SpinnerState,
        error500: state.CommonError.error500,
    }));

    useEffect(() => {
        if (error500) {
            dispatch(hasError500(null))
            history.push({
                pathname: "/auth-500",
                state: error500
            })
        }
    }, [error500])

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