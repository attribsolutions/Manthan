import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, UncontrolledAlert, } from "reactstrap";
import { AlertShow } from '../../store/Utilites/CustomAlertRedux/actions';

const CustomAlert = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  //redux Spinner State
  const { AlertData={ Status: false } } = useSelector((state) => ({
    // AlertData: state.AlertReducer.AlertState,
  }))
  const {
    Message = "-",
    Type,
    AfterResponseAction = false,
    PermissionAction = false,
    RedirectPath = false,
    PermissionFunction = () => { },
    permissionValueReturn
  } = AlertData;

  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);
  //  Alert Modal Show and Hide Controller
  function tog_standard() {
    dispatch(AlertShow({ Status: false }));

    if (AfterResponseAction) {
      dispatch(AfterResponseAction());
    };
  }


  // Success Alert Ok button Hnadller
  function Success_Ok_Button_Handeler() {

    dispatch(AlertShow({ Status: false }));

    if (AfterResponseAction) {
      dispatch(AfterResponseAction());
    };

    if (RedirectPath) {
      history.push({
        pathname: AlertData.RedirectPath,
        state: history.location.state
      });
    }
  }

  function Ok_handeler() {
    dispatch(AlertShow({ Status: false }));

  }

  //Permission Alert Ok button handller
  function Permission_Ok_handeler() {
    dispatch(AlertShow({ Status: false }));
    if (PermissionAction) {
      let DeleteId = AlertData.ID
      dispatch(PermissionAction(DeleteId))
    };
  }

  // All alert Cancel Button handler
  function cancel_handeler() {
    tog_standard();
  }

  function Permission_Ok_handeler6() {
    dispatch(AlertShow({ Status: false }));
    if (PermissionFunction) {
      PermissionFunction()
    };
  }
  function Permission_Ok_handeler7() {
    dispatch(AlertShow({ Status: false }));
    if (PermissionFunction) {
      PermissionFunction(permissionValueReturn)
    };
  }
  function cancel_handeler7() {
    PermissionFunction(false)
    tog_standard();
  }


  return (
    <React.Fragment>
      <Modal
        isOpen={AlertData.Status}
        toggle={() => { tog_standard() }}
        centered
      >
        {(Type === 1) &&
          <UncontrolledAlert color="success" className="px-6 mb-0 text-center">
            <i className="mdi mdi-check-all d-block display-6 mt-2 mb-3  text-success"></i>
            <p> <h5 className="text-success">{Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
             ref={buttonRef}
              onClick={() => {
                Success_Ok_Button_Handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }

        {(Type === 2) &&
          <UncontrolledAlert color="danger" className="px-4 mb-0 text-center">
            <i className="mdi mdi-block-helper d-block display-4 mt-2 mb-3  text-danger"></i>
            <p> <h5 className="text-danger">{Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              ref={buttonRef}
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(Type === 3) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-4 mt-2 mb-3 text-info"></i>
            <p> <h5 className="text-">{Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              ref={buttonRef}
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(Type === 4) &&
          <UncontrolledAlert color="warning" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-outline  d-block display-4 mt-2 mb-3 text-warning"></i>
            <p> <h5 className="text-">{Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              ref={buttonRef}
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(Type === 5) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
            <p>
              <h5>{Message}</h5></p>
            <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
              <button
                type="button"
                className="btn btn-danger "
                onClick={() => {
                  Permission_Ok_handeler()
                }}
              >
                Yes
              </button>
              <button
                type="button"
                ref={buttonRef}
                className="btn btn-success w-xm waves-effect waves-light"
                onClick={() => {
                  cancel_handeler()
                }}
              >
                No
              </button>
            </div>
          </UncontrolledAlert>
        }
        {(Type === 6) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
            <p>
              <h5>{Message}</h5></p>
            <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  Permission_Ok_handeler6()
                }}
              >
                Yes
              </button>
              <button
                type="button"
                ref={buttonRef}
                className="btn btn-danger w-xm waves-effect waves-light"
                onClick={() => {
                  cancel_handeler()
                }}
              >
                No
              </button>
            </div>
          </UncontrolledAlert>
        }
        {(Type === 7) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
            <p>
              <h5>{Message}</h5></p>
            <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
              <button
                type="button"
                className="btn btn-danger "
                onClick={() => {
                  Permission_Ok_handeler7()
                }}
              >
                Yes
              </button>
              <button
                type="button"
                ref={buttonRef}
                className="btn btn-success w-xm waves-effect waves-light"
                onClick={() => {
                  cancel_handeler7()
                }}
              >
                No
              </button>
            </div>
          </UncontrolledAlert>
        }
      </Modal>
    </React.Fragment>
  )
}
export default CustomAlert
