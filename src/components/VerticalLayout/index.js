import PropTypes from "prop-types";
import React, { useEffect } from "react";
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
import BreadcrumbNew from "./BreadcrumbNew"
import "./loader.scss";
import './_layout.scss';
import { useState } from "react";
import { useRef } from "react";
import PageDetailsSection from "./PageDetailsSection";

const Layout = props => {
  const dispatch = useDispatch();

  const {
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    leftSideBarTheme,
    layoutMode,
    layoutType,
    leftSidebarTypes,
  } = useSelector(state => ({
    isPreloader: state.Layout.isPreloader,
    leftSideBarType: state.Layout.leftSideBarType,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    layoutMode: state.Layout.layoutMode,
    layoutType: state.Layout.layoutType,
    leftSidebarTypes: state.Layout.leftSidebarTypes,
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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


  const customPageWrapperRef = useRef(null);
  const sidebarRef = useRef(null);
  const detailedDivRef = useRef(null);
  const isCustomPageWrapperVisibleRef = useRef(false);

  let previousScrollPos = window.scrollY;

  const handleScroll = () => {
    const customPageWrapper = customPageWrapperRef.current;
    const sidebar = sidebarRef.current;
    const detailedDiv = detailedDivRef.current;
    const currentScrollPos = customPageWrapper.scrollTop;

    // Adjust display based on scroll position
    if (currentScrollPos > 100 && currentScrollPos > previousScrollPos) {
      // Scrolling down more than 50 pixels
      sidebar.style.display = 'none';
      detailedDiv.style.display = 'block';
    } else {
      // Scrolling up or custom-page-wrapper not visible
      sidebar.style.display = 'block';
      detailedDiv.style.display = 'none';
    }

    previousScrollPos = currentScrollPos;
  };





  return (
    <div>

      <div id="layout-wrapper1">
        <Header toggleMenuCallback={toggleMenuCallback} onChangeLayoutMode={onChangeLayoutMode} />

        <div ref={customPageWrapperRef} className="custom-page-wrapper" onScroll={handleScroll}>
          <BreadcrumbNew />
          <div className="custom-page-content">
            {props.children}

          </div>
        </div>

        <div ref={sidebarRef} className="sidebar-wrapper" >
          <Sidebar
            theme={leftSideBarTheme}
            type={leftSideBarType}
            isMobile={isMobile}
          />
        </div>

        <div ref={detailedDivRef} style={{ display: "none" }} >
          <div className="vertical-menu" >
            <div data-simplebar >
              <div id="sidebar-menu" className="detailed-div" >

                <PageDetailsSection />


              </div>
            </div>
          </div>
        </div>

        {/* Transparent scrollable element */}
        {/* <div  style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}></div> */}
      </div>

    </div>
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

