'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SaturationSpectrum = exports.HueSpectrum = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactClass = require('react-class');

var _HueSpectrum = require('./HueSpectrum');

var _HueSpectrum2 = _interopRequireDefault(_HueSpectrum);

var _SaturationSpectrum = require('./SaturationSpectrum');

var _SaturationSpectrum2 = _interopRequireDefault(_SaturationSpectrum);

var _color = require('./utils/color');

var _toStringValue2 = require('./utils/toStringValue');

var _toStringValue3 = _interopRequireDefault(_toStringValue2);

var _defaultColor = require('./defaultColor');

var _defaultColor2 = _interopRequireDefault(_defaultColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var emptyFn = function emptyFn() {};

var ColorPicker = function (_Component) {
  _inherits(ColorPicker, _Component);

  function ColorPicker(props) {
    _classCallCheck(this, ColorPicker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorPicker).call(this, props));

    (0, _reactClass.autoBind)(_this);

    _this.state = {
      value: _this.props.defaultValue
    };
    return _this;
  }

  _createClass(ColorPicker, [{
    key: 'prepareClassName',
    value: function prepareClassName(props) {
      var className = props.className || '';

      return className + ' cp react-color-picker';
    }
  }, {
    key: 'prepareProps',
    value: function prepareProps(props) {
      props.className = this.prepareClassName(props);

      return props;
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      var className = this.prepareClassName(props);
      var hueStyle = (0, _objectAssign2.default)({}, this.props.hueStyle) || {};

      hueStyle.marginLeft = this.props.hueMargin;

      var value = props.value ? this.toColorValue(this.props.value) : null;

      var defaultValue = !value ? this.toColorValue(this.state.value || props.defaultValue || props.defaultColor) : null;

      var children = props.children;

      var hueSpectrumProps = null;
      var saturationSpectrumProps = null;

      if (children) {
        children = _react2.default.Children.toArray(children).forEach(function (child) {
          if (child && child.props) {
            if (child.props.isHueSpectrum) {
              hueSpectrumProps = (0, _objectAssign2.default)({}, child.props);
            }
            if (child.props.isSaturationSpectrum) {
              saturationSpectrumProps = (0, _objectAssign2.default)({}, child.props);
            }
          }
        });
      }

      var saturationConfig = (0, _objectAssign2.default)({
        onDrag: this.handleSaturationDrag,
        onChange: this.handleSaturationChange,
        onMouseDown: this.handleSaturationMouseDown
      }, saturationSpectrumProps);

      if (saturationConfig.width === undefined) {
        saturationConfig.width = props.saturationWidth;
      }
      if (saturationConfig.height === undefined) {
        saturationConfig.height = props.saturationHeight;
      }
      saturationConfig.inPicker = true;

      var hueConfig = (0, _objectAssign2.default)({
        onDrag: this.handleHueDrag,
        onChange: this.handleHueChange,
        onMouseDown: this.handleHueMouseDown,
        style: hueStyle
      }, hueSpectrumProps);

      if (hueConfig.width === undefined) {
        hueConfig.width = props.hueWidth;
      }
      if (hueConfig.height === undefined) {
        hueConfig.height = props.hueHeight || props.saturationHeight;
      }
      hueConfig.inPicker = true;

      if (this.state.dragHue) {
        ;(value || defaultValue).h = this.state.dragHue;
      }

      //both value and defaultValue are objects like: {h,s,v}
      if (value) {
        saturationConfig.value = (0, _objectAssign2.default)({}, value);
        hueConfig.value = (0, _objectAssign2.default)({}, value);
      } else {
        saturationConfig.defaultValue = (0, _objectAssign2.default)({}, defaultValue);
        hueConfig.defaultValue = (0, _objectAssign2.default)({}, defaultValue);
      }

      var divProps = (0, _objectAssign2.default)({}, props);

      delete divProps.color;
      delete divProps.defaultColor;
      delete divProps.defaultValue;
      delete divProps.hueHeight;
      delete divProps.hueMargin;
      delete divProps.hueWidth;
      delete divProps.saturationHeight;
      delete divProps.saturationWidth;
      delete divProps.value;

      return _react2.default.createElement(
        'div',
        _extends({}, divProps, { className: className }),
        _react2.default.createElement(_SaturationSpectrum2.default, saturationConfig),
        _react2.default.createElement(_HueSpectrum2.default, hueConfig)
      );
    }
  }, {
    key: 'toColorValue',
    value: function toColorValue(value) {
      return typeof value == 'string' ? (0, _color.toHsv)(value) : value;
    }
  }, {
    key: 'toStringValue',
    value: function toStringValue() {
      return _toStringValue3.default.apply(undefined, arguments);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(color) {
      this.state.dragHue = null;

      color = (0, _objectAssign2.default)({}, color);

      var value = this.toStringValue(color);

      this.props.onChange(value, color);
    }
  }, {
    key: 'handleSaturationChange',
    value: function handleSaturationChange(color) {
      this.handleChange(color);
    }
  }, {
    key: 'handleHueChange',
    value: function handleHueChange(color) {
      this.handleChange(color);
    }
  }, {
    key: 'handleHueDrag',
    value: function handleHueDrag(hsv) {
      this.setState({
        dragHue: hsv.h
      });

      this.handleDrag(hsv);
    }
  }, {
    key: 'handleSaturationDrag',
    value: function handleSaturationDrag(hsv) {
      this.handleDrag(hsv);
    }
  }, {
    key: 'handleDrag',
    value: function handleDrag(color) {
      if (!this.props.value) {
        this.setState({
          value: color
        });
      }

      this.props.onDrag(this.toStringValue(color), color);
    }
  }, {
    key: 'handleHueMouseDown',
    value: function handleHueMouseDown(hsv) {
      this.setState({
        dragHue: hsv.h
      });
    }
  }, {
    key: 'handleSaturationMouseDown',
    value: function handleSaturationMouseDown(hsv) {
      this.setState({
        dragHue: hsv.h
      });
    }
  }]);

  return ColorPicker;
}(_react.Component);

ColorPicker.defaultProps = {
  onDrag: emptyFn,
  onChange: emptyFn,

  defaultColor: _defaultColor2.default,

  hueHeight: null,
  hueMargin: 10,
  hueWidth: 30,

  saturationWidth: 300,
  saturationHeight: 300
};

exports.HueSpectrum = _HueSpectrum2.default;
exports.SaturationSpectrum = _SaturationSpectrum2.default;
exports.default = ColorPicker;