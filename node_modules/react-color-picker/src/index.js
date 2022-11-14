import React, { Component } from 'react'
import assign from 'object-assign'
import { autoBind } from 'react-class'

import HueSpectrum from './HueSpectrum'
import SaturationSpectrum from './SaturationSpectrum'

import { toHsv } from './utils/color'
import toStringValue from './utils/toStringValue'

import DEFAULT_COLOR from './defaultColor'

const emptyFn = () => {}

class ColorPicker extends Component {
  constructor(props) {
    super(props)
    autoBind(this)

    this.state = {
      value: this.props.defaultValue
    }
  }

  prepareClassName(props){
    const className = props.className || ''

    return `${className} cp react-color-picker`
  }

  prepareProps(props){
    props.className = this.prepareClassName(props)

    return props
  }

  render(){
    const props = this.props

    const className = this.prepareClassName(props)
    const hueStyle = assign({}, this.props.hueStyle) || {}

    hueStyle.marginLeft = this.props.hueMargin

    const value = props.value?
      this.toColorValue(this.props.value):
      null

    const defaultValue = !value ?
      this.toColorValue(this.state.value || props.defaultValue || props.defaultColor):
      null

    let { children } = props
    let hueSpectrumProps = null
    let saturationSpectrumProps = null

    if (children) {
      children = React.Children.toArray(children).forEach(child => {
        if (child && child.props) {
          if (child.props.isHueSpectrum) {
            hueSpectrumProps = assign({}, child.props)
          }
          if (child.props.isSaturationSpectrum) {
            saturationSpectrumProps = assign({}, child.props)
          }
        }
      })
    }

    const saturationConfig = assign({
      onDrag: this.handleSaturationDrag,
      onChange: this.handleSaturationChange,
      onMouseDown: this.handleSaturationMouseDown
    }, saturationSpectrumProps)

    if (saturationConfig.width === undefined){
      saturationConfig.width = props.saturationWidth
    }
    if (saturationConfig.height === undefined){
      saturationConfig.height = props.saturationHeight
    }
    saturationConfig.inPicker = true

    const hueConfig = assign({
      onDrag: this.handleHueDrag,
      onChange: this.handleHueChange,
      onMouseDown: this.handleHueMouseDown,
      style: hueStyle
    }, hueSpectrumProps)

    if (hueConfig.width === undefined) {
      hueConfig.width = props.hueWidth
    }
    if (hueConfig.height === undefined) {
      hueConfig.height = props.hueHeight || props.saturationHeight
    }
    hueConfig.inPicker = true

    if (this.state.dragHue){
      ;(value || defaultValue).h = this.state.dragHue
    }

    //both value and defaultValue are objects like: {h,s,v}
    if (value){
      saturationConfig.value = assign({}, value)
      hueConfig.value = assign({}, value)
    } else {
      saturationConfig.defaultValue = assign({}, defaultValue)
      hueConfig.defaultValue = assign({}, defaultValue)
    }

    const divProps = assign({}, props)

    delete divProps.color
    delete divProps.defaultColor
    delete divProps.defaultValue
    delete divProps.hueHeight
    delete divProps.hueMargin
    delete divProps.hueWidth
    delete divProps.saturationHeight
    delete divProps.saturationWidth
    delete divProps.value

    return <div {...divProps} className={className} >
      <SaturationSpectrum {...saturationConfig} />
      <HueSpectrum {...hueConfig} />
    </div>
  }

  toColorValue(value){
    return typeof value == 'string'?
        toHsv(value):
        value
  }

  toStringValue(...args) {
    return toStringValue(...args)
  }

  handleChange(color){
    this.state.dragHue = null

    color = assign({}, color)

    const value = this.toStringValue(color)

    this.props.onChange(value, color)
  }

  handleSaturationChange(color){
    this.handleChange(color)
  }

  handleHueChange(color){
    this.handleChange(color)
  }

  handleHueDrag(hsv) {
    this.setState({
      dragHue: hsv.h
    })

    this.handleDrag(hsv)
  }

  handleSaturationDrag(hsv) {
    this.handleDrag(hsv)
  }

  handleDrag(color) {
    if (!this.props.value) {
      this.setState({
        value: color
      })
    }

    this.props.onDrag(this.toStringValue(color), color)
  }

  handleHueMouseDown(hsv) {
    this.setState({
      dragHue: hsv.h
    })
  }

  handleSaturationMouseDown(hsv){
    this.setState({
      dragHue: hsv.h
    })
  }
}

ColorPicker.defaultProps = {
  onDrag: emptyFn,
  onChange: emptyFn,

  defaultColor: DEFAULT_COLOR,

  hueHeight: null,
  hueMargin: 10,
  hueWidth: 30,

  saturationWidth: 300,
  saturationHeight: 300
}

export {
  HueSpectrum,
  SaturationSpectrum
}

export default ColorPicker