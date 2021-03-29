import React from 'react'
import { StyleSheet } from 'react-native'
import Androw from 'react-native-androw'

class Shadow extends React.Component {

  render() {
    return (
    <Androw style={[styles.shadow,this.props.style]}>
      {this.props.children}
    </Androw >
    )
  }
}

const styles = StyleSheet.create({
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
})

export default Shadow
