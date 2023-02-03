import React from 'react';
import { createPortal } from 'react-dom';
import useConfirm from './useConfirm';

const ConfirmDialog = () => {


    const { onConfirm, onCancel, confirmState } = useConfirm();

    const style = { display: confirmState.show ? "block" : "none" }
    const style2 = { boxShadow: "5px 5px 5px #adb5bd !important" }
    const portalElement = document.getElementById('portal');
    const component = confirmState.show ? (

        <div id="c-alert1" className="modal fade show " role="dialog" tabindex="-1" style={style}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content " style={style2}>
                    <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button
                        type="button" className="close" aria-label="Close" onClick={onCancel} ><span aria-hidden="true" >×</span></button><i
                            className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
                        <p>
                            <h5> {confirmState?.text && confirmState.text}</h5>
                        </p>
                        <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
                            <button type="button"
                                className="btn btn-danger " onClick={onConfirm}>Yes</button>
                            <button type="button"
                                className="btn btn-success w-xm waves-effect waves-light" onClick={onCancel}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    ) : null;

    return createPortal(component, portalElement);
};
export default ConfirmDialog;