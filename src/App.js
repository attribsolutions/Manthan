import PropTypes from 'prop-types'
import React from "react"

import { Switch, BrowserRouter as Router, useHistory } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"
import { SessionProvider } from "./routes/middleware/SessionContext"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"
import "./assets/scss/preloader.scss"

const App = props => {
  const history = useHistory();
  const userPageAccess = history.location.state

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <SessionProvider history={history}>
            {authRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                history={history}
                isAuthProtected={false}
                exact
              />
            ))}

            {userRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                userPageAccess={userPageAccess}
                history={history}
                isPartyWisePage={route.isPartyWisePage}
                exact
              />
            ))}
          </SessionProvider>
        </Switch>
      </Router>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)