import React, {Component} from 'react'

import {LinearGradient, Line, Text, Defs, Stop} from 'react-native-svg'

class AbstractChart extends Component {
  calcScaler = data => {
    if (this.props.fromZero) {
      return Math.max(...data, 0) - Math.min(...data, 0) || 1
    } else {
      return Math.max(...data) - Math.min(...data) || 1
    }
  }

  calcBaseHeight = (data, height) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    if (min >= 0 && max >= 0) {
      return height
    } else if (min < 0 && max <= 0) {
      return 0
    } else if (min < 0 && max > 0) {
      return height * max / this.calcScaler(data)
    }
  }

  calcHeight = (val, data, height) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    if (min < 0 && max > 0) {
       return height * (val / this.calcScaler(data))
    } else if (min >= 0 && max >= 0) {
      return this.props.fromZero ?
        height * (val / this.calcScaler(data)) :
        height * ((val - min) / this.calcScaler(data))
    } else if (min < 0 && max <= 0) {
      return this.props.fromZero ?
        height * (val / this.calcScaler(data)) :
        height * ((val - max) / this.calcScaler(data))
    }
  }

  renderHorizontalLines = config => {
    const {count, width, height, paddingTop, paddingRight} = config
    return [...new Array(count)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={(height / 4) * i + paddingTop}
          x2={width}
          y2={(height / 4) * i + paddingTop}
          stroke={this.props.chartConfig.color(0.2)}
          strokeDasharray="5, 10"
          strokeWidth={1}
        />
      )
    })
  }

  renderHorizontalLine = config => {
    const {width, height, paddingTop, paddingRight} = config
    return (
      <Line
        key={Math.random()}
        x1={paddingRight}
        y1={height - height / 4 + paddingTop}
        x2={width}
        y2={height - height / 4 + paddingTop}
        stroke={this.props.chartConfig.color(0.2)}
        strokeDasharray="5, 10"
        strokeWidth={1}
      />
    )
  }

  renderHorizontalLabels = config => {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      yLabelsOffset = 12
    } = config
    const decimalPlaces = this.props.chartConfig.decimalPlaces === undefined ? 2 : this.props.chartConfig.decimalPlaces
    const yAxisLabel = this.props.yAxisLabel || ''

    return [...new Array(count)].map((_, i) => {
      let yLabel

      if (count === 1) {
        yLabel = `${yAxisLabel}${data[0].toFixed(decimalPlaces)}`
      } else {
        const label = this.props.fromZero ?
          (this.calcScaler(data) / (count - 1)) * i + Math.min(...data, 0) :
          (this.calcScaler(data) / (count - 1)) * i + Math.min(...data)
        yLabel = `${yAxisLabel}${label.toFixed(decimalPlaces)}`
      }

      return (
        <Text
          key={Math.random()}
          x={paddingRight - yLabelsOffset}
          textAnchor="end"
          y={(height * 3) / 4 - ((height - paddingTop) / count) * i + 12}
          fontSize={12}
          fill={this.props.chartConfig.color(0.5)}
        >
          {yLabel}
        </Text>
      )
    })
  }

  renderVerticalLabels = config => {
    const {
      labels = [],
      width,
      height,
      paddingRight,
      paddingTop,
      horizontalOffset = 0,
      stackedBar = false
    } = config
    const fontSize = 12
    let fac = 1
    if (stackedBar) {
      fac = 0.71
    }

    return labels.map((label, i) => {
      return (
        <Text
          key={Math.random()}
          x={
            (((width - paddingRight) / labels.length) * i +
              paddingRight +
              horizontalOffset) *
            fac
          }
          y={(height * 3) / 4 + paddingTop + fontSize * 2}
          fontSize={fontSize}
          fill={this.props.chartConfig.color(0.5)}
          textAnchor="middle"
        >
          {label}
        </Text>
      )
    })
  }

  renderVerticalLines = config => {
    const {data, width, height, paddingTop, paddingRight} = config
    return [...new Array(data.length)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight
          )}
          y1={0}
          x2={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight
          )}
          y2={height - height / 4 + paddingTop}
          stroke={this.props.chartConfig.color(0.2)}
          strokeDasharray="5, 10"
          strokeWidth={1}
        />
      )
    })
  }

  renderVerticalLine = config => {
    const {height, paddingTop, paddingRight} = config
    return (
      <Line
        key={Math.random()}
        x1={Math.floor(paddingRight)}
        y1={0}
        x2={Math.floor(paddingRight)}
        y2={height - height / 4 + paddingTop}
        stroke={this.props.chartConfig.color(0.2)}
        strokeDasharray="5, 10"
        strokeWidth={1}
      />
    )
  }

  renderDefs = config => {
    const {width, height, backgroundGradientFrom, backgroundGradientTo} = config
    return (
      <Defs>
        <LinearGradient
          id="backgroundGradient"
          x1="0"
          y1={height}
          x2={width}
          y2={0}
        >
          <Stop offset="0" stopColor={backgroundGradientFrom} stopOpacity="0" />
          <Stop offset="1" stopColor={backgroundGradientTo} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="fillShadowGradient"
          x1={0}
          y1={0}
          x2={0}
          y2={height}
        >
          <Stop
            offset="0"
            stopColor={this.props.chartConfig.color()}
            stopOpacity="0.1"
          />
          <Stop
            offset="1"
            stopColor={this.props.chartConfig.color()}
            stopOpacity="0"
          />
        </LinearGradient>
      </Defs>
    )
  }
}

export default AbstractChart
