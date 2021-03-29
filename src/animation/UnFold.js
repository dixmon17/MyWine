import React from 'react'
import { Animated, Dimensions } from 'react-native'

class UnFold extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(0),
    }

    this.interpolatedHeight = this.state.scale.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"]
    })
  }

  componentDidMount() {
    Animated.timing(
      this.state.scale,
      {
        toValue: 100,
        duration: 200,
        useNativeDriver: false
      }
    ).start()
  }

  render() {
      return (
        <Animated.View
          style={{ height: this.interpolatedHeight }}>
          {this.props.children}
        </Animated.View>
      )
  }
}

export default UnFold
