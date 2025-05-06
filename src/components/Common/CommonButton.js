import { Button, Spinner } from "reactstrap"
import { loginUserID } from "./CommonFunction";
import * as mode from "../../routes/PageMode"
import { useEffect, useState } from "react";

export function SaveButton(props) {

  const { pageMode = '', userAcc = {}, editCreatedBy, Button_Name = '' } = props
  const isCreated = (loginUserID() === editCreatedBy)

  if (pageMode === mode.edit) {
    if ((userAcc.RoleAccess_IsEdit) || ((userAcc.RoleAccess_IsEditSelf) && (isCreated))) {
      return <UpdateBtn {...props} />
    }

  }
  else if ((userAcc.RoleAccess_IsSave) && (pageMode === mode.defaultsave
    || pageMode === mode.copy
    || pageMode === mode.modeSTPsave
    || pageMode === mode.modeSTPList
    || pageMode === mode.dropdownAdd
    || pageMode === mode.assingLink)) {
    return <SaveBtn  {...props} />
  }
  return null
}
const SaveBtn = ({ onClick, type = "button", userAcc, loading, forceDisabled, Button_Name = "Save", loadingLable = "Saving.." }) => {
  const { Name } = userAcc;
  const btnId = `Save-${Name.replace(/ /g, "")}`;
  return (
    <div>
      {loading ?
        <button
          id={btnId}
          title={`Save ${Name} Loging...`}
          type={type}
          // style={{ padding: "3px", paddingInline: "5px" }}
          className="btn btn-primary w-md"
        >  {loadingLable} &nbsp;
          <Spinner style={{ height: "13px", width: "13px" }} color="white" />
        </button>

        :
        <button
          type={type}
          id={btnId}
          // style={{ padding: "3px", paddingInline: "5px" }}
          disabled={forceDisabled}
          title={`Save ${Name}`}
          className="btn btn-primary w-md"
          onClick={onClick}
        > <i className="fas fa-save me-2"></i> {Button_Name} &nbsp;
        </button>}
    </div>
  )

}
const UpdateBtn = ({ onClick, userAcc, loading, type = 'button' }) => {
  const { Name } = userAcc;
  const btnId = `Update-${Name.replace(/ /g, "")}`;

  return (
    <div>
      {loading ?
        <button
          id={btnId}
          title={`Updating.. ${Name} `}
          type={type}
          className="btn btn-success w-md"
        >  Updating.. &nbsp;
          <Spinner style={{ height: "13px", width: "13px" }} color="white" />
        </button>
        :
        <button
          type={type}
          id={btnId}
          title={`Update ${Name}`}
          className="btn btn-success w-md"
          onClick={onClick}
        >
          <i class="fas fa-edit me-2"></i>Update
        </button >
      }
    </div>
  )
}

export function Go_Button(props) {


  const { onClick, id, type = "button", loading, forceDisabled, Lable = "Go", iconClass, styles } = props

  return loading ?
    <button
      id={id}
      type={type}
      className="btn btn-success "
      data-mdb-toggle="tooltip"
      data-mdb-placement="top"
      style={styles}
      title={`Go Button Loging...`}
      disabled
    >
      <Spinner style={{ height: "12px", width: "12px" }} color="white" />
    </button>
    :
    <button
      id={id}
      type="button"
      className="btn btn-success "
      data-mdb-toggle="tooltip"
      data-mdb-placement="top"
      title="Go get details"
      style={styles}
      onClick={onClick}
      disabled={forceDisabled}
    >  <i className={iconClass} ></i> {Lable} </button>
}

export function Change_Button(props) {
  const { onClick, id, type = "button", forceDisabled } = props
  return <Button
    id={id}
    disabled={forceDisabled}
    type={type}
    color="btn btn-outline-info border-1 font-size-12 "
    onClick={onClick}>Change</Button>
}

