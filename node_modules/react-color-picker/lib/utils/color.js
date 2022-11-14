'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPure = exports.toHsv = exports.toColor = exports.toAlpha = exports.fromRatio = undefined;

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toColor(color) {
  return (0, _tinycolor2.default)(color);
}

function toPure(color) {
  var h = toColor(color).toHsl().h;

  return toColor({ h: h, s: 100, l: 50, a: 1 });
}

function fromRatio(color) {
  return _tinycolor2.default.fromRatio(color);
}

function toAlpha(color, alpha) {
  if (alpha > 1) {
    alpha = alpha / 100;
  }

  color = toColor(color).toRgb();
  color.a = alpha;

  return toColor(color);
}

function toHsv(color) {
  return toColor(color).toHsv();
}

exports.default = {
  fromRatio: fromRatio,
  toAlpha: toAlpha,
  toColor: toColor,
  toHsv: toHsv,
  toPure: toPure
};
exports.fromRatio = fromRatio;
exports.toAlpha = toAlpha;
exports.toColor = toColor;
exports.toHsv = toHsv;
exports.toPure = toPure;