import React from 'react'
import { Animated, Dimensions } from 'react-native'

class EnLarge extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(0),
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.scale,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }
    ).start()
  }

  render() {
      return (
        <Animated.View
          style={{ transform:[{ scaleX: this.state.scale },{scaleY: this.state.scale}] }}>
          {this.props.children}
        </Animated.View>
      )
  }
}

export default EnLarge
