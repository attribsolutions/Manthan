import React from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useConfirm from './useConfirm';


export let customAlert;

const ConfirmDialog = () => {

    const { confirmState, confirm } = useConfirm();
    customAlert = confirm;
    let component = null;

    if (confirmState.Status) {
        switch (confirmState.Type) {
            case 1: component = <AlertSucc />
                break;
            case 2: component = <AlertDanger />
                break;
            case 3: component = <AlertInfo />
                break;
            case 4: component = <AlertWarning />
                break;
            case 5: component = <AlertPermission1 />
                break;
            case 6: component = <AlertPermission2 />
                break;
            case 7: component = <AlertPermission3 />
                break;
            case 8: component = <AlertPermission4 />
                break;
            default: return null;
        }
    }

    const portalElement = document.getElementById('portal');
    return createPortal(component, portalElement);
};
export default ConfirmDialog;


const AlertSucc = () => {

    const { onConfirm, onCancel, confirmState } = useConfirm();
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        Status = false,
        Message = "400 Error",
        AfterResponseAction = false,
        RedirectPath = false,
    } = confirmState

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerYes = (e) => {
        e.stopPropagation();
        if (AfterResponseAction) {
            dispatch(AfterResponseAction());
        };
        onConfirm();

        if (RedirectPath) {
            history.push({
                pathname: RedirectPath,
                state: history.location.state
            });
        }
    };

    return (
        <div className="modal fade show transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-6 mb-0 text-center alert alert-success alert-dismissible fade show" role="alert"><button type="button"
                        className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true">×</span></button><i
                            className="mdi mdi-check-all d-block display-6 mt-2 mb-3  text-success"></i>
                        <MessageFun msg={Message} />
                        <button type="button" className="btn btn-primary" onClick={innerYes}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertWarning = () => {

    const { onCancel, confirmState } = useConfirm();
    const { Status = false, Message = "400 Error", } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerOk = (e) => {
        e.stopPropagation();
        onCancel();
    };

    return (
        <div className="modal fade show transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="modal-content ">
                        <div className="px-4 mb-0 text-center alert alert-warning alert-dismissible fade show" role="alert"><button type="button"
                            className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true">×</span></button><i
                                className="mdi mdi-alert-outline  d-block display-4 mt-2 mb-3 text-warning"></i>

                            <MessageFun msg={Message} />
                            <button type="button" className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertInfo = () => {
    const { onCancel, confirmState } = useConfirm();
    const { Status = false, Message = "400 Error", } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerOk = (e) => {
        e.stopPropagation();
        onCancel();
    };
    return (

        <div id="c-alert1" className="modal fade show transparent1 " role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="modal-content ">
                        <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button type="button"
                            className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true">×</span></button><i
                                className="mdi mdi-alert-circle-outline d-block display-4 mt-2 mb-3 text-info"></i>
                            <MessageFun msg={Message} />
                            <button type="button" className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
};

const AlertDanger = () => {
    const { onCancel, confirmState } = useConfirm();

    const { Status = false, Message = "400 Error", } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerOk = (e) => {
        e.stopPropagation();
        onCancel();
    };
    return (
        <div id="c-alert1" className="modal fade show transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-4 mb-0 text-center alert alert-danger alert-dismissible fade show" role="alert"><button
                        type="button" className="close" aria-label="Close" onClick={outerNo}><span
                            aria-hidden="true">×</span></button><i
                                className="mdi mdi-block-helper d-block display-4 mt-2 mb-3  text-danger"></i>
                        <MessageFun msg={Message} />
                        <button type="button" className="btn btn-primary" onClick={innerOk}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertPermission1 = () => {
    const dispatch = useDispatch();

    const { onCancel, confirmState } = useConfirm();
    const {
        Status = false,
        Message = "400 Error",
        PermissionAction = false,
        ID,//ID=deleted ID
    } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerOk = (e) => {
        e.stopPropagation();
        if (PermissionAction) {
            dispatch(PermissionAction(ID))//ID=deleted ID
        };
        onCancel();
    };
    return (
        <div id="c-alert1" className="modal fade show  transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button type="button"
                        className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true" >×</span></button><i
                            className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>

                        <MessageFun msg={Message} />

                        <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}><button type="button"
                            className="btn btn-danger " onClick={innerOk}>Yes</button><button type="button"
                                className="btn btn-success w-xm waves-effect waves-light" onClick={outerNo}>No</button></div>
                    </div>
                </div>
            </div >
        </div >
    )
};

const AlertPermission2 = () => {

    const { onCancel, confirmState } = useConfirm();

    const {
        Status = false,
        Message = "400 Error",
        PermissionFunction = () => { },
    } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerOk = (e) => {
        e.stopPropagation();
        if (PermissionFunction) {
            PermissionFunction()
        };
        onCancel();
    };
    return (
        <div id="c-alert1" className="modal fade show  transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button type="button"
                        className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true" >×</span></button><i
                            className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
                        <p>
                            <h5>{Message}</h5>
                        </p>
                        <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}><button type="button"
                            className="btn btn-success " onClick={innerOk}>Yes</button><button type="button"
                                className="btn btn-danger w-xm waves-effect waves-light" onClick={outerNo}>No</button></div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertPermission3 = () => {

    const { onConfirm, onCancel, confirmState } = useConfirm();
    const {
        Status = false,
        Message = "400 Error",
    } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        }
    };

    const innerYes = (e) => {
        e.stopPropagation();
        onConfirm();
    };



    return (
        <div id="c-alert1" className="modal fade show transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button
                        type="button" className="close" aria-label="Close" onClick={outerNo} ><span aria-hidden="true" >×</span></button><i
                            className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
                        <div style={{ textAlign: 'left' }}><p >
                            <MessageFun msg={Message} />
                        </p></div>
                        <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
                            <button type="button"
                                className="btn btn-danger " onClick={innerYes}>Yes</button>
                            <button type="button"
                                className="btn btn-success w-xm waves-effect waves-light" onClick={outerNo}>No</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

const AlertPermission4 = () => {

    const { onConfirm, onCancel, confirmState } = useConfirm();
    const {
        Status = false,
        Message = "400 Error",
    } = confirmState;

    const outerNo = (e, no) => {
        if (no === 2) {
            e.stopPropagation();
            return;
        } else {
            e.stopPropagation();
            onCancel();
        };
    };

    const innerYes = (e) => {
        e.stopPropagation();
        onConfirm();
    };

    return (
        <div id="c-alert1" className="modal fade show  transparent1" role="dialog" onClick={(e) => outerNo(e, 1)} tabindex="-1" style={{ display: Status ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content alertbody" onClick={(e) => outerNo(e, 2)}>
                    <div className="px-4 mb-0 text-center alert alert-info alert-dismissible fade show" role="alert"><button type="button"
                        className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true" >×</span></button><i
                            className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>

                        <MessageFun msg={Message} />

                        <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}><button type="button"
                            className="btn btn-danger " onClick={innerYes}>Yes</button><button type="button"
                                className="btn btn-success w-xm waves-effect waves-light" onClick={outerNo}>No</button></div>
                    </div>
                </div>
            </div >
        </div >
    )
};

const MessageFun = ({ msg }) => {

    let t = Array.isArray(msg)
    if (t) {
        let count = 0
        let msgarr = [];

        msg.map((i1, k1) => {
            let keys = Object.keys(i1);

            keys.map((i2, k2) => {

                if (!(i1[i2] === null)) {
                    msgarr.push(`${i2}:${i1[i2]}`);

                    count = count + 1;
                }
                return null
            })
            return null
        })
        return msgarr.map((i) => (<div style={{ textAlign: 'left' }}><p> <h5>{i}</h5></p></div>))
    }
    else {
        return (<div style={{ textAlign: 'center' }}><p> <h5>{msg}</h5></p></div>)
    }
}


