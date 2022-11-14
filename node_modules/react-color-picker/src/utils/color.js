import tinycolor from 'tinycolor2'

function toColor(color){
  return tinycolor(color)
}

function toPure(color){
  const h = toColor(color).toHsl().h

  return toColor({ h, s: 100, l: 50, a: 1})
}

function fromRatio(color){
  return tinycolor.fromRatio(color)
}

function toAlpha(color, alpha){
  if (alpha > 1){
    alpha = alpha/100
  }

  color = toColor(color).toRgb()
  color.a = alpha

  return toColor(color)
}

function toHsv(color){
  return toColor(color).toHsv()
}

export default {
  fromRatio,
  toAlpha,
  toColor,
  toHsv,
  toPure
}

export {
  fromRatio,
  toAlpha,
  toColor,
  toHsv,
  toPure
}