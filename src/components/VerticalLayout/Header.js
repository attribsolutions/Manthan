import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

//import drawer
import ReactDrawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';

//Import Icons
import FeatherIcon from "feather-icons-react";

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

const Header = props => {
  const { onChangeLayoutMode } = props;
  const [search, setsearch] = useState(false)
  const [isClick, setClick] = useState(true);
  const [position, setPosition] = useState();
  const [open, setOpen] = useState(false);



  const onDrawerClose = () => {
    setOpen(false);
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

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box" >
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm" >
                  <img src={logoSvg} alt="" height="35" />
                </span>
                <span className="logo-lg">
                  <img src={logoSvg} alt="" height="45" /> <span className="logo-txt" style={{ color: 'white' }}>FoodERP 2.0</span>
                </span>
              </Link>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm" >
                  <img src={logoSvg} alt="" height="35" />
                </span>
                <span className="logo-lg">
                  <img src={logoSvg} alt="" height="35" /> <span className="logo-txt">FoodERP 2.0</span>
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


          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              {/* <button type="button" className="btn header-item" id="page-header-search-dropdown"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <FeatherIcon
                  icon="search"
                  className="icon-lg"
                />
              </button> */}
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                aria-labelledby="page-header-search-dropdown">

                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search ..." aria-label="Search Result" />

                      <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify"></i></button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
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
                  <MySearch />
                </div>
                {/* <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form> */}

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