export function C_Button({
  loading,
  color,
  onClick,
  forceDisabled,
  children,
  spinnerColor = "primary",
  ...rest
}) {

  if (loading) {
    return (
      <button
        disabled
        title={`Add Button Loading...`}
        {...rest}
      > {children}..&nbsp;
        <Spinner style={{ height: "12px", width: "12px" }} color={spinnerColor} />
      </button>
    );
  }

  return (
    <button
      disabled={forceDisabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}


export const GotoInvoiceBtn = ({ onClick, userAcc, loading, forceDisabled }) => {
  const { Name } = userAcc;
  const btnId = `gotoInvoiceBtn-${Name.replace(/ /g, "")}`;
  return (
    <div>
      {loading ?
        <button
          id={btnId}
          type="button"
          className="btn btn-info w-md"
        >  Saving.. &nbsp;
          <Spinner style={{ height: "13px", width: "13px" }} color="white" />
        </button>
        :
        <button
          type="button"
          id={btnId}
          disabled={forceDisabled}
          title={` save & goto Invoice ${Name}`}
          className="btn btn-info w-md"
          onClick={onClick}
        >  Go to Invoice
        </button>}
    </div>
  )
}

export const SaveAndDownloadPDF = ({ onClick, pageMode, userAcc, loading, forceDisabled, type = "button" }) => {

  const { Name } = userAcc;
  if ((userAcc.RoleAccess_IsSave) && (pageMode === mode.defaultsave
    || pageMode === mode.copy
    || pageMode === mode.modeSTPsave
    || pageMode === mode.dropdownAdd
    || pageMode === mode.assingLink)) {
    return (
      <div>
        {loading ?
          <button
            type={type}
            className="btn btn-info "
          >Saving.. &nbsp;
            <Spinner style={{ height: "13px", width: "13px" }} color="white" />
          </button>
          :
          <button
            type={type}

            disabled={forceDisabled}
            title={`save & Print`}
            className="btn btn-info"
            onClick={onClick}
          >  Save & Print
          </button>}

      </div>
    )
  }
  return null
}

// 


export function Loader() {// linner component
  return <div className="dot-pulse"> <span> </span>     &nbsp;
    <div className="bounce1" style={{ background: "white" }}></div>
    <div className="bounce2" style={{ background: "white" }}></div>
    <div className="bounce3" style={{ background: "white" }}></div>
  </div>

}

export function Listloader() {// common Listcomponent
  return <div id="api_spinner" >
    <div className="api_spinner_body " >
      <span className="spinner" ></span>
    </div>
  </div>

}

export function Listloader1({ show = false }) {// common Listcomponent
  if (!show) { return null }
  else {
    return <div id="api_spinner" >
      <div className="api_spinner_body " >
        <span className="spinner" style={{ left: "-5cm" }}></span>
      </div>
    </div>
  }
}



export function DashboardLoader() {// linner component
  return <div className="dot-pulse mt-2"> &nbsp; &nbsp;&nbsp;
    <div className="bounce1" ></div>
    <div className="bounce2" ></div>
    <div className="bounce3" ></div>
  </div>

}


export function PageLoadingSpinner({ isLoading }) {

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      if (isLoading && isInitialLoad) {
        document.getElementById('preloader').style.display = 'block';
        setIsInitialLoad(false);
      } else {
        document.getElementById('preloader').style.display = 'none';
      }
    } catch (w) { }
    return () => {
      try {
        document.getElementById('preloader').style.display = 'none';
      } catch (w) { }
    }
  }, [isLoading]);

  return (
    <div className="pace pace-active" id="preloader" >
      <div className="pace-progress" data-progress-text="100%" data-progress="99" style={{ transform: "translate3d(100%, 0px, 0px)", top: 56 }}>
        <div className="pace-progress-inner"></div>
      </div>
    </div>
  );
}



export function Verifiy_Button({
  loading,
  color,
  onClick,
  forceDisabled,
  children,
  spinnerColor = "primary",
  ...rest
}) {

  if (loading) {
    return (
      <button
        disabled
        style={{ padding: "3px", paddingInline: "5px" }}
        title={`Add Button Loading...`}
        {...rest}
      >
        {children}&nbsp;&nbsp;<Spinner style={{ height: "12px", width: "12px" }} color={spinnerColor} />
      </button>
    );
  }

  return (
    <button
      disabled={forceDisabled}
      onClick={onClick}
      style={{ padding: "3px", paddingInline: "5px" }}
      {...rest}
    >
      {children}
    </button>
  );
}

