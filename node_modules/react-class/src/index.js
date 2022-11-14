"use strict";

var React = require('react')
var autoBind = require('../autoBind')

class ReactClass extends React.Component {
  constructor(props){
    super(props)
    autoBind(this)
  }
}

export default ReactClass
export {
  autoBind,
  ReactClass as Component
}