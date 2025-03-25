

import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
import FeatherIcon from "feather-icons-react";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import MetisMenu from "metismenujs";
import { useHistory, withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { roleAceessActionError } from "../../store/actions";
import { loginUserDetails } from "../Common/CommonFunction";
import * as urlRel from "../../routes/urlRalations";
import { useDispatch, useSelector } from "react-redux";
import { afterloginOneTimeAPI } from "../Common/AfterLoginApiFunc";

const SidebarContent = (props) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const history = useHistory();

  const {
    RoleAccessData,
    RoleAccessUpdateData,
    roleAccesssForSidbarError = false,
  } = useSelector((state) => ({
    RoleAccessData: state.Login.roleAccessSidbarData,
    RoleAccessUpdateData: state.Login.RoleAccessUpdateData,
    roleAccesssForSidbarError: state.Login.roleAccesssForSidbarError,
  }));

  useEffect(async () => {
    if (roleAccesssForSidbarError) {
      dispatch(roleAceessActionError(false))
      history.push({ pathname: '/logout' })
    }
  }, [roleAccesssForSidbarError])

  useEffect(() => {

    if (RoleAccessUpdateData.length <= 0) {
      let user = loginUserDetails()
      if (user) {
        //api call roleAceessAction Api,partysetting Api , Party Dropdown Api and set localstorage roleId ;
        afterloginOneTimeAPI(user, dispatch);// all common function
      };
    }
  }, [])


  const activateParentDropdown = useCallback(item => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu ") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, [RoleAccessUpdateData.length <= 0]);

  useEffect(() => {
    let pathName = props.location.pathname
    let userAcc = RoleAccessUpdateData.find((inx) => {
      const path = inx.ActualPagePath.toLowerCase()
      return (`/${path}` === (pathName.toLowerCase()))
    })
    if (userAcc === undefined) { }
    else if (!userAcc.RoleAccess_IsShowOnMenu) {
      
      pathName = urlRel[`${userAcc.ActualPagePath}`]
    }

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [activateParentDropdown, RoleAccessUpdateData.length <= 0]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled " id="side-menu">
            {RoleAccessData.map((item) => {
              if (item.ModuleName === "Dashboard") {
                let isdashboard = ''
                if (item.ModuleData.length > 0) { isdashboard = item.ModuleData[0] }
                return (
                  <li >
                    <Link to={{ pathname: `/${isdashboard.ActualPagePath}` }}>
                      <FeatherIcon icon={item.ModuleIcon} />
                      <span>{props.t(isdashboard.ModuleName)}</span>
                    </Link>
                  </li >
                )
              }
              else return (
                <li >
                  <Link to="/#" className="has-arrow">
                    <FeatherIcon icon={item.ModuleIcon} />
                    <span>{props.t(item.ModuleName)}</span>
                  </Link>
                  <ul className="sub-menu">
                    {item.ModuleData.map((index, j) => {
                      if (index.RoleAccess_IsShowOnMenu === true) {
                        return (
                          <li>
                            <Link to={{ pathname: `/${index.ActualPagePath}` }}>
                              {props.t(index.Name)}
                            </Link>
                          </li>
                        )
                      }
                    })}
                  </ul>
                </li>
              )
            })}
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
