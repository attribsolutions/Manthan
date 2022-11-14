'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

var _region = require('region');

var _region2 = _interopRequireDefault(_region);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _dragHelper = require('drag-helper');

var _dragHelper2 = _interopRequireDefault(_dragHelper);

var _color = require('./color');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyFn = function emptyFn() {};

var toColorValue = function toColorValue(value) {
  if (typeof value == 'string') {
    return (0, _color.toHsv)(value);
  }

  return {
    h: value.h,
    s: value.s,
    v: value.v,
    a: value.a
  };
};
exports.default = {

  toColorValue: toColorValue,

  getDOMRegion: function getDOMRegion() {
    return _region2.default.fromDOM((0, _reactDom.findDOMNode)(this));
  },
  onMouseDown: function onMouseDown(event) {
    event.preventDefault();

    var region = this.getDOMRegion();
    var info = this.getEventInfo(event, region);

    (0, _dragHelper2.default)(event, {
      scope: this,
      constrainTo: region,
      onDragStart: function onDragStart(event, config) {
        config.initialPoint = info;

        config.minLeft = 0;
        config.maxLeft = region.width;

        this.handleDragStart(event);
      },
      onDrag: function onDrag(event, config) {
        var info = this.getEventInfo(event, region);
        this.updateColor(info);
        this.handleDrag(event, config);
      },
      onDrop: function onDrop(event, config) {
        var info = this.getEventInfo(event, region);
        this.updateColor(info);
        this.handleDrop(event, config);
      }
    });

    this.updateColor(info);
    this.handleMouseDown(event, { initialPoint: info });
  },
  handleMouseDown: function handleMouseDown(event, config) {
    ;(this.props.onMouseDown || emptyFn).apply(this, this.getColors());
    this.handleDrag(event, config);
  },
  handleUpdate: function handleUpdate(event, config) {
    var diff = config.diff || { top: 0, left: 0 };
    var initialPoint = config.initialPoint;

    if (initialPoint) {

      var top = void 0;
      var left = void 0;

      left = initialPoint.x + diff.left;
      top = initialPoint.y + diff.top;

      left = Math.max(left, config.minLeft);
      left = Math.min(left, config.maxLeft);

      this.state.top = top;
      this.state.left = left;

      this.state.mouseDown = {
        x: left,
        y: top,
        width: initialPoint.width,
        height: initialPoint.height
      };
    }

    if (this.props.inPicker) {
      //the picker handles the values
      return;
    }

    if (!this.props.value) {
      this.setState({
        value: this.hsv
      });
    }
  },
  handleDragStart: function handleDragStart(event) {},
  handleDrag: function handleDrag(event, config) {
    this.handleUpdate(event, config);(this.props.onDrag || emptyFn).apply(this, this.getColors());
  },
  handleDrop: function handleDrop(event, config) {
    this.handleUpdate(event, config);
    this.state.mouseDown = false;(this.props.onChange || emptyFn).apply(this, this.getColors());
  },
  getColors: function getColors() {
    var first = this.props.inPicker ? this.hsv : this.toStringValue(this.hsv);

    var args = [first];

    if (!this.props.inPicker) {
      args.push((0, _objectAssign2.default)({}, this.hsv));
    }

    return args;
  },
  getEventInfo: function getEventInfo(event, region) {
    region = region || this.getDOMRegion();

    var x = event.clientX - region.left;
    var y = event.clientY - region.top;

    return {
      x: x,
      y: y,
      width: region.getWidth(),
      height: region.getHeight()
    };
  }
};