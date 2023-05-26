import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"

import { logoutReset, logoutUser } from "../../store/actions"

//redux
import { useDispatch } from "react-redux"

const Logout = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(logoutUser(props.history))
    dispatch(logoutReset())
  }, [dispatch, props.history])


  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
