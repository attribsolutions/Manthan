import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";
import ChangeCommonParty from "./chnageParty/changeCommonParty";
import { useRealTimeToLocalStorage } from "../Common/RealTimeDate";

const Sidebar = props => {
  useRealTimeToLocalStorage();
  return (
    <React.Fragment>
      <div className="vertical-menu" >
        <ChangeCommonParty {...props} />
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
