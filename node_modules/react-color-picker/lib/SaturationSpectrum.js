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

var _color = require('./utils/color');

var _common = require('./utils/common');

var _common2 = _interopRequireDefault(_common);

var _validate = require('./utils/validate');

var _validate2 = _interopRequireDefault(_validate);

var _toStringValue = require('./utils/toStringValue');

var _toStringValue2 = _interopRequireDefault(_toStringValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass((0, _objectAssign2.default)({

    displayName: 'SaturationSpectrum',

    getDefaultProps: function getDefaultProps() {
        return {
            height: 300,
            width: 300,
            pointerSize: 7,
            defaultColor: require('./defaultColor'),
            isSaturationSpectrum: true
        };
    },

    getInitialState: function getInitialState() {
        return {
            pointerTop: null,
            pointerLeft: null
        };
    },

    componentDidUpdate: function componentDidUpdate() {
        // this.updateDragPositionIf()
    },

    componentDidMount: function componentDidMount() {
        this.updateDragPositionIf();
    },

    updateDragPositionIf: function updateDragPositionIf() {
        if (!this.props.height || !this.props.width) {
            this.setState({});
        }
    },

    getDragPosition: function getDragPosition(hsv) {
        hsv = hsv || this.hsv;

        var width = this.props.width;
        var height = this.props.height;
        var sizeDefined = width && height;

        if (!sizeDefined && !this.isMounted()) {
            return null;
        }

        var region;

        if (!sizeDefined) {
            region = _region2.default.fromDOM(_reactDom2.default.findDOMNode(this));
            height = height || region.getHeight();
            width = width || region.getWidth();
        }

        var x = hsv.s * width;
        var y = height - hsv.v * height;
        var size = this.props.pointerSize;
        var diff = Math.floor(size / 2);

        if (this.props.value && this.state.mouseDown && !isNaN(this.state.mouseDown.x)) {
            x = this.state.mouseDown.x;
        }

        return {
            left: x - diff,
            top: y - diff
        };
    },

    prepareBackgroundColor: function prepareBackgroundColor(color) {
        var hsv = color;

        var col = (0, _color.fromRatio)({
            h: hsv.h % 360 / 360,
            s: 1,
            v: 1
        });

        return col.toRgbString();
    },

    prepareProps: function prepareProps(thisProps, state) {
        var props = (0, _objectAssign2.default)({}, thisProps);

        var color = state.value || props.value || props.defaultValue || props.defaultColor;

        props.color = color;

        this.hsv = this.toColorValue(color);

        props.style = this.prepareStyle(props);
        props.className = this.prepareClassName(props);

        return props;
    },

    prepareClassName: function prepareClassName(props) {
        var className = props.className || '';

        className += ' react-color-picker__saturation-spectrum';

        return className;
    },

    prepareStyle: function prepareStyle(props) {
        var style = (0, _objectAssign2.default)({}, props.style);

        if (props.height) {
            style.height = props.height;
        }
        if (props.width) {
            style.width = props.width;
        }

        style.backgroundColor = this.prepareBackgroundColor(this.hsv);

        return style;
    },

    render: function render() {

        var props = this.p = this.prepareProps(this.props, this.state);

        var dragStyle = {
            width: this.props.pointerSize,
            height: this.props.pointerSize
        };

        var dragPos = this.getDragPosition();

        if (dragPos) {
            dragStyle.top = dragPos.top;
            dragStyle.left = dragPos.left;
            dragStyle.display = 'block';
        }

        return _react2.default.createElement(
            'div',
            { className: props.className, style: props.style, onMouseDown: this.onMouseDown },
            _react2.default.createElement(
                'div',
                { className: 'react-color-picker__saturation-white' },
                _react2.default.createElement('div', { className: 'react-color-picker__saturation-black' })
            ),
            _react2.default.createElement(
                'div',
                { className: 'react-color-picker__saturation-drag', style: dragStyle },
                _react2.default.createElement('div', { className: 'react-color-picker__saturation-inner' })
            )
        );
    },

    getSaturationForPoint: function getSaturationForPoint(point) {
        return point.x / point.width;
    },

    getColorValueForPoint: function getColorValueForPoint(point) {
        return (point.height - point.y) / point.height;
    },

    updateColor: function updateColor(point) {
        point = (0, _validate2.default)(point);

        this.hsv.s = this.getSaturationForPoint(point);
        this.hsv.v = this.getColorValueForPoint(point);
    },

    toStringValue: _toStringValue2.default
}, _common2.default));