import React from 'react'
import { Animated } from 'react-native'

class EnLargeLogo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      size: new Animated.Value(this._getSize()),
      height: new Animated.Value(this._getSize()*0.253),
    }
  }

  _getSize() {
    if (this.props.shouldEnlarge) {
      return 300
    }
    return 280
  }

  componentDidUpdate() {
    Animated.spring(
      this.state.size,
      {
        toValue: this._getSize(),
        speed:8,
        bounciness:12,
        useNativeDriver: false
      }
    ).start()
  }

  render() {
      return (
        <Animated.View
          style={{ width: this.state.size, height: this.state.height, justifyContent: 'center',alignItems: 'center', backgroundColor: 'blue'}}>
          {this.props.children}
        </Animated.View>
      )
  }
}

export default EnLargeLogo
