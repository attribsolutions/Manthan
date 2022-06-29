import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback, useState } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

//Import images

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roleAceessAction } from "../../store/auth/login/actions";
import { demoRolleAcess } from "./aaaa";
// import { RoleAccessData } from "./APIDEMO";

const SidebarContent = (props) => {
  const ref = useRef();
  const pathName = props.location.pathname;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(roleAceessAction())
    // console.log("test side bar use effect")
  }, [])

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }
  // const  RoleAccessData=demoRolleAcess
  const { RoleAccessData, } = useSelector((state) => ({
    RoleAccessData: state.Login.RoleData,
  }));

const [isActive, setisActive] = useState('')

    // Use ComponentDidMount and ComponentDidUpdate method symultaniously
    useEffect(() => {
      setisActive("active")
    }, [pathName])
    
  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            
            <li>
              <Link to="/dashboard" className="">
                <FeatherIcon icon="home" />
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            {RoleAccessData.map((item) => {
              return (
                <li >
                  <Link to="/#" className="has-arrow">
                    <FeatherIcon icon="grid" />
                    <span>{props.t(item.ModuleName)}</span>    {/* change Module Name */}
                  </Link>
                  <ul className="sub-menu">
                    {item.ModuleData.map((i, j) => {
                      return (
                        <li>
                          <Link to={i.ActualPagePath} class={pathName===i.SelectIcon? "active":""}>{props.t(i.Name)}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
            {/* <li>
              <link href={"/RolesMaster"}>{props.t('Roles Master')}</link>
              <a href="/RolesList">Visit Pluralsight</a>
            </li>
            <li>
              <Link to={'/RolesList'}>{props.t('Roles List')}</Link>
            </li>
            <li>
              <Link to={'/validationTest'}>{props.t('validationTest')}</Link>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
