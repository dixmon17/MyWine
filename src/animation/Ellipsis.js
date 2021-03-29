import React from 'react'
import { Animated, View, Easing } from 'react-native'

class FadeIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bottomOne: new Animated.Value(0),
      bottomTwo: new Animated.Value(0),
      bottomThree: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(
            this.state.bottomOne,
            {
              toValue: 10,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          ),
          Animated.timing(
            this.state.bottomOne,
            {
              toValue: 0,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          )
        ]),
        Animated.sequence([
          Animated.timing(
            this.state.bottomTwo,
            {
              toValue: 9,
              duration: 250,
              delay:100,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          ),
          Animated.timing(
            this.state.bottomTwo,
            {
              toValue: 0,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          )
        ]),
        Animated.sequence([
          Animated.timing(
            this.state.bottomThree,
            {
              toValue: 8,
              duration: 250,
              delay:170,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          ),
          Animated.timing(
            this.state.bottomThree,
            {
              toValue: 0,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.bezier(.42,0,.58,1)
            }
          )
        ]),
      ])
    ).start()
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Animated.Text style={{bottom:this.state.bottomOne,fontSize: 25,color:'white'}}>. </Animated.Text>
        <Animated.Text style={{bottom:this.state.bottomTwo,fontSize: 25,color:'white'}}>. </Animated.Text>
        <Animated.Text style={{bottom:this.state.bottomThree,fontSize: 25,color:'white'}}>.</Animated.Text>
      </View>
    )
  }
}

export default FadeIn
