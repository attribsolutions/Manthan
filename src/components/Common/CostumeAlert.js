import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, UncontrolledAlert, } from "reactstrap";
import { AlertShow } from '../../store/Utilites/CostumeAlert/actions';

const CostumeAlert = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  //redux Spinner State
  const { AlertData } = useSelector((state) => ({
    AlertData: state.AlertReducer.AlertState,
  }))

  //  Alert Modal Show and Hide Controller
  function tog_standard() {
    dispatch(AlertShow({ Status: false }));
    removeBodyCss()

    if (!AlertData.AfterResponseAction === false) {
      let Action = AlertData.AfterResponseAction;
      dispatch(Action());
    };
  }
  //remove Css when modul hide Mode 
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Success Alert Ok button Hnadller
  function Success_Ok_Button_Handeler() {

    dispatch(AlertShow({ Status: false }));
    removeBodyCss()

    if (!AlertData.AfterResponseAction === false) {
      let Action = AlertData.AfterResponseAction;
      dispatch(Action());
    };

    if (!AlertData.RedirectPath === false) {
      history.push({
        pathname: AlertData.RedirectPath,
      });
    }
  }

  function Ok_handeler() {
    dispatch(AlertShow({ Status: false }));
    removeBodyCss()

  }
  //Permission Alert Ok button handller
  function Permission_Ok_handeler() {
    dispatch(AlertShow({ Status: false }));

    if (!AlertData.PermissionAction === false) {
      let DeleteId = AlertData.ID
      dispatch(AlertData.PermissionAction(DeleteId))
    };
  }
  // All alert Cancel Button handler
  function cancel_handeler() {
    tog_standard();
  }

  return (
    <React.Fragment>
      <Modal
        isOpen={AlertData.Status}
        toggle={() => { tog_standard() }}
        scrollable={true}
      // centered={true} // size={"sm"}
      >
        {(AlertData.Type === 1) &&
          <UncontrolledAlert color="success" className="px-6 mb-0 text-center">
            <i className="mdi mdi-check-all d-block display-6 mt-2 mb-3  text-success"></i>
            <p> <h5 className="text-success">{AlertData.Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              onClick={() => {
                Success_Ok_Button_Handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }

        {(AlertData.Type === 2) &&
          <UncontrolledAlert color="danger" className="px-4 mb-0 text-center">
            <i className="mdi mdi-block-helper d-block display-4 mt-2 mb-3  text-danger"></i>
            <p> <h5 className="text-danger">{AlertData.Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(AlertData.Type === 3) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-4 mt-2 mb-3 text-info"></i>
            <p> <h5 className="text-">{AlertData.Message}</h5></p>
            <button
              type="button"
              className="btn btn-primary "
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(AlertData.Type === 4) &&
          <UncontrolledAlert color="warning" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-outline  d-block display-4 mt-2 mb-3 text-warning"></i>
            <p> <h5 className="text-">{AlertData.Message}</h5></p>

            <button
              type="button"
              className="btn btn-primary "
              onClick={() => {
                Ok_handeler()
              }}
            >
              OK
            </button>
          </UncontrolledAlert>
        }
        {(AlertData.Type === 5) &&
          <UncontrolledAlert color="info" className="px-4 mb-0 text-center">
            <i className="mdi mdi-alert-circle-outline d-block display-6 mt-2 mb-3 text-info"></i>
            <p>
              <h5>{AlertData.Message}</h5></p>
            <div className="d-flex flex-wrap gap-2 " style={{ float: "right" }}>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  Permission_Ok_handeler()
                }}
              >
                Yes
              </button>
              <button
                type="button"
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
      </Modal>
    </React.Fragment>
  )
}
export default CostumeAlert