'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _color = require('./color');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (color) {
  color = (0, _color.toColor)((0, _objectAssign2.default)({}, color));

  return color.toRgb().a == 1 ? color.toHexString() : color.toRgbString();
};