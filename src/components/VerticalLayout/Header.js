import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

//import drawer
import ReactDrawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';

//Import Icons

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import RightSidebar from "../CommonForBoth/RightSidebar"
// import LightDark from "../CommonForBoth/Menus/LightDark";

// import images
import logoSvg from "../../assets/images/cbm_logo.png"

//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  changelayoutMode
} from "../../store/actions"
import { MainSearchBox, } from '../Common/SearchBox/index';
import { MySearch } from '../Common/SearchBox/MySearch';
import { IsSweetAndSnacksCompany, loginSystemSetting } from '../Common/CommonFunction';
import { Modal } from 'reactstrap';
import { Notification_Log } from '../../helpers/backend_helper';

const Header = props => {
  const { onChangeLayoutMode } = props;
  const [search, setsearch] = useState(false)
  const [isClick, setClick] = useState(true);
  const [position, setPosition] = useState();
  const [open, setOpen] = useState(false);
  const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not
  const isSweetAndSnacksCompany = IsSweetAndSnacksCompany()

  const onDrawerClose = () => {
    setOpen(false);
  }
  const IsNotificationShow = loginSystemSetting().IsNotificationShow


  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  /*** Sidebar menu icon and default menu set */
  function tToggle() {

    var body = document.body;
    setClick(!isClick);
    if (isClick === true) {
      body.classList.add("sidebar-enable");
      document.body.setAttribute('data-sidebar-size', 'sm');
    } else {
      body.classList.remove("sidebar-enable");
      document.body.setAttribute('data-sidebar-size', 'lg');
    }
  }
  // Check the window width on the first load and set the initial state of isClick
  useEffect(() => {
    function handleResize() {
      setClick(window.innerWidth >= 768); // Set isClick to true if the window width is greater than or equal to 768, otherwise set it to false
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Call it on the first load

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleClick = async () => {
    const SelectedPartyID = JSON.parse(localStorage.getItem("selectedParty")).value
    const jsonBody =
    {
      "PartyID": SelectedPartyID,
      "TransactionID": 0,
      "FromDate": "",
      "ToDate": "",
      "CustomerID": 0

    }
    setmodal_backdrop(true);
    await Notification_Log({ jsonBody });
  };

  return (
    <React.Fragment>
      <header id="page-topbar">
        <Modal
          isOpen={modal_backdrop}
          toggle={() => {
            tog_backdrop()
          }}
          style={{ width: "800px", height: "800px", borderRadius: "50%" }}
          className="modal-dialog-centered"
        >
          <div className="modal-content">
            <div className="modal-body">
              <p style={{ fontSize: "15px", color: "black" }}>
                <h5> All FoodERP users</h5>

                Following are the changes in FoodERP in view of commencement of new financial year (2025-26) on 1st April 2025.<br /><br />
                1 - On 31st March 2025 after completion of all work or if updating stock on 1st April 2025 select date 31st March 2025 to update closing stock. (Billing will not be possible on 1st April 2025 without stock update)<br /><br />
                2 - After the stock update dated 31st March 2025 no old transactions can be changed.<br /><br />
                2 - After the stock update dated 31st March 20245  old transactions cannot be changed.<br /><br />
                3 - All transaction document numbers will start from 001. (Eg Bill Number, Credit Note Number…. )<br /><br />
              </p>
            </div>

          </div>
        </Modal>



        <div className="navbar-header">

          <div className="d-flex">
            <div className="navbar-brand-box" >
              <div style={{ cursor: "context-menu" }} className="logo logo-dark">
                <span className="logo-sm" >
                  <img src={logoSvg} alt="" height="40" style={{ height: "56px" }} />
                </span>
                <span className="logo-lg">
                  <img src={logoSvg} alt="" height="40" style={{ height: isSweetAndSnacksCompany ? "46" : "56px", borderRadius: "8px" }} /> <span className="logo-txt" style={{ color: 'white' }}>FoodERP 2.0</span>
                </span>
              </div>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm" >
                  <img src={logoSvg} alt="" height="35" style={{ height: isSweetAndSnacksCompany ? "46" : "56px", borderRadius: "8px" }} />
                </span>
                <span className="logo-lg">
                  <img src={logoSvg} alt="" height="35" style={{ height: isSweetAndSnacksCompany ? "46" : "56px", borderRadius: "8px" }} /> <span className="logo-txt">FoodERP 2.0</span>
                </span>
              </Link>
            </div>
            <div>
              <button
                onClick={() => {

                  tToggle()
                }}
                type="button" className="btn btn-sm  font-size-16 header-item" id="vertical-menu-btn">
                <i className="fa fa-fw fa-bars"></i>
              </button>
            </div>
            <MainSearchBox />

          </div>
          {/* 
          {IsNotificationShow !== "null" ? <div style={{ fontWeight: "bold", cursor: "pointer" }} >
            <h3 style={{ color: "red" }} onClick={handleClick} class="text-red blink-soft">Important Notification! Click here</h3>
          </div> : null} */}


          {IsNotificationShow === "true" ? <div style={{ fontWeight: "bold", cursor: "pointer" }} >
            <h3 style={{ color: "red" }} onClick={handleClick} class="text-red blink-soft">Important Notification! Click here</h3>
          </div> : null}


          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search)
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <div className=" d-flex position-relative">
                  <MySearch isButton={true} />
                </div>

              </div>
            </div>

            <NotificationDropdown />
            <ProfileMenu />

          </div>


        </div>
      </header>
      <ReactDrawer
        open={open}
        position={position}
        onClose={onDrawerClose}
      >
        <RightSidebar onClose={onDrawerClose} onChangeLayoutMode={onChangeLayoutMode} />
      </ReactDrawer>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  changelayoutMode: PropTypes.func,
  layoutMode: PropTypes.any,
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
    layoutMode
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType, layoutMode }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  changelayoutMode,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
