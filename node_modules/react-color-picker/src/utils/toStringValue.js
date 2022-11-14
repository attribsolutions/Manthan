import assign from 'object-assign'
import { toColor } from './color'

export default (color) => {
  color = toColor(assign({}, color))

  return color.toRgb().a == 1 ?
    color.toHexString() :
    color.toRgbString()
}