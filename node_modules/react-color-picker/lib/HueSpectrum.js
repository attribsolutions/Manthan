'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _region = require('region');

var _region2 = _interopRequireDefault(_region);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _common = require('./utils/common');

var _common2 = _interopRequireDefault(_common);

var _validate = require('./utils/validate');

var _validate2 = _interopRequireDefault(_validate);

var _toStringValue = require('./utils/toStringValue');

var _toStringValue2 = _interopRequireDefault(_toStringValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass((0, _objectAssign2.default)({

  displayName: 'HueSpectrum',

  getDefaultProps: function getDefaultProps() {
    return {
      height: 300,
      width: 30,
      pointerSize: 3,
      defaultColor: require('./defaultColor'),
      isHueSpectrum: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      h: 0
    };
  },
  isComponentMounted: function isComponentMounted() {
    return this.mounted;
  },
  componentDidUpdate: function componentDidUpdate() {
    // this.updateDragPositionIf()
  },
  componentDidMount: function componentDidMount() {
    this.mounted = true;
    this.updateDragPositionIf();
  },
  updateDragPositionIf: function updateDragPositionIf() {
    if (!this.props.height) {
      this.setState({});
    }
  },
  render: function render() {
    this.hsv = this.toColorValue(this.state.value || this.props.value || this.props.defaultValue || this.props.defaultColor);

    if (this.state.h == 360 && !this.hsv.h) {
      //in order to show bottom red as well on drag
      this.hsv.h = 360;
    }

    var style = (0, _objectAssign2.default)({}, this.props.style);

    if (this.props.height) {
      style.height = this.props.height;
    }
    if (this.props.width) {
      style.width = this.props.width;
    }

    var dragStyle = {
      height: this.props.pointerSize
    };

    var dragPos = this.getDragPosition();

    if (dragPos != null) {
      dragStyle.top = dragPos;
      dragStyle.display = 'block';
    }
    return _react2.default.createElement(
      'div',
      { className: 'react-color-picker__hue-spectrum', style: style, onMouseDown: this.onMouseDown },
      _react2.default.createElement(
        'div',
        { className: 'react-color-picker__hue-drag', style: dragStyle },
        _react2.default.createElement('div', { className: 'react-color-picker__hue-inner' })
      )
    );
  },
  getDragPosition: function getDragPosition(hsv) {
    hsv = hsv || this.hsv;

    if (!this.props.height && !this.isComponentMounted()) {
      return null;
    }

    var height = this.props.height || _region2.default.fromDOM(_reactDom2.default.findDOMNode(this)).getHeight();
    var size = this.props.pointerSize;

    var pos = Math.round(hsv.h * height / 360);
    var diff = Math.round(size / 2);

    return pos - diff;
  },
  updateColor: function updateColor(point) {
    point = (0, _validate2.default)(point);

    this.hsv.h = point.y * 360 / point.height;

    if (this.hsv.h != 0) {
      this.state.h = this.hsv.h;
    }

    this.state.h = this.hsv.h != 0 ? this.hsv.h : 0;
  },


  toStringValue: _toStringValue2.default
}, _common2.default));