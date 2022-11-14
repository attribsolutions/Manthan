'use strict'

import React     from 'react'
import ReactDOM  from 'react-dom'
import Region    from 'region'
import assign    from 'object-assign'
import { fromRatio } from './utils/color'
import common    from './utils/common'

import VALIDATE from './utils/validate'
import toStringValue from './utils/toStringValue'

export default React.createClass(assign({

    displayName: 'SaturationSpectrum',

    getDefaultProps: function(){
      return {
        height      : 300,
        width       : 300,
        pointerSize : 7,
        defaultColor: require('./defaultColor'),
        isSaturationSpectrum: true
      }
    },

    getInitialState: function(){
        return {
            pointerTop  : null,
            pointerLeft : null
        }
    },

    componentDidUpdate: function(){
        // this.updateDragPositionIf()
    },

    componentDidMount: function(){
        this.updateDragPositionIf()
    },

    updateDragPositionIf: function(){
        if (!this.props.height || !this.props.width){
            this.setState({})
        }
    },

    getDragPosition: function(hsv){
        hsv = hsv || this.hsv

        var width  = this.props.width
        var height = this.props.height
        var sizeDefined = width && height

        if (!sizeDefined && !this.isMounted()){
            return null
        }

        var region

        if (!sizeDefined){
            region = Region.fromDOM(ReactDOM.findDOMNode(this))
            height = height || region.getHeight()
            width  = width  || region.getWidth()
        }

        var x    = hsv.s * width
        var y    = height - (hsv.v * height)
        var size = this.props.pointerSize
        var diff = Math.floor(size/2)

        if (this.props.value && this.state.mouseDown && !isNaN(this.state.mouseDown.x)){
            x = this.state.mouseDown.x
        }

        return {
            left: x - diff,
            top : y - diff
        }
    },

    prepareBackgroundColor: function(color){
        var hsv = color

        var col = fromRatio({
            h: (hsv.h % 360) / 360,
            s: 1,
            v: 1
        })

        return col.toRgbString()
    },

    prepareProps: function(thisProps, state) {
        var props = assign({}, thisProps)

        var color = state.value || props.value || props.defaultValue || props.defaultColor

        props.color = color

        this.hsv = this.toColorValue(color)

        props.style     = this.prepareStyle(props)
        props.className = this.prepareClassName(props)

        return props
    },

    prepareClassName: function(props) {
        var className = props.className || ''

        className += ' react-color-picker__saturation-spectrum'

        return className
    },

    prepareStyle: function(props) {
        var style = assign({}, props.style)

        if (props.height){
            style.height = props.height
        }
        if (props.width){
            style.width = props.width
        }

        style.backgroundColor = this.prepareBackgroundColor(this.hsv)

        return style
    },

    render: function(){

        var props = this.p = this.prepareProps(this.props, this.state)

        var dragStyle = {
            width : this.props.pointerSize,
            height: this.props.pointerSize
        }

        var dragPos = this.getDragPosition()

        if (dragPos){
            dragStyle.top     = dragPos.top
            dragStyle.left    = dragPos.left
            dragStyle.display = 'block'
        }

        return (
            <div className={props.className} style={props.style} onMouseDown={this.onMouseDown}>
                <div className='react-color-picker__saturation-white'>
                    <div className='react-color-picker__saturation-black' />
                </div>
                <div className="react-color-picker__saturation-drag" style={dragStyle}>
                    <div className="react-color-picker__saturation-inner" />
                </div>
            </div>
        )
    },

    getSaturationForPoint: function(point){
        return point.x / point.width
    },

    getColorValueForPoint: function(point){
        return (point.height - point.y) / point.height
    },

    updateColor: function(point){
        point = VALIDATE(point)

        this.hsv.s = this.getSaturationForPoint(point)
        this.hsv.v = this.getColorValueForPoint(point)
    },

    toStringValue
}, common))
