import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useConfirm from './useConfirm';


export let customAlert;

const ConfirmDialog = () => {

    const { confirmState, confirm } = useConfirm();
    customAlert = confirm;
    let component = null;
    const buttonRef = useRef(null);

    useEffect(() => {

        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [confirmState]);

    if (confirmState.Status) {
        switch (confirmState.Type) {
            case 1: component = <AlertSucc btnRef={buttonRef} />
                break;
            case 2: component = <AlertDanger btnRef={buttonRef} />
                break;
            case 3: component = <AlertInfo btnRef={buttonRef} />
                break;
            case 4: component = <AlertWarning btnRef={buttonRef} />
                break;
            case 5: component = <AlertPermission1 btnRef={buttonRef} />
                break;
            case 6: component = <AlertPermission2 btnRef={buttonRef} />
                break;
            case 7: component = <AlertPermission3 btnRef={buttonRef} />
                break;
            case 8: component = <AlertPermission4 btnRef={buttonRef} />
                break;
            case 9: component = <AlertHTMLString btnRef={buttonRef} />
                break;
            case 10: component = <AlertMsgArray btnRef={buttonRef} />
                break;
            case 11: component = <AlertEwayBill btnRef={buttonRef} />
                break;
            default: return null;
        }
    }

    const portalElement = document.getElementById('portal');
    return createPortal(component, portalElement);
};
export default ConfirmDialog;


const AlertSucc = ({ btnRef }) => {

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
                        <button type="button" ref={btnRef} className="btn btn-primary" onClick={innerYes}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertWarning = ({ btnRef }) => {

    const { onCancel, confirmState } = useConfirm();
    const { Status = false, Message = " Warning Error", } = confirmState;

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
                            <button type="button" ref={btnRef} className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertInfo = ({ btnRef }) => {
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

                            <button type="button" ref={btnRef} className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
};





const AlertHTMLString = ({ btnRef }) => {
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
                            <MessageFunHtmlString msg={Message} />

                            <button type="button" ref={btnRef} className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
};


const AlertMsgArray = ({ btnRef }) => {

    const { onCancel, confirmState } = useConfirm();
    const { Status = false, Message = " Warning Error", } = confirmState;

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

                            <MessageArrFun msg={Message} />
                            <button type="button" ref={btnRef} className="btn btn-primary " onClick={innerOk}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};



const AlertEwayBill = ({ btnRef }) => {

    const { onCancel, confirmState } = useConfirm();
    const { Status = false, Message = " Warning Error", } = confirmState;

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
                    <div className={`px-6 mb-0 text-center alert alert-${confirmState.color} alert-dismissible fade show`} role="alert"><button type="button"
                        className="close" aria-label="Close" onClick={outerNo}><span aria-hidden="true">×</span></button><i
                            className={`${confirmState.Icon} d-block display-6 mt-2 mb-3 text-${confirmState.color}`}></i>
                        <EWayBillMessageFun msg={Message} />
                    </div>
                </div>
            </div>
        </div>


    )
};






const AlertDanger = ({ btnRef }) => {
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

                        <button type="button" ref={btnRef} className="btn btn-primary" onClick={innerOk}>OK</button>

                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertPermission1 = ({ btnRef }) => {
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
                            className="btn btn-success " onClick={innerOk}>Yes</button>
                            <button type="button"
                                ref={btnRef}
                                className="btn btn-danger w-xm waves-effect waves-light"
                                onClick={outerNo}>No</button></div>
                    </div>
                </div>
            </div >
        </div >
    )
};

const AlertPermission2 = ({ btnRef }) => {

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
                            className="btn btn-success " onClick={innerOk}>Yes</button>
                            <button type="button"
                                ref={btnRef}
                                className="btn btn-danger w-xm waves-effect waves-light"
                                onClick={outerNo}>No</button></div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const AlertPermission3 = ({ btnRef }) => {

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
                                className="btn btn-success " onClick={innerYes}>Yes</button>
                            <button type="button"
                                ref={btnRef}
                                className="btn btn-danger w-xm waves-effect waves-light" onClick={outerNo}>No</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

const AlertPermission4 = ({ btnRef }) => {

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
                            className="btn btn-danger " onClick={innerYes}>Yes</button>
                            <button type="button"
                                ref={btnRef}
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





const MessageArrFun = ({ msg }) => {
    let messages = [];

    try {
        // If msg is a stringified array, parse it
        messages = JSON.parse(msg);
    } catch (e) {
        // If parsing fails, assume msg is already an array
        messages = Array.isArray(msg) ? msg : [msg];
    }

    return (
        <div style={{ textAlign: 'left' }}>
            {messages.map((message, index) => {
                const parts = message.split(":"); // Split message at ':'
                return (
                    <div key={index} style={{ marginBottom: '5px' }}>
                        <h5>
                            {parts[0]}
                            {parts[1] && <span style={{ color: 'tomato' }}>:{parts.slice(1).join(":")}</span>}
                        </h5>
                    </div>
                );
            })}
        </div>
    );
};




const EWayBillMessageFun = ({ msg }) => {

    const { onConfirm, confirmState } = useConfirm();

    const renderDynamicMessages = () => {
        let msgArr = [];

        msg.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (item[key] !== null) {
                    msgArr.push(`${key}: ${item[key]}`);
                }
            });
        });

        return msgArr.map((text, index) => (
            <div key={index} style={{ textAlign: 'left' }}>
                <h5>{text}</h5>
            </div>
        ));
    };

    const innerYes = (e) => {
        e.stopPropagation();
        onConfirm();
    };

    return (
        <div>
            {Array.isArray(msg) ? renderDynamicMessages() : (
                <div style={{ textAlign: 'center' }}>
                    <h5>{msg}</h5>
                </div>
            )}
            <div style={{ textAlign: 'center', color: "#4848ff", marginBottom: '10px' }}>
                <p><strong>{confirmState.Title}</strong></p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <p><strong> {confirmState.TitleMessage}</strong></p>
            </div>

            {confirmState.ActionButton && <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button onClick={innerYes} className="btn btn-primary">{confirmState.ActionButton}</button>
            </div>}
        </div>
    );
};




const MessageFunHtmlString = ({ msg }) => {
    debugger
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
        return (<div style={{ textAlign: 'center' }}><p> <h5><div dangerouslySetInnerHTML={{ __html: msg }} /></h5></p></div>)
    }
}