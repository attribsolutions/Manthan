"use strict";

var skipMethods = {
  'constructor': 1,
  'render': 1,
  'shouldComponentUpdate': 1,
  'componentWillMount': 1,
  'componentDidMount': 1,
  'componentWillReceiveProps': 1,
  'componentWillUpdate': 1,
  'componentDidUpdate': 1,
  'componentWillUnmount': 1
}

function autoBind(object, filter){
  var proto = object.constructor.prototype

  var filterFn = typeof filter == 'function' ?
    filter:
    filter && typeof filter == 'object' ?
      function(key) {
        return !filter[key] && skipMethods[key] !== 1 && typeof proto[key] === 'function'
      }:
      function(key) {
        return skipMethods[key] !== 1 && typeof proto[key] === 'function'
      }

  var names = Object.getOwnPropertyNames(proto).filter(filterFn)

  names.push('setState')
  names.forEach(function(key){
    object[key] = object[key].bind(object)
  })

  return object
}

exports.default = autoBind
module.exports = exports['default']