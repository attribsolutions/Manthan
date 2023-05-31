import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

//redux
import { useSelector, useDispatch } from "react-redux";
import CustomAlert from "../Common/CustomAlert";
import BreadcrumbNew from "../../components/Common/BreadcrumbNew"

import { useHistory } from "react-router-dom";
import "./loader.scss";
import LogoutChecker from "../LogoutChecker/TabSessionAlive";


const Layout = props => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [Count, setCount] = useState(0);



  const {
    isPreloader,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    leftSideBarTheme,
    layoutMode,
    layoutType,
    leftSidebarTypes,
    userAccess,
    pageField,
  } = useSelector(state => ({
    isPreloader: state.Layout.isPreloader,
    leftSideBarType: state.Layout.leftSideBarType,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    layoutMode: state.Layout.layoutMode,
    layoutType: state.Layout.layoutType,
    leftSidebarTypes: state.Layout.leftSidebarTypes,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageFieldList
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  /*
  layout  settings
  */

  useEffect(() => {
    // document.body.addEventListener("click", hideRightbar, true);
    try {
      if (isPreloader === true) {
        document.getElementById("preloader").style.display = "block";

        setTimeout(function () {
          try {
            document.getElementById("preloader").style.display = "none";
          } catch (e) { }
        }, 4000);

      } else {
        try {
          document.getElementById("preloader").style.display = "none";
        } catch (e) { }
      }
    } catch (e) { }
  }, [isPreloader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (Count === 100) {
  //     document.getElementById("preloader").style.display = "none";
  //   }
  // });



  useEffect(() => {
    dispatch(changeLayout("vertical"));

  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (leftSidebarTypes) {
      dispatch(changeSidebarType(leftSidebarTypes));
    }
  }, [leftSidebarTypes, dispatch]);


  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  /*
  call dark/light mode
  */
  const onChangeLayoutMode = (value) => {
    if (changelayoutMode) {
      dispatch(changelayoutMode(value, layoutType));
    }
  };


  return (
    <React.Fragment>

      {/* <div id="overlay" > */}
      {/* <div className="cv-spinner">
          <span className="spinner"></span>
          <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
            Loading...
          </button>
        </div> */}
      {/* </div> */}



      <div className="pace pace-active" id="preloader">
        <div className="pace-progress" data-progress="99" style={{ transform: "translate3d(100%, 0px, 0px)" }}>
        </div>
      </div>

      <div id="layout-wrapper">
        <LogoutChecker />
        <CustomAlert />
        <Header toggleMenuCallback={toggleMenuCallback} onChangeLayoutMode={onChangeLayoutMode} />
        <BreadcrumbNew />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>

    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
  changelayoutMode: PropTypes.func
};


export default Layout;
